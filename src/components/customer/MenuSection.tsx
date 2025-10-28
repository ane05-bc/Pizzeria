import { desserts, drinks, pizzas } from '../../data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { DessertCard } from './DessertCard';
import { DrinkCard } from './DrinkCard';
import { PizzaCard } from './PizzaCard';

interface MenuSectionProps {
  onAddToCart: (
    pizzaId: string,
    size: 'small' | 'medium' | 'large',
    quantity: number,
    extras: string[]
  ) => void;
  onAddDrinkToCart: (drinkId: string, quantity: number) => void; // Ajustado para incluir quantity
  onAddDessertToCart: (dessertId: string, quantity: number) => void; // Ajustado para incluir quantity
}

export function MenuSection({ onAddToCart, onAddDrinkToCart, onAddDessertToCart }: MenuSectionProps) {
  return (
    <>
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Nuestro Menú</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Descubre nuestras pizzas artesanales, elaboradas con ingredientes frescos 
          y recetas tradicionales italianas
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-card border-border shadow-md rounded-xl p-2 flex justify-center flex-wrap gap-3">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-destructive data-[state=active]:text-foreground rounded-md px-6 py-3 transition-colors"
          >
            Todo
          </TabsTrigger>
          <TabsTrigger 
            value="pizzas" 
            className="data-[state=active]:bg-destructive data-[state=active]:text-foreground rounded-md px-6 py-3 transition-colors"
          >
            Pizzas
          </TabsTrigger>
          <TabsTrigger 
            value="drinks" 
            className="data-[state=active]:bg-destructive data-[state=active]:text-foreground rounded-md px-6 py-3 transition-colors"
          >
            Bebidas
          </TabsTrigger>
          <TabsTrigger 
            value="desserts" 
            className="data-[state=active]:bg-destructive data-[state=active]:text-foreground rounded-md px-6 py-3 transition-colors"
          >
            Postres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pizzas.map((pizza) => (
              <PizzaCard
                key={pizza.id}
                pizza={pizza}
                onAddToCart={onAddToCart}
              />
            ))}
            {drinks.map((drink) => (
              <DrinkCard
                key={drink.id}
                drink={drink}
                onAddDrinkToCart={(id, quantity) => onAddDrinkToCart(id, quantity)}
              />
            ))}
            {desserts.map((dessert) => (
              <DessertCard
                key={dessert.id}
                dessert={dessert}
                onAddDessertToCart={(id, quantity) => onAddDessertToCart(id, quantity)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pizzas">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuPizzas.map((pizza) => (
              <PizzaCard
                key={pizza.id}
                pizza={pizza}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drinks">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drinks.map((drink) => (
              <DrinkCard
                key={drink.id}
                drink={drink}
                onAddDrinkToCart={(id, quantity) => onAddDrinkToCart(id, quantity)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="desserts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {desserts.map((dessert) => (
              <DessertCard
                key={dessert.id}
                dessert={dessert}
                onAddDessertToCart={(id, quantity) => onAddDessertToCart(id, quantity)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}