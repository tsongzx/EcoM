from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, Enum
# from sqlalchemy.orm import sessionmaker
from db import Base
import datetime
from datetime import timezone
from typing import Literal, get_args

Disclosure = Literal["CALCULATED", "ADJUSTED", "ESTIMATED", "REPORTED", "IMPUTED"]
Data_Type = Literal["float", "int"]
Pillar = Literal["E", "S", "G"]

# e.g
class User(Base):
    __tablename__ = 'Users'

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
    
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False, autoincrement=False)
    user_id: Mapped[int] = mapped_column(unique=False, nullable=False)
    list_name: Mapped[str] = mapped_column(String(100), nullable=False)
    # change to aest?
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(timezone.utc))

class List(Base):
    __tablename__ = 'List'

    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    list_id: Mapped[int] = mapped_column(unique=False, nullable=False)
    company_id: Mapped[int] = mapped_column(unique=False, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(timezone.utc))

class WatchList(Base):
    __tablename__ = 'WatchList'

    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    user_id: Mapped[int] = mapped_column(unique=True, nullable=False)
    # change to aest?
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(timezone.utc))
    
class CompanyData(Base):
    __tablename__ = 'CompanyList'
   
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False, autoincrement=True)
    company_name: Mapped[str] = mapped_column(String(200), nullable=False)
    perm_id: Mapped[str] = mapped_column(String(100), nullable=False) 
    data_type: Mapped[Data_Type] = mapped_column(Enum(
      *get_args(Data_Type),
      name="data_type",
      create_constraint=True,
      validate_strings=True,
    ))
    disclosure: Mapped[Disclosure] = mapped_column(Enum(
      *get_args(Disclosure),
      name="disclosure",
      create_constraint=True,
      validate_strings=True,
    ))
    metric_description: Mapped[str] = mapped_column(String(350), nullable=False)
    metric_name: Mapped[str] = mapped_column(String(100), nullable=False)
    metric_unit: Mapped[str] = mapped_column(String(100), nullable=False)
    metric_value: Mapped[str] = mapped_column(String(100), nullable=False)
    metric_year: Mapped[str] = mapped_column(DateTime)
    nb_points_of_observations: Mapped[int] = mapped_column()
    metric_period:  Mapped[str] = mapped_column(String(100))
    provider_name:  Mapped[str] = mapped_column(String(100), nullable=False) 
    reported_date:  Mapped[DateTime] = mapped_column(DateTime) 
    pillar:  Mapped[Pillar] = mapped_column(Enum(
      *get_args(Pillar),
      name="pillar",
      create_constraint=True,
      validate_strings=True,
    ))
    headquarter_country:  Mapped[str] = mapped_column(String(100), nullable=False) 
      
class Indicators(Base):
    __tablename__ = 'Indicators'
    
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    
class OfficialFrameworks(Base):
    __tablename__ = 'OfficialFrameworks'
    
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    framework_name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=False)

class UserFrameworks(Base):
    __tablename__ = 'UserFrameworks'
    
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    framework_name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=False)
    user_id: Mapped[int] = mapped_column(primary_key=True, unique=False, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(timezone.utc))
    
class Metrics(Base):
    __tablename__ = 'Metrics'
    
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    framework_id: Mapped[int] = mapped_column(primary_key=False, unique=False, nullable=False)
    metric_id: Mapped[int] = mapped_column(primary_key=False, unique=False, nullable=False)
    
class CustomMetrics(Base):
    __tablename__ = 'CustomMetrics'
    
    id: Mapped[int]= mapped_column(primary_key=True, unique=True, nullable=False)
    officialFramework: Mapped[bool]= mapped_column(primary_key=False, unique=False, nullable=False)
    framework_id: Mapped[int] = mapped_column(primary_key=False, unique=False, nullable=False)
    metric_id: Mapped[int] = mapped_column(primary_key=False, unique=False, nullable=False)
    weighting: Mapped[int] = mapped_column(primary_key=False, unique=False, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(timezone.utc))

class RecentList(Base):
    __tablename__ = 'RecentList'

    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    user_id: Mapped[int] = mapped_column(unique=True, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(timezone.utc))

class Company(Base):
    __tablename__ = 'Companies'

    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False, autoincrement=True)
    company_name: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=True) 

