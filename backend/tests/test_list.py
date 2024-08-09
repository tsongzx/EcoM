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
async def test_get_lists(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]
    
    # Create a list
    random_string = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
    response = await client.post("/list", headers={"Authorization": f"Bearer {token}"}, params={
        "list_name": random_string
    })
    list_id = response.json()["list_id"]
    
    response = await client.get("/lists", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) > 0
    # delete list
    response = await client.delete("/list", params={"list_id": list_id}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == f"Successfully deleted list {list_id}"

@pytest.mark.asyncio
async def test_get_list(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })

    token = response.json()["access_token"]

    # Create a list
    random_string = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
    list_response = await client.post("/list", headers={"Authorization": f"Bearer {token}"}, params={
        "list_name": random_string
    })
    list_id = list_response.json()["list_id"]

    # Add a company to the list
    await client.post("/list/company", headers={"Authorization": f"Bearer {token}"}, json={
        "list_id": list_id,
        "company_id": 1  # Assuming company ID 1 exists for the test
    })

    response = await client.get("/list", params={"list_id": list_id}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) > 0
    
    # delete list
    response = await client.delete("/list", params={"list_id": list_id}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == f"Successfully deleted list {list_id}"

@pytest.mark.asyncio
async def test_create_and_delete_list(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Create a list
    list_response = await client.post("/list", headers={"Authorization": f"Bearer {token}"}, params={
        "list_name": "List to Delete"
    })
    list_id = list_response.json()["list_id"]

    # Delete the list
    response = await client.delete("/list", params={"list_id": list_id}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == f"Successfully deleted list {list_id}"

@pytest.mark.asyncio
async def test_add_company_to_list(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Create a list
    list_response = await client.post("/list", headers={"Authorization": f"Bearer {token}"}, params={
        "list_name": "Test List!!!"
    })
    list_id = list_response.json()["list_id"]

    # Add a company to the list
    response = await client.post("/list/company", headers={"Authorization": f"Bearer {token}"}, json={
        "list_id": list_id,
        "company_id": 1  # Assuming company ID 1 exists for the test
    })
    assert response.status_code == status.HTTP_200_OK
    assert "Successfully added" in response.json()["message"]
    # delete list
    response = await client.delete("/list", params={"list_id": list_id}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == f"Successfully deleted list {list_id}"


@pytest.mark.asyncio
async def test_is_company_in_list(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Create a list
    list_response = await client.post("/list", headers={"Authorization": f"Bearer {token}"}, params={
        "list_name": "Test List!!!!!"
    })
    list_id = list_response.json()["list_id"]

    # Add a company to the list
    await client.post("/list/company", headers={"Authorization": f"Bearer {token}"}, json={
        "list_id": list_id,
        "company_id": 1  # Assuming company ID 1 exists for the test
    })

    response = await client.get("/list/company", params={"list_id": list_id, "company_id": 1}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert response.json() is True
    # delete list
    response = await client.delete("/list", params={"list_id": list_id}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == f"Successfully deleted list {list_id}"

@pytest.mark.asyncio
async def test_delete_company_from_list(client: AsyncClient):
    response = await client.post("/auth/login", data={
        "username": "testuser@example.com",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Create a list
    list_response = await client.post("/list", headers={"Authorization": f"Bearer {token}"}, params={
        "list_name": "Test List2"
    })
    list_id = list_response.json()["list_id"]

    # Add a company to the list
    await client.post("/list/company", headers={"Authorization": f"Bearer {token}"}, json={
        "list_id": list_id,
        "company_id": 1  # Assuming company ID 1 exists for the test
    })

    # Delete the company from the list
    response = await client.delete("/list/company", params={"list_id": list_id, "company_id": 1}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == f"Successfully deleted company 1 from list {list_id}"
    # delete list
    response = await client.delete("/list", params={"list_id": list_id}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == f"Successfully deleted list {list_id}"