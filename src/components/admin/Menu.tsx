import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { pizzas, drinks } from '../../data/mockData';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function Menu() {
  const [menuPizzas, setMenuPizzas] = useState(pizzas);
  const [menuDrinks, setMenuDrinks] = useState(drinks);

  const toggleAvailability = (id: string, type: 'pizza' | 'drink') => {
    if (type === 'pizza') {
      setMenuPizzas(menuPizzas.map(p => 
        p.id === id ? { ...p, available: !p.available } : p
      ));
    } else {
      setMenuDrinks(menuDrinks.map(d => 
        d.id === id ? { ...d, available: !d.available } : d
      ));
    }
  };

  return (
    <div className="p-8 space-y-6 bg-orange-50/30">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-orange-900 mb-2">Menú de Productos</h2>
          <p className="text-orange-700">Gestiona pizzas y bebidas del menú</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      <Tabs defaultValue="pizzas" className="w-full">
        <TabsList className="bg-white border border-orange-200">
          <TabsTrigger value="pizzas" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
            Pizzas
          </TabsTrigger>
          <TabsTrigger value="drinks" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
            Bebidas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pizzas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuPizzas.map((pizza) => (
              <Card key={pizza.id} className="border-orange-200 bg-white overflow-hidden">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={pizza.image}
                    alt={pizza.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-orange-600">
                    {pizza.category}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-orange-900">{pizza.name}</CardTitle>
                    <Switch
                      checked={pizza.available}
                      onCheckedChange={() => toggleAvailability(pizza.id, 'pizza')}
                    />
                  </div>
                  <p className="text-orange-600">{pizza.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-orange-700">Pequeña</span>
                      <span className="text-orange-900">€{pizza.sizes.small.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-700">Mediana</span>
                      <span className="text-orange-900">€{pizza.sizes.medium.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-700">Grande</span>
                      <span className="text-orange-900">€{pizza.sizes.large.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge 
                      variant={pizza.available ? 'default' : 'secondary'}
                      className={pizza.available ? 'bg-green-600' : 'bg-gray-400'}
                    >
                      {pizza.available ? 'Disponible' : 'No disponible'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drinks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuDrinks.map((drink) => (
              <Card key={drink.id} className="border-orange-200 bg-white overflow-hidden">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={drink.image}
                    alt={drink.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-orange-900">{drink.name}</CardTitle>
                    <Switch
                      checked={drink.available}
                      onCheckedChange={() => toggleAvailability(drink.id, 'drink')}
                    />
                  </div>
                  <p className="text-orange-600">{drink.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-900">€{drink.price.toFixed(2)}</span>
                    <Badge 
                      variant={drink.available ? 'default' : 'secondary'}
                      className={drink.available ? 'bg-green-600' : 'bg-gray-400'}
                    >
                      {drink.available ? 'Disponible' : 'No disponible'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
