from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import settings

app = FastAPI(title="Resume Tailor API", version="1.0.0", description="AI-powered resume customization API")

origins = settings.allowed_origins if isinstance(settings.allowed_origins, list) else [str(settings.allowed_origins)]
allow_all = "*" in origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all else origins,
    allow_credentials=not allow_all,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
