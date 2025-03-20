import random
import psycopg2

# Database connection details
DB_CONFIG = {
    "dbname": "my_database",
    "user": "postgres",
    "password": "1234",
    "host": "localhost",
    "port": "5432"
}

def get_existing_order_ids(conn):
    """Retrieve all existing order IDs from the orders table."""
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM orders;")
        return [row[0] for row in cur.fetchall()]

def insert_order_items(conn, num_entries=100):
    """Ensure each order has at least one item, then insert additional random items."""
    order_ids = get_existing_order_ids(conn)
    if not order_ids:
        print("No existing order IDs found. Exiting.")
        return
    
    with conn.cursor() as cur:
        # Ensure every order has at least one item
        for order_id in order_ids:
            product_id = random.randint(1, 25)
            quantity = random.randint(1, 10)
            cur.execute(
                "INSERT INTO order_items (order_id, product_id, quantity) VALUES (%s, %s, %s);",
                (order_id, product_id, quantity)
            )

        # Insert additional random order items
        for _ in range(num_entries):
            order_id = random.choice(order_ids)
            product_id = random.randint(1, 25)
            quantity = random.randint(1, 10)
            cur.execute(
                "INSERT INTO order_items (order_id, product_id, quantity) VALUES (%s, %s, %s);",
                (order_id, product_id, quantity)
            )

    conn.commit()
    print(f"Ensured all orders have at least one item and inserted {num_entries} additional order items.")

if __name__ == "__main__":
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        insert_order_items(conn, num_entries=100)
    except Exception as e:
        print("Error:", e)
    finally:
        if conn:
            conn.close()
