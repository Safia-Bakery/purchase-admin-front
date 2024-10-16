import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface State {
  token: string | null;
  logoutHandler: () => void;
  loginHandler: (payload: string) => void;
}

const useAuthStore = create<State>()(
  persist(
    (set) => ({
      token: null,
      logoutHandler: () => set((state) => ({ ...state, token: null })),
      loginHandler: (payload: string) =>
        set((state) => ({ ...state, token: payload })),
    }),
    { name: "auth_zustand", storage: createJSONStorage(() => sessionStorage) }
  )
);

export default useAuthStore;
