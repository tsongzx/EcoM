from pydantic import BaseModel
import datetime

class List(BaseModel):
    list_id: int
    list_name: str
    created_at: datetime.datetime

class ListCreate(BaseModel):
    list_id: int

class CompanyToListMapping(BaseModel):
    list_id: int
    company_id: int