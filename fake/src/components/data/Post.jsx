import axios from "axios";

const postUser = async (userName, userEmail, password) => {
  try {
    const response = await axios.post("http://localhost:5000/api/users", {
      username: userName,
      email: userEmail,
      password_hash: password,
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return { error: "Error inserting user" };
  }
};

const postOrder = async (userId, totalAmount, status) => {
  try {
    const response = await axios.post("http://localhost:5000/api/orders", {
      user_id: parseInt(userId),
      total_amount: parseFloat(totalAmount),
      status: status,
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return { error: "Error inserting order" };
  }
};

export { postUser, postOrder };
