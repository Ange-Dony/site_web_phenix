'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, CartItem } from '@/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger le panier depuis localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('phenix_cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
    setIsLoaded(true);
  }, []);

  // Sauvegarder dans localStorage lors des modifications
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('phenix_cart', JSON.stringify(cart));
      } catch {
        // Ignore
      }
    }
  }, [cart, isLoaded]);

  const addToCart = (book: Book, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.book.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { book, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (bookId: string) => {
    setCart((prev) => prev.filter((item) => item.book.id !== bookId));
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.book.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
