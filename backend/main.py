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
import schemas.user_schemas as user_schemas
import schemas.list_schemas as list_schemas
import models
from sqlalchemy import delete
from fastapi.middleware.cors import CORSMiddleware

  
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password):
    return pwd_context.hash(password)

def get_user_using_email(db, email: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is not None:
        # return info of user in db
        return user_schemas.UserInDB(id=user.id,
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

@app.post("/auth/login", response_model=user_schemas.Token,  tags=["Auth"])
async def auth_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_session),
) -> user_schemas.Token:
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
    return user_schemas.Token(access_token=access_token, token_type="bearer")

@app.post("/auth/register", response_model=user_schemas.Token, tags=["Auth"])
async def auth_register(
    user: user_schemas.UserRegister,
    session: Session = Depends(get_session)
) -> user_schemas.Token:
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
    return user_schemas.Token(access_token=access_token, token_type="bearer")


#***************************************************************
#                        User Functions
#***************************************************************

async def is_authenticated(db, token: str) -> user_schemas.TokenData:
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
        return user_schemas.TokenData(userId=userId)
    except jwt.exceptions.InvalidTokenError:
        raise credentials_exception

async def valid_userId(db, userId: str) -> bool:
    user = db.query(models.User).filter_by(id=userId).first()
    return True if user else False
  
def get_user_using_id(db, id: str):
    user = db.query(models.User).filter(models.User.id == id).first()
    if user is not None:
        # return info of user in db
        return user_schemas.UserInDB(id=user.id,
                                hashed_password=user.password,
                                email=user.email,
                                full_name=user.full_name)
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found - invalid id")
        
@app.get("/user", response_model=user_schemas.UserInDB, tags=["User"])
async def get_user(
    token: str = Depends(oauth2_scheme),
    # authorization: str = Depends(security),
    session: Session = Depends(get_session)
) -> user_schemas.UserInDB:
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
    request: user_schemas.PasswordUpdate = Depends(),
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
@app.put("/user/full-name", response_model=user_schemas.UserInDB, tags=["User"])
async def change_user_full_name(
    token: str = Depends(oauth2_scheme),
    # authorization: str = Depends(security),
    new_name: user_schemas.NameUpdate = Depends(),
    session: Session = Depends(get_session),
) -> user_schemas.UserInDB:
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

@app.get("/lists", tags=["Lists"])
#  response_model=schemas.UserLists,
async def get_lists(
    token: str = Depends(oauth2_scheme),
    # authorization: str = Depends(security),
    session: Session = Depends(get_session),
):
    token_data = await is_authenticated(session, token)
    # token_data = await is_authenticated(session, authorization.credentials)
    lists = session.query(models.UserList).filter(models.UserList.user_id == token_data.userId).all()
    print(lists)
    
    return lists
    
@app.get("/list", tags=["List"])
#  response_model=schemas.UserLists,
# returns companies in a list
async def get_list(
    list_name: str,
    token: str = Depends(oauth2_scheme),
    # authorization: str = Depends(security),
    session: Session = Depends(get_session),
):
    await is_authenticated(session, token)
    # await is_authenticated(session, authorization.credentials)
    list = session.query(models.UserList).filter_by(list_name=list_name).first()
    
    if list is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="List doesn't exist. Invalid list name.")
      
    companies = session.query(models.List).filter_by(list_id=list.id).all()    
    return companies
    
@app.post("/list", tags=["List"], response_model=list_schemas.ListCreate)
# returns companies in a list
async def create_list(
    list_name: str,
    token: str = Depends(oauth2_scheme),
    # authorization: str = Depends(security),
    session: Session = Depends(get_session),
) -> list_schemas.ListCreate:
    token_data = is_authenticated(session, token)
    # token_data = await is_authenticated(session, authorization.credentials)
    existing_list = session.query(models.UserList).filter_by(list_name=list_name).first()
    if existing_list:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="List name already in use")

    new_list = models.UserList(user_id=token_data.userId, list_name=list_name)

    session.add(new_list)
    session.commit()
    session.refresh(new_list)
     
    return list_schemas.ListCreate(list_id=new_list.id)
  
    
@app.delete("/list", tags=["List"])
# returns companies in a list
async def delete_list(
    list_name: str,
    # authorization: str = Depends(security),
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    await is_authenticated(session, token)
    # await is_authenticated(session, authorization.credentials)
    list = session.query(models.UserList).filter_by(list_name=list_name).first()
    statement = delete(models.UserList).where(models.UserList.list_name == list_name)
    session.execute(statement)
    statement = delete(models.List).where(models.List.list_id == list.id)
    session.execute(statement)
    
    session.commit()
    
    return {"message" : f"Successfully deleted list {list_name}"}
  
 
@app.post("/list/company", tags=["List"])
# returns companies in a list
async def add_company_to_list(
    request: list_schemas.CompanyToAddToList,
    token: str = Depends(oauth2_scheme),
    # authorization: str = Depends(security),
    session: Session = Depends(get_session),
):
    await is_authenticated(session, token)
    # await is_authenticated(session, authorization.credentials)
    # error checks for invalid list name or company name?
    company = session.query(models.CompanyData).filter_by(company_name=request.company_name).first()
    list = session.query(models.UserList).filter_by(list_name=request.list_name).first()
    if company is None or list is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company or list does not exist")
  
    existing_company = session.query(models.List).filter_by(list_id=list.id)\
        .filter_by(company_id=company.id)\
        .first()
        
    if existing_company:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company already added to list")
   
    new_company = models.List(list_id=list.id, company_id=company.id)

    session.add(new_company)
    session.commit()
    session.refresh(new_company)
     
    return {"message" : f"Successfully added {request.company_name} to {request.list_name}"}
  
    
# to do add delete from list
# @app.delete("/list", tags=["List"])
# # returns companies in a list
# async def delete_list(
#     # token: str = Depends(oauth2_scheme),
#     list_name: str,
#     authorization: str = Depends(security),
#     session: Session = Depends(get_session),
# ):
#     # token_data = await is_authenticated(db, token)
#     await is_authenticated(session, authorization.credentials)
#     list = session.query(models.UserList).filter_by(list_name=list_name).first()
#     statement = delete(models.UserList).where(models.UserList.list_name == list_name)
#     session.execute(statement)
#     statement = delete(models.List).where(models.List.list_id == list.id)
#     session.execute(statement)
    
#     session.commit()
    
#     return {"message" : f"Successfully deleted list {list_name}"}
  

# to do: add error codes
# from pydantic import BaseModel
# # Define your models here like
# class model200(BaseModel):
#     message: str = ""
    
# @api.get("/my-route/", responses={200: {"response": model200}, 404: {"response": model404}, 500: {"response": model500}})
#     async def api_route():
#         return "I'm a wonderful route"