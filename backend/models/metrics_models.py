from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, Enum
from db import Base
import datetime
from datetime import timezone
from typing import Literal, get_args
Data_Type = Literal["float", "int"]
Pillar = Literal["E", "S", "G"]

      #to do - change primary key from id to name - maybe dont need
class Indicators(Base):
    __tablename__ = 'Indicators'
 
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    data_type: Mapped[Data_Type] = mapped_column(Enum(
      *get_args(Data_Type),
      name="data_type",
      create_constraint=True,
      validate_strings=True,
    ))
    description: Mapped[str] = mapped_column(String(500), nullable=False)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    unit: Mapped[str] = mapped_column(String(100), nullable=False)
    pillar:  Mapped[Pillar] = mapped_column(Enum(
      *get_args(Pillar),
      name="pillar",
      create_constraint=True,
      validate_strings=True,
    ))
    source: Mapped[str] = mapped_column(String(200))
    
class Metrics(Base):
    __tablename__ = 'Metrics'
    
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), unique=False, nullable=False)
    # description: Mapped[str] = mapped_column(String(1000))

class MetricIndicators(Base):
    __tablename__ = 'MetricIndicators'
    
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    metric_id: Mapped[int] = mapped_column(primary_key=False, unique=False, nullable=False)
    indicator_name: Mapped[str] = mapped_column(String(100), primary_key=False, unique=False, nullable=False)
    indicator_id: Mapped[int] = mapped_column(primary_key=False, unique=False)
