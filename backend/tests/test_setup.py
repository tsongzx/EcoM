
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.main import app, get_session
from src.db import Base

# Setup for the test database
username = 'admin'
password = 'crumpeteers'
host = 'crumpeteers.chg60uma2isb.ap-southeast-2.rds.amazonaws.com'
database_name = 'crumpeteers'
database_url = f'mysql+pymysql://{username}:{password}@{host}/{database_name}'

# turn on echo to see SQL statements that SQLAlchemy sends to your database.
# turn off when in production
engine = create_engine(database_url, pool_pre_ping=True, echo=True)  
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the database tables
Base.metadata.create_all(engine)

# Dependency override for testing
def override_get_session():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_session] = override_get_session

