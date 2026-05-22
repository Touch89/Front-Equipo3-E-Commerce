export type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  precio: number;
  sku: string;
  stock: number;
};

// ── Mock data – placeholder until real API is connected ───────────────────────
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    nombre: 'Cinturón Clásico Negro',
    descripcion:
      'Cinturón de cuero genuino con hebilla metálica plateada. Acabado liso, ideal para uso formal y casual. Costura reforzada para mayor durabilidad.',
    imagen_url: 'https://placehold.co/600x400?text=Cinturon+Clasico+Negro',
    precio: 89.9,
    sku: 'BELT-001',
    stock: 15,
  },
  {
    id: 2,
    nombre: 'Cinturón Trenzado Marrón',
    descripcion:
      'Cinturón de cuero trenzado artesanalmente. Diseño único con hebilla dorada de alta resistencia. Cada pieza es elaborada a mano por nuestros artesanos.',
    imagen_url: 'https://placehold.co/600x400?text=Cinturon+Trenzado+Marron',
    precio: 109.9,
    sku: 'BELT-002',
    stock: 8,
  },
  {
    id: 3,
    nombre: 'Cinturón Casual Camel',
    descripcion:
      'Cinturón de cuero nobuck en tono camel. Textura suave y costura reforzada para mayor durabilidad. Perfecto para un look casual moderno.',
    imagen_url: 'https://placehold.co/600x400?text=Cinturon+Casual+Camel',
    precio: 99.9,
    sku: 'BELT-003',
    stock: 20,
  },
  {
    id: 4,
    nombre: 'Cinturón Reversible Negro/Marrón',
    descripcion:
      'Versátil cinturón reversible de cuero genuino, negro por un lado y marrón por el otro. Hebilla desmontable que permite el cambio en segundos.',
    imagen_url: 'https://placehold.co/600x400?text=Cinturon+Reversible',
    precio: 129.9,
    sku: 'BELT-004',
    stock: 10,
  },
  {
    id: 5,
    nombre: 'Cinturón Vaquero Cuero Crudo',
    descripcion:
      'Cinturón estilo vaquero elaborado en cuero crudo curtido vegetalmente. Hebilla de acero macizo. Ideal para quien busca un estilo robusto y auténtico.',
    imagen_url: 'https://placehold.co/600x400?text=Cinturon+Vaquero',
    precio: 149.9,
    sku: 'BELT-005',
    stock: 5,
  },
  {
    id: 6,
    nombre: 'Cinturón Slim Elegante Negro',
    descripcion:
      'Cinturón delgado de cuero pulido, perfecto para trajes y ropa formal. Hebilla plateada minimalista. Acabado espejo en la piel.',
    imagen_url: 'https://placehold.co/600x400?text=Cinturon+Slim+Negro',
    precio: 119.9,
    sku: 'BELT-006',
    stock: 12,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL as string | undefined;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Error ${response.status}`);
  }
  return response.json() as Promise<T>;
}

// ── Public API ────────────────────────────────────────────────────────────────
export const productsApi = {
  /** Returns all products. Falls back to mock data when the API is unreachable. */
  getAll(): Promise<Product[]> {
    // TODO: uncomment when the backend is ready
    // if (!BASE_URL) return Promise.resolve(MOCK_PRODUCTS);
    // return fetch(`${BASE_URL}/productos`)
    //   .then((r) => handleResponse<Product[]>(r))
    //   .catch(() => MOCK_PRODUCTS);
    return Promise.resolve(MOCK_PRODUCTS);
  },

  /** Returns a single product by id. Falls back to mock data when the API is unreachable. */
  getById(id: number | string): Promise<Product | undefined> {
    // TODO: uncomment when the backend is ready
    // if (!BASE_URL) {
    //   return Promise.resolve(MOCK_PRODUCTS.find((p) => p.id === Number(id)));
    // }
    // return fetch(`${BASE_URL}/productos/${id}`)
    //   .then((r) => handleResponse<Product>(r))
    //   .catch(() => MOCK_PRODUCTS.find((p) => p.id === Number(id)));
    return Promise.resolve(MOCK_PRODUCTS.find((p) => p.id === Number(id)));
  },
};
