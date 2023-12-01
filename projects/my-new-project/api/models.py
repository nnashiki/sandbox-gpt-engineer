from sqlalchemy import Column, Integer, String
from pydantic import BaseModel

class FileBase(BaseModel):
    id: int
    name: str
    url: str

from .database import Base

class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
