import { ReactNode, useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { supabase } from '@/integrations/supabase/client';

interface LayoutProps {
  children: ReactNode;
  // הורדנו את ה-prop הידני isLoggedIn כי אנחנו בודקים אותו כאן אוטומטית
}

const Layout = ({ children }: LayoutProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. בדיקה ראשונית בעליית האתר
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setIsLoading(false);
    };
    
    checkUser();

    // 2. האזנה לשינויים (התחברות/התנתקות בזמן אמת)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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