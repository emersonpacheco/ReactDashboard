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

const postOrder = async (orderData) => {
  try {
    const { userId, totalAmount, status, products, updatedStock } = orderData;

    if (!products || products.length === 0) {
      return { error: "Order must include at least one product" };
    }

    const orderResponse = await axios.post("http://localhost:5000/api/orders", {
      user_id: parseInt(userId),
      total_amount: parseFloat(totalAmount),
      status: status,
      products: products.map(product => ({
        product_id: product.product_id,
        quantity: product.quantity
      })),
      updated_stock: updatedStock
    });

    return { order: orderResponse.data, success: true };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Error creating order" };
  }
};

export { postUser, postOrder };
