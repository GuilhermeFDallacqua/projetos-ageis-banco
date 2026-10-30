"use client";

import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";

import { Spinner } from "@/components/States/states";

// Pede o motivo antes de recusar a triagem
export default function RejectDialog({ open, donorName, loading, onConfirm, onCancel }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => e.key === "Escape" && !loading && onCancel();
    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  function handleConfirm() {
    if (!reason.trim()) {
      setError("Informe o motivo da recusa.");
      return;
    }

    onConfirm(reason.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      <div
        className="animate-fade-in absolute inset-0 bg-slate-900/40"
        onClick={() => !loading && onCancel()}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="animate-scale-in relative w-full max-w-md rounded-2xl bg-white p-7 shadow-xl"
      >
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
          <XCircle size={22} />
        </div>

        <h2 className="text-lg font-semibold text-slate-800">
          Recusar triagem?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Informe por que a triagem de {donorName} foi recusada.
        </p>

        <textarea
          autoFocus
          rows={4}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setError("");
          }}
          placeholder="Ex.: tatuagem realizada há menos de 12 meses"
          className={`mt-4 w-full resize-none rounded-lg border px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:ring-4 ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-50"
              : "border-slate-200 focus:border-blue-500 focus:ring-blue-50"
          }`}
        />

        {error && <p className="animate-fade-in mt-1.5 text-xs text-red-500">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-70"
          >
            {loading && <Spinner />}
            Recusar triagem
          </button>
        </div>
      </div>
    </div>
  );
}
