from pydantic import BaseModel

class CustomMetricIndicators(BaseModel):
    indicator_id: int
    indicator_name: str
    weighting: float