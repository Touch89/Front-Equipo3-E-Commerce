export type MetodoPago = 'tarjeta';

export type CheckoutItem = {
  productId: number;
  nombre: string;
  precio: number;
  cantidad: number;
};

export type CheckoutPayload = {
  nombre: string;
  email: string;
  direccion: string;
  ciudad: string;
  telefono: string;
  metodoPago: MetodoPago;
  items: CheckoutItem[];
  total: number;
};

export type CheckoutResponse = {
  id: number;
  fecha: string;
  estado: string;
  sync: {
    prestashop: { ok: boolean; id: number | null; error: string | null };
  };
};

const BASE_URL = import.meta.env.VITE_API_URL as string;

export async function crearPedido(payload: CheckoutPayload): Promise<CheckoutResponse> {
  const response = await fetch(`${BASE_URL}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    let message = `Error ${response.status}`;
    try {
      const json = JSON.parse(text);
      message = json.error ?? message;
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }

  return response.json() as Promise<CheckoutResponse>;
}
