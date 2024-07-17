from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, Enum
from db import Base
import datetime
from datetime import timezone
from typing import Literal, get_args

class UserList(Base):
    __tablename__ = 'UserLists'
    
    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False, autoincrement=False)
    user_id: Mapped[int] = mapped_column(unique=False, nullable=False)
    list_name: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(timezone.utc))

class List(Base):
    __tablename__ = 'List'

    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    list_id: Mapped[int] = mapped_column(unique=False, nullable=False)
    company_id: Mapped[int] = mapped_column(unique=False, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(timezone.utc))

class WatchList(Base):
    __tablename__ = 'WatchList'

    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    user_id: Mapped[int] = mapped_column(unique=True, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(timezone.utc))


class RecentList(Base):
    __tablename__ = 'RecentList'

    id: Mapped[int] = mapped_column(primary_key=True, unique=True, nullable=False)
    user_id: Mapped[int] = mapped_column(unique=True, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.datetime.now(timezone.utc))
            