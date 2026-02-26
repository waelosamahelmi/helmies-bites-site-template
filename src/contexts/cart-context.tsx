import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem } from '../types';

export interface CartItem {
  menuItemId: string;
  name: string;
  nameEn?: string;
  price: number;
  quantity: number;
  size?: string;
  toppings?: string[];
  specialInstructions?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, quantity: number, options?: any) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart:', e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (menuItem: MenuItem, quantity: number, options?: any) => {
    const cartItem: CartItem = {
      menuItemId: menuItem.id,
      name: menuItem.name,
      nameEn: menuItem.name_en,
      price: menuItem.price,
      quantity,
      size: options?.size,
      toppings: options?.toppings,
      specialInstructions: options?.specialInstructions,
    };

    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.menuItemId === menuItem.id &&
        JSON.stringify(item.size) === JSON.stringify(cartItem.size) &&
        JSON.stringify(item.toppings) === JSON.stringify(cartItem.toppings)
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, cartItem];
    });
  };

  const removeItem = (menuItemId: string) => {
    setItems(prev => prev.filter(item => item.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.menuItemId === menuItemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
