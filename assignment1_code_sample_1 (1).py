import os
import re
import pymysql
from urllib.request import urlopen

# OWASP A07/A02
db_config = {
    'host': os.getenv('DB_HOST', 'mydatabase.com'),
    'user': os.getenv('DB_USER', 'admin'),
    'password': os.getenv('DB_PASSWORD'),  # set in repo/Actions env
}

# OWASP A04
def get_user_input():
    name = input('Enter your name: ')
    if not re.fullmatch(r"[A-Za-z\s]{1,50}", name):
        raise ValueError("Invalid name format")
    return name

# OWASP A03
def send_email(to, subject, body):
    # Proper way: use smtplib or subprocess without shell.
    print(f"[safe-email] to={to}, subject={subject}, body_len={len(body)}")
    
# OWASP A02
def get_data():
    url = 'https://secure-api.example.com/get-data'
    with urlopen(url, timeout=5) as resp:
        data = resp.read().decode('utf-8', errors='ignore')
    return data

# OWASP A03
def save_to_db(data):
    query = "INSERT INTO mytable (column1, column2) VALUES (%s, %s)"

    # import pymysql
    # connection = pymysql.connect(**db_config)
    # with connection.cursor() as cursor:
    #     cursor.execute(query, (data, "Another Value"))  
    # connection.commit()
    # connection.close()

if __name__ == '__main__':
    user_input = get_user_input()
    data = get_data()
    save_to_db(data)
    send_email('admin@example.com', 'User Input', user_input)
