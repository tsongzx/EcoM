from pydantic import BaseModel
from typing import Union

# this is separate to the db tables
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Union[str, None] = None

class User(BaseModel):
    id: int
    email: Union[str, None] = None
    full_name: Union[str, None] = None
    # disabled: Union[bool, None] = None

class UserInDB(User):
    hashed_password: str
    
