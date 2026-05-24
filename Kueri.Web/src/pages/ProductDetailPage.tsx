import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { HiArrowLeft } from 'react-icons/hi2';
import { productsApi } from '../api/products';
import type { Product } from '../api/products';
import { useCart } from '../context/CartContext';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    if (!id) return;
    productsApi
      .getById(id)
      .then((data) => {
        if (!data) throw new Error('Producto no encontrado');
        setProduct(data);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Error al cargar el producto'),
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-sm text-slate-500">Cargando producto...</div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-24 text-center">
        <p className="mb-4 text-sm text-red-600">{error ?? 'Producto no encontrado'}</p>
        <Link to="/cinturones" className="text-sm text-cyan-600 underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const isAvailable = product.stock > 0;

  return (
    <div>
      {/* Breadcrumb */}
      <Link
        to="/cinturones"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
      >
        <HiArrowLeft size={16} />
        Volver a Cinturones
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <img
            src={product.imagen_url}
            alt={product.nombre}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
              SKU: {product.sku}
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">{product.nombre}</h1>
          </div>

          <p className="text-3xl font-bold text-slate-900">
            MXN {product.precio.toFixed(2)}
          </p>

          <p className="leading-relaxed text-slate-600">{product.descripcion}</p>

          {/* Stock badge */}
          <div>
            {isAvailable ? (
              <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                En stock ({product.stock} disponibles)
              </span>
            ) : (
              <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                Agotado
              </span>
            )}
          </div>

          <button
            disabled={!isAvailable}
            onClick={() => addItem(product)}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <HiOutlineShoppingCart size={20} />
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};
