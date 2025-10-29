import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Trash2, ShoppingBag, CreditCard, Banknote, Building2, ArrowLeft } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { CartItem } from '../../types';

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
  const [pizzas, setPizzas] = useState<any[]>([]); // <- pizzas obtenidas del backend

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 3.5;
  const total = subtotal + delivery;

  // ✅ Conectar con la base de datos (API REST o backend)
  useEffect(() => {
    // Reemplaza la URL con tu endpoint real (por ejemplo, localhost:3000/pizzas o tu backend remoto)
    fetch('http://localhost:3000/api/pizzas')
      .then((res) => res.json())
      .then((data) => setPizzas(data))
      .catch((err) => console.error('Error cargando pizzas:', err));
  }, []);

  const handleCheckout = () => {
    if (!deliveryAddress.trim()) {
      alert('Por favor, ingresa una dirección de entrega');
      return;
    }
    onCheckout(paymentMethod, deliveryAddress, comments);
  };

  if (items.length === 0) {
    return (
      <div className="p-8 bg-orange-50/30 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <Card className="border-orange-200 bg-white text-center py-12">
            <CardContent>
              <ShoppingBag className="w-16 h-16 text-orange-300 mx-auto mb-4" />
              <h3 className="text-orange-900 mb-2">Tu carrito está vacío</h3>
              <p className="text-orange-600">Agrega algunas pizzas deliciosas para comenzar</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-orange-200 bg-white">
              <CardHeader>
                <CardTitle className="text-orange-900">Productos ({items.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => {
                  const pizzaInfo = pizzas.find((p) => p.id === item.productId);

                  return (
                    <div key={`${item.productId}-${item.size}-${index}`}>
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={pizzaInfo?.imagen || item.image}
                            alt={pizzaInfo?.nombre || item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-orange-900">
                                {pizzaInfo?.nombre || item.name}
                              </h4>
                              {item.size && (
                                <Badge variant="outline" className="border-orange-300 text-orange-700 mt-1">
                                  {item.size}
                                </Badge>
                              )}
                              <p className="text-orange-700 mt-1">
                                Cantidad: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-orange-900">
                                €{(item.price * item.quantity).toFixed(2)}
                              </p>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onRemoveItem(item.productId, item.size)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < items.length - 1 && <Separator className="mt-4 bg-orange-100" />}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Información de entrega */}
            <Card className="border-orange-200 bg-white">
              <CardHeader>
                <CardTitle className="text-orange-900">Información de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address" className="text-orange-900">
                    Dirección de Entrega *
                  </Label>
                  <Input
                    id="address"
                    placeholder="Calle, número, piso..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="border-orange-200 mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="comments" className="text-orange-900">
                    Comentarios (opcional)
                  </Label>
                  <Textarea
                    id="comments"
                    placeholder="Instrucciones especiales..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="border-orange-200 mt-2"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <Card className="border-orange-200 bg-white sticky top-24">
              <CardHeader>
                <CardTitle className="text-orange-900">Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-orange-700">
                    <span>Subtotal</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-orange-700">
                    <span>Envío</span>
                    <span>€{delivery.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-orange-200" />
                  <div className="flex justify-between text-orange-900">
                    <span>Total</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="bg-orange-200" />

                <div>
                  <Label className="text-orange-900 mb-3 block">Método de Pago</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-orange-200 hover:bg-orange-50">
                      <RadioGroupItem value="Tarjeta" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard className="w-4 h-4 text-orange-600" />
                        <span className="text-orange-900">Tarjeta</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-orange-200 hover:bg-orange-50">
                      <RadioGroupItem value="Efectivo" id="cash" />
                      <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Banknote className="w-4 h-4 text-orange-600" />
                        <span className="text-orange-900">Efectivo</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-orange-200 hover:bg-orange-50">
                      <RadioGroupItem value="Transferencia" id="transfer" />
                      <Label htmlFor="transfer" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Building2 className="w-4 h-4 text-orange-600" />
                        <span className="text-orange-900">Transferencia</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button onClick={handleCheckout} className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
                  Confirmar Pedido
                </Button>

                <p className="text-orange-600 text-center">
                  Tiempo estimado de entrega: 30–45 min
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
