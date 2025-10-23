import { useState, useEffect } from 'react';
import { Pizza, User, ClipboardList, DollarSign } from 'lucide-react';
import { PizzaType, Ingredient } from '../../types';

// --- Datos Simulados ---
// (En una app real, vendrían de una API)

const SENDER_DATA = {
  razonSocial: 'Mr. Pizza S.R.L.',
  nif: '30-12345678-9',
  domicilio: 'Av. Siempre Viva 742',
  condicionIVA: 'Responsable Inscripto',
};

const MOCK_PIZZAS: PizzaType[] = [
  { id: 'p1', name: 'Pepperoni', baseIngredients: ['Queso Mozzarella', 'Pepperoni'], basePrice: 100 },
  { id: 'p2', name: 'Margarita', baseIngredients: ['Queso Mozzarella'], basePrice: 80 },
  { id: 'p3', name: 'Hawaiana', baseIngredients: ['Queso Mozzarella', 'Jamón', 'Piña'], basePrice: 110 },
  { id: 'p4', name: 'Vegetariana', baseIngredients: ['Queso Mozzarella', 'Champiñones', 'Pimientos', 'Cebolla', 'Aceitunas'], basePrice: 120 },
];

const ALL_INGREDIENTS: Ingredient[] = [
  'Queso Mozzarella', 'Pepperoni', 'Jamón', 'Champiñones', 'Pimientos', 'Cebolla', 'Aceitunas', 'Piña'
];

const TAX_RATE = 0.16; // 16%

// --- Componente ---

export function Orders() {
  // Estado del formulario
  const [customerName, setCustomerName] = useState('');
  const [customerNIF, setCustomerNIF] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [invoiceType, setInvoiceType] = useState<'A' | 'B' | 'C'>('B');
  const [customerIVACond, setCustomerIVACond] = useState('Consumidor Final');
  
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [paymentCondition, setPaymentCondition] = useState('Contado');

  const [selectedPizzaId, setSelectedPizzaId] = useState<string>('');
  const [selectedIngredients, setSelectedIngredients] = useState<Set<Ingredient>>(new Set());
  
  const [subtotal, setSubtotal] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [total, setTotal] = useState(0);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Efecto: Autocompletar ingredientes y precio al seleccionar pizza
  useEffect(() => {
    if (selectedPizzaId) {
      const pizza = MOCK_PIZZAS.find(p => p.id === selectedPizzaId);
      if (pizza) {
        setSelectedIngredients(new Set(pizza.baseIngredients));
        setSubtotal(pizza.basePrice); // Aquí se podría agregar lógica de precio por ingrediente extra
      }
    } else {
      setSelectedIngredients(new Set());
      setSubtotal(0);
    }
  }, [selectedPizzaId]);

  // Efecto: Calcular total al cambiar subtotal
  useEffect(() => {
    const newTaxes = subtotal * TAX_RATE;
    const newTotal = subtotal + newTaxes;
    setTaxes(newTaxes);
    setTotal(newTotal);
  }, [subtotal]);

  // Manejar cambio de ingredientes
  const handleIngredientChange = (ingredient: Ingredient) => {
    const newIngredients = new Set(selectedIngredients);
    if (newIngredients.has(ingredient)) {
      newIngredients.delete(ingredient);
    } else {
      newIngredients.add(ingredient);
    }
    setSelectedIngredients(newIngredients);
    // Aquí podrías recalcular el subtotal si los ingredientes extra tienen costo
  };

  // Validación
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!customerName) newErrors.customerName = 'El nombre es obligatorio.';
    if (!customerNIF) newErrors.customerNIF = 'El NIF/CUIT es obligatorio.';
    if (!selectedPizzaId) newErrors.pizza = 'Debe seleccionar una pizza.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulación de envío
      console.log('--- NUEVO PEDIDO REGISTRADO ---');
      console.log('Cliente:', { customerName, customerNIF, customerAddress, invoiceType, customerIVACond });
      console.log('Pago:', { paymentMethod, paymentCondition });
      console.log('Pedido:', { 
        pizza: MOCK_PIZZAS.find(p => p.id === selectedPizzaId)?.name,
        ingredients: Array.from(selectedIngredients),
        subtotal,
        taxes,
        total
      });
      alert('¡Pedido registrado con éxito! (Ver consola para detalles)');
      // Resetear formulario (opcional)
    } else {
      alert('Por favor, corrija los errores en el formulario.');
    }
  };

  // Helper para renderizar errores
  const ErrorMsg = ({ field }: { field: string }) => 
    errors[field] ? <p className="text-sm text-red-600 mt-1">{errors[field]}</p> : null;

  // Componente de UI reutilizable (similar a Shadcn Card)
  const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white shadow-lg rounded-lg border border-gray-200 ${className}`}>
      {children}
    </div>
  );
  const CardHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="p-4 border-b border-gray-200 flex items-center gap-3">{children}</div>
  );
  const CardTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-xl font-semibold text-gray-800">{children}</h2>
  );
  const CardContent = ({ children }: { children: React.ReactNode }) => (
    <div className="p-4 space-y-4">{children}</div>
  );

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

  return (
    <div className="p-8 bg-orange-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Registrar Nuevo Pedido</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Datos del Emisor (Hardcoded) */}
        <Card>
          <CardHeader>
            <CardTitle>Datos del Emisor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <p><strong>Razón Social:</strong> {SENDER_DATA.razonSocial}</p>
              <p><strong>NIF:</strong> {SENDER_DATA.nif}</p>
              <p><strong>Domicilio:</strong> {SENDER_DATA.domicilio}</p>
              <p><strong>Condición IVA:</strong> {SENDER_DATA.condicionIVA}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Datos del Cliente */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <User className="w-5 h-5 text-orange-600" />
              <CardTitle>Datos del Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nombre o Razón Social">
                  <Input value={customerName} onChange={e => setCustomerName(e.target.value)} />
                  <ErrorMsg field="customerName" />
                </FormField>
                <FormField label="NIF / CUIT / RUC">
                  <Input value={customerNIF} onChange={e => setCustomerNIF(e.target.value)} />
                  <ErrorMsg field="customerNIF" />
                </FormField>
              </div>
              <FormField label="Domicilio">
                <Input value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} />
              </FormField>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Tipo de Factura">
                  <Select value={invoiceType} onChange={e => setInvoiceType(e.target.value as 'A'|'B'|'C')}>
                    <option value="A">Factura A</option>
                    <option value="B">Factura B</option>
                    <option value="C">Factura C</option>
                  </Select>
                </FormField>
                <FormField label="Condición frente al IVA">
                  <Select value={customerIVACond} onChange={e => setCustomerIVACond(e.target.value)}>
                    <option>Consumidor Final</option>
                    <option>Responsable Inscripto</option>
                    <option>Monotributista</option>
                    <option>Exento</option>
                  </Select>
                </FormField>
              </div>
            </CardContent>
          </Card>
          
          {/* Forma de Pago */}
          <Card>
            <CardHeader>
              <DollarSign className="w-5 h-5 text-orange-600" />
              <CardTitle>Forma de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField label="Método">
                <Select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                  <option>Efectivo</option>
                  <option>Tarjeta de Débito</option>
                  <option>Tarjeta de Crédito</option>
                  <option>Transferencia</option>
                </Select>
              </FormField>
              <FormField label="Condición">
                <Select value={paymentCondition} onChange={e => setPaymentCondition(e.target.value)}>
                  <option>Contado</option>
                  <option>Crédito</option>
                </Select>
              </FormField>
            </CardContent>
          </Card>
        </div>

        {/* Detalles del Pedido */}
        <Card>
          <CardHeader>
            <Pizza className="w-5 h-5 text-orange-600" />
            <CardTitle>Detalles del Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField label="Seleccionar Pizza">
              <Select value={selectedPizzaId} onChange={e => setSelectedPizzaId(e.target.value)}>
                <option value="">-- Elija una pizza --</option>
                {MOCK_PIZZAS.map(pizza => (
                  <option key={pizza.id} value={pizza.id}>
                    {pizza.name} (${pizza.basePrice})
                  </option>
                ))}
              </Select>
              <ErrorMsg field="pizza" />
            </FormField>
            
            <FormField label="Personalizar Ingredientes (Autocompletados)">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-gray-50 rounded-md border">
                {ALL_INGREDIENTS.map(ingredient => (
                  <label key={ingredient} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded text-orange-600 focus:ring-orange-500"
                      checked={selectedIngredients.has(ingredient)}
                      onChange={() => handleIngredientChange(ingredient)}
                    />
                    <span className="text-sm">{ingredient}</span>
                  </label>
                ))}
              </div>
            </FormField>
          </CardContent>
        </Card>

        {/* Total y Envío */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-1 w-full md:w-auto">
            {/* Espacio para notas o info adicional */}
            <FormField label="Notas Adicionales (Opcional)">
              <textarea 
                rows={4} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ej: Sin cebolla, doble queso..."
              ></textarea>
            </FormField>
          </div>
          
          <div className="w-full md:w-80 space-y-3 p-4 bg-white shadow-lg rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold border-b pb-2">Resumen de Pago</h3>
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Impuestos ({TAX_RATE * 100}%):</span>
              <span className="font-medium">${taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-gray-900 border-t pt-2 mt-2">
              <span>TOTAL:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Botón de Envío */}
        <div className="text-right">
          <button
            type="submit"
            className="px-8 py-3 border border-transparent rounded-md shadow-lg text-white font-medium bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all text-lg"
          >
            Registrar Pedido
          </button>
        </div>
      </form>
    </div>
  );
}