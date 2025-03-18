import { useState, useEffect } from 'react';

const useData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [products, setProducts] = useState([]);

  // Function to fetch general data
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/data');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch orders
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/get_orders');
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      setOrders(await response.json());
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/get_users');
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      setUsers(await response.json());
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // Function to fetch order items
  const fetchOrderItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/get_order_items');
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      setOrderItems(await response.json());
    } catch (err) {
      console.error('Error fetching order items:', err);
    }
  };

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/get_products');
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      setProducts(await response.json());
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  // Run fetchData on mount
  useEffect(() => {
    fetchData();
    fetchOrders();
    fetchUsers();
    fetchProducts();
    fetchOrderItems();
  }, []);

  return { 
    data, setData, loading, error, 
    orders, fetchOrders, 
    users, fetchUsers, 
    orderItems, fetchOrderItems, 
    products, fetchProducts 
  };
};

export default useData;
