"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ClipboardPlus,
  Search,
  Users,
  CalendarDays,
  Hourglass,
} from "lucide-react";

import PageLayout from "@/components/PageLayout/pageLayout";
import TrialTable from "@/components/TrialTable/trialTable";
import { SkeletonBlock } from "@/components/States/states";
import { useAuth } from "@/contexts/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { trialService } from "@/services/trialService";
import { groupDonors, sortByNewest } from "@/utils/format";

function greeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [busca, setBusca] = useState("");

  const loadTrials = useCallback(() => trialService.getAll(), []);
  const { data, loading, error, reload } = useAsync(loadTrials);

  const trials = sortByNewest(data || []);
  const now = new Date();
  const withDate = trials.filter((trial) => trial.created_at);

  const stats = [
    {
      label: "Doadoras cadastradas",
      value: groupDonors(trials).length,
      icon: Users,
      color: "bg-blue-50 text-blue-500",
    },
    {
      label: "Triagens este mês",
      value: withDate.filter((trial) => {
        const date = new Date(trial.created_at);
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      }).length,
      icon: CalendarDays,
      color: "bg-orange-50 text-orange-400",
    },
    {
      label: "Aguardando avaliação",
      value: trials.filter(
        (trial) => (trial.status || "pendente").toLowerCase() === "pendente"
      ).length,
      icon: Hourglass,
      color: "bg-green-50 text-green-500",
      href: "/Historico?status=pendente",
    },
  ];

  function handleSearch(e) {
    e.preventDefault();

    const termo = busca.trim();
    router.push(termo ? `/Doadoras?busca=${encodeURIComponent(termo)}` : "/Doadoras");
  }

  const firstName = user?.name?.split(" ")[0];
  const today = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <PageLayout>

      {/* Cabeçalho */}
      <section className="animate-fade-up mb-9">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          {greeting()}, {firstName}!
        </h1>

        <p className="mt-2 text-slate-500">
          {today.charAt(0).toUpperCase() + today.slice(1)}
        </p>
      </section>


      {/* Indicadores */}
      <section className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const Card = stat.href ? Link : "div";

          return (
            <Card
              key={stat.label}
              href={stat.href}
              className={`animate-fade-up flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${
                stat.href ? "transition duration-300 hover:-translate-y-1 hover:shadow-md" : ""
              }`}
              style={{ "--i": index + 1 }}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.color}`}>
                <Icon size={22} />
              </div>

              <div>
                {loading ? (
                  <SkeletonBlock className="mb-1 h-7 w-10" />
                ) : (
                  <p className="text-2xl font-bold text-slate-800">
                    {error ? "—" : stat.value}
                  </p>
                )}

                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </Card>
          );
        })}
      </section>


      {/* Cards principais */}
      <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Nova Triagem */}
        <div
          className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
          style={{ "--i": 4 }}
        >

          <div className="mb-6 flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
              <ClipboardPlus size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Nova Triagem
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Inicie um novo processo de triagem para uma doadora.
              </p>
            </div>

          </div>

          <Link
            href="/Triagem"
            className="block w-full rounded-lg bg-blue-500 py-3 text-center text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
          >
            Iniciar triagem
          </Link>
        </div>


        {/* Consultar Doadora */}
        <div
          className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
          style={{ "--i": 5 }}
        >

          <div className="mb-6 flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-400">
              <Search size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Consultar Doadora
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Localize uma doadora cadastrada pelo nome ou CPF.
              </p>
            </div>

          </div>

          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Nome ou CPF"
              className="min-w-0 flex-1 rounded-lg border border-slate-200 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />

            <button
              type="submit"
              className="rounded-lg border border-blue-500 px-5 py-3 text-sm font-semibold text-blue-500 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50 active:translate-y-0 active:scale-[0.98]"
            >
              Consultar
            </button>
          </form>

        </div>

      </section>


      {/* Triagens recentes */}
      <section
        className="animate-fade-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        style={{ "--i": 6 }}
      >

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-7 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Triagens Recentes
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Acompanhe as últimas triagens realizadas.
            </p>
          </div>

          <Link
            href="/Historico"
            className="text-sm font-semibold text-blue-500 transition hover:text-blue-700"
          >
            Ver todas →
          </Link>
        </div>

        <TrialTable
          trials={trials.slice(0, 5)}
          loading={loading}
          error={error}
          onRetry={reload}
          emptyTitle="Nenhuma triagem ainda"
          emptyDescription="As triagens realizadas aparecerão aqui."
          emptyAction={
            <Link
              href="/Triagem"
              className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Iniciar primeira triagem
            </Link>
          }
        />

      </section>

    </PageLayout>
  );
}
