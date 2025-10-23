import { FileText } from 'lucide-react';

export function Logs() {
  return (
    <div className="p-8 bg-orange-50 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-orange-600" />
        <h1 className="text-3xl font-bold text-gray-900">Logs del Sistema</h1>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <p className="text-gray-700">
          Aquí se mostrará un registro de las acciones importantes del sistema, como inicios de sesión,
          registros de pedidos, modificaciones de usuarios, etc.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          (Esta es una vista de marcador de posición. Se requiere un backend para implementar esta funcionalidad).
        </p>
      </div>
    </div>
  );
}