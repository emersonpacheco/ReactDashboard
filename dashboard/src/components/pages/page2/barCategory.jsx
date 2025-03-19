import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useData from '../../data/data';

const BarCategoryByDay = () => {
  const { orderItems, orders, products, loading, error } = useData();
  const [dailyCategorySales, setDailyCategorySales] = useState([]);
  
  // Define a color palette for different categories
  const categoryColors = {
    'Furniture': '#8a7f8d',        // Muted purple-gray
    'Kitchen': '#96857e',          // Warm taupe
    'Electronics': '#7a908f',      // Muted teal
    'Footwear': '#6d9a8f',         // Sage green
    'Gaming': '#6ca48c',           // Dusty green
    'Fitness': '#7eac83',          // Soft green
    'Home Automation': '#91b279',  // Light olive
    'Outdoor': '#a4b570',          // Yellowish green
    'Photography': '#b7b56a',      // Olive yellow
    'Office': '#c4b064',           // Gold
    'Personal Care': '#c9a768',    // Sand
    'Wearable Tech': '#c89a73'     // Light copper
  };


  useEffect(() => {
    if (!orderItems || !orders || !products) return;

    // Create a map to store sales by day and category
    const salesByDayAndCategory = {};

    orderItems.forEach(orderItem => {
      // Find the order to get the date
      const order = orders.find(o => o.order_id === orderItem.order_id);
      if (!order) return;

      // Format date to YYYY-MM-DD for consistency
      const orderDate = new Date(order.order_created_at).toISOString().split('T')[0];
      
      // Find the product to get its category
      const product = products.find(p => p.product_id === orderItem.product_id);
      if (!product) return;

      const category = product.category;
      const saleAmount = orderItem.quantity;

      // Initialize the day entry if it doesn't exist
      if (!salesByDayAndCategory[orderDate]) {
        salesByDayAndCategory[orderDate] = {};
      }

      // Add or update the category sales for this day
      if (salesByDayAndCategory[orderDate][category]) {
        salesByDayAndCategory[orderDate][category] += saleAmount;
      } else {
        salesByDayAndCategory[orderDate][category] = saleAmount;
      }
    });

    // Convert the map to an array format suitable for the chart
    const chartData = Object.keys(salesByDayAndCategory)
      .sort() // Sort dates chronologically
      .map(date => {
        const daySales = { date };
        Object.keys(salesByDayAndCategory[date]).forEach(category => {
          daySales[category] = salesByDayAndCategory[date][category];
        });
        return daySales;
      });

    setDailyCategorySales(chartData);
  }, [orderItems, orders, products]);

  // Get all unique categories to create the bars
  const allCategories = Array.from(
    new Set(
      dailyCategorySales.flatMap(day => 
        Object.keys(day).filter(key => key !== 'date')
      )
    )
  );

  return (
    <div className="hover:shadow-xl rounded-lg shadow-md shadow-gray-500 dark:shadow-black p-4 mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Daily Sales Per Category</h2>
      
      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading data...</p>
      ) : error ? (
        <p className="text-red-500">Error loading data: {error}</p>
      ) : dailyCategorySales.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No sales data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart 
            data={dailyCategorySales}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="" />
            <XAxis 
              dataKey="date" 
              angle={-45} 
              textAnchor="end"
              height={70}
            />
            <YAxis />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2 border border-gray-200 dark:border-gray-700 rounded shadow">
                        <p className="font-medium">{label}</p>
                        {payload.map((entry, index) => (
                          <p key={`item-${index}`} style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
            <Legend wrapperStyle={{ bottom: -10 }} />
            {allCategories.map((category, index) => (
              <Bar 
                key={category}
                dataKey={category} 
                name={category}
                fill={categoryColors[category] || `hsl(${index * 30}, 70%, 50%)`} 
                stackId="stack"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default BarCategoryByDay;