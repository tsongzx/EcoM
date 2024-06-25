from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base


# Step 2: Establish a database connection
# geoffrey to fill this in!!!
# refer to my old code - prefer use username/password params!!
database_url = 'mysql+pymysql://username:password@host/database_name'
engine = create_engine(database_url)

#will return engine instance
Base = declarative_base()

# definitions are in models.py

# Step 4: Create the database tables
Base.metadata.create_all(engine)


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