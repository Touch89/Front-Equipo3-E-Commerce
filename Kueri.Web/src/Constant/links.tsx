import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa6';

export const navbarLinks = [
    { id: 1, title: 'Inicio', href: '/' },
    { id: 2, title: 'Cinturones', href: '/cinturones' },
    { id: 3, title: 'Sobre Nosotros', href: '/nosotros' },
];

export const socialLinks = [
    {
        id: 1,
        title: 'Facebook',
        href: 'https://www.facebook.com/',
        icon: FaFacebookF
    },
    {
        id: 2,
        title: 'Instagram',
        href: 'https://www.instagram.com/',
        icon: FaInstagram
    },
    {
        id: 3,
        title: 'TikTok',
        href: 'https://www.tiktok.com/',
        icon: FaTiktok
    },
    {
        id: 4,
        title: 'WhatsApp',
        href: 'https://wa.me/',
        icon: FaWhatsapp
    }
];