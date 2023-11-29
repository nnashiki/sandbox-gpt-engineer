import os
from fastapi import FastAPI, UploadFile, File, Depends
from sqlalchemy.orm import Session
from api.models import FileBase
from api.database import SessionLocal, engine
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, database
from typing import List

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # すべてのオリジンを許可
    allow_credentials=True,
    allow_methods=["*"],  # すべての HTTP メソッドを許可
    allow_headers=["*"],  # すべてのヘッダーを許可
)

models.Base.metadata.create_all(bind=database.engine)

@app.post("/files/", response_model=FileBase)
async def create_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_location = f"files/{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(await file.read())
    db_file = models.File(name=file.filename, path=file_location)
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file

@app.get("/files/", response_model=List[FileBase])
def read_files(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    files = db.query(models.File).offset(skip).limit(limit).all()
    return files