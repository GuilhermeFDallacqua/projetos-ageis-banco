// Formatação e máscaras usadas nas telas

export const onlyDigits = (value) => (value || "").replace(/\D/g, "");

export function maskCPF(value) {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskPhone(value) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function maskSUS(value) {
  return onlyDigits(value)
    .slice(0, 15)
    .replace(/(\d{3})(\d)/, "$1 $2")
    .replace(/(\d{4})(\d)/, "$1 $2")
    .replace(/(\d{4})(\d)/, "$1 $2");
}

export function isValidCPF(value) {
  const cpf = onlyDigits(value);

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  const digit = (length) => {
    let sum = 0;

    for (let i = 0; i < length; i++) {
      sum += Number(cpf[i]) * (length + 1 - i);
    }

    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10]);
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((value || "").trim());
}

export function formatCPF(cpf) {
  return cpf ? maskCPF(cpf) : "—";
}

export function formatPhone(phone) {
  return phone ? maskPhone(phone) : "—";
}

export function formatSUS(sus) {
  return sus ? maskSUS(sus) : "—";
}

export function formatDate(value) {
  if (!value) return "—";

  return String(value).slice(0, 10).split("-").reverse().join("/");
}

export function formatMonthYear(value) {
  if (!value) return "—";

  const [year, month] = String(value).slice(0, 7).split("-");
  return `${month}/${year}`;
}

export function formatTime(value) {
  if (!value || String(value).length < 16) return "—";

  return new Date(value).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatZone(zone) {
  if (!zone) return "—";

  return zone.charAt(0).toUpperCase() + zone.slice(1).toLowerCase();
}

// Código exibido para a triagem (o id do banco pode ser número ou uuid)
export function formatTrialCode(id) {
  if (id === undefined || id === null) return "—";

  return typeof id === "number" || /^\d+$/.test(String(id))
    ? `TRI-${String(id).padStart(4, "0")}`
    : `TRI-${String(id).slice(0, 6).toUpperCase()}`;
}

export function getInitials(name) {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export function getAge(birthDate) {
  if (!birthDate) return null;

  const birth = new Date(`${String(birthDate).slice(0, 10)}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());

  return beforeBirthday ? age - 1 : age;
}

export function sortByNewest(trials) {
  return [...trials].sort((a, b) => {
    if (a.created_at && b.created_at) {
      return new Date(b.created_at) - new Date(a.created_at);
    }

    return String(b.id).localeCompare(String(a.id), undefined, { numeric: true });
  });
}

// Agrupa as triagens por CPF: cada doadora aparece uma vez,
// com a triagem mais recente e o total de triagens.
export function groupDonors(trials) {
  const donors = new Map();

  for (const trial of sortByNewest(trials)) {
    const key = trial.cpf || `id-${trial.id}`;
    const donor = donors.get(key);

    if (donor) {
      donor.trials.push(trial);
    } else {
      donors.set(key, { key, latest: trial, trials: [trial] });
    }
  }

  return [...donors.values()];
}
