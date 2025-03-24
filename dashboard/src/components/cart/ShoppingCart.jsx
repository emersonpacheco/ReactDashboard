import React, { useState, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { postOrder } from '../data/Post';

// Create a context to manage cart state globally
export const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedUserId = localStorage.getItem('userId');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedUserId) setUserId(savedUserId);
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('userId', userId);
  }, [cart, userId]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.findIndex(item => 
        item.product_id === product.product_id
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
        return updatedCart;
      } else {
        // Add new item with quantity
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product_id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

 

  // Values to be provided to consumers
  const cartContextValue = {
    cart,
    userId,
    setUserId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isCartOpen,
    setIsCartOpen
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};

const ShoppingCart = () => {
  const { 
    cart, 
    userId, 
    setUserId, 
    removeFromCart,
    clearCart, 
    updateQuantity,
    getTotalPrice,
    isCartOpen, 
    setIsCartOpen 
  } = React.useContext(CartContext);

  const handleCheckout = async () => {
    if (!userId) {
      alert("Please enter a User ID before checking out.");
      return;
    }
  
    const updatedStock = cart.map((item) => ({
      product_id: item.product_id,
      new_stock: Math.max(0, item.stock - item.quantity),
    }));
  
    const orderPayload = {
      userId: userId,
      totalAmount: getTotalPrice(),
      status: "pending", // Default status
      products: cart.map((item) => ({
        product_id: item.product_id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      updatedStock,
    };
  
    try {
      const response = await postOrder(orderPayload); // Ensure `postOrder` is defined
      console.log("Order creation result:", response);
      
      if (response.success) {
        clearCart(); // Clear cart after successful order
        alert("Order placed successfully!");
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("An error occurred while placing the order.");
    }
  };

  return (
    <>
      {/* Cart Button */}
      <button 
        onClick={() => setIsCartOpen(true)} 
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center"
      >
        <FiShoppingCart size={24} />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg p-5 overflow-y-auto z-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button 
              onClick={() => setIsCartOpen(false)} 
              className="text-gray-600 hover:text-gray-800 dark:hover:text-white"
            >
              <IoClose size={24} />
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">User ID:</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
              placeholder="Enter User ID"
            />
          </div>
          
          {cart.length === 0 ? (
            <p className="text-gray-500">Cart is empty</p>
          ) : (
            <>
              <ul className="divide-y">
                {cart.map((item) => (
                  <li key={item.product_id} className="py-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">${item.price}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product_id)} 
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center mt-2">
                      <button 
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="bg-gray-200 dark:bg-gray-500 px-2 rounded"
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="bg-gray-200 dark:bg-gray-500 px-2 rounded"
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ShoppingCart;