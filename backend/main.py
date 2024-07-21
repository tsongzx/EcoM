from fastapi import Depends, FastAPI, HTTPException, status, Query
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm 
from datetime import timedelta
from auth import generate_token, is_authenticated, authenticate_user, hash_password
import frameworks
from db import Base, engine, SessionLocal
from user import get_user_using_id, get_user_object_using_id 
from sqlalchemy.orm import Session
from route_tags import tags_metadata
import schemas.user_schemas as user_schemas
import schemas.list_schemas as list_schemas
import schemas.framework_schemas as framework_schemas
import schemas.metric_schemas as metric_schemas
import models.company_models as company_models
import models.framework_models as framework_models
import models.list_models as list_models
import models.metrics_models as metrics_models
import models.user_models as user_models
import json
from sqlalchemy import delete, and_, or_, distinct
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
from config import Config
from typing import List, Any

def get_session():
  session = SessionLocal()
  try:
      yield session
  finally:
      session.close()

# Create the database tables
Base.metadata.create_all(engine)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

app = FastAPI(openapi_tags=tags_metadata)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# ****************************************************************
#                          Auth Functions
# ****************************************************************

@app.post("/token", response_model=user_schemas.Token)
async def get_token(
    user: user_schemas.UserInDB,
):
    access_token_expires = timedelta(minutes=Config.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = generate_token(
        data={"userId": user.id}, expires_delta=access_token_expires
    )
    return user_schemas.Token(access_token=access_token, token_type="bearer")

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
    
    return await get_token(user)
  
@app.post("/auth/register", response_model=user_schemas.Token, tags=["Auth"])
async def auth_register(
    user: user_schemas.UserRegister,
    session: Session = Depends(get_session)
) -> user_schemas.Token:
    # note can use get_user function here (can change later)
    existing_user = session.query(user_models.User).filter_by(email=user.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    hashed_password = hash_password(user.password)

    new_user = user_models.User(full_name=user.full_name, email=user.email, password=hashed_password)

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return await get_token(new_user)

#***************************************************************
#                        User Functions
#***************************************************************
      
@app.get("/user", response_model=user_schemas.UserInDB, tags=["User"])
async def get_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
) -> user_schemas.UserInDB:
      token_data = await is_authenticated(session, token)
      user = get_user_using_id(session, id=token_data.userId)
      # this shouldn't happen i think so probs can remove
      # if user is None:
      #     raise credentials_exception
      return user

# update password
@app.put("/user/password", tags=["User"])
async def change_user_password(
    request: user_schemas.PasswordUpdate,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
      user = get_user_object_using_id(session, id=user.id)
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
    new_name: user_schemas.NameUpdate,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) -> user_schemas.UserInDB:
      user = get_user_object_using_id(session, id=user.id)
      
      user.full_name = new_name.new_name
      session.commit()
        
      # alternatively just return empty {} or message
      userInDB = get_user_using_id(session, id=user.id)
      return userInDB

#***************************************************************
#                        List Apis
#***************************************************************

@app.get("/lists", tags=["Lists"])
async def get_lists(
    user: user_schemas.UserInDB = Depends(get_user),
    # authorization: str = Depends(security),
    session: Session = Depends(get_session),
):
    # token_data = await is_authenticated(session, authorization.credentials)
    lists = session.query(list_models.UserList).filter(list_models.UserList.user_id == user.id).all()
    
    return lists
    
@app.get("/list", tags=["List"])
# returns companies in a list
async def get_list(
    list_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    list = session.query(list_models.UserList).filter_by(id=list_id).first()
    
    if list is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="List doesn't exist. Invalid list id.")
      
    companies = session.query(list_models.List).filter_by(list_id=list.id).all()    
    return companies
    
@app.post("/list", tags=["List"], response_model=list_schemas.ListCreate)
# returns companies in a list
async def create_list(
    list_name: str,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) -> list_schemas.ListCreate:
    existing_list = session.query(list_models.UserList).filter_by(user_id=user.id).filter_by(list_name=list_name).first()
    if existing_list:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="List name already in use")

    max_id_1 = session.query(func.max(list_models.List.list_id)).scalar()
    max_id_2 = session.query(func.max(list_models.RecentList.id)).scalar()
    max_id_3 = session.query(func.max(list_models.WatchList.id)).scalar()
    max_id_4 = session.query(func.max(list_models.UserList.id)).scalar()

    if max_id_1 == None:
        max_id_1 = 0
    if max_id_2 == None:
        max_id_2 = 0
    if max_id_3 == None:
        max_id_3 = 0
    if max_id_4 == None:
        max_id_4 = 0

    max_id = max(max_id_1, max_id_2, max_id_3, max_id_4)
    new_list_id = max_id + 1 if max_id is not None else 1
    new_list = list_models.UserList(id=new_list_id, user_id=user.id, list_name=list_name)

    session.add(new_list)
    session.commit()
    session.refresh(new_list)
     
    return list_schemas.ListCreate(list_id=new_list.id)
  
    
@app.delete("/list", tags=["List"])
# returns companies in a list
async def delete_list(
    list_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    statement = delete(list_models.UserList).where(list_models.UserList.id == list_id)
    session.execute(statement)
    statement = delete(list_models.List).where(list_models.List.list_id == list_id)
    session.execute(statement)
    
    session.commit()
    
    return {"message" : f"Successfully deleted list {list_id.id}"}
  
 
@app.post("/list/company", tags=["List"])
# returns companies in a list
async def add_company_to_list(
    request: list_schemas.CompanyToListMapping,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    company = session.query(company_models.CompanyData).filter_by(id=request.company_id).first()
    list = session.query(list_models.UserList).filter_by(id=request.list_id).first()
    if company is None or list is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company or list does not exist")
  
    existing_company = session.query(list_models.List).filter_by(list_id=request.list_id)\
        .filter_by(company_id=company.id)\
        .first()
        
    if existing_company:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company already added to list")
   
    new_company = list_models.List(list_id=request.list_id, company_id=request.company_id)

    session.add(new_company)
    session.commit()
    session.refresh(new_company)
     
    return {"message" : f"Successfully added {company.company_name} to list {request.list_id}"}
  
@app.get("/list/company", tags=["List"])
# returns companies in a list
async def is_company_in_list(
    list_id: int,
    company_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) -> bool:
    company = session.query(company_models.CompanyData).filter_by(id=company_id).first()
    list = session.query(list_models.UserList).filter_by(id=list_id).first()
    if company is None or list is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company or list does not exist")
  
    existing_company = session.query(list_models.List).filter_by(list_id=list_id)\
        .filter_by(company_id=company.id)\
        .first()
            
    return True if existing_company else False
   
@app.delete("/list/company", tags=["List"])
# returns companies in a list
async def delete_company_from_list(
    request: list_schemas.CompanyToListMapping,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    statement = delete(list_models.List).where((list_models.List.list_id == request.list_id) & (list_models.List.company_id == request.company_id))
    session.execute(statement)
    session.commit()
    
    return {"message" : f"Successfully deleted company {request.company_id} from list {request.list_id}"}
  

# to do: add error codes
# from pydantic import BaseModel
# # Define your models here like
# class model200(BaseModel):
#     message: str = ""
    
# @api.get("/my-route/", responses={200: {"response": model200}, 404: {"response": model404}, 500: {"response": model500}})
#     async def api_route():
#         return "I'm a wonderful route"
#***************************************************************
#                        Watclist Apis
#***************************************************************

@app.get("/watchlist", tags=["Watchlist"])
async def get_watchlist(
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    watchlist = session.query(list_models.WatchList).filter(list_models.WatchList.user_id == user.id).first()
    
    if watchlist == None:
      return [] 
    watchlist_companies = session.query(list_models.List).filter(list_models.List.list_id == watchlist.id).all()
    return watchlist_companies

@app.delete("/watchlist", tags=["Watchlist"])
async def delete_from_watchlist(
    company_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    watchlist_id = session.query(list_models.WatchList).filter(list_models.WatchList.user_id == user.id).first().id
    statement = delete(list_models.List).where((list_models.List.list_id == watchlist_id) & (list_models.List.company_id == company_id))
    session.execute(statement)
    session.commit()

    return {"message" : f"Successfully deleted company from watchlist"}


@app.post("/watchlist", tags=["Watchlist"])
async def add_to_watchlist(
    company_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    watchlist = session.query(list_models.WatchList).filter(list_models.WatchList.user_id == user.id).first()
    if watchlist is None:
        max_id_1 = session.query(func.max(list_models.List.list_id)).scalar()
        max_id_2 = session.query(func.max(list_models.UserList.id)).scalar()
        max_id_3 = session.query(func.max(list_models.RecentList.id)).scalar()
        max_id_4 = session.query(func.max(list_models.WatchList.id)).scalar()

        if max_id_1 == None:
            max_id_1 = 0
        if max_id_2 == None:
            max_id_2 = 0
        if max_id_3 == None:
            max_id_3 = 0
        if max_id_4 == None:
            max_id_4 = 0

        max_id = max(max_id_1, max_id_2, max_id_3, max_id_4)
        new_watchlist_id = max_id + 1 if max_id is not None else 1
        new_watchlist = list_models.WatchList(id=new_watchlist_id, user_id=user.id)
        session.add(new_watchlist)
        session.commit()
        watchlist_id = new_watchlist.id
    else:
        watchlist_id = watchlist.id
    check_if_exists = session.query(list_models.List).where(list_models.List.list_id == watchlist_id).where(list_models.List.company_id == company_id).first()
    if check_if_exists is None:
        new_watchlist_company = list_models.List(list_id=watchlist_id, company_id=company_id)
        session.add(new_watchlist_company)
        session.commit()
        session.refresh(new_watchlist_company)
        return {"message" : f"Successfully added company to watchlist"}
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company already exists in watchlist")
    
#***************************************************************
#                        Recently viewed Apis
#***************************************************************

@app.get("/recently_viewed", tags=["recents"])
async def get_recently_viewed(
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    recentList = session.query(list_models.RecentList).filter(list_models.RecentList.user_id == user.id).first()
    if recentList == None:
      return []
    recentCompanies = session.query(list_models.List).filter(list_models.List.list_id == recentList.id).order_by(list_models.List.created_at).all()
    return recentCompanies

@app.post("/recently_viewed", tags=["recents"])
async def add_to_recently_viewed(
    company_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    recentList = session.query(list_models.RecentList).filter(list_models.RecentList.user_id == user.id).first()
    if recentList is None:
        max_id_1 = session.query(func.max(list_models.List.list_id)).scalar()
        max_id_2 = session.query(func.max(list_models.UserList.id)).scalar()
        max_id_3 = session.query(func.max(list_models.WatchList.id)).scalar()
        max_id_4 = session.query(func.max(list_models.RecentList.id)).scalar()

        if max_id_1 == None:
            max_id_1 = 0
        if max_id_2 == None:
            max_id_2 = 0
        if max_id_3 == None:
            max_id_3 = 0
        if max_id_4 == None:
            max_id_4 = 0

        max_id = max(max_id_1, max_id_2, max_id_3, max_id_4)
        new_recent_id = max_id + 1 if max_id is not None else 1
        new_recent_list = list_models.RecentList(id=new_recent_id, user_id=user.id)
        session.add(new_recent_list)
        session.commit()
        recent_id = new_recent_list.id
    else:
        recent_id = recentList.id
    recent_companies_length = session.query(list_models.List).filter(list_models.List.list_id == recent_id).count()

    check_if_exists = session.query(list_models.List).where(list_models.List.list_id == recent_id).where(list_models.List.company_id == company_id).first()
    if check_if_exists is not None:
        statement = check_if_exists
        session.delete(statement)
        session.commit()

    if recent_companies_length >= 20:
        statement = session.query(list_models.List).where(list_models.List.list_id == recent_id).order_by(list_models.List.id).first()
        session.delete(statement)
        session.commit()
    
    new_recent = list_models.List(list_id=recent_id, company_id=company_id)
    session.add(new_recent)
    session.commit()
    session.refresh(new_recent)

    return {"message" : f"Successfully added company to recent list"}

#***************************************************************
#                        Company Apis
#***************************************************************

@app.get("/company", tags=["company"])
async def get_all_company(
    page: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    offset = page * 20
    companyData = session.query(company_models.Company).offset(offset).limit(20).all()
    return companyData

@app.get("/company/{company_id}", tags=["company"])
async def get_company(
    company_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    companyData = session.query(company_models.Company).filter(company_models.Company.id == company_id).first()
    return companyData

@app.get("/company/indicators/{company_name}", tags=["company"])
async def get_company_indicators(
    company_name: str,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    company_data = session.query(company_models.CompanyData).filter(company_models.CompanyData.company_name == company_name).all()
    # company_indicators = []
    # for data in company_data:
    #     indicators = {
    #         "Name": data.metric_name,
    #         "Description": data.metric_description,
    #         "Unit": data.metric_unit,
    #         "Value": data.metric_value,
    #         "Year": data.metric_year,
    #         "Period": data.metric_period,
    #     }
    #     company_indicators.append(indicators)
    return company_data

#***************************************************************
#                        Framework Apis
#***************************************************************

@app.get("/frameworks/all", tags=["Framework"])
async def get_frameworks(
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    """_summary_: retrieve all frameworks of the user

    Args:
        user (user_schemas.UserInDB, optional): _description_. Defaults to Depends(get_user).
        session (Session, optional): _description_. Defaults to Depends(get_session).

    Returns: list of official framework objects
        
    """    
    return session.query(framework_models.Frameworks).filter(
        or_(framework_models.Frameworks.user_id == user.id,
            framework_models.Frameworks.is_official_framework == True
        )
    ).all()
  
@app.get("/framework/{framework_id}", tags=["Framework"])
async def get_framework(
    framework_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    """_summary_: retrieve details for a single framework

    Args:
        framework_id (int): _description_
        user (user_schemas.UserInDB, optional): _description_. Defaults to Depends(get_user).
        session (Session, optional): _description_. Defaults to Depends(get_session).

    Returns:
        _type_: retrieves information for a framework 
    """    
    return session.query(framework_models.Frameworks).get(framework_id)
  
@app.get("/framework/metrics/{framework_id}", tags=["Framework"])
async def get_framework_metrics(
    framework_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    """_summary_: retrieve metrics for a single framework.

    Args:
        framework_id (int): _description_
        user (user_schemas.UserInDB, optional): _description_. Defaults to Depends(get_user).
        session (Session, optional): _description_. Defaults to Depends(get_session).

    Returns:
        _type_: returns the metrics in the framework, empty list if framework ID is invalid 
    """
    metrics = session.query(framework_models.CustomMetrics).filter_by(framework_id=framework_id).all() 

    # if no metrics found, no custom metric weights have been set for official framework 
    if len(metrics) == 0:
        metrics = session.query(framework_models.OfficialFrameworkMetrics).filter_by(framework_id = framework_id).all()
    
    return metrics

from typing import Literal
Category = Literal["E", "S", "G"]

@app.get("/framework/metrics/category/", tags=["Framework"])
async def get_framework_metrics_by_category(
    framework_id: int,
    category: Category,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    return frameworks.get_framework_metrics_by_category(framework_id, category, session)

@app.post("/framework/create/", tags=["Framework"])
async def create_framework(
    details: framework_schemas.CustomFramework,
    category_weightings: framework_schemas.CategoryWeights,
    metrics: List[framework_schemas.CustomFrameworkMetrics],
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    """_summary_: creates user customised framework. Subcategory is only either 'E, S or G'

    Args:
        details (framework_schemas.CustomFramework): _description_
        metrics (List[framework_schemas.CustomFrameworkMetrics]): _description_
        user (user_schemas.UserInDB, optional): _description_. Defaults to Depends(get_user).
        session (Session, optional): _description_. Defaults to Depends(get_session).

    Returns:
        framework id
    """    
    framework = framework_models.Frameworks(
        framework_name=details.framework_name, 
        description=details.description, 
        user_id=user.id,
        is_official_framework=False,
        E=category_weightings.E,
        S=category_weightings.S,
        G=category_weightings.G,
    )
    session.add(framework)
    session.commit()
    
    objects_to_insert = []

    for metric in metrics:
        new_metric = framework_models.CustomMetrics(
            framework_id=framework.id,
            category=metric.category,
            metric_id=metric.metric_id,
            weighting=metric.weighting,
            user_id=user.id
        )
        objects_to_insert.append(new_metric)

    session.add_all(objects_to_insert)
    session.commit()
    return framework.id

@app.put("/framework/modify/", tags=["Framework"])
async def modify_custom_framework(
    framework_id: int,
    request: framework_schemas.UpdateCustomFramework,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) :
    """_summary_: Allows user to update custom made framework details only
        - Please check on frontend first 
    Args:
        framework_id (int): _description_
        request (framework_schemas.UpdateCustomFramework): _description_
        user (user_schemas.UserInDB, optional): _description_. Defaults to Depends(get_user).
        session (Session, optional): _description_. Defaults to Depends(get_session).

    Returns: message on success
    """    
    framework = session.query(framework_models.Frameworks).get(framework_id)
    
    if framework.is_official_framework:
        raise HTTPException(
          status_code=status.HTTP_400_BAD_REQUEST,
          detail="Cannot modify official framework",
        )
    framework.framework_name = request.framework_name 
    framework.description = request.description
    session.commit()
    return {"message" : f"Successfully modified framework details {framework_id}"}

@app.put("/framework/modify_metrics/", tags=["Framework"])
async def modify_framework_metrics(
    framework_id: int,
    metrics: List[framework_schemas.CustomFrameworkMetrics],
    category_weightings: framework_schemas.CategoryWeights,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    """_summary_: modify a framework. 
        Metrics and weightings can be modified for user defined frameworks.
        Only metric weights can be modified for official frameworks. 
        - Check for this on frontend please??
    Args:
        framework_details (framework_schemas.Framework): _description_
        metrics (List[framework_schemas.ModifyFrameworkMetrics]): _description_
        user (user_schemas.UserInDB, optional): _description_. Defaults to Depends(get_user).
        session (Session, optional): _description_. Defaults to Depends(get_session).

    Returns: message on success
    """    
    framework = session.query(framework_models.Frameworks).get(framework_id)
    # could do check here for not modifying official metrics
    # update category weights
    framework.E = category_weightings.E
    framework.S = category_weightings.S
    framework.G = category_weightings.G
    
    # delete all previous rows for that framework 
    statement = delete(framework_models.CustomMetrics).where(
        and_(
            framework_models.CustomMetrics.framework_id == framework_id,
        )
    )
    session.execute(statement)
    session.commit()

    objects_to_insert = []

    for metric in metrics:
        new_metric = framework_models.CustomMetrics(
            framework_id=framework_id,
            category=metric.category,
            metric_id=metric.metric_id,
            weighting=metric.weighting,
            user_id=user.id,
        )
        objects_to_insert.append(new_metric)

    session.add_all(objects_to_insert)
    session.commit()

    return {"message" : f"Successfully modified framework metrics {framework_id}"}

# route to delete framework - can only delete custom frameworks
@app.delete("/framework", tags=["Framework"])
async def delete_framework(
    framework_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    """_summary_: Delete a custom made framework only.

    Args:
        framework_id (int): _description_
        user (user_schemas.UserInDB, optional): _description_. Defaults to Depends(get_user).
        session (Session, optional): _description_. Defaults to Depends(get_session).

    Returns: message on success
    """    
    framework = session.query(framework_models.Frameworks).get(framework_id)

    if framework.is_official_framework:
        raise HTTPException(
          status_code=status.HTTP_400_BAD_REQUEST,
          detail="Cannot delete official framework",
        )
        
    statement = delete(framework_models.CustomMetrics).where(
        and_(
            framework_models.CustomMetrics.framework_id == framework_id,
        )
    )
    session.execute(statement)
    statement = delete(framework_models.Frameworks).where(
        framework_models.Frameworks.id == framework_id,
    )
    session.execute(statement)
    session.commit()
    return {"message" : f"Successfully deleted framework {framework_id}"}

# calculate framework score
@app.get("/framework/score/", tags=["Framework"])
async def get_framework_score(
    # is_official_framework: bool = Query(...), 
    # framework_id: int = Query(...),
    framework_id: int,
    company_name: str,
    year: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) -> int:

    framework = session.query(framework_models.Frameworks).get(framework_id)
    total_score = 0
    categories = ["E", "S", "G"]
    
    for category in categories:
        metrics = await get_framework_metrics_by_category(framework_id, category, user, session)
        
        score = 0
        for metric in metrics:
            metric_value = await calculate_metric(metric.metric_id, company_name, 2023, user, session)
            
            score += metric_value * metric.weighting

        category_weighting = getattr(framework, category, 0)

        total_score += score * category_weighting
    return score

#***************************************************************
#                        Indicator Apis
#***************************************************************
@app.get("/indicators", tags=["Indicators"])
def get_indicators(
    metric_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) :
    # fix to return custom indicators
    return session.query(metrics_models.MetricIndicators).filter_by(metric_id=metric_id).all()

@app.get("/indicators/all", tags=["Indicators"])
async def get_all_indicators(
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) :
    indicators = session.query(metrics_models.Indicators).all()
    
    return indicators

@app.get("/indicator", tags=["Indicators"])
async def get_indicator(
    indicator_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) :
    return session.query(metrics_models.Indicators).get(indicator_id)
    
#***************************************************************
#                        Metric Apis
#***************************************************************
@app.get("/metric", response_model=str, tags=["Metrics"])
async def get_metric_name(
    metric_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) -> str :
    metric = session.query(metrics_models.Metrics).filter_by(id=metric_id).first()
      
    return metric.name 

@app.get("/metrics", tags=["Metrics"])
async def get_all_metrics(
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) :
    # fix this later 
    metrics = session.query(metrics_models.Metrics).limit(54).all()
      
    return metrics 

@app.post("/metric/modify", tags=["Metrics"])
def modify_metric(
    metric_id: int,
    indicators: List[metric_schemas.ModifyMetric],
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) :
    """_summary_: TO DO
    """    
    return []

# fix to get by year and apply weighting!
@app.get("/calculate_metric", tags=["Metrics"])
# need to modify this to the metric for a given year!!!
async def calculate_metric(
    metric_id: int,
    company_name: str,
    # year filter
    year: int,
    # indicators: List[metrics_models.MetricIndicators] = Depends(get_indicators),
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) :
    file_name = 'db/metrics.json'
    # Open and read the JSON file
    with open(file_name, 'r') as file:
        indicator_data = json.load(file)
        
    # fix this later
    overall_score = 0
    indicators = get_indicators(metric_id, user, session)
    for indicator in indicators:
        print(type(indicator))
        print(indicator)
    indicator_names = [indicator.indicator_name for indicator in indicators]
    values = session.query(company_models.CompanyData).filter(
        company_models.CompanyData.company_name == company_name,
        company_models.CompanyData.indicator_name.in_(indicator_names),
    ).all()

    for value in values:
        if value.indicator_value is None:
            # indicator does not exist for that company for that year
            continue
          
        indicator_scaling = indicator_data[value.indicator_name]
        if indicator_scaling["indicator"] == "positive":
            lower = indicator_scaling["lower"]
            higher = indicator_scaling["higher"]
            scaled_score = 100*(value.indicator_value - lower)/(higher - lower)
        else:
            lower = indicator_scaling["lower"]
            higher = indicator_scaling["higher"]
            scaled_score = 100*(higher - value.indicator_value)/(higher - lower)
        overall_score += scaled_score
  
    return overall_score / len(indicators)
  
@app.get("/metrics/category", tags=["Framework"])
async def get_metrics_by_category(
    category: Category,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    """_summary_: TO DO
    """   
    # TO DO: GET ALL METRICS IN A CATEGORY!!
    return []
#***************************************************************
#                        Industry Apis
#***************************************************************
@app.get("/industry", tags=["Industry"])
async def get_industry(
    company_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) :
    
    company = session.query(company_models.Company).filter_by(id=company_id).first()
      
    return "Unknown" if company.industry is None else company.industry  
  
@app.get("/industry", tags=["Industry"])
async def get_industry(
    company_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) :
    company = session.query(company_models.Company).filter_by(id=company_id).first()   
    return "Unknown" if company.industry is None else company.industry  

@app.get("/industries", tags=["Industry"])
async def get_industries(
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) :
    """_summary_: DONT RUN THIS IS FAR TOO SLOW - I WILL JUST SAVE THE INDUSTRIES

    Args:
        user (user_schemas.UserInDB, optional): _description_. Defaults to Depends(get_user).
        session (Session, optional): _description_. Defaults to Depends(get_session).

    Returns:
        _type_: _description_
    """    
    industries = session.query(company_models.Company).distinct(company_models.Company.industry).all()   
    return industries
  
@app.get("/industry/companies", tags=["Industry"])
async def get_companies_in_industry(
    industry: str,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) :
    companies = session.query(company_models.Company).filter_by(industry=industry).all()
      
    return companies
  
# ignore
@app.get("/industry/average/", tags=["Industry"])
async def get_industry_average(
    industry: str,
    framework_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) :
    """_summary_: ignore right now!

    Returns:
        _type_: _description_
    """    
    # fix - get average for an industry for a framework 
    companies = session.query(company_models.Company).filter_by(industry=industry).all()
    
    return companies