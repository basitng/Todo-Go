from datetime import datetime, timedelta
import math
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio.session import AsyncSession
from starlette.responses import Response
from sqlalchemy import func
from sqlalchemy.orm import aliased

from app.deps.db import get_async_session
from app.deps.request_params import parse_react_admin_params
from app.deps.users import current_user
from app.models.todos import Todo
from app.models.user import User
from app.schemas.todos import Todo as TodoSchema
from app.schemas.todos import TodoCreate, TodoUpdate
from app.schemas.request_params import RequestParams

router = APIRouter(prefix="/todos")


@router.get("", response_model=List[TodoSchema])
async def get_todos(
    response: Response,
    session: AsyncSession = Depends(get_async_session),
    request_params: RequestParams = Depends(parse_react_admin_params(Todo)),
    user: User = Depends(current_user),
) -> Any:
    query = select(Todo).where(Todo.user_id == user.id)
    todos = await session.execute(query.offset(request_params.skip).limit(request_params.limit).order_by(request_params.order_by))
    todos_list = todos.scalars().all()
    return todos_list


@router.post("", response_model=TodoSchema, status_code=201)
async def create_todo(
    todo_in: TodoCreate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
) -> Any:
    todo = Todo(**todo_in.dict())
    todo.user_id = user.id
    session.add(todo)
    await session.commit()
    return todo


@router.get("/completed", response_model=List[TodoSchema])
async def get_completed_todos(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
) -> Any:
    query = select(Todo).where(Todo.user_id == user.id, Todo.completed == True)
    print(f">>>>>>>>>>>>>>>>>>>>>>>>>> {Todo.user_id}")
    todos = await session.execute(query)
    todos_list = todos.scalars().all()
    return todos_list


@router.get("/uncompleted", response_model=List[TodoSchema])
async def get_uncompleted_todos(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
) -> Any:
    query = select(Todo).where(
        Todo.user_id == user.id, Todo.completed == False)
    todos = await session.execute(query)
    todos_list = todos.scalars().all()
    return todos_list


@router.get("/average-todo-duration")
async def get_average_todo_duration(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user)
):
    # Fetch the todos owned by the user
    todos = await session.execute(select(Todo).where(Todo.user_id == user.id))

    # Calculate the average duration for each day of the month
    now = datetime.now()
    days_in_month = (now.replace(day=28) + timedelta(days=4)
                     ).replace(day=1) - timedelta(days=1)
    average_duration_by_day = [0] * days_in_month.day
    num_todos_by_day = [0] * days_in_month.day

    for todo in todos.scalars():
        if todo.createdAt and todo.updatedAt:
            if (todo.createdAt.year == now.year and
                    todo.createdAt.month == now.month):
                day_index = todo.createdAt.day - 1
                duration_seconds = (
                    todo.updatedAt - todo.createdAt).total_seconds()

                if duration_seconds < 60:
                    average_duration_by_day[day_index] += math.ceil(
                        duration_seconds)
                elif duration_seconds < 3600:
                    average_duration_by_day[day_index] += math.ceil(
                        duration_seconds / 60)
                else:
                    average_duration_by_day[day_index] += math.ceil(
                        duration_seconds / 3600)

                num_todos_by_day[day_index] += 1

    # Calculate total seconds and total months
    total_seconds = sum(average_duration_by_day)
    total_months = days_in_month.day

    return {
        "totalMonths": total_months,
        "totalSeconds": total_seconds,
        "averageDurationByDay": average_duration_by_day,
        "daysInMonth": days_in_month.day
    }


@router.put("/{todo_id}", response_model=TodoSchema)
async def update_todo(
    todo_id: int,
    todo_in: TodoUpdate,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
) -> Any:
    todo: Optional[Todo] = await session.get(Todo, todo_id)
    if not todo or todo.user_id != user.id:
        raise HTTPException(404)
    update_data = todo_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(todo, field, value)
    session.add(todo)
    await session.commit()
    return todo


@router.get("/{todo_id}", response_model=TodoSchema)
async def get_todo(
    todo_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
) -> Any:
    todo: Optional[Todo] = await session.get(Todo, todo_id)
    if not todo or todo.user_id != user.id:
        raise HTTPException(404)
    return todo


@router.delete("/{todo_id}")
async def delete_todo(
    todo_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
) -> Any:
    todo: Optional[Todo] = await session.get(Todo, todo_id)
    if not todo or todo.user_id != user.id:
        raise HTTPException(404)
    await session.delete(todo)  # Change "item" to "todo"
    await session.commit()
    return {"success": True}


@router.get("/{todo_id}/average-duration", response_model=dict)
async def get_todo_average_duration(
    todo_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
) -> dict:
    todo = await session.execute(
        select(Todo)
        .where(Todo.id == todo_id, Todo.user_id == user.id)
    )

    fetched_todo = todo.scalars().first()

    if not fetched_todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    duration = fetched_todo.updatedAt - fetched_todo.createdAt
    duration_seconds = duration.total_seconds()

    # Calculate duration in minutes and hours
    duration_minutes = duration_seconds / 60
    duration_hours = duration_minutes / 60

    return {
        "duration_seconds": duration_seconds,
        "duration_minutes": duration_minutes,
        "duration_hours": duration_hours
    }
