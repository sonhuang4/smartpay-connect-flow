
import { createBrowserRouter, Navigate, Outlet, RouteObject } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

// Pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Transfer from '@/pages/Transfer';
import AdminPanel from '@/pages/AdminPanel';
import NotFound from '@/pages/NotFound';

// Layout components
const AuthLayout = () => {
  const { status } = useAuthStore();
  
  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
};

const ProtectedLayout = () => {
  const { status } = useAuthStore();
  
  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

const AdminLayout = () => {
  const { user } = useAuthStore();
  
  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
};

// Route definitions
const routes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
    ],
  },
  {
    element: <ProtectedLayout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/transfer', element: <Transfer /> },
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin', element: <AdminPanel /> },
        ],
      },
    ],
  },
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '*', element: <NotFound /> },
];

export const router = createBrowserRouter(routes);
