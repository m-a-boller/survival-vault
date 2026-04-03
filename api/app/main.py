from fastapi import FastAPI

app = FastAPI(title="Survival Vault API", version="0.1.0")

@app.get("/")
async def root():
    return {"message": "Welcome to Survival Vault API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
