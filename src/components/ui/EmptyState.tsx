import { motion } from 'framer-motion';
import { Search, Heart, Package, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  type: 'no-results' | 'no-favorites' | 'no-listings' | 'error';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const icons = {
  'no-results': Search,
  'no-favorites': Heart,
  'no-listings': Package,
  'error': AlertCircle,
};

const defaults = {
  'no-results': {
    title: 'לא נמצאו שמלות',
    description: 'נסי לשנות את הסינון או לחפש משהו אחר',
    actionLabel: 'נקי סינון',
  },
  'no-favorites': {
    title: 'אין לך שמלות שמורות',
    description: 'לחצי על הלב בשמלות שאת אוהבת כדי לשמור אותן',
    actionLabel: 'גלי שמלות',
  },
  'no-listings': {
    title: 'אין לך שמלות למכירה',
    description: 'התחילי למכור את שמלת הכלה שלך',
    actionLabel: 'הוספת שמלה',
  },
  'error': {
    title: 'משהו השתבש',
    description: 'אירעה שגיאה, נסי שוב מאוחר יותר',
    actionLabel: 'נסי שוב',
  },
};

const EmptyState = ({ 
  type, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) => {
  const Icon = icons[type];
  const defaultConfig = defaults[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-4"
    >
      {/* Illustration */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring' }}
        className="relative w-32 h-32 mx-auto mb-6"
      >
        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
        <div className="absolute inset-4 bg-primary/20 rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="h-12 w-12 text-primary" />
        </div>
      </motion.div>

      {/* Text */}
      <h3 className="text-xl font-semibold mb-2">
        {title || defaultConfig.title}
      </h3>
      <p className="text-muted-foreground max-w-sm mx-auto mb-6">
        {description || defaultConfig.description}
      </p>

      {/* Action Button */}
      {onAction && (
        <Button variant="gold" onClick={onAction}>
          {actionLabel || defaultConfig.actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
