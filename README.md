# 世界杯 RAG MVP

单机优先的世界杯 RAG 应用。

## MVP 技术栈

- Java 21 + Spring Boot 3 主业务后端
- Python 3.12 + FastAPI RAG/数据/评测服务
- React + TypeScript + Vite 前端
- PostgreSQL + pgvector
- Docker Compose 单机部署

## 设计与计划

- 设计文档：`docs/superpowers/specs/2026-06-10-world-cup-rag-design.md`
- 实施计划：`docs/superpowers/plans/2026-06-10-world-cup-rag-mvp.md`
- 变更沉淀规则：`docs/development/change-record-rule.md`

## 工程分层

### Java 后端

- `worldcup-api`：对外契约、DTO、Facade 接口。
- `worldcup-dal`：数据库对象、Repository、持久化实现。
- `worldcup-service`：业务规则、Facade 实现、事务和关键日志。
- `worldcup-start`：Spring Boot 启动类、Controller、配置和 Dockerfile。

### React 前端

- `app`：应用装配和全局入口。
- `pages`：页面级编排。
- `features`：按业务能力组织代码，例如球迷身份。
- `shared`：通用 UI、工具、请求层和资产路径。
- `styles`：全局 token、基础样式和布局样式。

## 变更沉淀

以后每一次改动都要在对应项目中新增一份中文变更记录文件。

示例：

- Java 后端改动：`apps/backend-java/docs/changes/YYYY-MM-DD-topic.md`
- React 前端改动：`apps/web-react/docs/changes/YYYY-MM-DD-topic.md`
- Python RAG 改动：`apps/rag-python/docs/changes/YYYY-MM-DD-topic.md`
- infra 改动：`infra/docs/changes/YYYY-MM-DD-topic.md`
- 仓库流程或规范改动：`docs/changes/YYYY-MM-DD-topic.md`
