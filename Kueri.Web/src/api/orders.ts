export type EstadoPedido = 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';

export type OrderItem = {
  productId: number;
  nombre: string;
  imagen_url: string;
  precio: number;
  cantidad: number;
};

export type Order = {
  id: number;
  fecha: string;
  estado: EstadoPedido;
  items: OrderItem[];
  total: number;
  usuario: {
    nombre: string;
    email: string;
  };
};

export const ESTADO_LABELS: Record<EstadoPedido, string> = {
  pendiente: 'Pendiente',
  procesando: 'Procesando',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export const ESTADO_STYLES: Record<EstadoPedido, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  procesando: 'bg-blue-100 text-blue-700',
  enviado: 'bg-purple-100 text-purple-700',
  entregado: 'bg-emerald-100 text-emerald-700',
  cancelado: 'bg-red-100 text-red-600',
};

// ── Mock data – reemplazar con llamadas reales cuando el backend esté listo ───
export const MOCK_ORDERS: Order[] = [
  {
    id: 1001,
    fecha: '2025-05-10T14:32:00Z',
    estado: 'entregado',
    usuario: { nombre: 'Carlos López', email: 'carlos@example.com' },
    items: [
      {
        productId: 1,
        nombre: 'Cinturón Clásico Negro',
        imagen_url: 'https://placehold.co/80x80?text=Cinturon',
        precio: 89.9,
        cantidad: 1,
      },
      {
        productId: 7,
        nombre: 'Billetera Clásica Negra',
        imagen_url: 'https://placehold.co/80x80?text=Billetera',
        precio: 69.9,
        cantidad: 1,
      },
    ],
    total: 159.8,
  },
  {
    id: 1002,
    fecha: '2025-05-18T09:15:00Z',
    estado: 'enviado',
    usuario: { nombre: 'Carlos López', email: 'carlos@example.com' },
    items: [
      {
        productId: 4,
        nombre: 'Cinturón Reversible Negro/Marrón',
        imagen_url: 'https://placehold.co/80x80?text=Cinturon',
        precio: 129.9,
        cantidad: 2,
      },
    ],
    total: 259.8,
  },
  {
    id: 1003,
    fecha: '2025-05-21T16:50:00Z',
    estado: 'procesando',
    usuario: { nombre: 'Ana García', email: 'ana@example.com' },
    items: [
      {
        productId: 10,
        nombre: 'Cartera Dama Cuero Negro',
        imagen_url: 'https://placehold.co/80x80?text=Cartera',
        precio: 159.9,
        cantidad: 1,
      },
    ],
    total: 159.9,
  },
  {
    id: 1004,
    fecha: '2025-05-22T11:05:00Z',
    estado: 'pendiente',
    usuario: { nombre: 'Luis Torres', email: 'luis@example.com' },
    items: [
      {
        productId: 9,
        nombre: 'Billetera Minimalista Camel',
        imagen_url: 'https://placehold.co/80x80?text=Billetera',
        precio: 59.9,
        cantidad: 3,
      },
    ],
    total: 179.7,
  },
  {
    id: 1005,
    fecha: '2025-05-23T08:30:00Z',
    estado: 'cancelado',
    usuario: { nombre: 'María Ruiz', email: 'maria@example.com' },
    items: [
      {
        productId: 5,
        nombre: 'Cinturón Vaquero Cuero Crudo',
        imagen_url: 'https://placehold.co/80x80?text=Cinturon',
        precio: 149.9,
        cantidad: 1,
      },
      {
        productId: 11,
        nombre: 'Cartera Dama Cuero Camel',
        imagen_url: 'https://placehold.co/80x80?text=Cartera',
        precio: 179.9,
        cantidad: 1,
      },
    ],
    total: 329.8,
  },
];

const BASE_URL = import.meta.env.VITE_API_URL as string | undefined;

export const ordersApi = {
  // Pedidos del usuario autenticado
  getMine(): Promise<Order[]> {
    // TODO: reemplazar cuando el backend esté listo
    // if (!BASE_URL) return Promise.resolve(MOCK_ORDERS.filter(o => o.usuario.email === currentUser.email));
    // return fetch(`${BASE_URL}/pedidos/mis-pedidos`, { headers: authHeaders() })
    //   .then(r => r.json());
    return Promise.resolve(MOCK_ORDERS.slice(0, 2));
  },

  // Todos los pedidos (solo admin)
  getAll(): Promise<Order[]> {
    // TODO: reemplazar cuando el backend esté listo
    // if (!BASE_URL) return Promise.resolve(MOCK_ORDERS);
    // return fetch(`${BASE_URL}/pedidos`, { headers: authHeaders() }).then(r => r.json());
    return Promise.resolve(MOCK_ORDERS);
  },

  updateEstado(id: number, estado: EstadoPedido): Promise<Order> {
    if (!BASE_URL) {
      const order = MOCK_ORDERS.find((o) => o.id === id);
      if (!order) return Promise.reject(new Error('Pedido no encontrado'));
      order.estado = estado;
      return Promise.resolve({ ...order });
    }
    return fetch(`${BASE_URL}/pedidos/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    }).then((r) => r.json());
  },
};
