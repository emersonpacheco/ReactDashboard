import React, { useState, useEffect } from "react";
import useData from '../components/data/data';
import Products from "../components/pages/mainPage/Products";

const MainPage = () => {
    
    return (
        <div className="p-5 ml-15 mr-15 mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Main Page</h1>
        </div>
            <Products/>
        </div>
    );
};

export default MainPage;