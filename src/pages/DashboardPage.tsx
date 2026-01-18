import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, LogOut, Save, Trash2, Loader2, Phone } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // נתוני פרופיל
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    city: '',
  });

  // השמלות שלי
  const [myListings, setMyListings] = useState<any[]>([]);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);

      // 1. טעינת פרופיל מהדאטה-בייס האמיתי
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setProfileData({
          full_name: profile.full_name || '',
          phone: profile.phone || '',
          city: profile.city || '',
        });
      }

      // 2. טעינת שמלות שהמשתמש העלה באמת
      const { data: listings } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setMyListings(listings || []);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // שמירה לדאטה-בייס כדי שהווטסאפ יעבוד
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          city: profileData.city,
        })
        .eq('id', user.id);

      if (error) throw error;
      toast({ title: "הפרופיל עודכן בהצלחה! ✨" });
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "שגיאה", 
        description: "לא הצלחנו לעדכן את הפרופיל" 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteListing = async (id: number) => {
    if (!confirm('האם את בטוחה שברצונך למחוק את המודעה?')) return;
    
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMyListings(prev => prev.filter(item => item.id !== id));
      toast({ title: "המודעה נמחקה" });
    } catch (error) {
      toast({ variant: "destructive", title: "שגיאה במחיקה" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-cream/50 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-secondary">האזור האישי</h1>
            <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4 ml-2" />
              התנתקי
            </Button>
          </div>

          <Tabs defaultValue="listings" className="space-y-6">
            <TabsList className="bg-white p-1 rounded-xl border border-border/50">
              <TabsTrigger value="listings" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg px-6">
                <Package className="h-4 w-4 ml-2" />
                השמלות שלי
              </TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg px-6">
                <User className="h-4 w-4 ml-2" />
                פרופיל והגדרות
              </TabsTrigger>
            </TabsList>

            {/* לשונית השמלות שלי */}
            <TabsContent value="listings">
              <Card>
                <CardHeader>
                  <CardTitle>ניהול מודעות ({myListings.length})</CardTitle>
                  <CardDescription>כאן תוכלי לראות ולנהל את השמלות שהעלית למכירה</CardDescription>
                </CardHeader>
                <CardContent>
                  {myListings.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">עדיין לא העלית שמלות למכירה</p>
                      <Button onClick={() => navigate('/sell')} variant="gold">העלי שמלה ראשונה</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myListings.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-white border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                          <div className="h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                            <img src={item.image_url || '/placeholder.svg'} alt={item.title} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                            <p className="text-primary font-bold">₪{item.price}</p>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <span>{new Date(item.created_at).toLocaleDateString('he-IL')}</span>
                              <span className="mx-2">•</span>
                              <span>{item.condition}</span>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteListing(item.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* לשונית פרופיל */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>פרטים אישיים</CardTitle>
                  <CardDescription>פרטים אלו יופיעו לצד המודעות שלך (כולל מספר הטלפון ליצירת קשר)</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-md">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">שם מלא</label>
                      <Input 
                        value={profileData.full_name} 
                        onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                        className="input-elegant"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        מספר טלפון (עבור WhatsApp)
                      </label>
                      <Input 
                        value={profileData.phone} 
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        placeholder="05X-XXXXXXX"
                        className="input-elegant"
                        required
                      />
                      <p className="text-xs text-muted-foreground">מספר זה יהיה חשוף לקונות בלבד כדי שיוכלו ליצור איתך קשר</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">עיר מגורים</label>
                      <Input 
                        value={profileData.city} 
                        onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                        className="input-elegant"
                      />
                    </div>

                    <Button type="submit" variant="gold" disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Save className="h-4 w-4 ml-2" />}
                      שמירת שינויים
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;