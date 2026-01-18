import dress1 from '@/assets/dress-1.jpg';
import dress2 from '@/assets/dress-2.jpg';
import dress3 from '@/assets/dress-3.jpg';
import dress4 from '@/assets/dress-4.jpg';
import dress5 from '@/assets/dress-5.jpg';
import dress6 from '@/assets/dress-6.jpg';

export interface Dress {
  id: string;
  title: string;
  designer: string;
  price: number;
  originalPrice?: number;
  size: number;
  condition: 'חדשה עם תווית' | 'נלבשה פעם אחת' | 'דגם סטודיו';
  silhouette: 'נסיכה' | 'A-Line' | 'סירן' | 'בוהו' | 'מינימליסטית';
  location: string;
  description: string;
  images: string[];
  seller: {
    name: string;
    avatar: string;
    location: string;
    phone: string;
    rating: number;
  };
  matchPercentage?: number;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  image?: string;
  category: 'success' | 'question' | 'tip' | 'all';
  likes: number;
  comments: number;
  createdAt: string;
}

export const dresses: Dress[] = [
  {
    id: '1',
    title: 'שמלת A-Line תחרה עדינה',
    designer: 'ענבל דרור',
    price: 8500,
    originalPrice: 25000,
    size: 38,
    condition: 'נלבשה פעם אחת',
    silhouette: 'A-Line',
    location: 'תל אביב',
    description: 'שמלת כלה מדהימה בגזרת A-Line עם תחרה עדינה בעבודת יד. השמלה נלבשה פעם אחת בלבד ונמצאת במצב מושלם. כוללת הינומה תואמת.',
    images: [dress1, dress2, dress3],
    seller: {
      name: 'מיכל כהן',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michal',
      location: 'תל אביב',
      phone: '0501234567',
      rating: 4.9,
    },
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'שמלת סירן עם גב פתוח',
    designer: 'גליה להב',
    price: 12000,
    originalPrice: 35000,
    size: 36,
    condition: 'נלבשה פעם אחת',
    silhouette: 'סירן',
    location: 'הרצליה',
    description: 'שמלת סירן מרהיבה עם עיטורי חרוזים וגב פתוח. עיצוב ייחודי של גליה להב. במצב מעולה לאחר ניקוי מקצועי.',
    images: [dress2, dress1, dress4],
    seller: {
      name: 'שירה לוי',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shira',
      location: 'הרצליה',
      phone: '0527654321',
      rating: 5.0,
    },
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    title: 'שמלת נסיכה עם טול',
    designer: 'ברטה',
    price: 6500,
    originalPrice: 18000,
    size: 40,
    condition: 'נלבשה פעם אחת',
    silhouette: 'נסיכה',
    location: 'ירושלים',
    description: 'שמלת נסיכה קסומה עם חצאית טול רחבה ומחוך מעוטר. מושלמת לחתונה קלאסית ורומנטית.',
    images: [dress3, dress5, dress6],
    seller: {
      name: 'נועה ישראלי',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=noa',
      location: 'ירושלים',
      phone: '0539876543',
      rating: 4.8,
    },
    createdAt: '2024-01-08',
  },
  {
    id: '4',
    title: 'שמלה מינימליסטית מודרנית',
    designer: 'ליהי הוד',
    price: 5500,
    originalPrice: 15000,
    size: 34,
    condition: 'חדשה עם תווית',
    silhouette: 'מינימליסטית',
    location: 'רמת גן',
    description: 'שמלת כלה מינימליסטית עם קווים נקיים וסאטן משובח. מושלמת לכלה המודרנית שמחפשת אלגנטיות פשוטה.',
    images: [dress4, dress1, dress2],
    seller: {
      name: 'יעל ברוך',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yael',
      location: 'רמת גן',
      phone: '0541112233',
      rating: 4.7,
    },
    createdAt: '2024-01-05',
  },
  {
    id: '5',
    title: 'שמלת בוהו עם שרוולים',
    designer: 'נעמה & אנאט',
    price: 7000,
    originalPrice: 20000,
    size: 42,
    condition: 'נלבשה פעם אחת',
    silhouette: 'בוהו',
    location: 'חיפה',
    description: 'שמלת בוהו רומנטית עם שרוולי תחרה ארוכים וגב פתוח. אידיאלית לחתונה בטבע או בחוף.',
    images: [dress5, dress3, dress6],
    seller: {
      name: 'דנה מזרחי',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dana',
      location: 'חיפה',
      phone: '0504445566',
      rating: 4.9,
    },
    createdAt: '2024-01-03',
  },
  {
    id: '6',
    title: 'שמלת נסיכה קלאסית',
    designer: 'ענבל דרור',
    price: 9500,
    originalPrice: 28000,
    size: 38,
    condition: 'דגם סטודיו',
    silhouette: 'נסיכה',
    location: 'ראשון לציון',
    description: 'שמלת נסיכה קלאסית עם מחשוף לב ועיטורי תחרה יפהפיים. כוללת שובל ארוך.',
    images: [dress6, dress4, dress1],
    seller: {
      name: 'רות אברהם',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ruth',
      location: 'ראשון לציון',
      phone: '0526667788',
      rating: 4.6,
    },
    createdAt: '2024-01-01',
  },
];

export const communityPosts: CommunityPost[] = [
  {
    id: '1',
    author: {
      name: 'מיכל כהן',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michal',
    },
    content: 'מצאתי את שמלת החלומות שלי כאן! תודה כלה קלה על הפלטפורמה המדהימה. חסכתי כמעט 20,000 ש"ח! 💕',
    image: dress3,
    category: 'success',
    likes: 156,
    comments: 23,
    createdAt: '2024-01-14',
  },
  {
    id: '2',
    author: {
      name: 'שירה לוי',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shira',
    },
    content: 'טיפ חשוב: לפני שאתן קונות שמלה יד שנייה, בקשו לראות את השמלה באור טבעי. זה עושה הבדל עצום!',
    category: 'tip',
    likes: 89,
    comments: 12,
    createdAt: '2024-01-13',
  },
  {
    id: '3',
    author: {
      name: 'נועה ישראלי',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=noa',
    },
    content: 'יש מישהי שמכירה מעצבת טובה שעושה תיקונים? קניתי שמלה במידה קצת גדולה ואני צריכה להצר אותה.',
    category: 'question',
    likes: 34,
    comments: 45,
    createdAt: '2024-01-12',
  },
  {
    id: '4',
    author: {
      name: 'דנה מזרחי',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dana',
    },
    content: 'סיפור הצלחה! מכרתי את השמלה שלי תוך שבוע! הפלטפורמה פשוט מושלמת 🎉',
    image: dress1,
    category: 'success',
    likes: 203,
    comments: 31,
    createdAt: '2024-01-11',
  },
];

export const designers = [
  'ענבל דרור',
  'גליה להב',
  'ברטה',
  'ליהי הוד',
  'נעמה & אנאט',
  'מירה צווילינגר',
  'שלומית אזרד',
  'אלון ליבנה',
  'ליז מרטינז',
];

export const locations = [
  'תל אביב',
  'ירושלים',
  'חיפה',
  'הרצליה',
  'רמת גן',
  'ראשון לציון',
  'פתח תקווה',
  'נתניה',
];

export const sizes = [34, 36, 38, 40, 42, 44, 46];

export const conditions = [
  'חדשה עם תווית',
  'נלבשה פעם אחת',
  'דגם סטודיו',
];

export const silhouettes = [
  'נסיכה',
  'A-Line',
  'סירן',
  'בוהו',
  'מינימליסטית',
];
