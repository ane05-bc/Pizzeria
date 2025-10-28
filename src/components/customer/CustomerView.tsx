import { useState } from 'react';
// Importa SectionId de tu header.
import { Cart } from './Cart';
import { CustomerHeader, SectionId } from './CustomerHeader';
import { Reviews } from './Reviews';
// IMPORTAMOS POSTRES
import { desserts, drinks, pizzas } from '../../data/mockData';
import { CartItem } from '../../types';
import { AboutUsSection } from './AboutUs'; // Asegúrate de tener este componente
import { LocationSection } from './LocationSection';
import { MenuSection } from './MenuSection';

// El tipo de vista ahora incluye las secciones del header y el carrito
type View = SectionId | 'cart';

export function CustomerView() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // El estado ahora usa el nuevo tipo 'View'. Empezamos en 'menu'.
  const [currentView, setCurrentView] = useState<View>('menu');

  // --- FUNCIONES DE CARRITO ---

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
      extras: [],
      // Añade una propiedad 'type' o 'category' si tu CartItem lo necesita.
      // Si solo acepta 'size', tendrás que adaptar tu `CartItem` type.
    };
    setCartItems([...cartItems, cartItem]);
  };
  
  // FUNCIÓN PARA AGREGAR POSTRES (NUEVA)
  const addDessertToCart = (dessertId: string) => {
    const dessert = desserts.find(d => d.id === dessertId);
    if (!dessert) return;
    const cartItem: CartItem = {
      productId: dessert.id,
      name: dessert.name,
      image: dessert.image,
      quantity: 1,
      price: dessert.price,
      extras: [],
    };
    setCartItems([...cartItems, cartItem]);
  };

  const removeFromCart = (productId: string, size?: string) => {
    // Tu lógica para remover elementos del carrito es correcta. 
    // Para bebidas/postres sin 'size', se debe pasar `undefined` o omitir el segundo argumento.
    const index = cartItems.findIndex(
      // Si item.size es undefined (bebida/postre) y size es undefined, coincide.
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
    // ... (Tu lógica de checkout se mantiene)
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
          onBackToMenu={() => setCurrentView('menu')}
        />
      );
    }

    // Si no es el carrito, muestra la sección correspondiente
    switch (currentView) {
      case 'menu':
        // Pasamos las nuevas funciones al menú
        return (
          <MenuSection 
            onAddToCart={addToCart} 
            onAddDrinkToCart={addDrinkToCart}
            onAddDessertToCart={addDessertToCart} // PASAMOS EL NUEVO PROP
          />
        );
      case 'reviews':
        return <Reviews />;
      case 'location':
        return <LocationSection />;
      case 'about':
        return <AboutUsSection />;
      default:
        return (
          <MenuSection 
            onAddToCart={addToCart} 
            onAddDrinkToCart={addDrinkToCart}
            onAddDessertToCart={addDessertToCart} // DEFAULT TAMBIÉN
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-orange-50/30">
      <CustomerHeader 
        cartItemCount={cartItems.length} 
        onCartClick={() => setCurrentView('cart')}
        onNavigate={(section) => setCurrentView(section)}
        // Usamos 'menu' como activo si estamos en el carrito para no desmarcar nada
        activeSection={currentView === 'cart' ? 'menu' : currentView} 
      />

      <main className="container mx-auto px-6 py-8">
        {renderContent()}
      </main>
    </div>
  );
}