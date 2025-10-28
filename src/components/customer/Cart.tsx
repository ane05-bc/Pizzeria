// src/components/Cart.tsx
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { CartItem, CreatePedidoDto } from '@/types';
import { Trash2 } from 'lucide-react';
import { createOrder } from '@/api/orders';
import { getIdProductoTamano } from '@/utils/pedido';

// Importa el enum desde types (o desde orders si lo exportas)
import { TipoPedido } from '@/types';

interface CartProps {
  items: CartItem[];
  onRemoveItem: (productId: string, size?: string) => void;
  onClearCart: () => void;
  onCheckout: (paymentMethod: string, deliveryAddress: string, comments: string) => void;
  onBackToMenu: () => void;
}

export function Cart({ items, onRemoveItem, onClearCart, onCheckout, onBackToMenu }: CartProps) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [comments, setComments] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCheckoutSubmit = async () => {
  if (!paymentMethod) {
    setError('Por favor, selecciona un método de pago.');
    return;
  }
  if (!deliveryAddress || deliveryAddress.trim().length < 5) {
    setError('Ingresa una dirección válida (mínimo 5 caracteres).');
    return;
  }
  if (items.length === 0) {
    setError('El carrito está vacío.');
    return;
  }

  try {
    const detalle = items.map((item) => {
      const idProductoTamano = getIdProductoTamano(item.productId, item.size);
      return {
        id_producto_tamano: idProductoTamano,  // ← número
        cantidad: item.quantity,               // ← número
        notas: item.size ? `Tamaño: ${item.size}` : undefined,
      };
    });

    const pedido: CreatePedidoDto = {
      id_cliente: undefined,
      id_empleado: 1,                        // ← número
      id_mesa: undefined,
      id_almacen: 1,                         // ← número
      tipo_pedido: TipoPedido.DOMICILIO,     // ← enum → string "Domicilio"
      descuento: undefined,
      direccion_entrega: deliveryAddress.trim(),
      notas: comments?.trim() || undefined,
      detalle,
    };

    console.log('Enviando pedido:', pedido);  // ← ¡REVISA ESTO!

    await createOrder(pedido);
    onCheckout(paymentMethod, deliveryAddress, comments);
    setError(null);
  } catch (err: any) {
    console.error('Error completo:', err);
    setError('Error al procesar el pedido. Revisa los datos.');
  }
};
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0) + 3.5;

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-orange-900 text-2xl mb-6">Tu Carrito</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      {items.length === 0 ? (
        <div className="text-center text-orange-700">
          <p>Tu carrito está vacío.</p>
          <Button
            onClick={onBackToMenu}
            className="mt-4 bg-orange-600 hover:bg-orange-700"
          >
            Volver al Menú
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {items.map((item, index) => (
              <div
                key={`${item.productId}-${item.size || index}`}
                className="flex items-center justify-between border-b border-orange-200 py-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image || '/placeholder.png'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-orange-900">{item.name}</h3>
                    {item.size && <p className="text-orange-600">{item.size}</p>}
                    <p className="text-orange-600">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(item.price)} x {item.quantity}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onRemoveItem(item.productId, item.size)}
                  className="text-orange-700 border-orange-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-orange-900">Subtotal</span>
              <span className="text-orange-900">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(total - 3.5)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-orange-900">Envío</span>
              <span className="text-orange-900">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(3.5)}
              </span>
            </div>
            <div className="flex justify-between items-center font-semibold">
              <span className="text-orange-900">Total</span>
              <span className="text-orange-900">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(total)}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="paymentMethod" className="text-orange-900">
                Método de Pago
              </Label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border border-orange-300 rounded-md text-orange-900"
              >
                <option value="">Selecciona un método</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="efectivo">Efectivo</option>
              </select>
            </div>
            <div>
              <Label htmlFor="deliveryAddress" className="text-orange-900">
                Dirección de Entrega
              </Label>
              <Input
                id="deliveryAddress"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Ingresa tu dirección"
                className="border-orange-300 text-orange-900"
              />
            </div>
            <div>
              <Label htmlFor="comments" className="text-orange-900">
                Comentarios
              </Label>
              <Input
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Notas adicionales para el pedido"
                className="border-orange-300 text-orange-900"
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button
              onClick={onClearCart}
              variant="outline"
              className="border-orange-300 text-orange-700"
            >
              Vaciar Carrito
            </Button>
            <Button
              onClick={handleCheckoutSubmit}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Confirmar Pedido
            </Button>
          </div>
        </>
      )}
    </div>
  );
}