from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.database.database import get_db
from app.database.models import Project, Task
from app.database.schemas import ProjectCreate, ProjectResponse, TaskCreate, TaskResponse

router = APIRouter()

@router.post(
    "/api/tasks",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)) -> TaskResponse:
    if db.get(Project, payload.project_id) is None:
        raise HTTPException(status_code=404, detail="Project not found")

    task = Task(project_id=payload.project_id, name=payload.name, description=payload.description)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task