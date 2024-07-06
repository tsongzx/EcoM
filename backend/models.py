from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime
# from sqlalchemy.orm import sessionmaker
from db import Base
import datetime
from datetime import timezone

# e.g
class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    # full_name: Mapped[Optional[str]]
    # username = Column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    # change to aest?
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(timezone.utc))

# geoffrey to create the models for the rest of tables
# refer to sqlalchemy
class UserList(Base):
    __tablename__ = 'UserLists'
    
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    # removed primary key = True from user_id - can change back (removed it to generate unique id but it might work)
    user_id: Mapped[int] = mapped_column(unique=True, nullable=False)
    list_name: Mapped[str] = mapped_column(String(100), nullable=False)
    # change to aest?
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(timezone.utc))

class List(Base):
    __tablename__ = 'Lists'

    list_id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    company_id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(timezone.utc))

class WatchList(Base):
    __tablename__ = 'WatchList'

    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    user_id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    # change to aest?
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(timezone.utc))
    
class CompanyData(Base):
    __tablename__ = 'CompanyList'
    
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    company_name:Mapped[str] = mapped_column(String(100), nullable=False)
    # TODO: Various other ESG parameters TBD