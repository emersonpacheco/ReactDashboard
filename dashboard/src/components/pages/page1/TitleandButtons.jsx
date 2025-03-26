import React from "react"

const TitleandButtons = ({
    userAlertVisible,
    userResponse,
    orderAlertVisible,
    orderResponse,
    setShowUserModal,
    setShowOrderModal,
    setShowStockModal
  }) => {
return(
    <>
{userAlertVisible && (
    <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 transition-opacity duration-300 flex items-center">
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <p className="font-medium">{userResponse.message || "User created successfully!"}</p>
    </div>
  )}
  
  {orderAlertVisible && (
    <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 transition-opacity duration-300 flex items-center">
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <p className="font-medium">{orderResponse.message || "Order created successfully!"}</p>
    </div>
  )}
  
  {/* Header and Actions */}
  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Order Management</h1>
    <div className="flex gap-3">
      <button 
        onClick={() => setShowUserModal(true)} 
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
        </svg>
        New User
      </button>
      <button 
        onClick={() => setShowOrderModal(true)} 
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
        </svg>
        New Order
      </button>
      <button 
        onClick={() => setShowStockModal(true)} 
        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all shadow-md hover:shadow-lg flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10m0-10L4 17m16 0l-8 4"></path>
        </svg>
        Update Stock
      </button>
    </div>
  </div>
  </>
   )
}
export default TitleandButtons