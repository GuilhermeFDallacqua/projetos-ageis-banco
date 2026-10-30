"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { userService } from "@/services/userService";
import { getSession, saveSession, clearSession } from "@/utils/session";

const AuthContext = createContext(null);

// Telas acessíveis sem login
const PUBLIC_PATHS = ["/Login"];

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // undefined = ainda lendo a sessão salva
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    // A sessão só existe no navegador, por isso é lida após montar
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(getSession());
  }, []);

  const isPublic = PUBLIC_PATHS.includes(pathname);
  const ready = session !== undefined;

  useEffect(() => {
    if (!ready) return;

    if (!session && !isPublic) router.replace("/Login");
    if (session && isPublic) router.replace("/");
  }, [ready, session, isPublic, router]);

  const login = useCallback(async (email, password) => {
    const { user, token } = await userService.login(email, password);

    // Busca o perfil (nome e cargo); se falhar, usa os dados do Auth
    const profile = await userService.getById(user.id).catch(() => null);

    if (profile?.status?.toLowerCase() === "inativo") {
      throw new Error("Seu usuário está inativo. Fale com o administrador.");
    }

    const newSession = {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: profile?.name || user.user_metadata?.display_name || user.email,
        position: profile?.position || "",
        typeUser: profile?.type_user || "comum",
      },
    };

    saveSession(newSession);
    setSession(newSession);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    router.replace("/Login");
  }, [router]);

  // Atualiza os dados do usuário logado (ex.: após editar o perfil)
  const updateCurrentUser = useCallback((data) => {
    setSession((prev) => {
      if (!prev) return prev;

      const updated = { ...prev, user: { ...prev.user, ...data } };
      saveSession(updated);
      return updated;
    });
  }, []);

  const allowed = ready && (isPublic ? !session : !!session);

  return (
    <AuthContext.Provider
      value={{ user: session?.user, login, logout, updateCurrentUser }}
    >
      {allowed ? children : <FullScreenLoader />}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-blue-100 border-t-blue-500" />
    </div>
  );
}
