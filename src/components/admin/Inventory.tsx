import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { inventory } from '../../data/mockData';
import { AlertTriangle, Package, Plus } from 'lucide-react';
import { Progress } from '../ui/progress';

export function Inventory() {
  const lowStockItems = inventory.filter(item => item.currentStock < item.minStock);

  return (
    <div className="p-8 space-y-6 bg-orange-50/30">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-orange-900 mb-2">Gestión de Inventario</h2>
          <p className="text-orange-700">Control de ingredientes y stock</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Ingrediente
        </Button>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertas de Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                  <div>
                    <p className="text-red-900">{item.name}</p>
                    <p className="text-red-600">Stock actual: {item.currentStock}{item.unit} (Mínimo: {item.minStock}{item.unit})</p>
                  </div>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    Reabastecer
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-orange-200 bg-white">
          <CardHeader>
            <CardTitle className="text-orange-900">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-orange-900">{inventory.length}</div>
                <p className="text-orange-600">ingredientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-white">
          <CardHeader>
            <CardTitle className="text-orange-900">Stock Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-orange-900">{lowStockItems.length}</div>
                <p className="text-orange-600">requieren atención</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-white">
          <CardHeader>
            <CardTitle className="text-orange-900">Stock Óptimo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-orange-900">{inventory.length - lowStockItems.length}</div>
                <p className="text-orange-600">en buen estado</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-orange-200 bg-white">
        <CardHeader>
          <CardTitle className="text-orange-900">Inventario Completo</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-orange-200">
                <TableHead className="text-orange-900">ID</TableHead>
                <TableHead className="text-orange-900">Ingrediente</TableHead>
                <TableHead className="text-orange-900">Stock Actual</TableHead>
                <TableHead className="text-orange-900">Stock Mínimo</TableHead>
                <TableHead className="text-orange-900">Nivel</TableHead>
                <TableHead className="text-orange-900">Proveedor</TableHead>
                <TableHead className="text-orange-900">Última Reposición</TableHead>
                <TableHead className="text-orange-900">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => {
                const stockPercentage = (item.currentStock / item.minStock) * 100;
                const isLowStock = item.currentStock < item.minStock;

                return (
                  <TableRow key={item.id} className="border-orange-100">
                    <TableCell className="text-orange-900">{item.id}</TableCell>
                    <TableCell className="text-orange-900">{item.name}</TableCell>
                    <TableCell className="text-orange-900">
                      {item.currentStock} {item.unit}
                    </TableCell>
                    <TableCell className="text-orange-700">
                      {item.minStock} {item.unit}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 w-32">
                        <Progress 
                          value={Math.min(stockPercentage, 100)} 
                          className="h-2"
                        />
                        <p className="text-orange-600">{stockPercentage.toFixed(0)}%</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-orange-700">{item.supplier}</TableCell>
                    <TableCell className="text-orange-700">
                      {new Date(item.lastRestockDate).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={
                          isLowStock
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : stockPercentage < 150
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : 'bg-green-100 text-green-800 border-green-200'
                        }
                      >
                        {isLowStock ? 'Crítico' : stockPercentage < 150 ? 'Bajo' : 'Óptimo'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
