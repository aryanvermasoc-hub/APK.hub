import { create } from 'zustand';
import { supabase } from '../services/supabase';

const useAuthStore = create((set) => ({
  user: null,
  session: null,
  role: 'Guest', // Default role: Guest, Normal User, Developer

  setUser: (user) => {
    let role = 'Guest';
    if (user) {
       // Assuming you will store the role in Supabase user_metadata
       role = user.user_metadata?.role || 'Normal User';
    }
    set({ user, role });
  },

  setSession: (session) => set({ session }),
  setRole: (role) => set({ role }),

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, role: 'Guest' });
  },
}));

export default useAuthStore;