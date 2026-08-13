import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [discountType, setDiscountType] = useState('percentage'); // 'percentage' | 'fixed'
  const [discountValue, setDiscountValue] = useState(0);
  const [heldOrders, setHeldOrders] = useState(() => {
    const saved = localStorage.getItem('pos_held_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [customerName, setCustomerName] = useState('Walk-in Customer');

  useEffect(() => {
    localStorage.setItem('pos_held_orders', JSON.stringify(heldOrders));
  }, [heldOrders]);

  const addToCart = (product, quantityToAdd = 1) => {
    if (product.stock <= 0) {
      alert(`"${product.name}" is out of stock!`);
      return;
    }

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product._id === product._id);
      if (existing) {
        const newQty = existing.quantity + quantityToAdd;
        if (newQty > product.stock) {
          alert(`Cannot add more than available stock (${product.stock}) for "${product.name}"`);
          return prevItems;
        }
        return prevItems.map((item) =>
          item.product._id === product._id ? { ...item, quantity: newQty } : item
        );
      } else {
        if (quantityToAdd > product.stock) {
          alert(`Cannot add more than available stock (${product.stock})`);
          return prevItems;
        }
        return [...prevItems, { product, quantity: quantityToAdd }];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product._id === productId) {
          if (newQuantity > item.product.stock) {
            alert(`Stock limit reached for "${item.product.name}" (Max: ${item.product.stock})`);
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscountValue(0);
    setCustomerName('Walk-in Customer');
  };

  // Hold current order
  const holdCurrentOrder = (note = '') => {
    if (cartItems.length === 0) return;
    const newHeld = {
      id: 'HOLD-' + Date.now(),
      timestamp: new Date().toISOString(),
      customerName,
      items: [...cartItems],
      discountType,
      discountValue,
      note,
    };
    setHeldOrders((prev) => [newHeld, ...prev]);
    clearCart();
  };

  // Resume held order
  const resumeHeldOrder = (heldId) => {
    const held = heldOrders.find((h) => h.id === heldId);
    if (held) {
      setCartItems(held.items);
      setDiscountType(held.discountType || 'percentage');
      setDiscountValue(held.discountValue || 0);
      setCustomerName(held.customerName || 'Walk-in Customer');
      removeHeldOrder(heldId);
    }
  };

  const removeHeldOrder = (heldId) => {
    setHeldOrders((prev) => prev.filter((h) => h.id !== heldId));
  };

  // Totals calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  let discountAmount = 0;
  if (discountType === 'percentage') {
    discountAmount = (subtotal * (discountValue || 0)) / 100;
  } else {
    discountAmount = discountValue || 0;
  }

  const taxableBase = Math.max(0, subtotal - discountAmount);
  const tax = taxableBase * 0.08; // 8% Tax
  const grandTotal = Math.max(0, taxableBase + tax);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        discountType,
        setDiscountType,
        discountValue,
        setDiscountValue,
        heldOrders,
        holdCurrentOrder,
        resumeHeldOrder,
        removeHeldOrder,
        customerName,
        setCustomerName,
        subtotal: Number(subtotal.toFixed(2)),
        discountAmount: Number(discountAmount.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        grandTotal: Number(grandTotal.toFixed(2)),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
