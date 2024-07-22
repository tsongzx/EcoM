from pydantic import BaseModel
# from typing import Union
# from sqlalchemy import DateTime

class ModifyMetric(BaseModel):
    metric_id: int
    metric_name: str