import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, Star, MessageCircle, Tag, Ruler, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { dresses } from '@/data/mockData';
import { cn } from '@/lib/utils';

const ProductPage = () => {
  const { id } = useParams();
  const dress = dresses.find((d) => d.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

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
                      <p className="text-sm text-muted-foreground">מעצב/ת</p>
                      <p className="font-semibold">{dress.designer}</p>
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

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="gold" size="xl" className="flex-1">
                    <MessageCircle className="h-5 w-5" />
                    צרי קשר עם המוכרת
                  </Button>
                  <Button variant="outline" size="xl" className="flex-1">
                    הצעי מחיר
                  </Button>
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
