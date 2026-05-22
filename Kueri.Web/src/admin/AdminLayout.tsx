import { Outlet } from 'react-router-dom';
import { AdminNavbar } from './components/AdminNavbar';

export const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-montserrat">
      <AdminNavbar />
      <main className="flex-1 container mx-auto my-8 px-4">
        <Outlet />
      </main>
    </div>
  );
};
