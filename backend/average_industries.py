from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from sqlalchemy import create_engine, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Mapped, mapped_column
from sqlalchemy import String, DateTime, Enum
import models.company_models as company_models
import concurrent.futures
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

username = 'admin'
password = 'crumpeteers'
host = 'crumpeteers.chg60uma2isb.ap-southeast-2.rds.amazonaws.com'
database_name = 'crumpeteers'
database_url = f'mysql+pymysql://{username}:{password}@{host}/{database_name}'
engine = create_engine(database_url, pool_pre_ping=True, echo=True)  
Base = declarative_base()
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False) 
Base.metadata.create_all(engine)

class Averages(Base):
    __tablename__ = 'IndustryAverages'
 
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False, autoincrement=True)
    industry:  Mapped[str] = mapped_column(String(100))
    indicator: Mapped[str] = mapped_column(String(100)) 
    indicator_year: Mapped[str] = mapped_column(DateTime)
    indicator_average: Mapped[float] = mapped_column(nullable=False)

def industry_average(industry_name: str):
    session = SessionLocal()
    years = range(2016, 2025)
    results = {}

    for year in years: 
        industry_data = session.query(company_models.CompanyData.indicator_name, func.avg(company_models.CompanyData.indicator_value).label('average')).join(
            company_models.Company, company_models.Company.company_name == company_models.CompanyData.company_name).filter(
            company_models.Company.industry == industry_name,
            company_models.CompanyData.indicator_year_int == year
        ).group_by(company_models.CompanyData.indicator_name).all()

        results[year] = {data.indicator_name: round(data.average, 2) for data in industry_data} if industry_data else {}

    session.close()

    return results
