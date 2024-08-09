from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime
from db import Base

class Averages(Base):
    __tablename__ = 'IndustryAverages'
 
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False, autoincrement=True)
    industry:  Mapped[str] = mapped_column(String(100))
    indicator: Mapped[str] = mapped_column(String(100)) 
    indicator_year: Mapped[str] = mapped_column(DateTime)
    indicator_average: Mapped[float] = mapped_column(nullable=False)
    
class Industry(Base):
    __tablename__ = 'Industry'
    industry:  Mapped[str] = mapped_column(String(100), primary_key=True, nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=True) 
