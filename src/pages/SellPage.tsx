import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Camera, X, Check } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { designers, sizes } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const SellPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    designer: '',
    condition: '',
    size: '',
    price: '',
    description: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImages].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'המודעה פורסמה בהצלחה! 🎉',
      description: 'השמלה שלך מופיעה עכשיו באתר',
    });
    navigate('/buy');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-cream to-background py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">מכרי את השמלה שלך</h1>
            <p className="text-muted-foreground">מלאי את הפרטים והשמלה שלך תפורסם תוך דקות</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-card rounded-2xl p-8 shadow-soft border border-border"
          >
            {/* Image Upload */}
            <div className="mb-8">
              <label className="text-lg font-semibold mb-4 block">תמונות השמלה</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-[3/4] rounded-xl overflow-hidden group">
                    <img src={image} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 left-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        ראשית
                      </div>
                    )}
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="aspect-[3/4] rounded-xl border-2 border-dashed border-primary/30 hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors bg-cream">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Camera className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">הוסיפי תמונה</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-3">עד 5 תמונות. תמונה ראשונה תוצג כתמונה הראשית</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="font-medium mb-2 block">כותרת המודעה</label>
                <Input
                  placeholder='לדוגמה: "שמלת A-Line תחרה מעוצבת"'
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-elegant"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-medium mb-2 block">מעצב/ת</label>
                  <Select 
                    value={formData.designer} 
                    onValueChange={(value) => setFormData({ ...formData, designer: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחרי מעצב/ת" />
                    </SelectTrigger>
                    <SelectContent>
                      {designers.map((designer) => (
                        <SelectItem key={designer} value={designer}>
                          {designer}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">אחר</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="font-medium mb-2 block">מצב השמלה</label>
                  <Select 
                    value={formData.condition} 
                    onValueChange={(value) => setFormData({ ...formData, condition: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחרי מצב" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">חדשה (עם תג)</SelectItem>
                      <SelectItem value="once">נלבשה פעם אחת</SelectItem>
                      <SelectItem value="used">נלבשה מספר פעמים</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="font-medium mb-2 block">מידה</label>
                  <Select 
                    value={formData.size} 
                    onValueChange={(value) => setFormData({ ...formData, size: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחרי מידה" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          מידה {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="font-medium mb-2 block">מחיר (₪)</label>
                  <Input
                    type="number"
                    placeholder="הכניסי מחיר"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-elegant"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-medium mb-2 block">תיאור השמלה</label>
                <Textarea
                  placeholder="תארי את השמלה, מצבה, היסטוריה, ופרטים נוספים שיעזרו לקונות..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-elegant min-h-[150px]"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button type="submit" variant="gold" size="xl" className="flex-1">
                <Check className="h-5 w-5" />
                פרסמי את השמלה
              </Button>
              <Button type="button" variant="outline" size="xl" onClick={() => navigate(-1)}>
                ביטול
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </Layout>
  );
};

export default SellPage;
