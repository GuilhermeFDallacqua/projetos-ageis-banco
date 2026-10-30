import Link from "next/link";

import {
  SkeletonRows,
  EmptyState,
  ErrorState,
} from "@/components/States/states";
import {
  formatDate,
  formatTime,
  formatZone,
  formatTrialCode,
  formatCPF,
} from "@/utils/format";

// Tabela de triagens usada na Home e no Histórico
export default function TrialTable({
  trials,
  loading,
  error,
  onRetry,
  emptyTitle = "Nenhuma triagem encontrada",
  emptyDescription,
  emptyAction,
}) {
  if (error) return <ErrorState message={error} onRetry={onRetry} />;

  if (!loading && trials.length === 0) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription}>
        {emptyAction}
      </EmptyState>
    );
  }

  return (
    <div className="overflow-x-auto">

      <table className="w-full min-w-[720px]">

        <thead className="bg-slate-50">

          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
            <th className="px-7 py-4">Código</th>
            <th className="px-7 py-4">Doadora</th>
            <th className="px-7 py-4">Data</th>
            <th className="px-7 py-4">Horário</th>
            <th className="px-7 py-4">Zona</th>
            <th className="px-7 py-4 text-right">Ação</th>
          </tr>

        </thead>


        <tbody className="divide-y divide-slate-100">

          {loading ? (
            <SkeletonRows columns={6} />
          ) : (
            trials.map((trial, index) => (

              <tr
                key={trial.id}
                className="animate-fade-in transition-colors hover:bg-slate-50"
                style={{ "--i": index }}
              >

                <td className="px-7 py-5 text-sm font-semibold text-slate-700">
                  {formatTrialCode(trial.id)}
                </td>

                <td className="px-7 py-5">
                  <p className="text-sm font-medium text-slate-700">
                    {trial.full_name}
                  </p>

                  <p className="text-xs text-slate-400">
                    {formatCPF(trial.cpf)}
                  </p>
                </td>

                <td className="px-7 py-5 text-sm text-slate-500">
                  {formatDate(trial.created_at)}
                </td>

                <td className="px-7 py-5 text-sm text-slate-500">
                  {formatTime(trial.created_at)}
                </td>

                <td className="px-7 py-5">
                  {trial.zone ? (
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        trial.zone === "RURAL"
                          ? "bg-green-50 text-green-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {formatZone(trial.zone)}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400">—</span>
                  )}
                </td>

                <td className="px-7 py-5 text-right">
                  <Link
                    href={`/Doadoras/${trial.id}`}
                    className="text-sm font-semibold text-blue-500 transition hover:text-blue-700"
                  >
                    Visualizar
                  </Link>
                </td>

              </tr>

            ))
          )}

        </tbody>

      </table>

    </div>
  );
}
