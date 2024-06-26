from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime
# from sqlalchemy.orm import sessionmaker
from db import Base
import datetime

# e.g
class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    # full_name: Mapped[Optional[str]]
    # username = Column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    # change to aest?
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now())

# geoffrey to create the models for the rest of tables
# refer to sqlalchemy 