import React, { useState, useEffect } from 'react';
import useData from '../components/data/data';
import { postOrder, postUser } from '../components/data/Post';
import UserDrawer from '../components/pages/page1/UserDrawer';
import UserModal from '../components/pages/page1/UserModal';
import OrderModal from '../components/pages/page1/OrderModal';
import UserGrid from '../components/pages/page1/UserGrid';
import UserFilters from '../components/pages/page1/UserFilters';
import TitleandButtons from '../components/pages/page1/TitleandButtons';
import Loading from '../components/pages/page1/Loading';

const Page1 = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("username"); // Options: username, total_spent, created_at
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDrawer, setShowUserDrawer] = useState(false);
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("username");
  const {
    loading,
    error,
    orders,
    users,
    orderItems,
    products,
    } = useData();
  // Helper function to format date

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return 'Invalid date';
    }
  };
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchTerm("");
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle sort direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to ascending
      setSortBy(field);
      setSortDirection("asc");
    }
  };


// Get orders for a specific user from the orders array
const getUniqueUsers = () => {
  const usersDic = {};

  users.forEach(user => {
    if (user.user_id && !usersDic[user.user_id]) {
      usersDic[user.user_id] = {
        user_id: user.user_id,
        username: user.username || 'Unknown',
        email: user.email || 'No email',
        user_created_at: user.user_created_at,
      };
    }
  });

  return Object.values(usersDic);
};

const getUserOrders = (orders, userId) => {
  const ordersArray = Array.isArray(orders) ? orders : Object.values(orders);
  const uniqueOrders = new Map();

  ordersArray.forEach(order => {
    if (
      Number(order.user_id) === Number(userId) &&
      order.total_amount !== undefined &&
      order.total_amount !== "[null]"
    ) {
      const orderKey = order.order_id || order.id;
      if (orderKey && !uniqueOrders.has(orderKey)) {
        uniqueOrders.set(orderKey, {
          order_id: orderKey,
          user_id: order.user_id,
          status: order.status,
          total_amount: parseFloat(order.total_amount) || 0,
          order_created_at: order.order_created_at
        });
      }
    }
  });

  return Array.from(uniqueOrders.values());
};

const getUserTotalSpent = (orders, userId) => {
  const userOrders = getUserOrders(orders, userId);
  return userOrders.reduce((sum, order) => sum + order.total_amount, 0);
};

// Filter and sort users based on search term, search type, and sort settings
const getFilteredAndSortedUsers = () => {
  // Filter unique users based on the search criteria
  let filteredUsers = getUniqueUsers(users).filter(user => {
    if (!user) return false;

    switch (searchType) {
      case "username":
        return user.username &&
          user.username.toLowerCase().includes(searchTerm.toLowerCase());
      case "total_spent":
        // Pass orders as first argument, then the user ID
        const totalSpent = getUserTotalSpent(orders, user.user_id);
        const searchAmount = parseFloat(searchTerm);
        if (isNaN(searchAmount)) return true;
        return totalSpent >= searchAmount;
      case "created_at":
        if (!user.user_created_at) return false;
        try {
          const userDate = new Date(user.user_created_at).toLocaleDateString();
          return userDate.includes(searchTerm);
        } catch (e) {
          return false;
        }
      default:
        return true;
    }
  });

  // Sort the filtered users based on the sort criteria
  return filteredUsers.sort((a, b) => {
    let comparison = 0;
    let valueA, valueB;

    switch (sortBy) {
      case "username":
        valueA = a.username || "";
        valueB = b.username || "";
        comparison = valueA.localeCompare(valueB);
        break;
      case "total_spent":
        // Again, pass orders to properly calculate each user's total spent
        valueA = getUserTotalSpent(orders, a.user_id);
        valueB = getUserTotalSpent(orders, b.user_id);
        comparison = valueA - valueB;
        break;
      case "created_at":
        valueA = a.user_created_at ? new Date(a.user_created_at) : new Date(0);
        valueB = b.user_created_at ? new Date(b.user_created_at) : new Date(0);
        comparison = valueA - valueB;
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });
};

// Finally, use the filtered users
const filteredUsers = getFilteredAndSortedUsers();

  // States for creating a user
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [userAlertVisible, setUserAlertVisible] = useState(false);

  const handleCreateUser = async () => {
    const result = await postUser(newUserName, newUserEmail, newUserPassword);
    setUserResponse(result);
    if(result.message){
      setShowUserModal(false);
      setUserAlertVisible(true)
      setTimeout(() => {
        setUserAlertVisible(false);
      }, 3000);
    }
  };

// States for creating an order
const [orderResponse, setOrderResponse] = useState("");
const [orderAlertVisible, setOrderAlertVisible] = useState(false);
const [showOrderModal, setShowOrderModal] = useState(false);



  // Open user drawer with orders
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserDrawer(true);
  };

  // Close user drawer
  const handleCloseDrawer = () => {
    setShowUserDrawer(false);
    setSelectedUser(null);
  };

  // Helper function to render sort icons
  const renderSortIcon = (field) => {
    if (sortBy !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortDirection === "asc" ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    );
  };

  return (
    <div className="p-5 ml-15 mr-15 mx-auto">
      {/* Toast/Alert Messages */}
      <TitleandButtons
      userAlertVisible = {userAlertVisible}
      userResponse = {userResponse}
      orderAlertVisible = {orderAlertVisible}
      orderResponse = {orderResponse}
      setShowUserModal = {setShowUserModal}
      setShowOrderModal = {setShowOrderModal}
      />

      {/* User Creation Modal */}
      {showUserModal && 
      <UserModal
      showUserModal =  {showUserModal}
      setShowUserModal = {setShowUserModal}
      newUserName = {newUserName}
      setNewUserName = {setNewUserName}
      newUserEmail = {newUserEmail}
      setNewUserEmail = {setNewUserEmail}
      newUserPassword = {newUserPassword}
      setNewUserPassword = {setNewUserPassword}
      handleCreateUser = {handleCreateUser}
      userResponse = {userResponse}
      />
      }
      {/* Order Creation Modal */}
      {showOrderModal && 
      <OrderModal
      showOrderModal={showOrderModal}
      setShowOrderModal={setShowOrderModal}
      users={users}
      products={products}
      postOrder={postOrder}
      />
      }
      {/* Advanced Search and Sort Controls */}
      <UserFilters
      searchType = {searchType}
      searchTerm = {searchTerm}
      sortBy = {sortBy}
      handleSearchTypeChange = {handleSearchTypeChange}
      handleInputChange = {handleInputChange}
      handleSort = {handleSort}
      renderSortIcon = {renderSortIcon}
      />

      {/* Loading state */}
      <Loading
      loading = {loading}
      erroe = {error}
      />

      {/* Users Grid */}
      <UserGrid
        filteredUsers={filteredUsers}
        orders={orders}
        getUserOrders={getUserOrders}
        handleUserClick={handleUserClick}
        formatDate={formatDate}
        getUserTotalSpent={getUserTotalSpent}
      />

      {/* User Orders Drawer - Make sure you update UserDrawer component to handle no orders case */}
      {showUserDrawer && 
      <UserDrawer selectedUser = {selectedUser}
      showUserDrawer = {showUserDrawer}
      handleCloseDrawer = {handleCloseDrawer} 
      getUserOrders = {getUserOrders}
      orders= {orders}
      />
      }
    </div>
  );
};



export default Page1;