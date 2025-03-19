import { useState, useEffect } from 'react';

const useData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchData = async () => {
    try {
      const [ordersRes, usersRes, orderItemsRes, productsRes] = await Promise.all([
        fetch('http://localhost:5000/api/get_orders'),
        fetch('http://localhost:5000/api/get_users'),
        fetch('http://localhost:5000/api/get_order_items'),
        fetch('http://localhost:5000/api/get_products'),
      ]);

      if (!ordersRes.ok || !usersRes.ok || !orderItemsRes.ok || !productsRes.ok) {
        throw new Error('One or more requests failed');
      }

      const [ordersData, usersData, orderItemsData, productsData] = await Promise.all([
        ordersRes.json(),
        usersRes.json(),
        orderItemsRes.json(),
        productsRes.json(),
      ]);

      setOrders(ordersData);
      setUsers(usersData);
      setOrderItems(orderItemsData);
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    loading,
    error,
    orders,
    fetchOrders: fetchData,
    users,
    orderItems,
    products,
  };
};

export default useData;
