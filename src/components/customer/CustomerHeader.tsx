import { 
  ShoppingCart, 
  Star, 
  MapPin, 
  Info, 
  Utensils, 
  MessageSquare,
  LogIn,
  LogOut // 👈 1. IMPORTAR el ícono para "Cerrar Sesión"
} from 'lucide-react';

import { useNavigate } from 'react-router-dom'; 
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Logo } from '@/components/common/Logo';
import { useAuth } from '@/context/AuthContext';

// 👈 2. IMPORTAR el hook de autenticación
// (Asegúrate de que la ruta sea correcta)

export type SectionId = 'menu' | 'reviews' | 'location' | 'about';

interface CustomerHeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onNavigate: (section: SectionId) => void; 
  activeSection: SectionId;
}

export function CustomerHeader({ 
  cartItemCount, 
  onCartClick,
  onNavigate,
  activeSection
}: CustomerHeaderProps) {

  const navigate = useNavigate();

  // 👈 3. OBTENER el estado del usuario y la función de logout
  const { user, logout } = useAuth();

  const getLinkClassName = (section: SectionId) => {
    return `flex items-center gap-2 text-lg font-medium transition-colors px-3 py-2 rounded-md cursor-pointer ${
      activeSection === section 
        ? 'text-yellow-300' 
        : 'text-white hover:text-yellow-300' 
    }`;
  };

  const handleLoginClick = () => {
    navigate('/iniciar-sesion');
  };

  // 👈 4. FUNCIÓN para manejar el "Cerrar Sesión"
  const handleLogoutClick = () => {
    logout(); // Llama a la función del contexto
  };

  return (
    <header className="bg-gradient-to-r from-red-header to-red-header text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={80} rounded bordered />
            <div>
              <h1 className="tracking-tight">Mr. Pizza</h1>
              <p className="text-orange-100 opacity-90"> ¡El Señor Sabor!</p>
            </div>
          </div>
          
          <nav>
            <ul className="flex items-center gap-6">
              {/* ... (links de navegación: Menú, Reseñas, etc.) ... */}
              <li>
                <a onClick={() => onNavigate('menu')} className={getLinkClassName('menu')}>
                  <Utensils className="w-5 h-5" /> Menú
                </a>
              </li>
              <li>
                <a onClick={() => onNavigate('reviews')} className={getLinkClassName('reviews')}>
                  <MessageSquare className="w-5 h-5" /> Reseñas
                </a>
              </li>
              <li>
                <a onClick={() => onNavigate('location')} className={getLinkClassName('location')}>
                  <MapPin className="w-5 h-5" /> Ubicación
                </a>
              </li>
              <li>
                <a onClick={() => onNavigate('about')} className={getLinkClassName('about')}>
                  <Info className="w-5 h-5" /> Sobre Nosotros
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span className='text-white'>4.8 ( 100 reseñas)</span>
            </div>

            {/* === 5. RENDERIZADO CONDICIONAL === */}
            {user ? (
              // 5A. Si el usuario ESTÁ logueado:
              <>
                <Button
                  onClick={handleLogoutClick}
                  className="bg-gray-700 text-white hover:bg-gray-600"
                  variant="secondary"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              // 5B. Si el usuario NO está logueado:
              <Button
                onClick={handleLoginClick} 
                className="bg-orange-600 text-white hover:bg-orange-700"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Iniciar Sesión
              </Button>
            )}
            {/* ================================== */}
            
            <Button 
              onClick={onCartClick}
              variant="secondary"
              className="bg-white text-orange-600 hover:bg-orange-50 relative"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Carrito
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 px-2">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}