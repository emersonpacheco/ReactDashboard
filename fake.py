import psycopg2
import random
import string
from faker import Faker
from psycopg2.extras import execute_values

# Initialize Faker
fake = Faker()

# Database connection
conn = psycopg2.connect(
    dbname="my_database",
    user="postgres",
    password="1234",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

# Generate unique usernames
def generate_unique_usernames(n):
    usernames = set()
    while len(usernames) < n:
        usernames.add(fake.user_name())  # Ensures unique usernames
    return list(usernames)

# Generate random users using batch inserts
def insert_users(n=1000):
    users = []
    unique_usernames = generate_unique_usernames(n)  # Get unique usernames
    
    for username in unique_usernames:
        email = fake.unique.email()  # Ensure unique email
        password_hash = ''.join(random.choices(string.ascii_letters + string.digits, k=80))  # 80-char password hash
        users.append((username, email, password_hash))

    query = "INSERT INTO users (username, email, password_hash) VALUES %s RETURNING id;"
    execute_values(cur, query, users)  # Bulk insert
    user_ids = [row[0] for row in cur.fetchall()]
    return user_ids

# Generate random orders using batch inserts
def insert_orders(user_ids, n=2000):
    statuses = ["pending", "completed", "canceled"]
    orders = []

    for _ in range(n):
        user_id = random.choice(user_ids)
        total_amount = round(random.uniform(10, 500), 2)
        status = random.choice(statuses)
        orders.append((user_id, total_amount, status))

    query = "INSERT INTO orders (user_id, total_amount, status) VALUES %s;"
    execute_values(cur, query, orders)  # Bulk insert

# Insert random data
user_ids = insert_users(1000)  # Insert 1000 unique users
insert_orders(user_ids, 2000)  # Insert 2000 orders

# Commit and close
conn.commit()
cur.close()
conn.close()

print("Random users and orders inserted successfully!")
