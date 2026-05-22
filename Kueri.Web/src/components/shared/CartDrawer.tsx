import { HiOutlineShoppingCart } from 'react-icons/hi';
import { HiXMark, HiMinus, HiPlus } from 'react-icons/hi2';
import { useCart } from '../../context/CartContext';

export const CartDrawer = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, clearCart } =
    useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-900">
            Carrito
            {items.length > 0 && (
              <span className="ml-2 text-sm font-normal text-slate-400">
                ({items.length} {items.length === 1 ? 'producto' : 'productos'})
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <HiXMark size={22} />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-slate-400">
            <HiOutlineShoppingCart size={48} className="text-slate-200" />
            <p className="text-sm">Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-slate-100 overflow-y-auto px-5 py-3">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4 py-4">
                  <img
                    src={product.imagen_url}
                    alt={product.nombre}
                    className="h-20 w-20 flex-shrink-0 rounded-xl border border-slate-100 object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {product.nombre}
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      S/ {product.precio.toFixed(2)}
                    </p>
                    {/* Quantity controls */}
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                      >
                        <HiMinus size={13} />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(product.id, Math.min(quantity + 1, product.stock))
                        }
                        disabled={quantity >= product.stock}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40"
                      >
                        <HiPlus size={13} />
                      </button>
                      <span className="ml-auto text-xs text-slate-400">
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="self-start rounded-md p-1 text-slate-400 transition hover:text-red-500"
                  >
                    <HiXMark size={16} />
                  </button>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="border-t border-slate-200 px-5 py-5">
              <div className="mb-4 flex justify-between text-base font-bold text-slate-900">
                <span>Total</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
              <button className="mb-2 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-cyan-700">
                Proceder al pago
              </button>
              <button
                onClick={clearCart}
                className="w-full rounded-xl border border-slate-200 py-2.5 text-sm text-slate-500 transition hover:bg-slate-50"
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
