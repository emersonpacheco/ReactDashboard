import React from "react"

const OrderModal = ({ 
    showOrderModal, 
    setShowOrderModal, 
    orderUserId, 
    setOrderUserId, 
    orderTotalAmount, 
    setOrderTotalAmount, 
    orderStatus, 
    setOrderStatus, 
    handleCreateOrder, 
    orderResponse 
    }) => {
    if (!showOrderModal) return null;
  
    return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with improved blur */}
      <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm transition-opacity"></div>
      
      <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all sm:max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-lg mr-3">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Create New Order</h2>
            </div>
            <button 
              onClick={() => setShowOrderModal(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 block">User ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Enter user ID" 
                  value={orderUserId} 
                  onChange={(e) => setOrderUserId(e.target.value)} 
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none text-gray-800 dark:text-white transition-all"
                />
              </div>
            </div>
            
            <div className="relative">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 block">Total Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Enter amount" 
                  value={orderTotalAmount} 
                  onChange={(e) => setOrderTotalAmount(e.target.value)} 
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none text-gray-800 dark:text-white transition-all"
                />
              </div>
            </div>
            
            <div className="relative">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 block">Status</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border bg-white dark:bg-gray-800 border-gray-300 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-nonetransition-all appearance-none"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
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
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Order
              </button>
            </div>
            {orderResponse && orderResponse.error && (
              <div className="mt-2 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {orderResponse.error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )}

  export default OrderModal