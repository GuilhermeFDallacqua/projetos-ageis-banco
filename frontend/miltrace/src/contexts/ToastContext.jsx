"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

const ToastContext = createContext(null);

let nextId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (type, message) => {
      const id = ++nextId;

      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  const toast = {
    success: (message) => show("success", message),
    error: (message) => show("error", message),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      <div className="pointer-events-none fixed bottom-6 right-6 z-[60] flex w-[calc(100%-3rem)] max-w-sm flex-col gap-3">
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className="animate-toast-in pointer-events-auto flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
          >
            {item.type === "success" ? (
              <CheckCircle2 size={20} className="shrink-0 text-green-500" />
            ) : (
              <XCircle size={20} className="shrink-0 text-red-500" />
            )}

            <p className="flex-1 text-sm text-slate-700">{item.message}</p>

            <button
              onClick={() => dismiss(item.id)}
              className="text-slate-400 transition hover:text-slate-600"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
