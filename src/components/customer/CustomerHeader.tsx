import { Logo } from '@/components/common/Logo';
import { Info, MapPin, MessageSquare, ShoppingCart, Star, Utensils } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export type SectionId = 'menu' | 'reviews' | 'location' | 'about';

interface CustomerHeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onNavigate: (section: SectionId) => void; 
  activeSection: SectionId;
  currentView: 'menu' | 'reviews' | 'location' | 'about' | 'cart'; 
}

export function CustomerHeader({ 
  cartItemCount, 
  onCartClick,
  onNavigate,
  activeSection,
  currentView
}: CustomerHeaderProps) {

  // LÓGICA DE SCROLL (Más sensible y corrige el espacio superior)
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Usamos 1px o 20px para que el efecto se vea al iniciar el scroll
      setIsScrolled(window.scrollY > 20); 
    };

    // Esto corrige el posible espacio superior al inicio de la carga
    document.body.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    handleScroll(); 
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Estilo elegante de las pestañas (dorado con hover sutil)
  const getLinkClassName = (section: SectionId) => {
    return `
      flex items-center gap-2 text-lg font-medium px-3 py-2 rounded-md cursor-pointer 
      transition-all duration-300 ease-in-out
      ${activeSection === section 
        // Pestaña activa
        ? 'text-yellow-300 bg-black/10' 
        // <<<< CORRECCIÓN HOVER: Fondo sutil y texto dorado claro para el efecto
        : 'text-white hover:text-yellow-200 hover:bg-black/10' 
      }
    `;
  };

  const showBadge = cartItemCount > 0 && currentView !== 'cart';

  return (
    // <<<< AJUSTES DEL HEADER: Se mantiene el guinda, se añaden transiciones y transparencia al scroll.
    <header 
      className={`
        bg-gradient-to-r from-red-header to-red-header 
        text-white sticky top-0 z-50 shadow-xl p-0 w-full
        transition-all duration-300
        ${isScrolled 
          // <<<< CORRECCIÓN SCROLL: Al hacer scroll, forzamos un fondo semi-transparente sobre el gradiente
          ? 'rounded-b-xl opacity-95 backdrop-blur-sm' 
          : 'rounded-b-none'
        }
      `}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo y Título */}
          <Logo />
          
          {/* Navegación: Ocupa más espacio */}
          <nav className="flex space-x-8"> 
            <a onClick={() => onNavigate('menu')} className={getLinkClassName('menu')}>
              <Utensils className="w-5 h-5" /> Menú
            </a>
            <a onClick={() => onNavigate('reviews')} className={getLinkClassName('reviews')}>
              <MessageSquare className="w-5 h-5" /> Reseñas
            </a>
            <a onClick={() => onNavigate('location')} className={getLinkClassName('location')}>
              <MapPin className="w-5 h-5" /> Ubicación
            </a>
            <a onClick={() => onNavigate('about')} className={getLinkClassName('about')}>
              <Info className="w-5 h-5" /> Quiénes Somos
            </a>
          </nav>
          
          <div className="flex items-center gap-4">
            {/* Calificación de estrellas */}
            <div className="flex items-center text-yellow-300">
              <Star className="w-5 h-5 fill-yellow-300 mr-1" />
              <span className="font-bold">4.8</span>
            </div>
            
            {/* Botón Carrito: Elegante, compacto y visible */}
            <Button 
              onClick={onCartClick}
              // Fondo llamativo (dorado/amarillo) para que el ícono se destaque
              className="bg-yellow-400 hover:bg-yellow-300 px-4 py-2 rounded-full relative transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {/* <<<< CORRECCIÓN COLOR LOGO: Forzamos el color del ícono al guinda/rojo fuerte */}
              <ShoppingCart className="w-5 h-5 text-red-header font-bold" />
              
              {showBadge && ( 
                <Badge className="absolute -top-2 -right-2 bg-red-header text-yellow-400 px-2 min-w-[24px] flex justify-center shadow-sm">
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