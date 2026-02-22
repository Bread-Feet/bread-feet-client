import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    // 새로고침 시 상태 유지
    (set) => ({
      // state
      user: null, // { profile_nickname, name, gender, age_range } or null
      isAuthenticated: false, // login 여부
      isLoading: false, // login 진행중 여부
      hasHydrated: false, // localStorage 값 가져왔는지 여부
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user, // user가 존재하면 true, boolean으로 강제 변경
          isLoading: false,
        }),
      setLoading: (loading) => set({ isLoading: loading }),
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: "user-storage",
      // 새로고침, 앱 재실행 시에도 user 정보 유지 (세션만료 전)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // localstorage에서 복원 끝나면 hasHydrated = true
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
