import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Pizza } from 'lucide-react';

// Asumo que tienes componentes UI básicos, si no, reemplaza con <button>, <input>, etc.
// import { Button } from '../ui/button'; 
// import { Input } from '../ui/input';
// import { Label } from '../ui/label';

// Usaré elementos HTML estándar estilizados con Tailwind por simplicidad

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Contraseña no se usa en la simulación, pero es estándar
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email);
    if (!success) {
      setError('Usuario no encontrado. Intente con: admin@pizzeria.com, empleado@pizzeria.com, o cliente@pizzeria.com');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-lg border border-orange-200">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full">
            <Pizza className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">Bienvenido a La Pizzería</h1>
          <p className="text-gray-500">Inicia sesión para continuar</p>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pizzeria.com"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-lg text-white font-medium bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}