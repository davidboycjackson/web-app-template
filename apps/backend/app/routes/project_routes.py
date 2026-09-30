from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Project
from app.database.schemas import ProjectCreate, ProjectResponse

router = APIRouter()

@router.get(
    "/api/projects",
    response_model=list[ProjectResponse],
    status_code=status.HTTP_200_OK,
)
def list_projects(db: Session = Depends(get_db)) -> list[ProjectResponse]:
    projects = db.query(Project).all()
    return projects


@router.post(
    "/api/projects",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)) -> ProjectResponse:
    project = Project(name=payload.name, description=payload.description)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project