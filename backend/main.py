from typing import Union

# import Annotated
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta, timezone
import jwt
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from db import Base, engine, SessionLocal
from sqlalchemy.orm import Session

import schemas
import models
# app = FastAPI()
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# @app.get("/")
# async def root():
#     return {"message": "Hello World"}
  
# @app.get("/items/{item_id}")
# async def read_item(item_id):
#     return {"item_id": item_id}
  
# @app.get("/items/{item_id}")
# async def read_item(item_id: str):
#     if item_id not in items:
#         raise HTTPException(status_code=404, detail="Item not found")
#     return {"item": items[item_id]}

# @app.get("/items/")
# async def read_items(token: Annotated[str, Depends(oauth2_scheme)]):
#     return {"token": token}
  
def get_session():
  session = SessionLocal()
  try:
      yield session
  finally:
      session.close()

# Create the database tables
Base.metadata.create_all(engine)
# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "45aa99285e9155a8b8792a3075c62fbdba8f71a9d921a12bcb8a6e0105f73e5a"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

db = {}

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password):
    return pwd_context.hash(password)

def get_user(db, email: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is not None:
        # return info of user in db
        return schemas.UserInDB(id=user.id,
                                hashed_password=user.password,
                                email=user.email,
                                full_name=user.full_name)

def authenticate_user(db, email: str, password: str):
    user = get_user(db, email)
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
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         username: str = payload.get("sub")
#         if username is None:
#             raise credentials_exception
#         token_data = TokenData(username=username)
#     except InvalidTokenError:
#         raise credentials_exception
#     user = get_user(db, username=token_data.username)
#     if user is None:
#         raise credentials_exception
#     return user


# async def get_current_active_user(
#     current_user: Annotated[User, Depends(get_current_user)],
# ):
#     if current_user.disabled:
#         raise HTTPException(status_code=400, detail="Inactive user")
#     return current_user


# ****************************************************************
#                          Auth Functions
# ****************************************************************

# @api_router.post("/recipe/", status_code=201, response_model=Recipe)

@app.post("/auth/login", response_model=schemas.Token)
async def auth_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_session),
) -> schemas.Token:
    # here username refers to email
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = generate_token(
        data={"userId": user.id}, expires_delta=access_token_expires
    )
    return schemas.Token(access_token=access_token, token_type="bearer")

# to do 
@app.post("/auth/register", response_model=schemas.Token)
async def auth_register(
    user: schemas.UserRegister,
    session: Session = Depends(get_session)
) -> schemas.Token:
    # note can use get_user function here (can change later)
    existing_user = session.query(models.User).filter_by(email=user.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    hashed_password = hash_password(user.password)

    new_user = models.User(full_name=user.full_name, email=user.email, password=hashed_password)

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = generate_token(
        data={"userId": new_user.id}, expires_delta=access_token_expires
    )
    return schemas.Token(access_token=access_token, token_type="bearer")
#     user = authenticate_user(db, form_data.username, form_data.password)
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect username or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = generate_token(
#         data={"userId": user.id}, expires_delta=access_token_expires
#     )
#     return Token(access_token=access_token, token_type="bearer")

# https://medium.com/@chnarsimha986/fastapi-login-logout-changepassword-4c12e92d41e2

















# @app.get("/users/me/", response_model=User)
# async def read_users_me(
#     current_user: Annotated[User, Depends(get_current_active_user)],
# ):
#     return current_user


# @app.get("/users/me/items/")
# async def read_own_items(
#     current_user: Annotated[User, Depends(get_current_active_user)],
# ):
#     return [{"item_id": "Foo", "owner": current_user.username}]