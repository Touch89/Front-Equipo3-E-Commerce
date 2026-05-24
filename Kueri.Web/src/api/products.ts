export type Categoria = 'Cinturones' | 'Billeteras' | 'Carteras';

export type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  precio: number;
  sku: string;
  stock: number;
  categoria: Categoria;
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
    categoria: 'Cinturones',
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
    categoria: 'Cinturones',
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
    categoria: 'Cinturones',
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
    categoria: 'Cinturones',
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
    categoria: 'Cinturones',
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
    categoria: 'Cinturones',
  },
  {
    id: 7,
    nombre: 'Billetera Clásica Negra',
    descripcion:
      'Billetera de cuero genuino con múltiples compartimientos para tarjetas. Diseño delgado y elegante, ideal para el bolsillo.',
    imagen_url: 'https://placehold.co/600x400?text=Billetera+Clasica+Negra',
    precio: 69.9,
    sku: 'WALL-001',
    stock: 18,
    categoria: 'Billeteras',
  },
  {
    id: 8,
    nombre: 'Billetera Marrón con Monedero',
    descripcion:
      'Billetera de cuero curtido vegetalmente con monedero integrado y porta-billetes amplio. Costura doble resistente.',
    imagen_url: 'https://placehold.co/600x400?text=Billetera+Marron+Monedero',
    precio: 89.9,
    sku: 'WALL-002',
    stock: 10,
    categoria: 'Billeteras',
  },
  {
    id: 9,
    nombre: 'Billetera Minimalista Camel',
    descripcion:
      'Billetera ultrafina de cuero nobuck para llevar lo esencial: hasta 6 tarjetas y billetes doblados. Perfecta para el día a día.',
    imagen_url: 'https://placehold.co/600x400?text=Billetera+Minimalista+Camel',
    precio: 59.9,
    sku: 'WALL-003',
    stock: 25,
    categoria: 'Billeteras',
  },
  {
    id: 10,
    nombre: 'Cartera Dama Cuero Negro',
    descripcion:
      'Cartera de mano elaborada en cuero genuino negro. Interior forrado con múltiples bolsillos y cierre de cremallera principal.',
    imagen_url: 'https://placehold.co/600x400?text=Cartera+Dama+Negro',
    precio: 159.9,
    sku: 'HAND-001',
    stock: 7,
    categoria: 'Carteras',
  },
  {
    id: 11,
    nombre: 'Cartera Dama Cuero Camel',
    descripcion:
      'Cartera de hombro en cuero natural tono camel. Correa ajustable, bolsillo frontal con cierre magnético y acabado artesanal.',
    imagen_url: 'https://placehold.co/600x400?text=Cartera+Dama+Camel',
    precio: 179.9,
    sku: 'HAND-002',
    stock: 5,
    categoria: 'Carteras',
  },
  {
    id: 12,
    nombre: 'Cartera Clutch Marrón',
    descripcion:
      'Clutch de cuero pulido en tono marrón oscuro. Cierre de hebilla dorada, interior con espacio para teléfono y tarjetas. Elegante y versátil.',
    imagen_url: 'https://placehold.co/600x400?text=Cartera+Clutch+Marron',
    precio: 129.9,
    sku: 'HAND-003',
    stock: 9,
    categoria: 'Carteras',
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
