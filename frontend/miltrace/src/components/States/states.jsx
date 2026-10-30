import { Inbox, WifiOff } from "lucide-react";

export function Spinner({ className = "" }) {
  return (
    <span
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  );
}

// Linhas "fantasma" exibidas enquanto a tabela carrega
export function SkeletonRows({ rows = 4, columns = 5 }) {
  return Array.from({ length: rows }, (_, row) => (
    <tr key={row}>
      {Array.from({ length: columns }, (_, col) => (
        <td key={col} className="px-7 py-5">
          <div
            className="h-4 animate-pulse rounded bg-slate-100"
            style={{ width: `${55 + ((row + col) % 3) * 15}%` }}
          />
        </td>
      ))}
    </tr>
  ));
}

export function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded bg-slate-100 ${className}`} />;
}

export function EmptyState({ title, description, children }) {
  return (
    <div className="animate-fade-in flex flex-col items-center px-7 py-14 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        <Inbox size={22} />
      </div>

      <p className="font-semibold text-slate-700">{title}</p>

      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-400">{description}</p>
      )}

      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="animate-fade-in flex flex-col items-center px-7 py-14 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-400">
        <WifiOff size={22} />
      </div>

      <p className="font-semibold text-slate-700">Não foi possível carregar os dados</p>
      <p className="mt-1 max-w-sm text-sm text-slate-400">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 rounded-lg border border-blue-500 px-5 py-2.5 text-sm font-semibold text-blue-500 transition hover:bg-blue-50"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
