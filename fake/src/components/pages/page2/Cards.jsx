import React from "react";

const Cards = ({ value, head, st }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md shadow-gray-500 dark:shadow-black p-3 
    transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700 w-94 ml-5 mr-5">
      <h5 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
        {head}
      </h5>
      <p className="text-3xl font-bold text-gray-900 dark:text-white flex items-baseline">
        <span className="text-2xl mr-1"></span>
        <span>{value}</span>
      </p>
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p
          className={`text-sm font-medium flex items-center ${
            st === "Decreased"
              ? "text-red-600 dark:text-red-400"
              : st === "Increased" || "Active Users"
              ? "text-green-600 dark:text-green-400"
              : "text-green-600 dark:text-green-400"
          }`}
        >
          {st === "Decreased" && (
            <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.293 10.293a1 1 0 011.414 0L10 13.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {st === "Increased" && (
            <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {st === "Updated just now" && (
            <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12 7a1 1 0 10-2 0v4a1 1 0 102 0V7z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {st === "Active Users" && (
            <svg className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 12a5 5 0 100-10 5 5 0 000 10zm-7 6a7 7 0 0114 0H3z" clipRule="evenodd" />
            </svg>
          )}
          {st}
        </p>
      </div>
    </div>
  );
};

export default Cards;
