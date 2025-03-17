import React from 'react';
import { FiMoon, FiSun } from "react-icons/fi";

const Header = ({ title, dark, onToggleDarkMode, className = "" }) => {
  return(
    <header
      className={`bg-gray-400 dark:bg-gray-900 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-600 dark:border-gray-500 h-20 transition-colors duration-300 w-full z-30 ${className}`}
    >
      <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 translate-y-5 container mx-auto flex items-center justify-between px-4">
        <button 
          onClick={() => window.location.href = '/'}
          className="relative z-10 hover:text-gray-500 transition-colors cursor-pointer"
        >
          <h1>{title}</h1>
        </button>
        
        <button
          onClick={onToggleDarkMode}
          className="px-4 py-2 bg-gray-900 text-white dark:text-black rounded hover:bg-gray-600 transition-colors dark:bg-gray-100 dark:hover:bg-gray-500"
        >
          {dark ? <FiSun /> : <FiMoon />}
        </button>
      </div>

      {/* Centered image - kept from original code */}
      <div className="absolute left-[35%] transform -translate-x-1/2 top-0 h-full flex items-center">
        {/* Your image content here */}
      </div>
    </header>
  );
}

export default Header;