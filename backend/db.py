from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Step 2: Establish a database connection

# https://stackoverflow.com/questions/10770377/how-to-create-db-in-mysql-with-sqlalchemy

# usin pymysql driver
# database_url = 'mysql+pymysql://username:password@host/database_name'

# usin default driver - mysqlclient
username = 'root'
password = ''
host = 'local_host'
database_name = 'crumpeteers'
engine_url = f'mysql://{username}:{password}@{host}'
database_url = f'{engine_url}/{database_name}'
engine = create_engine(engine_url)  

# Query to create db if it does not already exist
engine.execute(f'CREATE DATABASE IF NOT EXISTS {database_name}')

# Use db - return engine instance
db_engine = create_engine(database_url)
# OR: engine.execute("USE dbname") # select new db

Base = declarative_base()

# Create session local class for session maker
SessionLocal = sessionmaker(bind=db_engine, expire_on_commit=False) 

# Step 4: Create the database tables
Base.metadata.create_all(db_engine)


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