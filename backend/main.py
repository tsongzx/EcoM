from typing import Union
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm, HTTPBearer
from datetime import datetime, timedelta, timezone
import jwt
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from db import Base, engine, SessionLocal
from sqlalchemy.orm import Session
from route_tags import tags_metadata
import schemas
import models
  
def get_session():
  session = SessionLocal()
  try:
      yield session
  finally:
      session.close()

# Create the database tables
Base.metadata.create_all(engine)

# NOTE: MOVE THIS TO CONFIG FILE!?!??!
# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "45aa99285e9155a8b8792a3075c62fbdba8f71a9d921a12bcb8a6e0105f73e5a"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI(openapi_tags=tags_metadata)
security = HTTPBearer()

# @app.get('/')
# def main(authorization: str = Depends(security)):
#     print("something happend")
#     return authorization.credentials

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password):
    return pwd_context.hash(password)

def get_user_using_email(db, email: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is not None:
        # return info of user in db
        return schemas.UserInDB(id=user.id,
                                hashed_password=user.password,
                                email=user.email,
                                full_name=user.full_name)

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
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ****************************************************************
#                          Auth Functions
# ****************************************************************

@app.post("/auth/login", response_model=schemas.Token,  tags=["Auth"])
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

@app.post("/auth/register", response_model=schemas.Token, tags=["Auth"])
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


#***************************************************************
#                        User Functions
#***************************************************************

async def is_authenticated(db, token: str) -> schemas.TokenData:
    # credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
#         if credentials:
#             if not credentials.scheme == "Bearer":
#                 raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
#             if not self.verify_jwt(credentials.credentials):
#                 raise HTTPException(status_code=403, detail="Invalid token or expired token.")
#             return credentials.credentials
#         else:
#             raise HTTPException(status_code=403, detail="Invalid authorization code.")

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        userId: str = payload.get("userId")
        if userId is None or not await valid_userId(db, userId):
            raise credentials_exception
                
        # return token data
        return schemas.TokenData(userId=userId)
    except jwt.exceptions.InvalidTokenError:
        raise credentials_exception

async def valid_userId(db, userId: str) -> bool:
    user = db.query(models.User).filter_by(id=userId).first()
    return True if user else False
  
def get_user_using_id(db, id: str):
    user = db.query(models.User).filter(models.User.id == id).first()
    if user is not None:
        # return info of user in db
        return schemas.UserInDB(id=user.id,
                                hashed_password=user.password,
                                email=user.email,
                                full_name=user.full_name)
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found - invalid id")
        
@app.get("/user", response_model=schemas.UserInDB, tags=["User"])
async def get_user(
    token: str = Depends(oauth2_scheme),
    # authorization: str = Depends(security),
    session: Session = Depends(get_session)
):
      token_data = await is_authenticated(session, token)
      # token_data = await is_authenticated(session, authorization.credentials)
      user = get_user_using_id(session, id=token_data.userId)
      # this shouldn't happen i think so probs can remove
      # if user is None:
      #     raise credentials_exception
      return user

def get_user_object_using_id(db, id: str):
    user = db.query(models.User).filter(models.User.id == id).first()
    if user is not None:
        # return info of user in db
        return user
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found - invalid id")
      
# update password
@app.put("/user/password", tags=["User"])
async def change_user_password(
    token: str = Depends(oauth2_scheme),
    # authorization: str = Depends(security),
    request: schemas.PasswordUpdate = Depends(),
    session: Session = Depends(get_session),
):
      # token_data = await is_authenticated(session, authorization.credentials)
      token_data = await is_authenticated(session, token)
      user = get_user_object_using_id(session, id=token_data.userId)
      
      # Alternatively, we can handle the below in the frontend 
      if request.old_password == request.new_password:
          # may be more secure to keep track of more old passwords
          raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot reuse old password")

      if request.new_password != request.confirm_password:
          raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match")

      encrypted_password = hash_password(request.new_password)
      user.password = encrypted_password
      session.commit()
        
      # alternatively just return empty {}
      return {"message": "Password changed successfully"}
    
# update name
@app.put("/user/full-name", response_model=schemas.UserInDB, tags=["User"])
async def change_user_full_name(
    token: str = Depends(oauth2_scheme),
    # authorization: str = Depends(security),
    new_name: schemas.NameUpdate = Depends(),
    session: Session = Depends(get_session),
):
      token_data = await is_authenticated(session, token)
      # token_data = await is_authenticated(session, authorization.credentials)
      user = get_user_object_using_id(session, id=token_data.userId)
      
      user.full_name = new_name.new_name
      session.commit()
        
      # alternatively just return empty {} or message
      userInDB = get_user_using_id(session, id=token_data.userId)
      return userInDB

# logout 

#***************************************************************
#                        List Functions
#***************************************************************

# @app.get("/lists", tags=["Lists"])
# #  response_model=schemas.UserLists,
# def get_lists(
#     token: str = Depends(oauth2_scheme),
#     db: Session = Depends(get_session),
#     authorization: str = Depends(security)
# ):
#     # token_data = is_authenticated(token)
#     # lists = db.query(models.UserList).filter(models.UserList.user_id == token_data.userId).all()
#     # print(lists)
#     lists = db.query(models.UserList).filter(models.UserList.user_id == authorization).all()
#     print(lists)
    
    
    