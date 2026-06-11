import logging

from fastapi import FastAPI

logger = logging.getLogger(__name__)

app = FastAPI(title="World Cup RAG Service", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    logger.debug("收到 RAG 服务健康检查请求")
    return {"status": "ok", "service": "rag-python"}
