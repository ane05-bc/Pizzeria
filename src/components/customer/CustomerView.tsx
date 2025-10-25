import { useState } from 'react';
// Importa SectionId de tu header. Asumiré que lo exportaste como te mostré.
import { CustomerHeader, SectionId } from './CustomerHeader';
import { Cart } from './Cart';
import { Reviews } from './Reviews'; // Ya tenías este
import { pizzas, drinks } from '../../data/mockData';
import { CartItem } from '../../types';

// --- Importa las nuevas secciones ---
import { MenuSection } from './MenuSection';
import { LocationSection } from './LocationSection';
import { AboutUsSection } from './AboutUs';

// El tipo de vista ahora incluye las secciones del header y el carrito
type View = SectionId | 'cart';

export function CustomerView() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // El estado ahora usa el nuevo tipo 'View'. Empezamos en 'menu'.
  const [currentView, setCurrentView] = useState<View>('menu');

  // --- TODAS TUS FUNCIONES DE CARRITO SE MANTIENEN IGUAL ---
  // (addToCart, addDrinkToCart, removeFromCart, clearCart, handleCheckout)

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
    setCurrentView('menu'); // Vuelve al menú después de pagar
  };
  
  // --- FIN DE LAS FUNCIONES DE CARRITO ---


  // Función para renderizar el contenido principal
  const renderContent = () => {
    // Si la vista es 'cart', muestra el carrito
    if (currentView === 'cart') {
      return (
        <Cart
          items={cartItems}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          onCheckout={handleCheckout}
          onBackToMenu={() => setCurrentView('menu')} // Vuelve al menú
        />
      );
    }

    // Si no es el carrito, muestra la sección correspondiente
    switch (currentView) {
      case 'menu':
        // Pasamos las funciones que necesita el menú
        return (
          <MenuSection 
            onAddToCart={addToCart} 
            onAddDrinkToCart={addDrinkToCart} 
          />
        );
      case 'reviews':
        return <Reviews />; // Reutilizamos tu componente existente
      case 'location':
        return <LocationSection />;
      case 'about':
        return <AboutUsSection />;
      default:
        return <MenuSection onAddToCart={addToCart} onAddDrinkToCart={addDrinkToCart} />;
    }
  };

  return (
    <div className="min-h-screen bg-orange-50/30">
      <CustomerHeader 
        cartItemCount={cartItems.length} 
        onCartClick={() => setCurrentView('cart')}
        // --- Conectamos el header al estado de esta vista ---
        onNavigate={(section) => setCurrentView(section)}
        activeSection={currentView === 'cart' ? 'menu' : currentView}
      />

      {/* El contenido principal ahora se renderiza aquí */}
      <main className="container mx-auto px-6 py-8">
        {renderContent()}
      </main>
    </div>
  );
}