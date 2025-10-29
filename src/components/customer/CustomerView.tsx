import { useState } from 'react';
// Importa SectionId de tu header.
import { CustomerHeader, SectionId } from './CustomerHeader';
import { Cart } from './Cart';
import { Reviews } from './Reviews';
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

  // --- FUNCIÓN 'addToCart' CORREGIDA ---
  // He eliminado 'extras' para que coincida con MenuSection y PizzaCard
  const addToCart = (
    pizzaId: string,
    size: 'small' | 'medium' | 'large',
    quantity: number
    // 'extras' se ha eliminado de los parámetros
  ) => {
    const pizza = pizzas.find(p => p.id === pizzaId);
    if (!pizza) return;

    const basePrice = pizza.sizes[size];
    // Se elimina 'extrasPrice'
    const totalPrice = basePrice; // El precio total es solo el precio base

    const cartItem: CartItem = {
      productId: pizza.id,
      name: pizza.name,
      image: pizza.image,
      size: size === 'small' ? 'Pequeña' : size === 'medium' ? 'Mediana' : 'Grande',
      quantity,
      price: totalPrice,
      extras: [] // Se pasa un array vacío por coherencia de tipo
    };
    setCartItems([...cartItems, cartItem]);
  };
  // --- FIN DE LA CORRECCIÓN ---

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
      // 'size' no se define, lo cual es correcto para 'removeFromCart'
    };
    setCartItems([...cartItems, cartItem]);
  };

  const removeFromCart = (productId: string, size?: string) => {
    // Esta lógica funciona tanto para pizzas (con 'size')
    // como para bebidas (donde 'size' es undefined)
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
    // Usamos 'window.alert' como marcador de posición
    // En una app real, aquí iría un modal
    window.alert(
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
        // Ahora 'addToCart' (3 args) coincide con lo que espera MenuSection (3 args)
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
