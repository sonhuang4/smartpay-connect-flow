
import { create } from 'zustand';
import { Transaction } from '@/types';
import { useAuthStore } from './authStore';

interface WalletState {
  transactions: Transaction[];
  pendingTransfers: Transaction[];
  allUsers: { id: string; name: string; email: string; phone: string }[];
  getBalance: () => number;
  topUp: (amount: number) => Promise<void>;
  transfer: (recipientIdentifier: string, amount: number, note: string) => Promise<void>;
  getAllTransactions: () => Transaction[];
  getUserTransactions: (userId: string) => Transaction[];
}

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: 't1',
    senderId: '1',
    senderName: 'John Doe',
    recipientId: '2',
    recipientName: 'Jane Smith',
    amount: 150,
    status: 'completed',
    timestamp: '2023-05-10T14:30:00Z',
  },
  {
    id: 't2',
    senderId: '2',
    senderName: 'Jane Smith',
    recipientId: '1',
    recipientName: 'John Doe',
    amount: 75.5,
    status: 'completed',
    timestamp: '2023-05-15T09:45:00Z',
  },
  {
    id: 't3',
    senderId: '1',
    senderName: 'John Doe',
    recipientId: '2',
    recipientName: 'Jane Smith',
    amount: 220,
    status: 'completed',
    timestamp: '2023-05-20T16:15:00Z',
  },
];

// Mock users for transfer
const mockAllUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+15551234567' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+15559876543' },
  { id: '3', name: 'Alice Johnson', email: 'alice@example.com', phone: '+15553334444' },
  { id: '4', name: 'Bob Williams', email: 'bob@example.com', phone: '+15556667777' },
];

export const useWalletStore = create<WalletState>((set, get) => ({
  transactions: mockTransactions,
  pendingTransfers: [],
  allUsers: mockAllUsers,
  
  getBalance: () => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return 0;
    
    const userId = currentUser.id;
    const transactions = get().transactions;
    
    let balance = currentUser.balance || 0;
    
    // This would be handled by the backend in a real app
    // Just for demo purposes to show transactions affect balance
    transactions.forEach(t => {
      if (t.recipientId === userId && t.status === 'completed') {
        balance += t.amount;
      }
      if (t.senderId === userId && t.status === 'completed') {
        balance -= t.amount;
      }
    });
    
    return balance;
  },
  
  topUp: async (amount) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) throw new Error('Not authenticated');
    
    // Create a transaction
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      senderId: 'system',
      senderName: 'Top Up',
      recipientId: currentUser.id,
      recipientName: currentUser.name,
      amount,
      status: 'completed',
      timestamp: new Date().toISOString(),
    };
    
    // Add to transactions
    set(state => ({
      transactions: [...state.transactions, newTransaction]
    }));
  },
  
  transfer: async (recipientIdentifier, amount, note) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) throw new Error('Not authenticated');
    
    // Find recipient by email or phone
    const recipient = get().allUsers.find(
      u => u.email === recipientIdentifier || u.phone === recipientIdentifier
    );
    
    if (!recipient) throw new Error('Recipient not found');
    
    // Check if user has enough balance
    const currentBalance = get().getBalance();
    if (currentBalance < amount) {
      throw new Error('Insufficient balance');
    }
    
    // Create a transaction
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      recipientId: recipient.id,
      recipientName: recipient.name,
      amount,
      status: 'completed',
      timestamp: new Date().toISOString(),
    };
    
    // Add to transactions
    set(state => ({
      transactions: [...state.transactions, newTransaction]
    }));
  },
  
  getAllTransactions: () => {
    return get().transactions;
  },
  
  getUserTransactions: (userId) => {
    return get().transactions.filter(
      t => t.senderId === userId || t.recipientId === userId
    );
  },
}));
