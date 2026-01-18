import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. הוספנו את הפונקציה הזו להתחברות עם גוגל
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // זה דואג שהמשתמש יחזור לאתר שלך אחרי ההתחברות
          redirectTo: `${window.location.origin}/`, 
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "שגיאה בהתחברות",
        description: error.message,
      });
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: error.message,
      });
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-secondary">ברוכה השבה</h1>
        
        {/* כפתור גוגל */}
        <Button 
          variant="outline" 
          className="w-full mb-4 flex items-center justify-center gap-2"
          onClick={handleGoogleLogin} // <--- כאן חיברנו את הפונקציה!
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
          המשך עם Google
        </Button>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
          <span className="relative bg-white px-2 text-sm text-gray-500">או עם אימייל</span>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <Input 
            type="email" 
            placeholder="אימייל" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            type="password" 
            placeholder="סיסמה" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'התחברי'}
          </Button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          אין לך חשבון עדיין? <Link to="/register" className="text-primary font-medium hover:underline">הירשמי כאן</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;