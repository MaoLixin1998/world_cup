# World Cup Layered Architecture Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将当前世界杯 RAG MVP 的 Java 后端和 React 前端重构为更接近真实业务项目的分层结构，同时保持现有功能和用户体验不变。

**Architecture:** Java 后端拆成 `worldcup-api / worldcup-dal / worldcup-service / worldcup-start` 四个 Gradle 子模块，依赖只能从启动层流向服务层、数据层和契约层。React 前端拆成 `app / pages / features / shared / styles`，页面只做编排，业务能力落在 feature，通用能力落在 shared。

**Tech Stack:** Java 21, Spring Boot 3, Gradle Kotlin DSL, JUnit 5, React 18, TypeScript, Vite, Vitest, Testing Library, Playwright, pnpm.

---

## Source Spec

- `docs/superpowers/specs/2026-06-12-world-cup-layered-architecture-refactor.md`

## Hard Constraints

- Do not add Dubbo, HSF, Nacos, Milvus, Elasticsearch, Kubernetes, login, live scores, or news.
- Do not change the visible React page design during this refactor.
- Keep Chinese comments for learning-oriented code.
- Keep key Java and frontend debug logs in Chinese.
- Use `/Users/mao/tools/node` and pnpm for React commands.
- In mainland China network contexts, keep existing Aliyun Maven and npmmirror settings.
- Do not commit unrelated local Gradle wrapper changes unless the task explicitly stages them.

## File Map

### Java files to create or move

- Create/modify: `apps/backend-java/settings.gradle.kts`
- Modify: `apps/backend-java/build.gradle.kts`
- Create: `apps/backend-java/worldcup-api/build.gradle.kts`
- Create: `apps/backend-java/worldcup-api/src/main/java/com/worldcup/api/fan/CreateFanUserRequest.java`
- Create: `apps/backend-java/worldcup-api/src/main/java/com/worldcup/api/fan/FanUserResponse.java`
- Create: `apps/backend-java/worldcup-api/src/main/java/com/worldcup/api/fan/FanUserFacade.java`
- Create: `apps/backend-java/worldcup-dal/build.gradle.kts`
- Create: `apps/backend-java/worldcup-dal/src/main/java/com/worldcup/dal/fan/FanUserDO.java`
- Create: `apps/backend-java/worldcup-dal/src/main/java/com/worldcup/dal/fan/FanUserRepository.java`
- Create: `apps/backend-java/worldcup-dal/src/main/java/com/worldcup/dal/fan/InMemoryFanUserRepository.java`
- Create: `apps/backend-java/worldcup-service/build.gradle.kts`
- Create: `apps/backend-java/worldcup-service/src/main/java/com/worldcup/service/fan/FanUserFacadeImpl.java`
- Create: `apps/backend-java/worldcup-start/build.gradle.kts`
- Move: `apps/backend-java/src/main/java/com/worldcup/WorldCupApplication.java` -> `apps/backend-java/worldcup-start/src/main/java/com/worldcup/start/WorldCupApplication.java`
- Move: `apps/backend-java/src/main/java/com/worldcup/health/HealthController.java` -> `apps/backend-java/worldcup-start/src/main/java/com/worldcup/start/health/HealthController.java`
- Move: `apps/backend-java/src/main/resources/application.yml` -> `apps/backend-java/worldcup-start/src/main/resources/application.yml`
- Move/update: `apps/backend-java/Dockerfile` -> `apps/backend-java/worldcup-start/Dockerfile`
- Delete after migration: `apps/backend-java/src/main/java/com/worldcup/fan/FanUser.java`
- Delete after migration: `apps/backend-java/src/main/java/com/worldcup/fan/FanUserRepository.java`
- Delete after migration: `apps/backend-java/src/main/java/com/worldcup/fan/FanUserService.java`

### Java tests to create or move

- Create: `apps/backend-java/worldcup-service/src/test/java/com/worldcup/service/fan/FanUserFacadeImplTest.java`
- Move/update: `apps/backend-java/src/test/java/com/worldcup/fan/FanUserServiceTest.java` -> service test above
- Move/update: `apps/backend-java/src/test/java/com/worldcup/health/HealthControllerTest.java` -> `apps/backend-java/worldcup-start/src/test/java/com/worldcup/start/health/HealthControllerTest.java`
- Create: `apps/backend-java/worldcup-start/src/test/java/com/worldcup/start/WorldCupApplicationTest.java`

### React files to create or move

- Move/update: `apps/web-react/src/App.tsx` -> `apps/web-react/src/app/App.tsx`
- Modify: `apps/web-react/src/main.tsx`
- Create: `apps/web-react/src/pages/fan-setup/FanSetupPage.tsx`
- Create: `apps/web-react/src/pages/home/HomePage.tsx`
- Move/update: `apps/web-react/src/fan/FanSetupForm.tsx` -> `apps/web-react/src/features/fan-identity/ui/FanSetupForm.tsx`
- Create: `apps/web-react/src/features/fan-identity/ui/AvatarOptionCard.tsx`
- Create: `apps/web-react/src/features/fan-identity/data/avatarOptions.ts`
- Create: `apps/web-react/src/features/fan-identity/model/fanIdentityTypes.ts`
- Create: `apps/web-react/src/features/fan-identity/model/fanIdentityStorage.ts`
- Create: `apps/web-react/src/features/fan-identity/index.ts`
- Create: `apps/web-react/src/shared/assets/worldCupAssets.ts`
- Create: `apps/web-react/src/shared/lib/logger.ts`
- Create: `apps/web-react/src/shared/lib/storage.ts`
- Create: `apps/web-react/src/shared/ui/Button.tsx`
- Create: `apps/web-react/src/shared/ui/TextField.tsx`
- Create: `apps/web-react/src/shared/ui/Notice.tsx`
- Split/update: `apps/web-react/src/styles.css` -> `apps/web-react/src/styles/tokens.css`, `apps/web-react/src/styles/base.css`, `apps/web-react/src/styles/layout.css`, plus feature/page CSS if needed.

### React tests to create or move

- Move/update: `apps/web-react/src/App.test.tsx` -> `apps/web-react/src/app/App.test.tsx`
- Move/update: `apps/web-react/src/App.identity.test.tsx` -> `apps/web-react/src/app/App.identity.test.tsx`
- Move/update: `apps/web-react/src/fan/FanSetupForm.test.tsx` -> `apps/web-react/src/features/fan-identity/ui/FanSetupForm.test.tsx`
- Create: `apps/web-react/src/features/fan-identity/model/fanIdentityStorage.test.ts`
- Create: `apps/web-react/src/pages/home/HomePage.test.tsx`
- Keep/update: `apps/web-react/tests/home.spec.ts`

---

### Task 1: Java Multi-Module Skeleton

**Files:**

- Modify: `apps/backend-java/settings.gradle.kts`
- Modify: `apps/backend-java/build.gradle.kts`
- Create: `apps/backend-java/worldcup-api/build.gradle.kts`
- Create: `apps/backend-java/worldcup-dal/build.gradle.kts`
- Create: `apps/backend-java/worldcup-service/build.gradle.kts`
- Create: `apps/backend-java/worldcup-start/build.gradle.kts`
- Move: `apps/backend-java/src/main/java/com/worldcup/WorldCupApplication.java`
- Move: `apps/backend-java/src/main/java/com/worldcup/health/HealthController.java`
- Move: `apps/backend-java/src/main/resources/application.yml`
- Move/update test: `apps/backend-java/src/test/java/com/worldcup/health/HealthControllerTest.java`

- [ ] **Step 1: Write the failing start-module health test**

Create `apps/backend-java/worldcup-start/src/test/java/com/worldcup/start/health/HealthControllerTest.java`:

```java
package com.worldcup.start.health;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(HealthController.class)
class HealthControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void returnsJavaBackendHealthStatus() throws Exception {
        mockMvc.perform(get("/api/health"))
            .andExpect(status().isOk())
            .andExpect(content().string("world-cup-backend-ok"));
    }
}
```

- [ ] **Step 2: Run the new test to verify it fails**

Run:

```bash
cd apps/backend-java
./gradlew :worldcup-start:test --tests com.worldcup.start.health.HealthControllerTest
```

Expected: fail because `worldcup-start` module or `HealthController` does not exist yet.

- [ ] **Step 3: Register Gradle modules**

Update `apps/backend-java/settings.gradle.kts` so the bottom of the file includes:

```kotlin
rootProject.name = "backend-java"

include("worldcup-api")
include("worldcup-dal")
include("worldcup-service")
include("worldcup-start")
```

Replace `apps/backend-java/build.gradle.kts` with shared module configuration:

```kotlin
plugins {
    java
    id("org.springframework.boot") version "3.3.5" apply false
    id("io.spring.dependency-management") version "1.1.6" apply false
}

group = "com.worldcup"
version = "0.1.0"

subprojects {
    apply(plugin = "java")
    apply(plugin = "io.spring.dependency-management")

    group = rootProject.group
    version = rootProject.version

    java {
        toolchain {
            languageVersion = JavaLanguageVersion.of(21)
        }
    }

    tasks.withType<Test> {
        useJUnitPlatform()
    }
}
```

- [ ] **Step 4: Create child module build files**

Create `apps/backend-java/worldcup-api/build.gradle.kts`:

```kotlin
dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter")
}
```

Create `apps/backend-java/worldcup-dal/build.gradle.kts`:

```kotlin
dependencies {
    implementation(project(":worldcup-api"))
    implementation("org.springframework.boot:spring-boot-starter-jdbc")
    implementation("org.postgresql:postgresql")
    testImplementation("org.junit.jupiter:junit-jupiter")
}
```

Create `apps/backend-java/worldcup-service/build.gradle.kts`:

```kotlin
dependencies {
    implementation(project(":worldcup-api"))
    implementation(project(":worldcup-dal"))
    implementation("org.springframework.boot:spring-boot-starter")
    testImplementation("org.junit.jupiter:junit-jupiter")
}
```

Create `apps/backend-java/worldcup-start/build.gradle.kts`:

```kotlin
plugins {
    id("org.springframework.boot")
}

dependencies {
    implementation(project(":worldcup-api"))
    implementation(project(":worldcup-service"))
    implementation(project(":worldcup-dal"))
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}
```

- [ ] **Step 5: Move start-layer classes**

Create `apps/backend-java/worldcup-start/src/main/java/com/worldcup/start/WorldCupApplication.java`:

```java
package com.worldcup.start;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Java 主业务后端启动类。
 *
 * <p>start 模块只负责应用入口和外部适配，业务规则放在 service 模块。
 */
@SpringBootApplication(scanBasePackages = "com.worldcup")
public class WorldCupApplication {
    public static void main(String[] args) {
        SpringApplication.run(WorldCupApplication.class, args);
    }
}
```

Create `apps/backend-java/worldcup-start/src/main/java/com/worldcup/start/health/HealthController.java`:

```java
package com.worldcup.start.health;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 健康检查入口。
 *
 * <p>该 Controller 只用于部署探活，不承载业务逻辑。
 */
@RestController
public class HealthController {
    @GetMapping("/api/health")
    public String health() {
        return "world-cup-backend-ok";
    }
}
```

Move `apps/backend-java/src/main/resources/application.yml` to `apps/backend-java/worldcup-start/src/main/resources/application.yml` without changing content.

- [ ] **Step 6: Run start module tests**

Run:

```bash
cd apps/backend-java
./gradlew :worldcup-start:test --tests com.worldcup.start.health.HealthControllerTest
```

Expected: pass.

- [ ] **Step 7: Remove old moved files**

Delete:

```text
apps/backend-java/src/main/java/com/worldcup/WorldCupApplication.java
apps/backend-java/src/main/java/com/worldcup/health/HealthController.java
apps/backend-java/src/test/java/com/worldcup/health/HealthControllerTest.java
```

- [ ] **Step 8: Commit**

```bash
git add apps/backend-java/settings.gradle.kts apps/backend-java/build.gradle.kts apps/backend-java/worldcup-api apps/backend-java/worldcup-dal apps/backend-java/worldcup-service apps/backend-java/worldcup-start apps/backend-java/src
git commit -m "refactor: split java backend modules"
```

---

### Task 2: Java Fan Identity Service Migration

**Files:**

- Create: `apps/backend-java/worldcup-api/src/main/java/com/worldcup/api/fan/CreateFanUserRequest.java`
- Create: `apps/backend-java/worldcup-api/src/main/java/com/worldcup/api/fan/FanUserResponse.java`
- Create: `apps/backend-java/worldcup-api/src/main/java/com/worldcup/api/fan/FanUserFacade.java`
- Create: `apps/backend-java/worldcup-dal/src/main/java/com/worldcup/dal/fan/FanUserDO.java`
- Create: `apps/backend-java/worldcup-dal/src/main/java/com/worldcup/dal/fan/FanUserRepository.java`
- Create: `apps/backend-java/worldcup-dal/src/main/java/com/worldcup/dal/fan/InMemoryFanUserRepository.java`
- Create: `apps/backend-java/worldcup-service/src/main/java/com/worldcup/service/fan/FanUserFacadeImpl.java`
- Create: `apps/backend-java/worldcup-service/src/test/java/com/worldcup/service/fan/FanUserFacadeImplTest.java`
- Delete: `apps/backend-java/src/main/java/com/worldcup/fan/FanUser.java`
- Delete: `apps/backend-java/src/main/java/com/worldcup/fan/FanUserRepository.java`
- Delete: `apps/backend-java/src/main/java/com/worldcup/fan/FanUserService.java`

- [ ] **Step 1: Write failing service tests**

Create `apps/backend-java/worldcup-service/src/test/java/com/worldcup/service/fan/FanUserFacadeImplTest.java`:

```java
package com.worldcup.service.fan;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.worldcup.api.fan.CreateFanUserRequest;
import com.worldcup.api.fan.FanUserResponse;
import com.worldcup.dal.fan.InMemoryFanUserRepository;
import org.junit.jupiter.api.Test;

class FanUserFacadeImplTest {
    @Test
    void createsFanIdentityWhenUidIsNew() {
        FanUserFacadeImpl facade = new FanUserFacadeImpl(new InMemoryFanUserRepository());

        FanUserResponse response = facade.createFan(new CreateFanUserRequest("mei-10", "小梅迷", "messi"));

        assertEquals("mei-10", response.uid());
        assertEquals("小梅迷", response.nickname());
        assertEquals("messi", response.avatarPlayerId());
    }

    @Test
    void rejectsDuplicatedUid() {
        FanUserFacadeImpl facade = new FanUserFacadeImpl(new InMemoryFanUserRepository());
        facade.createFan(new CreateFanUserRequest("mei-10", "小梅迷", "messi"));

        IllegalArgumentException error = assertThrows(
            IllegalArgumentException.class,
            () -> facade.createFan(new CreateFanUserRequest("mei-10", "另一个昵称", "haaland"))
        );

        assertEquals("UID 已存在", error.getMessage());
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd apps/backend-java
./gradlew :worldcup-service:test --tests com.worldcup.service.fan.FanUserFacadeImplTest
```

Expected: fail because API, DAL, and service classes are not implemented.

- [ ] **Step 3: Create API contracts**

Create `CreateFanUserRequest.java`:

```java
package com.worldcup.api.fan;

/**
 * 创建匿名球迷身份的请求。
 *
 * <p>api 模块只定义对外契约，不关心请求来自 REST、HSF 还是 Dubbo。
 */
public record CreateFanUserRequest(String uid, String nickname, String avatarPlayerId) {
}
```

Create `FanUserResponse.java`:

```java
package com.worldcup.api.fan;

/**
 * 匿名球迷身份响应。
 *
 * <p>不要把数据库 DO 直接暴露给页面或远程服务消费者。
 */
public record FanUserResponse(String uid, String nickname, String avatarPlayerId) {
}
```

Create `FanUserFacade.java`:

```java
package com.worldcup.api.fan;

public interface FanUserFacade {
    FanUserResponse createFan(CreateFanUserRequest request);
}
```

- [ ] **Step 4: Create DAL model and repository**

Create `FanUserDO.java`:

```java
package com.worldcup.dal.fan;

/**
 * 球迷身份数据库对象。
 *
 * <p>DO 只描述持久化形态，不承担业务校验。
 */
public record FanUserDO(String uid, String nickname, String avatarPlayerId) {
}
```

Create `FanUserRepository.java`:

```java
package com.worldcup.dal.fan;

import java.util.Optional;

public interface FanUserRepository {
    Optional<FanUserDO> findByUid(String uid);

    FanUserDO save(FanUserDO fanUser);
}
```

Create `InMemoryFanUserRepository.java`:

```java
package com.worldcup.dal.fan;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

/**
 * MVP 阶段的内存仓库。
 *
 * <p>它让 service/start 分层先稳定下来；接 PostgreSQL 时只替换 DAL 实现，不改业务规则。
 */
@Repository
public class InMemoryFanUserRepository implements FanUserRepository {
    private final Map<String, FanUserDO> fanUsers = new ConcurrentHashMap<>();

    @Override
    public Optional<FanUserDO> findByUid(String uid) {
        return Optional.ofNullable(fanUsers.get(uid));
    }

    @Override
    public FanUserDO save(FanUserDO fanUser) {
        fanUsers.put(fanUser.uid(), fanUser);
        return fanUser;
    }
}
```

- [ ] **Step 5: Implement service facade**

Create `FanUserFacadeImpl.java`:

```java
package com.worldcup.service.fan;

import com.worldcup.api.fan.CreateFanUserRequest;
import com.worldcup.api.fan.FanUserFacade;
import com.worldcup.api.fan.FanUserResponse;
import com.worldcup.dal.fan.FanUserDO;
import com.worldcup.dal.fan.FanUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * 球迷身份业务服务。
 *
 * <p>service 层集中处理业务规则，Controller 和 DAL 都不要重复这部分判断。
 */
@Service
public class FanUserFacadeImpl implements FanUserFacade {
    private static final Logger log = LoggerFactory.getLogger(FanUserFacadeImpl.class);

    private final FanUserRepository repository;

    public FanUserFacadeImpl(FanUserRepository repository) {
        this.repository = repository;
    }

    @Override
    public FanUserResponse createFan(CreateFanUserRequest request) {
        log.info("准备创建球迷身份，uid={}，nickname={}，avatarPlayerId={}",
            request.uid(), request.nickname(), request.avatarPlayerId());

        if (repository.findByUid(request.uid()).isPresent()) {
            log.warn("创建球迷身份失败：UID 已存在，uid={}", request.uid());
            throw new IllegalArgumentException("UID 已存在");
        }

        FanUserDO savedFan = repository.save(new FanUserDO(
            request.uid(),
            request.nickname(),
            request.avatarPlayerId()
        ));
        log.info("球迷身份创建成功，uid={}", savedFan.uid());
        return new FanUserResponse(savedFan.uid(), savedFan.nickname(), savedFan.avatarPlayerId());
    }
}
```

- [ ] **Step 6: Run service tests**

```bash
cd apps/backend-java
./gradlew :worldcup-service:test --tests com.worldcup.service.fan.FanUserFacadeImplTest
```

Expected: pass.

- [ ] **Step 7: Delete old single-module fan classes and test**

Delete:

```text
apps/backend-java/src/main/java/com/worldcup/fan/FanUser.java
apps/backend-java/src/main/java/com/worldcup/fan/FanUserRepository.java
apps/backend-java/src/main/java/com/worldcup/fan/FanUserService.java
apps/backend-java/src/test/java/com/worldcup/fan/FanUserServiceTest.java
```

- [ ] **Step 8: Run all Java tests**

```bash
cd apps/backend-java
./gradlew test
```

Expected: all module tests pass.

- [ ] **Step 9: Commit**

```bash
git add apps/backend-java
git commit -m "refactor: move fan identity into java layers"
```

---

### Task 3: Java Start Module Packaging And Compose Sync

**Files:**

- Move/update: `apps/backend-java/Dockerfile` -> `apps/backend-java/worldcup-start/Dockerfile`
- Modify: `infra/docker-compose.yml`
- Modify: `README.md`

- [ ] **Step 1: Write packaging expectation into Dockerfile**

Create `apps/backend-java/worldcup-start/Dockerfile`:

```dockerfile
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /workspace

# 多模块 Gradle 工程需要从 backend-java 根目录构建，这里复制整个后端目录。
COPY . .
RUN ./gradlew :worldcup-start:bootJar --no-daemon

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /workspace/worldcup-start/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

- [ ] **Step 2: Update Compose build context**

In `infra/docker-compose.yml`, update the Java service:

```yaml
  backend-java:
    build:
      context: ../apps/backend-java
      dockerfile: worldcup-start/Dockerfile
```

Keep all existing environment, ports, and `depends_on` values unchanged.

- [ ] **Step 3: Remove old Dockerfile**

Delete:

```text
apps/backend-java/Dockerfile
```

- [ ] **Step 4: Run Java packaging**

```bash
cd apps/backend-java
./gradlew :worldcup-start:bootJar
```

Expected: `apps/backend-java/worldcup-start/build/libs/` contains a boot jar.

- [ ] **Step 5: Commit**

```bash
git add apps/backend-java infra/docker-compose.yml README.md
git commit -m "chore: package java start module"
```

---

### Task 4: React App And Page Layer Split

**Files:**

- Move/update: `apps/web-react/src/App.tsx` -> `apps/web-react/src/app/App.tsx`
- Modify: `apps/web-react/src/main.tsx`
- Create: `apps/web-react/src/pages/fan-setup/FanSetupPage.tsx`
- Create: `apps/web-react/src/pages/home/HomePage.tsx`
- Move/update tests: `apps/web-react/src/App.test.tsx`, `apps/web-react/src/App.identity.test.tsx`
- Create: `apps/web-react/src/pages/home/HomePage.test.tsx`

- [ ] **Step 1: Write failing HomePage test**

Create `apps/web-react/src/pages/home/HomePage.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomePage } from "./HomePage";

describe("HomePage", () => {
  it("greets the current fan and shows the world cup qa entry", () => {
    render(<HomePage fanName="小梅迷" />);

    expect(screen.getByRole("heading", { name: "世界杯问答" })).toBeInTheDocument();
    expect(screen.getByText(/小梅迷，用中文提问/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd apps/web-react
COREPACK_NPM_REGISTRY=https://registry.npmmirror.com /Users/mao/tools/node/lib/node_modules/corepack/shims/pnpm test -- src/pages/home/HomePage.test.tsx
```

Expected: fail because `HomePage` does not exist.

- [ ] **Step 3: Create HomePage**

Create `apps/web-react/src/pages/home/HomePage.tsx`:

```tsx
import { Search } from "lucide-react";

type HomePageProps = {
  fanName: string;
};

export function HomePage({ fanName }: HomePageProps) {
  return (
    <section className="home-panel" aria-labelledby="home-title">
      <div className="title-row">
        <Search aria-hidden="true" size={28} />
        <h1 id="home-title">世界杯问答</h1>
      </div>
      <p>{fanName}，用中文提问，查看来源，轻松浏览世界杯资料。</p>
    </section>
  );
}
```

- [ ] **Step 4: Create FanSetupPage wrapper**

Create `apps/web-react/src/pages/fan-setup/FanSetupPage.tsx`:

```tsx
import { FanIdentity, FanSetupForm } from "../../features/fan-identity";

type FanSetupPageProps = {
  onSubmit: (identity: FanIdentity) => void;
};

export function FanSetupPage({ onSubmit }: FanSetupPageProps) {
  return <FanSetupForm onSubmit={onSubmit} />;
}
```

This will fail until Task 5 creates the feature index. In this task, temporarily import from the old path if Task 5 is not done yet:

```tsx
import { FanIdentity, FanSetupForm } from "../../fan/FanSetupForm";
```

- [ ] **Step 5: Move App into app layer**

Create `apps/web-react/src/app/App.tsx`:

```tsx
import { useState } from "react";
import { FanIdentity } from "../fan/FanSetupForm";
import { FanSetupPage } from "../pages/fan-setup/FanSetupPage";
import { HomePage } from "../pages/home/HomePage";
import "../styles.css";

const fanIdentityStorageKey = "worldcup.fanIdentity";

function readStoredFanIdentity() {
  const storedValue = window.localStorage.getItem(fanIdentityStorageKey);
  if (!storedValue) {
    return null;
  }

  try {
    // localStorage 只能保存字符串，所以这里把 JSON 字符串还原成对象。
    return JSON.parse(storedValue) as FanIdentity;
  } catch {
    console.warn("读取本地球迷身份失败，将重新展示身份设置页");
    return null;
  }
}

export default function App() {
  const [fanIdentity, setFanIdentity] = useState<FanIdentity | null>(() => readStoredFanIdentity());

  function handleFanSetupSubmit(identity: FanIdentity) {
    console.info("首次进入身份设置完成", identity);
    window.localStorage.setItem(fanIdentityStorageKey, JSON.stringify(identity));
    setFanIdentity(identity);
  }

  return (
    <main className="app-shell">
      {!fanIdentity ? (
        <FanSetupPage onSubmit={handleFanSetupSubmit} />
      ) : (
        <HomePage fanName={fanIdentity.nickname || fanIdentity.uid} />
      )}
    </main>
  );
}
```

Update `apps/web-react/src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 6: Move app tests and update imports**

Move:

```text
apps/web-react/src/App.test.tsx -> apps/web-react/src/app/App.test.tsx
apps/web-react/src/App.identity.test.tsx -> apps/web-react/src/app/App.identity.test.tsx
```

Update both tests to import:

```tsx
import App from "./App";
```

- [ ] **Step 7: Run React tests**

```bash
cd apps/web-react
COREPACK_NPM_REGISTRY=https://registry.npmmirror.com /Users/mao/tools/node/lib/node_modules/corepack/shims/pnpm test
```

Expected: all tests pass.

- [ ] **Step 8: Commit**

```bash
git add apps/web-react/src
git commit -m "refactor: split react app pages"
```

---

### Task 5: React Fan Identity Feature Split

**Files:**

- Move/update: `apps/web-react/src/fan/FanSetupForm.tsx`
- Move/update: `apps/web-react/src/fan/FanSetupForm.test.tsx`
- Create: `apps/web-react/src/features/fan-identity/model/fanIdentityTypes.ts`
- Create: `apps/web-react/src/features/fan-identity/model/fanIdentityStorage.ts`
- Create: `apps/web-react/src/features/fan-identity/model/fanIdentityStorage.test.ts`
- Create: `apps/web-react/src/features/fan-identity/data/avatarOptions.ts`
- Create: `apps/web-react/src/features/fan-identity/ui/AvatarOptionCard.tsx`
- Create: `apps/web-react/src/features/fan-identity/ui/FanSetupForm.tsx`
- Create: `apps/web-react/src/features/fan-identity/index.ts`
- Modify: `apps/web-react/src/app/App.tsx`
- Modify: `apps/web-react/src/pages/fan-setup/FanSetupPage.tsx`

- [ ] **Step 1: Write failing storage tests**

Create `apps/web-react/src/features/fan-identity/model/fanIdentityStorage.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFanIdentity, saveFanIdentity } from "./fanIdentityStorage";

describe("fanIdentityStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("saves and reads fan identity from local storage", () => {
    saveFanIdentity({ uid: "mei-10", nickname: "小梅迷", avatarPlayerId: "messi" });

    expect(readFanIdentity()).toEqual({ uid: "mei-10", nickname: "小梅迷", avatarPlayerId: "messi" });
  });

  it("returns null when stored json is broken", () => {
    window.localStorage.setItem("worldcup.fanIdentity", "{broken");

    expect(readFanIdentity()).toBeNull();
  });
});
```

- [ ] **Step 2: Run storage test to verify it fails**

```bash
cd apps/web-react
COREPACK_NPM_REGISTRY=https://registry.npmmirror.com /Users/mao/tools/node/lib/node_modules/corepack/shims/pnpm test -- src/features/fan-identity/model/fanIdentityStorage.test.ts
```

Expected: fail because storage module does not exist.

- [ ] **Step 3: Create fan identity model and storage**

Create `fanIdentityTypes.ts`:

```ts
export type FanIdentity = {
  uid: string;
  nickname: string;
  avatarPlayerId: string;
};
```

Create `fanIdentityStorage.ts`:

```ts
import { FanIdentity } from "./fanIdentityTypes";

const fanIdentityStorageKey = "worldcup.fanIdentity";

export function readFanIdentity(): FanIdentity | null {
  const storedValue = window.localStorage.getItem(fanIdentityStorageKey);
  if (!storedValue) {
    return null;
  }

  try {
    // localStorage 只能保存字符串，所以这里集中处理 JSON 解析失败的情况。
    return JSON.parse(storedValue) as FanIdentity;
  } catch {
    console.warn("读取本地球迷身份失败，将重新展示身份设置页");
    return null;
  }
}

export function saveFanIdentity(identity: FanIdentity) {
  window.localStorage.setItem(fanIdentityStorageKey, JSON.stringify(identity));
}
```

- [ ] **Step 4: Create avatar data**

Create `avatarOptions.ts`:

```ts
export type AvatarOption = {
  id: string;
  label: string;
  avatarSrc: string;
};

export const avatarOptions: AvatarOption[] = [
  { id: "messi", label: "梅西", avatarSrc: "/assets/world-cup/avatars/messi.png" },
  { id: "ronaldo", label: "C 罗", avatarSrc: "/assets/world-cup/avatars/ronaldo.png" },
  { id: "mbappe", label: "姆巴佩", avatarSrc: "/assets/world-cup/avatars/mbappe.png" },
  { id: "neymar", label: "内马尔", avatarSrc: "/assets/world-cup/avatars/neymar.png" },
  { id: "haaland", label: "哈兰德", avatarSrc: "/assets/world-cup/avatars/haaland.png" },
  { id: "son", label: "孙兴慜", avatarSrc: "/assets/world-cup/avatars/son.png" }
];
```

- [ ] **Step 5: Split AvatarOptionCard**

Create `AvatarOptionCard.tsx`:

```tsx
import { AvatarOption } from "../data/avatarOptions";

type AvatarOptionCardProps = {
  avatar: AvatarOption;
  checked: boolean;
  onChange: () => void;
};

export function AvatarOptionCard({ avatar, checked, onChange }: AvatarOptionCardProps) {
  return (
    <label className="avatar-option">
      <input type="radio" name="avatarPlayerId" checked={checked} onChange={onChange} />
      <span className="avatar-check" aria-hidden="true">✓</span>
      <img className="avatar-image" src={avatar.avatarSrc} alt="" aria-hidden="true" />
      <span className="avatar-player-name">{avatar.label}</span>
    </label>
  );
}
```

- [ ] **Step 6: Move FanSetupForm into feature**

Move the current `FanSetupForm.tsx` content to `apps/web-react/src/features/fan-identity/ui/FanSetupForm.tsx`, then update imports:

```tsx
import { FormEvent, useState } from "react";
import { Lock, ShieldCheck, UserRound } from "lucide-react";
import { avatarOptions } from "../data/avatarOptions";
import { FanIdentity } from "../model/fanIdentityTypes";
import { AvatarOptionCard } from "./AvatarOptionCard";
```

Replace the avatar map body with:

```tsx
{avatarOptions.map((avatar) => (
  <AvatarOptionCard
    avatar={avatar}
    checked={avatarPlayerId === avatar.id}
    key={avatar.id}
    onChange={() => setAvatarPlayerId(avatar.id)}
  />
))}
```

- [ ] **Step 7: Create feature index**

Create `apps/web-react/src/features/fan-identity/index.ts`:

```ts
export type { FanIdentity } from "./model/fanIdentityTypes";
export { readFanIdentity, saveFanIdentity } from "./model/fanIdentityStorage";
export { FanSetupForm } from "./ui/FanSetupForm";
```

- [ ] **Step 8: Update app imports and storage usage**

Update `apps/web-react/src/app/App.tsx`:

```tsx
import { useState } from "react";
import { FanIdentity, readFanIdentity, saveFanIdentity } from "../features/fan-identity";
import { FanSetupPage } from "../pages/fan-setup/FanSetupPage";
import { HomePage } from "../pages/home/HomePage";
import "../styles.css";

export default function App() {
  const [fanIdentity, setFanIdentity] = useState<FanIdentity | null>(() => readFanIdentity());

  function handleFanSetupSubmit(identity: FanIdentity) {
    console.info("首次进入身份设置完成", identity);
    saveFanIdentity(identity);
    setFanIdentity(identity);
  }

  return (
    <main className="app-shell">
      {!fanIdentity ? (
        <FanSetupPage onSubmit={handleFanSetupSubmit} />
      ) : (
        <HomePage fanName={fanIdentity.nickname || fanIdentity.uid} />
      )}
    </main>
  );
}
```

Update `FanSetupPage.tsx` to import from:

```tsx
import { FanIdentity, FanSetupForm } from "../../features/fan-identity";
```

- [ ] **Step 9: Move FanSetupForm test**

Move:

```text
apps/web-react/src/fan/FanSetupForm.test.tsx -> apps/web-react/src/features/fan-identity/ui/FanSetupForm.test.tsx
```

Keep the test import local:

```tsx
import { FanSetupForm } from "./FanSetupForm";
```

- [ ] **Step 10: Delete old fan folder**

Delete:

```text
apps/web-react/src/fan/FanSetupForm.tsx
```

- [ ] **Step 11: Run React tests**

```bash
cd apps/web-react
COREPACK_NPM_REGISTRY=https://registry.npmmirror.com /Users/mao/tools/node/lib/node_modules/corepack/shims/pnpm test
```

Expected: all tests pass.

- [ ] **Step 12: Commit**

```bash
git add apps/web-react/src
git commit -m "refactor: split fan identity feature"
```

---

### Task 6: React Shared UI And Style Split

**Files:**

- Create: `apps/web-react/src/shared/ui/Button.tsx`
- Create: `apps/web-react/src/shared/ui/TextField.tsx`
- Create: `apps/web-react/src/shared/ui/Notice.tsx`
- Create: `apps/web-react/src/shared/assets/worldCupAssets.ts`
- Create: `apps/web-react/src/shared/lib/logger.ts`
- Create: `apps/web-react/src/shared/lib/storage.ts`
- Create: `apps/web-react/src/styles/tokens.css`
- Create: `apps/web-react/src/styles/base.css`
- Create: `apps/web-react/src/styles/layout.css`
- Modify: `apps/web-react/src/app/App.tsx`
- Modify: `apps/web-react/src/features/fan-identity/ui/FanSetupForm.tsx`
- Modify: `apps/web-react/src/styles.css`

- [ ] **Step 1: Create shared Button**

Create `Button.tsx`:

```tsx
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  icon?: ReactNode;
};

export function Button({ children, icon, className = "", ...props }: ButtonProps) {
  return (
    <button className={`primary-action ${className}`.trim()} {...props}>
      {icon}
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Create shared TextField**

Create `TextField.tsx`:

```tsx
import { InputHTMLAttributes, ReactNode } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: ReactNode;
  error?: string;
};

export function TextField({ label, icon, error, ...inputProps }: TextFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <span className="input-shell">
        {icon}
        <input aria-describedby={error ? `${inputProps.name}-error` : undefined} {...inputProps} />
      </span>
      {error ? (
        <span className="field-error" id={`${inputProps.name}-error`}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
```

- [ ] **Step 3: Create shared Notice**

Create `Notice.tsx`:

```tsx
import { ReactNode } from "react";

type NoticeProps = {
  icon: ReactNode;
  children: ReactNode;
};

export function Notice({ icon, children }: NoticeProps) {
  return (
    <p className="privacy-note">
      {icon}
      <span>{children}</span>
    </p>
  );
}
```

- [ ] **Step 4: Use shared components in FanSetupForm**

In `FanSetupForm.tsx`, replace UID and nickname labels with `TextField`, replace privacy paragraph with `Notice`, and replace the submit button with `Button`.

Imports should include:

```tsx
import { Button } from "../../../shared/ui/Button";
import { Notice } from "../../../shared/ui/Notice";
import { TextField } from "../../../shared/ui/TextField";
```

The submit button should render:

```tsx
<Button
  type="submit"
  icon={<img className="button-football-icon" src={worldCupAssets.footballIcon} alt="" aria-hidden="true" />}
>
  进入世界杯问答
</Button>
```

- [ ] **Step 5: Create shared assets and utility helpers**

Create `apps/web-react/src/shared/assets/worldCupAssets.ts`:

```ts
/* 世界杯视觉资产路径集中放这里，后续切 OSS/CDN 时优先改这个文件。 */
export const worldCupAssets = {
  footballIcon: "/assets/world-cup/football-icon.svg",
  buttonFootballPattern: "/assets/world-cup/button-football-pattern.svg",
  avatars: {
    messi: "/assets/world-cup/avatars/messi.png",
    ronaldo: "/assets/world-cup/avatars/ronaldo.png",
    mbappe: "/assets/world-cup/avatars/mbappe.png",
    neymar: "/assets/world-cup/avatars/neymar.png",
    haaland: "/assets/world-cup/avatars/haaland.png",
    son: "/assets/world-cup/avatars/son.png"
  }
} as const;
```

Create `apps/web-react/src/shared/lib/logger.ts`:

```ts
/* 前端日志出口：先保留 console，后续接埋点或可观测平台时只改这里。 */
export const logger = {
  info(message: string, data?: unknown) {
    console.info(message, data);
  },
  warn(message: string, data?: unknown) {
    console.warn(message, data);
  }
};
```

Create `apps/web-react/src/shared/lib/storage.ts`:

```ts
/* 安全读取 JSON：localStorage 中的脏数据不能拖垮页面首屏。 */
export function readJsonFromStorage<T>(key: string): T | null {
  const storedValue = window.localStorage.getItem(key);
  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as T;
  } catch {
    return null;
  }
}

export function writeJsonToStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
```

Update `apps/web-react/src/features/fan-identity/data/avatarOptions.ts`:

```ts
import { worldCupAssets } from "../../../shared/assets/worldCupAssets";

export type AvatarOption = {
  id: string;
  label: string;
  avatarSrc: string;
};

export const avatarOptions: AvatarOption[] = [
  { id: "messi", label: "梅西", avatarSrc: worldCupAssets.avatars.messi },
  { id: "ronaldo", label: "C 罗", avatarSrc: worldCupAssets.avatars.ronaldo },
  { id: "mbappe", label: "姆巴佩", avatarSrc: worldCupAssets.avatars.mbappe },
  { id: "neymar", label: "内马尔", avatarSrc: worldCupAssets.avatars.neymar },
  { id: "haaland", label: "哈兰德", avatarSrc: worldCupAssets.avatars.haaland },
  { id: "son", label: "孙兴慜", avatarSrc: worldCupAssets.avatars.son }
];
```

Update `apps/web-react/src/features/fan-identity/model/fanIdentityStorage.ts`:

```ts
import { logger } from "../../../shared/lib/logger";
import { readJsonFromStorage, writeJsonToStorage } from "../../../shared/lib/storage";
import { FanIdentity } from "./fanIdentityTypes";

const fanIdentityStorageKey = "worldcup.fanIdentity";

export function readFanIdentity(): FanIdentity | null {
  const identity = readJsonFromStorage<FanIdentity>(fanIdentityStorageKey);
  if (!identity && window.localStorage.getItem(fanIdentityStorageKey)) {
    logger.warn("读取本地球迷身份失败，将重新展示身份设置页");
  }
  return identity;
}

export function saveFanIdentity(identity: FanIdentity) {
  writeJsonToStorage(fanIdentityStorageKey, identity);
}
```

- [ ] **Step 6: Split global CSS imports**

Create `apps/web-react/src/styles/tokens.css`:

```css
/* 设计 token：集中管理颜色、阴影和常用尺寸，后续改主题先看这里。 */
:root {
  color: #10231d;
  background: #ffffff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

Create `apps/web-react/src/styles/base.css`:

```css
/* 浏览器默认 body 会带 8px 外边距，这里清掉，页面才能贴齐视口。 */
body {
  margin: 0;
}

/* 表单控件继承页面字体，避免按钮/输入框出现系统默认字体割裂。 */
button,
input {
  font: inherit;
}
```

Create `apps/web-react/src/styles/layout.css`:

```css
/* 应用最外层容器：负责撑满视口高度，后续所有页面都挂在这里。 */
.app-shell {
  min-height: 100dvh;
  padding: 0;
}

/* 已完成身份设置后的首页内容区：限制普通首页的最大宽度和页面内边距。 */
.home-panel {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}
```

Update `apps/web-react/src/app/App.tsx` style imports:

```tsx
import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/layout.css";
import "../styles.css";
```

- [ ] **Step 7: Run React tests and build**

```bash
cd apps/web-react
COREPACK_NPM_REGISTRY=https://registry.npmmirror.com /Users/mao/tools/node/lib/node_modules/corepack/shims/pnpm test
COREPACK_NPM_REGISTRY=https://registry.npmmirror.com /Users/mao/tools/node/lib/node_modules/corepack/shims/pnpm build
```

Expected: tests and build pass.

- [ ] **Step 8: Run ui-ux-pro-max review checklist**

Review the fan setup page against:

- Visible labels exist for UID and nickname.
- Primary CTA remains a single green button.
- Focus outlines remain visible.
- Avatar cards keep stable dimensions.
- No text turns vertical.
- Page still reads as desktop web, not phone mockup.

Record the review result in the final task summary.

- [ ] **Step 9: Commit**

```bash
git add apps/web-react/src
git commit -m "refactor: add react shared ui layer"
```

---

### Task 7: Final Verification And Docs Sync

**Files:**

- Modify: `README.md`
- Modify: `docs/superpowers/plans/2026-06-10-world-cup-rag-mvp.md`

- [ ] **Step 1: Update README structure**

Add a section to `README.md`:

```markdown
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
```

- [ ] **Step 2: Update old MVP plan with refactor note**

In `docs/superpowers/plans/2026-06-10-world-cup-rag-mvp.md`, add near the top:

```markdown
> 分层更新：2026-06-12 起，Java 后端按 `worldcup-api / worldcup-dal / worldcup-service / worldcup-start` 多模块实施；React 前端按 `app / pages / features / shared / styles` 实施。新增任务应遵守 `docs/superpowers/specs/2026-06-12-world-cup-layered-architecture-refactor.md`。
```

- [ ] **Step 3: Run Java verification**

```bash
cd apps/backend-java
./gradlew test
./gradlew :worldcup-start:bootJar
```

Expected: tests and boot jar pass.

- [ ] **Step 4: Run React verification**

```bash
cd apps/web-react
COREPACK_NPM_REGISTRY=https://registry.npmmirror.com /Users/mao/tools/node/lib/node_modules/corepack/shims/pnpm test
COREPACK_NPM_REGISTRY=https://registry.npmmirror.com /Users/mao/tools/node/lib/node_modules/corepack/shims/pnpm build
COREPACK_NPM_REGISTRY=https://registry.npmmirror.com /Users/mao/tools/node/lib/node_modules/corepack/shims/pnpm test:e2e
```

Expected: Vitest, build, and Playwright pass.

- [ ] **Step 5: Commit**

```bash
git add README.md docs/superpowers/plans/2026-06-10-world-cup-rag-mvp.md
git commit -m "docs: document layered project structure"
```

---

## Execution Notes

- If Java Gradle commands fail because wrapper files are already locally modified, inspect `git status --short` before staging. Do not revert user-owned wrapper changes without approval.
- If pnpm needs to download anything, keep `COREPACK_NPM_REGISTRY=https://registry.npmmirror.com`.
- If Docker image pulls are required, first check whether the user has Docker mirror acceleration configured.
- For each task, run only the focused tests first, then broader tests after implementation.
- Keep commits small and readable. Do not combine Java module movement with React movement in one commit.

## Self-Review

- Spec coverage: Java `api/dal/service/start` is covered by Tasks 1-3; React `app/pages/features/shared/styles` is covered by Tasks 4-6; final docs and verification are covered by Task 7.
- Scope guard: The plan does not introduce Dubbo, HSF, Nacos, Milvus, Elasticsearch, Kubernetes, login, live scores, or news.
- TDD guard: Each implementation task starts with a failing test or explicit packaging expectation before implementation.
- Type consistency: React uses `FanIdentity` with `uid`, `nickname`, `avatarPlayerId`; Java uses `CreateFanUserRequest`, `FanUserResponse`, and `FanUserFacade` consistently.
