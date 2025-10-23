import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { customers } from '../../data/mockData';
import { Award, Mail, Phone, Search } from 'lucide-react';
import { Input } from '../ui/input';

export function Customers() {
  return (
    <div className="p-8 space-y-6 bg-orange-50/30">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-orange-900 mb-2">Gestión de Clientes</h2>
          <p className="text-orange-700">Base de datos de clientes y puntos de fidelidad</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-400" />
            <Input 
              placeholder="Buscar cliente..." 
              className="pl-10 border-orange-200 w-64"
            />
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700">
            Exportar Lista
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-orange-200 bg-white">
          <CardHeader>
            <CardTitle className="text-orange-900">Total Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-orange-900">{customers.length}</div>
            <p className="text-orange-600">clientes registrados</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-white">
          <CardHeader>
            <CardTitle className="text-orange-900">Clientes VIP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-orange-900">{customers.filter(c => c.loyaltyPoints > 200).length}</div>
            <p className="text-orange-600">con más de 200 puntos</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-white">
          <CardHeader>
            <CardTitle className="text-orange-900">Nuevos Este Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-orange-900">
              {customers.filter(c => new Date(c.registrationDate) > new Date('2024-10-01')).length}
            </div>
            <p className="text-orange-600">registros en octubre</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-orange-200 bg-white">
        <CardHeader>
          <CardTitle className="text-orange-900">Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-orange-200">
                <TableHead className="text-orange-900">ID</TableHead>
                <TableHead className="text-orange-900">Nombre</TableHead>
                <TableHead className="text-orange-900">Contacto</TableHead>
                <TableHead className="text-orange-900">Puntos</TableHead>
                <TableHead className="text-orange-900">Pedidos</TableHead>
                <TableHead className="text-orange-900">Registro</TableHead>
                <TableHead className="text-orange-900">Nivel</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id} className="border-orange-100">
                  <TableCell className="text-orange-900">{customer.id}</TableCell>
                  <TableCell className="text-orange-900">{customer.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-orange-700">
                        <Phone className="w-3 h-3" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-orange-700">
                        <Mail className="w-3 h-3" />
                        <span>{customer.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-orange-600" />
                      <span className="text-orange-900">{customer.loyaltyPoints}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-orange-900">{customer.totalOrders}</TableCell>
                  <TableCell className="text-orange-700">
                    {new Date(customer.registrationDate).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={
                        customer.loyaltyPoints > 300
                          ? 'bg-purple-100 text-purple-800 border-purple-200'
                          : customer.loyaltyPoints > 150
                          ? 'bg-orange-100 text-orange-800 border-orange-200'
                          : 'bg-gray-100 text-gray-800 border-gray-200'
                      }
                    >
                      {customer.loyaltyPoints > 300 ? 'VIP' : customer.loyaltyPoints > 150 ? 'Gold' : 'Silver'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
