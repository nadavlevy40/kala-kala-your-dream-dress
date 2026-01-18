import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import DressCard from '@/components/cards/DressCard';
import EmptyState from '@/components/ui/EmptyState';
import { DesktopFilters, MobileFilters, SortBar } from '@/components/filters/BuyPageFilters';
import { Input } from '@/components/ui/input';
import { dresses } from '@/data/mockData';

interface FilterState {
  priceRange: [number, number];
  designers: string[];
  conditions: string[];
  silhouette: string;
}

const BuyPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 50000],
    designers: [],
    conditions: [],
    silhouette: '',
  });

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 50000],
      designers: [],
      conditions: [],
      silhouette: '',
    });
    setSearchQuery('');
  };

  const filteredDresses = useMemo(() => {
    let result = dresses.filter((dress) => {
      // Search query
      const matchesSearch = 
        !searchQuery ||
        dress.title.includes(searchQuery) || 
        dress.designer.includes(searchQuery) ||
        dress.location.includes(searchQuery);
      
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
        result = [...result].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return result;
  }, [searchQuery, filters, sortBy]);

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
              {filteredDresses.length > 0 ? (
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
