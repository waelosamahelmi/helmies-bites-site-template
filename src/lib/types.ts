export interface MenuItem {
  id: string;
  tenant_id: string;
  name: string;
  name_en?: string;
  name_sv?: string;
  description?: string;
  description_en?: string;
  description_sv?: string;
  price: number;
  category_id: string;
  is_available: boolean;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  image_url?: string;
  spicy_level?: number;
}

export interface Category {
  id: string;
  tenant_id: string;
  name: string;
  name_en?: string;
  name_sv?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

export interface Order {
  id: string;
  tenant_id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  delivery_type: 'delivery' | 'pickup';
  delivery_address?: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  special_instructions?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
  created_at: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  toppings?: string[];
  specialInstructions?: string;
}

export interface Branch {
  id: string;
  tenant_id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  phone: string;
  email?: string;
  is_active: boolean;
  opening_hours?: OpeningHours;
}

export interface OpeningHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}
