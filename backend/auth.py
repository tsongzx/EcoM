from passlib.context import CryptContext
import jwt
import schemas.user_schemas as user_schemas
from fastapi import HTTPException, status
from datetime import datetime, timedelta, timezone
from typing import Union
from config import Config
from user import valid_userId, get_user_using_email

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def is_authenticated(db, token: str) -> user_schemas.TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_418_IM_A_TEAPOT,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, Config.SECRET_KEY, algorithms=[Config.ALGORITHM])
        userId: str = payload.get("userId")
        if userId is None or not await valid_userId(db, userId):
            raise credentials_exception
                
        # return token data
        return user_schemas.TokenData(userId=userId)
    except jwt.exceptions.ExpiredSignatureError:
      # Handle token expiration
      raise HTTPException(
          status_code=status.HTTP_401_UNAUTHORIZED,
          detail="Token has expired",
          headers={"WWW-Authenticate": "Bearer"},
      )
    except jwt.exceptions.InvalidTokenError:
        print("invalid token?!")
        raise credentials_exception
      
def authenticate_user(db, email: str, password: str):
    user = get_user_using_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def generate_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, Config.SECRET_KEY, algorithm=Config.ALGORITHM)
    return encoded_jwt
  
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password):
    return pwd_context.hash(password)
