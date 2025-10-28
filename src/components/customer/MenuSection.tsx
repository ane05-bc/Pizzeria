import { PizzaCard } from './PizzaCard';
// Importa los postres. Asumo que están en tu mockData.
import { desserts, drinks, pizzas } from '../../data/mockData';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
// Importamos 'dessert' para tener un tipo para el postre. Si no lo tienes, créalo en tus `types`.
// import { Dessert } from '../../types'; 

// Definimos las props que necesita: las funciones para añadir al carrito
interface MenuSectionProps {
  onAddToCart: (
    pizzaId: string,
    size: 'small' | 'medium' | 'large',
    quantity: number,
    extras: string[]
  ) => void;
  onAddDrinkToCart: (drinkId: string) => void;
  // AÑADIMOS la función para agregar postres
  onAddDessertToCart: (dessertId: string) => void; 
}

// Puedes usar un componente similar a este para las Bebidas/Postres.
// Por simplicidad, he replicado el Card de bebidas y lo he adaptado.
const ProductCard = ({ product, onAddProductToCart }: any) => (
  <Card key={product.id} className="border-orange-200 bg-white overflow-hidden hover:shadow-lg transition-shadow">
    <div className="relative h-56">
      <ImageWithFallback
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover"
      />
    </div>
    <CardContent className="p-6">
      <h3 className="text-orange-900 mb-2">{product.name}</h3>
      <p className="text-orange-600 mb-4">{product.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-orange-900">€{product.price.toFixed(2)}</span>
        <Button
          onClick={() => onAddProductToCart(product.id)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          Agregar
        </Button>
      </div>
    </CardContent>
  </Card>
);

export function MenuSection({ onAddToCart, onAddDrinkToCart, onAddDessertToCart }: MenuSectionProps) {
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

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-white border border-orange-200 mb-8 flex justify-center flex-wrap">
          {/* PESTAÑA DE TODO */}
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            Todo
          </TabsTrigger>
          {/* PESTAÑA DE PIZZAS */}
          <TabsTrigger 
            value="pizzas" 
            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            Pizzas
          </TabsTrigger>
          {/* PESTAÑA DE BEBIDAS */}
          <TabsTrigger 
            value="drinks" 
            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            Bebidas
          </TabsTrigger>
          {/* PESTAÑA DE POSTRES (NUEVO) */}
          <TabsTrigger 
            value="desserts" 
            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            Postres
          </TabsTrigger>
        </TabsList>

        {/* CONTENIDO DE TODO (Combinación de todos) */}
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pizzas en "Todo" */}
            {pizzas.map((pizza) => (
              <PizzaCard
                key={pizza.id}
                pizza={pizza}
                onAddToCart={onAddToCart}
              />
            ))}
            {/* Bebidas en "Todo" */}
            {drinks.map((drink) => (
              <ProductCard
                key={drink.id}
                product={drink}
                onAddProductToCart={onAddDrinkToCart}
              />
            ))}
            {/* Postres en "Todo" (NUEVO) */}
            {desserts.map((dessert) => (
              <ProductCard
                key={dessert.id}
                product={dessert}
                onAddProductToCart={onAddDessertToCart}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pizzas">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pizzas.map((pizza) => (
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
              <ProductCard
                key={drink.id}
                product={drink}
                onAddProductToCart={onAddDrinkToCart}
              />
            ))}
          </div>
        </TabsContent>

        {/* CONTENIDO DE POSTRES (NUEVO) */}
        <TabsContent value="desserts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {desserts.map((dessert) => (
              <ProductCard
                key={dessert.id}
                product={dessert}
                onAddProductToCart={onAddDessertToCart}
              />
            ))}
          </div>
        </TabsContent>

      </Tabs>
    </>
  );
}