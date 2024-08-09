from pydantic import BaseModel
from config import Config

class CustomFramework(BaseModel):
    framework_name: str
    description: str
    
class CustomFrameworkMetrics(BaseModel):
    category: Config.Category
    metric_id: int
    weighting: float
    
class UpdateCustomFramework(BaseModel):
    framework_name: str
    description: str
    
class CategoryWeights(BaseModel):
    E: float
    S: float
    G: float

