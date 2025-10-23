//identificacion de quien esta logeado 
import { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole } from '../types';

// Datos de usuario simulados para el login
const MOCK_USERS: Record<string, User> = {
  'admin@pizzeria.com': { id: 'u1', username: 'Admin User', email: 'admin@pizzeria.com', role: 'admin' },
  'empleado@pizzeria.com': { id: 'u2', username: 'Empleado Uno', email: 'empleado@pizzeria.com', role: 'employee' },
  'cliente@pizzeria.com': { id: 'u3', username: 'Cliente Fiel', email: 'cliente@pizzeria.com', role: 'customer' },
};

// Define la forma del contexto
interface AuthContextType {
  user: User | null;
  login: (email: string) => boolean; // Simulación de login
  logout: () => void;
}

// Crea el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define el "Proveedor" del contexto, que envolverá la aplicación
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Función de login simulada
  const login = (email: string) => {
    const foundUser = MOCK_USERS[email.toLowerCase()];
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    setUser(null);
    return false;
  };

  // Función de logout
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para acceder fácilmente al contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}