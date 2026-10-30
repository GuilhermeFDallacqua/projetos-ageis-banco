"use client";

import { Suspense, useCallback, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, ClipboardPlus } from "lucide-react";

import PageLayout, { PageHeader } from "@/components/PageLayout/pageLayout";
import ConfirmDialog from "@/components/ConfirmDialog/confirmDialog";
import {
  SkeletonRows,
  EmptyState,
  ErrorState,
} from "@/components/States/states";
import StatusBadge from "@/components/StatusBadge/statusBadge";
import { useAsync } from "@/hooks/useAsync";
import { useToast } from "@/contexts/ToastContext";
import { trialService } from "@/services/trialService";
import {
  groupDonors,
  onlyDigits,
  formatCPF,
  formatPhone,
  formatDate,
  formatZone,
  getInitials,
} from "@/utils/format";

export default function DoadorasPage() {
  return (
    <Suspense>
      <Doadoras />
    </Suspense>
  );
}

function Doadoras() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const [busca, setBusca] = useState(searchParams.get("busca") || "");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadTrials = useCallback(() => trialService.getAll(), []);
  const { data, loading, error, reload, setData } = useAsync(loadTrials);

  const doadoras = groupDonors(data || []);

  const termo = busca.trim().toLowerCase();
  const termoNumerico = onlyDigits(termo);

  const filtradas = doadoras.filter(
    ({ latest }) =>
      latest.full_name?.toLowerCase().includes(termo) ||
      (termoNumerico && latest.cpf?.includes(termoNumerico))
  );

  async function handleDelete() {
    setDeleting(true);

    try {
      // Excluir a doadora remove todas as triagens dela
      await Promise.all(toDelete.trials.map((trial) => trialService.remove(trial.id)));

      const ids = new Set(toDelete.trials.map((trial) => trial.id));
      setData((prev) => prev.filter((trial) => !ids.has(trial.id)));
      toast.success(`${toDelete.latest.full_name} foi excluída.`);
      setToDelete(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <PageLayout>

      <PageHeader
        title="Doadoras"
        description="Consulte e gerencie as doadoras cadastradas."
      >
        <Link
          href="/Triagem"
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
        >
          <ClipboardPlus size={17} />
          Nova triagem
        </Link>
      </PageHeader>


      {/* Lista de doadoras */}
      <section
        className="animate-fade-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        style={{ "--i": 1 }}
      >

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-7 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Doadoras Cadastradas
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {loading
                ? "Carregando..."
                : `${filtradas.length} de ${doadoras.length} doadoras`}
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou CPF"
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </div>
        </div>


        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : !loading && filtradas.length === 0 ? (
          doadoras.length === 0 ? (
            <EmptyState
              title="Nenhuma doadora cadastrada"
              description="As doadoras aparecem aqui após a primeira triagem."
            >
              <Link
                href="/Triagem"
                className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                Iniciar triagem
              </Link>
            </EmptyState>
          ) : (
            <EmptyState
              title="Nenhuma doadora encontrada"
              description={`Não encontramos resultados para "${busca}".`}
            >
              <button
                onClick={() => setBusca("")}
                className="text-sm font-semibold text-blue-500 hover:text-blue-700"
              >
                Limpar busca
              </button>
            </EmptyState>
          )
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[860px]">

              <thead className="bg-slate-50">

                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-7 py-4">Doadora</th>
                  <th className="px-7 py-4">Telefone</th>
                  <th className="px-7 py-4">Zona</th>
                  <th className="px-7 py-4">Status</th>
                  <th className="px-7 py-4">Triagens</th>
                  <th className="px-7 py-4">Última triagem</th>
                  <th className="px-7 py-4 text-right">Ação</th>
                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {loading ? (
                  <SkeletonRows columns={7} />
                ) : (
                  filtradas.map((doadora, index) => (

                    <tr
                      key={doadora.key}
                      className="animate-fade-in transition-colors hover:bg-slate-50"
                      style={{ "--i": index }}
                    >

                      <td className="px-7 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                            {getInitials(doadora.latest.full_name)}
                          </div>

                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {doadora.latest.full_name}
                            </p>

                            <p className="text-xs text-slate-400">
                              {formatCPF(doadora.latest.cpf)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-7 py-4 text-sm text-slate-500">
                        {formatPhone(doadora.latest.telephone_number)}
                      </td>

                      <td className="px-7 py-4">
                        <span className="text-sm text-slate-500">
                          {formatZone(doadora.latest.zone)}
                        </span>
                      </td>

                      <td className="px-7 py-4">
                        <StatusBadge status={doadora.latest.status} />
                      </td>

                      <td className="px-7 py-4 text-sm text-slate-500">
                        {doadora.trials.length}
                      </td>

                      <td className="px-7 py-4 text-sm text-slate-500">
                        {formatDate(doadora.latest.created_at)}
                      </td>

                      <td className="px-7 py-4 text-right">
                        <div className="flex justify-end gap-4">
                          <Link
                            href={`/Doadoras/${doadora.latest.id}`}
                            className="text-sm font-semibold text-blue-500 transition hover:text-blue-700"
                          >
                            Visualizar
                          </Link>

                          <button
                            onClick={() => setToDelete(doadora)}
                            className="text-sm font-semibold text-red-400 transition hover:text-red-600"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>

                    </tr>

                  ))
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>

      <ConfirmDialog
        open={!!toDelete}
        title="Excluir doadora?"
        message={
          toDelete &&
          (toDelete.trials.length === 1
            ? `A triagem de ${toDelete.latest.full_name} será excluída. `
            : `As ${toDelete.trials.length} triagens de ${toDelete.latest.full_name} serão excluídas. `) +
            "Essa ação não pode ser desfeita."
        }
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />

    </PageLayout>
  );
}
