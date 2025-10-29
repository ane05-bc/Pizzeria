import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Plus, Minus } from 'lucide-react';

interface Pizza {
  id: string;
  name: string;
  description: string;
  image: string;
  price?: number;  // ← ya no usamos "sizes", solo un precio
  category?: string;
}

interface PizzaCardProps {
  pizza: Pizza;
  onAddToCart: (pizzaId: string, size: 'small' | 'medium' | 'large', quantity: number) => void;
}

export function PizzaCard({ pizza, onAddToCart }: PizzaCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [quantity, setQuantity] = useState(1);

  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ Función para calcular el precio total
  const getCurrentPrice = () => {
    // Usa el precio del backend o un valor base de 10
    const basePrice = pizza.price ?? 10;

    // Multiplica por un factor dependiendo del tamaño seleccionado
    const sizeMultiplier =
      selectedSize === 'small' ? 1 :
      selectedSize === 'medium' ? 1.3 :
      1.6;

    return basePrice * sizeMultiplier * quantity;
  };

  // ✅ Añadir al carrito (con control de sesión)
  const handleAddToCart = () => {
    if (!user) {
      navigate('/iniciar-sesion');
      setIsDialogOpen(false);
      return;
    }

    onAddToCart(pizza.id, selectedSize, quantity);
    setIsDialogOpen(false);
    setSelectedSize('medium');
    setQuantity(1);
  };

  return (
    <>
      <Card className="border-orange-200 bg-white overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div
          className="relative h-56 overflow-hidden"
          onClick={() => setIsDialogOpen(true)}
        >
          <ImageWithFallback
            src={pizza.image}
            alt={pizza.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
          {pizza.category && (
            <Badge className="absolute top-3 left-3 bg-orange-600">
              {pizza.category}
            </Badge>
          )}
        </div>
        <CardHeader>
          <CardTitle className="text-orange-900">{pizza.name}</CardTitle>
          <p className="text-orange-600">{pizza.description}</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-orange-700">Precio base</p>
              <p className="text-orange-900">
                €{(pizza.price ?? 10).toFixed(2)}
              </p>
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Personalizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 🔸 Modal de personalización */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-orange-900">{pizza.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="relative h-64 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={pizza.image}
                alt={pizza.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Selección de tamaño */}
            <div>
              <Label className="text-orange-900 mb-3 block">Selecciona el tamaño</Label>
              <div className="grid grid-cols-3 gap-3">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedSize === size
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-orange-200 hover:border-orange-400'
                    }`}
                  >
                    <p className="text-orange-900 capitalize">
                      {size === 'small'
                        ? 'Pequeña'
                        : size === 'medium'
                        ? 'Mediana'
                        : 'Grande'}
                    </p>
                    <p className="text-orange-600">
                      €{(pizza.price
                        ? (pizza.price *
                            (size === 'small'
                              ? 1
                              : size === 'medium'
                              ? 1.3
                              : 1.6)).toFixed(2)
                        : (10 *
                            (size === 'small'
                              ? 1
                              : size === 'medium'
                              ? 1.3
                              : 1.6)).toFixed(2))}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Cantidad */}
            <div>
              <Label className="text-orange-900 mb-3 block">Cantidad</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border-orange-300 text-orange-700"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-orange-900 w-12 text-center">{quantity}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="border-orange-300 text-orange-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Total */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex justify-between items-center">
                <span className="text-orange-900">Total</span>
                <span className="text-orange-900">€{getCurrentPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-orange-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddToCart}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {!user ? 'Iniciar Sesión para Agregar' : 'Agregar al Carrito'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
