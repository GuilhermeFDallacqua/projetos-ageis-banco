"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  ClipboardPlus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Hourglass,
  RotateCcw,
} from "lucide-react";

import PageLayout from "@/components/PageLayout/pageLayout";
import ConfirmDialog from "@/components/ConfirmDialog/confirmDialog";
import RejectDialog from "@/components/RejectDialog/rejectDialog";
import StatusBadge from "@/components/StatusBadge/statusBadge";
import { SkeletonBlock, ErrorState, Spinner } from "@/components/States/states";
import { useAsync } from "@/hooks/useAsync";
import { useToast } from "@/contexts/ToastContext";
import { trialService } from "@/services/trialService";
import { userService } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";
import {
  formatCPF,
  formatPhone,
  formatSUS,
  formatDate,
  formatMonthYear,
  formatZone,
  formatTrialCode,
  getInitials,
  getAge,
  sortByNewest,
} from "@/utils/format";
import {
  TIPOS_PARTO,
  LOCAIS_COLETA,
  RESULTADOS_EXAME,
} from "@/app/Triagem/form";

const simNao = (value) => (value ? "Sim" : "Não");

const simNaoOuVazio = (value) =>
  value === null || value === undefined ? "—" : simNao(value);

const labelDe = (lista, value) =>
  lista.find((item) => item.value === value)?.label || "—";

const EXAMES = [
  ["hiv_result", "HIV"],
  ["syphilis_result", "Sífilis (VDRL)"],
  ["hepatitis_b_result", "Hepatite B"],
  ["hepatitis_c_result", "Hepatite C"],
  ["htlv_result", "HTLV"],
];

// Considera "recente" o que ocorreu nos últimos 12 meses
function isRecent(date) {
  if (!date) return false;

  const limit = new Date();
  limit.setFullYear(limit.getFullYear() - 1);

  return new Date(date) >= limit;
}

// Pontos que merecem atenção da equipe na triagem
function getAttentionPoints(trial) {
  const points = [];

  if (trial.smoker) points.push("Doadora fumante");
  if (trial.alcohol_consumer) points.push("Consome bebida alcoólica");
  if (trial.uses_medication) points.push(`Usa medicamento: ${trial.uses_medication}`);
  if (trial.has_blood_transfusion && isRecent(trial.transfusion_date)) {
    points.push("Transfusão de sangue nos últimos 12 meses");
  }
  if (trial.has_tattoo && isRecent(trial.tattoo_date)) {
    points.push("Tatuagem nos últimos 12 meses");
  }

  for (const [field, label] of EXAMES) {
    if (trial[field] === "POSITIVO") points.push(`Sorologia positiva: ${label}`);
  }

  return points;
}

export default function DoadoraPage() {
  const { id } = useParams();
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [evaluating, setEvaluating] = useState(null);

  // Carrega a triagem e as demais triagens da mesma doadora (mesmo CPF)
  const loadData = useCallback(async () => {
    const [trial, all, users] = await Promise.all([
      trialService.getById(id),
      trialService.getAll(),
      // Só para mostrar o nome de quem avaliou; se falhar, segue sem
      userService.getAll().catch(() => []),
    ]);

    const history = sortByNewest(
      all.filter((item) => trial.cpf && item.cpf === trial.cpf)
    );

    return { trial, users, history: history.length ? history : [trial] };
  }, [id]);

  const { data, loading, error, reload, setData } = useAsync(loadData);

  async function handleEvaluate(status, rejectionReason) {
    setEvaluating(status);

    try {
      const result = await trialService.evaluate(id, {
        status,
        rejectionReason,
        evaluatedBy: user.id,
      });

      // Atualiza a tela sem recarregar
      const changes = result || {
        status,
        rejection_reason: status === "recusada" ? rejectionReason : null,
        evaluated_by: status === "pendente" ? null : user.id,
        evaluated_at: status === "pendente" ? null : new Date().toISOString(),
      };

      setData((prev) => ({
        ...prev,
        trial: { ...prev.trial, ...changes },
        history: prev.history.map((item) =>
          String(item.id) === String(id) ? { ...item, ...changes } : item
        ),
      }));

      setRejectOpen(false);
      toast.success(
        status === "aprovada"
          ? "Triagem aprovada."
          : status === "recusada"
            ? "Triagem recusada."
            : "Triagem voltou para avaliação."
      );
    } catch (err) {
      toast.error(err.message);
    } finally {
      setEvaluating(null);
    }
  }

  async function handleDelete() {
    setDeleting(true);

    try {
      await trialService.remove(id);
      toast.success("Triagem excluída.");
      router.push("/Doadoras");
    } catch (err) {
      toast.error(err.message);
      setDeleting(false);
    }
  }

  return (
    <PageLayout>

      <Link
        href="/Doadoras"
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-500 transition hover:gap-3 hover:text-blue-700"
      >
        <ArrowLeft size={16} />
        Voltar para doadoras
      </Link>

      {error ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ErrorState message={error} onRetry={reload} />
        </div>
      ) : loading ? (
        <DetailSkeleton />
      ) : (
        <Detail
          trial={data.trial}
          history={data.history}
          users={data.users}
          evaluating={evaluating}
          onApprove={() => handleEvaluate("aprovada")}
          onReject={() => setRejectOpen(true)}
          onReopen={() => handleEvaluate("pendente")}
          onDelete={() => setConfirmOpen(true)}
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Excluir triagem?"
        message={
          data &&
          `A triagem ${formatTrialCode(data.trial.id)} de ${data.trial.full_name} será excluída. Essa ação não pode ser desfeita.`
        }
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <RejectDialog
        key={rejectOpen ? "aberto" : "fechado"}
        open={rejectOpen}
        donorName={data?.trial.full_name}
        loading={evaluating === "recusada"}
        onConfirm={(reason) => handleEvaluate("recusada", reason)}
        onCancel={() => setRejectOpen(false)}
      />

    </PageLayout>
  );
}

function Detail({
  trial,
  history,
  users,
  evaluating,
  onApprove,
  onReject,
  onReopen,
  onDelete,
}) {
  const age = getAge(trial.birth_date);
  const attention = getAttentionPoints(trial);

  const sections = [
    {
      title: "Identificação",
      items: [
        ["Nome completo", trial.full_name],
        ["CPF", formatCPF(trial.cpf)],
        ["Cartão SUS", formatSUS(trial.sus_number)],
        [
          "Data de nascimento",
          age !== null ? `${formatDate(trial.birth_date)} (${age} anos)` : "—",
        ],
        ["Telefone", formatPhone(trial.telephone_number)],
        ["Zona", formatZone(trial.zone)],
        ["Endereço", trial.address || "—"],
      ],
    },
    {
      title: "Saúde e hábitos",
      items: [
        [
          "Transfusão de sangue",
          trial.has_blood_transfusion
            ? `Sim (${formatMonthYear(trial.transfusion_date)})`
            : "Não",
        ],
        [
          "Tatuagem",
          trial.has_tattoo
            ? `Sim (${formatMonthYear(trial.tattoo_date)})`
            : "Não",
        ],
        ["Fumante", simNao(trial.smoker)],
        ["Bebida alcoólica", simNao(trial.alcohol_consumer)],
        ["Medicamento", trial.uses_medication || "Não"],
      ],
    },
    {
      title: "Vacinação",
      items: [
        ["Febre amarela", simNao(trial.has_yellow_fever_vaccine)],
        ["dTpa", simNao(trial.has_dtpa_vaccine)],
      ],
    },
  ];

  // Etapas 3 a 5: exibidas quando as colunas existem no banco
  if ("delivery_date" in trial) {
    sections.push(
      {
        title: "Gestação e bebê",
        items: [
          ["Data do parto", formatDate(trial.delivery_date)],
          [
            "Idade gestacional",
            trial.gestational_weeks ? `${trial.gestational_weeks} semanas` : "—",
          ],
          ["Tipo de parto", labelDe(TIPOS_PARTO, trial.delivery_type)],
          ["Pré-natal", simNaoOuVazio(trial.had_prenatal)],
        ],
      },
      {
        title: "Coleta e armazenamento",
        items: [
          ["Local da coleta", labelDe(LOCAIS_COLETA, trial.collection_place)],
          ["Freezer", simNaoOuVazio(trial.has_freezer)],
          ["Frascos de vidro", simNaoOuVazio(trial.has_glass_jars)],
          ["Orientação de higiene", simNaoOuVazio(trial.received_hygiene_guidance)],
        ],
      },
      {
        title: "Sorologia",
        items: EXAMES.map(([field, label]) => [
          label,
          labelDe(RESULTADOS_EXAME, trial[field]),
        ]),
      }
    );
  }

  return (
    <>
      {/* Cabeçalho */}
      <section className="animate-fade-up mb-8 mt-5 flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-lg font-bold text-blue-600">
            {getInitials(trial.full_name)}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                {trial.full_name}
              </h1>

              <StatusBadge status={trial.status} />
            </div>

            <p className="mt-1 text-slate-500">
              {formatTrialCode(trial.id)}
              {trial.created_at && ` · Triagem em ${formatDate(trial.created_at)}`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onDelete}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 transition duration-200 hover:-translate-y-0.5 hover:bg-red-50 active:translate-y-0 active:scale-[0.98]"
          >
            <Trash2 size={16} />
            Excluir
          </button>

          <Link
            href={`/Triagem?editar=${trial.id}`}
            className="flex items-center gap-2 rounded-lg border border-blue-500 px-4 py-2.5 text-sm font-semibold text-blue-500 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50 active:translate-y-0 active:scale-[0.98]"
          >
            <Pencil size={16} />
            Editar
          </Link>

          <Link
            href={`/Triagem?doadora=${trial.id}`}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
          >
            <ClipboardPlus size={16} />
            Nova triagem
          </Link>
        </div>
      </section>


      {/* Avaliação */}
      <Evaluation
        trial={trial}
        users={users}
        evaluating={evaluating}
        onApprove={onApprove}
        onReject={onReject}
        onReopen={onReopen}
      />


      {/* Pontos de atenção */}
      <section
        className={`animate-fade-up mb-6 flex items-start gap-4 rounded-2xl border p-6 ${
          attention.length
            ? "border-orange-200 bg-orange-50"
            : "border-green-200 bg-green-50"
        }`}
        style={{ "--i": 2 }}
      >
        {attention.length ? (
          <AlertTriangle size={22} className="mt-0.5 shrink-0 text-orange-500" />
        ) : (
          <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-green-500" />
        )}

        <div>
          <p className={`font-semibold ${attention.length ? "text-orange-700" : "text-green-700"}`}>
            {attention.length
              ? "Pontos de atenção na triagem"
              : "Nenhum ponto de atenção identificado"}
          </p>

          {attention.length > 0 && (
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-orange-700">
              {attention.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          )}
        </div>
      </section>


      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        <div className="space-y-6 xl:col-span-2">
          {sections.map((section, index) => (

            <section
              key={section.title}
              className="animate-fade-up rounded-2xl border border-slate-200 bg-white shadow-sm"
              style={{ "--i": index + 2 }}
            >
              <div className="border-b border-slate-200 px-7 py-5">
                <h2 className="text-lg font-semibold text-slate-800">
                  {section.title}
                </h2>
              </div>

              <dl className="grid grid-cols-1 gap-6 px-7 py-6 sm:grid-cols-2">
                {section.items.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {label}
                    </dt>

                    <dd className="mt-1 break-words text-sm font-medium text-slate-700">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

          ))}
        </div>


        {/* Histórico da doadora */}
        <section
          className="animate-fade-up h-fit rounded-2xl border border-slate-200 bg-white shadow-sm"
          style={{ "--i": 3 }}
        >
          <div className="border-b border-slate-200 px-7 py-5">
            <h2 className="text-lg font-semibold text-slate-800">
              Triagens da doadora
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {history.length} triagem(ns) registrada(s)
            </p>
          </div>

          <ol className="relative px-7 py-6">
            {history.map((item, index) => {
              const current = String(item.id) === String(trial.id);

              return (
                <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {index < history.length - 1 && (
                    <span className="absolute left-[7px] top-5 h-full w-0.5 bg-slate-100" />
                  )}

                  <span
                    className={`relative mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
                      current
                        ? "border-blue-500 bg-blue-500"
                        : "border-slate-300 bg-white"
                    }`}
                  />

                  {current ? (
                    <div>
                      <p className="text-sm font-semibold text-blue-600">
                        {formatTrialCode(item.id)} (atual)
                      </p>
                      <p className="text-xs text-slate-400">{formatDate(item.created_at)}</p>
                    </div>
                  ) : (
                    <Link href={`/Doadoras/${item.id}`} className="group">
                      <p className="text-sm font-semibold text-slate-700 transition group-hover:text-blue-600">
                        {formatTrialCode(item.id)}
                      </p>
                      <p className="text-xs text-slate-400">{formatDate(item.created_at)}</p>
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

      </div>
    </>
  );
}

function Evaluation({ trial, users, evaluating, onApprove, onReject, onReopen }) {
  const status = (trial.status || "pendente").toLowerCase();
  const evaluator = users.find((item) => item.id === trial.evaluated_by)?.name;
  const busy = !!evaluating;

  if (status === "pendente") {
    return (
      <section
        className="animate-fade-up mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        style={{ "--i": 1 }}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
            <Hourglass size={20} />
          </div>

          <div>
            <p className="font-semibold text-slate-800">Aguardando avaliação</p>
            <p className="mt-1 text-sm text-slate-500">
              Confira os dados e os pontos de atenção antes de decidir.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onReject}
            disabled={busy}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-500 transition duration-200 hover:-translate-y-0.5 hover:bg-red-50 active:translate-y-0 active:scale-[0.98] disabled:opacity-50"
          >
            <XCircle size={16} />
            Recusar
          </button>

          <button
            onClick={onApprove}
            disabled={busy}
            className="flex items-center gap-2 rounded-lg bg-green-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-green-600 hover:shadow-md active:translate-y-0 active:scale-[0.98] disabled:opacity-70"
          >
            {evaluating === "aprovada" ? <Spinner /> : <CheckCircle2 size={16} />}
            Aprovar
          </button>
        </div>
      </section>
    );
  }

  const approved = status === "aprovada";

  return (
    <section
      className={`animate-fade-up mb-6 flex flex-wrap items-start justify-between gap-4 rounded-2xl border p-6 ${
        approved ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
      }`}
      style={{ "--i": 1 }}
    >
      <div className="flex items-start gap-4">
        {approved ? (
          <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-green-500" />
        ) : (
          <XCircle size={22} className="mt-0.5 shrink-0 text-red-500" />
        )}

        <div>
          <p className={`font-semibold ${approved ? "text-green-700" : "text-red-700"}`}>
            Triagem {approved ? "aprovada" : "recusada"}
            {evaluator && ` por ${evaluator}`}
            {trial.evaluated_at && ` em ${formatDate(trial.evaluated_at)}`}
          </p>

          {!approved && trial.rejection_reason && (
            <p className="mt-1 text-sm text-red-700">
              Motivo: {trial.rejection_reason}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onReopen}
        disabled={busy}
        className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
      >
        {evaluating === "pendente" ? <Spinner /> : <RotateCcw size={15} />}
        Reavaliar
      </button>
    </section>
  );
}

function DetailSkeleton() {
  return (
    <div className="mt-5 space-y-6">
      <div className="flex items-center gap-4">
        <SkeletonBlock className="h-14 w-14 rounded-2xl" />
        <div className="space-y-2">
          <SkeletonBlock className="h-7 w-64" />
          <SkeletonBlock className="h-4 w-40" />
        </div>
      </div>

      <SkeletonBlock className="h-20 w-full rounded-2xl" />
      <SkeletonBlock className="h-64 w-full rounded-2xl" />
    </div>
  );
}
