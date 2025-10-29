import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import type { ReactElement } from 'react';


// 1. IMPORTAR useAuth aquí
import { useAuth } from './context/AuthContext'; 
import { Login } from './components/auth/Login'; 
import { AdminSidebar } from './components/AdminSidebar'; 
import { CustomerView } from './components/customer/CustomerView'; 

// Vistas de Admin
import { Orders } from './components/admin/Orders'; 
import { Menu } from './components/admin/Menu'; 
import { Reservations } from './components/admin/Reservations'; 
import { Inventory } from './components/admin/Inventory'; 
import { Purchases } from './components/admin/Purchases'; 
import { UserManagement } from './components/admin/UserManagement'; 
import { Logs } from './components/admin/Logs'; 


// --- Componente auxiliar: Layout de Administrador ---
// (No se necesitan cambios aquí)
function AdminLayout() {
  const { user, logout } = useAuth();
  const [adminView, setAdminView] = useState('orders');

  const adminViewComponent = useMemo(() => {
    switch (adminView) {
      case 'orders':
        return <Orders />;
      case 'menu':
        return <Menu />;
      case 'reservations':
        return <Reservations />;
      case 'userManagement':
        return <UserManagement />;
      case 'inventory':
        return <Inventory />;
      case 'purchases':
        return <Purchases />;
      case 'logs':
        return <Logs />;
      default:
        return <Orders />;
    }
  }, [adminView]);

  return (
    <div className="min-h-screen bg-orange-50 flex">
      <AdminSidebar 
          currentView={adminView} 
          onViewChange={setAdminView} 
          onLogout={logout}
          userName={user?.email || 'Admin/Empleado'} 
      />
      <div className="flex-1 overflow-auto h-screen p-4">
        {adminViewComponent}
      </div>
    </div>
  );
}

// --- Componente auxiliar: Protección de Rutas ---
// (No se necesitan cambios aquí. La lógica es segura
// gracias al control de carga en App)
type ProtectedRouteProps = {
  children: ReactElement;
  roles: string[];
};

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/iniciar-sesion" replace />;
  }
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />; 
  }
  return children;
};

// --- Componente auxiliar: Redirección de Login ---
// (No se necesitan cambios aquí)
type LoginRouteProps = {
    children: ReactElement;
};

const LoginRoute = ({ children }: LoginRouteProps) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === 'customer' ? '/' : '/admin'} replace />;
  }
  return children;
};


// --- Componente Principal: App ---
export default function App() {
  
  // 2. OBTENER EL ESTADO DE CARGA DEL CONTEXTO
  const { isLoading } = useAuth();

  // 3. MOSTRAR UN INDICADOR DE CARGA MIENTRAS SE VERIFICA LA SESIÓN
  // Esto evita el "parpadeo" de redirección antes de 
  // cargar el usuario desde localStorage.
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-orange-50">
        {/* Aquí puedes poner tu logo o un spinner */}
        <p className="text-lg font-medium text-orange-700 animate-pulse">
          Cargando Mr. Pizza...
        </p>
      </div>
    );
  }

  // 4. UNA VEZ CARGADO (isLoading === false), RENDERIZAR LAS RUTAS
  // (El <BrowserRouter> debe estar aquí si App.tsx es tu componente raíz,
  // o en main.tsx si envuelve a <App />)
  return (
    <BrowserRouter> 
      <Routes>
        
        {/* RUTA PÚBLICA / VISTA DE CLIENTE */}
        <Route path="/" element={<CustomerView />} /> 
        
        {/* RUTA DE INICIO DE SESIÓN */}
        <Route 
          path="/iniciar-sesion" 
          element={<LoginRoute><Login /></LoginRoute>} 
        />
        
        {/* RUTA PROTEGIDA (ADMIN/EMPLEADO) */}
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin', 'employee']}>
            <AdminLayout />
          </ProtectedRoute>
        }/>
        
        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}
