from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import database_exists, create_database

import logging
logger = logging.getLogger()

# Step 2: Establish a database connection

# https://stackoverflow.com/questions/10770377/how-to-create-db-in-mysql-with-sqlalchemy

# usin pymysql driver
# database_url = 'mysql+pymysql://username:password@host/database_name'

# usin default driver - mysqlclient
username = 'root'
password = ''
host = 'localhost' # or use IP address
database_name = 'crumpeteers'
database_url = f'mysql://{username}:{password}@{host}/{database_name}'
if not database_exists(database_url):
    logger.info("creating db")
    create_database(database_url)

# turn on echo to see SQL statements that SQLAlchemy sends to your database.
# turn off when in production
engine = create_engine(database_url, pool_pre_ping=True, echo=True)  

# Query to create db if it does not already exist
# with engine.connect() as conn:
#     stmt = f'CREATE DATABASE IF NOT EXISTS {database_name}'
#     result = conn.execute(stmt)

Base = declarative_base()

# Create session local class for session maker
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False) 


# IDEALLY I THINK OPEN CONNECTION AND CLOSE CONNECTION EACH TIME
# example usage
# Step 5: Insert data into the database
# Session = sessionmaker(bind=engine)
# session = Session()

# # Example: Inserting a new user into the database
# new_user = User(username='Sandy', email='sandy@gmail.com', password='cool-password')
# session.add(new_user)
# session.commit()

# # Step 6: Query data from the database
# # Example: Querying all users from the database
# all_users = session.query(User).all()

# # Example: Querying a specific user by their username
# user = session.query(User).filter_by(username='Sandy').first()

# # Step 7: Close the session
# session.close()