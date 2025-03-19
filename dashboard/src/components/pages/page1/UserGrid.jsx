import React, { useState, useRef, useCallback, useEffect } from "react";

const UserGrid = ({ filteredUsers, orders, getUserOrders, handleUserClick, formatDate, getUserTotalSpent }) => {
  const [visibleCount, setVisibleCount] = useState(10);
  const loaderRef = useRef(null);

  // Observer callback to load more users when the loader comes into view
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setVisibleCount((prev) => Math.min(prev + 10, filteredUsers.length));
    }
  }, [filteredUsers.length]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0.5,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const visibleUsers = filteredUsers.slice(0, visibleCount);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          ></path>
        </svg>
        Users ({filteredUsers.length})
      </h2>

      {visibleUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {visibleUsers.map((user) => {
            // Now pass the orders array along with the user ID
            const userOrders = getUserOrders(orders, user.user_id);
            
            const totalAmount =
              userOrders.length > 0
                ? userOrders
                    .reduce(
                      (sum, order) => sum + (parseFloat(order.total_amount) || 0),
                      0
                    )
                    .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : "0.00";

            return (
              <div
                key={`user-${user.user_id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg shadow-gray-400 overflow-hidden flex flex-col cursor-pointer hover:shadow-xl hover:shadow-gray-700 dark:shadow-gray-800 dark:hover:shadow-gray-950 transition-shadow"
                onClick={() => handleUserClick(user)}
              >
                {/* User Header */}
                <div className="p-4 flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700">
                    {user.username ? user.username.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-800 dark:text-white">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-800 dark:text-white">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* User Details */}
                <div className="px-4 pb-4 flex-grow">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-800 dark:text-white">
                        User ID
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        #{user.user_id}
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-800 dark:text-white">
                        Created
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {formatDate(user.user_created_at)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-800 dark:text-white">
                        Orders
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {userOrders.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Footer */}
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      Total Spent
                    </span>
                    <span className="text-lg font-bold text-gray-800 dark:text-white">
                      ${totalAmount}
                    </span>
                  </div>
                </div>

                {/* View Details Indicator */}
                <div
                  className={`px-4 py-2 ${
                    userOrders.length > 0
                      ? "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  } text-center border-t ${
                    userOrders.length > 0
                      ? "border-blue-100 dark:border-blue-800"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <span className="text-sm font-medium flex items-center justify-center">
                    {userOrders.length > 0 ? "View Orders" : "No Orders"}
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-100 dark:bg-gray-800 rounded">
          <p className="text-gray-500 dark:text-gray-400">No users found</p>
        </div>
      )}

      {/* Loader element to detect when the user scrolls to the bottom */}
      {visibleCount < filteredUsers.length && (
        <div ref={loaderRef} className="text-center py-4">
          <p className="text-gray-500 dark:text-gray-400">
            Loading more users...
          </p>
        </div>
      )}
    </div>
  );
};

export default UserGrid;
