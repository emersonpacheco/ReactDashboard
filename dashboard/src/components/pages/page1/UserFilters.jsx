import React from "react"


const UserFilters = ({
    searchType,
    searchTerm,
    sortBy,
    handleSearchTypeChange,
    handleInputChange,
    handleSort,
    renderSortIcon
  }) => {
    return (
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search Type Selector */}
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search by</label>
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => handleSearchTypeChange("username")}
                className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                  searchType === "username" 
                    ? "bg-blue-600 text-white border-blue-600" 
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-white border-gray-300"
                }`}
              >
                Username
              </button>
              <button
                onClick={() => handleSearchTypeChange("total_spent")}
                className={`px-3 py-2 text-sm font-medium border-t border-b ${
                  searchType === "total_spent" 
                    ? "bg-blue-600 text-white border-blue-600" 
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-white border-gray-300"
                }`}
              >
                Total Spent
              </button>
              <button
                onClick={() => handleSearchTypeChange("created_at")}
                className={`px-3 py-2 text-sm font-medium rounded-r-md border ${
                  searchType === "created_at" 
                    ? "bg-blue-600 text-white border-blue-600" 
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-white border-gray-300"
                }`}
              >
                Creation Date
              </button>
            </div>
          </div>
          
          {/* Search Input */}
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {searchType === "username" 
                ? "Search by username" 
                : searchType === "total_spent" 
                  ? "Search by total spent (min amount)" 
                  : "Search by date (format: DD/MM/YYYY)"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                  className="h-5 w-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                className="placeholder-gray-500 dark:placeholder-gray-300 pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-800 dark:text-white shadow-sm transition-all"
                type={searchType === "total_spent" ? "number" : "text"}
                placeholder={
                  searchType === "username" 
                    ? "Enter username..." 
                    : searchType === "total_spent" 
                      ? "Enter minimum amount..." 
                      : "Enter date..."
                }
                value={searchTerm}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          {/* Sorting Controls */}
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort by</label>
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => handleSort("username")}
                className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-l-md border ${
                  sortBy === "username" 
                    ? "bg-blue-600 text-white border-blue-600" 
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-white border-gray-300"
                }`}
              >
                <span>Name</span>
                {renderSortIcon("username")}
              </button>
              <button
                onClick={() => handleSort("total_spent")}
                className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium border-t border-b ${
                  sortBy === "total_spent" 
                    ? "bg-blue-600 text-white border-blue-600" 
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-white border-gray-300"
                }`}
              >
                <span>Total</span>
                {renderSortIcon("total_spent")}
              </button>
              <button
                onClick={() => handleSort("created_at")}
                className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-r-md border ${
                  sortBy === "created_at" 
                    ? "bg-blue-600 text-white border-blue-600" 
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-white border-gray-300"
                }`}
              >
                <span>Date</span>
                {renderSortIcon("created_at")}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

export default UserFilters