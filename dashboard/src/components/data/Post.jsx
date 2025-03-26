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
      products: products.map((product) => ({
        product_id: product.product_id,
        quantity: product.quantity,
      })),
      updated_stock: updatedStock,
    });

    return { order: orderResponse.data, success: true };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Error creating order" };
  }
};

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await axios.patch("http://localhost:5000/api/orders/status", {
      order_id: orderId,
      new_status: newStatus,
    });
    return { order: response.data, success: true };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Error updating order status" };
  }
};

const postUpdateStock = async (productId, updatedStock) => {
  try {
    const response = await axios.post("http://localhost:5000/api/products/stock", {
      product_id: productId,
      updated_stock: updatedStock
    });
    return { product: response.data, success: true };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Error updating product stock" };
  }
};


export { postUser, postOrder, updateOrderStatus, postUpdateStock };