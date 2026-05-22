import { BiChevronRight } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { socialLinks } from '../../Constant/links';

export const Footer = () => {
  return (
    <footer className="py-16 bg-gray-950 px-6 md:px-12 grid gap-10 text-slate-200 text-sm md:grid-cols-4">
      <Link to='/'
        className="text-2xl font-bold tracking-tighter text-white">
        KueriMex
      </Link>

      <div className="flex flex-col gap-4">
        <p className="font-semibold uppercase tracking-tighter">
          Suscribete
        </p>

        <p className="text-xs font-medium">
          Recibe las últimas noticias y promociones de Kuerimex directamente en tu correo electrónico.
        </p>

        <div className="border border-gray-800 flex items-center gap-2 px-3 py-2 rounded-full ">
          <input type="email"
            placeholder="Ingresa tu correo"
            className="p-2 bg-gray-950 text-slate-200 w-full focus:outline-none" />

          <button className="text-slate-200">
            <BiChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="font-semibold uppercase tracking-tighter">
          Políticas
        </p>
        <nav className="flex flex-col gap-2 text-xs font-medium">
          <Link to='/cinturones' className="text-slate-300 hover:text-white">Productos</Link>
          <Link to='#' className="text-slate-300 hover:text-white">Políticas de privacidad</Link>
          <Link to='#' className="text-slate-300 hover:text-white">Términos de uso</Link>
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <p className="font-semibold uppercase tracking-tighter">Síguenos</p>

        <p className="text-xs leading-6">No te pierdas las novedades que Kuerimex tiene para ti.</p>
        <div className="grid grid-cols-4 border border-gray-700">
          {socialLinks.map((link) => (
            <a key={link.id}
              href={link.href}
              target='_blank'
              rel='noreferrer'
              aria-label={link.title}
              className="text-slate-300 border-r border-gray-700 last:border-r-0 h-10 flex items-center justify-center transition-all hover:bg-white hover:text-gray-950">
              <link.icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};