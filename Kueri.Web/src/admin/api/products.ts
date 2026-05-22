const BASE_URL = import.meta.env.VITE_API_URL as string;

export type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  precio: number;
  sku: string;
  stock: number;
};

export type ProductPayload = Omit<Product, 'id'>;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Error ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const productsApi = {
  getAll(): Promise<Product[]> {
    return fetch(`${BASE_URL}/productos`).then((r) => handleResponse<Product[]>(r));
  },

  getById(id: number | string): Promise<Product> {
    return fetch(`${BASE_URL}/productos/${id}`).then((r) => handleResponse<Product>(r));
  },

  create(payload: ProductPayload): Promise<Product> {
    return fetch(`${BASE_URL}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((r) => handleResponse<Product>(r));
  },

  update(id: number | string, payload: ProductPayload): Promise<Product> {
    return fetch(`${BASE_URL}/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((r) => handleResponse<Product>(r));
  },

  delete(id: number | string): Promise<void> {
    return fetch(`${BASE_URL}/productos/${id}`, {
      method: 'DELETE',
    }).then((r) => {
      if (!r.ok) throw new Error(`Error ${r.status} al eliminar producto`);
    });
  },
};
