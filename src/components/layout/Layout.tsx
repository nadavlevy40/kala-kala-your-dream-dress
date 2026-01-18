import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  isLoggedIn?: boolean;
}

const Layout = ({ children, isLoggedIn = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="flex-1 pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
