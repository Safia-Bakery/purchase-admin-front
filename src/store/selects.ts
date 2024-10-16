import { Language } from "@/utils/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface State {
  lang: Language;
  sidebarToggler: boolean;
  changeLanguage: (arg: Language) => void;
  sidebarHandler: (arg: boolean) => void;
}
const useSelectsStore = create<State>()(
  persist(
    (set) => ({
      lang: Language.ru,
      sidebarToggler: false,
      changeLanguage: (payload) =>
        set((state) => ({ ...state, lang: payload })),
      sidebarHandler: (payload) =>
        set((state) => ({ ...state, sidebarToggler: payload })),
    }),
    {
      name: "selects-zustand",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useSelectsStore;
