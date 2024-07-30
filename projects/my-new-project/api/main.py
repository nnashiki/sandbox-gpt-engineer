from .models import FileBase
from .database import SessionLocal, engine
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
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
    db_file = models.File(name=file.filename)
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return FileBase(id=db_file.id, name=db_file.name, url="http://localhost:8000/files/" + str(db_file.id))


@app.get("/files/", response_model=List[FileBase])
def read_files(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    files = db.query(models.File).offset(skip).limit(limit).all()
    return [FileBase(id=file.id, name=file.name, url="http://localhost:8000/files/" + str(file.id)) for file in files]


@app.get("/files/{file_id}")
def read_file(file_id: int, db: Session = Depends(get_db)):
    # Query the database for the file
    db_file = db.query(models.File).filter(models.File.id == file_id).first()
    if db_file is None:
        # If the file does not exist in the database, return a 404 response
        raise HTTPException(status_code=404, detail="File not found")

    file_location = f"files/{db_file.name}"
    try:
        # Return the file as a FileResponse
        return FileResponse(file_location)
    except FileNotFoundError:
        # If the file does not exist on the file system, return a 404 response
        raise HTTPException(status_code=404, detail="File not found on server")
