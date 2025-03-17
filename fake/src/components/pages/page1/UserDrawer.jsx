import React from 'react';

const UserDrawer = ({ selectedUser, showUserDrawer, handleCloseDrawer, getUserOrders }) => {
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-600';
      case 'processing':
        return 'bg-blue-600';
      case 'cancelled':
      case 'canceled':
        return 'bg-red-600';
      case 'pending':
      default:
        return 'bg-yellow-600';
    }
  };

  if (!showUserDrawer || !selectedUser) return null;

  const userOrders = getUserOrders(selectedUser.user_id);
  const totalAmount = userOrders.reduce(
    (sum, order) => sum + (parseFloat(order.total_amount) || 0), 
    0
  ).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-opacity-40 backdrop-blur-sm transition-opacity"
        onClick={handleCloseDrawer}
      ></div>
      
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-2xl">
          <div className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700">
                  {selectedUser.username.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">{selectedUser.username}</h2>
                  <p className="text-sm text-gray-800 dark:text-white">{selectedUser.email}</p>
                </div>
              </div>
              <button 
                onClick={handleCloseDrawer}
                className="text-gray-800 dark:text-white hover:text-gray-700 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            {/* User Details */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-800 dark:text-white">User ID</p>
                  <p className="font-medium text-gray-800 dark:text-white">#{selectedUser.user_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-800 dark:text-white">Created</p>
                  <p className="font-medium text-gray-800 dark:text-white">{formatDate(selectedUser.user_created_at)}</p>
                </div>
              </div>
            </div>
            
            {/* Orders List */}
            <div className="flex-1 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Orders</h3>
              
              {userOrders.length === 0 ? (
                <div className="text-center py-10 bg-gray-100 dark:bg-gray-800 rounded">
                  <p className="text-gray-500 dark:text-gray-400">No orders found</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                      <p className="font-bold text-2xl text-gray-800 dark:text-white">{userOrders.length}</p>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                      <p className="font-bold text-2xl text-gray-800 dark:text-white">${totalAmount}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div 
                        key={`drawer-order-${order.order_id}`}
                        className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden transition-all hover:shadow-md"
                      >
                        {/* Status Bar */}
                        
                        <div className={`h-2 ${getStatusColor(order.status)}`}></div>
                        
                        <div className="p-4">
                          <div className="flex justify-between mb-4">
                            <div>
                              <span className="text-sm text-gray-800 dark:text-white">Order ID</span>
                              <p className="font-medium text-gray-800 dark:text-white">#{order.order_id}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-gray-800 dark:text-white">Status</span>
                              <p>
                                <span className={`inline-block px-2 py-1 text-xs rounded-full text-gray-800 dark:text-white ${getStatusColor(order.status)}`}>
                                  {order.status || 'N/A'}
                                </span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm text-gray-800 dark:text-white">Created</span>
                              <p className="font-medium text-gray-800 dark:text-white">{formatDate(order.order_created_at)}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-gray-800 dark:text-white">Amount</span>
                              <p className="font-bold text-gray-800 dark:text-white">${parseFloat(order.total_amount || 0).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDrawer;