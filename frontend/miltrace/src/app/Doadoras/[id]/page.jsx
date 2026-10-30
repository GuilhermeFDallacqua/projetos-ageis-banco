"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/sidebar";
import {
  mockTriagens,
  formatCPF,
  formatPhone,
  formatDate,
} from "@/data/mockTriagens";

const simNao = (value) => (value ? "Sim" : "Não");

export default function DoadoraPage() {
  const { id } = useParams();
  const router = useRouter();

  // Conectar: carregar com trialService.getById(id)
  const doadora = mockTriagens.find((item) => item.id === id);

  function handleDelete() {
    if (!window.confirm("Deseja realmente excluir esta doadora?")) return;

    // Conectar: await trialService.remove(id)
    router.push("/Doadoras");
  }

  if (!doadora) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

        <main className="ml-64 min-h-screen px-10 py-9">
          <p className="text-slate-500">Doadora não encontrada.</p>

          <Link
            href="/Doadoras"
            className="mt-4 inline-block text-sm font-semibold text-blue-500 hover:text-blue-700"
          >
            ← Voltar para doadoras
          </Link>
        </main>
      </div>
    );
  }

  const sections = [
    {
      title: "Identificação",
      items: [
        ["Nome completo", doadora.full_name],
        ["CPF", formatCPF(doadora.cpf)],
        ["Cartão SUS", doadora.sus_number || "—"],
        ["Data de nascimento", formatDate(doadora.birth_date)],
        ["Telefone", formatPhone(doadora.telephone_number)],
        ["Zona", doadora.zone || "—"],
        ["Endereço", doadora.address || "—"],
      ],
    },
    {
      title: "Saúde e hábitos",
      items: [
        [
          "Transfusão de sangue",
          doadora.has_blood_transfusion
            ? `Sim (${formatDate(doadora.transfusion_date)})`
            : "Não",
        ],
        [
          "Tatuagem",
          doadora.has_tattoo
            ? `Sim (${formatDate(doadora.tattoo_date)})`
            : "Não",
        ],
        ["Fumante", simNao(doadora.smoker)],
        ["Bebida alcoólica", simNao(doadora.alcohol_consumer)],
        ["Medicamento", doadora.uses_medication || "Não"],
      ],
    },
    {
      title: "Vacinação",
      items: [
        ["Febre amarela", simNao(doadora.has_yellow_fever_vaccine)],
        ["dTpa", simNao(doadora.has_dtpa_vaccine)],
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar />

      {/* Conteúdo principal */}
      <main className="ml-64 min-h-screen px-10 py-9">

        <div className="mx-auto max-w-7xl">

          <Link
            href="/Doadoras"
            className="text-sm font-semibold text-blue-500 transition hover:text-blue-700"
          >
            ← Voltar para doadoras
          </Link>

          {/* Cabeçalho */}
          <section className="mb-9 mt-4 flex flex-wrap items-end justify-between gap-4 animate-fade-up">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                {doadora.full_name}
              </h1>

              <p className="mt-2 text-slate-500">
                {doadora.id} · Triagem em {formatDate(doadora.created_at)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="rounded-lg border border-red-300 px-5 py-3 text-sm font-semibold text-red-500 transition duration-200 hover:-translate-y-0.5 hover:bg-red-50 active:translate-y-0 active:scale-[0.98]"
              >
                Excluir
              </button>

              <Link
                href="/Triagem"
                className="rounded-lg bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
              >
                Nova triagem
              </Link>
            </div>
          </section>


          <div className="space-y-6">
            {sections.map((section, index) => (

              <section
                key={section.title}
                className="animate-fade-up rounded-2xl border border-slate-200 bg-white shadow-sm"
                style={{ "--i": index + 1 }}
              >
                <div className="border-b border-slate-200 px-7 py-5">
                  <h2 className="text-lg font-semibold text-slate-800">
                    {section.title}
                  </h2>
                </div>

                <dl className="grid grid-cols-1 gap-6 px-7 py-6 sm:grid-cols-2 lg:grid-cols-3">
                  {section.items.map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {label}
                      </dt>

                      <dd className="mt-1 text-sm font-medium text-slate-700">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

            ))}
          </div>

        </div>

      </main>

    </div>
  );
}
