import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import get_db
from app.database.models import Base, TestTableItem
from app.main import app

SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture()
def db_session() -> Session:
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(db_session: Session) -> TestClient:
    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.rollback()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def test_get_list_returns_empty_list(client: TestClient) -> None:
    response = client.get("/api/list")

    assert response.status_code == 200
    assert response.json() == {"list": []}


def test_add_to_list_creates_item(client: TestClient, db_session: Session) -> None:
    response = client.post("/api/list/add", json={"item": "pear"})

    assert response.status_code == 201
    assert response.json()["item"] == "pear"
    assert response.json()["id"] == 1
    assert "time_added" in response.json()

    saved_item = db_session.query(TestTableItem).first()
    assert saved_item is not None
    assert saved_item.item == "pear"


def test_add_duplicate_item_returns_conflict(client: TestClient, db_session: Session) -> None:
    db_session.add(TestTableItem(item="pear"))
    db_session.commit()

    response = client.post("/api/list/add", json={"item": "pear"})

    assert response.status_code == 409
    assert response.json()["detail"] == "Item already exists"


def test_delete_item_removes_item(client: TestClient, db_session: Session) -> None:
    item = TestTableItem(item="pear")
    db_session.add(item)
    db_session.commit()
    db_session.refresh(item)

    response = client.delete(f"/api/list/delete/{item.id}")

    assert response.status_code == 204
    assert db_session.get(TestTableItem, item.id) is None


def test_delete_missing_item_returns_404(client: TestClient) -> None:
    response = client.delete("/api/list/delete/999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Item not found"
