import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

// עדכון ה-Interface שיכיל את כל האפשרויות
export interface DressCardProps {
  id?: string | number; // הוספנו את זה
  title?: string;
  price?: number;
  image?: string;
  designer?: string;
  size?: string;
  condition?: string;
  // אופציונלי: תמיכה גם באובייקט שלם
  dress?: {
    id: string | number;
    title: string;
    price: number;
    images: string[];
    designer: string;
    size: number;
    condition: string;
  };
}

const DressCard = (props: DressCardProps) => {
  // נרמול הנתונים: או שזה בא מ-props בודדים או מהאובייקט dress
  const data = props.dress ? {
    id: props.dress.id,
    title: props.dress.title,
    price: props.dress.price,
    image: props.dress.images[0],
    designer: props.dress.designer,
    size: props.dress.size,
    condition: props.dress.condition
  } : {
    id: props.id,
    title: props.title,
    price: props.price,
    image: props.image,
    designer: props.designer,
    size: props.size,
    condition: props.condition
  };

  if (!data.title) return null; // הגנה

  return (
    <div className="group relative bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* תמונה וקישור */}
      <Link to={`/product/${data.id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={data.image || '/placeholder.svg'}
          alt={data.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        
        {/* כפתור לייק */}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
          <Heart className="w-4 h-4" />
        </button>
      </Link>

      {/* פרטים */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{data.designer}</p>
            <h3 className="font-medium text-base text-secondary truncate max-w-[180px]" title={data.title}>
              {data.title}
            </h3>
          </div>
          <p className="font-bold text-primary">₪{data.price?.toLocaleString()}</p>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-3 pt-3 border-t border-gray-100">
          <span className="bg-cream px-2 py-1 rounded">מידה {data.size}</span>
          <span>•</span>
          <span>{data.condition}</span>
        </div>
      </div>
    </div>
  );
};

export default DressCard;