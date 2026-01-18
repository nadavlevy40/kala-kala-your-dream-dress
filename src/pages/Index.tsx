import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import DressCard from '@/components/cards/DressCard';
import { dresses } from '@/data/mockData';
import heroBride from '@/assets/hero-bride.jpg';

const Index = () => {
  const featuredDresses = dresses.slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBride}
            alt="כלה יפה בשמלת כלה"
            className="w-full h-full object-cover"
          />
          <div className="hero-overlay" />
        </div>
        
        <div className="relative container mx-auto h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl text-right"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              הדרך הקלה לשמלת
              <br />
              <span className="text-gradient-gold">החלומות שלך</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              מאות שמלות כלה מעוצבות במחירים נגישים.
              <br />
              מצאי את השמלה המושלמת עבורך.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/buy">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  <Search className="h-5 w-5" />
                  אני מחפשת שמלה
                </Button>
              </Link>
              <Link to="/sell">
                <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                  אני רוצה למכור
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <motion.div className="w-1.5 h-1.5 bg-white rounded-full mt-2" />
          </motion.div>
        </motion.div>
      </section>

      {/* AI Feature Section */}
      <section className="py-20 bg-gradient-to-b from-cream to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">טכנולוגיית AI חדשנית</span>
            </div>
            <h2 className="section-title text-center">
              מצאי שמלות דומות לזו שחלמת עליה
            </h2>
            <p className="section-subtitle text-center max-w-2xl mx-auto">
              העלי תמונה מאינסטגרם או פינטרסט והבינה המלאכותית שלנו תמצא לך שמלות דומות במלאי
            </p>

            <Link to="/ai-match">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-card rounded-2xl border-2 border-dashed border-primary/30 p-12 cursor-pointer group hover:border-primary transition-all duration-300"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Sparkles className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">העלי תמונה של שמלה</h3>
                    <p className="text-muted-foreground">גררי תמונה לכאן או לחצי לבחירה</p>
                  </div>
                  <Button variant="gold" className="mt-4">
                    התחילי חיפוש חכם
                    <ArrowLeft className="h-4 w-4 mr-2" />
                  </Button>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="section-title mb-0">שמלות חדשות</h2>
              <p className="text-muted-foreground mt-2">הוספו לאחרונה לאתר</p>
            </div>
            <Link to="/buy">
              <Button variant="outline">
                לכל השמלות
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDresses.map((dress, index) => (
              <motion.div
                key={dress.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <DressCard dress={dress} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'שמלות באתר' },
              { value: '₪15K', label: 'חיסכון ממוצע' },
              { value: '1000+', label: 'כלות מרוצות' },
              { value: '4.9', label: 'דירוג ממוצע' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient-gold mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary rounded-3xl p-12 text-center text-primary-foreground"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              יש לך שמלה למכור?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-xl mx-auto">
              הצטרפי לאלפי נשים שכבר מכרו את שמלתן דרכנו. 
              התהליך פשוט, מהיר ובטוח.
            </p>
            <Link to="/sell">
              <Button variant="secondary" size="xl">
                פרסמי את השמלה שלך
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
