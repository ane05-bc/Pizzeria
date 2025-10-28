// src/utils/pedido.ts
const TAMANO_ID: Record<string, string> = {
  Pequeña: '1',
  Mediana: '2',
  Grande: '3',
  Bebida: '4',
  Postre: '5',
};

export const getIdProductoTamano = (productId: string, size?: string): number => {
  const idTamano = size && TAMANO_ID[size] ? TAMANO_ID[size] : TAMANO_ID.Mediana;
  return parseInt(productId + idTamano);
};