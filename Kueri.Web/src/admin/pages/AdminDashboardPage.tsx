import { Link } from 'react-router-dom';

export const AdminDashboardPage = () => {
  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <header className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Panel de administración</h1>
        <p className="text-sm text-slate-600">Bienvenido al panel de administración de KueriMex.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/admin/productos"
          className="flex flex-col gap-1 rounded-xl border border-slate-200 p-5 transition hover:border-cyan-600 hover:shadow-md"
        >
          <span className="text-lg font-semibold text-slate-900">Productos</span>
          <span className="text-sm text-slate-500">Ver, editar y eliminar productos del catálogo.</span>
        </Link>

        <Link
          to="/admin/crear-producto"
          className="flex flex-col gap-1 rounded-xl border border-slate-200 p-5 transition hover:border-cyan-600 hover:shadow-md"
        >
          <span className="text-lg font-semibold text-slate-900">Crear producto</span>
          <span className="text-sm text-slate-500">Agrega un nuevo producto al catálogo.</span>
        </Link>

        <Link
          to="/admin/pedidos"
          className="flex flex-col gap-1 rounded-xl border border-slate-200 p-5 transition hover:border-cyan-600 hover:shadow-md"
        >
          <span className="text-lg font-semibold text-slate-900">Pedidos</span>
          <span className="text-sm text-slate-500">Ver y gestionar los pedidos de los usuarios.</span>
        </Link>

        <Link
          to="/admin/clientes"
          className="flex flex-col gap-1 rounded-xl border border-slate-200 p-5 transition hover:border-cyan-600 hover:shadow-md"
        >
          <span className="text-lg font-semibold text-slate-900">Clientes</span>
          <span className="text-sm text-slate-500">Ver y gestionar los clientes registrados.</span>
        </Link>

        <Link
          to="/admin/crear-cliente"
          className="flex flex-col gap-1 rounded-xl border border-slate-200 p-5 transition hover:border-cyan-600 hover:shadow-md"
        >
          <span className="text-lg font-semibold text-slate-900">Crear cliente</span>
          <span className="text-sm text-slate-500">Registra un nuevo cliente en el sistema.</span>
        </Link>
      </div>
    </section>
  );
};
