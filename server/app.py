from flask import Flask, jsonify, request
import psycopg2
from psycopg2.extras import RealDictCursor
from flask_cors import CORS
import os
import traceback  # Added for better error logging

app = Flask(__name__)
CORS(app)

def get_db_connection():
    database_url = os.getenv('DATABASE_URL')
    if database_url:
        return psycopg2.connect(database_url, connect_timeout=5)
    else:
        return psycopg2.connect(
            host="localhost",
            port="5432",
            database="my_database",
            user="postgres",
            password="1234",
            connect_timeout=5
        )

@app.route("/api/get_orders", methods=["GET"])
def get_orders():
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Explicitly list all columns from orders.
            # Replace/add columns if necessary.
            query = """
                SELECT 
                    id AS order_id,
                    user_id,
                    status,
                    created_at as order_created_at,
                    total_amount
                FROM orders
            """
            cur.execute(query)
            orders = cur.fetchall()
        return jsonify(orders)
    except psycopg2.OperationalError as e:
        app.logger.error(f"Connection error: {str(e)}")
        return jsonify({"error": "Database connection failed"}), 503
    except Exception as e:
        app.logger.error(f"Error fetching orders: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        if conn:
            conn.close()

# GET users with alias for the id
@app.route("/api/get_users", methods=["GET"])
def get_users():
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Adjust the column list based on your users table
            query = """
                SELECT 
                    id AS user_id,
                    username,
                    email,
                    password_hash,
                    created_at as user_created_at
                FROM users
            """
            cur.execute(query)
            users = cur.fetchall()
        return jsonify(users)
    except psycopg2.OperationalError as e:
        app.logger.error(f"Connection error: {str(e)}")
        return jsonify({"error": "Database connection failed"}), 503
    except Exception as e:
        app.logger.error(f"Error fetching users: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        if conn:
            conn.close()

# GET order_items with alias for the id
@app.route("/api/get_order_items", methods=["GET"])
def get_order_items():
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Adjust the column list based on your order_items table.
            # Here, we assume order_items has an id, order_id, product_id, quantity, and price.
            query = """
                SELECT 
                    id AS order_item_id,
                    order_id,
                    product_id,
                    quantity
                FROM order_items
            """
            cur.execute(query)
            order_items = cur.fetchall()
        return jsonify(order_items)
    except psycopg2.OperationalError as e:
        app.logger.error(f"Connection error: {str(e)}")
        return jsonify({"error": "Database connection failed"}), 503
    except Exception as e:
        app.logger.error(f"Error fetching order items: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        if conn:
            conn.close()

# GET products with alias for the id
@app.route("/api/get_products", methods=["GET"])
def get_products():
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Adjust the column list based on your products table.
            query = """
                SELECT 
                    id AS product_id,
                    name,
                    category,
                    price,
                    stock
                FROM products
            """
            cur.execute(query)
            products = cur.fetchall()
        return jsonify(products)
    except psycopg2.OperationalError as e:
        app.logger.error(f"Connection error: {str(e)}")
        return jsonify({"error": "Database connection failed"}), 503
    except Exception as e:
        app.logger.error(f"Error fetching products: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        if conn:
            conn.close()

@app.route("/api/users", methods=["POST"])
def insert_user():
    conn = None
    try:
        data = request.json
        username = data.get("username")
        email = data.get("email")
        password_hash = data.get("password_hash")  # Receive the hashed password

        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id",
                (username, email, password_hash),
            )
            
            conn.commit()


        return jsonify({"message": "User inserted successfully"}), 201
    except psycopg2.OperationalError as e:
        app.logger.error(f"Connection error: {str(e)}")
        return jsonify({"error": "Database connection failed"}), 503
    except Exception as e:
        app.logger.error(f"Error inserting user: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": "Error inserting user"}), 500
    finally:
        if conn:
            conn.close()


@app.route("/api/orders", methods=["POST"])
def insert_order():
    conn = None
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        user_id = data.get("user_id")
        total_amount = data.get("total_amount")
        status = data.get("status")
        products = data.get("products")  
        updated_stock = data.get("updated_stock")  # Stock updates received

        # Validate required fields
        if user_id is None or total_amount is None or status is None or products is None or updated_stock is None:
            return jsonify({"error": "Missing required fields"}), 400
            
        # Validate data types
        try:
            user_id = int(user_id)
            total_amount = float(total_amount)
        except (ValueError, TypeError) as e:
            return jsonify({"error": f"Invalid data types: {str(e)}"}), 400
        
        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Check if user exists
            cur.execute("SELECT id FROM users WHERE id = %s", (user_id,))
            if not cur.fetchone():
                return jsonify({"error": f"User with ID {user_id} does not exist"}), 404
                
            # Insert the order and get its ID
            cur.execute(
                "INSERT INTO orders (user_id, total_amount, status) VALUES (%s, %s, %s) RETURNING id",
                (user_id, total_amount, status)
            )
            order_id = cur.fetchone()["id"]  
            
            # Insert order items
            for product in products:
                product_id = product.get("product_id")
                quantity = product.get("quantity")

                if product_id is None or quantity is None:
                    return jsonify({"error": "Missing product details"}), 400

                cur.execute(
                    "INSERT INTO order_items (order_id, product_id, quantity) VALUES (%s, %s, %s)",
                    (order_id, product_id, quantity)
                )

            # Update stock levels
            for stock in updated_stock:
                product_id = stock.get("product_id")
                new_stock = stock.get("new_stock")

                if product_id is None or new_stock is None:
                    return jsonify({"error": "Missing stock update details"}), 400

                cur.execute(
                    "UPDATE products SET stock = %s WHERE id = %s",
                    (new_stock, product_id)
                )

            conn.commit()

            return jsonify({
                "message": "Order inserted successfully, stock updated",
                "order_id": order_id
            }), 201

    except Exception as e:
        if conn:
            conn.rollback()  # Rollback in case of failure
        app.logger.error(f"Error inserting order: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

    finally:
        if conn:
            conn.close()

@app.route("/api/orders/status", methods=["PATCH"])
def update_order_status():
    conn = None
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        order_id = data.get("order_id")
        new_status = data.get("new_status")
        if order_id is None or new_status is None:
            return jsonify({"error": "Missing order_id or new_status"}), 400

        try:
            order_id = int(order_id)
        except (ValueError, TypeError):
            return jsonify({"error": "order_id must be an integer"}), 400

        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Verify the order exists
            cur.execute("SELECT id FROM orders WHERE id = %s", (order_id,))
            if not cur.fetchone():
                return jsonify({"error": f"Order with ID {order_id} does not exist"}), 404

            # Update the order status
            cur.execute("UPDATE orders SET status = %s WHERE id = %s", (new_status, order_id))
            conn.commit()

            return jsonify({
                "message": "Order status updated successfully",
                "order_id": order_id,
                "new_status": new_status
            }), 200

    except Exception as e:
        if conn:
            conn.rollback()
        app.logger.error(f"Error updating order status: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
