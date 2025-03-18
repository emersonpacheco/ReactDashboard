import React from 'react';
import { FiMoon, FiSun } from "react-icons/fi";
import logo from '../assets/default_icon.png';

const Header = ({ title, dark, onToggleDarkMode, className = "" }) => {
  return(
    <header
      className={`bg-gray-400 dark:bg-gray-900 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-600 dark:border-gray-500 h-20 transition-colors duration-300 w-full z-30 ${className}`}
    >
      <div className="absolute left-[4%] transform -translate-x-1/2 top-0 h-full flex items-center">
       <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />

      </div>
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
</header>
  );
}

export default Header;