import { useState } from 'react';
import { User, UserRole } from '../../types';
import { Users, UserPlus, Trash2, Edit3 } from 'lucide-react';
import { cn } from '../ui/utils'; // <-- 1. IMPORTAR 'cn'

// Datos simulados
const MOCK_USERS_LIST: User[] = [
  { id: 'u1', username: 'Admin User', email: 'admin@pizzeria.com', role: 'admin' },
  { id: 'u2', username: 'Empleado Uno', email: 'empleado@pizzeria.com', role: 'employee' },
  { id: 'u3', username: 'Cliente Fiel', email: 'cliente@pizzeria.com', role: 'customer' },
  { id: 'u4', username: 'Marcia Gomez', email: 'marcia@cliente.com', role: 'customer' },
  { id: 'u5', username: 'Pedro Pascal', email: 'pedro@empleado.com', role: 'employee' },
];

// Componente de UI reutilizable (similar a Shadcn Card)
const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white shadow-lg rounded-lg border border-gray-200 ${className}`}>
    {children}
  </div>
);

// --- 2. SECCIÓN CORREGIDA ---
const CardHeader = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("p-4 border-b border-gray-200 flex items-center justify-between gap-3", className)}>
    {children}
  </div>
);
const CardTitle = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("flex items-center gap-3", className)}>
    <h2 className="text-xl font-semibold text-gray-800">{children}</h2>
  </div>
);
const CardContent = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("p-4", className)}>
    {children}
  </div>
);
// --- FIN SECCIÓN CORREGIDA ---

// Componentes de Formulario reutilizables
const FormField = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${props.className}`} />
);
const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${props.className}`} />
);
const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className={`px-4 py-2 rounded-md shadow-md text-white font-medium bg-orange-600 hover:bg-orange-700 transition-all ${props.className}`} />
);


export function UserManagement() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS_LIST);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null); // Guarda el ID del usuario a editar
  
  // Estado para el formulario
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('customer');

  // Función para resetear el formulario y cerrar
  const resetForm = () => {
    setIsFormOpen(false);
    setIsEditing(null);
    setUsername('');
    setEmail('');
    setRole('customer');
  };

  // Manejar creación/edición de usuario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email) {
      alert('Nombre y Email son obligatorios.');
      return;
    }

    if (isEditing) {
      // Lógica de Modificación (Update)
      setUsers(users.map(u => 
        u.id === isEditing ? { ...u, username, email, role } : u
      ));
      alert('Usuario modificado con éxito.');
    } else {
      // Lógica de Alta (Create)
      const newUser: User = {
        id: `u${Date.now()}`, // ID simple para la simulación
        username,
        email,
        role,
      };
      setUsers([newUser, ...users]);
      alert('Usuario creado con éxito.');
    }
    resetForm();
  };

  // Manejar Baja (Delete)
  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres dar de baja a este usuario?')) {
      setUsers(users.filter(u => u.id !== id));
      alert('Usuario dado de baja.');
    }
  };

  // Manejar "Editar" (Carga datos en el formulario)
  const handleEdit = (user: User) => {
    setIsEditing(user.id);
    setUsername(user.username);
    setEmail(user.email);
    setRole(user.role);
    setIsFormOpen(true);
  };
  
  // Helper de UI para el Rol
  const RoleBadge = ({ role }: { role: UserRole }) => {
    const colors: Record<UserRole, string> = {
      admin: 'bg-red-100 text-red-800',
      employee: 'bg-blue-100 text-blue-800',
      customer: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[role]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-8 bg-orange-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Usuarios</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna de Formulario (Crear/Editar) */}
        <div className="lg:col-span-1">
          <Button 
            onClick={() => { isFormOpen && !isEditing ? resetForm() : setIsFormOpen(true); setIsEditing(null); }}
            className="w-full mb-4 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            {isEditing ? 'Cancelar Edición' : (isFormOpen ? 'Cerrar Formulario' : 'Crear Nuevo Usuario')}
          </Button>

          {isFormOpen && (
            <Card>
              <CardHeader>
                <CardTitle>{isEditing ? 'Modificar Usuario' : 'Dar de Alta Usuario'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField label="Nombre de Usuario">
                    <Input value={username} onChange={e => setUsername(e.target.value)} />
                  </FormField>
                  <FormField label="Email">
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                  </FormField>
                  <FormField label="Rol de Usuario">
                    <Select value={role} onChange={e => setRole(e.target.value as UserRole)}>
                      <option value="customer">Cliente</option>
                      <option value="employee">Empleado</option>
                      <option value="admin">Admin</option>
                    </Select>
                  </FormField>
                  <Button type="submit" className="w-full">
                    {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Columna de Lista de Usuarios */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <Users className="w-5 h-5 text-orange-600" />
                Lista de Usuarios ({users.length})
              </CardTitle>
            </CardHeader>
            {/* Esta es la línea que causaba el error. Ahora funcionará. */}
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-600">Usuario</th>
                      <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                      <th className="px-4 py-3 font-medium text-gray-600">Rol</th>
                      <th className="px-4 py-3 font-medium text-gray-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{user.username}</td>
                        <td className="px-4 py-3 text-gray-600">{user.email}</td>
                        <td className="px-4 py-3">
                          <RoleBadge role={user.role} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-800">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}