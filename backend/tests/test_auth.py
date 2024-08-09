import pytest
import pytest_asyncio
from httpx import AsyncClient
from schemas.user_schemas import Token
from src.main import app, get_session
from fastapi import status

# token = Token{access_token="abc", token_type="bearer"}
@pytest_asyncio.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

# 
# NOTE: use new details when testing...
# 


# @pytest.mark.asyncio
# async def test_auth_login_success(client: AsyncClient):
#     response = await client.post("/auth/register", json={
#         "full_name": "Test",
#         "email": "testuser1@example.com",
#         "password": "testpassword1"
#     })
#     print("Register Response:", response.status_code, response.text)

#     assert response.status_code == status.HTTP_200_OK
#     print(response.json())

#     response = await client.post("/auth/login", data={
#         "username": "testuser1@example.com",
#         "password": "testpassword1"
#     })
#     assert response.status_code == status.HTTP_200_OK
#     print(response.json())
#     assert "access_token" in response.json()
#     assert response.json()["token_type"] == "bearer"

# @pytest.mark.asyncio
# async def test_auth_register_success(client: AsyncClient):
#     response = await client.post("/auth/register", json={
#         "full_name": "New User",
#         "email": "newuser1@example.com",
#         "password": "newpassword"
#     })
#     print(response.json())

#     assert response.status_code == status.HTTP_200_OK
#     assert "access_token" in response.json()
#     assert response.json()["token_type"] == "bearer"

# @pytest.mark.asyncio
# async def test_change_user_password(client: AsyncClient):
#     await client.post("/auth/register", json={
#         "full_name": "User",
#         "email": "user@example.com",
#         "password": "oldpassword"
#     })

#     login_response = await client.post("/auth/login", data={
#         "username": "user@example.com",
#         "password": "oldpassword"
#     })
#     token = login_response.json()["access_token"]

#     response = await client.put("/user/password", json={
#         "old_password": "oldpassword",
#         "new_password": "newpassword",
#         "confirm_password": "newpassword"
#     }, headers={"Authorization": f"Bearer {token}"})
    
#     assert response.status_code == status.HTTP_200_OK
#     assert response.json()["message"] == "Password changed successfully"

# @pytest.mark.asyncio
# async def test_change_user_full_name(client: AsyncClient):
#     await client.post("/auth/register", json={
#         "full_name": "User",
#         "email": "user@example.com",
#         "password": "password"
#     })

#     login_response = await client.post("/auth/login", data={
#         "username": "user@example.com",
#         "password": "password"
#     })
#     print(login_response.json())
#     token = login_response.json()["access_token"]

#     response = await client.put("/user/full-name", json={
#         "new_name": "New User Name"
#     }, headers={"Authorization": f"Bearer {token}"})
    
#     assert response.status_code == status.HTTP_200_OK
#     assert response.json()["full_name"] == "New User Name"

# src/test_db.py