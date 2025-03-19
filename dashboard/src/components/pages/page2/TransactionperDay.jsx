import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useData from '../../data/data';

const TransactionPerDay = () => {
  const { orders, loading, error } = useData();
  
  const chartData = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    
    // Group transactions by day
    const transactionsByDay = orders.reduce((acc, order) => {
      const date = new Date(order.order_created_at);
      if (!isNaN(date.getTime())) {
        const day = date.toISOString().split('T')[0];
        if (!acc[day]) {
          acc[day] = { day, transactions: 0 };
        }
        acc[day].transactions += 1;
      }
      return acc;
    }, {});
    
    // Convert to array and sort by date
    return Object.values(transactionsByDay)
      .sort((a, b) => new Date(a.day) - new Date(b.day))
      .map(item => ({
        ...item
      }));
  }, [orders]);
  
  if (loading) return <div className="text-center p-8">Loading transactions data...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error loading transactions data</div>;
  if (!chartData.length) return <div className="text-center p-8">No transactions data available</div>;
  return (
    <div className="hover:shadow-xl rounded-lg shadow-md shadow-gray-500 dark:shadow-black p-4 mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Transactions Per Day</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid  />
          <XAxis 
            dataKey="day" 
            stroke="#64748b"
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis 
            stroke="#64748b"
            tickFormatter={(value) => `${value.toLocaleString()}`}
          />
          <Tooltip 
            formatter={(value) => [`${value.toLocaleString()}`, 'Transactions']}
            labelFormatter={(label) => {
              const date = new Date(label);
              return date.toLocaleDateString('pt-BR', { weekday: 'short', month: 'short', day: 'numeric' });
            }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                // Use the labelFormatter to format the date in Portuguese
                const formattedDate = (() => {
                  const date = new Date(label);
                  return date.toLocaleDateString('pt-BR', { weekday: 'short', month: 'short', day: 'numeric' });
                })();
                
                return (
                  <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2 border border-gray-200 dark:border-gray-700 rounded shadow">
                    <p className="font-medium">{formattedDate}</p>
                    {payload.map((entry, index) => (
                      <p key={`item-${index}`} className="flex items-center gap-2">
                        <span className="w-3 h-3 inline-block" style={{ backgroundColor: entry.color }}></span>
                        <span>{entry.name}: {Number(entry.value).toLocaleString()} Transactions</span>
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="transactions"
            name="Transactions"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2, fill: "white" }}
            activeDot={{ r: 6, strokeWidth: 0, fill: "#82ca9d" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionPerDay;
