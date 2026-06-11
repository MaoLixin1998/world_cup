# 世界杯 RAG MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个单机 Docker Compose 部署的世界杯 RAG MVP：Spring Boot 主业务后端、FastAPI RAG/数据服务、PostgreSQL + pgvector、React 前端，并保留未来 Vue 等价前端位置。

**Architecture:** 采用 monorepo。React 只调用 Java API；Java 负责匿名球迷、会话、浏览、管理；Python 负责导入、切块、embedding、检索、回答生成和评测；PostgreSQL + pgvector 是唯一核心状态层。

**Tech Stack:** Java 21, Spring Boot 3, Gradle, Python 3.12, FastAPI, pytest, PostgreSQL 16 + pgvector, React + TypeScript + Vite, Vitest, Testing Library, Playwright, Docker Compose.

---

## 已确认规格来源

实施以中文设计文档为准：

- `docs/superpowers/specs/2026-06-10-world-cup-rag-design.md`

实施期间仍然遵守：

- 未确认前不扩大 MVP 范围。
- 不加入 Kubernetes、Kafka、Milvus、Elasticsearch。
- React 先行，Vue 后续。
- 所有 UI 页面完成前必须经过 ui-ux-pro-max 的体育内容产品体验审查。
- 面向中国大陆开发环境，任何软件安装、依赖安装或镜像拉取前，都要先检查是否需要国内镜像源或代理配置，并在执行记录中说明采用的源。
- OpenAPI 的 `summary` 和 `description` 使用中文，便于中文团队 review。
- 实现代码需要有充足但不啰嗦的中文注释；复杂业务规则、边界判断、RAG 流程和部署配置要有解释性注释。
- 后端、RAG 服务和关键前端动作要有关键节点日志，日志文案优先中文，避免记录密钥、token、个人敏感信息和大段用户问题原文。

## 文件结构规划

创建或维护以下结构：

```text
world_cup/
  README.md
  .gitignore
  apps/
    backend-java/
      build.gradle.kts
      settings.gradle.kts
      src/main/java/com/worldcup/
      src/main/resources/
      src/test/java/com/worldcup/
    rag-python/
      pyproject.toml
      src/worldcup_rag/
      tests/
    web-react/
      package.json
      src/
      tests/
    web-vue/
      README.md
  packages/
    api-contracts/
      openapi.yaml
      README.md
  infra/
    docker-compose.yml
    postgres/init/001_extensions.sql
    nginx/README.md
  docs/
    superpowers/specs/
    superpowers/plans/
```

责任边界：

- `apps/backend-java`：主业务 API、数据库迁移、匿名球迷、聊天历史、浏览 API、管理 API。
- `apps/rag-python`：RAG 导入、检索、回答、评测，不直接承载普通业务页面。
- `apps/web-react`：MVP 前端页面。
- `packages/api-contracts`：OpenAPI 契约，保证 React、Java、Python 协作边界清楚。
- `infra`：单机 Docker Compose、PostgreSQL 初始化、未来 nginx 反代说明。

## 执行约定

每个任务遵循 TDD：

1. 先写失败测试。
2. 运行测试，确认失败原因符合预期。
3. 写最小实现。
4. 运行测试通过。
5. 做聚焦提交。

提交信息使用：

```bash
git commit -m "type: concise description"
```

UI 任务完成时还要执行：

```bash
npm run test
npm run build
npm run test:e2e
```

并记录该页面的 ui-ux-pro-max 审查结果到对应任务提交说明或后续实现日志。

安装与依赖约定：

- 使用 Homebrew、npm、Gradle、pip、Docker 镜像或其他下载型工具前，先检查当前网络、代理和国内镜像源可用性。
- npm 优先确认是否需要 `registry.npmmirror.com`。
- pip 优先确认是否需要清华源、阿里云源或其他稳定 PyPI 镜像。
- Gradle/Maven 优先确认是否需要阿里云 Maven 镜像或公司内网代理。
- Docker 拉取镜像前，先确认是否需要 Docker Hub 镜像加速、代理或替代镜像。
- 如果使用默认官方源，必须是因为当前环境访问正常，或用户明确要求不使用镜像源。

---

### Task 1: Monorepo Skeleton And Local Contracts

**Files:**

- Create: `.gitignore`
- Create: `README.md`
- Create: `packages/api-contracts/openapi.yaml`
- Create: `packages/api-contracts/README.md`
- Create: `infra/docker-compose.yml`
- Create: `infra/postgres/init/001_extensions.sql`
- Create: `apps/web-vue/README.md`

- [ ] **Step 1: Write the initial contract smoke test as documentation**

Create `packages/api-contracts/openapi.yaml` with these initial paths so later code has a stable target:

```yaml
openapi: 3.0.3
info:
  title: World Cup RAG API
  version: 0.1.0
paths:
  /api/health:
    get:
      summary: Java 后端健康检查
      description: 返回 Java 主业务后端的基础健康状态，用于本地启动和部署探活。
      responses:
        "200":
          description: 后端服务可用
  /api/fans:
    post:
      summary: 创建匿名球迷身份
      description: 创建不含密码的轻量球迷身份，包含 uid、昵称和明星球员头像。
      responses:
        "201":
          description: 匿名球迷身份已创建
  /api/browse/teams:
    get:
      summary: 获取球队列表
      description: 返回世界杯球队资料列表，用于浏览页和问答后的相关入口。
      responses:
        "200":
          description: 球队列表已返回
  /api/chat:
    post:
      summary: 提交世界杯问题
      description: 接收中文世界杯问题，返回带来源链接和资料更新时间的 RAG 回答。
      responses:
        "200":
          description: 问答结果已返回
  /api/admin/ingest-jobs:
    get:
      summary: 获取导入任务列表
      description: 返回每日资料导入和索引重建任务的状态，供管理页展示。
      responses:
        "200":
          description: 导入任务列表已返回
```

- [ ] **Step 2: Add Docker Compose skeleton**

Create `infra/docker-compose.yml`:

```yaml
services:
  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_DB: worldcup
      POSTGRES_USER: worldcup
      POSTGRES_PASSWORD: worldcup
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/init:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U worldcup -d worldcup"]
      interval: 5s
      timeout: 3s
      retries: 20

volumes:
  postgres_data:
```

- [ ] **Step 3: Add pgvector initialization**

Create `infra/postgres/init/001_extensions.sql`:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

- [ ] **Step 4: Add root docs and ignore rules**

Create `.gitignore`:

```gitignore
.DS_Store
.idea/
.vscode/
.env
.env.*
!.env.example
node_modules/
dist/
build/
target/
.gradle/
.venv/
__pycache__/
.pytest_cache/
.mypy_cache/
.ruff_cache/
coverage/
playwright-report/
test-results/
.superpowers/
```

Create `README.md`:

```markdown
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
```

Create `packages/api-contracts/README.md`:

```markdown
# API Contracts

`openapi.yaml` 是前端、Java 后端和 Python RAG 服务之间的契约入口。
```

Create `apps/web-vue/README.md`:

```markdown
# Vue Frontend

Vue 版本在 React MVP 稳定后再实现。它必须复用同一套 API 契约，并保持核心功能等价。
```

- [ ] **Step 5: Verify skeleton**

Run:

```bash
docker compose -f infra/docker-compose.yml config
```

Expected: Compose configuration renders without errors.

- [ ] **Step 6: Commit**

```bash
git add .gitignore README.md packages infra apps/web-vue/README.md
git commit -m "chore: add monorepo skeleton"
```

---

### Task 2: Spring Boot Backend Health And Database Baseline

**Files:**

- Create: `apps/backend-java/settings.gradle.kts`
- Create: `apps/backend-java/build.gradle.kts`
- Create: `apps/backend-java/src/main/java/com/worldcup/WorldCupApplication.java`
- Create: `apps/backend-java/src/main/java/com/worldcup/health/HealthController.java`
- Create: `apps/backend-java/src/main/resources/application.yml`
- Create: `apps/backend-java/src/test/java/com/worldcup/health/HealthControllerTest.java`
- Modify: `infra/docker-compose.yml`

- [ ] **Step 1: Write failing backend health test**

Create `apps/backend-java/src/test/java/com/worldcup/health/HealthControllerTest.java`:

```java
package com.worldcup.health;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class HealthControllerTest {
    @Test
    void healthReturnsOkStatus() {
        HealthController controller = new HealthController();

        HealthController.HealthResponse response = controller.health();

        assertThat(response.status()).isEqualTo("ok");
        assertThat(response.service()).isEqualTo("backend-java");
    }
}
```

- [ ] **Step 2: Run test and confirm failure**

Run:

```bash
cd apps/backend-java
./gradlew test --tests com.worldcup.health.HealthControllerTest
```

Expected: FAIL because Gradle project or `HealthController` does not exist yet.

- [ ] **Step 3: Add minimal Spring Boot project**

Create `apps/backend-java/settings.gradle.kts`:

```kotlin
pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        mavenCentral()
    }
}

rootProject.name = "backend-java"
```

Create `apps/backend-java/build.gradle.kts`:

```kotlin
plugins {
    java
    id("org.springframework.boot") version "3.3.5"
    id("io.spring.dependency-management") version "1.1.6"
}

group = "com.worldcup"
version = "0.1.0"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-jdbc")
    implementation("org.postgresql:postgresql")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
```

Create `apps/backend-java/src/main/java/com/worldcup/WorldCupApplication.java`:

```java
package com.worldcup;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WorldCupApplication {
    public static void main(String[] args) {
        SpringApplication.run(WorldCupApplication.class, args);
    }
}
```

Create `apps/backend-java/src/main/java/com/worldcup/health/HealthController.java`:

```java
package com.worldcup.health;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
    @GetMapping("/api/health")
    public HealthResponse health() {
        return new HealthResponse("ok", "backend-java");
    }

    public record HealthResponse(String status, String service) {
    }
}
```

Create `apps/backend-java/src/main/resources/application.yml`:

```yaml
spring:
  application:
    name: worldcup-backend
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/worldcup}
    username: ${SPRING_DATASOURCE_USERNAME:worldcup}
    password: ${SPRING_DATASOURCE_PASSWORD:worldcup}
server:
  port: ${SERVER_PORT:8080}
```

- [ ] **Step 4: Run backend test**

Run:

```bash
cd apps/backend-java
./gradlew test --tests com.worldcup.health.HealthControllerTest
```

Expected: PASS.

- [ ] **Step 5: Add backend service to Compose**

Modify `infra/docker-compose.yml` to add:

```yaml
  backend-java:
    build:
      context: ../apps/backend-java
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/worldcup
      SPRING_DATASOURCE_USERNAME: worldcup
      SPRING_DATASOURCE_PASSWORD: worldcup
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy
```

Also add `apps/backend-java/Dockerfile`:

```dockerfile
FROM gradle:8.10.2-jdk21 AS build
WORKDIR /app
COPY . .
RUN gradle bootJar --no-daemon

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

- [ ] **Step 6: Commit**

```bash
git add apps/backend-java infra/docker-compose.yml
git commit -m "feat: add spring boot backend health"
```

---

### Task 3: FastAPI RAG Service Health

**Files:**

- Create: `apps/rag-python/pyproject.toml`
- Create: `apps/rag-python/src/worldcup_rag/__init__.py`
- Create: `apps/rag-python/src/worldcup_rag/main.py`
- Create: `apps/rag-python/tests/test_health.py`
- Create: `apps/rag-python/Dockerfile`
- Modify: `infra/docker-compose.yml`

- [ ] **Step 1: Write failing FastAPI health test**

Create `apps/rag-python/tests/test_health.py`:

```python
from fastapi.testclient import TestClient

from worldcup_rag.main import app


def test_health_returns_ok():
    client = TestClient(app)

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "rag-python"}
```

- [ ] **Step 2: Run test and confirm failure**

Run:

```bash
cd apps/rag-python
python -m pytest tests/test_health.py -q
```

Expected: FAIL because package and app are not implemented.

- [ ] **Step 3: Add FastAPI project**

Create `apps/rag-python/pyproject.toml`:

```toml
[project]
name = "worldcup-rag"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
  "fastapi>=0.115.0",
  "uvicorn[standard]>=0.30.0",
  "pydantic>=2.8.0",
  "psycopg[binary]>=3.2.0",
]

[project.optional-dependencies]
test = [
  "pytest>=8.3.0",
  "httpx>=0.27.0",
]

[tool.pytest.ini_options]
pythonpath = ["src"]
```

Create `apps/rag-python/src/worldcup_rag/__init__.py`:

```python
"""World Cup RAG service."""
```

Create `apps/rag-python/src/worldcup_rag/main.py`:

```python
from fastapi import FastAPI

app = FastAPI(title="World Cup RAG Service", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "rag-python"}
```

- [ ] **Step 4: Run FastAPI test**

Run:

```bash
cd apps/rag-python
python -m pytest tests/test_health.py -q
```

Expected: PASS.

- [ ] **Step 5: Add Python service to Compose**

Create `apps/rag-python/Dockerfile`:

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY pyproject.toml .
COPY src ./src
RUN pip install --no-cache-dir .
EXPOSE 8000
CMD ["uvicorn", "worldcup_rag.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Modify `infra/docker-compose.yml` to add:

```yaml
  rag-python:
    build:
      context: ../apps/rag-python
    environment:
      DATABASE_URL: postgresql://worldcup:worldcup@postgres:5432/worldcup
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy
```

- [ ] **Step 6: Commit**

```bash
git add apps/rag-python infra/docker-compose.yml
git commit -m "feat: add fastapi rag service health"
```

---

### Task 4: React App Shell And UI Foundation

**Files:**

- Create: `apps/web-react/package.json`
- Create: `apps/web-react/index.html`
- Create: `apps/web-react/tsconfig.json`
- Create: `apps/web-react/vite.config.ts`
- Create: `apps/web-react/src/main.tsx`
- Create: `apps/web-react/src/App.tsx`
- Create: `apps/web-react/src/styles.css`
- Create: `apps/web-react/src/setupTests.ts`
- Create: `apps/web-react/src/App.test.tsx`
- Create: `apps/web-react/playwright.config.ts`
- Create: `apps/web-react/tests/home.spec.ts`
- Create: `apps/web-react/Dockerfile`
- Modify: `infra/docker-compose.yml`

- [ ] **Step 1: Write failing app shell test**

Create `apps/web-react/src/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App shell", () => {
  it("renders the Chinese product title", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "世界杯问答" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test and confirm failure**

Run:

```bash
cd apps/web-react
npm test -- --run src/App.test.tsx
```

Expected: FAIL because React app is not implemented.

- [ ] **Step 3: Add React app shell**

Create `apps/web-react/package.json`:

```json
{
  "name": "web-react",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc && vite build",
    "test": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "lucide-react": "^0.468.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "vite": "^5.4.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.48.0",
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^16.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

Create `apps/web-react/src/App.tsx`:

```tsx
import { Search } from "lucide-react";
import "./styles.css";

export default function App() {
  return (
    <main className="app-shell">
      <section className="home-panel" aria-labelledby="home-title">
        <div className="title-row">
          <Search aria-hidden="true" size={28} />
          <h1 id="home-title">世界杯问答</h1>
        </div>
        <p>用中文提问，查看来源，轻松浏览世界杯资料。</p>
      </section>
    </main>
  );
}
```

Create `apps/web-react/src/styles.css` with accessible base styles:

```css
:root {
  color: #10231d;
  background: #f7faf8;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  margin: 0;
}

button,
input {
  font: inherit;
}

.app-shell {
  min-height: 100dvh;
  padding: 24px;
}

.home-panel {
  max-width: 960px;
  margin: 0 auto;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
```

Create `apps/web-react/index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>世界杯问答</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `apps/web-react/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "tests", "vite.config.ts", "playwright.config.ts"]
}
```

Create `apps/web-react/vite.config.ts`:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts"
  }
});
```

Create `apps/web-react/src/setupTests.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Create `apps/web-react/src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Create `apps/web-react/playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  webServer: {
    command: "npm run dev -- --port 5173",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: true
  },
  use: {
    baseURL: "http://127.0.0.1:5173"
  }
});
```

- [ ] **Step 4: Add Playwright smoke test**

Create `apps/web-react/tests/home.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("home page is visible", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "世界杯问答" })).toBeVisible();
});
```

- [ ] **Step 5: Run React tests**

Run:

```bash
cd apps/web-react
npm test -- --run src/App.test.tsx
npm run build
```

Expected: PASS.

- [ ] **Step 6: Add React service to Compose**

Create `apps/web-react/Dockerfile`:

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

Modify `infra/docker-compose.yml` to add:

```yaml
  web-react:
    build:
      context: ../apps/web-react
    ports:
      - "3000:80"
    depends_on:
      - backend-java
```

- [ ] **Step 7: Run ui-ux-pro-max review for app shell**

Review against:

- Chinese-first first screen.
- No marketing hero.
- AA contrast.
- 44 px touch target readiness.
- Lucide icon usage.
- No horizontal scroll at mobile width.

- [ ] **Step 8: Commit**

```bash
git add apps/web-react infra/docker-compose.yml
git commit -m "feat: add react app shell"
```

---

### Task 5: Anonymous Fan Identity API And Home Page

**Files:**

- Create: `apps/backend-java/src/main/java/com/worldcup/fan/FanUser.java`
- Create: `apps/backend-java/src/main/java/com/worldcup/fan/FanUserRepository.java`
- Create: `apps/backend-java/src/main/java/com/worldcup/fan/FanUserService.java`
- Create: `apps/backend-java/src/main/java/com/worldcup/fan/FanController.java`
- Create: `apps/backend-java/src/test/java/com/worldcup/fan/FanUserServiceTest.java`
- Modify: `apps/web-react/src/App.tsx`
- Create: `apps/web-react/src/fan/FanSetupForm.tsx`
- Create: `apps/web-react/src/fan/FanSetupForm.test.tsx`
- Modify: `packages/api-contracts/openapi.yaml`

- [ ] **Step 1: Write failing Java service test**

Create `apps/backend-java/src/test/java/com/worldcup/fan/FanUserServiceTest.java`:

```java
package com.worldcup.fan;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Optional;
import org.junit.jupiter.api.Test;

class FanUserServiceTest {
    @Test
    void createsFanWhenUidDoesNotExist() {
        InMemoryFanUserRepository repository = new InMemoryFanUserRepository();
        FanUserService service = new FanUserService(repository);

        FanUser fan = service.createFan("mei-10", "小梅迷", "messi");

        assertThat(fan.uid()).isEqualTo("mei-10");
        assertThat(fan.nickname()).isEqualTo("小梅迷");
        assertThat(fan.avatarPlayerId()).isEqualTo("messi");
    }

    private static class InMemoryFanUserRepository implements FanUserRepository {
        private FanUser stored;

        @Override
        public Optional<FanUser> findByUid(String uid) {
            return Optional.ofNullable(stored).filter(fan -> fan.uid().equals(uid));
        }

        @Override
        public FanUser save(FanUser fanUser) {
            stored = fanUser;
            return fanUser;
        }
    }
}
```

- [ ] **Step 2: Run test and confirm failure**

Run:

```bash
cd apps/backend-java
./gradlew test --tests com.worldcup.fan.FanUserServiceTest
```

Expected: FAIL because fan classes do not exist.

- [ ] **Step 3: Implement minimal fan domain**

Create `FanUser`, `FanUserRepository`, and `FanUserService` with validation:

```java
package com.worldcup.fan;

public record FanUser(String uid, String nickname, String avatarPlayerId) {
}
```

```java
package com.worldcup.fan;

import java.util.Optional;

public interface FanUserRepository {
    Optional<FanUser> findByUid(String uid);

    FanUser save(FanUser fanUser);
}
```

```java
package com.worldcup.fan;

public class FanUserService {
    private final FanUserRepository repository;

    public FanUserService(FanUserRepository repository) {
        this.repository = repository;
    }

    public FanUser createFan(String uid, String nickname, String avatarPlayerId) {
        if (repository.findByUid(uid).isPresent()) {
            throw new IllegalArgumentException("uid already exists");
        }
        return repository.save(new FanUser(uid, nickname, avatarPlayerId));
    }
}
```

- [ ] **Step 4: Write failing React form test**

Create `apps/web-react/src/fan/FanSetupForm.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FanSetupForm } from "./FanSetupForm";

describe("FanSetupForm", () => {
  it("submits uid nickname and avatar", () => {
    const onSubmit = vi.fn();
    render(<FanSetupForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("UID"), { target: { value: "mei-10" } });
    fireEvent.change(screen.getByLabelText("昵称"), { target: { value: "小梅迷" } });
    fireEvent.click(screen.getByRole("radio", { name: "梅西" }));
    fireEvent.click(screen.getByRole("button", { name: "进入世界杯问答" }));

    expect(onSubmit).toHaveBeenCalledWith({
      uid: "mei-10",
      nickname: "小梅迷",
      avatarPlayerId: "messi"
    });
  });
});
```

- [ ] **Step 5: Implement fan setup form**

Create `apps/web-react/src/fan/FanSetupForm.tsx`:

```tsx
import { FormEvent, useState } from "react";

type FanSetupPayload = {
  uid: string;
  nickname: string;
  avatarPlayerId: string;
};

const avatars = [
  { id: "messi", label: "梅西" },
  { id: "ronaldo", label: "C 罗" },
  { id: "mbappe", label: "姆巴佩" }
];

export function FanSetupForm({ onSubmit }: { onSubmit: (payload: FanSetupPayload) => void }) {
  const [uid, setUid] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatarPlayerId, setAvatarPlayerId] = useState("messi");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ uid, nickname, avatarPlayerId });
  }

  return (
    <form onSubmit={handleSubmit} aria-label="球迷身份设置">
      <label>
        UID
        <input value={uid} onChange={(event) => setUid(event.target.value)} required />
      </label>
      <label>
        昵称
        <input value={nickname} onChange={(event) => setNickname(event.target.value)} required />
      </label>
      <fieldset>
        <legend>明星球员头像</legend>
        {avatars.map((avatar) => (
          <label key={avatar.id}>
            <input
              type="radio"
              name="avatar"
              checked={avatarPlayerId === avatar.id}
              onChange={() => setAvatarPlayerId(avatar.id)}
            />
            {avatar.label}
          </label>
        ))}
      </fieldset>
      <button type="submit">进入世界杯问答</button>
    </form>
  );
}
```

- [ ] **Step 6: Run tests and UI review**

Run:

```bash
cd apps/backend-java
./gradlew test --tests com.worldcup.fan.FanUserServiceTest
cd ../web-react
npm test -- --run src/fan/FanSetupForm.test.tsx
npm run build
```

Expected: PASS.

Run ui-ux-pro-max homepage review against the criteria in the spec.

- [ ] **Step 7: Commit**

```bash
git add apps/backend-java apps/web-react packages/api-contracts/openapi.yaml
git commit -m "feat: add anonymous fan identity"
```

---

### Task 6: Domain Browsing APIs And Browse Page

**Files:**

- Create: `apps/backend-java/src/main/java/com/worldcup/browse/TeamSummary.java`
- Create: `apps/backend-java/src/main/java/com/worldcup/browse/MatchSummary.java`
- Create: `apps/backend-java/src/main/java/com/worldcup/browse/BrowseService.java`
- Create: `apps/backend-java/src/main/java/com/worldcup/browse/BrowseController.java`
- Create: `apps/backend-java/src/test/java/com/worldcup/browse/BrowseServiceTest.java`
- Create: `apps/web-react/src/browse/BrowsePage.tsx`
- Create: `apps/web-react/src/browse/BrowsePage.test.tsx`

- [ ] **Step 1: Write failing browse service test**

Create `apps/backend-java/src/test/java/com/worldcup/browse/BrowseServiceTest.java`:

```java
package com.worldcup.browse;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class BrowseServiceTest {
    @Test
    void listsSeedTeamsForBrowsing() {
        BrowseService service = BrowseService.withSeedData();

        assertThat(service.listTeams())
            .extracting(TeamSummary::name)
            .contains("阿根廷", "法国");
    }
}
```

- [ ] **Step 2: Implement seed browse service**

Create records and service:

```java
package com.worldcup.browse;

public record TeamSummary(String id, String name, String region, String description) {
}
```

```java
package com.worldcup.browse;

public record MatchSummary(String id, String stage, String teamA, String teamB, String status) {
}
```

```java
package com.worldcup.browse;

import java.util.List;

public class BrowseService {
    private final List<TeamSummary> teams;

    private BrowseService(List<TeamSummary> teams) {
        this.teams = teams;
    }

    public static BrowseService withSeedData() {
        return new BrowseService(List.of(
            new TeamSummary("argentina", "阿根廷", "南美", "世界杯传统强队。"),
            new TeamSummary("france", "法国", "欧洲", "近年世界杯竞争力很强的球队。")
        ));
    }

    public List<TeamSummary> listTeams() {
        return teams;
    }
}
```

- [ ] **Step 3: Write failing BrowsePage test**

Create `apps/web-react/src/browse/BrowsePage.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrowsePage } from "./BrowsePage";

describe("BrowsePage", () => {
  it("shows teams matches players and venues tabs", () => {
    render(<BrowsePage />);

    expect(screen.getByRole("tab", { name: "球队" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "比赛" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "球员" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "场馆" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Implement BrowsePage**

Create `apps/web-react/src/browse/BrowsePage.tsx` with segmented tabs:

```tsx
const tabs = ["球队", "比赛", "球员", "场馆"];

export function BrowsePage() {
  return (
    <section aria-labelledby="browse-title">
      <h2 id="browse-title">浏览世界杯资料</h2>
      <div role="tablist" aria-label="资料分类">
        {tabs.map((tab, index) => (
          <button key={tab} role="tab" aria-selected={index === 0}>
            {tab}
          </button>
        ))}
      </div>
      <label>
        搜索
        <input type="search" placeholder="搜索球队、比赛、球员或场馆" />
      </label>
    </section>
  );
}
```

- [ ] **Step 5: Run tests and UI review**

Run:

```bash
cd apps/backend-java
./gradlew test --tests com.worldcup.browse.BrowseServiceTest
cd ../web-react
npm test -- --run src/browse/BrowsePage.test.tsx
npm run build
```

Run ui-ux-pro-max browse page review:

- lists scannable.
- status not color-only.
- mobile no horizontal scroll.
- search has visible label.

- [ ] **Step 6: Commit**

```bash
git add apps/backend-java apps/web-react
git commit -m "feat: add world cup browsing"
```

---

### Task 7: Python RAG Ingestion And Retrieval Core

**Files:**

- Create: `apps/rag-python/src/worldcup_rag/chunking.py`
- Create: `apps/rag-python/src/worldcup_rag/retrieval.py`
- Create: `apps/rag-python/src/worldcup_rag/schemas.py`
- Create: `apps/rag-python/tests/test_chunking.py`
- Create: `apps/rag-python/tests/test_retrieval.py`

- [ ] **Step 1: Write failing chunking test**

Create `apps/rag-python/tests/test_chunking.py`:

```python
from worldcup_rag.chunking import chunk_document


def test_chunk_document_keeps_source_metadata():
    chunks = chunk_document(
        source_id="fifa-2026",
        title="2026 世界杯基础资料",
        url="https://example.com/world-cup-2026",
        text="2026 世界杯将在多个城市举行。资料每日更新。",
    )

    assert chunks[0].source_id == "fifa-2026"
    assert chunks[0].title == "2026 世界杯基础资料"
    assert chunks[0].url == "https://example.com/world-cup-2026"
    assert "2026 世界杯" in chunks[0].text
```

- [ ] **Step 2: Implement chunking model**

Create `apps/rag-python/src/worldcup_rag/schemas.py`:

```python
from pydantic import BaseModel, HttpUrl


class DocumentChunk(BaseModel):
    source_id: str
    title: str
    url: HttpUrl
    text: str
```

Create `apps/rag-python/src/worldcup_rag/chunking.py`:

```python
from .schemas import DocumentChunk


def chunk_document(source_id: str, title: str, url: str, text: str) -> list[DocumentChunk]:
    normalized = " ".join(text.split())
    return [DocumentChunk(source_id=source_id, title=title, url=url, text=normalized)]
```

- [ ] **Step 3: Write retrieval no-source test**

Create `apps/rag-python/tests/test_retrieval.py`:

```python
from worldcup_rag.retrieval import build_no_source_answer


def test_no_source_answer_is_honest():
    answer = build_no_source_answer("今天谁受伤了？")

    assert "没有足够可靠资料" in answer.answer
    assert answer.citations == []
```

- [ ] **Step 4: Implement retrieval answer schema**

Modify `schemas.py`:

```python
class Citation(BaseModel):
    title: str
    url: HttpUrl


class RagAnswer(BaseModel):
    answer: str
    citations: list[Citation]
```

Create `apps/rag-python/src/worldcup_rag/retrieval.py`:

```python
from .schemas import RagAnswer


def build_no_source_answer(question: str) -> RagAnswer:
    return RagAnswer(
        answer=f"关于“{question}”，当前知识库没有足够可靠资料。请换一个问题，或等待资料更新。",
        citations=[],
    )
```

- [ ] **Step 5: Run Python tests**

Run:

```bash
cd apps/rag-python
python -m pytest tests/test_chunking.py tests/test_retrieval.py -q
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/rag-python
git commit -m "feat: add rag chunking and honest fallback"
```

---

### Task 8: Chat API, Chat Page, And Citation Display

**Files:**

- Create: `apps/rag-python/src/worldcup_rag/answer_api.py`
- Modify: `apps/rag-python/src/worldcup_rag/main.py`
- Create: `apps/rag-python/tests/test_answer_api.py`
- Create: `apps/backend-java/src/main/java/com/worldcup/chat/ChatController.java`
- Create: `apps/backend-java/src/main/java/com/worldcup/chat/ChatService.java`
- Create: `apps/backend-java/src/test/java/com/worldcup/chat/ChatServiceTest.java`
- Create: `apps/web-react/src/chat/ChatPage.tsx`
- Create: `apps/web-react/src/chat/ChatPage.test.tsx`

- [ ] **Step 1: Write failing FastAPI answer test**

Create `apps/rag-python/tests/test_answer_api.py`:

```python
from fastapi.testclient import TestClient

from worldcup_rag.main import app


def test_answer_returns_honest_fallback_with_empty_citations():
    client = TestClient(app)

    response = client.post("/rag/answer", json={"question": "今天谁受伤了？"})

    assert response.status_code == 200
    body = response.json()
    assert "没有足够可靠资料" in body["answer"]
    assert body["citations"] == []
```

- [ ] **Step 2: Implement FastAPI answer route**

Create `apps/rag-python/src/worldcup_rag/answer_api.py`:

```python
from pydantic import BaseModel

from .retrieval import build_no_source_answer
from .schemas import RagAnswer


class AnswerRequest(BaseModel):
    question: str


def answer_question(request: AnswerRequest) -> RagAnswer:
    return build_no_source_answer(request.question)
```

Modify `main.py`:

```python
from .answer_api import AnswerRequest, answer_question


@app.post("/rag/answer")
def rag_answer(request: AnswerRequest):
    return answer_question(request)
```

- [ ] **Step 3: Write failing React chat test**

Create `apps/web-react/src/chat/ChatPage.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChatPage } from "./ChatPage";

describe("ChatPage", () => {
  it("shows question input and source area", () => {
    render(<ChatPage />);

    expect(screen.getByLabelText("向世界杯资料库提问")).toBeInTheDocument();
    expect(screen.getByText("回答会显示来源链接和资料更新时间。")).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Implement ChatPage shell**

Create `apps/web-react/src/chat/ChatPage.tsx`:

```tsx
export function ChatPage() {
  return (
    <section aria-labelledby="chat-title">
      <h2 id="chat-title">问世界杯</h2>
      <p>回答会显示来源链接和资料更新时间。</p>
      <form>
        <label>
          向世界杯资料库提问
          <textarea rows={4} />
        </label>
        <button type="submit">发送问题</button>
      </form>
    </section>
  );
}
```

- [ ] **Step 5: Run tests and UI review**

Run:

```bash
cd apps/rag-python
python -m pytest tests/test_answer_api.py -q
cd ../web-react
npm test -- --run src/chat/ChatPage.test.tsx
npm run build
```

Run ui-ux-pro-max chat page review:

- citations clickable when present.
- no-source message clear.
- loading state planned before async integration.
- textarea label visible.

- [ ] **Step 6: Commit**

```bash
git add apps/rag-python apps/web-react apps/backend-java
git commit -m "feat: add rag chat fallback flow"
```

---

### Task 9: Daily Ingestion Jobs And Management Page

**Files:**

- Create: `apps/rag-python/src/worldcup_rag/ingest.py`
- Create: `apps/rag-python/tests/test_ingest.py`
- Create: `apps/backend-java/src/main/java/com/worldcup/admin/IngestJobSummary.java`
- Create: `apps/backend-java/src/main/java/com/worldcup/admin/AdminController.java`
- Create: `apps/backend-java/src/test/java/com/worldcup/admin/AdminControllerTest.java`
- Create: `apps/web-react/src/admin/AdminPage.tsx`
- Create: `apps/web-react/src/admin/AdminPage.test.tsx`

- [ ] **Step 1: Write failing ingest job test**

Create `apps/rag-python/tests/test_ingest.py`:

```python
from worldcup_rag.ingest import IngestJob


def test_ingest_job_records_success_counts():
    job = IngestJob.start("daily")
    job.mark_success(source_count=2, chunk_count=5)

    assert job.status == "success"
    assert job.source_count == 2
    assert job.chunk_count == 5
```

- [ ] **Step 2: Implement job state model**

Create `apps/rag-python/src/worldcup_rag/ingest.py`:

```python
from dataclasses import dataclass


@dataclass
class IngestJob:
    kind: str
    status: str
    source_count: int
    chunk_count: int
    error_summary: str | None

    @classmethod
    def start(cls, kind: str) -> "IngestJob":
        return cls(kind=kind, status="running", source_count=0, chunk_count=0, error_summary=None)

    def mark_success(self, source_count: int, chunk_count: int) -> None:
        self.status = "success"
        self.source_count = source_count
        self.chunk_count = chunk_count
```

- [ ] **Step 3: Write failing AdminPage test**

Create `apps/web-react/src/admin/AdminPage.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminPage } from "./AdminPage";

describe("AdminPage", () => {
  it("shows ingest status and rebuild action", () => {
    render(<AdminPage />);

    expect(screen.getByRole("heading", { name: "管理数据更新" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "重建索引" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Implement AdminPage shell**

Create `apps/web-react/src/admin/AdminPage.tsx`:

```tsx
export function AdminPage() {
  return (
    <section aria-labelledby="admin-title">
      <h2 id="admin-title">管理数据更新</h2>
      <p>查看每日导入任务、最后更新时间和错误摘要。</p>
      <button type="button">重建索引</button>
    </section>
  );
}
```

- [ ] **Step 5: Run tests and UI review**

Run:

```bash
cd apps/rag-python
python -m pytest tests/test_ingest.py -q
cd ../web-react
npm test -- --run src/admin/AdminPage.test.tsx
npm run build
```

Run ui-ux-pro-max admin page review:

- rebuild action requires confirmation before wiring.
- no secrets displayed.
- status readable.
- error summary copy is clear.

- [ ] **Step 6: Commit**

```bash
git add apps/rag-python apps/backend-java apps/web-react
git commit -m "feat: add ingestion job management"
```

---

### Task 10: My Records And Feedback

**Files:**

- Create: `apps/backend-java/src/main/java/com/worldcup/records/ChatRecord.java`
- Create: `apps/backend-java/src/main/java/com/worldcup/records/RecordsService.java`
- Create: `apps/backend-java/src/test/java/com/worldcup/records/RecordsServiceTest.java`
- Create: `apps/web-react/src/records/MyRecordsPage.tsx`
- Create: `apps/web-react/src/records/MyRecordsPage.test.tsx`

- [ ] **Step 1: Write failing records isolation test**

Create `apps/backend-java/src/test/java/com/worldcup/records/RecordsServiceTest.java`:

```java
package com.worldcup.records;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class RecordsServiceTest {
    @Test
    void listsOnlyRecordsForRequestedUid() {
        RecordsService service = new RecordsService();
        service.addRecord("fan-a", "阿根廷拿过几次冠军？");
        service.addRecord("fan-b", "法国队资料");

        assertThat(service.recordsFor("fan-a"))
            .extracting(ChatRecord::question)
            .containsExactly("阿根廷拿过几次冠军？");
    }
}
```

- [ ] **Step 2: Implement records service**

Create:

```java
package com.worldcup.records;

public record ChatRecord(String uid, String question) {
}
```

```java
package com.worldcup.records;

import java.util.ArrayList;
import java.util.List;

public class RecordsService {
    private final List<ChatRecord> records = new ArrayList<>();

    public void addRecord(String uid, String question) {
        records.add(new ChatRecord(uid, question));
    }

    public List<ChatRecord> recordsFor(String uid) {
        return records.stream().filter(record -> record.uid().equals(uid)).toList();
    }
}
```

- [ ] **Step 3: Write MyRecordsPage test**

Create `apps/web-react/src/records/MyRecordsPage.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MyRecordsPage } from "./MyRecordsPage";

describe("MyRecordsPage", () => {
  it("explains lightweight identity clearly", () => {
    render(<MyRecordsPage uid="mei-10" nickname="小梅迷" />);

    expect(screen.getByText("小梅迷")).toBeInTheDocument();
    expect(screen.getByText("这不是密码账号，请记住你的 UID。")).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Implement MyRecordsPage**

Create `apps/web-react/src/records/MyRecordsPage.tsx`:

```tsx
type Props = {
  uid: string;
  nickname: string;
};

export function MyRecordsPage({ uid, nickname }: Props) {
  return (
    <section aria-labelledby="records-title">
      <h2 id="records-title">我的记录</h2>
      <p>{nickname}</p>
      <p>UID：{uid}</p>
      <p>这不是密码账号，请记住你的 UID。</p>
    </section>
  );
}
```

- [ ] **Step 5: Run tests and UI review**

Run:

```bash
cd apps/backend-java
./gradlew test --tests com.worldcup.records.RecordsServiceTest
cd ../web-react
npm test -- --run src/records/MyRecordsPage.test.tsx
npm run build
```

Run ui-ux-pro-max records page review:

- empty state actionable.
- current identity information is readable before history data is added.
- copy does not imply secure account.

- [ ] **Step 6: Commit**

```bash
git add apps/backend-java apps/web-react
git commit -m "feat: add fan records page"
```

---

### Task 11: RAG Evaluation And Release Hardening

**Files:**

- Create: `apps/rag-python/src/worldcup_rag/eval_runner.py`
- Create: `apps/rag-python/tests/test_eval_runner.py`
- Create: `infra/backup.md`
- Modify: `README.md`

- [ ] **Step 1: Write failing evaluation test**

Create `apps/rag-python/tests/test_eval_runner.py`:

```python
from worldcup_rag.eval_runner import score_citation_coverage


def test_score_citation_coverage_counts_answers_with_sources():
    score = score_citation_coverage([
        {"answer": "阿根廷曾夺冠。", "citations": [{"title": "来源", "url": "https://example.com"}]},
        {"answer": "资料不足。", "citations": []},
    ])

    assert score == 0.5
```

- [ ] **Step 2: Implement evaluation helper**

Create `apps/rag-python/src/worldcup_rag/eval_runner.py`:

```python
def score_citation_coverage(results: list[dict]) -> float:
    if not results:
        return 0.0
    with_sources = sum(1 for result in results if result.get("citations"))
    return with_sources / len(results)
```

- [ ] **Step 3: Add backup notes**

Create `infra/backup.md`:

```markdown
# 单机备份说明

MVP 的核心状态在 PostgreSQL 中。上线前必须配置定期 `pg_dump`，并将备份文件保存到服务器外部位置。

示例：

```bash
docker compose -f infra/docker-compose.yml exec postgres pg_dump -U worldcup worldcup > worldcup-backup.sql
```
```

- [ ] **Step 4: Update README with verified commands**

Add:

```markdown
## 本地验证命令

```bash
docker compose -f infra/docker-compose.yml config
cd apps/backend-java && ./gradlew test
cd ../rag-python && python -m pytest
cd ../web-react && npm test -- --run && npm run build
```
```

- [ ] **Step 5: Run full verification**

Run:

```bash
docker compose -f infra/docker-compose.yml config
cd apps/backend-java && ./gradlew test
cd ../rag-python && python -m pytest
cd ../web-react && npm test -- --run && npm run build
```

Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add apps/rag-python infra/backup.md README.md
git commit -m "test: add rag evaluation and release notes"
```

---

## Plan Self-Review

Coverage check:

- Monorepo and Docker Compose are covered in Task 1.
- Spring Boot Java backend is covered in Task 2.
- FastAPI Python service is covered in Task 3.
- React frontend comes first in Task 4.
- Anonymous fan identity is covered in Task 5.
- Browsing teams, matches, players, and venues starts in Task 6.
- RAG chunking, honest fallback, chat, and citations are covered in Tasks 7 and 8.
- Daily updates and management page are covered in Task 9.
- My records and uid isolation are covered in Task 10.
- RAG evaluation and release hardening are covered in Task 11.
- Vue is intentionally reserved but not implemented in this MVP plan.

Placeholder scan:

- This plan avoids open implementation placeholders.
- Persistence and real provider calls are deliberately excluded from the first skeleton tasks and are introduced only after tested interfaces exist.

Type consistency:

- Fan identity uses `FanUser`, `uid`, `nickname`, and `avatarPlayerId`.
- Browse records use `TeamSummary` and `MatchSummary`.
- RAG schemas use `DocumentChunk`, `Citation`, and `RagAnswer`.
- UI pages use `FanSetupForm`, `BrowsePage`, `ChatPage`, `AdminPage`, and `MyRecordsPage`.
