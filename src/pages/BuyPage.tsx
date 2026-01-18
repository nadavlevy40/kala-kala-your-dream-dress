import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import DressCard from '@/components/cards/DressCard';
import EmptyState from '@/components/ui/EmptyState';
import { DesktopFilters, MobileFilters, SortBar } from '@/components/filters/BuyPageFilters';
import { Input } from '@/components/ui/input';
import { dresses as mockDresses, Dress } from '@/data/mockData'; // ייבוא הנתונים המדומים
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FilterState {
  priceRange: [number, number];
  designers: string[];
  conditions: string[];
  silhouette: string;
}

const BuyPage = () => {
  const { toast } = useToast();
  // State שמכיל גם את המוק וגם את האמיתיים
  const [allListings, setAllListings] = useState<Dress[]>(mockDresses); 
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 50000],
    designers: [],
    conditions: [],
    silhouette: '',
  });

  // שליפת נתונים אמיתיים מ-Supabase
  useEffect(() => {
    fetchRealListings();
  }, []);

  const fetchRealListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // המרה (Mapping) של הנתונים מ-Supabase למבנה של האתר
        const realDresses: Dress[] = data.map((item: any) => ({
          id: `real-${item.id}`, // מזהה ייחודי כדי לא להתנגש עם המוק
          title: item.title,
          designer: item.designer || 'לא ידוע',
          price: item.price,
          originalPrice: item.price * 1.3, // הערכה פיקטיבית למחיר מקורי
          size: Number(item.size) || 38,
          condition: item.condition || 'משומש במצב טוב',
          silhouette: 'A-Line', // ברירת מחדל אם אין בדאטה
          location: item.location || 'ישראל',
          description: item.description || '',
          images: item.image_url ? [item.image_url] : ['/placeholder.svg'], // הופך תמונה בודדת למערך
          seller: {
            name: 'מוכרת מהאתר', // כרגע אין לנו שם מוכר בטבלה הזו
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=felix',
            location: item.location || 'ישראל',
            phone: '', // לא נחשוף טלפון כאן
            rating: 5.0,
          },
          createdAt: item.created_at,
        }));

        // שילוב: הוספת האמיתיים לרשימה הקיימת (המוק)
        setAllListings([...mockDresses, ...realDresses]);
      }
    } catch (error) {
      console.error('Error loading real dresses:', error);
      toast({
        variant: "destructive",
        title: "שגיאה בטעינת נתונים",
        description: "מציג כרגע רק נתונים לדוגמה",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 50000],
      designers: [],
      conditions: [],
      silhouette: '',
    });
    setSearchQuery('');
  };

  // לוגיקת הסינון והמיון (עובדת על הרשימה המשולבת)
  const filteredDresses = useMemo(() => {
    let result = allListings.filter((dress) => {
      // Search query
      const matchesSearch = 
        !searchQuery ||
        dress.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        dress.designer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dress.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Price range
      const matchesPrice = 
        dress.price >= filters.priceRange[0] && 
        dress.price <= filters.priceRange[1];
      
      // Designers
      const matchesDesigner = 
        filters.designers.length === 0 || 
        filters.designers.includes(dress.designer);
      
      // Conditions
      const matchesCondition = 
        filters.conditions.length === 0 || 
        filters.conditions.includes(dress.condition);
      
      // Silhouette
      const matchesSilhouette = 
        !filters.silhouette || 
        dress.silhouette === filters.silhouette;

      return matchesSearch && matchesPrice && matchesDesigner && matchesCondition && matchesSilhouette;
    });

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        // מיון חכם שמטפל גם בתאריכים אמיתיים וגם במוק
        result = [...result].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return result;
  }, [searchQuery, filters, sortBy, allListings]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-cream to-background">
        {/* Header */}
        <div className="bg-cream py-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">מצאי את שמלת החלומות שלך</h1>
              <p className="text-muted-foreground">מאות שמלות כלה מעוצבות במחירים נגישים</p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="חפשי לפי מעצב, סגנון, או מילת מפתח..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-12 h-14 text-lg bg-card border-border rounded-xl input-elegant"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Mobile Filters */}
          <MobileFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
            resultCount={filteredDresses.length}
          />

          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <DesktopFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
              sortBy={sortBy}
              onSortChange={setSortBy}
              resultCount={filteredDresses.length}
            />

            {/* Main Content */}
            <div className="flex-1">
              {/* Sort Bar - Desktop */}
              <SortBar
                sortBy={sortBy}
                onSortChange={setSortBy}
                resultCount={filteredDresses.length}
              />

              {/* Dress Grid */}
              {loading && filteredDresses.length === 0 ? (
                 <div className="flex justify-center py-20">
                   <Loader2 className="h-10 w-10 animate-spin text-primary" />
                 </div>
              ) : filteredDresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredDresses.map((dress, index) => (
                    <motion.div
                      key={dress.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <DressCard dress={dress} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  type="no-results" 
                  onAction={clearFilters}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BuyPage;