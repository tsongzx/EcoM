from pydantic import BaseModel

class IndicatorGraph(BaseModel):
    indicator: str
    year: int
    value: float
    company: str

class MetricGraph(BaseModel):
    metric: str
    year: int
    value: float
    company: str
    
class FrameworkGraph(BaseModel):
    framework: str
    year: int
    value: float
    company: str
