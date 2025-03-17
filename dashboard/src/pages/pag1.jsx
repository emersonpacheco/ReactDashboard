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
  const { data, setData, loading, error } = useData();
  const [showUserModal, setShowUserModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDrawer, setShowUserDrawer] = useState(false);
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("username");
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

  // Get unique users from data - modified to include all users even if they have no orders
  const getUniqueUsers = () => {
    const users = {};
    
    data.forEach(item => {
      if (item.user_id) {
        if (!users[item.user_id]) {
          users[item.user_id] = {
            user_id: item.user_id,
            username: item.username || 'Unknown',
            email: item.email || 'No email',
            user_created_at: item.user_created_at
          };
        }
      }
    });
    
    return Object.values(users);
  };

  // Get orders for a specific user
  const getUserOrders = (userId) => {
    const uniqueOrders = new Map();

    data.forEach(item => {
        if (
            item.user_id === userId && 
            item.total_amount !== undefined && 
            item.total_amount !== "[null]"
        ) {
            const orderKey = item.order_id || item.id;
            
            if (orderKey && !uniqueOrders.has(orderKey)) {
                uniqueOrders.set(orderKey, {
                    order_id: orderKey,
                    user_id: item.user_id,
                    username: item.username,
                    email: item.email,
                    total_amount: item.total_amount,
                    status: item.status,
                    order_created_at: item.order_created_at
                });
            }
        }
    });

    return Array.from(uniqueOrders.values());
};

  // Calculate total spent for a user
  const getUserTotalSpent = (userId) => {
    const userOrders = getUserOrders(userId);
    return userOrders.reduce(
      (sum, order) => sum + (parseFloat(order.total_amount) || 0), 
      0
    );
  };

  // Filter and sort users based on search term, search type, and sort settings
  const getFilteredAndSortedUsers = () => {
    let filteredUsers = getUniqueUsers().filter(user => {
      // Skip if user is missing required properties
      if (!user) return false;

      switch (searchType) {
        case "username":
          return user.username && 
            user.username.toLowerCase().includes(searchTerm.toLowerCase());
        case "total_spent":
          const totalSpent = getUserTotalSpent(user.user_id);
          // Check if search term is a valid number to compare
          const searchAmount = parseFloat(searchTerm);
          if (isNaN(searchAmount)) return true; // Show all if search is not a valid number
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
    
    // Sort the filtered users
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
          valueA = getUserTotalSpent(a.user_id);
          valueB = getUserTotalSpent(b.user_id);
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
      
      // Reverse for descending order
      return sortDirection === "asc" ? comparison : -comparison;
    });
  };

  // Filter users based on search term
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
  const [orderUserId, setOrderUserId] = useState("");
  const [orderTotalAmount, setOrderTotalAmount] = useState("");
  const [orderStatus, setOrderStatus] = useState("pending");
  const [orderResponse, setOrderResponse] = useState("");
  const [orderAlertVisible, setOrderAlertVisible] = useState(false);

  const handleCreateOrder = async () => {
    const result = await postOrder(orderUserId, orderTotalAmount, orderStatus);
    console.log("Order creation result:", result);
    setOrderResponse(result);
    
    // Add the new order to the data if successful
    if (result.order) {
      setData([...data, result.order]);
      
      // Clear form fields after successful creation
      setOrderUserId("");
      setOrderTotalAmount("");
      setOrderStatus("pending");
      setShowOrderModal(false);
      setOrderAlertVisible(true);
      
      // Hide alert after 3 seconds
      setTimeout(() => {
        setOrderAlertVisible(false);
      }, 3000);
    }
  };

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
      showOrderModal = {showOrderModal}
      setShowOrderModal =  {setShowOrderModal}
      orderUserId = {orderUserId}
      setOrderUserId =  {setOrderUserId}
      orderTotalAmount =  {orderTotalAmount}
      setOrderTotalAmount =  {setOrderTotalAmount}
      orderStatus =  {orderStatus}
      setOrderStatus =  {setOrderStatus}
      handleCreateOrder =  {handleCreateOrder}
      orderResponse =  {orderResponse}
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
      filteredUsers = {filteredUsers}
      getUserOrders = {getUserOrders}
      handleUserClick = {handleUserClick}
      formatDate = {formatDate}
      />

      {/* User Orders Drawer - Make sure you update UserDrawer component to handle no orders case */}
      {showUserDrawer && 
      <UserDrawer selectedUser = {selectedUser}
      showUserDrawer = {showUserDrawer}
      handleCloseDrawer = {handleCloseDrawer} 
      getUserOrders = {getUserOrders}/>
      }
    </div>
  );
};



export default Page1;