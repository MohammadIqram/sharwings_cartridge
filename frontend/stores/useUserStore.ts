import { create } from "zustand";
import { toast } from "sonner";

/* =======================
   Types
======================= */

type User = {
  id?: string;
  name?: string;
  email?: string;
  address?: any;
  role?: string;
};

type SignupPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type UserStore = {
  user: User | null;
  loading: boolean;
  checkingAuth: boolean;

  setUser: (user: User | null) => void;
  updateUser: (user: Partial<User>) => void;
  signup: (data: SignupPayload) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<any>;
  addBillingAddress: (form: any) => Promise<void>;
};

/* =======================
   Store
======================= */

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  setUser: (user: User | null) => set({user}),
  updateUser: (data: User) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
  })),

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message);

      set({ user: data, loading: false });
      window.location.href = "/";
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.message || "An error occurred");
    }
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message);

      set({ user: data, loading: false });
      window.location.href = "/";
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.message || "An error occurred");
    }
  },

  logout: async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      set({ user: null });
      window.location.href = "/login";
    } catch (error: any) {
      toast.error(error.message || "An error occurred during logout");
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error();

      set({ user: data, checkingAuth: false });
    } catch {
      set({ user: null, checkingAuth: false });
    }
  },

  refreshToken: async () => {
    if (get().checkingAuth) return;

    set({ checkingAuth: true });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error();

      set({ checkingAuth: false });
      return data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },

  addBillingAddress: async (form) => {
    set({ loading: true });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/billing-address`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message);

      set((state) => ({
        user: state.user ? { ...state.user, address: form } : null,
        loading: false,
      }));

      toast.success("Address updated successfully!");
    } catch (error: any) {
      set({ loading: false });
      toast.error(
        error.message || "Some unexpected error occurred. Try again later!"
      );
    }
  },
}));

/* =======================
   Fetch Interceptor (401 Refresh)
======================= */

// let refreshPromise: Promise<any> | null = null;

// const originalFetch = window.fetch;

// (window as any).fetch = async (input: RequestInfo, init?: RequestInit) => {
//   const response = await originalFetch(input, {
//     credentials: "include",
//     ...init,
//   });

//   if (response.status !== 401) {
//     return response;
//   }

//   try {
//     if (!refreshPromise) {
//       refreshPromise = useUserStore.getState().refreshToken();
//       await refreshPromise;
//       refreshPromise = null;
//     } else {
//       await refreshPromise;
//     }

//     return originalFetch(input, {
//       credentials: "include",
//       ...init,
//     });
//   } catch (error) {
//     await useUserStore.getState().logout();
//     throw error;
//   }
// };
