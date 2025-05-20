
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  isAdmin: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
}

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';
