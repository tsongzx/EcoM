from pydantic import BaseModel
from typing import List
from ..config import Config

class CompanyIndicator(BaseModel):
    id: int
    company_name: str
    perm_id: str 
    disclosure: Config.Disclosure
    indicator_name: str
    indicator_value: float
    indicator_year: str
    nb_points_of_observations: int
    indicator_period:  str
    provider_name:  str 
    reported_date:  str 
    indicator_year_int: int
     
class Value(BaseModel):
    score: float
    weighting: float
    
class ESGScore(BaseModel):
    companies: List[str]
    year: int
    