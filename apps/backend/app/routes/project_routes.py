from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.database.database import get_db
from app.database.models import Project, Task
from app.database.schemas import ProjectCreate, ProjectResponse, TaskCreate, TaskResponse

router = APIRouter()

@router.get(
    "/api/projects",
    response_model=list[ProjectResponse],
    status_code=status.HTTP_200_OK,
)
def list_projects(db: Session = Depends(get_db)) -> list[ProjectResponse]:
    projects = db.query(Project).options(selectinload(Project.tasks)).all()
    return projects


@router.post(
    "/api/projects",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)) -> ProjectResponse:
    project = Project(name=payload.name, description=payload.description)
    project.tasks = [Task(name=task.name, description=task.description) for task in payload.tasks]
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get(
    "/api/projects/{project_id}",
    response_model=ProjectResponse,
    status_code=status.HTTP_200_OK,
)
def get_project(project_id: int, db: Session = Depends(get_db)) -> ProjectResponse:
    project = db.query(Project).options(selectinload(Project.tasks)).filter(Project.id == project_id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project