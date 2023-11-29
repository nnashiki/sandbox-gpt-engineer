cd ./api
pip install -r requirements.txt

cd ../gui
npm install

cd ./api
uvicorn main:app --reload &

cd ../gui
npm start &
