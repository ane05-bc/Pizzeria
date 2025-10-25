import { ShoppingCart, Star, MapPin, Info, Utensils, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Logo } from '@/components/common/Logo';

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

  const getLinkClassName = (section: SectionId) => {
    return `flex items-center gap-2 text-lg font-medium transition-colors px-3 py-2 rounded-md cursor-pointer ${
      activeSection === section 
        ? 'text-yellow-300' 
        : 'text-white hover:text-yellow-300' 
    }`;
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