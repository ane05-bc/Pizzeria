import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { purchases } from '../../data/mockData';
import { Plus, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useState } from 'react';
import { Purchase } from '../../types';

export function Purchases() {
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  return (
    <div className="p-8 space-y-6 bg-orange-50/30">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-orange-900 mb-2">Compras y Proveedores</h2>
          <p className="text-orange-700">Registro de compras a proveedores</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Compra
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-orange-200 bg-white">
          <CardHeader>
            <CardTitle className="text-orange-900">Total Compras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-orange-900">{purchases.length}</div>
            <p className="text-orange-600">registradas</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-white">
          <CardHeader>
            <CardTitle className="text-orange-900">Monto Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-orange-900">
              €{purchases.reduce((sum, p) => sum + p.total, 0).toFixed(2)}
            </div>
            <p className="text-orange-600">en compras</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-white">
          <CardHeader>
            <CardTitle className="text-orange-900">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-orange-900">
              {purchases.filter(p => p.status === 'Pendiente').length}
            </div>
            <p className="text-orange-600">por recibir</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-orange-200 bg-white">
        <CardHeader>
          <CardTitle className="text-orange-900">Historial de Compras</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-orange-200">
                <TableHead className="text-orange-900">ID</TableHead>
                <TableHead className="text-orange-900">Proveedor</TableHead>
                <TableHead className="text-orange-900">Fecha</TableHead>
                <TableHead className="text-orange-900">Items</TableHead>
                <TableHead className="text-orange-900">Total</TableHead>
                <TableHead className="text-orange-900">Estado</TableHead>
                <TableHead className="text-orange-900">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.id} className="border-orange-100">
                  <TableCell className="text-orange-900">{purchase.id}</TableCell>
                  <TableCell className="text-orange-900">{purchase.supplierName}</TableCell>
                  <TableCell className="text-orange-700">
                    {new Date(purchase.date).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell className="text-orange-700">
                    {purchase.items.length} items
                  </TableCell>
                  <TableCell className="text-orange-900">€{purchase.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={
                        purchase.status === 'Recibida'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : purchase.status === 'Pendiente'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          : 'bg-red-100 text-red-800 border-red-200'
                      }
                    >
                      {purchase.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedPurchase(purchase)}
                      className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Purchase Detail Dialog */}
      <Dialog open={!!selectedPurchase} onOpenChange={() => setSelectedPurchase(null)}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-orange-900">Detalle de Compra {selectedPurchase?.id}</DialogTitle>
          </DialogHeader>
          {selectedPurchase && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-orange-600">Proveedor</p>
                  <p className="text-orange-900">{selectedPurchase.supplierName}</p>
                </div>
                <div>
                  <p className="text-orange-600">Fecha</p>
                  <p className="text-orange-900">
                    {new Date(selectedPurchase.date).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div>
                  <p className="text-orange-600">Estado</p>
                  <Badge className="bg-orange-600">{selectedPurchase.status}</Badge>
                </div>
                <div>
                  <p className="text-orange-600">Total</p>
                  <p className="text-orange-900">€{selectedPurchase.total.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <p className="text-orange-900 mb-3">Items de la Compra</p>
                <Table>
                  <TableHeader>
                    <TableRow className="border-orange-200">
                      <TableHead className="text-orange-900">Ingrediente</TableHead>
                      <TableHead className="text-orange-900">Cantidad</TableHead>
                      <TableHead className="text-orange-900">Precio Unit.</TableHead>
                      <TableHead className="text-orange-900">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPurchase.items.map((item, index) => (
                      <TableRow key={index} className="border-orange-100">
                        <TableCell className="text-orange-900">{item.ingredientName}</TableCell>
                        <TableCell className="text-orange-700">
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell className="text-orange-700">€{item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-orange-900">€{item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
