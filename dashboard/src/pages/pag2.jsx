import React from "react";
import useData from '../components/data/data';
import Cards from "../components/pages/page2/Cards";
import SalesPerDayChart from "../components/pages/page2/SalesperDayChart";
import TransactionperDay from "../components/pages/page2/TransactionperDay";
import BarCategory from "../components/pages/page2/barCategory"

const Dashboard = () => {
    const {
        setData,
        loading,
        error,
        orders,
        users,
        orderItems,
        products,
        } = useData();

// Calculate overall total sales (only for completed orders)
    const totalAmount = orders ? orders
        .filter(item => item.status === "completed") // Check status
        .reduce((sum, item) => sum + (parseFloat(item.total_amount) || 0), 0) 
        : 0;
    const formattedTotal = totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Calculate unique users
    const uniqueUsers = users ? new Set(users.map(item => item.user_id)).size : 0;
    const formattedUniqueUsers = uniqueUsers.toLocaleString('en-US');

    // Calculate percentage of completed orders
    const validStatuses = orders ? orders.filter(item => item.status !== null) : [];
    const totalValidStatuses = validStatuses.length;
    const completedCount = validStatuses.filter(item => item.status === "completed").length;
    const completedPercentage = totalValidStatuses > 0 ? ((completedCount / totalValidStatuses) * 100).toFixed(2) : "0.00";

    // Calculate sales for today using 'order_created_at' (only for completed orders)
    const today = new Date();
    const salesToday = orders ? orders
        .filter(item => {
            const itemDate = new Date(item.order_created_at);
            return item.status === "completed" && // Check status
                   itemDate.getDate() === today.getDate() &&
                   itemDate.getMonth() === today.getMonth() &&
                   itemDate.getFullYear() === today.getFullYear();
        })
        .reduce((sum, item) => sum + (parseFloat(item.total_amount) || 0), 0) 
        : 0;
    const formattedTodaySales = salesToday.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div>
            <div className="p-5 ml-15 mr-15 mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        </div>
        </div>
            {/* Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center gap-0 ml-19 mr-19">
                <Cards value={formattedUniqueUsers} head="Total Users" st="Active Users" />
                <Cards value={`$ ${formattedTotal}`} head="Total Sales" st="Updated just now" />
                <Cards value={`${completedPercentage} %`} head="Completed Orders" st="Decreased" />
                <Cards value={`$ ${formattedTodaySales}`} head="Sales Today" st="Updated just now" />
            </div>
    
            {/* Charts Section */}
            <div className="flex flex-wrap justify-center gap-7 mt-0">
                <div className="w-full md:w-full lg:w-4/9 h-[400px]">
                    <SalesPerDayChart />
                </div>
                <div className="w-full md:w-full lg:w-4/9 h-[400px]">
                    <TransactionperDay />
                </div>
            </div>
    
            {/* Bar Chart Section */}
            <div className="w-full lg:w-[85%] xl:w-[90%] max-w-[112rem] mx-auto mt-30">
                <BarCategory />
            </div>
        </div>
    );
}

export default Dashboard;
