export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  gallery?: string[];
  inStock: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  isFeatured?: boolean;
  isSpecialOffer?: boolean;
  sku?: string;
  specifications?: Record<string, string>;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logoText: string;
  address: string;
  whatsappNumber: string;
  whatsappNumberDisplay: string;
  contactEmail: string;
  businessHours: string;
  currencySymbol: string;
  currencyCode: string;
  deliveryNotes: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AppUser {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  phone?: string;
  address?: string;
  photoURL?: string;
}

export type AdminUser = AppUser;

export interface OrderRecord {
  id: string;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'contacted' | 'confirmed' | 'delivered' | 'cancelled';
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  orderType: 'single_product' | 'cart';
  notes?: string;
  createdAt: string;
}

export interface CustomerInquiry {
  id: string;
  name: string;
  phone?: string;
  topic?: string;
  message: string;
  source: 'contact_form' | 'chat_widget' | 'product_page';
  status: 'new' | 'replied' | 'closed';
  createdAt: string;
}

export type ActivePage = 
  | 'home' 
  | 'shop' 
  | 'product-details' 
  | 'cart' 
  | 'contact'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-products'
  | 'admin-add-product'
  | 'admin-edit-product'
  | 'admin-categories'
  | 'admin-settings'
  | 'admin-orders'
  | 'admin-inquiries';
