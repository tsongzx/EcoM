from pydantic import BaseModel
from typing import Union

# this is separate to the db tables
class Token(BaseModel):
    access_token: str
    token_type: str # honestly might not need this?

class TokenData(BaseModel):
    username: Union[str, None] = None

class User(BaseModel):
    id: int
    email: Union[str, None] = None
    full_name: Union[str, None] = None
    password: Union[str, None] = None
    # disabled: Union[bool, None] = None

class UserRegister(BaseModel):
    email: Union[str, None] = None
    full_name: Union[str, None] = None
    password: Union[str, None] = None
    
class UserInDB(User):
    # id: int
    # email: Union[str, None] = None
    # full_name: Union[str, None] = None
    hashed_password: str
    
    
