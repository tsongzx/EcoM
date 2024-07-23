from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, Enum
from db import Base
import datetime
from datetime import timezone
from typing import Literal, get_args

Category = Literal["E", "S", "G"]

class Frameworks(Base):
    __tablename__ = 'Frameworks'
    
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    framework_name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=False)
    user_id: Mapped[int] = mapped_column(unique=False, nullable=True)
    is_official_framework: Mapped[bool]= mapped_column(primary_key=False, unique=False, nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(timezone.utc))
    E: Mapped[float] = mapped_column(unique=False, nullable=True)
    S: Mapped[float] = mapped_column(unique=False, nullable=True)
    G: Mapped[float] = mapped_column(unique=False, nullable=True)

class OfficialFrameworkMetrics(Base):
    __tablename__ = 'OfficialFrameworkMetrics'
    
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    framework_id: Mapped[int] = mapped_column(primary_key=False, unique=False, nullable=False)
    category: Mapped[Category] = mapped_column(Enum(
      *get_args(Category),
      name="category",
      create_constraint=True,
      validate_strings=True,
    ))
    metric_id: Mapped[int] = mapped_column(primary_key=False, unique=False, nullable=False)
    weighting: Mapped[float] = mapped_column(primary_key=False, unique=False, nullable=True)
    
class CustomMetrics(Base):
    __tablename__ = 'CustomMetrics'
    
    id: Mapped[int]= mapped_column(primary_key=True, unique=True, nullable=False)
    framework_id: Mapped[int] = mapped_column(primary_key=False, unique=False, nullable=False)
    category: Mapped[Category] = mapped_column(Enum(
      *get_args(Category),
      name="category",
      create_constraint=True,
      validate_strings=True,
    ))
    # need user_id for official frameworks
    user_id: Mapped[int] = mapped_column(primary_key=False, unique=False, nullable=False)
    metric_id: Mapped[int] = mapped_column(primary_key=False, unique=False, nullable=False)
    weighting: Mapped[float] = mapped_column(primary_key=False, unique=False, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(timezone.utc))
