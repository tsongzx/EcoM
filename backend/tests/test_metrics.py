import pytest
from httpx import AsyncClient
from fastapi import status
import pytest_asyncio
from src.main import app

@pytest_asyncio.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.mark.asyncio
async def test_get_metric_name(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Get metric name for a metric ID
    response = await client.get("/metric", headers={"Authorization": f"Bearer {token}"}, params={"metric_id": 1})
    
    assert response.status_code == status.HTTP_200_OK
    metric = response.json()
    
    assert metric["name"] == "Carbon Emissions"

@pytest.mark.asyncio
async def test_get_all_metrics(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Get all metrics
    response = await client.get("/metrics", headers={"Authorization": f"Bearer {token}"})
    
    assert response.status_code == status.HTTP_200_OK
    metrics_dict = response.json()
    
    assert isinstance(metrics_dict, dict)
