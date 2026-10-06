from datetime import datetime

from pydantic import BaseModel, ConfigDict
from app.database.schemas.user_schemas import UserResponse

class UpdateCreate(BaseModel):
    content: str
    user_created_id: int
    task_id: int
    project_id: int

class UpdateResponse(BaseModel):
    id: int
    user_created: UserResponse
    content: str
    date_created: datetime

    model_config = ConfigDict(from_attributes=True)