import { 
  createContext, 
  useState, 
  useContext, 
  ReactNode, 
  useMemo, 
  useEffect // 👈 1. Importar useEffect
} from 'react';
import { User, UserRole } from '../types';

// Datos de usuario simulados (sin cambios)
const MOCK_USERS: Record<string, User> = {
  'admin@pizzeria.com': { id: 'u1', username: 'Admin User', email: 'admin@pizzeria.com', role: 'admin' },
  'empleado@pizzeria.com': { id: 'u2', username: 'Empleado Uno', email: 'empleado@pizzeria.com', role: 'employee' },
  'cliente@pizzeria.com': { id: 'u3', username: 'Cliente Fiel', email: 'cliente@pizzeria.com', role: 'customer' },
};

// 2. Añadir 'isLoading' al tipo de contexto
interface AuthContextType {
  user: User | null;
  isLoading: boolean; // Para saber si estamos verificando la sesión inicial
  login: (email: string) => boolean; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Definimos una clave única para guardar en localStorage
const AUTH_STORAGE_KEY = 'mr_pizza_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  // 3. Añadir estado de carga. Inicia en 'true'.
  const [isLoading, setIsLoading] = useState(true); 

  // 4. Hook de efecto para cargar el usuario desde localStorage
  // Se ejecuta SÓLO UNA VEZ, cuando el componente AuthProvider se monta.
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        // Si encontramos un usuario, lo ponemos en el estado
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error al leer de localStorage", error);
      // Si hay un error (ej. datos corruptos), limpiamos
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      // Importante: Marcamos la carga como finalizada,
      // haya o no haya usuario.
      setIsLoading(false); 
    }
  }, []); // El array vacío [] asegura que solo se ejecute al montar

  // 5. Actualizar 'login' para que guarde en localStorage
  const login = (email: string) => {
    const foundUser = MOCK_USERS[email.toLowerCase()];
    if (foundUser) {
      setUser(foundUser);
      try {
        // Guardamos el usuario en localStorage
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(foundUser));
      } catch (error) {
        console.error("Error al guardar en localStorage", error);
      }
      return true;
    }
    // Si falla el login, nos aseguramos de limpiar
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return false;
  };

  // 6. Actualizar 'logout' para que limpie localStorage
  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error("Error al limpiar localStorage", error);
    }
  };

  // 7. Añadir 'isLoading' al valor del 'useMemo'
  const value = useMemo(
    () => ({ user, login, logout, isLoading }),
    [user, isLoading] // Añadir 'isLoading' a las dependencias
  );
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// El hook 'useAuth' se mantiene exactamente igual
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}