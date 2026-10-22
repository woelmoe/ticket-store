import pytest
from app.main import app
from app.services import inventory
from fastapi.testclient import TestClient

client = TestClient(app)


@pytest.fixture(autouse=True)
def _reset():
    inventory.reset()
    yield
    inventory.reset()


def test_health():
    r = client.get("/api/v1/health")
    assert r.status_code == 200


def test_calculate_ok():
    r = client.post(
        "/api/v1/calculate",
        json={
            "email": "user@example.com",
            "participants": [
                {"name": "A", "age": 30},
                {"name": "C", "age": 8},
            ],
        },
    )
    assert r.status_code == 200
    body = r.json()
    assert body["total"] == 2250.0


def test_calculate_child_without_adult():
    r = client.post(
        "/api/v1/calculate",
        json={"email": "user@example.com", "participants": [{"name": "C", "age": 10}]},
    )
    assert r.status_code == 422
    assert r.json()["code"] == "CHILD_WITHOUT_ADULT"


def test_calculate_invalid_email():
    r = client.post(
        "/api/v1/calculate",
        json={"email": "not-an-email", "participants": [{"name": "A", "age": 30}]},
    )
    assert r.status_code == 422


def test_order_success():
    r = client.post(
        "/api/v1/order",
        json={"email": "user@example.com", "participants": [{"name": "A", "age": 30}]},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["order_id"]
    assert body["email"] == "user@example.com"
    assert body["seats_left"] == 99


def test_order_sold_out(monkeypatch):
    monkeypatch.setattr(inventory, "_seats_left", 0)
    r = client.post(
        "/api/v1/order",
        json={"email": "user@example.com", "participants": [{"name": "A", "age": 30}]},
    )
    assert r.status_code == 409
    assert r.json()["code"] == "SOLD_OUT"
