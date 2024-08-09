from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, Enum
from db import Base
from typing import get_args
from config import Config

class Company(Base):
    __tablename__ = 'Companies'

    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False, autoincrement=True)
    company_name: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    perm_id: Mapped[str] = mapped_column(String(100), nullable=False) 
    industry:  Mapped[str] = mapped_column(String(100)) 
    headquarter_country:  Mapped[str] = mapped_column(String(100), nullable=False) 
    ticker: Mapped[str] = mapped_column(String(20), nullable=True) 
    ISIN: Mapped[str] = mapped_column(String(50), nullable=True) 
    
class CompanyData(Base):
    __tablename__ = 'CompanyData'
   
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False, autoincrement=True)
    company_name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    perm_id: Mapped[str] = mapped_column(String(100), nullable=False) 
    disclosure: Mapped[Config.Disclosure] = mapped_column(Enum(
      *get_args(Config.Disclosure),
      name="disclosure",
      create_constraint=True,
      validate_strings=True,
    ))
    indicator_name: Mapped[str] = mapped_column(String(100), nullable=False)
    indicator_value: Mapped[float] = mapped_column(nullable=False)
    indicator_year: Mapped[str] = mapped_column(DateTime)
    nb_points_of_observations: Mapped[int] = mapped_column()
    indicator_period:  Mapped[str] = mapped_column(String(100))
    provider_name:  Mapped[str] = mapped_column(String(100), nullable=False) 
    reported_date:  Mapped[DateTime] = mapped_column(DateTime, nullable=True) 
    indicator_year_int: Mapped[int] = mapped_column(nullable=True)
     
