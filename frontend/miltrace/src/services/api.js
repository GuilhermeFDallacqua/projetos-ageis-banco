// Cliente HTTP base. Todas as chamadas passam por /api (ver next.config.mjs).
const BASE_URL = "/api";

export async function request(path, { method = "GET", body } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || "Erro ao comunicar com o servidor.");
  }

  return result;
}
