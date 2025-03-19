import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, X, ChevronRight, ChevronLeft, Home, FileText, User } from 'lucide-react';

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Users', path: '/users', icon: <User size={20} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <FileText size={20} /> },
  ];

  return (
    <div className="relative h-full">
      {/* Static menu icon that's always visible */}
      <button
        onClick={toggleSidebar}
        className="fixed z-20 top-23 left-5.5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-pointer"
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X size={20} /> : <MenuIcon size={20} />}
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed top-20 left-0 z-10 h-full transition-all duration-20 ${
          isOpen ? 'w-60' : 'w-0 lg:w-20'
        } bg-gray-400 dark:bg-gray-900 shadow-lg overflow-hidden`}
      >
        <div className="p-4">
          <nav className="mt-12">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isOpen ? 'justify-start' : 'justify-center'
                    } hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-200`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {isOpen && <span className="ml-3">{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content padding to account for sidebar */}
      <div 
        className={`transition-all duration-300 ${
          isOpen ? 'ml-64' : 'ml-0 lg:ml-16'
        }`}
      >
        {/* This div is just to push content to the right of the sidebar */}
      </div>
    </div>
  );
};

export default SideMenu;