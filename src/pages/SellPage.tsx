import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Camera, X, Check, Loader2, Sparkles } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { designers, sizes } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { GoogleGenerativeAI } from "@google/generative-ai";

// אתחול ה-AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

const SellPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiStatus, setAiStatus] = useState<string>(''); // לחיווי למשתמש
  
  const [formData, setFormData] = useState({
    title: '', designer: '', condition: '', size: '', price: '', description: '', location: '',
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ variant: "destructive", title: "גישה מוגבלת", description: "יש להתחבר כדי למכור שמלה" });
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate, toast]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const newUrls = newFiles.map((file) => URL.createObjectURL(file));
      setImageFiles((prev) => [...prev, ...newFiles].slice(0, 5));
      setPreviewUrls((prev) => [...prev, ...newUrls].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // --- הפונקציות החכמות ---
  
  // המרת קובץ לפורמט של ג'מיני
  const fileToGenerativePart = async (file: File) => {
    return new Promise<any>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        resolve({
          inlineData: {
            data: base64Data.split(',')[1],
            mimeType: file.type
          },
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // יצירת וקטור (Embedding) מטקסט
  const generateEmbedding = async (text: string) => {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAiStatus('מתחילה בתהליך העלאה...');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      if (imageFiles.length === 0) throw new Error("חובה להעלות תמונה");

      // 1. העלאת תמונה ל-Storage
      setAiStatus('מעלה את התמונה לענן...');
      const mainImageFile = imageFiles[0];
      const fileName = `${user.id}/${Math.random()}.${mainImageFile.name.split('.').pop()}`;
      
      const { error: uploadError } = await supabase.storage.from('dresses').upload(fileName, mainImageFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('dresses').getPublicUrl(fileName);

      // 2. יצירת ניתוח AI עמוק (בשביל הוקטור)
      setAiStatus('ה-AI מנתח את השמלה לעומק...');
      const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const imagePart = await fileToGenerativePart(mainImageFile);
      
      const prompt = `
        Describe this wedding dress in extreme visual detail. 
        Focus on silhouette, neckline, fabric type (lace, satin, tulle), sleeve style, 
        embellishments (beads, pearls, sequins), and overall vibe (boho, classic, modern).
        Output a detailed paragraph in English.
      `;
      
      const analysisResult = await visionModel.generateContent([prompt, imagePart]);
      const detailedDescription = analysisResult.response.text();

      // 3. יצירת וקטור מהתיאור
      setAiStatus('יוצרת חתימה ויזואלית ייחודית...');
      const embedding = await generateEmbedding(detailedDescription);

      // 4. שמירה לדאטה-בייס
      setAiStatus('שומרת את כל הפרטים...');
      const { error: insertError } = await supabase.from('listings').insert({
        user_id: user.id,
        title: formData.title,
        designer: formData.designer,
        condition: formData.condition,
        size: formData.size,
        price: parseFloat(formData.price),
        description: formData.description,
        location: formData.location || 'לא צוין',
        image_url: publicUrl,
        embedding: embedding // <--- הוקטור נשמר כאן!
      });

      if (insertError) throw insertError;

      toast({ title: 'השמלה פורסמה בהצלחה! 🎉', description: 'היא כעת ניתנת לחיפוש במנוע ה-AI שלנו' });
      navigate('/buy');

    } catch (error: any) {
      console.error('Error:', error);
      toast({ variant: "destructive", title: "שגיאה", description: error.message });
    } finally {
      setIsSubmitting(false);
      setAiStatus('');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-cream to-background py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">מכרי את השמלה שלך</h1>
            <p className="text-muted-foreground">מלאי את הפרטים והשמלה שלך תפורסם תוך דקות</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-soft border border-border">
            <div className="mb-8">
              <label className="text-lg font-semibold mb-4 block">תמונות השמלה</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {previewUrls.map((image, index) => (
                  <div key={index} className="relative aspect-[3/4] rounded-xl overflow-hidden group">
                    <img src={image} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-2 left-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-4 w-4" /></button>
                  </div>
                ))}
                {previewUrls.length < 5 && (
                  <label className="aspect-[3/4] rounded-xl border-2 border-dashed border-primary/30 hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors bg-cream">
                    <Camera className="h-6 w-6 text-primary" />
                    <span className="text-sm text-muted-foreground">הוסיפי תמונה</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <Input placeholder='כותרת המודעה' value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              <div className="grid grid-cols-2 gap-6">
                <Select value={formData.designer} onValueChange={(v) => setFormData({ ...formData, designer: v })}>
                  <SelectTrigger><SelectValue placeholder="מעצב/ת" /></SelectTrigger>
                  <SelectContent>{designers.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}<SelectItem value="other">אחר</SelectItem></SelectContent>
                </Select>
                <Input type="number" placeholder="מחיר (₪)" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <Select value={formData.size} onValueChange={(v) => setFormData({ ...formData, size: v })}>
                  <SelectTrigger><SelectValue placeholder="מידה" /></SelectTrigger>
                  <SelectContent>{sizes.map(s => <SelectItem key={s} value={s.toString()}>{s}</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="מיקום" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
              </div>
               <Select value={formData.condition} onValueChange={(v) => setFormData({ ...formData, condition: v })}>
                  <SelectTrigger><SelectValue placeholder="מצב השמלה" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">חדשה</SelectItem>
                    <SelectItem value="used">משומשת</SelectItem>
                  </SelectContent>
                </Select>
              <Textarea placeholder="תיאור חופשי..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
            </div>

            <div className="mt-10">
              <Button type="submit" variant="gold" size="xl" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    {aiStatus}
                  </span>
                ) : (
                  <>פרסמי את השמלה <Sparkles className="mr-2 h-4 w-4" /></>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SellPage;