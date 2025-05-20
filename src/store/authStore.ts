
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthStatus, User } from '@/types';

interface AuthState {
  status: AuthStatus;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  verifyCode: (code: string) => Promise<boolean>;
}

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+15551234567',
    password: 'password123',
    balance: 1250.75,
    isAdmin: true,
    createdAt: '2023-01-15T08:30:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+15559876543',
    password: 'password123',
    balance: 850.50,
    isAdmin: false,
    createdAt: '2023-02-20T10:15:00Z',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      status: 'unauthenticated',
      user: null,
      token: null,
      login: async (email, password) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({
            status: 'authenticated',
            user: userWithoutPassword,
            token: `mock-jwt-token-${Date.now()}`,
          });
        } else {
          throw new Error('Invalid credentials');
        }
      },
      register: async (name, email, phone, password) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user already exists
        if (mockUsers.some(user => user.email === email)) {
          throw new Error('User already exists');
        }
        
        // Create new user (in a real app this would be an API call)
        const newUser = {
          id: `${mockUsers.length + 1}`,
          name,
          email,
          phone,
          balance: 0,
          isAdmin: false,
          createdAt: new Date().toISOString(),
        };
        
        // In a real app, we would save this to a database
        // For now we'll just put them in the authenticated state
        set({
          status: 'authenticated',
          user: newUser,
          token: `mock-jwt-token-${Date.now()}`,
        });
      },
      logout: () => {
        set({
          status: 'unauthenticated',
          user: null,
          token: null,
        });
      },
      verifyCode: async (code) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Any code "123456" is valid in this mock
        return code === "123456";
      },
    }),
    {
      name: 'smartpay-auth',
      partialize: (state) => ({ token: state.token, user: state.user, status: state.status }),
    }
  )
);
