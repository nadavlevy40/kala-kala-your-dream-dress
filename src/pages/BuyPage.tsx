import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import DressCard from '@/components/cards/DressCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dresses, designers, locations, sizes } from '@/data/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BuyPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedDesigner, setSelectedDesigner] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');

  const filteredDresses = dresses.filter((dress) => {
    const matchesSearch = dress.title.includes(searchQuery) || 
                         dress.designer.includes(searchQuery);
    const matchesSize = !selectedSize || dress.size.toString() === selectedSize;
    const matchesDesigner = !selectedDesigner || dress.designer === selectedDesigner;
    const matchesLocation = !selectedLocation || dress.location === selectedLocation;
    
    let matchesPrice = true;
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      matchesPrice = dress.price >= min && (!max || dress.price <= max);
    }

    return matchesSearch && matchesSize && matchesDesigner && matchesLocation && matchesPrice;
  });

  const clearFilters = () => {
    setSelectedSize('');
    setSelectedDesigner('');
    setSelectedLocation('');
    setPriceRange('');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedSize || selectedDesigner || selectedLocation || priceRange;

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
          {/* Filters Toggle & Active Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                סינון
              </Button>
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="gap-2 text-destructive">
                  <X className="h-4 w-4" />
                  נקי סינון
                </Button>
              )}
            </div>
            <p className="text-muted-foreground">
              {filteredDresses.length} שמלות נמצאו
            </p>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-card rounded-xl p-6 mb-8 border border-border"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">מידה</label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="כל המידות" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">כל המידות</SelectItem>
                      {sizes.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          מידה {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">מעצב/ת</label>
                  <Select value={selectedDesigner} onValueChange={setSelectedDesigner}>
                    <SelectTrigger>
                      <SelectValue placeholder="כל המעצבים" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">כל המעצבים</SelectItem>
                      {designers.map((designer) => (
                        <SelectItem key={designer} value={designer}>
                          {designer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">מיקום</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="כל המיקומים" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">כל המיקומים</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">טווח מחירים</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="כל המחירים" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">כל המחירים</SelectItem>
                      <SelectItem value="0-5000">עד ₪5,000</SelectItem>
                      <SelectItem value="5000-10000">₪5,000 - ₪10,000</SelectItem>
                      <SelectItem value="10000-15000">₪10,000 - ₪15,000</SelectItem>
                      <SelectItem value="15000-">מעל ₪15,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Dress Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

          {filteredDresses.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl text-muted-foreground mb-4">לא נמצאו שמלות התואמות לחיפוש</p>
              <Button onClick={clearFilters}>נקי סינון</Button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BuyPage;
