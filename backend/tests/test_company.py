import random
import string
import pytest
from fastapi import status
from httpx import AsyncClient
import pytest_asyncio
from src.main import app

@pytest_asyncio.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.mark.asyncio
async def test_get_company_by_batch(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Get companies by batch
    response = await client.get("/company", headers={"Authorization": f"Bearer {token}"}, params={
        "page": 1,
        "search": ""
    })
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)
    assert len(response.json()) <= 20


@pytest.mark.asyncio
async def test_get_company_news_sentiment(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Get company news sentiment
    response = await client.get("/company/news/sentiment", headers={"Authorization": f"Bearer {token}"}, params={
        "ticker": "AAPL"
    })
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_company(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Get a specific company
    response = await client.get("/company/1", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), dict)

@pytest.mark.asyncio
async def test_get_company_indicators(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Get company indicators
    response = await client.get("/company/indicators/SomeCompany", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), dict)

@pytest.mark.asyncio
async def test_get_company_info(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Get company information
    response = await client.get("/company/information/SomeCompanyCode", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), dict)

@pytest.mark.asyncio
async def test_get_company_history(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Get company history
    response = await client.get("/company/history/SomeCompanyCode,1mo", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), dict)

@pytest.mark.asyncio
async def test_get_company_sustainability(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Get company sustainability
    response = await client.get("/company/sustainability/SomeCompanyCode", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), dict)