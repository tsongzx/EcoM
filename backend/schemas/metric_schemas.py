from pydantic import BaseModel
# from typing import Union
# from sqlalchemy import DateTime

class CustomMetricIndicators(BaseModel):
    indicator_id: int
    indicator_name: str
    weighting: float