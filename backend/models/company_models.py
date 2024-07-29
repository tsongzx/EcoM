from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, Enum
from db import Base
from typing import Literal, get_args

Disclosure = Literal["CALCULATED", "ADJUSTED", "ESTIMATED", "REPORTED", "IMPUTED"]
Data_Type = Literal["float", "int"]
Pillar = Literal["E", "S", "G"]

class Company(Base):
    __tablename__ = 'Companies'

    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False, autoincrement=True)
    company_name: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    perm_id: Mapped[str] = mapped_column(String(100), nullable=False) 
    # description: Mapped[str] = mapped_column(String(1000), nullable=True) 
    industry:  Mapped[str] = mapped_column(String(100)) 
    headquarter_country:  Mapped[str] = mapped_column(String(100), nullable=False) 
         
class CompanyData(Base):
    __tablename__ = 'CompanyData'
   
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False, autoincrement=True)
    company_name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    perm_id: Mapped[str] = mapped_column(String(100), nullable=False) 
    disclosure: Mapped[Disclosure] = mapped_column(Enum(
      *get_args(Disclosure),
      name="disclosure",
      create_constraint=True,
      validate_strings=True,
    ))
    # indicator_description: Mapped[str] = mapped_column(String(500), nullable=False)
    indicator_name: Mapped[str] = mapped_column(String(100), nullable=False)
    # indicator_unit: Mapped[str] = mapped_column(String(100), nullable=False)
    indicator_value: Mapped[float] = mapped_column(nullable=False)
    indicator_year: Mapped[str] = mapped_column(DateTime)
    nb_points_of_observations: Mapped[int] = mapped_column()
    indicator_period:  Mapped[str] = mapped_column(String(100))
    provider_name:  Mapped[str] = mapped_column(String(100), nullable=False) 
    reported_date:  Mapped[DateTime] = mapped_column(DateTime, nullable=True) 
    indicator_year_int: Mapped[int] = mapped_column(nullable=True)
     
