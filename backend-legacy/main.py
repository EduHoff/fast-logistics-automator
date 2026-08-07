import uvicorn
from api.factory import create_app

app = create_app()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

''' 
    comandos úteis no desenvolvimento:

    tree . -I "public|node_modules|venv|__pycache__"

    http://localhost:8000/nome_serviço_desejado


    docker exec -it backend pip install nome-biblioteca-python
    docker exec -it backend pip install requirements.txt
    docker exec -it backend pip freeze > requirements.txt
'''