import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '../layouts/RootLayout';
import { AboutPage, HomePage, CinturonesPage, ProductDetailPage } from '../pages';
import { AdminLayout } from '../admin/AdminLayout';
import { AdminDashboardPage, CreateProductPage, EditProductPage, ProductListPage } from '../admin/pages';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: 'cinturones',
                element: <CinturonesPage />
            },
            {
                path: 'nosotros',
                element: <AboutPage />
            },
            {
                path: 'productos/:id',
                element: <ProductDetailPage />
            },
        ]
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <AdminDashboardPage />
            },
            {
                path: 'productos',
                element: <ProductListPage />
            },
            {
                path: 'crear-producto',
                element: <CreateProductPage />
            },
            {
                path: 'editar-producto/:id',
                element: <EditProductPage />
            },
        ]
    }
]);