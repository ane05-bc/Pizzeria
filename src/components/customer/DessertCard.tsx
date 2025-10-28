import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { Dessert } from '../../types';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';

interface DessertCardProps {
  dessert: Dessert;
  onAddDessertToCart: (dessertId: string, quantity: number) => void;
}

export function DessertCard({ dessert, onAddDessertToCart }: DessertCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddDessertToCart(dessert.id, quantity);
    setIsDialogOpen(false);
    setQuantity(1);
  };

  const getCurrentPrice = () => {
    return dessert.price * quantity;
  };

  return (
    <>
      <Card className="border-orange-200 bg-white overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div 
          className="relative h-56 overflow-hidden"
          onClick={() => setIsDialogOpen(true)}
        >
          <ImageWithFallback
            src={dessert.image}
            alt={dessert.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
          <Badge className="absolute top-3 left-3 bg-orange-600">
            {dessert.category}
          </Badge>
        </div>
        <CardHeader>
          <CardTitle className="text-orange-900">{dessert.name}</CardTitle>
          <p className="text-orange-600">{dessert.description}</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-orange-700">Precio</p>
              <p className="text-orange-900">€{dessert.price.toFixed(2)}</p>
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

      {/* Customization Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-orange-900">{dessert.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="relative h-56 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={dessert.image}
                alt={dessert.name}
                className="w-full h-full object-cover"
              />
            </div>

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
              Agregar al Carrito
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}