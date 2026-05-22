import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';

const adminLinks = [
  { id: 1, title: 'Productos', href: '/admin/productos' },
  { id: 2, title: 'Crear Producto', href: '/admin/crear-producto' },
];

export const AdminNavbar = () => {
  return (
    <header className="bg-slate-900 text-white p-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-slate-700 lg:px-12">
      <Link to="/admin" className="text-xl font-bold tracking-tight">
        Kueri<span className="text-cyan-400">Mex</span>
        <span className="ml-2 text-xs font-normal text-slate-400 uppercase tracking-widest">Admin</span>
      </Link>

      <nav className="order-3 w-full md:order-none md:w-auto flex items-center gap-5 overflow-x-auto whitespace-nowrap">
        {adminLinks.map((link) => (
          <NavLink
            key={link.id}
            to={link.href}
            className={({ isActive }) =>
              `${isActive ? 'text-cyan-400 underline' : 'text-slate-300'} transition-all duration-300 font-medium hover:text-cyan-400 hover:underline`
            }
          >
            {link.title}
          </NavLink>
        ))}
      </nav>

      <Link
        to="/"
        className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
      >
        ← Volver al sitio
      </Link>
    </header>
  );
};
