from pydantic import BaseModel
# from typing import Union
# from sqlalchemy import DateTime

class CustomFramework(BaseModel):
    framework_name: str
    description: str
    user_id: int
    
class CustomFrameworkMetrics(BaseModel):
    parent_id: int
    metric_id: int
    weighting: float

class Framework(BaseModel):
    is_official_framework: bool
    framework_id: int

class UpdateCustomFramework(BaseModel):
    framework_name: str
    description: str
    
# class CustomiseMetrics(BaseModel):    

