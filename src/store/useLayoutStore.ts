import { create } from 'zustand';

// Mock user data - replace with actual user data from authentication system
const mockUser = {
  name: 'Demo User',
  image: ''
};

interface LayoutState {
  collapsed: boolean;
  user: { name: string; image?: string } | null;
  toggleSidebar: () => void;
  // Add other shared state properties and actions here if needed
}

export const useLayoutStore = create<LayoutState>((set) => ({
  collapsed: false,
  user: mockUser, // Initialize with mock user data
  toggleSidebar: () => set((state) => ({ collapsed: !state.collapsed })),
}));