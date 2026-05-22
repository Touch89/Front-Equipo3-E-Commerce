import { Link } from 'react-router-dom';

export const Banner = () => {
  return <div className="relative bg-gray-900 text-white">
    {/* Background image */}
    <div className="absolute inset-0 bg-cover bg-center opacity-70 h-full"
      style={{ backgroundImage: 'url(/img/img-banner.jpg)' }}></div>

    {/*Overlay */}
    <div className="absolute inset-0 bg-black opacity-50"></div>

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-center py-20 lg:py-40 px-4 text-center lg:px-8">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Nuestros mejores productos para ti
      </h1>
      <p className='text-lg mb-8 lg:text-2xl'>
        Descubre nuestra selección de productos de alta calidad diseñados para satisfacer tus necesidades.
      </p>


      <Link to='/cinturones'
        className="bg-gray-900 hover:bg-gray-950 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out">
        Ver Cinturones
      </Link>
    </div>
  </div>
};