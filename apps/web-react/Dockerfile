# 构建镜像拉取前要先确认 Docker Hub 代理或镜像加速配置。
FROM node:22-alpine AS build
WORKDIR /app

# Corepack 随 Node 提供，用来按 packageManager 字段启用指定 pnpm 版本。
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# 运行阶段使用 nginx 静态托管 Vite 构建产物，适合单机 Compose MVP。
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
