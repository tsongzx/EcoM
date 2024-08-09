import pytest
from fastapi import status
from httpx import AsyncClient
import pytest_asyncio
from src.main import app

@pytest_asyncio.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
        
async def test_get_indicators_for_metric(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Get indicators for metric ID 2
    response = await client.get("/indicators/metric", headers={"Authorization": f"Bearer {token}"}, params={"metric_id": 2})
    
    assert response.status_code == status.HTTP_200_OK
    indicators = response.json()

    # Extract IDs from the list of indicators
    indicator_ids = [indicator["id"] for indicator in indicators]
    
    # Expected indicator IDs
    expected_ids = {36, 40, 31, 46}
    
    # Check if the returned IDs match the expected IDs
    assert set(indicator_ids) == expected_ids
    

@pytest.mark.asyncio
async def test_get_all_indicators_dict_by_id(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]
    
    # Retrieve all indicators by ID
    response = await client.get("/indicators/all_by_id", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), dict)
    

@pytest.mark.asyncio
async def test_get_all_indicators_dict_by_name(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Retrieve all indicators by name
    response = await client.get("/indicators/all_by_name", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), dict)


@pytest.mark.asyncio
async def test_get_indicator(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Get the indicator with ID 1
    response = await client.get("/indicator", headers={"Authorization": f"Bearer {token}"}, params={"indicator_id": 1})
    
    assert response.status_code == status.HTTP_200_OK
    indicator = response.json()

    # Check if the indicator details match the expected values
    assert indicator["id"] == 1
    assert indicator["description"] == "Does the company claim to have an ISO 14000 or EMS certification?"
    assert indicator["name"] == "ISO14000"
    assert indicator["unit"] == "Yes/No"
    assert indicator["pillar"] == "S"
    assert indicator["source"] == "ClarityAI"