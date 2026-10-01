from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=255)
    first_name: str = Field(min_length=1, max_length=255)
    last_name: str = Field(min_length=1, max_length=255)
    password: str = Field(min_length=8, max_length=255)


class UserResponse(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    date_created: datetime

    model_config = ConfigDict(from_attributes=True)


class UserLogin(BaseModel):
    username: str = Field(min_length=1, max_length=255)
    password: str = Field(min_length=1, max_length=255)


class TaskCreate(BaseModel):
    project_id: int
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


class ProjectTaskCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


class TaskResponse(BaseModel):
    id: int
    project_id: int
    name: str
    description: str | None
    date_created: datetime

    model_config = ConfigDict(from_attributes=True)


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)
    tasks: list[ProjectTaskCreate] = Field(default_factory=list)


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: str | None
    date_created: datetime
    tasks: list[TaskResponse]

    model_config = ConfigDict(from_attributes=True)


class ProjectList(BaseModel):
    list: list[ProjectResponse]

    model_config = ConfigDict(from_attributes=True)

