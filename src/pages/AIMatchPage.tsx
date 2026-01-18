import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, X, Image as ImageIcon } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import DressCard from '@/components/cards/DressCard';
import ScanningOverlay from '@/components/ai/ScanningOverlay';
import { Button } from '@/components/ui/button';
import { dresses } from '@/data/mockData';

const AIMatchPage = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Simulate AI matching with random percentages
  const matchedDresses = dresses.map((dress) => ({
    ...dress,
    matchPercentage: Math.floor(Math.random() * 20) + 80, // 80-99%
  })).sort((a, b) => b.matchPercentage - a.matchPercentage);

  const handleFileUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setUploadedImage(url);
    setIsScanning(true);
    setShowResults(false);
    
    // Simulate AI processing with scanning animation
    setTimeout(() => {
      setIsScanning(false);
      setShowResults(true);
    }, 3000); // 3 seconds for the "wow" effect
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const resetSearch = () => {
    setUploadedImage(null);
    setShowResults(false);
    setIsScanning(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-cream to-background">
        {/* Header */}
        <div className="bg-cream py-10">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">חיפוש AI חכם</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              מצאי שמלות דומות לתמונה שלך
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground max-w-xl mx-auto"
            >
              העלי תמונה של שמלה שאהבת מאינסטגרם או פינטרסט ונמצא לך שמלות דומות במלאי שלנו
            </motion.p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          {/* Upload & Scanning State */}
          {!showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              {/* Scanning Animation */}
              {uploadedImage && isScanning && (
                <ScanningOverlay imageSrc={uploadedImage} />
              )}

              {/* Upload Zone - Only show if no image uploaded */}
              {!uploadedImage && (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="relative bg-card rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <label className="block p-16 cursor-pointer">
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="h-12 w-12 text-primary" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2">גררי תמונה לכאן</h3>
                        <p className="text-muted-foreground mb-4">או לחצי לבחירת קובץ</p>
                        <Button variant="gold">
                          <ImageIcon className="h-4 w-4" />
                          בחרי תמונה
                        </Button>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Tips - Only show if no image uploaded */}
              {!uploadedImage && (
                <div className="mt-8 p-6 bg-cream rounded-xl">
                  <h3 className="font-semibold mb-4">טיפים לתוצאות טובות יותר:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      השתמשי בתמונה ברורה ובאיכות טובה
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      ודאי שהשמלה נראית במלואה
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      רקע פשוט יעזור לתוצאות מדויקות יותר
                    </li>
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {/* Results View */}
          <AnimatePresence>
            {showResults && uploadedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col lg:flex-row gap-8"
              >
                {/* Uploaded Image Sidebar */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:w-80 shrink-0"
                >
                  <div className="sticky top-24 bg-card rounded-2xl p-4 border border-border">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-primary" />
                      התמונה שלך
                    </h3>
                    <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4">
                      <img
                        src={uploadedImage}
                        alt="Uploaded reference"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button variant="outline" onClick={resetSearch} className="w-full">
                      חפשי שמלה אחרת
                    </Button>
                  </div>
                </motion.div>

                {/* Results Grid */}
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                  >
                    <h2 className="text-2xl font-bold mb-2">התאמות שנמצאו 🎉</h2>
                    <p className="text-muted-foreground">
                      מצאנו {matchedDresses.length} שמלות דומות לתמונה שלך
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {matchedDresses.map((dress, index) => (
                      <motion.div
                        key={dress.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <DressCard dress={dress} showMatchBadge />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

export default AIMatchPage;
