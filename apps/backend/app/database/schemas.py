from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TestItemCreate(BaseModel):
    item: str = Field(min_length=1, max_length=255)


class TestItem(BaseModel):
    id: int
    item: str
    time_added: datetime

    model_config = ConfigDict(from_attributes=True)


class TestItemList(BaseModel):
    list: list[TestItem]


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