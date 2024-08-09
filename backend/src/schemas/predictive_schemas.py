from pydantic import BaseModel
from typing import Any

class PredictiveIndicators(BaseModel):
    indicator_id: int
    indicator_name: str
    prediction: Any