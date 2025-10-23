import { useState } from 'react';
import { useAuth } from './context/AuthContext'; // Importar hook
import { Login } from './components/auth/Login'; // Importar Login
import { AdminSidebar } from './components/AdminSidebar';
import { Dashboard } from './components/admin/Dashboard';
import { Orders } from './components/admin/Orders';
import { Menu } from './components/admin/Menu';
import { Reservations } from './components/admin/Reservations';
import { Inventory } from './components/admin/Inventory';
import { Purchases } from './components/admin/Purchases';
import { UserManagement } from './components/admin/UserManagement'; // Importar nuevo
import { Logs } from './components/admin/Logs'; // Importar nuevo
import { CustomerView } from './components/customer/CustomerView';

// (Los componentes Customers y Employees ya no se importan)

export default function App() {
  const { user } = useAuth(); // Obtener el usuario del contexto
  const [adminView, setAdminView] = useState('dashboard');

  const renderAdminView = () => {
    switch (adminView) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <Orders />;
      case 'menu':
        return <Menu />;
      case 'reservations':
        return <Reservations />;
      case 'userManagement': // Nuevo case
        return <UserManagement />;
      case 'inventory':
        return <Inventory />;
      case 'purchases':
        return <Purchases />;
      case 'logs': // Nuevo case
        return <Logs />;
      default:
        return <Dashboard />;
    }
  };

  // 1. Si no hay usuario, mostrar Login
  if (!user) {
    return <Login />;
  }

  // 2. Si el usuario es cliente, mostrar CustomerView
  if (user.role === 'customer') {
    return (
      <div className="min-h-screen bg-orange-50">
        <CustomerView />
        {/* Aquí podrías agregar un header de cliente con botón de logout */}
      </div>
    );
  }

  // 3. Si el usuario es admin o empleado, mostrar Admin Layout
  if (user.role === 'admin' || user.role === 'employee') {
    return (
      <div className="min-h-screen bg-orange-50 flex">
        <AdminSidebar currentView={adminView} onViewChange={setAdminView} />
        <div className="flex-1 overflow-auto h-screen">
          {renderAdminView()}
        </div>
      </div>
    );
  }

  // Fallback (no debería ocurrir)
  return <div>Error de autenticación.</div>;
}