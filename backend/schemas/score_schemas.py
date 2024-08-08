from pydantic import BaseModel
from typing import Literal, Union, List, Tuple
# from sqlalchemy import DateTime
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column
Disclosure = Literal["CALCULATED", "ADJUSTED", "ESTIMATED", "REPORTED", "IMPUTED"]

class CompanyIndicator(BaseModel):
    id: int
    company_name: str
    perm_id: str 
    disclosure: Disclosure
    indicator_name: str
    indicator_value: float
    indicator_year: str
    nb_points_of_observations: int
    indicator_period:  str
    provider_name:  str 
    reported_date:  str 
    indicator_year_int: int
    
# class CompanyIndicator(BaseModel):
#     indicator_name: str
#     indicator_value: float
     
class Value(BaseModel):
    score: float
    weighting: float
    
class ESGScore(BaseModel):
    companies: List[str]
    year: int
    