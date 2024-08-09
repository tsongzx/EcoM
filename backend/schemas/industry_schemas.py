from pydantic import BaseModel
from typing import List

class CompanyFilter(BaseModel):
  countries: List[str]
  industry: str
  page: int