from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes_jobs import router as jobs_router

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5173",
    "https://cloudm2-front-gwbtfvd2aya6dnce.francecentral-01.azurewebsites.net",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs_router)

@app.get("/health")
def health():
    return {"status": "ok"}