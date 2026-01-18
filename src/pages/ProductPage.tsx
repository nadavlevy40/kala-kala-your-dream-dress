import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, ChevronRight, Ruler, Tag, Sparkles, MessageCircle, Share2, Phone } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { dresses as mockDresses, Dress } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Dress | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [sellerPhone, setSellerPhone] = useState<string>('');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;

    // 1. בדיקה אם זה מוצר אמיתי מ-Supabase
    if (id.startsWith('real-')) {
      const realIdString = id.replace('real-', '');
      const realId = parseInt(realIdString); // <--- התיקון כאן: המרה למספר

      if (isNaN(realId)) {
         setLoading(false);
         return;
      }

      try {
        setLoading(true);
        
        // שליפת השמלה + פרטי המוכרת (באמצעות join)
        const { data: listing, error } = await supabase
          .from('listings')
          .select(`
            *,
            profiles:user_id (
              full_name,
              avatar_url,
              phone,
              city
            )
          `)
          .eq('id', realId) // עכשיו זה מספר תקין
          .single();

        if (error) throw error;

        if (listing) {
          // המרת הנתונים למבנה של האתר
          const profile = listing.profiles as any;
          const mappedProduct: Dress = {
            id: id,
            title: listing.title,
            designer: listing.designer || 'לא ידוע',
            price: listing.price,
            originalPrice: listing.price * 1.3,
            size: Number(listing.size) || 38,
            condition: listing.condition as any || 'משומש',
            silhouette: 'A-Line',
            location: listing.location || profile?.city || 'ישראל',
            description: listing.description || '',
            images: listing.image_url ? [listing.image_url] : ['/placeholder.svg'],
            seller: {
              name: profile?.full_name || 'מוכרת מהאתר',
              avatar: profile?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
              location: profile?.city || listing.location || 'ישראל',
              phone: profile?.phone || '',
              rating: 5.0,
            },
            createdAt: listing.created_at,
          };
          
          setProduct(mappedProduct);
          setSellerPhone(profile?.phone || '');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          variant: "destructive",
          title: "שגיאה",
          description: "לא הצלחנו לטעון את פרטי השמלה",
        });
      } finally {
        setLoading(false);
      }
    } 
    // 2. אם זה לא אמיתי - נחפש במוק
    else {
      const mockProduct = mockDresses.find((d) => d.id === id);
      setProduct(mockProduct || null);
      if (mockProduct) setSellerPhone(mockProduct.seller.phone);
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (!sellerPhone) {
      toast({
        title: "מספר חסר",
        description: "למוכרת זו אין מספר טלפון מעודכן במערכת.",
        variant: "destructive"
      });
      return;
    }
    
    const message = `היי ${product?.seller.name}, ראיתי את השמלה שלך (${product?.title}) באתר "כלה קלה" ואשמח לפרטים נוספים.`;
    const url = `https://wa.me/${sellerPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-7xl">
           <div className="grid lg:grid-cols-2 gap-12">
             <Skeleton className="h-[600px] w-full rounded-3xl" />
             <div className="space-y-6">
               <Skeleton className="h-8 w-1/3" />
               <Skeleton className="h-12 w-3/4" />
               <Skeleton className="h-24 w-full" />
             </div>
           </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">המוצר לא נמצא</h2>
          <Button onClick={() => window.history.back()}>חזרה לקטלוג</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-cream to-background">
        {/* Breadcrumb */}
        <div className="border-b border-border/50 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <Link
              to="/buy"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
              <span>חזרה לקטלוג</span>
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Right Side - Images */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="order-1 lg:order-2"
            >
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-4 bg-white shadow-soft">
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors">
                  <Share2 className="w-5 h-5 text-secondary" />
                </button>
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`
                        aspect-square rounded-xl overflow-hidden transition-all border-2
                        ${selectedImage === index 
                          ? 'border-primary opacity-100' 
                          : 'border-transparent opacity-60 hover:opacity-100'}
                      `}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Left Side - Details */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="order-2 lg:order-1"
            >
              {/* Header Info */}
              <div className="mb-8">
                <p className="text-primary font-medium mb-2">{product.designer}</p>
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-3">{product.title}</h1>
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`
                      w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center transition-all
                      ${isLiked 
                        ? 'bg-primary text-white' 
                        : 'bg-cream text-muted-foreground hover:bg-border'}
                    `}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">פורסם ב: {new Date(product.createdAt).toLocaleDateString('he-IL')}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-border">
                <span className="text-4xl font-bold text-primary">₪{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">₪{product.originalPrice.toLocaleString()}</span>
                )}
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  חיסכון ענק
                </span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-cream rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary">
                    <Ruler className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">מידה</p>
                    <p className="font-semibold">{product.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-cream rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">מצב</p>
                    <p className="font-semibold">{product.condition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-cream rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">מיקום</p>
                    <p className="font-semibold">{product.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-cream rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">בד/חומר</p>
                    <p className="font-semibold">תחרה/משי</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-3">תיאור השמלה</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Seller Card */}
              <div className="bg-gradient-to-br from-cream to-transparent rounded-2xl p-6 mb-8 border border-border/50">
                <p className="text-sm text-muted-foreground mb-4">המוכרת</p>
                <div className="flex items-center gap-4">
                  <img
                    src={product.seller.avatar}
                    alt={product.seller.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h4 className="font-semibold text-lg">{product.seller.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{product.seller.location}</span>
                      <span>•</span>
                      <span>⭐ {product.seller.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 flex-col sm:flex-row">
                <Button 
                  onClick={handleWhatsAppClick}
                  variant="gold" 
                  size="xl" 
                  className="flex-1 bg-[#25D366] hover:bg-[#128C7E] border-none text-white shadow-lg shadow-green-900/10"
                >
                  <MessageCircle className="w-5 h-5 ml-2" />
                  שלחי הודעה ב-WhatsApp
                </Button>
                
                <Button variant="outline" size="xl" className="flex-1 border-primary text-primary hover:bg-primary/5">
                  <Phone className="w-5 h-5 ml-2" />
                  הצג טלפון
                </Button>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;