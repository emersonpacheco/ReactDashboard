import Header from './components/Header';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Page1 from './pages/pag1';
import SideMenu from './components/SideMenu';
import Dashboard from "./pages/pag2";
import MainPage from "./pages/mainPage"

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'false' || true
  );
 
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className='from-gray-100 via-gray-300 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 min-h-screen relative transition-colors duration-300 bg-gradient-to-br'>
      {/* Fixed header */}
      <Header 
        title={"Sales Dashboard"}
        dark={darkMode} 
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        className="fixed top-0 left-0 w-full z-30"
      />
      
      <div className="flex min-h-screen">
        {/* SideMenu with adjustments for fixed header */}
        <SideMenu darkMode={darkMode} className="h-full" />
        
        {/* Main content with padding to account for fixed header */}
        <main className="flex-1 overflow-y-auto pt-20">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/users" element={<Page1 />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;