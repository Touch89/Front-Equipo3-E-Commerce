import { useEffect, useState } from 'react';
import { ordersApi } from '../../api/orders';
import type { Order, EstadoPedido } from '../../api/orders';
import { ESTADO_LABELS, ESTADO_STYLES } from '../../api/orders';

const ESTADOS: EstadoPedido[] = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];

const formatFecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const PedidosPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    ordersApi.getAll().then(setOrders).finally(() => setLoading(false));
  }, []);

  const handleEstado = async (id: number, estado: EstadoPedido) => {
    setUpdatingId(id);
    try {
      const updated = await ordersApi.updateEstado(id, estado);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Pedidos</h1>
        <p className="mt-1 text-sm text-slate-500">
          {orders.length} pedido{orders.length !== 1 ? 's' : ''} en total
        </p>
      </header>

      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500">Cargando pedidos...</div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center text-sm text-slate-400">No hay pedidos aún.</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Pedido</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">Fecha</th>
                <th className="px-5 py-3">Productos</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-800">#{order.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-800">{order.usuario.nombre}</p>
                    <p className="text-xs text-slate-400">{order.usuario.email}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{formatFecha(order.fecha)}</td>
                  <td className="px-5 py-4 text-slate-500">
                    {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-800">
                    MXN {order.total.toFixed(2)}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      disabled={updatingId === order.id}
                      value={order.estado}
                      onChange={(e) =>
                        handleEstado(order.id, e.target.value as EstadoPedido)
                      }
                      className={`rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none ring-1 ring-inset ring-transparent transition focus:ring-cyan-400 disabled:opacity-50 ${ESTADO_STYLES[order.estado]}`}
                    >
                      {ESTADOS.map((e) => (
                        <option key={e} value={e}>
                          {ESTADO_LABELS[e]}
                        </option>
                      ))}
                    </select>
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
