// src/api/orders.ts
import API from './api';
import { CreatePedidoDto, TipoPedido } from '@/types'; // ← Asegúrate de exportar

export { TipoPedido }; // ← ¡EXPORTA EL ENUM!

export const createOrder = async (pedido: CreatePedidoDto): Promise<void> => {
  await API.post('/api/pedidos', pedido);
};