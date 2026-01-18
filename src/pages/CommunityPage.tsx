import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Sparkles, HelpCircle, Lightbulb } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { communityPosts } from '@/data/mockData';
import { cn } from '@/lib/utils';

const CommunityPage = () => {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'success':
        return <Sparkles className="h-4 w-4" />;
      case 'question':
        return <HelpCircle className="h-4 w-4" />;
      case 'tip':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'success':
        return 'סיפור הצלחה';
      case 'question':
        return 'שאלה';
      case 'tip':
        return 'טיפ';
      default:
        return '';
    }
  };

  const filterPosts = (category: string) => {
    if (category === 'all') return communityPosts;
    return communityPosts.filter((post) => post.category === category);
  };

  const PostCard = ({ post }: { post: typeof communityPosts[0] }) => {
    const isLiked = likedPosts.has(post.id);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-6 border border-border hover:shadow-elegant transition-all duration-300"
      >
        {/* Author */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <h4 className="font-semibold">{post.author.name}</h4>
            <p className="text-sm text-muted-foreground">{post.createdAt}</p>
          </div>
          {post.category !== 'all' && (
            <span className={cn(
              'flex items-center gap-1 text-sm px-3 py-1 rounded-full',
              post.category === 'success' && 'bg-green-100 text-green-700',
              post.category === 'question' && 'bg-blue-100 text-blue-700',
              post.category === 'tip' && 'bg-amber-100 text-amber-700',
            )}>
              {getCategoryIcon(post.category)}
              {getCategoryLabel(post.category)}
            </span>
          )}
        </div>

        {/* Content */}
        <p className="text-foreground leading-relaxed mb-4">{post.content}</p>

        {/* Image */}
        {post.image && (
          <div className="rounded-xl overflow-hidden mb-4">
            <img
              src={post.image}
              alt=""
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-6 pt-4 border-t border-border">
          <button
            onClick={() => toggleLike(post.id)}
            className={cn(
              'flex items-center gap-2 transition-colors',
              isLiked ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            )}
          >
            <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
            <span>{isLiked ? post.likes + 1 : post.likes}</span>
          </button>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments}</span>
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-cream to-background">
        {/* Header */}
        <div className="bg-cream py-10">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              קהילת כלות
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground max-w-xl mx-auto"
            >
              שתפי, שאלי, והתחברי עם כלות אחרות בדרך לחתונה המושלמת
            </motion.p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-4 mb-8">
              <TabsTrigger value="all">הכל</TabsTrigger>
              <TabsTrigger value="success">סיפורי הצלחה</TabsTrigger>
              <TabsTrigger value="question">שאלות</TabsTrigger>
              <TabsTrigger value="tip">טיפים</TabsTrigger>
            </TabsList>

            {['all', 'success', 'question', 'tip'].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="max-w-2xl mx-auto space-y-6">
                  {filterPosts(tab).map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityPage;
