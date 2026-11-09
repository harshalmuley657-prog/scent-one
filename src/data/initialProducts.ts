import { Product, StoreSettings } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'midnight-aura',
    name: 'Midnight Aura',
    slug: 'midnight-aura',
    identity: 'The Chocolate Dream',
    subtitle: 'Rich, Warm & Mysterious',
    tagline: 'When the night awakens your deepest senses.',
    category: 'Unisex',
    price: 199,
    isSamplePrice: false,
    weightGrams: 15,
    stock: 25,
    isFeatured: true,
    isActive: true,
    shortDescription: 'A hypnotic blend of rich woody accords and serene French lavender wrapped in a warm nocturnal chocolate atmosphere.',
    longDescription: 'Midnight Aura invites you into a velvet night where warm woody undertones meld effortlessly with soothing lavender blossoms. Inspired by the quiet decadence of midnight dreams, this solid perfume melts into pulse points to deliver a rich, warm, and comforting intimate sillage that lingers without overpowering.',
    fragranceInspiration: [
      'Woody notes',
      'Lavender blossoms',
      'Rich, warm nocturnal atmosphere'
    ],
    fragranceMood: 'midnight',
    visualEnvironment: {
      primaryColor: '#170E2E',
      secondaryColor: '#2B1A4F',
      accentColor: '#9D65E0',
      atmosphereName: 'Night Sky & Moonlight',
      elements: ['Lavender flowers', 'Night sky', 'Moonlight glow', 'Deep violet mist']
    },
    notes: {
      top: ['Serene Lavender', 'Wild Violet Leaf'],
      heart: ['Warm Chocolate Accord', 'Roasted Tonka'],
      base: ['Cedarwood', 'Velvet Amber', 'Smoky Oak']
    },
    tinColor: {
      bodyGradient: ['#120B20', '#1F1436'],
      accentGradient: ['#8B5CF6', '#C084FC'],
      metallicSheen: '#D8B66B',
      glowColor: 'rgba(139, 92, 246, 0.45)'
    }
  },
  {
    id: 'fresh-drift',
    name: 'Fresh Drift',
    slug: 'fresh-drift',
    identity: 'The Ocean Breeze',
    subtitle: 'Crisp, Marine & Rejuvenating',
    tagline: 'The untamed pulse of coastal tides in your pocket.',
    category: 'Unisex',
    price: 199,
    isSamplePrice: false,
    weightGrams: 15,
    stock: 30,
    isFeatured: true,
    isActive: true,
    shortDescription: 'An invigorating surge of sun-drenched citrus zest and crushed green botanicals kissed by a salty coastal breeze.',
    longDescription: 'Fresh Drift encapsulates the raw exhilaration of oceanic horizons. Opening with an electrifying burst of bright citrus zest and crushed aquatic greens, it transitions into an airy marine heart that feels like a clean ocean wave breaking in the morning sun.',
    fragranceInspiration: [
      'Citrus zest',
      'Green notes',
      'Ocean breeze'
    ],
    fragranceMood: 'ocean',
    visualEnvironment: {
      primaryColor: '#0A2540',
      secondaryColor: '#0E496A',
      accentColor: '#00D4B2',
      atmosphereName: 'Coastal Ocean & Sunlight',
      elements: ['Deep ocean tides', 'Turquoise waters', 'Fresh citrus zest', 'Sunlight caustics']
    },
    notes: {
      top: ['Bergamot Zest', 'Crisp Lemon', 'Sea Salt Spray'],
      heart: ['Crushed Green Leaves', 'Marine Driftwood'],
      base: ['Clean White Musk', 'Sun-bleached Cedar']
    },
    tinColor: {
      bodyGradient: ['#0A2540', '#064E3B'],
      accentGradient: ['#06B6D4', '#10B981'],
      metallicSheen: '#99F6E4',
      glowColor: 'rgba(6, 182, 212, 0.45)'
    }
  },
  {
    id: 'aero-flex',
    name: 'Aero Flex',
    slug: 'aero-flex',
    identity: 'The Sky Escape',
    subtitle: 'Adventurous, Airy & Weightless',
    tagline: 'Freedom of the skies designed for every voyage.',
    category: 'Men',
    price: 199,
    isSamplePrice: false,
    weightGrams: 15,
    stock: 20,
    isFeatured: true,
    isActive: true,
    shortDescription: 'A dynamic, high-altitude sensation of crisp mountain air, calming lavender, and warm sunset amber.',
    longDescription: 'Crafted for the restless wanderer, Aero Flex evokes soaring through open skies at twilight. The composition opens with clean, airy altitude accords blended with soft lavender, gradually warming into golden sunset amber that mirrors the horizon from 30,000 feet.',
    fragranceInspiration: [
      'Fresh and adventurous identity',
      'Travel-inspired atmosphere',
      'Soaring high-altitude skies'
    ],
    fragranceMood: 'sky',
    visualEnvironment: {
      primaryColor: '#0F2B48',
      secondaryColor: '#1E3A8A',
      accentColor: '#E0A96D',
      atmosphereName: 'Sunset Gold & Drifting Clouds',
      elements: ['Sky blue expanses', 'Drifting cloud mist', 'Sunset gold illumination', 'Airy particles']
    },
    notes: {
      top: ['Ozone Air Accord', 'Crisp Mountain Juniper'],
      heart: ['Sky Lavender', 'Subtle Cardamom'],
      base: ['Warm Sunset Amber', 'Vetiver Roots']
    },
    tinColor: {
      bodyGradient: ['#0C2340', '#1E3A8A'],
      accentGradient: ['#38BDF8', '#F59E0B'],
      metallicSheen: '#FCD34D',
      glowColor: 'rgba(56, 189, 248, 0.45)'
    }
  },
  {
    id: 'love-vibe',
    name: 'Love Vibe',
    slug: 'love-vibe',
    identity: 'The Romantic Soul',
    subtitle: 'Floral, Velvet & Enchanting',
    tagline: 'An unforgettable whisper of romance and warmth.',
    category: 'Women',
    price: 199,
    isSamplePrice: false,
    weightGrams: 15,
    stock: 22,
    isFeatured: true,
    isActive: true,
    shortDescription: 'A captivating bouquet of delicate rose petals entwined with velvet burgundy warmth and sparkling champagne accents.',
    longDescription: 'Love Vibe is an ode to heartfelt passion and magnetic allure. Opening with gentle whispers of fresh velvety rose petals and blushing blossoms, it gracefully unveils a warm, sensual core enriched with golden champagne and tender sandalwood.',
    fragranceInspiration: [
      'Floral essence',
      'Warm romantic atmosphere',
      'Velvet petal softness'
    ],
    fragranceMood: 'romantic',
    visualEnvironment: {
      primaryColor: '#380E1F',
      secondaryColor: '#581C33',
      accentColor: '#F472B6',
      atmosphereName: 'Romantic Velvet & Golden Hour',
      elements: ['Floating rose petals', 'Velvet burgundy shadows', 'Blush pink glow', 'Champagne shimmer']
    },
    notes: {
      top: ['Dewy Rose Petals', 'Sparkling Champagne Peach'],
      heart: ['Damask Rose', 'Soft Peony Blossom'],
      base: ['Velvet Sandalwood', 'Cashmere Amber', 'Warm Vanilla']
    },
    tinColor: {
      bodyGradient: ['#2A0815', '#4A1528'],
      accentGradient: ['#FB7185', '#E11D48'],
      metallicSheen: '#FDA4AF',
      glowColor: 'rgba(251, 113, 133, 0.45)'
    }
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  brandName: 'SCENT ONE',
  brandIdentity: 'S1 / SCENT_ONE',
  tagline: 'Small Tin. Big Impressions.',
  ownerName: 'Yash Jain',
  ownerRole: 'Founder, SCENT ONE',
  whatsappNumber: '919011558615',
  whatsappDisplay: '+91 90115 58615',
  instagramUrl: 'https://www.instagram.com/scent_one_/',
  deliveryCharge: 0,
  freeDeliveryThreshold: 0,
  brandStory: 'SCENT ONE believes that fragrance is more than just a finishing touch. It is a feeling, a memory and a personal signature. Discover solid perfumes designed to accompany you wherever life takes you. Small Tin. Big Impressions.',
  samplePriceNotice: 'Regular price ₹199 each · BUY 2 OR MORE – JUST ₹149 EACH! · FREE Delivery on Every Order',
  contactEmail: 'contact@scentone.in',
  storeAnnouncement: 'BUY 2 OR MORE – JUST ₹149 EACH! · Regular ₹199 · Free Delivery on Every Order'
};

export const DEMO_REVIEWS = [
  {
    id: 'rev-1',
    customerName: 'Aarav Mehta',
    city: 'Mumbai',
    fragrancePurchased: 'Midnight Aura',
    rating: 5,
    reviewText: 'The warm chocolate and lavender blend is subtle yet captivating. It fits right into my blazer pocket for evening meetings.',
    date: 'Sample Review',
    isDemo: true
  },
  {
    id: 'rev-2',
    customerName: 'Priya Sharma',
    city: 'Bengaluru',
    fragrancePurchased: 'Fresh Drift',
    rating: 5,
    reviewText: 'Zero leaks during domestic flights! The citrus marine freshness melts nicely into wrists without any harsh alcohol smell.',
    date: 'Sample Review',
    isDemo: true
  },
  {
    id: 'rev-3',
    customerName: 'Rohan Verma',
    city: 'Pune',
    fragrancePurchased: 'Aero Flex',
    rating: 5,
    reviewText: 'Great pocket tin design. The sliding lid mechanism feels tactile and premium, and the woody lavender scent is very relaxing.',
    date: 'Sample Review',
    isDemo: true
  },
  {
    id: 'rev-4',
    customerName: 'Ananya Deshmukh',
    city: 'Delhi',
    fragrancePurchased: 'Love Vibe',
    rating: 5,
    reviewText: 'A soft, velvety rose that stays close to the skin. Love how compact and discrete it is to carry in small bags.',
    date: 'Sample Review',
    isDemo: true
  }
];

