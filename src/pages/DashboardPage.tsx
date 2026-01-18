import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Heart, Package, Pencil, Trash2, CheckCircle, 
  Phone, MapPin, Save
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import DressCard from '@/components/cards/DressCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { dresses } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Mock user data
const mockUserListings = dresses.slice(0, 3).map((dress, index) => ({
  ...dress,
  status: index === 0 ? 'active' : index === 1 ? 'sold' : 'active' as 'active' | 'sold',
}));

const mockFavorites = dresses.slice(3, 6);

const DashboardPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('listings');
  const [userListings, setUserListings] = useState(mockUserListings);
  const [favorites] = useState(mockFavorites);
  
  // Profile form state
  const [profile, setProfile] = useState({
    name: 'מיכל כהן',
    city: 'תל אביב',
    phone: '0501234567',
  });

  const handleMarkAsSold = (id: string) => {
    setUserListings(prev => 
      prev.map(listing => 
        listing.id === id ? { ...listing, status: 'sold' as const } : listing
      )
    );
    toast({
      title: 'השמלה סומנה כנמכרה',
      description: 'מזל טוב על המכירה! 🎉',
    });
  };

  const handleDeleteListing = (id: string) => {
    setUserListings(prev => prev.filter(listing => listing.id !== id));
    toast({
      title: 'השמלה הוסרה',
      description: 'המודעה נמחקה בהצלחה',
    });
  };

  const handleSaveProfile = () => {
    toast({
      title: 'הפרופיל עודכן',
      description: 'הפרטים שלך נשמרו בהצלחה',
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-cream to-background py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">האזור האישי שלי</h1>
            <p className="text-muted-foreground">נהלי את המודעות, המועדפים והפרטים שלך</p>
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-card border border-border p-1 h-auto flex-wrap">
              <TabsTrigger 
                value="listings" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3"
              >
                <Package className="h-4 w-4" />
                הארון שלי
              </TabsTrigger>
              <TabsTrigger 
                value="favorites" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3"
              >
                <Heart className="h-4 w-4" />
                שמלות שאהבתי
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3"
              >
                <User className="h-4 w-4" />
                פרופיל אישי
              </TabsTrigger>
            </TabsList>

            {/* My Listings Tab */}
            <TabsContent value="listings" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">השמלות שאני מוכרת</h2>
                  <Button variant="gold" asChild>
                    <a href="/sell">+ הוספת שמלה</a>
                  </Button>
                </div>

                {userListings.length === 0 ? (
                  <div className="text-center py-16 bg-card rounded-2xl border border-border">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">אין לך שמלות למכירה</h3>
                    <p className="text-muted-foreground mb-6">התחילי למכור את שמלת הכלה שלך</p>
                    <Button variant="gold" asChild>
                      <a href="/sell">הוספת שמלה למכירה</a>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userListings.map((listing) => (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card-elegant overflow-hidden"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden bg-cream">
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className={cn(
                              'w-full h-full object-cover',
                              listing.status === 'sold' && 'opacity-60'
                            )}
                          />
                          <Badge 
                            className={cn(
                              'absolute top-3 right-3',
                              listing.status === 'sold' 
                                ? 'bg-muted text-muted-foreground' 
                                : 'bg-green-500 text-white'
                            )}
                          >
                            {listing.status === 'sold' ? 'נמכרה' : 'פעילה'}
                          </Badge>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-1">{listing.title}</h3>
                          <p className="text-primary font-bold mb-4">₪{listing.price.toLocaleString()}</p>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 gap-1">
                              <Pencil className="h-4 w-4" />
                              עריכה
                            </Button>
                            {listing.status !== 'sold' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 gap-1"
                                onClick={() => handleMarkAsSold(listing.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                                נמכרה
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteListing(listing.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xl font-semibold mb-6">שמלות שאהבתי</h2>
                
                {favorites.length === 0 ? (
                  <div className="text-center py-16 bg-card rounded-2xl border border-border">
                    <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">אין לך שמלות שמורות</h3>
                    <p className="text-muted-foreground mb-6">לחצי על הלב בשמלות שאת אוהבת כדי לשמור אותן</p>
                    <Button variant="gold" asChild>
                      <a href="/buy">גלי שמלות</a>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favorites.map((dress) => (
                      <DressCard key={dress.id} dress={dress} />
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl"
              >
                <h2 className="text-xl font-semibold mb-6">פרטים אישיים</h2>
                
                <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      שם מלא
                    </Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="input-elegant"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      עיר
                    </Label>
                    <Input
                      id="city"
                      value={profile.city}
                      onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
                      className="input-elegant"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      מספר טלפון (לוואטסאפ)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className="input-elegant ltr text-right"
                      placeholder="05X-XXX-XXXX"
                    />
                    <p className="text-sm text-muted-foreground">
                      המספר ישמש לקבלת פניות מקונות פוטנציאליות דרך וואטסאפ
                    </p>
                  </div>

                  <Button variant="gold" onClick={handleSaveProfile} className="w-full gap-2">
                    <Save className="h-4 w-4" />
                    שמירת שינויים
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
