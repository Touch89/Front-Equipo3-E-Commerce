import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../api/products';
import type { Product } from '../api/products';

export const ProductListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los productos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await productsApi.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el producto.');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <section className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
          <p className="text-sm text-slate-600">Gestiona el catálogo de productos.</p>
        </div>
        <Link
          to="/admin/crear-producto"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
        >
          + Nuevo producto
        </Link>
      </header>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <div className="py-12 text-center text-sm text-slate-500">Cargando productos...</div>
      ) : products.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-500">
          No hay productos registrados.{' '}
          <Link to="/admin/crear-producto" className="text-cyan-600 underline">
            Crear el primero
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="pb-3 pr-4">Imagen</th>
                <th className="pb-3 pr-4">Nombre</th>
                <th className="pb-3 pr-4">SKU</th>
                <th className="pb-3 pr-4">Precio</th>
                <th className="pb-3 pr-4">Stock</th>
                <th className="pb-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="py-3 pr-4">
                    <img
                      src={product.imagen_url}
                      alt={product.nombre}
                      className="h-12 w-12 rounded-lg object-cover border border-slate-200"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/48x48?text=N/A';
                      }}
                    />
                  </td>
                  <td className="py-3 pr-4 font-medium text-slate-900">{product.nombre}</td>
                  <td className="py-3 pr-4 text-slate-500">{product.sku || '—'}</td>
                  <td className="py-3 pr-4 text-slate-700">${product.precio.toFixed(2)}</td>
                  <td className="py-3 pr-4 text-slate-700">{product.stock}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/editar-producto/${product.id}`}
                        className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-cyan-600 hover:text-cyan-600"
                      >
                        Editar
                      </Link>
                      {confirmDeleteId === product.id ? (
                        <>
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                            className="rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                          >
                            {deletingId === product.id ? 'Eliminando...' : 'Confirmar'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:border-slate-500"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(product.id)}
                          className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-500 transition hover:border-red-500 hover:bg-red-50"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
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
