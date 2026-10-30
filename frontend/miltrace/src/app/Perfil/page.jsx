"use client";

import { useCallback, useState } from "react";

import PageLayout, { PageHeader } from "@/components/PageLayout/pageLayout";
import UserForm, { userRowToForm } from "@/components/UserForm/userForm";
import { SkeletonBlock, ErrorState } from "@/components/States/states";
import { useAsync } from "@/hooks/useAsync";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { userService } from "@/services/userService";

export default function PerfilPage() {
  const { user, updateCurrentUser } = useAuth();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const loadProfile = useCallback(() => userService.getById(user.id), [user.id]);
  const { data, loading, error, reload } = useAsync(loadProfile);

  async function handleSubmit(payload) {
    setSubmitting(true);

    try {
      await userService.update(user.id, payload);
      updateCurrentUser({ name: payload.name, position: payload.position });
      toast.success("Perfil atualizado.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageLayout>

      <PageHeader
        title="Meu perfil"
        description="Mantenha seus dados de contato atualizados."
      />

      <div className="max-w-3xl">
        {error ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <ErrorState message={error} onRetry={reload} />
          </div>
        ) : loading ? (
          <SkeletonBlock className="h-96 w-full rounded-2xl" />
        ) : (
          <UserForm
            mode="edit"
            initial={userRowToForm(data)}
            submitting={submitting}
            submitLabel="Salvar perfil"
            cancelHref="/"
            onSubmit={handleSubmit}
          />
        )}
      </div>

    </PageLayout>
  );
}
