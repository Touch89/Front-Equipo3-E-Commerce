import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCheckCircle, HiCreditCard, HiArrowLeft, HiExclamationTriangle } from 'react-icons/hi2';
import { useCart } from '../context/CartContext';
import { crearPedido, type CheckoutPayload } from '../api/checkout';

type Field = 'nombre' | 'email' | 'direccion' | 'ciudad' | 'telefono';

const FIELDS: { key: Field; label: string; type: string; placeholder: string }[] = [
  { key: 'nombre',    label: 'Nombre completo',   type: 'text',  placeholder: 'Juan Pérez' },
  { key: 'email',     label: 'Correo electrónico', type: 'email', placeholder: 'juan@ejemplo.com' },
  { key: 'telefono',  label: 'Teléfono',           type: 'tel',   placeholder: '55 1234 5678' },
  { key: 'direccion', label: 'Dirección',           type: 'text',  placeholder: 'Calle Reforma 100, Col. Centro' },
  { key: 'ciudad',    label: 'Ciudad',              type: 'text',  placeholder: 'Ciudad de México' },
];

type FormState = Record<Field, string>;

const EMPTY_FORM: FormState = {
  nombre: '', email: '', direccion: '', ciudad: '', telefono: '',
};

type Confirmed = { orderId: number; prestashopOk: boolean };

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);

  if (items.length === 0 && !confirmed) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-slate-400">
        <p className="text-lg font-medium">Tu carrito está vacío.</p>
        <button
          onClick={() => navigate('/productos')}
          className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
        >
          Ver productos
        </button>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <HiCheckCircle className="mx-auto mb-4 text-emerald-500" size={56} />
        <h1 className="mb-2 text-2xl font-bold text-slate-900">¡Pedido confirmado!</h1>
        <p className="mb-1 text-slate-500">
          Tu pedido <span className="font-semibold text-slate-900">#{confirmed.orderId}</span> ha sido recibido.
        </p>
        {confirmed.prestashopOk ? (
          <p className="mb-8 text-sm text-emerald-600">Sincronizado correctamente en PrestaShop.</p>
        ) : (
          <p className="mb-8 text-sm text-amber-600">
            El pedido quedó guardado localmente. La sincronización con PrestaShop falló (revisa la configuración del servidor).
          </p>
        )}
        <button
          onClick={() => navigate('/')}
          className="rounded-xl bg-slate-900 px-8 py-3 font-semibold text-white transition hover:bg-cyan-700"
        >
          Seguir comprando
        </button>
      </div>
    );
  }

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (!form.nombre.trim()) next.nombre = 'El nombre es obligatorio.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Ingresa un correo válido.';
    }
    if (!form.telefono.trim()) next.telefono = 'El teléfono es obligatorio.';
    if (!form.direccion.trim()) next.direccion = 'La dirección es obligatoria.';
    if (!form.ciudad.trim()) next.ciudad = 'La ciudad es obligatoria.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError(null);

    const payload: CheckoutPayload = {
      ...form,
      metodoPago: 'tarjeta',
      items: items.map(({ product, quantity }) => ({
        productId: product.id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: quantity,
      })),
      total,
    };

    try {
      const result = await crearPedido(payload);
      clearCart();
      setConfirmed({ orderId: result.id, prestashopOk: result.sync.prestashop.ok });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Error al procesar el pedido. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(key: Field, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  return (
    <div className="mx-auto max-w-5xl py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-900"
      >
        <HiArrowLeft size={16} />
        Volver
      </button>

      <h1 className="mb-8 text-2xl font-bold text-slate-900">Finalizar compra</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate className="lg:col-span-3 space-y-5">
          <section>
            <h2 className="mb-4 text-base font-semibold text-slate-700">Datos de envío</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {FIELDS.map(({ key, label, type, placeholder }) => (
                <div key={key} className={key === 'direccion' ? 'sm:col-span-2' : ''}>
                  <label htmlFor={key} className="mb-1 block text-sm font-medium text-slate-700">
                    {label}
                  </label>
                  <input
                    id={key}
                    type={type}
                    value={form[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={placeholder}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-cyan-600 ${
                      errors[key] ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white hover:border-slate-400'
                    }`}
                  />
                  {errors[key] && (
                    <p className="mt-1 text-xs text-red-500">{errors[key]}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-base font-semibold text-slate-700">Método de pago</h2>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-cyan-600 bg-cyan-50 px-4 py-3">
              <HiCreditCard size={22} className="text-cyan-700" />
              <span className="text-sm font-medium text-slate-800">Tarjeta de crédito / débito</span>
              <span className="ml-auto rounded-full bg-cyan-600 px-2 py-0.5 text-xs font-semibold text-white">
                Seleccionado
              </span>
            </label>
          </section>

          {apiError && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <HiExclamationTriangle size={18} className="mt-0.5 shrink-0" />
              {apiError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
          >
            {submitting ? 'Procesando...' : `Confirmar pedido · MXN ${total.toFixed(2)}`}
          </button>
        </form>

        {/* ── Order summary ── */}
        <aside className="lg:col-span-2">
          <div className="sticky top-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="mb-4 text-base font-semibold text-slate-700">Resumen del pedido</h2>
            <ul className="space-y-3">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex items-center gap-3">
                  <img
                    src={product.imagen_url}
                    alt={product.nombre}
                    className="h-12 w-12 rounded-lg border border-slate-100 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{product.nombre}</p>
                    <p className="text-xs text-slate-400">×{quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    MXN {(product.precio * quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span>MXN {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Envío</span>
                <span className="text-emerald-600">Gratis</span>
              </div>
              <div className="mt-3 flex justify-between text-base font-bold text-slate-900">
                <span>Total</span>
                <span>MXN {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
