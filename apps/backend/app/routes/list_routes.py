from fastapi import APIRouter, Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import TestTableItem
from app.database.schemas import TestItem, TestItemCreate, TestItemList

router = APIRouter()

@router.get("/api/list", response_model=TestItemList)
def get_list(db: Session = Depends(get_db)) -> dict[str, list[TestTableItem]]:
    items = db.scalars(select(TestTableItem).order_by(TestTableItem.id)).all()
    return {"list": list(items)}


@router.post("/api/list/add", response_model=TestItem, status_code=status.HTTP_201_CREATED)
def add_to_list(payload: TestItemCreate, db: Session = Depends(get_db)) -> TestTableItem:
    item = TestTableItem(item=payload.item)
    db.add(item)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Item already exists") from exc

    db.refresh(item)
    return item

@router.delete("/api/list/delete/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_from_list(item_id: int, db: Session = Depends(get_db)) -> None:
    item = db.get(TestTableItem, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    db.delete(item)
    db.commit()