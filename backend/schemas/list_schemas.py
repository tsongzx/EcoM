from pydantic import BaseModel
# from typing import Union
# from sqlalchemy import DateTime
import datetime

class List(BaseModel):
    list_id: int
    list_name: str
    # change to aest?
    created_at: datetime.datetime

class ListCreate(BaseModel):
    list_id: int

class CompanyToListMapping(BaseModel):
    list_id: int
    company_id: int