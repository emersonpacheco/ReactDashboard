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

@app.route("/api/data", methods=["GET"])
def get_data():
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('''SELECT 
                            o.id AS order_id, 
                            u.id AS user_id,
                            p.id AS product_id,
                            u.created_at AS user_created_at,
                            o.created_at AS order_created_at,
                            total_amount,
                            p.name AS product_name,
                            p.category AS product_category,
                            quantity,
                            category,
                            status,
                            username,
                            email,
                            password_hash
                            from orders o
                            full outer join users u on o.user_id=u.id
                            full outer join order_items oi on oi.order_id=o.id
                            full outer join products p on oi.product_id=p.id''')
            data = cur.fetchall()
        return jsonify(data)
    except psycopg2.OperationalError as e:
        app.logger.error(f"Connection error: {str(e)}")
        return jsonify({"error": "Database connection failed"}), 503
    except Exception as e:
        app.logger.error(f"Error fetching data: {str(e)}")
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
        
        # Validate that all required fields are provided
        if user_id is None or total_amount is None or status is None:
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
                
            # Insert the order and get the ID
            cur.execute(
                "INSERT INTO orders (user_id, total_amount, status) VALUES (%s, %s, %s) RETURNING id",
                (user_id, total_amount, status)
            )
            order_id = cur.fetchone()["id"]  # Use dictionary access since we're using RealDictCursor
            conn.commit()

            # Get the full order details with user information
            cur.execute(
                """
                SELECT 
                o.id AS order_id, 
                u.id AS user_id,
                p.id AS product_id,
                u.created_at AS user_created_at,
                o.created_at AS order_created_at,
                total_amount,
                p.name AS product_name,
                p.category AS product_category,
                quantity,
                category,
                status,
                username,
                email,
                password_hash
                from orders o
                full outer join users u on o.user_id=u.id
                full outer join order_items oi on oi.order_id=o.id
                full outer join products p on oi.product_id=p.id
                WHERE orders.user_id = %s
                """,
                (user_id,)
            )
            order_data = cur.fetchone()
            
            if order_data is None:
                app.logger.error(f"Order was inserted but could not be retrieved with ID {order_id}")
                return jsonify({"error": "Order was created but could not be retrieved"}), 500

        return jsonify({
            "message": "Order inserted successfully",
            "order": order_data
        }), 201

    except psycopg2.OperationalError as e:
        app.logger.error(f"Connection error: {str(e)}")
        return jsonify({"error": "Database connection failed"}), 503

    except Exception as e:
        app.logger.error(f"Error inserting order: {str(e)}")
        app.logger.error(traceback.format_exc())  # Added traceback for more details
        return jsonify({"error": "Error inserting order", "details": str(e)}), 500

    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)