import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Star } from 'lucide-react';
import axios from 'axios';

interface Review {
  id_comentario: number;
  id_pedido: number;
  id_cliente: number;
  calificacion?: number;
  comentario?: string;
  fecha_comentario: string;
  clientes: {
    nombre: string; // Asegúrate de que el modelo de cliente en el backend incluya el nombre
  };
}

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    id_pedido: 0, // Deberías obtener este valor dinámicamente
    id_cliente: 0, // Deberías obtener este valor dinámicamente (e.g., desde auth)
    calificacion: 5,
    comentario: '',
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL base de tu API
  const API_URL = 'http://localhost:3001/api/comentarios'; // Ajusta según tu configuración

  // Cargar reseñas al montar el componente
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL);
        setReviews(response.data);
      } catch (err) {
        setError('Error al cargar las reseñas');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Calcular promedio de calificaciones
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.calificacion || 0), 0) / reviews.length
      : 0;

  // Manejar envío de reseña
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comentario?.trim() || newReview.id_pedido === 0 || newReview.id_cliente === 0) {
      alert('Por favor, completa todos los campos y asegúrate de estar autenticado');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_URL, {
        id_pedido: newReview.id_pedido,
        id_cliente: newReview.id_cliente,
        calificacion: newReview.calificacion,
        comentario: newReview.comentario,
      });
      setReviews([response.data, ...reviews]);
      setNewReview({ id_pedido: 0, id_cliente: 0, calificacion: 5, comentario: '' });
      alert('¡Gracias por tu reseña!');
    } catch (err) {
      setError('Error al enviar la reseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-orange-50/30 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h2 className="text-orange-900 mb-2">Reseñas de Clientes</h2>
          <p className="text-orange-700">Comparte tu experiencia con nosotros</p>
        </div>

        {/* Resumen de calificaciones */}
        <Card className="border-orange-200 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-orange-900 mb-2">{averageRating.toFixed(1)}</div>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= Math.round(averageRating)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-orange-600">Basado en {reviews.length} reseñas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulario para nueva reseña */}
        <Card className="border-orange-200 bg-white">
          <CardHeader>
            <CardTitle className="text-orange-900">Deja tu Reseña</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Campo para id_pedido (puedes usar un select si tienes una lista de pedidos) */}
              <div>
                <Label htmlFor="order" className="text-orange-900">Número de Pedido</Label>
                <Input
                  id="order"
                  type="number"
                  value={newReview.id_pedido || ''}
                  onChange={(e) =>
                    setNewReview({ ...newReview, id_pedido: parseInt(e.target.value) || 0 })
                  }
                  placeholder="Ingresa el número de pedido"
                  className="border-orange-200 mt-2"
                  required
                />
              </div>

              <div>
                <Label className="text-orange-900 mb-2 block">Calificación</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, calificacion: star })}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoveredRating || newReview.calificacion)
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="comment" className="text-orange-900">Tu Comentario</Label>
                <Textarea
                  id="comment"
                  value={newReview.comentario}
                  onChange={(e) => setNewReview({ ...newReview, comentario: e.target.value })}
                  placeholder="Cuéntanos sobre tu experiencia..."
                  className="border-orange-200 mt-2"
                  rows={4}
                  required
                />
              </div>

              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Publicar Reseña'}
              </Button>
              {error && <p className="text-red-500">{error}</p>}
            </form>
          </CardContent>
        </Card>

        {/* Lista de reseñas */}
        <div className="space-y-4">
          <h3 className="text-orange-900">Todas las Reseñas</h3>
          {loading && <p>Cargando reseñas...</p>}
          {!loading && reviews.length === 0 && <p>No hay reseñas disponibles.</p>}
          {reviews.map((review) => (
            <Card key={review.id_comentario} className="border-orange-200 bg-white">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-orange-900">{review.clientes.nombre}</p>
                    <p className="text-orange-600">
                      {new Date(review.fecha_comentario).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= (review.calificacion || 0)
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-orange-700">{review.comentario}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}