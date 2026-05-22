import { Link, NavLink } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineShoppingCart } from 'react-icons/hi';
import { navbarLinks } from '../../Constant/links';
import { FaBarsStaggered } from 'react-icons/fa6';
import { Logo } from './Logo';
import { useCart } from '../../context/CartContext';

export const Navbar = () => {
    const { itemCount, openCart } = useCart();

    return (
        <header className="bg-white text-black p-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-slate-200 lg:px-12">
            <Logo />

            <nav className="order-3 w-full md:order-none md:w-auto flex items-center gap-5 overflow-x-auto whitespace-nowrap">
                {
                    navbarLinks.map((link) => (
                        <NavLink
                            key={link.id}
                            to={link.href}
                            className={({ isActive }) => `${isActive ? 'text-cyan-600 underline' : ''} transition-all duration-300 font-medium hover:text-cyan-600 hover:underline`}
                        >
                            {link.title}
                        </NavLink>
                    ))
                }
            </nav>

            <div className="flex gap-5 items-center">
                <button>
                    <HiOutlineSearch size={25} />
                </button>
                <div className="relative">
                    {/* User Nav */}
                    <Link to='/account'
                        className='border-2 border-slate-700 w-9 h-9 rounded-full grid place-items-center text-lg font-bold'>
                    </Link>
                </div>
                <button className='relative' onClick={openCart}>
                    {itemCount > 0 && (
                        <span className='absolute -bottom-2 -right-2 h-5 w-5 flex items-center justify-center bg-black text-white text-xs rounded-full'>
                            {itemCount > 99 ? '99+' : itemCount}
                        </span>
                    )}
                    <HiOutlineShoppingCart size={25} />
                </button>

                <button className="md:hidden">
                    <FaBarsStaggered size={25} />
                </button>
            </div>
        </header>
    )
}