import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { customersApi } from '../api/customers';
import type { Customer } from '../api/customers';

export const CustomerListPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customersApi.getAll();
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <section className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="text-sm text-slate-600">Gestiona los clientes registrados.</p>
        </div>
        <Link
          to="/admin/crear-cliente"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
        >
          + Nuevo cliente
        </Link>
      </header>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <div className="py-12 text-center text-sm text-slate-500">Cargando clientes...</div>
      ) : customers.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-500">
          No hay clientes registrados.{' '}
          <Link to="/admin/crear-cliente" className="text-cyan-600 underline">
            Crear el primero
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="pb-3 pr-4">Nombre</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Teléfono</th>
                <th className="pb-3 pr-4">Ciudad</th>
                <th className="pb-3 pr-4">Dirección</th>
                <th className="pb-3">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50">
                  <td className="py-3 pr-4 font-medium text-slate-900">{customer.nombre}</td>
                  <td className="py-3 pr-4 text-slate-500">{customer.email}</td>
                  <td className="py-3 pr-4 text-slate-700">{customer.telefono || '—'}</td>
                  <td className="py-3 pr-4 text-slate-700">{customer.ciudad || '—'}</td>
                  <td className="py-3 pr-4 text-slate-700 max-w-xs truncate">{customer.direccion || '—'}</td>
                  <td className="py-3 text-slate-500">
                    {new Date(customer.fecha_registro).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
