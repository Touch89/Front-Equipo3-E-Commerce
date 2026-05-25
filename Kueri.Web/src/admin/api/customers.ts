export type Customer = {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fecha_registro: string;
};

// ── Mock data – placeholder until real API is connected ───────────────────────
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 1,
    nombre: 'Carlos López',
    email: 'carlos@example.com',
    telefono: '+52 555-0101',
    direccion: 'Av. Reforma 123, CDMX',
    fecha_registro: '2025-01-15T10:00:00Z',
  },
  {
    id: 2,
    nombre: 'Ana García',
    email: 'ana@example.com',
    telefono: '+52 555-0102',
    direccion: 'Calle Luna 45, Guadalajara',
    fecha_registro: '2025-02-20T11:30:00Z',
  },
  {
    id: 3,
    nombre: 'Luis Torres',
    email: 'luis@example.com',
    telefono: '+52 555-0103',
    direccion: 'Blvd. Independencia 789, Monterrey',
    fecha_registro: '2025-03-05T09:15:00Z',
  },
  {
    id: 4,
    nombre: 'María Ruiz',
    email: 'maria@example.com',
    telefono: '+52 555-0104',
    direccion: 'Av. Juarez 234, Puebla',
    fecha_registro: '2025-04-10T14:45:00Z',
  },
];

const BASE_URL = import.meta.env.VITE_API_URL as string | undefined;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Error ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const customersApi = {
  /** Returns all customers. */
  getAll(): Promise<Customer[]> {
    if (!BASE_URL) return Promise.resolve(MOCK_CUSTOMERS);
    return fetch(`${BASE_URL}/clientes`)
      .then((r) => handleResponse<Customer[]>(r))
      .catch(() => MOCK_CUSTOMERS);
  },

  /** Creates a new customer. */
  create(customer: Omit<Customer, 'id' | 'fecha_registro'>): Promise<Customer> {
    if (!BASE_URL) {
      const newCustomer: Customer = {
        ...customer,
        id: Math.floor(Math.random() * 10000),
        fecha_registro: new Date().toISOString(),
      };
      MOCK_CUSTOMERS.push(newCustomer);
      return Promise.resolve(newCustomer);
    }
    return fetch(`${BASE_URL}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    }).then((r) => handleResponse<Customer>(r));
  },

  /** Gets a single customer by id. */
  getById(id: number | string): Promise<Customer | undefined> {
    if (!BASE_URL) {
      return Promise.resolve(MOCK_CUSTOMERS.find((c) => c.id === Number(id)));
    }
    return fetch(`${BASE_URL}/clientes/${id}`)
      .then((r) => handleResponse<Customer>(r))
      .catch(() => MOCK_CUSTOMERS.find((c) => c.id === Number(id)));
  },
};
