import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { getProducts, updateProductAvailability, createProduct } from '@/api/products';
import { Pizza, Drink, Dessert, ProductSize } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface NewProductForm {
  name: string;
  description: string;
  image: string | null;
  categoryId: string;
  available: boolean;
  sizes?: ProductSize[];
  price?: number;
}

export function Menu() {
  const { user } = useAuth();
  const [menuPizzas, setMenuPizzas] = useState<Pizza[]>([]);
  const [menuDrinks, setMenuDrinks] = useState<Drink[]>([]);
  const [menuDesserts, setMenuDesserts] = useState<Dessert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProductForm>({
    name: '',
    description: '',
    image: '',
    categoryId: '1',
    available: true,
    sizes: [
      { id: '1', id_tamano: '1', price: 0, available: true },
      { id: '2', id_tamano: '2', price: 0, available: true },
      { id: '3', id_tamano: '3', price: 0, available: true },
    ],
    price: 0,
  });

  if (!user || !['Administrador', 'Cajero'].includes(user.role)) {
    return <div className="p-8 text-center text-red-600">Acceso no autorizado</div>;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { pizzas, drinks, desserts } = await getProducts();
        setMenuPizzas(pizzas);
        setMenuDrinks(drinks);
        setMenuDesserts(desserts);
      } catch (err: any) {
        setError('Error al cargar el menú. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleAvailability = async (id: string, type: 'pizza' | 'drink' | 'dessert') => {
    const currentItem = type === 'pizza'
      ? menuPizzas.find(p => p.id === id)
      : type === 'drink'
      ? menuDrinks.find(d => d.id === id)
      : menuDesserts.find(d => d.id === id);

    if (!currentItem) return;

    const originalAvailability = currentItem.available;
    const newAvailability = !currentItem.available;

    try {
      if (type === 'pizza') {
        setMenuPizzas(menuPizzas.map(p =>
          p.id === id ? { ...p, available: newAvailability } : p
        ));
      } else if (type === 'drink') {
        setMenuDrinks(menuDrinks.map(d =>
          d.id === id ? { ...d, available: newAvailability } : d
        ));
      } else {
        setMenuDesserts(menuDesserts.map(d =>
          d.id === id ? { ...d, available: newAvailability } : d
        ));
      }

      await updateProductAvailability(id, newAvailability);
    } catch (err: any) {
      if (type === 'pizza') {
        setMenuPizzas(menuPizzas.map(p =>
          p.id === id ? { ...p, available: originalAvailability } : p
        ));
      } else if (type === 'drink') {
        setMenuDrinks(menuDrinks.map(d =>
          d.id === id ? { ...d, available: originalAvailability } : d
        ));
      } else {
        setMenuDesserts(menuDesserts.map(d =>
          d.id === id ? { ...d, available: originalAvailability } : d
        ));
      }
      setError('Error al actualizar la disponibilidad. Intenta de nuevo.');
    }
  };

  const handleAddProduct = async () => {
    try {
      // Validar campos
      if (!newProduct.name) {
        setError('El nombre del producto es obligatorio.');
        return;
      }
      if (newProduct.categoryId === '1' && newProduct.sizes?.some(size => size.price <= 0)) {
        setError('Todos los precios de las pizzas deben ser mayores a 0.');
        return;
      }
      if (newProduct.categoryId !== '1' && (!newProduct.price || newProduct.price <= 0)) {
        setError('El precio de la bebida o postre debe ser mayor a 0.');
        return;
      }

      const productToCreate = {
        nombre: newProduct.name,
        descripcion: newProduct.description || null,
        imagen_url: newProduct.image || null,
        id_categoria: parseInt(newProduct.categoryId || '1'),
        disponible: newProduct.available,
        producto_tamanos: newProduct.categoryId === '1'
          ? [
              { id_tamano: '1', precio: { s: 1, e: 1, d: [newProduct.sizes?.[0]?.price || 0] }, disponible: true },
              { id_tamano: '2', precio: { s: 1, e: 1, d: [newProduct.sizes?.[1]?.price || 0] }, disponible: true },
              { id_tamano: '3', precio: { s: 1, e: 1, d: [newProduct.sizes?.[2]?.price || 0] }, disponible: true },
            ]
          : [{ id_tamano: newProduct.categoryId === '2' ? '4' : '5', precio: { s: 1, e: 1, d: [newProduct.price || 0] }, disponible: true }],
      };

      const createdProduct = await createProduct(productToCreate);
      if (newProduct.categoryId === '1') {
        setMenuPizzas([...menuPizzas, createdProduct as Pizza]);
      } else if (newProduct.categoryId === '2') {
        setMenuDrinks([...menuDrinks, createdProduct as Drink]);
      } else {
        setMenuDesserts([...menuDesserts, createdProduct as Dessert]);
      }
      setIsModalOpen(false);
      setNewProduct({
        name: '',
        description: '',
        image: '',
        categoryId: '1',
        available: true,
        sizes: [
          { id: '1', id_tamano: '1', price: 0, available: true },
          { id: '2', id_tamano: '2', price: 0, available: true },
          { id: '3', id_tamano: '3', price: 0, available: true },
        ],
        price: 0,
      });
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError('Datos inválidos. Verifica los campos ingresados.');
      } else if (err.response?.status === 404) {
        setError('Categoría o tamaño no encontrado.');
      } else {
        setError('Error al agregar el producto. Intenta de nuevo.');
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando menú...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        {error}
        <Button
          className="mt-4 bg-orange-600 hover:bg-orange-700"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 bg-orange-50/30">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-orange-900 mb-2">Menú de Productos</h2>
          <p className="text-orange-700">Gestiona pizzas, bebidas y postres del menú</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Producto</DialogTitle>
              <DialogDescription>
                Complete los campos para agregar un nuevo producto al menú.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nombre"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <Input
                placeholder="Descripción"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
              <Input
                placeholder="URL de la imagen (opcional)"
                value={newProduct.image || ''}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              />
              <select
                value={newProduct.categoryId}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  categoryId: e.target.value,
                  sizes: e.target.value === '1' ? [
                    { id: '1', id_tamano: '1', price: 0, available: true },
                    { id: '2', id_tamano: '2', price: 0, available: true },
                    { id: '3', id_tamano: '3', price: 0, available: true },
                  ] : undefined,
                  price: e.target.value !== '1' ? 0 : undefined,
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="1">Pizzas</option>
                <option value="2">Bebidas</option>
                <option value="3">Postres</option>
              </select>
              {newProduct.categoryId === '1' ? (
                <>
                  <Input
                    placeholder="Precio Pequeña"
                    type="number"
                    value={newProduct.sizes?.[0]?.price || 0}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        sizes: [
                          { id: '1', id_tamano: '1', price: parseFloat(e.target.value) || 0, available: true },
                          newProduct.sizes?.[1] || { id: '2', id_tamano: '2', price: 0, available: true },
                          newProduct.sizes?.[2] || { id: '3', id_tamano: '3', price: 0, available: true },
                        ],
                      })
                    }
                  />
                  <Input
                    placeholder="Precio Mediana"
                    type="number"
                    value={newProduct.sizes?.[1]?.price || 0}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        sizes: [
                          newProduct.sizes?.[0] || { id: '1', id_tamano: '1', price: 0, available: true },
                          { id: '2', id_tamano: '2', price: parseFloat(e.target.value) || 0, available: true },
                          newProduct.sizes?.[2] || { id: '3', id_tamano: '3', price: 0, available: true },
                        ],
                      })
                    }
                  />
                  <Input
                    placeholder="Precio Grande"
                    type="number"
                    value={newProduct.sizes?.[2]?.price || 0}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        sizes: [
                          newProduct.sizes?.[0] || { id: '1', id_tamano: '1', price: 0, available: true },
                          newProduct.sizes?.[1] || { id: '2', id_tamano: '2', price: 0, available: true },
                          { id: '3', id_tamano: '3', price: parseFloat(e.target.value) || 0, available: true },
                        ],
                      })
                    }
                  />
                </>
              ) : (
                <Input
                  placeholder="Precio"
                  type="number"
                  value={newProduct.price || 0}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                />
              )}
              <Button onClick={handleAddProduct}>Guardar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="pizzas" className="w-full">
        <TabsList className="bg-white border border-orange-200">
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
          <TabsTrigger
            value="desserts"
            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            Postres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pizzas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuPizzas.map((pizza) => (
              <Card key={pizza.id} className="border-orange-200 bg-white overflow-hidden">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={pizza.image || '/placeholder.png'}
                    alt={pizza.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-orange-600">
                    {pizza.categoryName}
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
                    {pizza.sizes.map((size) => (
                      <div key={size.id} className="flex justify-between">
                        <span className="text-orange-700">
                          {size.id_tamano === '1' ? 'Pequeña' : size.id_tamano === '2' ? 'Mediana' : 'Grande'}
                        </span>
                        <span className="text-orange-900">
                          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(size.price || 0)}
                        </span>
                      </div>
                    ))}
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
                    src={drink.image || '/placeholder.png'}
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
                    <span className="text-orange-900">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(drink.price || 0)}
                    </span>
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

        <TabsContent value="desserts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuDesserts.map((dessert) => (
              <Card key={dessert.id} className="border-orange-200 bg-white overflow-hidden">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={dessert.image || '/placeholder.png'}
                    alt={dessert.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-orange-900">{dessert.name}</CardTitle>
                    <Switch
                      checked={dessert.available}
                      onCheckedChange={() => toggleAvailability(dessert.id, 'dessert')}
                    />
                  </div>
                  <p className="text-orange-600">{dessert.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-900">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(dessert.price || 0)}
                    </span>
                    <Badge
                      variant={dessert.available ? 'default' : 'secondary'}
                      className={dessert.available ? 'bg-green-600' : 'bg-gray-400'}
                    >
                      {dessert.available ? 'Disponible' : 'No disponible'}
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