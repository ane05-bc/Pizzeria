import { Pizza, ShoppingCart, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface CustomerHeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export function CustomerHeader({ cartItemCount, onCartClick }: CustomerHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-orange-600 to-orange-700 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Pizza className="w-10 h-10" />
            <div>
              <h1 className="tracking-tight">La Pizzería</h1>
              <p className="text-orange-100 opacity-90">Auténtica pizza artesanal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span>4.8 (256 reseñas)</span>
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
