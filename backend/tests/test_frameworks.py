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
async def test_get_frameworks(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Get all frameworks
    response = await client.get("/frameworks/all", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_official_framework(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Get the framework by ID
    response = await client.get(f"/framework/1", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["framework_name"] == "IFRS S1"

@pytest.mark.asyncio
async def test_get_framework_metrics(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Get metrics for the framework
    response = await client.get(f"/framework/metrics/1", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_framework_metrics_by_category(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Create a framework and add metrics
    response = await client.post("/framework/create/", headers={"Authorization": f"Bearer {token}"}, json={
        "details": {
            "framework_name": "Test Framework Metrics Category",
            "description": "Test Description"
        },
        "category_weightings": {
            "E": 0.3,
            "S": 0.4,
            "G": 0.3
        },
        "metrics": [
            {"category": "E", "metric_id": 1, "weighting": 0.5},
            {"category": "E", "metric_id": 2, "weighting": 0.3}
        ]
    })
    framework_id = response.json()

    # Get metrics for the framework by category
    response = await client.get(f"/framework/metrics/category/", headers={"Authorization": f"Bearer {token}"}, params={
        "framework_id": framework_id,
        "category": "E"
    })
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) > 0
    # Delete the framework
    response = await client.delete("/framework", headers={"Authorization": f"Bearer {token}"}, params={
        "framework_id": framework_id
    })
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == f"Successfully deleted framework {framework_id}"

@pytest.mark.asyncio
async def test_create_framework(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Create a framework
    response = await client.post("/framework/create/", headers={"Authorization": f"Bearer {token}"}, json={
        "details": {
            "framework_name": "New Custom Framework",
            "description": "New Description"
        },
        "category_weightings": {
            "E": 0.5,
            "S": 0.3,
            "G": 0.2
        },
        "metrics": [
            {"category": "E", "metric_id": 1, "weighting": 0.4},
            {"category": "E", "metric_id": 2, "weighting": 0.4},
            {"category": "E", "metric_id": 3, "weighting": 0.2}
        ]
    })
    framework_id = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert isinstance(framework_id, int)

@pytest.mark.asyncio
async def test_modify_custom_framework(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Create a framework
    response = await client.post("/framework/create/", headers={"Authorization": f"Bearer {token}"}, json={
        "details": {
            "framework_name": "Framework to Modify",
            "description": "Initial Description"
        },
        "category_weightings": {
            "E": 0.3,
            "S": 0.3,
            "G": 0.4
        },
        "metrics": [
            {"category": "E", "metric_id": 1, "weighting": 0.5},
            {"category": "E", "metric_id": 2, "weighting": 0.5}
        ]
    })
    framework_id = response.json()

    # Modify the framework
    response = await client.put(f"/framework/modify/?framework_id={framework_id}", headers={"Authorization": f"Bearer {token}"}, json={
        "framework_name": "Modified Framework Name",
        "description": "Modified Description"
    })

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == f"Successfully modified framework details {framework_id}"
    # Delete the framework
    response = await client.delete("/framework", headers={"Authorization": f"Bearer {token}"}, params={
        "framework_id": framework_id
    })
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == f"Successfully deleted framework {framework_id}"
    
@pytest.mark.asyncio
async def test_modify_framework_metrics(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Create a framework and add metrics
    response = await client.post("/framework/create/", headers={"Authorization": f"Bearer {token}"}, json={
        "details": {
            "framework_name": "Framework to Modify Metrics",
            "description": "Initial Description"
        },
        "category_weightings": {
            "E": 0.4,
            "S": 0.4,
            "G": 0.2
        },
        "metrics": [
            {"category": "E", "metric_id": 1, "weighting": 0.4},
            {"category": "S", "metric_id": 2, "weighting": 0.6}
        ]
    })
    framework_id = response.json()

    response = await client.put(f"/framework/modify_metrics/?framework_id={framework_id}", headers={"Authorization": f"Bearer {token}"}, json={
        "category_weightings": {
            "E": 0.5,
            "S": 0.3,
            "G": 0.2
        },
        "metrics": [
            {"category": "E", "metric_id": 1, "weighting": 0.6},
            {"category": "S", "metric_id": 2, "weighting": 0.4}
        ]
    })
    
    print(f"hello {response}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == f"Successfully modified framework metrics {framework_id}"
    # Delete the framework
    response = await client.delete("/framework", headers={"Authorization": f"Bearer {token}"}, params={
        "framework_id": framework_id
    })
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == f"Successfully deleted framework {framework_id}"
   