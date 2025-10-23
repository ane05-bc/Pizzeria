import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { employees } from '../../data/mockData';
import { Plus, Phone } from 'lucide-react';

export function Employees() {
  return (
    <div className="p-8 space-y-6 bg-orange-50/30">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-orange-900 mb-2">Panel de Empleados</h2>
          <p className="text-orange-700">Gestiona el personal de la pizzería</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Empleado
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-orange-200 bg-white">
          <CardHeader>
            <CardTitle className="text-orange-900">Cocineros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-orange-900">
              {employees.filter(e => e.role === 'Cocinero').length}
            </div>
            <p className="text-orange-600">activos</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-white">
          <CardHeader>
            <CardTitle className="text-orange-900">Repartidores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-orange-900">
              {employees.filter(e => e.role === 'Repartidor').length}
            </div>
            <p className="text-orange-600">activos</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-white">
          <CardHeader>
            <CardTitle className="text-orange-900">Cajeros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-orange-900">
              {employees.filter(e => e.role === 'Cajero').length}
            </div>
            <p className="text-orange-600">activos</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-white">
          <CardHeader>
            <CardTitle className="text-orange-900">En Vacaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-orange-900">
              {employees.filter(e => e.status === 'Vacaciones').length}
            </div>
            <p className="text-orange-600">empleados</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-orange-200 bg-white">
        <CardHeader>
          <CardTitle className="text-orange-900">Lista de Empleados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-orange-200">
                <TableHead className="text-orange-900">ID</TableHead>
                <TableHead className="text-orange-900">Nombre</TableHead>
                <TableHead className="text-orange-900">Rol</TableHead>
                <TableHead className="text-orange-900">Turno</TableHead>
                <TableHead className="text-orange-900">Teléfono</TableHead>
                <TableHead className="text-orange-900">Estado</TableHead>
                <TableHead className="text-orange-900">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id} className="border-orange-100">
                  <TableCell className="text-orange-900">{employee.id}</TableCell>
                  <TableCell className="text-orange-900">{employee.name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={
                        employee.role === 'Gerente'
                          ? 'bg-purple-100 text-purple-800 border-purple-200'
                          : employee.role === 'Cocinero'
                          ? 'bg-orange-100 text-orange-800 border-orange-200'
                          : employee.role === 'Repartidor'
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-green-100 text-green-800 border-green-200'
                      }
                    >
                      {employee.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className="border-orange-300 text-orange-700"
                    >
                      {employee.shift}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-orange-700">
                      <Phone className="w-3 h-3" />
                      <span>{employee.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={
                        employee.status === 'Activo'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : employee.status === 'Vacaciones'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          : 'bg-red-100 text-red-800 border-red-200'
                      }
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    >
                      Editar
                    </Button>
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
