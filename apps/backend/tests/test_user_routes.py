import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.database import get_db
from app.database.models import Base, User
from app.main import app
from app.routes.user_routes import hash_password

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


def test_create_user_registers_user(client: TestClient, db_session: Session) -> None:
    payload = {
        "username": "jdoe",
        "first_name": "John",
        "last_name": "Doe",
        "password": "secret123",
    }

    response = client.post("/api/users/register", json=payload)

    assert response.status_code == 201
    assert response.json()["username"] == "jdoe"
    assert response.json()["first_name"] == "John"
    assert response.json()["last_name"] == "Doe"
    assert "date_created" in response.json()

    saved_user = db_session.query(User).first()
    assert saved_user is not None
    assert saved_user.username == "jdoe"
    assert saved_user.password_hash != "secret123"


def test_create_user_rejects_duplicate_username(client: TestClient, db_session: Session) -> None:
    db_session.add(
        User(
            username="jdoe",
            first_name="John",
            last_name="Doe",
            password_hash=hash_password("secret123"),
        )
    )
    db_session.commit()

    response = client.post(
        "/api/users/register",
        json={"username": "jdoe", "first_name": "Jane", "last_name": "Doe", "password": "secret123"},
    )

    assert response.status_code == 409
    assert response.json()["detail"] == "Username already exists"


def test_login_success_for_existing_user(client: TestClient, db_session: Session) -> None:
    db_session.add(
        User(
            username="jdoe",
            first_name="John",
            last_name="Doe",
            password_hash=hash_password("secret123"),
        )
    )
    db_session.commit()

    response = client.post(
        "/api/users/login",
        json={"username": "jdoe", "password": "secret123"},
    )

    assert response.status_code == 200
    assert response.json()["username"] == "jdoe"
    assert response.json()["first_name"] == "John"
    assert response.json()["last_name"] == "Doe"


def test_login_fails_for_unknown_user(client: TestClient) -> None:
    response = client.post(
        "/api/users/login",
        json={"username": "missing-user", "password": "secret123"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid username or password"
