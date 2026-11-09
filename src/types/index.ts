export type FragranceMood = 'midnight' | 'ocean' | 'sky' | 'romantic';

export type ProductCategory = 'All' | 'Men' | 'Women' | 'Unisex';

export interface FragranceNote {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  identity: string; // e.g., "The Chocolate Dream", "The Ocean Breeze"
  subtitle: string;
  tagline: string;
  category: 'Men' | 'Women' | 'Unisex';
  price: number; // In INR (sample price until confirmed by owner)
  isSamplePrice: boolean;
  weightGrams: number;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  shortDescription: string;
  longDescription: string;
  fragranceInspiration: string[];
  fragranceMood: FragranceMood;
  visualEnvironment: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    atmosphereName: string;
    elements: string[];
  };
  notes: FragranceNote;
  tinColor: {
    bodyGradient: string[];
    accentGradient: string[];
    metallicSheen: string;
    glowColor: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  fullName: string;
  mobile: string;
  address: string;
  pincode: string;
  landmark?: string;
  city?: string;
  state?: string;
  email?: string;
  deliveryInstructions?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderReference: string;
  createdAt: string;
  customer: CustomerInfo;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  originalSubtotal?: number;
  discountPercent?: number;
  discountAmount?: number;
  effectiveUnitPrice?: number;
  appliedOffer?: string;
  subtotal: number;
  deliveryCharges: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  source: 'WhatsApp';
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
  productName?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface CustomerReview {
  id: string;
  customerName: string;
  city: string;
  fragrancePurchased: string;
  rating: number;
  reviewText: string;
  date: string;
  isDemo: boolean;
}

export interface StoreSettings {
  brandName: string;
  brandIdentity: string;
  tagline: string;
  ownerName: string;
  ownerRole: string;
  whatsappNumber: string; // e.g. "919011558615"
  whatsappDisplay: string; // e.g. "+91 90115 58615"
  instagramUrl: string;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  brandStory: string;
  samplePriceNotice: string;
  contactEmail?: string;
  storeAnnouncement: string;
}

