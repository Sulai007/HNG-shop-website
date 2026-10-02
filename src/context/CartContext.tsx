import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, NigerianDeliveryState, Product, ProductVariant } from '../types';
import { NIGERIAN_STATES } from '../data/seedData';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  selectedState: NigerianDeliveryState;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  setSelectedState: (state: NigerianDeliveryState) => void;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => { success: boolean; message?: string };
  updateQuantity: (itemId: string, newQuantity: number) => { success: boolean; message?: string };
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedState, setSelectedState] = useState<NigerianDeliveryState>(NIGERIAN_STATES[0]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Storage key is scoped to user id if authenticated, or guest key
  const storageKey = user ? `novatrend_cart_${user.id}` : 'novatrend_cart_guest';
  const legacyStorageKey = user ? `eda_cart_${user.id}` : 'eda_cart_guest';

  // Load cart from storage on user change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey) || localStorage.getItem(legacyStorageKey);
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error('Failed to load cart from storage:', err);
    }
  }, [storageKey, legacyStorageKey]);

  // Persist cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save cart to storage:', err);
    }
  }, [items, storageKey]);

  const addItem = (product: Product, variant?: ProductVariant, quantity = 1): { success: boolean; message?: string } => {
    if (quantity <= 0) return { success: false, message: 'Quantity must be at least 1' };

    const effectiveStock = variant ? variant.stock_quantity : product.stock_quantity;
    const unitPrice = product.price + (variant ? variant.price_adjustment : 0);
    const cartItemId = `${product.id}_${variant ? variant.id : 'standard'}`;

    const existingIndex = items.findIndex((i) => i.id === cartItemId);

    if (existingIndex > -1) {
      const currentQty = items[existingIndex].quantity;
      const proposedQty = currentQty + quantity;

      if (proposedQty > effectiveStock) {
        return {
          success: false,
          message: `Only ${effectiveStock} units available in stock. You already have ${currentQty} in your cart.`,
        };
      }

      const updated = [...items];
      updated[existingIndex].quantity = proposedQty;
      updated[existingIndex].subtotal = proposedQty * unitPrice;
      setItems(updated);
      setIsCartDrawerOpen(true);
      return { success: true };
    }

    if (quantity > effectiveStock) {
      return {
        success: false,
        message: `Only ${effectiveStock} units available in stock.`,
      };
    }

    const newItem: CartItem = {
      id: cartItemId,
      product_id: product.id,
      product,
      variant_id: variant?.id,
      variant,
      quantity,
      unit_price: unitPrice,
      subtotal: quantity * unitPrice,
    };

    setItems([...items, newItem]);
    setIsCartDrawerOpen(true);
    return { success: true };
  };

  const updateQuantity = (itemId: string, newQuantity: number): { success: boolean; message?: string } => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return { success: true };
    }

    const index = items.findIndex((i) => i.id === itemId);
    if (index === -1) return { success: false, message: 'Item not found' };

    const item = items[index];
    const effectiveStock = item.variant ? item.variant.stock_quantity : item.product.stock_quantity;

    if (newQuantity > effectiveStock) {
      return {
        success: false,
        message: `Maximum available stock for this selection is ${effectiveStock} units.`,
      };
    }

    const updated = [...items];
    updated[index].quantity = newQuantity;
    updated[index].subtotal = newQuantity * item.unit_price;
    setItems(updated);
    return { success: true };
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.error(e);
    }
  };

  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce((acc, curr) => acc + curr.subtotal, 0);
  const deliveryFee = items.length > 0 ? selectedState.delivery_fee : 0;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        deliveryFee,
        total,
        selectedState,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        setSelectedState,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
