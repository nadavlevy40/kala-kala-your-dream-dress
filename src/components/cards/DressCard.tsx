import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Dress } from '@/data/mockData';

interface DressCardProps {
  dress: Dress;
  showMatchBadge?: boolean;
}

const DressCard = ({ dress, showMatchBadge = false }: DressCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const discount = dress.originalPrice 
    ? Math.round(((dress.originalPrice - dress.price) / dress.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="card-elegant group"
    >
      <Link to={`/product/${dress.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-cream">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-cream animate-pulse" />
          )}
          <img
            src={dress.images[0]}
            alt={dress.title}
            className={cn(
              'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Match Badge */}
          {showMatchBadge && dress.matchPercentage && (
            <div className="match-badge">
              {dress.matchPercentage}% התאמה
            </div>
          )}

          {/* Discount Badge */}
          {discount > 0 && !showMatchBadge && (
            <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
              -{discount}%
            </div>
          )}

          {/* Like Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className={cn(
              'absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all',
              isLiked 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground'
            )}
          >
            <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
          </motion.button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link to={`/product/${dress.id}`}>
          <h3 className="font-semibold text-foreground mb-1 hover:text-primary transition-colors line-clamp-1">
            {dress.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-2">{dress.designer}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">
              ₪{dress.price.toLocaleString()}
            </span>
            {dress.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₪{dress.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="bg-secondary px-2 py-1 rounded">מידה {dress.size}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{dress.location}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DressCard;
