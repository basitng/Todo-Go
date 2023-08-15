import datetime
from typing import Optional
from pydantic import BaseModel


class TodoBase(BaseModel):
    todo: str
    noted: Optional[str]
    completed: Optional[bool]


class TodoCreate(TodoBase):
    pass


class TodoUpdate(TodoBase):
    pass


class Todo(TodoBase):
    id: int
    createdAt: datetime.datetime
    updatedAt: datetime.datetime

    class Config:
        orm_mode = True
