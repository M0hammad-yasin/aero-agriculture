import { create } from 'zustand';

interface LayoutState {
  collapsed: boolean;
  toggleSidebar: () => void;
  // Add other shared state properties and actions here if needed
}
export const useLayoutStore = create<LayoutState>((set) => (
  
  {
  collapsed: false,
  toggleSidebar: () => set((state) => ({ collapsed: !state.collapsed })),
}));