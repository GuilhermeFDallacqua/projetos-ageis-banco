"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Droplet,
  House,
  Users,
  ClipboardPlus,
  History,
  UserCog,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { getInitials } from "@/utils/format";

const menuItems = [
  { href: "/", icon: House, label: "Início" },
  { href: "/Doadoras", icon: Users, label: "Doadoras" },
  { href: "/Triagem", icon: ClipboardPlus, label: "Nova triagem" },
  { href: "/Historico", icon: History, label: "Histórico" },
  { href: "/Usuarios", icon: UserCog, label: "Usuários" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Barra superior (celular/tablet) */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur lg:hidden">
        <Logo />

        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Menu lateral fixo (desktop) */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <SidebarContent />
      </aside>

      {/* Menu em gaveta (celular/tablet) */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="animate-fade-in absolute inset-0 bg-slate-900/30"
            onClick={() => setOpen(false)}
          />

          <aside className="animate-slide-in-left relative flex h-full w-64 flex-col bg-white shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-5 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
              aria-label="Fechar menu"
            >
              <X size={20} />
            </button>

            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-white shadow-sm">
        <Droplet size={18} fill="currentColor" />
      </div>

      <span className="text-xl font-bold text-slate-800">
        MilkTrace
      </span>
    </Link>
  );
}

function SidebarContent({ onNavigate }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-slate-200 px-7">
        <Logo />
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </p>

        <div className="space-y-2">

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                  active
                    ? "bg-blue-50 font-medium text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                <Icon
                  size={18}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
                {item.label}
              </Link>
            );
          })}

        </div>
      </nav>

      {/* Usuário */}
      <div className="border-t border-slate-200 p-5">

        <Link
          href="/Perfil"
          onClick={onNavigate}
          className="mb-4 flex items-center gap-3 rounded-lg p-1 transition hover:bg-slate-50"
        >

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
            {getInitials(user?.name)}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-700">
              {user?.name}
            </p>

            <p className="truncate text-xs text-slate-400">
              {user?.position || "Funcionário"}
            </p>
          </div>

        </Link>

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
        >
          <LogOut size={15} />
          Sair
        </button>

      </div>
    </>
  );
}
