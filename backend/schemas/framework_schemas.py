from pydantic import BaseModel
# from typing import Union
# from sqlalchemy import DateTime
from typing import Literal

Category = Literal["E", "S", "G"]

class CustomFramework(BaseModel):
    framework_name: str
    description: str
    
class CustomFrameworkMetrics(BaseModel):
    category: Category
    metric_id: int
    weighting: float

# class Framework(BaseModel):
#     is_official_framework: bool
#     framework_id: int

class UpdateCustomFramework(BaseModel):
    framework_name: str
    description: str
    
class CategoryWeights(BaseModel):
    E: float
    S: float
    G: float
# class CustomiseMetrics(BaseModel):    

