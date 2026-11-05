"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { Spinner } from "@/components/States/states";
import {
  maskCPF,
  maskPhone,
  isValidCPF,
  isValidEmail,
  onlyDigits,
} from "@/utils/format";

export const CARGOS = [
  "Funcionário",
  "Enfermeiro(a)",
  "Técnico(a) de enfermagem",
  "Nutricionista",
  "Médico(a)",
  "Administrador",
];

// Valores das colunas "type_user" e "status" da tabela users
export const TIPOS_USUARIO = [
  { value: "comum", label: "Comum" },
  { value: "admin", label: "Administrador" },
];

export const SITUACOES_USUARIO = [
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
];

const emptyUser = {
  name: "",
  email: "",
  position: "Funcionário",
  telephoneNumber: "",
  CPF: "",
  dateBirth: "",
  password: "",
  confirmPassword: "",
  typeUser: "comum",
  status: "ativo",
};

// Converte a linha da tabela "users" para o formato do formulário
export function userRowToForm(row) {
  return {
    ...emptyUser,
    name: row.name || "",
    email: row.email || "",
    position: row.position || "Funcionário",
    telephoneNumber: maskPhone(row.telephone_number || ""),
    CPF: maskCPF(row.cpf || ""),
    dateBirth: row.date_birth ? String(row.date_birth).slice(0, 10) : "",
    typeUser: (row.type_user || "comum").toLowerCase(),
    status: (row.status || "ativo").toLowerCase(),
  };
}

function validate(form, isCreate) {
  const errors = {};

  if (!form.name.trim()) errors.name = "Informe o nome.";
  if (isCreate && !isValidEmail(form.email)) errors.email = "Informe um e-mail válido.";
  if (form.CPF && !isValidCPF(form.CPF)) errors.CPF = "CPF inválido.";
  if (form.telephoneNumber && onlyDigits(form.telephoneNumber).length < 10) {
    errors.telephoneNumber = "Telefone incompleto.";
  }

  if (isCreate) {
    if (form.password.length < 6) errors.password = "A senha deve ter ao menos 6 caracteres.";
    if (form.password !== form.confirmPassword) errors.confirmPassword = "As senhas não coincidem.";
  }

  return errors;
}

export default function UserForm({
  initial,
  mode = "create",
  submitting,
  submitLabel,
  cancelHref,
  onSubmit,
  showAccess = true,
}) {
  const isCreate = mode === "create";
  const [form, setForm] = useState(initial || emptyUser);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const found = validate(form, isCreate);
    setErrors(found);

    if (Object.keys(found).length) return;

    const payload = {
      name: form.name.trim(),
      position: form.position,
      telephoneNumber: onlyDigits(form.telephoneNumber) || null,
      CPF: onlyDigits(form.CPF) || null,
      dateBirth: form.dateBirth || null,
    };

    if (showAccess) {
      payload.typeUser = form.typeUser;
      if (!isCreate) payload.status = form.status;
    }

    if (isCreate) {
      payload.email = form.email.trim().toLowerCase();
      payload.password = form.password;
      payload.confirmPassword = form.confirmPassword;
    }

    onSubmit(payload);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="animate-fade-up rounded-2xl border border-slate-200 bg-white shadow-sm"
      style={{ "--i": 1 }}
    >
      <div className="grid grid-cols-1 gap-6 px-7 py-7 sm:grid-cols-2">

        <Field label="Nome completo" required error={errors.name} full>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Nome do usuário"
          />
        </Field>

        <Field
          label="E-mail"
          required={isCreate}
          error={errors.email}
          hint={!isCreate ? "O e-mail de acesso não pode ser alterado." : undefined}
        >
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="usuario@email.com"
            disabled={!isCreate}
          />
        </Field>

        <Field label="Cargo">
          <select
            value={form.position}
            onChange={(e) => update("position", e.target.value)}
          >
            {[...new Set([...CARGOS, form.position])].map((cargo) => (
              <option key={cargo} value={cargo}>{cargo}</option>
            ))}
          </select>
        </Field>

        <Field label="CPF" error={errors.CPF}>
          <input
            inputMode="numeric"
            value={form.CPF}
            onChange={(e) => update("CPF", maskCPF(e.target.value))}
            placeholder="000.000.000-00"
          />
        </Field>

        <Field label="Telefone" error={errors.telephoneNumber}>
          <input
            type="tel"
            value={form.telephoneNumber}
            onChange={(e) => update("telephoneNumber", maskPhone(e.target.value))}
            placeholder="(00) 00000-0000"
          />
        </Field>

        <Field label="Data de nascimento">
          <input
            type="date"
            value={form.dateBirth}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => update("dateBirth", e.target.value)}
          />
        </Field>

        {showAccess && (
          <Field label="Tipo de acesso">
            <select
              value={form.typeUser}
              onChange={(e) => update("typeUser", e.target.value)}
            >
              {TIPOS_USUARIO.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
              ))}
            </select>
          </Field>
        )}

        {showAccess && !isCreate && (
          <Field
            label="Situação"
            hint={form.status === "inativo" ? "Usuários inativos não conseguem entrar no sistema." : undefined}
          >
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
            >
              {SITUACOES_USUARIO.map((situacao) => (
                <option key={situacao.value} value={situacao.value}>{situacao.label}</option>
              ))}
            </select>
          </Field>
        )}

        {isCreate && (
          <>
            <Field label="Senha" required error={errors.password}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  className="pr-11"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </Field>

            <Field label="Confirmar senha" required error={errors.confirmPassword}>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                placeholder="Repita a senha"
              />
            </Field>
          </>
        )}

      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-7 py-5">
        <span className="text-xs text-slate-400">* Campos obrigatórios</span>

        <div className="flex gap-3">
          <Link
            href={cancelHref}
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-md active:translate-y-0 active:scale-[0.98] disabled:translate-y-0 disabled:opacity-70"
          >
            {submitting && <Spinner />}
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, required, error, hint, full, children }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>

      <div
        className={`mt-2 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:bg-white [&_input]:px-3.5 [&_input]:py-2.5 [&_input]:text-sm [&_input]:text-slate-700 [&_input]:outline-none [&_input]:transition [&_input:focus]:border-blue-500 [&_input:focus]:ring-4 [&_input:focus]:ring-blue-50 [&_input:disabled]:bg-slate-50 [&_input:disabled]:text-slate-400 [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-slate-200 [&_select]:bg-white [&_select]:px-3 [&_select]:py-2.5 [&_select]:text-sm [&_select]:text-slate-700 [&_select]:outline-none [&_select:focus]:border-blue-500 ${
          error ? "[&_input]:border-red-300" : "[&_input]:border-slate-200"
        }`}
      >
        {children}
      </div>

      {error ? (
        <span className="animate-fade-in mt-1.5 block text-xs text-red-500">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-slate-400">{hint}</span>
      ) : null}
    </label>
  );
}
