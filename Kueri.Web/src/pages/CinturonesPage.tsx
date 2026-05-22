import { useEffect, useState } from 'react';
import { productsApi } from '../api/products';
import type { Product } from '../api/products';
import { CardProduct } from '../components/products/CardProduct';

export const CinturonesPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    productsApi
      .getAll()
      .then(setProducts)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Error al cargar productos'),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Cinturones</h1>
        <p className="mt-2 text-slate-500">Elaborados a mano en cuero genuino</p>
      </header>

      {error && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500">Cargando productos...</div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center text-sm text-slate-500">
          No hay productos disponibles.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <CardProduct key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};