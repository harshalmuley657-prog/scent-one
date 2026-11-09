import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, StoreSettings, CustomerInfo, OrderStatus, ToastItem } from '../types';
import { INITIAL_PRODUCTS, INITIAL_STORE_SETTINGS } from '../data/initialProducts';
import {
  verifyAndCalculateOrder,
  sanitizeCustomerInput,
  sanitizeString,
  calculateVolumePricing,
  REGULAR_PRICE,
  OFFER_PRICE,
} from '../lib/security';

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetToDefaultProducts: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, options?: { openDrawer?: boolean }) => void;
  buyNow: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalQuantity: number;
  originalSubtotal: number;
  effectiveUnitPrice: number;
  isOfferApplied: boolean;
  unitsNeededForOffer: number;
  offerTitle: string;
  discountPercent: number;
  discountAmount: number;
  subtotal: number;
  deliveryCharge: number;
  total: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  createOrder: (customer: CustomerInfo, notes?: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  clearOrderHistory: () => void;

  // Store Settings
  settings: StoreSettings;
  updateSettings: (updates: Partial<StoreSettings>) => void;

  // Modals & Navigation
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isOrderSuccessOpen: boolean;
  setIsOrderSuccessOpen: (open: boolean) => void;
  latestOrder: Order | null;
  activeProductModal: Product | null;
  setActiveProductModal: (product: Product | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  policyModal: {
    isOpen: boolean;
    type: 'about' | 'contact' | 'faqs' | 'shipping' | 'returns' | 'privacy' | 'terms';
  };
  openPolicy: (type: 'about' | 'contact' | 'faqs' | 'shipping' | 'returns' | 'privacy' | 'terms') => void;
  closePolicy: () => void;

  // Theme
  isDark: boolean;
  toggleTheme: () => void;

  // Toast
  toasts: ToastItem[];
  showToast: (
    messageOrOptions:
      | string
      | {
          message: string;
          type?: 'success' | 'info' | 'error';
          productName?: string;
          action?: { label: string; onClick: () => void };
        },
    type?: 'success' | 'info' | 'error'
  ) => void;
  dismissToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'scent_one_products_v2',
  CART: 'scent_one_cart_v2',
  WISHLIST: 'scent_one_wishlist_v1',
  ORDERS: 'scent_one_orders_v1',
  SETTINGS: 'scent_one_settings_v2',
  THEME: 'scent_one_theme_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved !== null ? saved === 'true' : true; // Default dark luxury
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, String(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('bg-[#F8F3EA]', 'text-[#090A0F]');
      document.body.classList.add('bg-[#090A0F]', 'text-[#F8F3EA]');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-[#090A0F]', 'text-[#F8F3EA]');
      document.body.classList.add('bg-[#F8F3EA]', 'text-[#090A0F]');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Products state - Enforce official ₹199 regular price on all perfumes
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => ({
            ...p,
            price: REGULAR_PRICE,
            isSamplePrice: false,
          }));
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  // Cart state - Enforce official ₹199 regular price
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => ({
            ...item,
            product: {
              ...item.product,
              price: REGULAR_PRICE,
              isSamplePrice: false,
            },
          }));
        }
      }
    } catch {
      // Fallback
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  // Store Settings — Always enforce FREE DELIVERY (0 delivery charge)
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        return {
          ...INITIAL_STORE_SETTINGS,
          ...JSON.parse(saved),
          deliveryCharge: 0,
          freeDeliveryThreshold: 0,
        };
      }
    } catch {
      // Fallback
    }
    return INITIAL_STORE_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [policyModal, setPolicyModal] = useState<{
    isOpen: boolean;
    type: 'about' | 'contact' | 'faqs' | 'shipping' | 'returns' | 'privacy' | 'terms';
  }>({
    isOpen: false,
    type: 'about',
  });

  const openPolicy = (type: 'about' | 'contact' | 'faqs' | 'shipping' | 'returns' | 'privacy' | 'terms') => {
    setPolicyModal({ isOpen: true, type });
  };

  const closePolicy = () => {
    setPolicyModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Toast notifications
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (
    messageOrOptions:
      | string
      | {
          message: string;
          type?: 'success' | 'info' | 'error';
          productName?: string;
          action?: { label: string; onClick: () => void };
        },
    defaultType: 'success' | 'info' | 'error' = 'info'
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const toast: ToastItem =
      typeof messageOrOptions === 'string'
        ? { id, message: messageOrOptions, type: defaultType }
        : {
            id,
            message: messageOrOptions.message,
            type: messageOrOptions.type || 'info',
            productName: messageOrOptions.productName,
            action: messageOrOptions.action,
          };

    setToasts((prev) => [...prev.slice(-2), toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations — Do NOT auto-open cart drawer when adding to cart
  const addToCart = (product: Product, quantity = 1, options?: { openDrawer?: boolean }) => {
    if (product.stock <= 0) {
      showToast(`${product.name} is currently out of stock`, 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        if (newQty === existing.quantity) {
          showToast(`Maximum available stock reached for ${product.name}`, 'info');
          return prev;
        }
        showToast({
          message: 'Added to cart successfully!',
          type: 'success',
          productName: product.name,
        });
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }

      showToast({
        message: 'Added to cart successfully!',
        type: 'success',
        productName: product.name,
      });
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });

    // Only open cart drawer if explicitly requested (never by default on Add to Cart)
    if (options?.openDrawer === true) {
      setIsCartOpen(true);
    }
  };

  const buyNow = (product: Product, quantity = 1) => {
    addToCart(product, quantity, { openDrawer: false });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Removed item from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const max = item.product.stock;
          const target = Math.min(quantity, max);
          if (quantity > max) {
            showToast(`Maximum available stock is ${max}`, 'info');
          }
          return { ...item, quantity: target };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = totalQuantity;
  const originalSubtotal = cart.reduce((sum, item) => sum + REGULAR_PRICE * item.quantity, 0);
  const {
    isOfferApplied,
    effectiveUnitPrice,
    discountAmount,
    discountPercent,
    discountedSubtotal,
    unitsNeededForOffer,
    offerTitle,
  } = calculateVolumePricing(totalQuantity, originalSubtotal);
  const subtotal = discountedSubtotal;
  // FREE DELIVERY on every order — no delivery, shipping, or hidden charges
  const deliveryCharge = 0;
  const total = subtotal;

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders
  const createOrder = (customer: CustomerInfo, notes?: string): Order => {
    // 1. Sanitize customer inputs to defend against XSS
    const { sanitized: sanitizedCustomer } = sanitizeCustomerInput(customer);
    const sanitizedNotes = notes ? sanitizeString(notes, 250) : undefined;

    // 2. Canonical financial verification: guarantees that client-side DOM/state manipulation cannot forge prices
    const verification = verifyAndCalculateOrder(cart, products, settings);
    if (verification.tampered) {
      console.warn('[SECURITY] Pricing discrepancy detected and reconciled:', verification.reason);
      showToast('Order verified against official SCENT ONE catalog pricing', 'info');
    }

    const orderRef = `S1-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString(36).slice(-3).toUpperCase()}`;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderReference: orderRef,
      createdAt: new Date().toISOString(),
      customer: sanitizedCustomer,
      items: verification.verifiedItems,
      originalSubtotal: verification.verifiedOriginalSubtotal,
      discountPercent: verification.verifiedDiscountPercent,
      discountAmount: verification.verifiedDiscountAmount,
      effectiveUnitPrice: verification.verifiedEffectiveUnitPrice,
      appliedOffer: verification.verifiedIsOfferApplied ? verification.verifiedOfferTitle : undefined,
      subtotal: verification.verifiedSubtotal,
      deliveryCharges: verification.verifiedDeliveryCharges,
      total: verification.verifiedTotal,
      status: 'Pending',
      notes: sanitizedNotes,
      source: 'WhatsApp',
    };

    // Deduct stock locally
    setProducts((prev) =>
      prev.map((prod) => {
        const item = cart.find((c) => c.product.id === prod.id);
        if (item) {
          return { ...prod, stock: Math.max(0, prod.stock - item.quantity) };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setLatestOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setIsOrderSuccessOpen(true);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast(`Order status updated to ${status}`, 'success');
  };

  // Privacy control: purge customer orders from device storage
  const clearOrderHistory = () => {
    setOrders([]);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    showToast('Your order history on this browser has been safely purged.', 'info');
  };

  // Product management for admin (with schema & bounds validation)
  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const safePrice = Math.max(1, Math.min(50000, Number(newProdData.price) || 699));
    const safeStock = Math.max(0, Math.floor(Number(newProdData.stock) || 0));
    const safeName = sanitizeString(newProdData.name, 100);
    const safeSlug = sanitizeString(newProdData.slug, 50) || `prod-${Date.now()}`;

    const newProduct: Product = {
      ...newProdData,
      id: safeSlug,
      name: safeName,
      slug: safeSlug,
      price: safePrice,
      stock: safeStock,
    };

    setProducts((prev) => [...prev, newProduct]);
    showToast(`Fragrance "${newProduct.name}" added to catalog`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const safePrice = updates.price !== undefined ? Math.max(1, Math.min(50000, Number(updates.price))) : p.price;
        const safeStock = updates.stock !== undefined ? Math.max(0, Math.floor(Number(updates.stock))) : p.stock;
        const safeName = updates.name !== undefined ? sanitizeString(updates.name, 100) : p.name;
        return {
          ...p,
          ...updates,
          price: safePrice,
          stock: safeStock,
          name: safeName,
        };
      })
    );
    // Also update any in cart
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === id ? { ...item, product: { ...item.product, ...updates } } : item
      )
    );
    showToast('Product updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    showToast('Product removed from catalog', 'info');
  };

  const resetToDefaultProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    setSettings(INITIAL_STORE_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    showToast('Catalog restored to official SCENT ONE initial state', 'success');
  };

  const updateSettings = (updates: Partial<StoreSettings>) => {
    const safeDelivery = updates.deliveryCharge !== undefined ? Math.max(0, Number(updates.deliveryCharge)) : undefined;
    const safeThreshold = updates.freeDeliveryThreshold !== undefined ? Math.max(0, Number(updates.freeDeliveryThreshold)) : undefined;
    const cleanUpdates = {
      ...updates,
      ...(safeDelivery !== undefined && { deliveryCharge: safeDelivery }),
      ...(safeThreshold !== undefined && { freeDeliveryThreshold: safeThreshold }),
    };
    setSettings((prev) => ({ ...prev, ...cleanUpdates }));
    showToast('Store settings saved', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDefaultProducts,
        cart,
        addToCart,
        buyNow,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        totalQuantity,
        originalSubtotal,
        effectiveUnitPrice,
        isOfferApplied,
        unitsNeededForOffer,
        offerTitle,
        discountPercent,
        discountAmount,
        subtotal,
        deliveryCharge,
        total,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        createOrder,
        updateOrderStatus,
        clearOrderHistory,
        settings,
        updateSettings,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrderSuccessOpen,
        setIsOrderSuccessOpen,
        latestOrder,
        activeProductModal,
        setActiveProductModal,
        isSearchOpen,
        setIsSearchOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isAdminOpen,
        setIsAdminOpen,
        policyModal,
        openPolicy,
        closePolicy,
        isDark,
        toggleTheme,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
