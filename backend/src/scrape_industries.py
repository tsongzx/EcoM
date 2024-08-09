from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Mapped, mapped_column
from sqlalchemy import String, DateTime, Enum
import concurrent.futures
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

username = 'admin'
password = 'crumpeteers'
host = 'crumpeteers.chg60uma2isb.ap-southeast-2.rds.amazonaws.com' # or use IP address
database_name = 'crumpeteers'
# database_url = f'mysql://{username}:{password}@{host}/{database_name}'
database_url = f'mysql+pymysql://{username}:{password}@{host}/{database_name}'

engine = create_engine(database_url, pool_pre_ping=True, echo=True)  

Base = declarative_base()

# Create session local class for session maker
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False) 

# Create the database tables
Base.metadata.create_all(engine)

class Company(Base):
    __tablename__ = 'Companies'

    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False, autoincrement=True)
    company_name: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    perm_id: Mapped[str] = mapped_column(String(100), nullable=False) 
    industry:  Mapped[str] = mapped_column(String(100)) 
    ticker:  Mapped[str] = mapped_column(String(20))
    ISIN:  Mapped[str] = mapped_column(String(20))
    headquarter_country:  Mapped[str] = mapped_column(String(100), nullable=False) 
         
driver = webdriver.Chrome()
session = SessionLocal()
driver.get('https://sasb.ifrs.org/find-your-industry/')
companies = session.query(Company).filter(Company.industry == None).all()
company_names = [company.company_name for company in companies]
print(driver.title)
form = driver.find_element(By.CLASS_NAME, 'sasb-sics-form')  # Find the search box
searchbar = form.find_element(By.CLASS_NAME, 'form-control')
for company_name in company_names:
    searchbar.send_keys(company_name + Keys.ENTER)
    table = WebDriverWait(driver,3).until(
        EC.presence_of_element_located((By.CLASS_NAME, 'sics-results'))
    )
    try:
        rows = WebDriverWait(table,3).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'tr')))
        if not rows:
            print("no rows, skipped")
            searchbar.clear()
            continue
        else:
            print(f"{len(rows)} rows")
            row = rows[1]
            cells = row.find_elements(By.CSS_SELECTOR, 'td')
            data = [cell.text for cell in cells]
            if data == []:
                continue
          
            if data[2] == company_name:
                company = session.query(Company).filter_by(company_name=company_name).first()
                company.ticker = data[0]
                company.ISIN = data[1]
                company.industry = data[4]
                session.commit()
                
            print(data)
    except Exception as e:
        print(f"An error occurred: {e}")
    
    searchbar.clear()

session.close()
driver.quit()
