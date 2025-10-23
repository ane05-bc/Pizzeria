import { useState } from 'react';
import { CustomerHeader } from './CustomerHeader';
import { PizzaCard } from './PizzaCard';
import { Cart } from './Cart';
import { Reviews } from './Reviews';
import { pizzas, drinks } from '../../data/mockData';
import { CartItem } from '../../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';

export function CustomerView() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentView, setCurrentView] = useState<'menu' | 'cart' | 'reviews'>('menu');

  const addToCart = (
    pizzaId: string,
    size: 'small' | 'medium' | 'large',
    quantity: number,
    extras: string[]
  ) => {
    const pizza = pizzas.find(p => p.id === pizzaId);
    if (!pizza) return;

    const basePrice = pizza.sizes[size];
    const extrasPrice = extras.length * 1.50;
    const totalPrice = basePrice + extrasPrice;

    const cartItem: CartItem = {
      productId: pizza.id,
      name: pizza.name,
      image: pizza.image,
      size: size === 'small' ? 'Pequeña' : size === 'medium' ? 'Mediana' : 'Grande',
      quantity,
      price: totalPrice,
      extras
    };

    setCartItems([...cartItems, cartItem]);
  };

  const addDrinkToCart = (drinkId: string) => {
    const drink = drinks.find(d => d.id === drinkId);
    if (!drink) return;

    const cartItem: CartItem = {
      productId: drink.id,
      name: drink.name,
      image: drink.image,
      quantity: 1,
      price: drink.price,
      extras: []
    };

    setCartItems([...cartItems, cartItem]);
  };

  const removeFromCart = (productId: string, size?: string) => {
    const index = cartItems.findIndex(
      item => item.productId === productId && item.size === size
    );
    if (index !== -1) {
      const newCartItems = [...cartItems];
      newCartItems.splice(index, 1);
      setCartItems(newCartItems);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = (paymentMethod: string, deliveryAddress: string, comments: string) => {
    alert(
      `¡Pedido confirmado!\n\n` +
      `Método de pago: ${paymentMethod}\n` +
      `Dirección: ${deliveryAddress}\n` +
      `Total: €${(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + 3.50).toFixed(2)}\n\n` +
      `Recibirás tu pedido en 30-45 minutos.`
    );
    clearCart();
    setCurrentView('menu');
  };

  return (
    <div className="min-h-screen bg-orange-50/30">
      <CustomerHeader 
        cartItemCount={cartItems.length} 
        onCartClick={() => setCurrentView('cart')}
      />

      {currentView === 'cart' ? (
        <Cart
          items={cartItems}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          onCheckout={handleCheckout}
          onBackToMenu={() => setCurrentView('menu')} 
        />
      ) : currentView === 'reviews' ? (
        <Reviews />
      ) : (
        <div className="container mx-auto px-6 py-8">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h2 className="text-orange-900 mb-4">Nuestro Menú</h2>
            <p className="text-orange-700 max-w-2xl mx-auto">
              Descubre nuestras pizzas artesanales, elaboradas con ingredientes frescos 
              y recetas tradicionales italianas
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={() => setCurrentView('menu')}
              className={currentView === 'menu' ? 'bg-orange-600' : 'bg-orange-400'}
            >
              Menú
            </Button>
            <Button
              onClick={() => setCurrentView('reviews')}
              //className={currentView === 'reviews' ? 'bg-orange-600' : 'bg-orange-400'}
            >
              Reseñas
            </Button>
          </div>

          <Tabs defaultValue="pizzas" className="w-full">
            <TabsList className="bg-white border border-orange-200 mb-8">
              <TabsTrigger 
                value="pizzas" 
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
              >
                Pizzas
              </TabsTrigger>
              <TabsTrigger 
                value="drinks" 
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
              >
                Bebidas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pizzas">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pizzas.map((pizza) => (
                  <PizzaCard
                    key={pizza.id}
                    pizza={pizza}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="drinks">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drinks.map((drink) => (
                  <Card key={drink.id} className="border-orange-200 bg-white overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-56">
                      <ImageWithFallback
                        src={drink.image}
                        alt={drink.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-orange-900 mb-2">{drink.name}</h3>
                      <p className="text-orange-600 mb-4">{drink.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-orange-900">€{drink.price.toFixed(2)}</span>
                        <Button
                          onClick={() => addDrinkToCart(drink.id)}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          Agregar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
