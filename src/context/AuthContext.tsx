import { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { User, UserRole } from '../types';

// Define la forma del contexto
interface AuthContextType {
  user: User | null;
  access_token: string | null;
  sessionId: string | null;
  login: (data: { user: User; access_token: string; sessionId: string }) => void;
  logout: () => void;
}

// Crea el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log('AuthProvider renderizado');
  const [user, setUser] = useState<User | null>(null);
  const [access_token, setAccessToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Función de login actualizada
  const login = (data: { user: User; access_token: string; sessionId: string }) => {
    setUser(data.user);
    setAccessToken(data.access_token);
    setSessionId(data.sessionId);
    // Opcional: Guardar en localStorage para persistencia
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('sessionId', data.sessionId);
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setSessionId(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('sessionId');
  };

  const value = useMemo(
    () => ({ user, access_token, sessionId, login, logout }),
    [user, access_token, sessionId]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}