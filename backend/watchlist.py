from typing import Union
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta, timezone
import jwt
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from db import Base, engine, SessionLocal
from sqlalchemy.orm import Session
from route_tags import tags_metadata
import schemas
from models import User, UserLists, Lists, WatchLists, CompanyData

def get_watchlist(db, id: str): 
    watchlist = db.query(WatchLists).filter(WatchLists.user_id == id).first()
    if watchlist is not None:
        return schemas.Watchlist(user_id=id,
                                 watchlist_id=watchlist.watchlist_id,
                                 watchlist_name=watchlist.watchlist_name
        )
    
def delete_from_watchlist(db, id: str, company_id: str):
    db.query(Lists).filter(Lists.company_id == company_id).delete()
    db.commit()

def add_to_watchlist(db, id: str, company_id: str):
    newList = Lists(list_id = 10, company_id = company_id)
    newWatchlist = WatchLists(user_id = id, watchlist_id = newList.list_id, watchlist_name = "watchlist")
    db.add(newList)
    db.commit()
    db.add(newWatchlist)
    db.commit()