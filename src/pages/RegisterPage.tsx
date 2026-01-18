import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'שגיאה',
        description: 'הסיסמאות אינן תואמות',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'ברוכה הבאה לקהילה! 🎉',
      description: 'החשבון נוצר בהצלחה',
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-background flex items-center justify-center p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="block text-center mb-8">
          <span className="text-3xl font-bold text-gradient-gold">כלה קלה</span>
        </Link>

        {/* Card */}
        <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">הצטרפי לקהילה</h1>
            <p className="text-muted-foreground">צרי חשבון חדש בחינם</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-medium mb-2 block text-sm">שם מלא</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="השם שלך"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pr-12 input-elegant"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-medium mb-2 block text-sm">אימייל</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pr-12 input-elegant"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-medium mb-2 block text-sm">סיסמה</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="לפחות 8 תווים"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pr-12 pl-12 input-elegant"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="font-medium mb-2 block text-sm">אימות סיסמה</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="הקלידי שוב את הסיסמה"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pr-12 input-elegant"
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="gold" className="w-full" size="lg">
              צרי חשבון
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              בלחיצה על "צרי חשבון" את מסכימה ל
              <Link to="/terms" className="text-primary hover:underline">תנאי השימוש</Link>
              {' '}ול
              <Link to="/privacy" className="text-primary hover:underline">מדיניות הפרטיות</Link>
            </p>
          </form>

          <p className="text-center mt-8 text-muted-foreground">
            כבר יש לך חשבון?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              התחברי
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
