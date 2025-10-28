import API from './api';
import { Pizza, Drink, Dessert } from '@/types';

export const getProducts = async () => {
  const response = await API.get('/api/productos');
  const products = response.data;

  const pizzas: Pizza[] = products
    .filter((p: any) => p.id_categoria === 1)
    .map((p: any) => ({
      id: p.id_producto.toString(),
      name: p.nombre,
      description: p.descripcion || '',
      image: p.imagen_url,
      categoryId: p.id_categoria.toString(),
      categoryName: p.categorias?.nombre || 'Pizzas',
      sizes: p.producto_tamanos.map((size: any) => ({
        id: size.id_producto_tamano.toString(),
        id_tamano: size.id_tamano.toString(),
        price: Array.isArray(size.precio?.d) && size.precio.d.length > 0 ? size.precio.d[0] : 0, // Manejo seguro
        available: size.disponible,
        activo: size.activo,
      })),
      available: p.disponible,
    }));

  const drinks: Drink[] = products
    .filter((p: any) => p.id_categoria === 2)
    .map((p: any) => ({
      id: p.id_producto.toString(),
      name: p.nombre,
      description: p.descripcion || '',
      image: p.imagen_url,
      categoryId: p.id_categoria.toString(),
      categoryName: p.categorias?.nombre || 'Bebidas',
      price: Array.isArray(p.producto_tamanos[0]?.precio?.d) && p.producto_tamanos[0].precio.d.length > 0
        ? p.producto_tamanos[0].precio.d[0]
        : 0, // Manejo seguro
      available: p.disponible,
    }));


    const desserts: Dessert[] = products
      .filter((p: any) => p.id_categoria === 3)
      .map((p: any) => ({
        id: p.id_producto.toString(),
        name: p.nombre,
        description: p.descripcion || '',
        image: p.imagen_url,
        categoryId: p.id_categoria.toString(),
        categoryName: p.categorias?.nombre || 'Postres',
        price: Array.isArray(p.producto_tamanos[0]?.precio?.d) && p.producto_tamanos[0].precio.d.length > 0
          ? p.producto_tamanos[0].precio.d[0]
          : 0, // Manejo seguro
        available: p.disponible,
      }));

  return { pizzas, drinks, desserts };
};

export const updateProductAvailability = async (
  productId: string,
  available: boolean
): Promise<void> => {
  await API.patch(`/api/productos/${productId}`, { disponible: available });
};

export const createProduct = async (product: any): Promise<Pizza | Drink | Dessert> => {
  const response = await API.post('/api/productos', product);
  const created = response.data;
  if (created.id_categoria === 1) {
    return {
      id: created.id_producto.toString(),
      name: created.nombre,
      description: created.descripcion || '',
      image: created.imagen_url,
      categoryId: created.id_categoria.toString(),
      categoryName: created.categorias?.nombre || 'Pizzas',
      sizes: created.producto_tamanos.map((size: any) => ({
        id: size.id_producto_tamano.toString(),
        id_tamano: size.id_tamano.toString(),
        price: Array.isArray(size.precio?.d) && size.precio.d.length > 0 ? size.precio.d[0] : 0, // Manejo seguro
        available: size.disponible,
        activo: size.activo,
      })),
      available: created.disponible,
    };
  } else {
    return {
      id: created.id_producto.toString(),
      name: created.nombre,
      description: created.descripcion || '',
      image: created.imagen_url,
      categoryId: created.id_categoria.toString(),
      categoryName: created.categorias?.nombre || (created.id_categoria === 2 ? 'Bebidas' : 'Postres'),
      price: Array.isArray(created.producto_tamanos[0]?.precio?.d) && created.producto_tamanos[0].precio.d.length > 0
        ? created.producto_tamanos[0].precio.d[0]
        : 0, // Manejo seguro
      available: created.disponible,
    };
  }
};