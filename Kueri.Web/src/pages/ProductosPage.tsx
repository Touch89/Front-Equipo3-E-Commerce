import { useEffect, useState, useMemo } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import { productsApi } from '../api/products';
import type { Product, Categoria } from '../api/products';
import { CardProduct } from '../components/products/CardProduct';

const CATEGORIAS: Categoria[] = ['Cinturones', 'Billeteras', 'Carteras'];

export const ProductosPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(null);

  useEffect(() => {
    productsApi
      .getAll()
      .then(setProducts)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Error al cargar productos'),
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const query = searchText.toLowerCase().trim();
    return products.filter((p) => {
      const matchesCategory = !selectedCategory || p.categoria === selectedCategory;
      const matchesSearch =
        !query ||
        p.nombre.toLowerCase().includes(query) ||
        p.descripcion.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [products, searchText, selectedCategory]);

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Productos</h1>
        <p className="mt-2 text-slate-500">Artículos elaborados a mano en cuero genuino</p>
      </header>

      {/* Search + filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <HiOutlineSearch
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-sm text-slate-800 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              !selectedCategory
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 text-slate-600 hover:border-slate-400'
            }`}
          >
            Todas
          </button>
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                selectedCategory === cat
                  ? 'border-cyan-600 bg-cyan-600 text-white'
                  : 'border-slate-200 text-slate-600 hover:border-cyan-400 hover:text-cyan-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500">Cargando productos...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-sm text-slate-500">
          No se encontraron productos.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <CardProduct key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
