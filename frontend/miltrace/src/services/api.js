import { getSession } from "@/utils/session";

// Cliente HTTP base. Todas as chamadas passam por /api (ver next.config.mjs).
const BASE_URL = "/api";

export async function request(path, { method = "GET", body } = {}) {
  const headers = {};
  const token = getSession()?.token;

  if (body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor.");
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.error ||
        (response.status >= 500
          ? "Servidor indisponível. Verifique se o backend está rodando."
          : "Erro ao comunicar com o servidor.")
    );
  }

  return result;
}
