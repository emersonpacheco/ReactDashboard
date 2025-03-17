import React from "react";
import useData from '../components/data/data';
import Cards from "../components/pages/page2/Cards";
import SalesPerDayChart from "../components/pages/page2/SalesperDayChart";
import TransactionperDay from "../components/pages/page2/TransactionperDay";
import BarCategory from "../components/pages/page2/barCategory"

const Dashboard = () => {
    const { data, loading, error } = useData();

    // Calculate overall total sales (only for completed orders)
    const totalAmount = data ? data
        .filter(item => item.status === "completed") // Check status
        .reduce((sum, item) => sum + (parseFloat(item.total_amount) || 0), 0) 
        : 0;
    const formattedTotal = totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Calculate unique users
    const uniqueUsers = data ? new Set(data.map(item => item.user_id)).size : 0;
    const formattedUniqueUsers = uniqueUsers.toLocaleString('en-US');

    // Calculate percentage of completed orders
    const validStatuses = data ? data.filter(item => item.status !== null) : [];
    const totalValidStatuses = validStatuses.length;
    const completedCount = validStatuses.filter(item => item.status === "completed").length;
    const completedPercentage = totalValidStatuses > 0 ? ((completedCount / totalValidStatuses) * 100).toFixed(2) : "0.00";

    // Calculate sales for today using 'order_created_at' (only for completed orders)
    const today = new Date();
    const salesToday = data ? data
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
            <div className="flex justify-evenly mt-5">
                <Cards value={formattedUniqueUsers} head={"Total Users"} st={"Active Users"} />
                <Cards value={`$ ${formattedTotal}`} head={"Total Sales"} st={"Updated just now"} />
                <Cards value={`${completedPercentage} %`} head={"Completed Orders"} st={"Decreased"} />
                <Cards value={`$ ${formattedTodaySales}`} head={"Sales Today"} st={"Updated just now"} />
            </div>
            <div className="flex w-full justify-center gap-7 ">
                <div className="w-209">
                    <SalesPerDayChart />
                </div>
                <div className="w-209">
                    <TransactionperDay />
                </div>
            </div>
            <div className="ml-12 w-424 justify-around mt-5 mb-10">
                <BarCategory/>
            </div>
        </div>
    );
}

export default Dashboard;
