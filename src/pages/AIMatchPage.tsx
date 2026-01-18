import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, Search, ArrowRight, Loader2, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from '@/integrations/supabase/client';
import DressCard from '@/components/cards/DressCard';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

const AIMatchPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [matchedDresses, setMatchedDresses] = useState<any[]>([]);
  const [analyzed, setAnalyzed] = useState(false);

  const fileToGenerativePart = async (file: File) => {
    return new Promise<any>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          inlineData: {
            data: (reader.result as string).split(',')[1],
            mimeType: file.type
          },
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setSelectedImage(objectUrl);
    setAnalyzed(false);
    setMatchedDresses([]);

    await findSimilarDresses(file);
  };

  const findSimilarDresses = async (file: File) => {
    setIsAnalyzing(true);
    try {
      // שלב 1: הבנת התמונה ע"י Gemini
      setStatusText('מנתחת את הסטייל והגזרה...');
      const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const imagePart = await fileToGenerativePart(file);
      
      const prompt = `
        Describe this wedding dress in extreme visual detail for a search engine. 
        Focus on silhouette, fabric, sleeves, and unique features.
      `;
      const result = await visionModel.generateContent([prompt, imagePart]);
      const description = result.response.text();

      // שלב 2: יצירת וקטור חיפוש
      setStatusText('סורקת את המאגר להתאמות...');
      const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
      const embeddingResult = await embeddingModel.embedContent(description);
      const queryEmbedding = embeddingResult.embedding.values;

      // שלב 3: שליחת הוקטור ל-Supabase (קריאה לפונקציית ה-RPC)
      const { data: dresses, error } = await supabase.rpc('match_listings', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5, // רף דימיון (0-1)
        match_count: 6
      });

      if (error) throw error;

      if (dresses) {
        setMatchedDresses(dresses);
      }

    } catch (error) {
      console.error("Error:", error);
      toast({ variant: "destructive", title: "שגיאה", description: "לא הצלחנו לבצע את ההתאמה כרגע." });
    } finally {
      setIsAnalyzing(false);
      setAnalyzed(true);
      setStatusText('');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-cream to-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-gold">התאמה חכמה (Vector AI)</h1>
            <p className="text-xl text-muted-foreground">הטכנולוגיה הכי מתקדמת שלנו. המנוע מנתח ויזואלית את התמונה ומוצא את השמלות הכי דומות.</p>
          </motion.div>

          {/* אזור העלאה */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-primary/10">
            <div className="flex flex-col items-center justify-center">
              <div className="relative aspect-[3/4] w-full max-w-xs bg-cream rounded-2xl overflow-hidden border-2 border-dashed border-primary/20 flex flex-col items-center justify-center">
                {selectedImage ? (
                  <>
                    <img src={selectedImage} alt="Uploaded" className="w-full h-full object-cover" />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center backdrop-blur-sm p-4 text-center">
                        <Loader2 className="h-10 w-10 text-white animate-spin mb-2" />
                        <p className="text-white font-medium">{statusText}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-4 hover:bg-primary/5 transition-colors">
                    <Camera className="h-12 w-12 text-primary mb-4" />
                    <span className="text-lg font-bold">העלי תמונה לחיפוש</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* תוצאות */}
          {analyzed && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold mb-6">תוצאות ה-AI ({matchedDresses.length})</h2>
              {matchedDresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedDresses.map((dress) => (
                     <DressCard 
                       key={dress.id}
                       id={`real-${dress.id}`}
                       title={dress.title}
                       price={dress.price}
                       image={dress.image_url || '/placeholder.svg'}
                       designer={'התאמה גבוהה'} // הנתון לא מגיע ב-RPC הקצר, אפשר להרחיב
                       size={'-'}
                       condition={'טוב'}
                     />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white border rounded-xl">
                  <p>לא נמצאו שמלות דומות מספיק. נסי תמונה אחרת או עייני בקטלוג.</p>
                  <Button onClick={() => navigate('/buy')} variant="link">לקטלוג</Button>
                </div>
              )}
            </motion.div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default AIMatchPage;