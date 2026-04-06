import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/app/lib/supabase";

interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      login: async (username: string, password: string) => {
        try {
          // Query user from Supabase
          const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

          if (userError || !user) {
            return { success: false, error: 'Invalid credentials' };
          }

          // Check password (using bcrypt compare via API)
          const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          });

          if (!response.ok) {
            return { success: false, error: 'Invalid credentials' };
          }

          const data = await response.json();
          
          set({ 
            user: data.user, 
            token: data.access_token, 
            isAuthenticated: true 
          });

          return { success: true };
        } catch (err: any) {
          return { success: false, error: err.message };
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
