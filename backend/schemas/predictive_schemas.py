from pydantic import BaseModel
from typing import Any
# from sqlalchemy import DateTime

class PredictiveIndicators(BaseModel):
    indicator_id: int
    indicator_name: str
    prediction: Any