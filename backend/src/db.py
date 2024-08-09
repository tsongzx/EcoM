from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base

import logging
logger = logging.getLogger()

# Establish a database connection

username = 'admin'
password = 'crumpeteers'
host = 'crumpeteers.chg60uma2isb.ap-southeast-2.rds.amazonaws.com'
database_name = 'crumpeteers'
database_url = f'mysql+pymysql://{username}:{password}@{host}/{database_name}'

# turn on echo to see SQL statements that SQLAlchemy sends to your database.
# turn off when in production
engine = create_engine(database_url, pool_pre_ping=True, echo=True)  

Base = declarative_base()

# Create session local class for session maker
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False) 