import { ArrowLeft, Banknote, CheckCircle, CreditCard, MapPin, ShoppingBag, Trash2 } from 'lucide-react'; // <<<< ADICIÓN: Importamos CheckCircle
import { useState } from 'react';
import { CartItem } from '../../types';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';

interface CartProps {
  items: CartItem[];
  onRemoveItem: (productId: string, size?: string) => void;
  onClearCart: () => void;
  onCheckout: (paymentMethod: string, deliveryAddress: string, comments: string) => void;
  onBackToMenu: () => void;
}

export function Cart({ items, onRemoveItem, onClearCart, onCheckout, onBackToMenu }: CartProps) {
  const [paymentMethod, setPaymentMethod] = useState('Tarjeta');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [comments, setComments] = useState('');
  // <<<< ADICIÓN: Estado para controlar la vista de éxito
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false); 

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 3.50;
  const total = subtotal + delivery;

  const handleCheckout = () => {
    if (!deliveryAddress.trim()) {
      // Mantenemos esta alerta nativa para la validación (se puede mejorar más adelante)
      alert('Por favor, ingresa una dirección de entrega'); 
      return;
    }
    
    // Ejecutamos el checkout (que vacía el carrito en CustomerView.tsx)
    onCheckout(paymentMethod, deliveryAddress, comments); 
    
    // <<<< MODIFICACIÓN: Activamos el mensaje de éxito
    setIsOrderConfirmed(true);
  };

  // <<<< ADICIÓN: Renderizar la vista de éxito si el pedido fue confirmado
  if (isOrderConfirmed) {
    return (
      <div className="p-8 bg-orange-50/30 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <Card className="border-green-300 bg-white text-center py-16 shadow-xl">
            <CardContent>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h3 className="text-orange-900 text-3xl font-bold mb-3">¡Pedido Confirmado con Éxito!</h3>
              <p className="text-orange-700 text-lg max-w-lg mx-auto mb-6">
                Tu orden ha sido enviada a cocina. El total de €{total.toFixed(2)} será cobrado mediante {paymentMethod} y será entregado en {deliveryAddress} en un tiempo estimado de 30-45 minutos. ¡Gracias por tu compra! :D
              </p>
              <Button
                onClick={() => {
                  setIsOrderConfirmed(false); // Resetear estado para futuras compras
                  onBackToMenu(); // Navega de vuelta al menú
                }}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Volver al Menú
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  // FIN ADICIÓN

  // Vista de Carrito Vacío (solo si items.length === 0 Y no está confirmado)
  if (items.length === 0) {
    return (
      <div className="p-8 bg-orange-50/30 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <Card className="border-orange-200 bg-white text-center py-12">
            <CardContent>
              <ShoppingBag className="w-16 h-16 text-orange-300 mx-auto mb-4" />
              <h3 className="text-orange-900 mb-2">Tu carrito está vacío</h3>
              <p className="text-orange-600">Agrega algunas pizzas deliciosas para comenzar</p>
              <Button
                  onClick={onBackToMenu}
                  className="mt-6 bg-orange-600 hover:bg-orange-700"
                >
                  Ir al Menú
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Vista de Carrito con Productos (código original intacto)
  return (
    <div className="p-8 bg-orange-50/30 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={onBackToMenu}
            className="mb-6 flex items-center gap-2 text-orange-600 border-orange-600 hover:bg-orange-50 hover:text-orange-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Seguir comprando
          </Button>

          <Button 
            variant="outline" 
            onClick={onClearCart}
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            Vaciar Carrito
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna de ítems del carrito */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={`${item.productId}-${item.size || ''}`} className="flex p-4 border-orange-100 shadow-sm">
                <ImageWithFallback 
                  src={item.image} 
                  alt={item.name} 
                  className="w-20 h-20 object-cover rounded-md flex-shrink-0 mr-4"
                />
                <div className="flex-grow">
                  <h4 className="font-semibold text-orange-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    {item.type === 'pizza' && item.size && <Badge variant="secondary" className="bg-orange-100 text-orange-700 mr-2">{item.size}</Badge>}
                    {item.quantity} x €{item.price.toFixed(2)}
                  </p>
                  <p className="text-base font-bold text-orange-700 mt-1">Total: €{(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onRemoveItem(item.productId, item.size)}
                  className="text-red-500 hover:text-red-700 self-start"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </Card>
            ))}
          </div>
          
          {/* Columna de Resumen y Checkout */}
          <Card className="border-orange-200 bg-white p-6 lg:sticky lg:top-24 h-fit">
            <CardTitle className="text-xl font-bold text-orange-900 mb-4">Resumen del Pedido</CardTitle>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} productos)</span>
                <span className="font-medium text-orange-800">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="font-medium text-orange-800">€{delivery.toFixed(2)}</span>
              </div>
              <Separator className="my-3 bg-orange-100" />
              <div className="flex justify-between text-lg font-bold text-orange-900">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>

            <Separator className="my-6 bg-orange-100" />

            {/* Método de Pago */}
            <h3 className="text-md font-semibold text-orange-900 mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Método de Pago</h3>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={setPaymentMethod} 
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 border p-3 rounded-md has-[:checked]:bg-orange-50 has-[:checked]:border-orange-400">
                <RadioGroupItem value="Tarjeta" id="r1" />
                <Label htmlFor="r1" className="flex items-center gap-1">
                  Tarjeta
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded-md has-[:checked]:bg-orange-50 has-[:checked]:border-orange-400">
                <RadioGroupItem value="Efectivo" id="r2" />
                <Label htmlFor="r2" className="flex items-center gap-1">
                  <Banknote className="w-4 h-4" /> Efectivo
                </Label>
              </div>
            </RadioGroup>

            <Separator className="my-6 bg-orange-100" />

            {/* Dirección de Entrega y Comentarios */}
            <h3 className="text-md font-semibold text-orange-900 mb-3 flex items-center gap-2"><MapPin className="w-4 h-4" /> Detalles de Entrega</h3>
            <div className="space-y-4">
              <Label htmlFor="deliveryAddress" className="text-gray-600">Dirección Completa</Label>
              <Input 
                id="deliveryAddress"
                placeholder="Calle, número, piso, puerta..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
              <Label htmlFor="comments" className="text-gray-600">Comentarios para el Repartidor</Label>
              <Textarea
                id="comments"
                placeholder="Ej: Tocar el timbre dos veces, sin gluten, etc."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>

            <div className="mt-6">
              <Button 
                onClick={handleCheckout} 
                className="w-full bg-green-600 hover:bg-green-700" 
                disabled={items.length === 0}
              >
                Confirmar Pedido (Pagar €{total.toFixed(2)})
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}