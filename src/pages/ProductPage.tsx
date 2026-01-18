import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, Star, Tag, Ruler, Sparkles, ChevronLeft, ChevronRight, Phone, Eye, EyeOff } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { dresses } from '@/data/mockData';
import { cn } from '@/lib/utils';

// WhatsApp icon component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const ProductPage = () => {
  const { id } = useParams();
  const dress = dresses.find((d) => d.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  if (!dress) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">השמלה לא נמצאה</h1>
          <Link to="/buy">
            <Button>חזרה לחנות</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const discount = dress.originalPrice 
    ? Math.round(((dress.originalPrice - dress.price) / dress.originalPrice) * 100)
    : 0;

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % dress.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + dress.images.length) % dress.images.length);
  };

  // Format phone for WhatsApp (remove leading 0, add Israel code)
  const formatPhoneForWhatsApp = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return '972' + cleaned.substring(1);
    }
    return cleaned;
  };

  const whatsappUrl = `https://wa.me/${formatPhoneForWhatsApp(dress.seller.phone)}?text=${encodeURIComponent(`היי! ראיתי את השמלה "${dress.title}" שלך באתר כלה קלה ואשמח לשמוע עוד פרטים 💕`)}`;

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary">דף הבית</Link></li>
              <li>/</li>
              <li><Link to="/buy" className="hover:text-primary">שמלות</Link></li>
              <li>/</li>
              <li className="text-foreground">{dress.title}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Image Gallery - Right side in RTL */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="order-1 lg:order-2"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-cream mb-4">
                <img
                  src={dress.images[selectedImage]}
                  alt={dress.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {dress.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Like Button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLiked(!isLiked)}
                  className={cn(
                    'absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center transition-all',
                    isLiked 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground'
                  )}
                >
                  <Heart className={cn('h-6 w-6', isLiked && 'fill-current')} />
                </motion.button>

                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-bold">
                    -{discount}% הנחה
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {dress.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'w-20 h-24 rounded-lg overflow-hidden border-2 transition-all',
                      selectedImage === index 
                        ? 'border-primary' 
                        : 'border-transparent hover:border-primary/50'
                    )}
                  >
                    <img
                      src={image}
                      alt={`${dress.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info - Left side in RTL */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="order-2 lg:order-1"
            >
              <div className="sticky top-24">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{dress.title}</h1>
                <p className="text-xl text-muted-foreground mb-6">{dress.designer}</p>

                {/* Price */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl font-bold text-primary">
                    ₪{dress.price.toLocaleString()}
                  </span>
                  {dress.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ₪{dress.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-cream rounded-xl">
                    <Ruler className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">מידה</p>
                      <p className="font-semibold">{dress.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-cream rounded-xl">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">מצב</p>
                      <p className="font-semibold">{dress.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-cream rounded-xl">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">מיקום</p>
                      <p className="font-semibold">{dress.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-cream rounded-xl">
                    <Tag className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">סגנון</p>
                      <p className="font-semibold">{dress.silhouette}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-3">תיאור</h3>
                  <p className="text-muted-foreground leading-relaxed">{dress.description}</p>
                </div>

                {/* Seller Card */}
                <div className="bg-cream rounded-xl p-6 mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={dress.seller.avatar}
                      alt={dress.seller.name}
                      className="w-14 h-14 rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold">{dress.seller.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {dress.seller.location}
                      </div>
                    </div>
                    <div className="mr-auto flex items-center gap-1 bg-background px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 text-primary fill-primary" />
                      <span className="font-medium">{dress.seller.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - WhatsApp Integration */}
                <div className="flex flex-col gap-4">
                  {/* WhatsApp Button - Primary CTA */}
                  <motion.a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-colors"
                  >
                    <WhatsAppIcon className="h-6 w-6" />
                    שליחת הודעה למוכרת
                  </motion.a>

                  {/* Show Phone Button */}
                  <Button 
                    variant="outline" 
                    size="xl" 
                    className="w-full gap-2"
                    onClick={() => setShowPhone(!showPhone)}
                  >
                    {showPhone ? (
                      <>
                        <EyeOff className="h-5 w-5" />
                        הסתרת מספר טלפון
                      </>
                    ) : (
                      <>
                        <Eye className="h-5 w-5" />
                        הצגת מספר טלפון
                      </>
                    )}
                  </Button>

                  {/* Phone Number Display */}
                  {showPhone && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-cream rounded-xl p-4 text-center"
                    >
                      <p className="text-sm text-muted-foreground mb-1">מספר הטלפון של המוכרת:</p>
                      <a 
                        href={`tel:${dress.seller.phone}`}
                        className="text-xl font-bold text-primary flex items-center justify-center gap-2 ltr"
                      >
                        <Phone className="h-5 w-5" />
                        {dress.seller.phone}
                      </a>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;
