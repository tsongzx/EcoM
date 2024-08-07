from pydantic import BaseModel
from typing import Union, List, Tuple
# from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column

class CompanyFilter(BaseModel):
  countries: List[str]
  industry: str
  page: int