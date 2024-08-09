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
async def test_get_industry(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    company_id = 12720

    response = await client.get("/industry", headers={"Authorization": f"Bearer {token}"}, params={"company_id": company_id})

    assert response.status_code == status.HTTP_200_OK
    industry = response.json()

    assert industry == "E-Commerce"  

@pytest.mark.asyncio
async def test_get_industry_info(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    industry = "Advertising & Marketing"

    response = await client.get(f"/industry/info/{industry}", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == status.HTTP_200_OK
    industry_info = response.json()

    # Replace with expected industry details
    assert industry_info["industry"] == industry
    assert industry_info['description'] == """The advertising industry is the global industry of public relations and marketing companies, media services, and advertising agencies."""

@pytest.mark.asyncio
async def test_get_industries(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    response = await client.get("/industries", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == status.HTTP_200_OK
    industries = response.json()

    assert isinstance(industries, list)


@pytest.mark.asyncio
async def test_get_companies_in_industry(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    industry = "E-Commerce"
    search = "Am"
    page = 1

    response = await client.get("/industry/companies", headers={"Authorization": f"Bearer {token}"}, params={
        "page": page,
        "industry": industry,
        "search": search
    })

    assert response.status_code == status.HTTP_200_OK
    companies = response.json()

    assert isinstance(companies, list)
    assert len(companies) <= 20  


@pytest.mark.asyncio
async def test_get_recommended_companies(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    industry = "E-Commerce"

    response = await client.get("/industry/companies/recommended", headers={"Authorization": f"Bearer {token}"}, params={"industry": industry})

    assert response.status_code == status.HTTP_200_OK
    companies = response.json()

    assert isinstance(companies, list)
    assert len(companies) <= 10
