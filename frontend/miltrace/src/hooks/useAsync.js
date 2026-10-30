"use client";

import { useCallback, useEffect, useState } from "react";

// Carrega dados de forma assíncrona e expõe loading/erro/recarregar.
// "loader" deve ser estável (useCallback) para não recarregar a cada render.
export function useAsync(loader) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const reload = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await loader();
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: err.message });
    }
  }, [loader]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reload();
  }, [reload]);

  // Permite atualizar a lista localmente (ex.: após excluir um item)
  const setData = useCallback((updater) => {
    setState((prev) => ({
      ...prev,
      data: typeof updater === "function" ? updater(prev.data) : updater,
    }));
  }, []);

  return { ...state, reload, setData };
}
