import psycopg2

# Database connection details

# Product data
products = [
    (1, "Wireless Mouse", "Electronics", 25.99, 120),
    (2, "Mechanical Keyboard", "Electronics", 89.99, 75),
    (3, "USB-C Charger", "Electronics", 15.99, 200),
    (4, "Laptop Stand", "Office", 34.99, 50),
    (5, "Noise-Canceling Headphones", "Electronics", 129.99, 30),
    (6, "Yoga Mat", "Fitness", 22.99, 80),
    (7, "Running Shoes", "Footwear", 55.99, 60),
    (8, "Bluetooth Speaker", "Electronics", 49.99, 90),
    (9, "Smartwatch", "Wearable Tech", 199.99, 40),
    (10, "Gaming Chair", "Furniture", 189.99, 20),
    (11, "Coffee Maker", "Kitchen", 79.99, 110),
    (12, "Air Fryer", "Kitchen", 99.99, 50),
    (13, "LED Desk Lamp", "Office", 27.99, 85),
    (14, "Power Bank 20000mAh", "Electronics", 39.99, 150),
    (15, "DSLR Camera", "Photography", 549.99, 15),
    (16, "Hiking Backpack", "Outdoor", 64.99, 40),
    (17, "Adjustable Dumbbells", "Fitness", 129.99, 35),
    (18, "Graphic Tablet", "Electronics", 219.99, 25),
    (19, "4K Monitor", "Electronics", 299.99, 30),
    (20, "VR Headset", "Gaming", 399.99, 10),
    (21, "Electric Toothbrush", "Personal Care", 49.99, 95),
    (22, "Beard Trimmer", "Personal Care", 29.99, 120),
    (23, "Smart Light Bulb", "Home Automation", 19.99, 140),
    (24, "Home Security Camera", "Home Automation", 89.99, 55),
    (25, "Portable Projector", "Electronics", 249.99, 20),
]

# Connect to PostgreSQL
try:
    conn = psycopg2.connect(
        dbname="my_database",
        user="postgres",
        password="1234",
        host="localhost",
        port="5432"
    )
    cur = conn.cursor()

    # Create table if it doesn't exist
    create_table_query = """
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock INTEGER NOT NULL
    );
    """
    cur.execute(create_table_query)
    conn.commit()

    # Insert products
    insert_query = """
    INSERT INTO products (id, name, category, price, stock)
    VALUES (%s, %s, %s, %s, %s)
    ON CONFLICT (id) DO NOTHING;
    """
    cur.executemany(insert_query, products)
    conn.commit()

    print("Data inserted successfully.")

except Exception as e:
    print("Error:", e)

finally:
    if conn:
        cur.close()
        conn.close()
