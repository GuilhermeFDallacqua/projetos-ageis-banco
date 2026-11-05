import { getTrialStatus } from "@/utils/format";

export default function StatusBadge({ status }) {
  const { label, className } = getTrialStatus(status);

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}

// Selo genérico (ex.: tipo de acesso e situação do usuário)
export function Badge({ children, className = "bg-slate-100 text-slate-500" }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}
