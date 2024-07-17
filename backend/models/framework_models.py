from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, Enum
from db import Base
import datetime
from datetime import timezone

class OfficialFrameworks(Base):
    __tablename__ = 'OfficialFrameworks'
    
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    framework_name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=False)

class UserFrameworks(Base):
    __tablename__ = 'UserFrameworks'
    
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    framework_name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=False)
    user_id: Mapped[int] = mapped_column(unique=False, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(timezone.utc))
    
class OfficialFrameworkMetrics(Base):
    __tablename__ = 'OfficialFrameworkMetrics'
    
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    framework_id: Mapped[int] = mapped_column(primary_key=False, unique=False, nullable=False)
    parent_id: Mapped[int] = mapped_column(primary_key=False, unique=False, nullable=False)
    metric_id: Mapped[int] = mapped_column(primary_key=False, unique=False, nullable=False)
  