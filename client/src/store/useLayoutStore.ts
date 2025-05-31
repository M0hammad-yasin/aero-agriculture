import { create } from 'zustand';
import { User } from '../models/auth-model';

interface LayoutState {
  collapsed: boolean;
  user: User | null;
  toggleSidebar: () => void;
  // Add other shared state properties and actions here if needed
}
export const useLayoutStore = create<LayoutState>((set) => (
  
  {
    user:null,
  collapsed: false,
  toggleSidebar: () => set((state) => ({ collapsed: !state.collapsed })),
}));