import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Star } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';



interface Review {
  id: string;
  id_pedido: string;
  id_cliente: string;
  customerName: string;     // ← Usa este campo
  calificacion?: number;
  comentario?: string;
  fecha_comentario: string;
}

export function Reviews() {
  const { access_token } = useAuth(); // ← Esto te da el token
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    id_pedido: 0, // Deberías obtener este valor dinámicamente
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
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${access_token}`, // ← También aquí
        },
      });
      setReviews(response.data);
    } catch (err) {
      setError('Error al cargar las reseñas');
    } finally {
      setLoading(false);
    }
  };

  if (access_token) {
    fetchReviews();
  }
}, [access_token]); // ← Depende del token

  // Calcular promedio de calificaciones
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.calificacion || 0), 0) / reviews.length
      : 0;

  // Manejar envío de reseña
  const handleSubmitReview = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!newReview.comentario?.trim() || newReview.id_pedido === 0) {
    alert('Por favor, completa el pedido y el comentario');
    return;
  }

  if (!access_token) {
    alert('Debes iniciar sesión para dejar una reseña');
    return;
  }

  setLoading(true);
  try {
    const response = await axios.post(
      API_URL,
      {
        id_pedido: newReview.id_pedido,
        calificacion: newReview.calificacion,
        comentario: newReview.comentario,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`, // ← Usa access_token
          'Content-Type': 'application/json',
        },
      }
    );

    setReviews([response.data, ...reviews]);
    setNewReview({ id_pedido: 0, calificacion: 5, comentario: '' });
    alert('¡Gracias por tu reseña!');
  } catch (err: any) {
    setError(err.response?.data?.message || 'Error al enviar la reseña');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="py-12 bg-card min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Reseñas de Clientes</h2>
          <p className="text-muted-foreground mt-2">Comparte tu experiencia con nosotros</p>
        </div>

        {/* Resumen de calificaciones */}
        <Card className="border-orange-200 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-destructive">{averageRating.toFixed(1)}</div>
                <div className="flex gap-1 mt-2">
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
                <p className="text-muted-foreground mt-2">Basado en {reviews.length} reseñas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulario para nueva reseña */}
        <Card className="border-orange-200 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Deja tu Reseña</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
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
                <Label className="text-foreground block">Calificación</Label>
                <div className="flex gap-2 mt-2">
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
                <Label htmlFor="comment" className="text-foreground">Tu Comentario</Label>
                <Textarea
                  id="comment"
                  value={newReview.comentario}
                  onChange={(e) => setNewReview({ ...newReview, comentario: e.target.value })}
                  placeholder="Cuéntanos sobre tu experiencia..."
                  className="mt-2 border-border"
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

        {reviews.map((review) => (
  <Card key={review.id} className="border-orange-200 bg-white">
    <CardContent className="pt-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-orange-900 font-medium">
            {review.customerName || 'Anónimo'}
          </p>
          <p className="text-orange-600 text-sm">
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
  );
}