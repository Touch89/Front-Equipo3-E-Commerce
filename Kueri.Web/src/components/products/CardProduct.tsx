import { Link } from 'react-router-dom';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import type { Product } from '../../api/products';
import { useCart } from '../../context/CartContext';

interface Props {
  product: Product;
}

export const CardProduct = ({ product }: Props) => {
  const { addItem } = useCart();

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="overflow-hidden bg-slate-100">
        <img
          src={product.imagen_url}
          alt={product.nombre}
          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-base font-semibold leading-tight text-slate-900">{product.nombre}</h3>
        <p className="line-clamp-2 flex-1 text-sm text-slate-500">{product.descripcion}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-slate-900">
            S/ {product.precio.toFixed(2)}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={product.stock === 0}
              onClick={() => addItem(product)}
              title="Agregar al carrito"
              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-cyan-600 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <HiOutlineShoppingCart size={18} />
            </button>
            <Link
              to={`/productos/${product.id}`}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              Ver detalle
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
