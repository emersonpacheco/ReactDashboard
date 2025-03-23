import React, { useState, useEffect, useRef } from "react";

const OrderModal = ({
  showOrderModal,
  setShowOrderModal,
  postOrder,
  users, // Receive users array
  products: initialProducts, // Receive products array
}) => {
  // States for creating an order
  const [orderUserId, setOrderUserId] = useState("");
  const [orderStatus, setOrderStatus] = useState("pending");
  const [orderResponse, setOrderResponse] = useState("");
  const [orderAlertVisible, setOrderAlertVisible] = useState(false);

  // Product selection states
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [orderTotalAmount, setOrderTotalAmount] = useState(0);
  // Add products state
  const [products, setProducts] = useState([]);

  // Searchable dropdown states
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const userDropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
    }
  }, [initialProducts]);

  // Update selected user name when userId changes
  useEffect(() => {
    if (orderUserId && users) {
      const selectedUser = users.find(user => user.user_id === orderUserId);
      if (selectedUser) {
        setSelectedUserName(`${selectedUser.username} (ID: ${selectedUser.user_id})`);
      }
    } else {
      setSelectedUserName("");
    }
  }, [orderUserId, users]);

  const addProductToOrder = () => {
    if (!currentProduct) return;
  
    const productToAdd = products.find((p) => p.name === currentProduct);
    if (!productToAdd) return;
  
    // Check if product is out of stock
    if (productToAdd.stock <= 0) {
      alert(`${currentProduct} is out of stock.`);
      return;
    }
  
    const existingProductIndex = selectedProducts.findIndex(
      (p) => p.name === currentProduct
    );
  
    let newQuantity = parseInt(currentQuantity);
  
    // Ensure quantity does not exceed stock
    if (newQuantity > productToAdd.stock) {
      alert(`Only ${productToAdd.stock} units of ${currentProduct} are available.`);
      newQuantity = productToAdd.stock;
    }
  
    if (existingProductIndex >= 0) {
      const updatedProducts = [...selectedProducts];
  
      // Prevent exceeding stock in an update
      const newTotalQuantity = updatedProducts[existingProductIndex].quantity + newQuantity;
      if (newTotalQuantity > productToAdd.stock) {
        alert(`Only ${productToAdd.stock} units available for ${currentProduct}.`);
        return;
      }
  
      updatedProducts[existingProductIndex].quantity = newTotalQuantity;
      setSelectedProducts(updatedProducts);
    } else {
      setSelectedProducts([
        ...selectedProducts,
        {
          name: currentProduct,
          price: productToAdd.price,
          quantity: newQuantity,
        },
      ]);
    }
  
    setCurrentProduct("");
    setCurrentQuantity(1);
  };

  const removeProduct = (index) => {
    const updatedProducts = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updatedProducts);
  };

  const calculateTotalAmount = () => {
    const total = selectedProducts.reduce((sum, product) => {
      return sum + product.price * product.quantity;
    }, 0);
    setOrderTotalAmount(total.toFixed(2));
  };

  // Updated order creation handler with complete product info
  const handleCreateOrder = async () => {
    const updatedStock = products.map((p) => {
      const orderedProduct = selectedProducts.find((sp) => sp.name === p.name);
      if (orderedProduct) {
        return { ...p, stock: Math.max(0, p.stock - orderedProduct.quantity) };
      }
      return p;
    });
  
    const orderPayload = {
      userId: orderUserId,
      totalAmount: orderTotalAmount,
      status: orderStatus,
      products: selectedProducts.map((product) => {
        const fullProduct = products.find((p) => p.name === product.name);
        return {
          product_id: fullProduct.product_id,
          product_name: fullProduct.name,
          quantity: product.quantity,
          price: fullProduct.price,
        };
      }),
      updatedStock: updatedStock.map((p) => ({
        product_id: p.product_id,
        new_stock: p.stock,
      })),
    };
  
    const result = await postOrder(orderPayload);
    console.log("Order creation result:", result);
    setOrderResponse(result);
  
    if (result.order) {
      setProducts(updatedStock);
      setOrderUserId("");
      setSelectedUserName("");
      setSelectedProducts([]);
      setOrderStatus("pending");
      setShowOrderModal(false);
      setOrderAlertVisible(true);
      setTimeout(() => {
        setOrderAlertVisible(false);
      }, 3000);
    }
  };

  // Filter users based on search term
  const filteredUsers = users?.filter(user => 
    user.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.user_id.toString().includes(userSearchTerm)
  ) || [];

  const handleSelectUser = (user) => {
    setOrderUserId(user.user_id);
    setSelectedUserName(`${user.username} (ID: ${user.user_id})`);
    setIsUserDropdownOpen(false);
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [selectedProducts]);

  if (!showOrderModal) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm transition-opacity"></div>
      <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all sm:max-w-lg w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-lg mr-3">
                <svg
                  className="w-6 h-6 text-emerald-600 dark:text-emerald-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Create New Order
              </h2>
            </div>
            <button
              onClick={() => setShowOrderModal(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div className="flex flex-col space-y-4">
            {/* Searchable User Select Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 block">
                User ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
                <div 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} 
                  className="pl-10 w-full px-3 py-2 border bg-white dark:bg-gray-800 border-gray-300 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all cursor-pointer flex justify-between items-center"
                >
                  <span className={selectedUserName ? "" : "text-gray-400"}>
                    {selectedUserName || "Select a user"}
                  </span>
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                
                {isUserDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-700 max-h-60 overflow-y-auto">
                    <div className="sticky top-0 bg-white dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                          </svg>
                        </div>
                        <input
                          type="text"
                          className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white"
                          placeholder="Search users..."
                          value={userSearchTerm}
                          onChange={(e) => setUserSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    
                    {filteredUsers.length > 0 ? (
                      <ul>
                        {filteredUsers.map((user) => (
                          <li
                            key={user.user_id}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-left text-gray-800 dark:text-white"
                            onClick={() => handleSelectUser(user)}
                          >
                            {user.username} (ID: {user.user_id})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-gray-500 dark:text-gray-400 text-center">
                        No users found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Product Selection */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 block">
                Add Products
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                    </svg>
                  </div>
                  <select
                    value={currentProduct}
                    onChange={(e) => setCurrentProduct(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border bg-white dark:bg-gray-800 border-gray-300 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all appearance-none"
                  >
                    <option value="">Select a product</option>
                    {products && products.map((product, index) => (
                      <option key={index} value={product.name}>
                        {product.name} (${product.price})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    min="1"
                    value={currentQuantity}
                    onChange={(e) => setCurrentQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none text-gray-800 dark:text-white transition-all"
                    placeholder="Qty"
                  />
                </div>
                <button
                  onClick={addProductToOrder}
                  className="bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Selected Products List */}
            {selectedProducts.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Selected Products</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                    {selectedProducts.map((product, index) => (
                      <li key={index} className="py-2 flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-800 dark:text-white">{product.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ${product.price} x {product.quantity} = ${(product.price * product.quantity).toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={() => removeProduct(index)}
                          className="text-red-500 hover:text-red-700 transition-colors focus:outline-none"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Total:</span>
                    <span className="font-bold text-gray-900 dark:text-white">${orderTotalAmount}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Order Status */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 block">Status</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border bg-white dark:bg-gray-800 border-gray-300 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all appearance-none"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowOrderModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-800 dark:text-white rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateOrder}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center"
                disabled={selectedProducts.length === 0}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Order
              </button>
            </div>
            {orderResponse && orderResponse.error && (
              <div className="mt-2 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {orderResponse.error}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Success Notification */}
      {orderAlertVisible && (
        <div className="fixed bottom-4 right-4 bg-emerald-100 border-l-4 border-emerald-500 text-emerald-700 p-4 rounded shadow-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">Order created successfully!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderModal;