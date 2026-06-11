# 运行镜像拉取前需要先确认 Docker Hub 代理或镜像加速配置。
FROM python:3.12-slim
WORKDIR /app

# 容器内安装依赖时使用清华 PyPI 镜像，适配中国大陆服务器部署环境。
COPY pyproject.toml .
RUN pip install --no-cache-dir -i https://pypi.tuna.tsinghua.edu.cn/simple .

COPY src ./src
EXPOSE 8000
CMD ["uvicorn", "worldcup_rag.main:app", "--host", "0.0.0.0", "--port", "8000"]
