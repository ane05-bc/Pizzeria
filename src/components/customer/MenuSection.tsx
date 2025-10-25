import { PizzaCard } from './PizzaCard';
import { pizzas, drinks } from '../../data/mockData'; // Importa los datos
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';

// Definimos las props que necesita: las funciones para añadir al carrito
interface MenuSectionProps {
  onAddToCart: (
    pizzaId: string,
    size: 'small' | 'medium' | 'large',
    quantity: number,
    extras: string[]
  ) => void;
  onAddDrinkToCart: (drinkId: string) => void;
}

export function MenuSection({ onAddToCart, onAddDrinkToCart }: MenuSectionProps) {
  return (
    <>
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h2 className="text-orange-900 mb-4">Nuestro Menú</h2>
        <p className="text-orange-700 max-w-2xl mx-auto">
          Descubre nuestras pizzas artesanales, elaboradas con ingredientes frescos 
          y recetas tradicionales italianas
        </p>
      </div>

      {/* ESTOS BOTONES YA NO SON NECESARIOS, LOS BORRAMOS */}
      {/* <div className="flex justify-center gap-4 mb-8"> ... </div> */}

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
                onAddToCart={onAddToCart} // Usamos la prop
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
                      onClick={() => onAddDrinkToCart(drink.id)} // Usamos la prop
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
    </>
  );
}