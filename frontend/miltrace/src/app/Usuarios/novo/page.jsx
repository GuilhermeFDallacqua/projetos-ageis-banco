"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import PageLayout, { PageHeader } from "@/components/PageLayout/pageLayout";
import UserForm from "@/components/UserForm/userForm";
import { useToast } from "@/contexts/ToastContext";
import { userService } from "@/services/userService";

export default function NovoUsuarioPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(payload) {
    setSubmitting(true);

    try {
      await userService.create(payload);
      toast.success(`${payload.name} foi cadastrado(a).`);
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
        title="Novo usuário"
        description="Cadastre um membro da equipe para acessar o sistema."
      />

      <div className="max-w-3xl">
        <UserForm
          mode="create"
          submitting={submitting}
          submitLabel="Cadastrar usuário"
          cancelHref="/Usuarios"
          onSubmit={handleSubmit}
        />
      </div>

    </PageLayout>
  );
}
