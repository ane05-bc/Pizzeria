import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { reservations as initialReservations } from '../../data/mockData';
import { Reservation } from '../../types';
import { Plus, CheckCircle, XCircle } from 'lucide-react';

export function Reservations() {
  const [reservations, setReservations] = useState(initialReservations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReservation, setNewReservation] = useState<Partial<Reservation>>({
    status: 'Pendiente'
  });

  const updateStatus = (id: string, status: Reservation['status']) => {
    setReservations(reservations.map(r => 
      r.id === id ? { ...r, status } : r
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reservation: Reservation = {
      id: `RES${String(reservations.length + 1).padStart(3, '0')}`,
      customerName: newReservation.customerName || '',
      phone: newReservation.phone || '',
      tableNumber: newReservation.tableNumber || 1,
      date: newReservation.date || '',
      time: newReservation.time || '',
      guests: newReservation.guests || 1,
      status: 'Pendiente'
    };
    setReservations([...reservations, reservation]);
    setIsDialogOpen(false);
    setNewReservation({ status: 'Pendiente' });
  };

  return (
    <div className="p-8 space-y-6 bg-orange-50/30">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-orange-900 mb-2">Reservas de Mesas</h2>
          <p className="text-orange-700">Gestiona las reservas de los clientes</p>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Reserva
        </Button>
      </div>

      <Card className="border-orange-200 bg-white">
        <CardHeader>
          <CardTitle className="text-orange-900">Lista de Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-orange-200">
                <TableHead className="text-orange-900">ID</TableHead>
                <TableHead className="text-orange-900">Cliente</TableHead>
                <TableHead className="text-orange-900">Teléfono</TableHead>
                <TableHead className="text-orange-900">Mesa</TableHead>
                <TableHead className="text-orange-900">Fecha</TableHead>
                <TableHead className="text-orange-900">Hora</TableHead>
                <TableHead className="text-orange-900">Personas</TableHead>
                <TableHead className="text-orange-900">Estado</TableHead>
                <TableHead className="text-orange-900">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id} className="border-orange-100">
                  <TableCell className="text-orange-900">{reservation.id}</TableCell>
                  <TableCell className="text-orange-900">{reservation.customerName}</TableCell>
                  <TableCell className="text-orange-700">{reservation.phone}</TableCell>
                  <TableCell className="text-orange-900">{reservation.tableNumber}</TableCell>
                  <TableCell className="text-orange-700">{reservation.date}</TableCell>
                  <TableCell className="text-orange-700">{reservation.time}</TableCell>
                  <TableCell className="text-orange-900">{reservation.guests}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={
                        reservation.status === 'Confirmada' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : reservation.status === 'Completada'
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : reservation.status === 'Cancelada'
                          ? 'bg-red-100 text-red-800 border-red-200'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }
                    >
                      {reservation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {reservation.status === 'Pendiente' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateStatus(reservation.id, 'Confirmada')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateStatus(reservation.id, 'Cancelada')}
                            variant="destructive"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {reservation.status === 'Confirmada' && (
                        <Button
                          size="sm"
                          onClick={() => updateStatus(reservation.id, 'Completada')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Completar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Reservation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-orange-900">Nueva Reserva</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="customerName" className="text-orange-900">Nombre del Cliente</Label>
              <Input
                id="customerName"
                value={newReservation.customerName || ''}
                onChange={(e) => setNewReservation({ ...newReservation, customerName: e.target.value })}
                required
                className="border-orange-200"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-orange-900">Teléfono</Label>
              <Input
                id="phone"
                value={newReservation.phone || ''}
                onChange={(e) => setNewReservation({ ...newReservation, phone: e.target.value })}
                required
                className="border-orange-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tableNumber" className="text-orange-900">Número de Mesa</Label>
                <Input
                  id="tableNumber"
                  type="number"
                  min="1"
                  value={newReservation.tableNumber || ''}
                  onChange={(e) => setNewReservation({ ...newReservation, tableNumber: parseInt(e.target.value) })}
                  required
                  className="border-orange-200"
                />
              </div>
              <div>
                <Label htmlFor="guests" className="text-orange-900">Personas</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  value={newReservation.guests || ''}
                  onChange={(e) => setNewReservation({ ...newReservation, guests: parseInt(e.target.value) })}
                  required
                  className="border-orange-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-orange-900">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={newReservation.date || ''}
                  onChange={(e) => setNewReservation({ ...newReservation, date: e.target.value })}
                  required
                  className="border-orange-200"
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-orange-900">Hora</Label>
                <Input
                  id="time"
                  type="time"
                  value={newReservation.time || ''}
                  onChange={(e) => setNewReservation({ ...newReservation, time: e.target.value })}
                  required
                  className="border-orange-200"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-orange-300">
                Cancelar
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                Crear Reserva
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
