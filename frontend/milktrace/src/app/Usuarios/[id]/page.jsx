"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import PageLayout, { PageHeader } from "@/components/PageLayout/pageLayout";
import UserForm, { userRowToForm } from "@/components/UserForm/userForm";
import { SkeletonBlock, ErrorState } from "@/components/States/states";
import { useAsync } from "@/hooks/useAsync";
import { useToast } from "@/contexts/ToastContext";
import { userService } from "@/services/userService";

export default function EditarUsuarioPage() {
  const { id } = useParams();
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const loadUser = useCallback(() => userService.getById(id), [id]);
  const { data, loading, error, reload } = useAsync(loadUser);

  async function handleSubmit(payload) {
    setSubmitting(true);

    try {
      await userService.update(id, payload);
      toast.success("Dados atualizados.");
      router.push("/Usuarios");
    } catch (err) {
      toast.error(err.message);
      setSubmitting(false);
    }
  }

  return (
    <PageLayout>

      <Link
        href="/Usuarios"
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-500 transition hover:gap-3 hover:text-blue-700"
      >
        <ArrowLeft size={16} />
        Voltar para usuários
      </Link>

      <PageHeader
        title="Editar usuário"
        description={data?.name}
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
            submitLabel="Salvar alterações"
            cancelHref="/Usuarios"
            onSubmit={handleSubmit}
          />
        )}
      </div>

    </PageLayout>
  );
}
