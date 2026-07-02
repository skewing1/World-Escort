"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { ModalType, UserRole } from "@/lib/types";
import { purchaseUrl, routes } from "@/lib/routes";
import { LoginModal, RegisterModal } from "@/components/site/modals";
import { AuthSessionProvider } from "@/components/providers/session-provider";

interface AppContextValue {
  userRole: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  goToPurchase: (plan: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function AppProviderInner({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [modal, setModal] = useState<ModalType>(null);

  const userRole: UserRole = session?.user?.role ?? "guest";
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  function goToPurchase(plan: string) {
    router.push(purchaseUrl(plan));
  }

  async function logout() {
    await signOut({ redirect: false });
    router.push(routes.home);
    router.refresh();
  }

  return (
    <AppContext.Provider
      value={{
        userRole,
        isAuthenticated,
        isLoading,
        openModal: setModal,
        closeModal: () => setModal(null),
        goToPurchase,
        logout,
      }}
    >
      {children}
      {modal === "login" && <LoginModal onClose={() => setModal(null)} />}
      {modal === "register" && <RegisterModal onClose={() => setModal(null)} goToPurchase={goToPurchase} />}
    </AppContext.Provider>
  );
}

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AuthSessionProvider>
      <AppProviderInner>{children}</AppProviderInner>
    </AuthSessionProvider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
