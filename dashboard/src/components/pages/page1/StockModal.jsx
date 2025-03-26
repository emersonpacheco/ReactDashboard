import React, { useState, useEffect } from "react";

const StockModal = ({ 
  showStockModal, 
  setShowStockModal, 
  products, 
  handleUpdateStock,
  isLoading 
}) => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [stockToAdd, setStockToAdd] = useState("");

  // Reset selections when products are updated
  useEffect(() => {
    if (products?.length) {
      setSelectedProduct("");
      setStockToAdd("");
    }
  }, [products]);

  const handleSubmit = () => {
    // Validate inputs
    if (!selectedProduct || !stockToAdd) {
      console.error("Missing product or stock quantity");
      return;
    }

    // Trigger the parent component's handleUpdateStock with selected product name/ID
    handleUpdateStock(selectedProduct, stockToAdd);
    setShowStockModal(false);
  };

  if (!showStockModal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm transition-opacity"></div>

      <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all sm:max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add Stock</h2>
            <button 
              onClick={() => setShowStockModal(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div className="flex flex-col space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 block">Select Product</label>
              {isLoading ? (
                <p className="text-gray-500 text-sm">Loading products...</p>
              ) : (
                <select 
                  value={selectedProduct} 
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  disabled={isLoading || !products?.length}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                >
                  <option key="default-option" value="">Choose a product</option>
                  {products?.map((product, index) => (
                     <option 
                     key={product.product_id || `product-index-${index}`} 
                     value={product.product_id} // Use product_id instead of id
                   >
                     {product.name || `Product ${index + 1}`}
                   </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 block">Stock to Add</label>
              <input 
                type="number" 
                placeholder="Enter stock quantity" 
                value={stockToAdd} 
                onChange={(e) => setStockToAdd(e.target.value)} 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 text-gray-600 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button 
              onClick={() => setShowStockModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 dark:text-white hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!selectedProduct || !stockToAdd || isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
            >
              Update Stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockModal;