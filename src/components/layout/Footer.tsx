import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-cream-dark border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-gradient-gold mb-4">כלה קלה</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              הפלטפורמה המובילה בישראל לקנייה ומכירה של שמלות כלה יד שנייה. 
              מציאת שמלת החלומות עוד מעולם לא הייתה כל כך קלה.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">קישורים מהירים</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/buy" className="text-muted-foreground hover:text-primary transition-colors">
                  קניית שמלה
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-muted-foreground hover:text-primary transition-colors">
                  מכירת שמלה
                </Link>
              </li>
              <li>
                <Link to="/ai-match" className="text-muted-foreground hover:text-primary transition-colors">
                  חיפוש AI
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-muted-foreground hover:text-primary transition-colors">
                  קהילה
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">קטגוריות</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/buy?style=aline" className="text-muted-foreground hover:text-primary transition-colors">
                  שמלות A-Line
                </Link>
              </li>
              <li>
                <Link to="/buy?style=mermaid" className="text-muted-foreground hover:text-primary transition-colors">
                  שמלות סירן
                </Link>
              </li>
              <li>
                <Link to="/buy?style=princess" className="text-muted-foreground hover:text-primary transition-colors">
                  שמלות נסיכה
                </Link>
              </li>
              <li>
                <Link to="/buy?style=boho" className="text-muted-foreground hover:text-primary transition-colors">
                  שמלות בוהו
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">צרי קשר</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:hello@kalakala.co.il" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  hello@kalakala.co.il
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-4 mt-6">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} כלה קלה. כל הזכויות שמורות.
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            נבנה עם <Heart className="h-4 w-4 text-primary fill-primary" /> בישראל
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
