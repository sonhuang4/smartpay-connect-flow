
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useWalletStore } from '@/store/walletStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Search, User } from 'lucide-react';
import { User as UserType } from '@/types';

// Mock users for admin panel
const mockUsers: UserType[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+15551234567',
    balance: 1250.75,
    isAdmin: true,
    createdAt: '2023-01-15T08:30:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+15559876543',
    balance: 850.50,
    isAdmin: false,
    createdAt: '2023-02-20T10:15:00Z',
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+15553334444',
    balance: 525.25,
    isAdmin: false,
    createdAt: '2023-03-05T14:20:00Z',
  },
  {
    id: '4',
    name: 'Bob Williams',
    email: 'bob@example.com',
    phone: '+15556667777',
    balance: 1100.00,
    isAdmin: false,
    createdAt: '2023-03-12T11:45:00Z',
  },
  {
    id: '5',
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '+15552223333',
    balance: 750.50,
    isAdmin: false,
    createdAt: '2023-04-08T09:30:00Z',
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const UserList = () => {
  const { user: currentUser } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <User className="mr-2 h-5 w-5" />
          User Management
        </CardTitle>
        <CardDescription>View and manage all registered users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email or phone"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className={user.id === currentUser?.id ? 'bg-muted/50' : ''}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
                        <span className="text-primary text-xs">{user.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        {user.name}
                        {user.id === currentUser?.id && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{user.email}</div>
                        <div className="text-muted-foreground">{user.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      ${user.balance.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {user.isAdmin ? (
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border-blue-200">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                          User
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDate(user.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserList;
