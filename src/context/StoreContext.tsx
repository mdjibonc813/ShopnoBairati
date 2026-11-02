import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  ActivePage, 
  AppUser, 
  CartItem, 
  Category, 
  CustomerInquiry, 
  OrderRecord, 
  Product, 
  StoreSettings 
} from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_SETTINGS 
} from '../data/initialData';

export const ADMIN_EMAILS = ['mdjibonc813@gmail.com', 'admin@store.com'];

export const isAuthorizedAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
};

interface StoreContextType {
  // Navigation & View
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedProductId: string | null;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  viewProductDetails: (productId: string) => void;
  navigateToShopWithCategory: (categoryName: string) => void;

  // Catalog State
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  selectedProduct: Product | null;
  orders: OrderRecord[];
  inquiries: CustomerInquiry[];
  isFirestoreConnected: boolean;

  // Catalog Actions (Admin)
  addProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleStockStatus: (id: string) => Promise<void>;

  // Category Actions (Admin)
  addCategory: (name: string, description?: string) => Promise<Category>;
  updateCategory: (id: string, name: string, description?: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Settings Actions (Admin)
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  updateAdminProfile: (profile: { name: string; address: string; phone: string }) => Promise<void>;
  resetAllToDefault: () => Promise<void>;

  // Cart & Ordering
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotalAmount: number;
  cartTotalItemsCount: number;

  // Firebase + WhatsApp Order Actions
  getProductWhatsAppMessage: (product: Product, quantity?: number) => string;
  getCartWhatsAppMessage: () => string;
  orderProductOnWhatsApp: (product: Product, quantity?: number, customerInfo?: { name?: string; phone?: string; address?: string }) => Promise<void>;
  orderCartOnWhatsApp: (customerInfo?: { name?: string; phone?: string; address?: string }) => Promise<void>;
  formatPrice: (amount: number) => string;

  // Firebase Chat & Inquiry Actions
  saveCustomerInquiry: (inquiryData: Omit<CustomerInquiry, 'id' | 'createdAt'>) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderRecord['status']) => Promise<void>;
  updateInquiryStatus: (inquiryId: string, status: CustomerInquiry['status']) => Promise<void>;

  // Authentication State & Actions (User & Admin)
  currentUser: AppUser | null;
  adminUser: AppUser | null;
  isAuthorizedAdmin: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'admin';
  openAuthModal: (mode?: 'login' | 'register' | 'admin') => void;
  closeAuthModal: () => void;
  loginUser: (email: string, pass: string, role?: 'admin' | 'customer', name?: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (email: string, pass: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;

  // Backward compatibility aliases
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CART: 'aura_cart_v2',
  AUTH: 'aura_app_user_v3',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(true);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'admin'>('login');

  // Data States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);

  // Cart stored locally
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Current Logged-in User (Customer or Admin)
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (!stored) return null;
      const parsed: AppUser = JSON.parse(stored);
      // Ensure only authorized admin emails hold the admin role
      if (parsed.role === 'admin' && !isAuthorizedAdminEmail(parsed.email)) {
        parsed.role = 'customer';
      }
      return parsed;
    } catch {
      return null;
    }
  });

  // adminUser is derived from currentUser if role is admin and email is strictly authorized
  const isAuthorizedAdmin = isAuthorizedAdminEmail(currentUser?.email) && currentUser?.role === 'admin';
  const adminUser = isAuthorizedAdmin ? currentUser : null;

  // Local storage effects for cart and auth
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH);
      }
    } catch (e) {
      console.warn('Auth sync error', e);
    }
  }, [currentUser]);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const isAuthAdmin = isAuthorizedAdminEmail(fbUser.email);
        const role: 'admin' | 'customer' = isAuthAdmin ? 'admin' : 'customer';

        let userName = fbUser.displayName || (isAuthAdmin ? 'Md Jibon (Admin)' : fbUser.email?.split('@')[0] || 'Store Member');
        let userPhone = '';
        let userAddress = '';

        try {
          const userDocSnap = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            if (data.name) userName = data.name;
            if (data.phone) userPhone = data.phone;
            if (data.address) userAddress = data.address;
          }
        } catch {
          // ignore
        }

        const userObj: AppUser = {
          uid: fbUser.uid,
          email: fbUser.email || (isAuthAdmin ? 'mdjibonc813@gmail.com' : 'customer@store.com'),
          name: userName,
          role,
          phone: userPhone,
          address: userAddress,
          photoURL: fbUser.photoURL || undefined,
        };

        setCurrentUser(userObj);

        // Sync user profile to Firestore
        try {
          await setDoc(doc(db, 'users', fbUser.uid), {
            email: userObj.email,
            name: userObj.name,
            role: userObj.role,
            phone: userObj.phone || '',
            address: userObj.address || '',
            lastLogin: new Date().toISOString(),
          }, { merge: true });
        } catch (e) {
          // quiet fallback
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage, selectedProductId]);

  // ==========================================
  // FIRESTORE REAL-TIME SYNCHRONIZATION
  // ==========================================
  useEffect(() => {
    // 1. Sync Settings from Firestore
    const settingsDocRef = doc(db, 'settings', 'general');
    const unsubSettings = onSnapshot(settingsDocRef, (snap) => {
      if (snap.exists()) {
        setSettings(snap.data() as StoreSettings);
      } else {
        setDoc(settingsDocRef, INITIAL_SETTINGS).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, 'settings/general');
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/general');
      setIsFirestoreConnected(false);
    });

    // 2. Sync Products from Firestore
    const productsCollectionRef = collection(db, 'products');
    const unsubProducts = onSnapshot(productsCollectionRef, (snap) => {
      if (!snap.empty) {
        const firestoreProducts: Product[] = [];
        snap.forEach((docSnap) => {
          firestoreProducts.push({ ...docSnap.data(), id: docSnap.id } as Product);
        });
        setProducts(firestoreProducts);
      } else {
        INITIAL_PRODUCTS.forEach((prod) => {
          setDoc(doc(db, 'products', prod.id), prod).catch(err => {
            handleFirestoreError(err, OperationType.WRITE, `products/${prod.id}`);
          });
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'products');
    });

    // 3. Sync Categories from Firestore
    const categoriesCollectionRef = collection(db, 'categories');
    const unsubCategories = onSnapshot(categoriesCollectionRef, (snap) => {
      if (!snap.empty) {
        const firestoreCats: Category[] = [];
        snap.forEach((docSnap) => {
          firestoreCats.push({ ...docSnap.data(), id: docSnap.id } as Category);
        });
        setCategories(firestoreCats);
      } else {
        INITIAL_CATEGORIES.forEach((cat) => {
          setDoc(doc(db, 'categories', cat.id), cat).catch(err => {
            handleFirestoreError(err, OperationType.WRITE, `categories/${cat.id}`);
          });
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'categories');
    });

    // 4. Sync Orders from Firestore
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubOrders = onSnapshot(ordersQuery, (snap) => {
      const orderList: OrderRecord[] = [];
      snap.forEach((docSnap) => {
        orderList.push({ ...docSnap.data(), id: docSnap.id } as OrderRecord);
      });
      setOrders(orderList);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'orders');
    });

    // 5. Sync Inquiries from Firestore
    const inquiriesQuery = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubInquiries = onSnapshot(inquiriesQuery, (snap) => {
      const inquiryList: CustomerInquiry[] = [];
      snap.forEach((docSnap) => {
        inquiryList.push({ ...docSnap.data(), id: docSnap.id } as CustomerInquiry);
      });
      setInquiries(inquiryList);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'inquiries');
    });

    return () => {
      unsubSettings();
      unsubProducts();
      unsubCategories();
      unsubOrders();
      unsubInquiries();
    };
  }, []);

  const selectedProduct = products.find(p => p.id === selectedProductId) || null;

  const viewProductDetails = (productId: string) => {
    setSelectedProductId(productId);
    setActivePage('product-details');
  };

  const navigateToShopWithCategory = (categoryName: string) => {
    setSelectedCategoryFilter(categoryName);
    setActivePage('shop');
  };

  const formatPrice = (amount: number): string => {
    return `${settings.currencySymbol} ${amount.toLocaleString('en-US')}`;
  };

  // WhatsApp Message Builders
  const getProductWhatsAppMessage = (product: Product, quantity = 1): string => {
    const total = product.price * quantity;
    return `Hello ${settings.storeName}! 👋\n\nI want to order this product from your catalog:\n\n` +
      `📦 *Product:* ${product.name}\n` +
      `🏷️ *SKU:* ${product.sku || 'N/A'}\n` +
      `💵 *Unit Price:* ${formatPrice(product.price)}\n` +
      `🔢 *Quantity:* ${quantity}\n` +
      `💰 *Total Amount:* ${formatPrice(total)}\n\n` +
      `Please provide more details about ordering and delivery to my address. Thank you!`;
  };

  const getCartWhatsAppMessage = (): string => {
    if (cart.length === 0) return '';
    const itemsText = cart.map((item, index) => {
      const itemSubtotal = item.product.price * item.quantity;
      return `${index + 1}. *${item.product.name}*\n   Qty: ${item.quantity} × ${formatPrice(item.product.price)} = ${formatPrice(itemSubtotal)}`;
    }).join('\n\n');

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return `Hello ${settings.storeName}! 👋\n\nI would like to place an order for the following items:\n\n` +
      `${itemsText}\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `💳 *Grand Total:* ${formatPrice(total)}\n` +
      `━━━━━━━━━━━━━━━━━━━\n\n` +
      `📍 *My Delivery Details:*\n` +
      `Name:\n` +
      `Phone:\n` +
      `Full Address:\n\n` +
      `Please confirm stock availability and expected delivery date. Thank you!`;
  };

  const openWhatsAppUrl = (message: string) => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${cleanNumber}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Orders
  const orderProductOnWhatsApp = async (
    product: Product, 
    quantity = 1,
    customerInfo?: { name?: string; phone?: string; address?: string }
  ) => {
    const total = product.price * quantity;
    const orderId = `ord-${Date.now()}`;

    const orderData: OrderRecord = {
      id: orderId,
      items: [{
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity,
        subtotal: total,
      }],
      totalAmount: total,
      status: 'pending',
      customerName: customerInfo?.name || currentUser?.name || '',
      customerPhone: customerInfo?.phone || currentUser?.phone || '',
      deliveryAddress: customerInfo?.address || '',
      orderType: 'single_product',
      notes: `Direct WhatsApp order for ${product.name} (Qty: ${quantity})`,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'orders', orderId), orderData);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `orders/${orderId}`);
    }

    const msg = getProductWhatsAppMessage(product, quantity);
    openWhatsAppUrl(msg);
  };

  const orderCartOnWhatsApp = async (
    customerInfo?: { name?: string; phone?: string; address?: string }
  ) => {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const orderId = `ord-${Date.now()}`;

    const orderData: OrderRecord = {
      id: orderId,
      items: cart.map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        subtotal: i.product.price * i.quantity,
      })),
      totalAmount: total,
      status: 'pending',
      customerName: customerInfo?.name || currentUser?.name || '',
      customerPhone: customerInfo?.phone || currentUser?.phone || '',
      deliveryAddress: customerInfo?.address || '',
      orderType: 'cart',
      notes: `Cart order with ${cart.length} items`,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'orders', orderId), orderData);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `orders/${orderId}`);
    }

    const msg = getCartWhatsAppMessage();
    openWhatsAppUrl(msg);
  };

  const saveCustomerInquiry = async (
    inquiryData: Omit<CustomerInquiry, 'id' | 'createdAt'>
  ): Promise<string> => {
    const inquiryId = `inq-${Date.now()}`;
    const payload: CustomerInquiry = {
      ...inquiryData,
      id: inquiryId,
      name: inquiryData.name || currentUser?.name || 'Website Visitor',
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'inquiries', inquiryId), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `inquiries/${inquiryId}`);
    }

    return inquiryId;
  };

  const updateOrderStatus = async (orderId: string, status: OrderRecord['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const updateInquiryStatus = async (inquiryId: string, status: CustomerInquiry['status']) => {
    try {
      await updateDoc(doc(db, 'inquiries', inquiryId), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `inquiries/${inquiryId}`);
    }
  };

  // Cart
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartTotalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Admin Catalog CRUD
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    setProducts(prev => [newProduct, ...prev]);

    try {
      await setDoc(doc(db, 'products', newId), newProduct);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${newId}`);
    }

    return newProduct;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(prod => (prod.id === id ? { ...prod, ...updates } : prod))
    );

    try {
      await updateDoc(doc(db, 'products', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(prod => prod.id !== id));
    setCart(prev => prev.filter(item => item.product.id !== id));

    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const toggleStockStatus = async (id: string) => {
    const target = products.find(p => p.id === id);
    if (!target) return;

    const newInStock = !target.inStock;
    const updates = {
      inStock: newInStock,
      stockStatus: (newInStock ? 'in_stock' : 'out_of_stock') as Product['stockStatus'],
    };

    setProducts(prev =>
      prev.map(prod => (prod.id === id ? { ...prod, ...updates } : prod))
    );

    try {
      await updateDoc(doc(db, 'products', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  const addCategory = async (name: string, description?: string): Promise<Category> => {
    const newId = `cat-${Date.now()}`;
    const newCategory: Category = {
      id: newId,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description || '',
    };

    setCategories(prev => [...prev, newCategory]);

    try {
      await setDoc(doc(db, 'categories', newId), newCategory);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `categories/${newId}`);
    }

    return newCategory;
  };

  const updateCategory = async (id: string, name: string, description?: string) => {
    const updates = { name, description: description || '' };

    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );

    try {
      await updateDoc(doc(db, 'categories', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `categories/${id}`);
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));

    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
    }
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    try {
      await setDoc(doc(db, 'settings', 'general'), updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/general');
    }
  };

  const updateAdminProfile = async (profile: { name: string; address: string; phone: string }) => {
    const trimmedName = profile.name.trim();
    const trimmedAddress = profile.address.trim();
    const trimmedPhone = profile.phone.trim();
    const cleanPhoneDigits = trimmedPhone.replace(/[^0-9]/g, '');

    // 1. Update currentUser in memory
    setCurrentUser(prev => prev ? ({
      ...prev,
      name: trimmedName || prev.name,
      address: trimmedAddress || prev.address,
      phone: trimmedPhone || prev.phone,
    }) : null);

    // 2. Update store settings with new address and WhatsApp phone
    const newSettings: StoreSettings = {
      ...settings,
      address: trimmedAddress || settings.address,
      whatsappNumber: cleanPhoneDigits || settings.whatsappNumber,
      whatsappNumberDisplay: trimmedPhone || settings.whatsappNumberDisplay,
    };
    setSettings(newSettings);

    // 3. Persist to Firestore: settings and users
    try {
      await setDoc(doc(db, 'settings', 'general'), newSettings, { merge: true });
      const adminUid = currentUser?.uid || 'usr-admin-jibon';
      await setDoc(doc(db, 'users', adminUid), {
        name: trimmedName || 'Md Jibon',
        address: trimmedAddress || '',
        phone: trimmedPhone || '',
        email: currentUser?.email || 'mdjibonc813@gmail.com',
        role: 'admin',
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'adminProfile');
    }
  };

  const resetAllToDefault = async () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setSettings(INITIAL_SETTINGS);
    setCart([]);

    try {
      await setDoc(doc(db, 'settings', 'general'), INITIAL_SETTINGS);
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'resetDefaults');
    }
  };

  // ==========================================
  // AUTHENTICATION: LOGIN, LOGOUT & REGISTER
  // ==========================================
  const openAuthModal = (mode: 'login' | 'register' | 'admin' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginUser = async (
    email: string, 
    pass: string, 
    role: 'admin' | 'customer' = 'customer', 
    name?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // Check for admin login
    if (role === 'admin') {
      if (!isAuthorizedAdminEmail(cleanEmail)) {
        return { 
          success: false, 
          error: 'অনুমতি নেই (Access Denied): শুধুমাত্র অনুমোদিত অ্যাডমিন (mdjibonc813@gmail.com) অ্যাডমিন প্যানেলে লগইন করতে পারবেন। সাধারণ গ্রাহক হিসেবে লগইন করুন।' 
        };
      }
      if (pass.length < 4) {
        return { success: false, error: 'Password must be at least 4 characters.' };
      }

      // Load saved admin details from Firestore
      let adminName = name || (cleanEmail === 'mdjibonc813@gmail.com' ? 'Md Jibon (Admin)' : 'Store Administrator');
      let adminPhone = settings.whatsappNumber;
      let adminAddress = settings.address;

      try {
        const adminDoc = await getDoc(doc(db, 'users', 'usr-admin-jibon'));
        if (adminDoc.exists()) {
          const d = adminDoc.data();
          if (d.name) adminName = d.name;
          if (d.phone) adminPhone = d.phone;
          if (d.address) adminAddress = d.address;
        }
      } catch {
        // quiet
      }

      const admin: AppUser = {
        uid: 'usr-admin-jibon',
        email: cleanEmail,
        name: adminName,
        role: 'admin',
        phone: adminPhone,
        address: adminAddress,
      };
      setCurrentUser(admin);
      closeAuthModal();
      return { success: true };
    }

    // Customer login
    if (cleanEmail.length >= 3 && pass.length >= 4) {
      // If the email logging in is actually the admin email, assign admin role!
      const isActualAdmin = isAuthorizedAdminEmail(cleanEmail);
      const userRole: 'admin' | 'customer' = isActualAdmin ? 'admin' : 'customer';

      let userName = name || (isActualAdmin ? 'Md Jibon (Admin)' : cleanEmail.split('@')[0] || 'Customer Member');
      let userPhone = isActualAdmin ? settings.whatsappNumber : undefined;
      let userAddress = isActualAdmin ? settings.address : undefined;

      try {
        const existingDoc = await getDoc(doc(db, 'users', isActualAdmin ? 'usr-admin-jibon' : `usr-${cleanEmail.replace(/[^a-z0-9]/g, '-')}`));
        if (existingDoc.exists()) {
          const d = existingDoc.data();
          if (d.name) userName = d.name;
          if (d.phone) userPhone = d.phone;
          if (d.address) userAddress = d.address;
        }
      } catch {
        // quiet
      }

      const user: AppUser = {
        uid: isActualAdmin ? 'usr-admin-jibon' : `usr-${Date.now()}`,
        email: cleanEmail,
        name: userName,
        role: userRole,
        phone: userPhone,
        address: userAddress,
      };
      setCurrentUser(user);

      // Save user profile to Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone || '',
          address: user.address || '',
          lastLogin: new Date().toISOString(),
        }, { merge: true });
      } catch (e) {
        // quiet fallback
      }

      closeAuthModal();
      return { success: true };
    }

    return { success: false, error: 'Please enter a valid email and password (minimum 4 characters).' };
  };

  const registerUser = async (
    email: string, 
    pass: string, 
    name: string, 
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (pass.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    const isActualAdmin = isAuthorizedAdminEmail(cleanEmail);
    const role: 'admin' | 'customer' = isActualAdmin ? 'admin' : 'customer';

    const newUser: AppUser = {
      uid: isActualAdmin ? 'usr-admin-jibon' : `usr-${Date.now()}`,
      email: cleanEmail,
      name: name.trim() || (isActualAdmin ? 'Md Jibon (Admin)' : 'New Customer'),
      role,
      phone: phone?.trim(),
      address: isActualAdmin ? settings.address : undefined,
    };

    setCurrentUser(newUser);

    try {
      await setDoc(doc(db, 'users', newUser.uid), {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        phone: newUser.phone || '',
        address: newUser.address || '',
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      // quiet fallback
    }

    closeAuthModal();
    return { success: true };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      const isAuthAdmin = isAuthorizedAdminEmail(fbUser.email);
      const role: 'admin' | 'customer' = isAuthAdmin ? 'admin' : 'customer';

      const userObj: AppUser = {
        uid: fbUser.uid,
        email: fbUser.email || (isAuthAdmin ? 'mdjibonc813@gmail.com' : 'customer@store.com'),
        name: fbUser.displayName || (isAuthAdmin ? 'Md Jibon (Admin)' : 'Customer'),
        role,
        photoURL: fbUser.photoURL || undefined,
        phone: isAuthAdmin ? settings.whatsappNumber : undefined,
        address: isAuthAdmin ? settings.address : undefined,
      };

      setCurrentUser(userObj);
      closeAuthModal();
      return { success: true };
    } catch (err) {
      console.warn('Google Sign-In notice:', err);
      // Fallback to demo Google user if popup blocked in iframe sandbox
      const mockGoogleUser: AppUser = {
        uid: `usr-g-${Date.now()}`,
        email: 'customer@gmail.com',
        name: 'Google Customer',
        role: 'customer',
      };
      setCurrentUser(mockGoogleUser);
      closeAuthModal();
      return { success: true };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // quiet
    }
    setCurrentUser(null);
    if (activePage.startsWith('admin-')) {
      setActivePage('home');
    }
  };

  // Backwards compatibility for AdminLogin / AdminLayout
  const loginAdmin = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (!isAuthorizedAdminEmail(cleanEmail)) {
      return false;
    }
    if (pass.length < 4) {
      return false;
    }

    const admin: AppUser = {
      uid: 'usr-admin-jibon',
      email: cleanEmail,
      name: cleanEmail === 'mdjibonc813@gmail.com' ? 'Md Jibon (Admin)' : 'Store Administrator',
      role: 'admin',
      phone: settings.whatsappNumber,
      address: settings.address,
    };
    setCurrentUser(admin);
    return true;
  };

  const logoutAdmin = () => {
    logout();
  };

  return (
    <StoreContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedProductId,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        searchQuery,
        setSearchQuery,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        viewProductDetails,
        navigateToShopWithCategory,

        products,
        categories,
        settings,
        selectedProduct,
        orders,
        inquiries,
        isFirestoreConnected,

        addProduct,
        updateProduct,
        deleteProduct,
        toggleStockStatus,

        addCategory,
        updateCategory,
        deleteCategory,

        updateSettings,
        updateAdminProfile,
        resetAllToDefault,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotalAmount,
        cartTotalItemsCount,

        getProductWhatsAppMessage,
        getCartWhatsAppMessage,
        orderProductOnWhatsApp,
        orderCartOnWhatsApp,
        formatPrice,

        saveCustomerInquiry,
        updateOrderStatus,
        updateInquiryStatus,

        // Auth
        currentUser,
        adminUser,
        isAuthorizedAdmin,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        loginUser,
        registerUser,
        loginWithGoogle,
        logout,
        loginAdmin,
        logoutAdmin,
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
