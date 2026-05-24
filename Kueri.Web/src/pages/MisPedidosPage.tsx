import { useEffect, useState } from 'react';
import { ordersApi } from '../api/orders';
import type { Order } from '../api/orders';
import { ESTADO_LABELS, ESTADO_STYLES } from '../api/orders';

const formatFecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

export const MisPedidosPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.getMine().finally(() => setLoading(false)).then(setOrders);
  }, []);

  return (
    <section className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Mis pedidos</h1>
        <p className="mt-1 text-sm text-slate-500">
          Historial de compras realizadas en KueriMex
        </p>
      </header>

      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500">Cargando pedidos...</div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 py-20 text-center text-sm text-slate-400">
          Aún no tienes pedidos realizados.
        </div>
      ) : (
        <ul className="flex flex-col gap-5">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </ul>
      )}
    </section>
  );
};

const OrderCard = ({ order }: { order: Order }) => (
  <li className="rounded-2xl border border-slate-200 bg-white shadow-sm">
    {/* Header del pedido */}
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
      <div>
        <p className="text-xs text-slate-400">Pedido #{order.id}</p>
        <p className="text-sm font-medium text-slate-700">{formatFecha(order.fecha)}</p>
      </div>
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${ESTADO_STYLES[order.estado]}`}
      >
        {ESTADO_LABELS[order.estado]}
      </span>
    </div>

    {/* Items */}
    <ul className="divide-y divide-slate-50 px-5">
      {order.items.map((item) => (
        <li key={item.productId} className="flex items-center gap-4 py-3">
          <img
            src={item.imagen_url}
            alt={item.nombre}
            className="h-14 w-14 flex-shrink-0 rounded-xl border border-slate-100 object-cover"
          />
          <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
            <p className="truncate text-sm font-medium text-slate-800">{item.nombre}</p>
            <p className="shrink-0 text-sm text-slate-500">
              {item.cantidad} × MXN{item.precio.toFixed(2)}
            </p>
          </div>
        </li>
      ))}
    </ul>

    {/* Footer */}
    <div className="flex justify-end border-t border-slate-100 px-5 py-3">
      <p className="text-sm font-bold text-slate-900">
        Total: MXN{order.total.toFixed(2)}
      </p>
    </div>
  </li>
);
