pip install --user fastapi
pip install --user sqlalchemy
pip install --user uvicorn

uvicorn api.main:app --reload
