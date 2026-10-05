from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field
from app.database.schemas.user_schemas import UserTaskResponse

class TaskDraft(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


class TaskCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)
    project_id: int
    user_created_id: int


class TaskResponse(BaseModel):
    id: int
    name: str = Field(validation_alias="title")
    description: str | None = Field(default=None, max_length=255)
    project_id: int
    user_created_id: int
    assigned_users: list[UserTaskResponse] = Field(default_factory=list)
    date_created: datetime

    model_config = ConfigDict(from_attributes=True)