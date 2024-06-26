from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime
# from sqlalchemy.orm import sessionmaker
from backend.db import Base
import datetime

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
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(datetime.UTC))

# geoffrey to create the models for the rest of tables
# refer to sqlalchemy
class UserLists(Base):
    __tablename__ = 'UserLists'

    user_id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    list_id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    list_name: Mapped[str] = mapped_column(String(100), nullable=False)
    # change to aest?
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(datetime.UTC))

class Lists(Base):
    __tablename__ = 'Lists'

    list_id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    company_id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(datetime.UTC))
    
class WatchLists(Base):
    __tablename__ = 'WatchLists'

    user_id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    watchlist_id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    watchlist_name: Mapped[str] = mapped_column(String(100), nullable=False)
    # change to aest?
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(datetime.UTC))
    
class CompanyData(Base):
    __tablename__ = 'CompanyList'
    
    company_id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    company_name:Mapped[str] = mapped_column(String(100), nullable=False)
    # TODO: Various other ESG parameters TBD