import schemas.user_schemas as user_schemas
from fastapi import HTTPException, status
import models.user_models as models

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

def get_user_object_using_id(db, id: str):
    user = db.query(models.User).filter(models.User.id == id).first()
    if user is not None:
        # return info of user in db
        return user
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found - invalid id")
      
def get_user_using_email(db, email: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is not None:
        # return info of user in db
        return user_schemas.UserInDB(id=user.id,
                                hashed_password=user.password,
                                email=user.email,
                                full_name=user.full_name)


