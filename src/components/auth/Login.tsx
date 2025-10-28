import { Logo } from '@/components/common/Logo';
import { AlertCircle, Lock, Mail, Pizza } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export function Login({ onBack }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await API.post('/api/auth/login', {
        email,
        password,
      });

      const { access_token, user, sessionId } = response.data;

      login({ user, access_token, sessionId });

      // ✅ Volver a la vista pública luego de iniciar sesión
      if (onBack) onBack();

    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Error al iniciar sesión. Verifica tus credenciales.'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50 p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Main card */}
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl border border-orange-100 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-8 text-center relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <Pizza className="absolute top-4 right-4 w-16 h-16 rotate-12" />
              <Pizza className="absolute bottom-4 left-4 w-12 h-12 -rotate-12" />
            </div>
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <div className="bg-white p-3 rounded-full shadow-lg">
                  <Logo size={64} rounded bordered />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Bienvenido a Mr. Pizza
              </h1>
              <p className="text-orange-100 text-lg font-medium">
                ¡El Señor Sabor!
              </p>
            </div>
          </div>

          {/* Form section */}
          <div className="p-8">
            <p className="text-gray-600 text-center mb-6">
              Inicia sesión para continuar
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email field */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@pizzeria.com"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              {/* Password field */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-lg text-white font-semibold text-lg bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Iniciar Sesión
              </button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-xs text-gray-600 text-center font-medium mb-2">
                💡 Credenciales de prueba:
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p className="text-center">
                  <span className="font-semibold">Admin:</span> admin@pizzeria.com
                </p>
                <p className="text-center">
                  <span className="font-semibold">Empleado:</span> empleado@pizzeria.com
                </p>
                <p className="text-center">
                  <span className="font-semibold">Cliente:</span> cliente@pizzeria.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © 2024 Mr. Pizza - Todos los derechos reservados
        </p>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
