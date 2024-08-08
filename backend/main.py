from typing import Literal
import asyncio
from urllib.parse import urljoin
from sklearn.linear_model import LinearRegression
from fastapi import Depends, FastAPI, HTTPException, status, Query
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
import numpy as np
from auth import generate_token, is_authenticated, authenticate_user, hash_password
from schemas.predictive_schemas import PredictiveIndicators
from db import Base, engine, SessionLocal
from user import get_user_using_id, get_user_object_using_id
from sqlalchemy.orm import Session
from route_tags import tags_metadata
import schemas.user_schemas as user_schemas
import schemas.industry_schemas as industry_schemas
import schemas.list_schemas as list_schemas
import schemas.graph_schemas as graph_schemas
import schemas.framework_schemas as framework_schemas
import schemas.metric_schemas as metric_schemas
import schemas.chat_schemas as chat_schemas
import schemas.score_schemas as score_schemas
import models.company_models as company_models
import models.framework_models as framework_models
import models.list_models as list_models
import models.metrics_models as metrics_models
import models.user_models as user_models
import models.industry_models as industry_models
import json
from sqlalchemy import delete, and_, or_, distinct
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
from config import Config
from typing import List, Any, Dict, Optional, Union
from openai import OpenAI
import os
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup
import liveData
import metrics
import asyncio
from collections import defaultdict

load_dotenv()
print(os.environ.get("OPENAI_API_KEY"))
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
alpha_client = os.getenv("ALPHA_VANTAGE_API_KEY")


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
    # Replace with your frontend URL in production
    allow_origins=["http://localhost:3000"],
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
    access_token_expires = timedelta(
        days=Config.ACCESS_TOKEN_EXPIRE_DAYS)
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
    existing_user = session.query(
        user_models.User).filter_by(email=user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    hashed_password = hash_password(user.password)

    new_user = user_models.User(
        full_name=user.full_name, email=user.email, password=hashed_password)

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return await get_token(new_user)

# ***************************************************************
#                        User Functions
# ***************************************************************


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
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot reuse old password")

    if request.new_password != request.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match")

    encrypted_password = hash_password(request.new_password)
    user.password = encrypted_password
    session.commit()

    # alternatively just return empty {}
    return {"message": "Password changed successfully"}


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

# ***************************************************************
#                        List Apis
# ***************************************************************


@app.get("/lists", tags=["Lists"])
async def get_lists(
    user: user_schemas.UserInDB = Depends(get_user),
    # authorization: str = Depends(security),
    session: Session = Depends(get_session),
):
    lists = session.query(list_models.UserList).filter(
        list_models.UserList.user_id == user.id).all()

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
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="List doesn't exist. Invalid list id.")

    companies = session.query(
        list_models.List).filter_by(list_id=list.id).all()
    return companies


@app.post("/list", tags=["List"], response_model=list_schemas.ListCreate)
# returns companies in a list
async def create_list(
    list_name: str,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) -> list_schemas.ListCreate:
    existing_list = session.query(list_models.UserList).filter_by(
        user_id=user.id).filter_by(list_name=list_name).first()
    if existing_list:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="List name already in use")

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
    new_list = list_models.UserList(
        id=new_list_id, user_id=user.id, list_name=list_name)

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
    statement = delete(list_models.UserList).where(
        list_models.UserList.id == list_id)
    session.execute(statement)
    statement = delete(list_models.List).where(
        list_models.List.list_id == list_id)
    session.execute(statement)

    session.commit()

    return {"message": f"Successfully deleted list {list_id}"}


@app.post("/list/company", tags=["List"])
# returns companies in a list
async def add_company_to_list(
    request: list_schemas.CompanyToListMapping,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    company = session.query(company_models.Company).get(request.company_id)
    list = session.query(list_models.UserList).get(request.list_id)

    if company is None or list is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Company or list does not exist")

    existing_company = session.query(list_models.List).filter_by(list_id=request.list_id)\
        .filter_by(company_id=request.company_id)\
        .first()

    if existing_company:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Company already added to list")

    new_company = list_models.List(
        list_id=request.list_id, company_id=request.company_id)

    session.add(new_company)
    session.commit()
    session.refresh(new_company)

    return {"message": f"Successfully added {company.company_name} to list {request.list_id}"}


@app.get("/list/company", tags=["List"])
# returns companies in a list
async def is_company_in_list(
    list_id: int,
    company_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) -> bool:
    company = session.query(company_models.Company).get(company_id)
    list = session.query(list_models.UserList).get(list_id)
    if company is None or list is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Company or list does not exist")

    existing_company = session.query(list_models.List).filter_by(list_id=list_id)\
        .filter_by(company_id=company_id)\
        .first()

    return True if existing_company else False


@app.delete("/list/company", tags=["List"])
async def delete_company_from_list(
    list_id: int = Query(...),
    company_id: int = Query(...),
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    statement = delete(list_models.List).where(
        (list_models.List.list_id == list_id) & (list_models.List.company_id == company_id))
    session.execute(statement)
    session.commit()

    return {"message": f"Successfully deleted company {company_id} from list {list_id}"}


# to do: add error codes
# from pydantic import BaseModel
# # Define your models here like
# class model200(BaseModel):
#     message: str = ""

# @api.get("/my-route/", responses={200: {"response": model200}, 404: {"response": model404}, 500: {"response": model500}})
#     async def api_route():
#         return "I'm a wonderful route"
# ***************************************************************
#                        Watclist Apis
# ***************************************************************

@app.get("/watchlist", tags=["Watchlist"])
async def get_watchlist(
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    watchlist = session.query(list_models.WatchList).filter(
        list_models.WatchList.user_id == user.id).first()

    if watchlist == None:
        return []
    watchlist_companies = session.query(list_models.List).filter(
        list_models.List.list_id == watchlist.id).all()
    return watchlist_companies


@app.delete("/watchlist", tags=["Watchlist"])
async def delete_from_watchlist(
    company_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    watchlist_id = session.query(list_models.WatchList).filter(
        list_models.WatchList.user_id == user.id).first().id
    statement = delete(list_models.List).where(
        (list_models.List.list_id == watchlist_id) & (list_models.List.company_id == company_id))
    session.execute(statement)
    session.commit()

    return {"message": f"Successfully deleted company from watchlist"}


@app.post("/watchlist", tags=["Watchlist"])
async def add_to_watchlist(
    company_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    watchlist = session.query(list_models.WatchList).filter(
        list_models.WatchList.user_id == user.id).first()
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
        new_watchlist = list_models.WatchList(
            id=new_watchlist_id, user_id=user.id)
        session.add(new_watchlist)
        session.commit()
        watchlist_id = new_watchlist.id
    else:
        watchlist_id = watchlist.id
    check_if_exists = session.query(list_models.List).where(
        list_models.List.list_id == watchlist_id).where(list_models.List.company_id == company_id).first()
    if check_if_exists is None:
        new_watchlist_company = list_models.List(
            list_id=watchlist_id, company_id=company_id)
        session.add(new_watchlist_company)
        session.commit()
        session.refresh(new_watchlist_company)
        return {"message": f"Successfully added company to watchlist"}
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Company already exists in watchlist")

# ***************************************************************
#                        Recently viewed Apis
# ***************************************************************


@app.get("/recently_viewed", tags=["recents"])
async def get_recently_viewed(
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    recentList = session.query(list_models.RecentList).filter(
        list_models.RecentList.user_id == user.id).first()
    if recentList == None:
        return []
    recentCompanies = session.query(list_models.List).filter(
        list_models.List.list_id == recentList.id).order_by(list_models.List.id.desc()).all()
    return recentCompanies


@app.post("/recently_viewed", tags=["recents"])
async def add_to_recently_viewed(
    company_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    recentList = session.query(list_models.RecentList).filter(
        list_models.RecentList.user_id == user.id).first()
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
        new_recent_list = list_models.RecentList(
            id=new_recent_id, user_id=user.id)
        session.add(new_recent_list)
        session.commit()
        recent_id = new_recent_list.id
    else:
        recent_id = recentList.id
    recent_companies_length = session.query(list_models.List).filter(
        list_models.List.list_id == recent_id).count()

    check_if_exists = session.query(list_models.List).where(
        list_models.List.list_id == recent_id).where(list_models.List.company_id == company_id).first()
    if check_if_exists is not None:
        statement = check_if_exists
        session.delete(statement)
        session.commit()

    if recent_companies_length > 5:
        statement = session.query(list_models.List).where(
            list_models.List.list_id == recent_id).order_by(list_models.List.id).first()

        session.delete(statement)
        session.commit()

    new_recent = list_models.List(list_id=recent_id, company_id=company_id)
    session.add(new_recent)
    session.commit()
    session.refresh(new_recent)

    return {"message": f"Successfully added company to recent list"}


# ***************************************************************
#                        Company Apis
# ***************************************************************

@app.get("/company", tags=["company"])
async def get_company_by_batch(
    page: int,
    search: str,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    offset = (page - 1) * 20

    search = search.strip()
    print(f'page: {page}')

    if search:
        query = session.query(company_models.Company).filter(
            company_models.Company.company_name.like(f"{search}%")
        )
    else:
        query = session.query(company_models.Company)

    # Apply pagination and limit the results
    companyData = query.offset(offset).limit(20).all()
    return companyData


# @app.get("/company/all", tags=["company"])
# async def get_all_company(
#     user: user_schemas.UserInDB = Depends(get_user),
#     session: Session = Depends(get_session),
# ):
#     companyData = session.query(
#         company_models.Company).all()
#     return companyData


@app.get("/company/all", tags=["company"])
async def get_all_company(
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    companyData = session.query(
        company_models.Company).all()
    return companyData

# ***************************************************************
#                        Report Apis
# ***************************************************************


@app.get("/company/news/sentiment", tags=["company"])
async def get_company_news_sentiment(
    ticker: str,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    # CLAIRE: THE API KEY DOES NOT WORK FULLY SO CURRENTLY HARDCODED
    url = f'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers={
        ticker}&apikey=QO74GE9362PLVHDU'

    r = requests.get(url)
    data = r.json()

    if 'feed' not in data:
        return {}

    print(data)
    extracted_info = []
    for info in data['feed']:
        extracted_info.append(
            {'Article Title': info['title'], 'URL': info['url']})

    return extracted_info


@app.get("/company/{company_id}", tags=["company"])
async def get_company(
    company_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    companyData = session.query(company_models.Company).filter(
        company_models.Company.id == company_id).first()
    return companyData


@app.get("/company/indicators/{company_name}", tags=["company"])
async def get_company_indicators(
    company_name: str,
    # year: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    company_data = session.query(company_models.CompanyData).filter(
        company_models.CompanyData.company_name == company_name,
        # company_models.CompanyData.indicator_year_int == company_name,
    ).all()

    by_year = {}
    for entry in company_data:
        if entry.indicator_year_int not in by_year:
            by_year[entry.indicator_year_int] = {}

        by_year[entry.indicator_year_int][entry.indicator_name] = entry
    return by_year


# Company's Live information
# Returns a dictionary of several live Company Information
@app.get("/company/information/{company_code}", tags=["company"])
async def get_company_info(
    company_code: str,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    info = liveData.getCompanyInfo(company_code)
    return info

# Company's Live Stock History
# Get the Company's Stock Price history, period is how far the history
# will date back into for example: 1 month is "1mo", 5 days would be "5d"


@app.get("/company/history/{company_code},{period}", tags=["company"])
async def get_company_history(
    company_code: str,
    period: str,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    hist = liveData.getCompanyHist(company_code, period)
    return hist

# Company's Live ESG Ratings
# This data will return a dataframe, please check the
# exampleReturnSustainbility.txt file to see an example
# If you would like me to return any value please let me (Geoffrey) know


@app.get("/company/sustainability/{company_code}", tags=["company"])
async def get_company_sustainability(
    company_code: str,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    sustainability = liveData.getCompanyESG(company_code)
    return sustainability


@app.post("/companies/{industry}", tags=["company"])
async def get_companies_by_industry_by_country(
    industry: str,
    filter: industry_schemas.CompanyFilter,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    offset = (filter.page - 1) * 20

    print(f'page: {filter.page}')

    if industry == 'Unknown':
        query = session.query(company_models.Company).filter(
            company_models.Company.industry == None
        )
    else:
        query = session.query(company_models.Company).filter(
            company_models.Company.industry == industry
        )

    # if filter.countries:
    query = query.filter(
        company_models.Company.headquarter_country.in_(filter.countries)
    )
    return {'total': query.count(), 'companies': query.offset(offset).limit(20).all()}
  
@app.post("/company/framework/average/", tags=["company"]) 
async def get_framework_companies_average(
    request: score_schemas.ESGScore,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) -> dict:
    frameworks = session.query(framework_models.Frameworks).filter(
        framework_models.Frameworks.is_official_framework == True
    ).all()
    
    if not frameworks:
        return {"error": "No frameworks found"}

    # Fetch framework metrics once and cache them
    framework_metrics_cache = {}
    for framework in frameworks:
        framework_metrics_cache[framework.id] = await get_framework_metrics(framework.id, user, session)

    company_scores = {}

    for company_name in request.companies:
        scores = []
        companyData = await get_company_indicators(company_name, user, session)
        print(f"Company Data for {company_name}: {companyData}")

        for framework in frameworks:
            framework_metrics = framework_metrics_cache[framework.id]
            
            category_metrics = defaultdict(list)
            for metric in framework_metrics:
                category = metric.category
                category_metrics[category].append(metric)
                
            framework_score = 0
            for category, metrics in category_metrics.items():
                metric_values = await asyncio.gather(
                    *[calculate_metric_company_view(companyData.get(request.year, {}), {indicator.indicator_name: indicator.weighting for indicator in get_indicators(framework.id, metric.metric_id, user, session)},
                                                        user, session) for metric in metrics]
                )
                category_score = sum(value * metric.weighting for value, metric in zip(metric_values, metrics))
                category_weighting = getattr(framework, category, 0)
                framework_score += category_score * category_weighting

            scores.append(framework_score)
            print(f"Framework Score for {framework.framework_name} and {company_name}: {framework_score}")

        company_scores[company_name] = sum(scores) / len(scores) if scores else 0
        print(f"Company Score for {company_name}: {company_scores[company_name]}")

    return company_scores
  
# @app.get("/company/framework/average/", tags=["company"])
# async def get_framework_company_average(
#     company_name: str,
#     year: int,
#     user: user_schemas.UserInDB = Depends(get_user),
#     session: Session = Depends(get_session),
# ) -> float:
    
#     frameworks = session.query(framework_models.Frameworks).filter(
#         framework_models.Frameworks.is_official_framework == True
#     ).all()
    
#     if not frameworks:
#         return 0 

#     scores = []
#     categories = ["E", "S", "G"]
    
#     companyData = await get_company_indicators(company_name, user, session)

#     for framework in frameworks:
#         # Fetch all metrics for this framework and all categories - dont remove comments yet
#         # category_metrics = await asyncio.gather(
#         #     *[get_framework_metrics_by_category(framework.id, category, user, session) for category in categories]
#         # )
#         framework_metrics = await get_framework_metrics(framework.id, user, session)
        
#         category_metrics = defaultdict(list)
#         for metric in framework_metrics:
#             category = metric.category
#             category_metrics[category].append(metric)
            
#         framework_score = 0
#         for category, metrics in category_metrics.items():
#         # for category, metrics in zip(categories, category_metrics):
#             # Fetch all metric values concurrently
#             print(f"categry {category}")
#             print(metrics)
#             metric_values = await asyncio.gather(
#                 *[calculate_metric_company_view(companyData[year], {indicator.indicator_name: indicator.weighting for indicator in get_indicators(framework.id, metric.metric_id, user, session)},
#                                                 user, session) for metric in metrics]
#             )
#             print(metric_values)
#             category_score = sum(value * metric.weighting for value, metric in zip(metric_values, metrics))
#             print(category_score)
#             category_weighting = getattr(framework, category, 0)
#             framework_score += category_score * category_weighting
#             print(framework_score)
#         scores.append(framework_score)

#     for framework in frameworks:
#       print(framework.framework_name)
#     print(scores)
#     return sum(scores) / len(scores) if scores else 0
# ***************************************************************
#                        Framework Apis
# ***************************************************************


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
    metrics = session.query(framework_models.CustomMetrics).filter_by(
        framework_id=framework_id).all()

    # if no metrics found, no custom metric weights have been set for official framework
    if len(metrics) == 0:
        metrics = session.query(framework_models.OfficialFrameworkMetrics).filter_by(
            framework_id=framework_id).all()

    return metrics

Category = Literal["E", "S", "G"]


@app.get("/framework/metrics/category/", tags=["Framework"])
async def get_framework_metrics_by_category(
    framework_id: int,
    category: Category,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    metrics = session.query(framework_models.CustomMetrics).filter_by(framework_id=framework_id,
                                                                      category=category).all()

    # if no metrics found, no custom metric weights have been set for official framework
    if len(metrics) == 0:
        metrics = session.query(framework_models.OfficialFrameworkMetrics).filter_by(framework_id=framework_id,
                                                                                     category=category).all()

    return metrics


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
):
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
    return {"message": f"Successfully modified framework details {framework_id}"}


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

    return {"message": f"Successfully modified framework metrics {framework_id}"}

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
    return {"message": f"Successfully deleted framework {framework_id}"}

# calculate framework score
# CHANGE THIS CLAIRE


@app.get("/framework/score/", tags=["Framework"])
async def get_framework_score(
    framework_id: int,
    company_name: str,
    year: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) -> float:
    """_summary_: TO DO: USE BATCH PROCESSSING. ACCEPT MULTIPLE
    FRAMEWORKS / COMPANY_NAMES / YEARS AT ONCE
    """
    framework = session.query(framework_models.Frameworks).get(framework_id)
    total_score = 0
    categories = ["E", "S", "G"]

    for category in categories:
        metrics = await get_framework_metrics_by_category(framework_id, category, user, session)
        print("calculating category score for framework")

        score = 0
        for metric in metrics:
            print("calculating metric score for framework")
            print(metric.metric_id)
            metric_value = await calculate_metric(framework_id, metric.metric_id, company_name, year, user, session)
            score += metric_value * metric.weighting

        category_weighting = getattr(framework, category, 0)

        total_score += score * category_weighting
    return total_score
# ***************************************************************
#                        Indicator Apis
# ***************************************************************


@app.get("/indicators", tags=["Indicators"])
def get_indicators(
    framework_id: int,
    metric_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    """_summary_: retrieves indicators for a specific framework

    Args:
        framework_id (int): _description_
        metric_id (int): _description_
        user (user_schemas.UserInDB, optional): _description_. Defaults to Depends(get_user).
        session (Session, optional): _description_. Defaults to Depends(get_session).

    Returns:
        _type_: list of indicators 
    """
    # get custom weights
    indicators = session.query(metrics_models.CustomMetricIndicators).filter_by(metric_id=metric_id,
                                                                                user_id=user.id,
                                                                                framework_id=framework_id).all()
    # if custom weights don't exist, use default
    if len(indicators) == 0:
        indicators = session.query(metrics_models.MetricIndicators).filter_by(
            metric_id=metric_id).all()
    return indicators


@app.get("/indicators/metric", tags=["Indicators"])
def get_indicators_for_metric(
    metric_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    """_summary_: retrieves indicators for a metric (not unique to a framework)

    Args:
        framework_id (int): _description_
        metric_id (int): _description_
        user (user_schemas.UserInDB, optional): _description_. Defaults to Depends(get_user).
        session (Session, optional): _description_. Defaults to Depends(get_session).

    Returns:
        _type_: list of default indicators
    """
    indicators = session.query(metrics_models.MetricIndicators).filter_by(
        metric_id=metric_id).all()
    return indicators


@app.get("/indicators/all_by_id", tags=["Indicators"])
async def get_all_indicators_dict_by_id(
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    indicators = session.query(metrics_models.Indicators).all()

    indicators_dict = {}
    for entry in indicators:
        indicators_dict[entry.id] = entry
    return indicators_dict


@app.get("/indicators/all_by_name", tags=["Indicators"])
async def get_all_indicators_dict_by_name(
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    indicators = session.query(metrics_models.Indicators).all()

    indicators_dict = {}
    for entry in indicators:
        indicators_dict[entry.name] = entry
    return indicators_dict


@app.get("/indicator", tags=["Indicators"])
async def get_indicator(
    indicator_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    return session.query(metrics_models.Indicators).get(indicator_id)

# ***************************************************************
#                        Metric Apis
# ***************************************************************


@app.get("/metric", tags=["Metrics"])
async def get_metric_name(
    metric_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    metric = session.query(metrics_models.Metrics).filter_by(
        id=metric_id).first()

    return {"name": metric.name}


@app.get("/metrics", tags=["Metrics"])
async def get_all_metrics(
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    # fix this later
    metrics = session.query(metrics_models.Metrics).all()

    metrics_dict = {}
    for metric in metrics:
        if metric.category not in metrics_dict:
            metrics_dict[metric.category] = []
        metrics_dict[metric.category].append(metric)
    return metrics_dict


@app.post("/metric/modify", tags=["Metrics"])
def modify_metric(
    metric_id: int,
    framework_id: int,
    indicators: List[metric_schemas.CustomMetricIndicators],
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    # delete custom metric weightings if they exist
    statement = delete(metrics_models.CustomMetricIndicators).where(
        and_(
            metrics_models.CustomMetricIndicators.framework_id == framework_id,
            metrics_models.CustomMetricIndicators.metric_id == metric_id,
            metrics_models.CustomMetricIndicators.user_id == user.id,
        )
    )
    session.execute(statement)
    session.commit()

    objects_to_insert = []

    for indicator in indicators:
        new_indicator = metrics_models.CustomMetricIndicators(
            framework_id=framework_id,
            metric_id=metric_id,
            weighting=indicator.weighting,
            indicator_name=indicator.indicator_name,
            indicator_id=indicator.indicator_id,
            user_id=user.id,
        )
        objects_to_insert.append(new_indicator)

    session.add_all(objects_to_insert)
    session.commit()
    # indicator weights is unique for a framework
    return []


@app.get("/company/metric/indicators", tags=["Company"])
def get_company_indicators_by_metric(
    metric_id: int,
    company_name: str,
    year: int,
    indicators: List[Any] = Depends(get_indicators),
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    """_summary_: MAY NEED TO REMOVE YEAR FILTER
    """
    indicator_names = [indicator.indicator_name for indicator in indicators]
    values = session.query(company_models.CompanyData).filter(
        company_models.CompanyData.company_name == company_name,
        company_models.CompanyData.indicator_year_int == year,
        company_models.CompanyData.indicator_name.in_(indicator_names),
    ).all()

    return values


@app.get("/metric/score", tags=["Metrics"])
async def calculate_metric(
    metric_id: int,
    company_name: str,
    year: int,
    framework_id: Optional[Union[int, None]] = None,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) -> float:
    print("calculating metric")
    company_values = await get_company_indicators(company_name, user, session)

    if year not in company_values:
        return 0

    year_indicators = company_values[year]
    if framework_id:
        indicators = get_indicators_for_metric(metric_id, user, session)
    else:
        indicators = get_indicators(framework_id, metric_id, user, session)

    weights = {
        indicator.indicator_name: indicator.weighting for indicator in indicators}
    return metrics.calculate_metric(year_indicators, weights)


# ***************************************************************
#                        Industry Apis
# ***************************************************************

@app.get("/industry", tags=["Industry"])
async def get_industry(
    company_id: int,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    company = session.query(company_models.Company).filter_by(
        id=company_id).first()
    return "Unknown" if company.industry is None else company.industry


@app.get("/industry/info/{industry}", tags=["Industry"])
async def get_industry_info(
    industry: str,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    return session.query(industry_models.Industry).filter_by(
        industry=industry).first()


@app.get("/industries", tags=["Industry"])
async def get_industries(
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    with open('db/industries.json') as fp:
        data = json.load(fp)
        industries = ["Unknown" if entry.get(
            'industry') == None else entry.get('industry') for entry in data]

    print(industries)
    return industries


@app.get("/industry/companies", tags=["Industry"])
async def get_companies_in_industry(
    page: int,
    industry: str,
    search: str,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    offset = (page - 1) * 20

    search = search.strip()
    print(f'page: {page}')

    query = session.query(company_models.Company).filter_by(industry=industry)
    if search:
        query = query.filter(
            company_models.Company.company_name.like(f"{search}%")
        )

    # Apply pagination and limit the results
    companyData = query.offset(offset).limit(20).all()
    return companyData


@app.get("/industry/companies/recommended", tags=["Industry"])
async def get_recommended_companies(
    industry: str,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    companies = session.query(company_models.Company).filter_by(industry=industry).order_by(func.rand()).limit(10).all()
    
    return companies  
  

@app.get("/industry/averages/{industry}", tags=["Industry"])
async def get_indicator_industry_averages(
    industry: str,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    """_summary_: Retrieves indicator average for an industry
    """
    
    results = session.query(
        company_models.CompanyData.indicator_name,
        func.avg(company_models.CompanyData.indicator_value).label(
            'average_indicator_value')
    ).join(
        company_models.Company, company_models.Company.company_name == company_models.CompanyData.company_name
    ).filter(
        company_models.Company.industry == industry,
    ).group_by(
        company_models.CompanyData.indicator_name
    ).all()

    average_dict = {}
    for result in results:
      average_dict[result.indicator_name] = result.average_indicator_value
        
    return average_dict

# ***************************************************************
#                        Chatbot Apis
# ***************************************************************


@app.post("/chat", tags=["Chatbot"])
async def chat(
    user_query: chat_schemas.ChatQuery,
    user: user_schemas.UserInDB = Depends(get_user)
):
    instructions = "You are a chatbot for ESG NOW, you're purpose is to answer questions about the ESG platform and provide general desktop research using Open AI. You calculate various ESG scores out of 100, which is derived by the average of many metrics. Your 7 key frameworks are IFRS S1 Framework, Paris Agreement Framework, UNEP FI Framework, IFRS S2 Framework, TCFD Framework, TNFD Framework, APRA-CPG Framework You have over 70,000 companies in your data base. You can add companies to your watchlist, compare multiple companies at once, view industry averages etc."
    # see if this works as a way to personalise our chat bot
    prompt = """
    {}
    User: Tell me about yourself.
    Chatbot:
    """.format(instructions)

    # dont accept empty queries
    # Using GPT-4 with the ChatCompletion endpoint
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        # require accuracy
        temperature=0,
        # dont want the messages to be too long
        max_tokens=300,
        messages=[*Config.chat_prompts,
                  {"role": "user", "content": user_query.query}]
    )
    chatbot_response = response.choices[0].message.content
    # get records of chatbot responses
    Config.chat_prompts.append(
        {"role": "assistant", "content": chatbot_response})
    # message = response.choices[0].message.content
    print(chatbot_response)
    return {'response': chatbot_response}


# ***************************************************************
#                   Predictive Analysis Apis
# **************************************************************

def linear_regression(data: List[company_models.CompanyData]) -> float:

    years = np.array(
        [point.indicator_year_int for point in data]).reshape(-1, 1)
    values = np.array([point.indicator_value for point in data]).reshape(-1, 1)

    prediction = LinearRegression().fit(
        years, values).predict(np.array([[2025]]))
    return round(prediction[0][0], 2)


@app.get("/predictive", tags=["Predictive"])
async def get_predictive(
    indicator: str,
    metric_unit=str,
    company_name=str,
    session: Session = Depends(get_session),
    user: user_schemas.UserInDB = Depends(get_user)
) -> PredictiveIndicators:
    data = session.query(company_models.CompanyData).filter(
        company_models.CompanyData.indicator_name == indicator,
        company_models.CompanyData.company_name == company_name,
    ).all()

    if not isinstance(metric_unit, str):
        metric_unit = str(metric_unit)
        
    if not data:
        raise HTTPException(status_code=404, detail="Error")

    if "%" in metric_unit:
        prediction = linear_regression(data)
    elif metric_unit == 'Yes/No':
        values = [point.indicator_value for point in data]
        predicted_value = max(set(values), key=values.count)
        if predicted_value == 1:
            prediction = 'Yes'
        elif predicted_value == 0:
            prediction = 'No'
    else:
        # metric_unit in ["USD (000)", "Tons CO2e", "Tons", "Tons CO2", "Number of fatalities",  "Number of breaches",  "Number of days", "Hours/employee", "USD", "GJ", "Ratio", "Tons of NOx", "Tons of SOx", "Tons of VOC"]:
        prediction = linear_regression(data)

    return PredictiveIndicators(indicator_id=data[0].id, indicator_name=indicator, prediction=prediction)

# ***************************************************************
#                   Articles Apis
# **************************************************************


def access_articles(URL: str) -> List[Dict[str, str]]:
    page = requests.get(URL)
    if page.status_code == 200:
        soup = BeautifulSoup(page.content, "html.parser")
        articles = []
        results = soup.find_all('div', class_='text-component')

        for article in results:
            title_exists = article.find('h3')
            link_exists = article.find('a')

            if title_exists and link_exists:
                title = title_exists.text.strip()
                link = urljoin(URL, link_exists['href'].strip())
                if link.startswith("https://"):
                    link_page = requests.get(link)
                    if link_page.status_code == 404:
                        continue
                    articles.append({'title': title, 'link': link})

    return articles


@app.get("/articles", tags=["Articles"])
async def articles(
    URL: str,
    # token: str = Depends(oauth2_scheme),
    # session: Session = Depends(get_session)
) -> List[Dict[str, str]]:

    # token_data = await is_authenticated(session, token)
    # user = get_user_using_id(session, id=token_data.userId)

    return access_articles(URL)

# URL = "https://www.pwc.com.au/environment-social-governance.html"

# ***************************************************************
#                        Visualisation Apis
# ***************************************************************


@app.get("/graph/indicator/line", tags=["Graph"])
async def get_indicator_line_graph(
    companies:  List[str] = Query(..., description="List of company names"),
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    data_by_company = {}

    company_data = session.query(company_models.CompanyData).filter(
        company_models.CompanyData.company_name.in_(companies)).all()

    for entry in company_data:
        if entry.company_name not in data_by_company:
            data_by_company[entry.company_name] = {}

        if entry.indicator_name not in data_by_company[entry.company_name]:
            data_by_company[entry.company_name][entry.indicator_name] = []

        data_point = graph_schemas.IndicatorGraph(indicator=entry.indicator_name,
                                                  year=entry.indicator_year_int,
                                                  company=entry.company_name,
                                                  value=entry.indicator_value)

        data_by_company[entry.company_name][entry.indicator_name].append(
            data_point)

    return data_by_company


@app.get("/graph/indicator/bar", tags=["Graph"])
async def get_indicator_bar_graph(
    companies:  List[str] = Query(..., description="List of company names"),
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    data_by_indicator = {}

    company_data = session.query(company_models.CompanyData).filter(
        company_models.CompanyData.company_name.in_(companies)).all()

    for entry in company_data:
        if entry.indicator_name not in data_by_indicator:
            data_by_indicator[entry.indicator_name] = {}

        if entry.indicator_year_int not in data_by_indicator[entry.indicator_name]:
            data_by_indicator[entry.indicator_name][entry.indicator_year_int] = {
                'indicator': entry.indicator_name,
                'year': entry.indicator_year_int
            }

        # add company value
        data_by_indicator[entry.indicator_name][entry.indicator_year_int][entry.company_name] = entry.indicator_value

    return data_by_indicator


@app.get("/graph/metric/bar", tags=["Graph"])
async def get_metric_bar_graph(
    framework_id: int,
    companies:  List[str] = Query(..., description="List of company names"),
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    company_data = {}
    for company in companies:
        data = await get_company_indicators(company, user, session)
        company_data[company] = data

    years = await get_years(companies, user, session)
    data_by_metric = {}

    metrics = await get_framework_metrics(framework_id, user, session)

    for metric in metrics:
        indicators = get_indicators_for_metric(metric.metric_id, user, session)
        weights = {
            indicator.indicator_name: indicator.weighting for indicator in indicators}
        data_by_metric[metric.metric_id] = []
        for year in years:
            print(f'printing year: {year}')
            # company_indicators_year = company_data[year]
            data_point = {
                'year': year,
                'metric': metric.metric_id,
                'category': metric.category
            }
            for company in companies:
                if year not in company_data[company]:
                    continue
                metric_score = await calculate_metric_company_view(company_data[company][year], weights, user, session)
                print(f'metric score: {metric_score}')
                data_point[company] = metric_score

            data_by_metric[metric.metric_id].append(data_point)

    return data_by_metric
  
@app.get("/graph/framework/average/", tags=["Graph"])
async def get_framework_avg_line_graph(
    company_name: str,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    frameworks = session.query(framework_models.Frameworks).filter(
        framework_models.Frameworks.is_official_framework == True
    ).all()

    if not frameworks:
        return []

    years = await get_years([company_name], user, session)
    company_data = await get_company_indicators(company_name, user, session)

    # Pre-fetch and group metrics by category for each framework
    framework_metrics_map = defaultdict(lambda: defaultdict(list))
    indicators_map = {}

    for framework in frameworks:
        metrics = await get_framework_metrics(framework.id, user, session)
        for metric in metrics:
            framework_metrics_map[framework.id][metric.category].append(metric)
            if metric.metric_id not in indicators_map:
                indicators_map[metric.metric_id] = {
                    indicator.indicator_name: indicator.weighting
                    for indicator in get_indicators(framework.id, metric.metric_id, user, session)
                }

    graph_values = []

    for year in years:
        scores = []
        for framework in frameworks:
            framework_score = 0

            for category, metrics in framework_metrics_map[framework.id].items():
                metric_values = await asyncio.gather(
                    *[calculate_metric_company_view(company_data[year], indicators_map[metric.metric_id], user, session)
                      for metric in metrics]
                )

                category_score = sum(value * metric.weighting for value, metric in zip(metric_values, metrics))
                category_weighting = getattr(framework, category, 0)
                framework_score += category_score * category_weighting

            scores.append(framework_score)
        
        average = sum(scores) / len(scores) if scores else 0
        graph_values.append({
            'average': average,
            'year': year,
        })

    return graph_values

@app.get("/graph/framework", tags=["Graph"])
async def get_framework_line_graph(
    company_name: str,
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    frameworks = session.query(framework_models.Frameworks).filter(
        framework_models.Frameworks.is_official_framework == True
    ).all()

    if not frameworks:
        return []

    years = await get_years([company_name], user, session)
    company_data = await get_company_indicators(company_name, user, session)

    # Pre-fetch and group metrics by category for each framework
    framework_metrics_map = defaultdict(lambda: defaultdict(list))
    indicators_map = {}

    for framework in frameworks:
        metrics = await get_framework_metrics(framework.id, user, session)
        for metric in metrics:
            framework_metrics_map[framework.id][metric.category].append(metric)
            if metric.metric_id not in indicators_map:
                indicators_map[metric.metric_id] = {
                    indicator.indicator_name: indicator.weighting
                    for indicator in get_indicators(framework.id, metric.metric_id, user, session)
                }

    graph_values = []

    for year in years:
        year_scores = {
          'year': year
        }
        for framework in frameworks:
            framework_score = 0

            for category, metrics in framework_metrics_map[framework.id].items():
                metric_values = await asyncio.gather(
                    *[calculate_metric_company_view(company_data[year], indicators_map[metric.metric_id], user, session)
                      for metric in metrics]
                )

                category_score = sum(value * metric.weighting for value, metric in zip(metric_values, metrics))
                category_weighting = getattr(framework, category, 0)
                framework_score += category_score * category_weighting

            year_scores[framework.framework_name] = framework_score
            
        graph_values.append(year_scores)

    return graph_values
# ***************************************************************
#                        Year Apis
# ***************************************************************


@app.get("/years/", tags=["Years"])
async def get_years(
    companies:  List[str] = Query(..., description="List of company names"),
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    years = session.query(company_models.CompanyData.indicator_year_int)\
        .filter(company_models.CompanyData.company_name.in_(companies))\
        .distinct()\
        .all()

    year_list = [year.indicator_year_int for year in years]

    return sorted(year_list)

# ***************************************************************
#                        Company view Scoring Apis
# ***************************************************************


@app.post("/company/metric/", tags=["Company scores"])
async def calculate_metric_company_view(
    # company_indicators: Dict[str, Any],
    company_indicators: Dict[str, score_schemas.CompanyIndicator],
    indicators: Dict[str, float],
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
) -> float:
    """_summary_: company_indicators should only be for the year

    Returns:
        _type_: _description_
    """
    return metrics.calculate_metric(company_indicators, indicators)

# ***************************************************************
#                        Headquarter country Apis
# ***************************************************************


@app.get("/headquarter_countries/", tags=["Headquarter Countries"])
async def get_headquarter_countries(
    user: user_schemas.UserInDB = Depends(get_user),
    session: Session = Depends(get_session),
):
    companies = session.query(company_models.Company.headquarter_country)\
        .distinct()\
        .all()

    countries = [company.headquarter_country for company in companies]

    return sorted(countries)
