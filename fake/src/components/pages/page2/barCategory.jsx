import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useData from '../../data/data';

const BarCategory = () => {
  const { data, loading, error } = useData();
  const [categorySales, setCategorySales] = useState({}); // State to store sales per category

  useEffect(() => {
    // Function to process the data and calculate sales for each category
    const processData = () => {
      const salesByCategory = {}; // Object to store sales data per category

      data.forEach(item => {
        // Check if order_id is not null and quantity is not null
        if (item.order_id !== null && item.order_id !== undefined && item.quantity !== null && item.quantity !== undefined) {
          // Multiply quantity by the quantity itself (or any factor you need)
          const saleAmount = item.quantity;

          // Add sales to the category
          if (salesByCategory[item.category]) {
            salesByCategory[item.category] += saleAmount;
          } else {
            salesByCategory[item.category] = saleAmount;
          }
        }
      });

      setCategorySales(salesByCategory); // Update state with sales data
    };

    // Call the function to process data
    if (data) processData();
  }, [data]);

  // Preparing data for visualization (e.g., for a chart or table)
  const chartData = Object.keys(categorySales).map(category => ({
    category,
    sales: categorySales[category],
  }));

  return (
    <div className="hover:shadow-xl rounded-lg shadow-md shadow-gray-500 dark:shadow-black p-4 mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Sales Per Category</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarCategory;
