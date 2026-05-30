import { useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { customersApi } from '../api/customers';

type CustomerFormState = {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
};

type SubmitStatus = {
  kind: 'idle' | 'success' | 'error';
  message: string;
};

const INITIAL_FORM: CustomerFormState = {
  nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  ciudad: '',
};

export const CreateCustomerPage = () => {
  const [form, setForm] = useState<CustomerFormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>({ kind: 'idle', message: '' });

  const canSubmit = useMemo(() => {
    return Boolean(form.nombre.trim() && form.email.trim());
  }, [form.nombre, form.email]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      telefono: form.telefono.trim() || undefined,
      direccion: form.direccion.trim() || undefined,
      ciudad: form.ciudad.trim() || undefined,
    };

    setStatus({ kind: 'idle', message: '' });
    setIsSubmitting(true);

    try {
      await customersApi.create(payload);
      setForm(INITIAL_FORM);
      setStatus({ kind: 'success', message: 'Cliente creado correctamente.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo crear el cliente.';
      setStatus({ kind: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <header className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Crear cliente</h1>
        <p className="text-sm text-slate-600">Registra un nuevo cliente en el sistema.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="nombre" className="mb-1 block text-sm font-semibold text-slate-700">
              Nombre completo
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-600"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold text-slate-700">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-600"
            />
          </div>

          <div>
            <label htmlFor="telefono" className="mb-1 block text-sm font-semibold text-slate-700">
              Teléfono (opcional)
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              value={form.telefono}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-600"
            />
          </div>

          <div>
            <label htmlFor="ciudad" className="mb-1 block text-sm font-semibold text-slate-700">
              Ciudad (opcional)
            </label>
            <input
              id="ciudad"
              name="ciudad"
              type="text"
              value={form.ciudad}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-600"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="direccion" className="mb-1 block text-sm font-semibold text-slate-700">
              Dirección (opcional)
            </label>
            <textarea
              id="direccion"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? 'Guardando...' : 'Crear cliente'}
          </button>

          {status.kind !== 'idle' && (
            <p className={`text-sm ${status.kind === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
              {status.message}
            </p>
          )}
        </div>
      </form>
    </section>
  );
};
