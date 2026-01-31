from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# ... Your existing API routes (e.g., @app.post("/verify")) ...

# Mount the static directory to serve CSS/JS
app.mount("/static", StaticFiles(directory="static"), name="static")

# Serve the main frontend page at the root URL
@app.get("/")
async def serve_frontend():
    return FileResponse("static/index.html")