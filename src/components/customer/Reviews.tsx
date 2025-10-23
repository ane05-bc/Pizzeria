import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Star } from 'lucide-react';
import { reviews as initialReviews } from '../../data/mockData';
import { Review } from '../../types';

export function Reviews() {
  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState({
    customerName: '',
    rating: 5,
    comment: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.customerName.trim() || !newReview.comment.trim()) {
      alert('Por favor, completa todos los campos');
      return;
    }

    const review: Review = {
      id: `R${String(reviews.length + 1).padStart(3, '0')}`,
      customerName: newReview.customerName,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews([review, ...reviews]);
    setNewReview({ customerName: '', rating: 5, comment: '' });
    alert('¡Gracias por tu reseña!');
  };

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="p-8 bg-orange-50/30 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h2 className="text-orange-900 mb-2">Reseñas de Clientes</h2>
          <p className="text-orange-700">Comparte tu experiencia con nosotros</p>
        </div>

        {/* Rating Summary */}
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

        {/* New Review Form */}
        <Card className="border-orange-200 bg-white">
          <CardHeader>
            <CardTitle className="text-orange-900">Deja tu Reseña</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-orange-900">Tu Nombre</Label>
                <Input
                  id="name"
                  value={newReview.customerName}
                  onChange={(e) => setNewReview({ ...newReview, customerName: e.target.value })}
                  placeholder="Nombre completo"
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
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoveredRating || newReview.rating)
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
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Cuéntanos sobre tu experiencia..."
                  className="border-orange-200 mt-2"
                  rows={4}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="bg-orange-600 hover:bg-orange-700"
              >
                Publicar Reseña
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-4">
          <h3 className="text-orange-900">Todas las Reseñas</h3>
          {reviews.map((review) => (
            <Card key={review.id} className="border-orange-200 bg-white">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-orange-900">{review.customerName}</p>
                    <p className="text-orange-600">{new Date(review.date).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-orange-700">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
