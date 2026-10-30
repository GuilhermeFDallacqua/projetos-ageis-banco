"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";

import PageLayout, { PageHeader } from "@/components/PageLayout/pageLayout";
import ConfirmDialog from "@/components/ConfirmDialog/confirmDialog";
import {
  SkeletonRows,
  EmptyState,
  ErrorState,
} from "@/components/States/states";
import { useAsync } from "@/hooks/useAsync";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { userService } from "@/services/userService";
import { formatCPF, formatPhone, getInitials } from "@/utils/format";

export default function UsuariosPage() {
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadUsers = useCallback(() => userService.getAll(), []);
  const { data, loading, error, reload, setData } = useAsync(loadUsers);

  const users = data || [];

  async function handleDelete() {
    setDeleting(true);

    try {
      await userService.remove(toDelete.id);
      setData((prev) => prev.filter((item) => item.id !== toDelete.id));
      toast.success(`${toDelete.name} foi removido(a).`);
      setToDelete(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <PageLayout>

      <PageHeader
        title="Usuários"
        description="Gerencie quem tem acesso ao sistema."
      >
        <Link
          href="/Usuarios/novo"
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
        >
          <UserPlus size={17} />
          Novo usuário
        </Link>
      </PageHeader>


      <section
        className="animate-fade-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        style={{ "--i": 1 }}
      >
        <div className="border-b border-slate-200 px-7 py-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Equipe
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {loading ? "Carregando..." : `${users.length} usuário(s)`}
          </p>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : !loading && users.length === 0 ? (
          <EmptyState title="Nenhum usuário cadastrado" />
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[720px]">

              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-7 py-4">Usuário</th>
                  <th className="px-7 py-4">Cargo</th>
                  <th className="px-7 py-4">CPF</th>
                  <th className="px-7 py-4">Telefone</th>
                  <th className="px-7 py-4 text-right">Ação</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {loading ? (
                  <SkeletonRows columns={5} />
                ) : (
                  users.map((item, index) => {
                    const isMe = item.id === currentUser?.id;

                    return (
                      <tr
                        key={item.id}
                        className="animate-fade-in transition-colors hover:bg-slate-50"
                        style={{ "--i": index }}
                      >
                        <td className="px-7 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                              {getInitials(item.name)}
                            </div>

                            <div>
                              <p className="text-sm font-medium text-slate-700">
                                {item.name}
                                {isMe && (
                                  <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
                                    Você
                                  </span>
                                )}
                              </p>

                              <p className="text-xs text-slate-400">{item.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-7 py-4 text-sm text-slate-500">
                          {item.position || "—"}
                        </td>

                        <td className="px-7 py-4 text-sm text-slate-500">
                          {formatCPF(item.cpf)}
                        </td>

                        <td className="px-7 py-4 text-sm text-slate-500">
                          {formatPhone(item.telephone_number)}
                        </td>

                        <td className="px-7 py-4 text-right">
                          <div className="flex justify-end gap-4">
                            <Link
                              href={isMe ? "/Perfil" : `/Usuarios/${item.id}`}
                              className="text-sm font-semibold text-blue-500 transition hover:text-blue-700"
                            >
                              Editar
                            </Link>

                            {!isMe && (
                              <button
                                onClick={() => setToDelete(item)}
                                className="text-sm font-semibold text-red-400 transition hover:text-red-600"
                              >
                                Excluir
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}

              </tbody>

            </table>

          </div>
        )}
      </section>

      <ConfirmDialog
        open={!!toDelete}
        title="Remover usuário?"
        message={toDelete && `${toDelete.name} perderá o acesso ao sistema.`}
        confirmLabel="Remover"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />

    </PageLayout>
  );
}
