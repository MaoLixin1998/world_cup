# 世界杯 RAG 前后端分层重构设计文档

## 状态

本设计用于修正当前 MVP 骨架分层过薄的问题。设计确认前不改业务代码；确认后按 TDD 分阶段重构。

## 背景

当前项目已经具备 Java 后端、Python RAG 服务、React 前端和 Docker Compose 骨架，但 Java 与 React 都偏“能跑的 MVP 单体结构”。这对早期验证可以接受，但继续开发问答、浏览、管理、导入、评测和未来 Vue 前端时，会出现职责混杂、测试难迁移、代码难学习的问题。

重构目标不是扩大产品范围，也不是引入重型中间件，而是把现有功能放进更接近真实业务项目的工程边界中。

## 总目标

- Java 后端改为 Gradle 多模块，按 `api / dal / service / start` 分层。
- React 前端改为 `app / pages / features / shared / styles` 分层。
- 保持现有功能不变：健康检查、匿名球迷身份设置、React 首次进入页面仍可用。
- 保持单机 Docker Compose 部署，不因重构加入 Kubernetes、Kafka、Milvus、Elasticsearch。
- 保持中文注释与关键节点中文日志，方便学习和 review。
- 所有改动按 TDD 做：先迁移或新增测试，再做最小实现。

## Java 后端目标结构

```text
apps/backend-java/
  settings.gradle.kts
  build.gradle.kts

  worldcup-api/
    build.gradle.kts
    src/main/java/com/worldcup/api/

  worldcup-dal/
    build.gradle.kts
    src/main/java/com/worldcup/dal/
    src/test/java/com/worldcup/dal/

  worldcup-service/
    build.gradle.kts
    src/main/java/com/worldcup/service/
    src/test/java/com/worldcup/service/

  worldcup-start/
    build.gradle.kts
    Dockerfile
    src/main/java/com/worldcup/start/
    src/main/resources/application.yml
    src/test/java/com/worldcup/start/
```

### `worldcup-api`

职责：定义对外服务契约。

包含内容：

- 请求 DTO，例如 `CreateFanUserRequest`。
- 响应 DTO，例如 `FanUserResponse`。
- Facade 接口，例如 `FanUserFacade`。
- 通用错误码或结果对象，如果后续需要统一错误结构。

边界：

- 不连接数据库。
- 不依赖 Spring Web。
- 不放 Controller。
- 不放 Repository。
- 未来如果接 HSF 或 Dubbo，服务接口优先放在这里。

### `worldcup-dal`

职责：负责数据库访问和持久化模型。

包含内容：

- 数据库 DO，例如 `FanUserDO`。
- Repository 或 Mapper，例如 `FanUserRepository`。
- 数据库字段与 Java 对象的转换。
- 后续 Flyway/Liquibase 迁移脚本可以放在 `start` 或 `dal`，第一阶段先不引入迁移工具。

边界：

- 不写业务流程。
- 不调用 Controller。
- 不拼装对外响应 DTO。
- 日志只记录数据库访问关键失败点，不记录敏感信息。

### `worldcup-service`

职责：业务规则与用例编排。

包含内容：

- Facade 实现，例如 `FanUserFacadeImpl`。
- 业务校验，例如 UID 是否为空、UID 是否重复。
- 事务边界。
- 调用 DAL。
- 关键中文日志。

边界：

- 不直接处理 HTTP 请求和响应。
- 不保存 Web 层对象，例如 `HttpServletRequest`。
- 不把数据库 DO 直接暴露给 API 调用方。

### `worldcup-start`

职责：应用启动和入口适配。

包含内容：

- `WorldCupApplication`。
- REST Controller。
- Spring 配置。
- `application.yml`。
- Dockerfile 打包入口。
- 未来如果接 Dubbo Provider 或 HSF Provider，启动配置放这里。

边界：

- Controller 只做参数接收、基础校验触发、调用 service/facade、返回响应。
- 不写复杂业务规则。
- 不直接拼数据库 SQL。

## Java 依赖方向

```text
worldcup-start
  -> worldcup-service
  -> worldcup-dal
  -> worldcup-api

worldcup-service
  -> worldcup-api
  -> worldcup-dal

worldcup-dal
  -> worldcup-api

worldcup-api
  -> no internal module dependency
```

第一阶段允许 `dal` 依赖 `api` 中的通用类型，但不允许 `api` 反向依赖任何实现模块。后续如果发现 `api` 与 `dal` 类型耦合过高，再拆 `worldcup-common`，本次不提前增加模块。

## Java 测试策略

- `worldcup-api`：主要做 DTO 序列化或契约测试，初期可不强求大量测试。
- `worldcup-dal`：Repository 测试。第一阶段可以保留内存实现测试；接 PostgreSQL 后再加入 Testcontainers 或集成测试。
- `worldcup-service`：核心业务单元测试，例如创建球迷身份、UID 重复、非法参数。
- `worldcup-start`：Controller 测试和 Spring Boot 启动测试，例如 `/api/health` 和 `/api/fans`。

测试迁移原则：

- 先复制或移动现有测试到目标模块。
- 确认测试失败点来自缺失实现，而不是测试写错。
- 再迁移实现。
- 每一步只做一个可解释的小提交。

## React 前端目标结构

```text
apps/web-react/src/
  app/
    App.tsx
    providers/
    routes/

  pages/
    fan-setup/
      FanSetupPage.tsx
      FanSetupPage.test.tsx
    home/
      HomePage.tsx
      HomePage.test.tsx

  features/
    fan-identity/
      data/
        avatarOptions.ts
      model/
        fanIdentityTypes.ts
        fanIdentityStorage.ts
        fanIdentityStorage.test.ts
      ui/
        FanSetupForm.tsx
        FanSetupForm.test.tsx
        AvatarOptionCard.tsx
      index.ts

  shared/
    api/
      httpClient.ts
    assets/
      worldCupAssets.ts
    lib/
      logger.ts
      storage.ts
    ui/
      Button.tsx
      TextField.tsx
      Notice.tsx

  styles/
    tokens.css
    base.css
    layout.css
```

### `app`

职责：应用装配。

包含内容：

- 根组件。
- 全局 Provider。
- 路由配置。
- 全局样式引入。

边界：

- 不写具体业务表单。
- 不直接读写 localStorage。
- 不直接写复杂页面布局。

### `pages`

职责：页面级编排。

包含内容：

- `FanSetupPage`：首次进入身份设置页。
- `HomePage`：进入后的世界杯问答首页壳。
- 后续 `ChatPage`、`BrowsePage`、`AdminPage` 也放这里。

边界：

- 页面负责组合 feature 与 shared 组件。
- 页面不直接实现复杂业务规则。
- 页面可以处理“当前显示哪个业务模块”的轻量状态。

### `features/fan-identity`

职责：球迷身份业务能力。

包含内容：

- 类型定义。
- localStorage 读写封装。
- 头像候选数据。
- 身份设置表单。
- 头像卡片。

边界：

- 只关心球迷身份，不关心聊天、浏览、管理。
- 不把本 feature 的内部组件泄漏到全局，统一通过 `index.ts` 暴露。

### `shared`

职责：可复用基础能力。

包含内容：

- `shared/ui`：按钮、输入框、提示条等通用组件。
- `shared/api`：统一 HTTP 客户端，后续接 Java API。
- `shared/lib`：日志、storage、安全 JSON 解析等工具。
- `shared/assets`：资产路径集中声明，后续切 OSS/CDN 时少改散落代码。

边界：

- 不依赖具体业务 feature。
- 不出现世界杯某个具体页面的业务逻辑。

### `styles`

职责：样式基础设施。

包含内容：

- `tokens.css`：颜色、字号、间距、圆角、阴影 token。
- `base.css`：浏览器默认样式、body、按钮、输入框基础继承。
- `layout.css`：通用布局壳。

页面或 feature 的专属样式可以先继续使用 CSS 文件，但必须靠近对应模块，并加中文注释。后续如果样式继续变多，再考虑 CSS Modules。

## React 测试策略

- `fanIdentityStorage.test.ts`：测试 localStorage 正常读取、损坏 JSON fallback、写入身份。
- `FanSetupForm.test.tsx`：测试表单校验、头像选择、提交事件。
- `FanSetupPage.test.tsx`：测试首次进入的页面组合。
- `HomePage.test.tsx`：测试进入后的欢迎信息。
- E2E 保持用户视角：首次进入、填写 UID/昵称、选择头像、进入问答首页。

测试迁移原则：

- 迁移目录后先让测试能找到新路径。
- 再拆 storage、logger、assets。
- 最后拆 shared UI，避免一上来同时重构视觉和逻辑。

## UI/UX 审查要求

每个页面完成后都要经过 ui-ux-pro-max 体育内容产品体验审查，重点检查：

- 页面是否像真实体育内容产品，而不是营销落地页。
- 主操作是否明确，每页只有一个主要 CTA。
- 中文标题、说明和错误提示是否自然。
- 键盘焦点、表单 label、错误提示是否可访问。
- 头像卡片、按钮、输入框是否有稳定尺寸，避免布局跳动。
- 视觉资产是否声明尺寸，避免 CLS。

## 分阶段实施

### 阶段 1：Java 多模块骨架

- 修改 `settings.gradle.kts` 注册四个模块。
- 拆 root Gradle 配置到子模块。
- 创建 `worldcup-api / worldcup-dal / worldcup-service / worldcup-start`。
- 保持 `/api/health` 测试通过。

### 阶段 2：迁移 Java fan 业务

- 将 `FanUser` 对外响应迁入 `worldcup-api`。
- 将 Repository 和持久化模型迁入 `worldcup-dal`。
- 将创建球迷身份业务迁入 `worldcup-service`。
- 将 Controller 和启动类迁入 `worldcup-start`。
- 保持 fan service 和 controller 测试通过。

### 阶段 3：React 目录分层

- 创建 `app / pages / features / shared / styles`。
- 迁移 `App.tsx` 到 `app`。
- 拆出 `FanSetupPage` 与 `HomePage`。
- 保持现有 Vitest 和 Playwright 通过。

### 阶段 4：React fan identity feature

- 拆 `fanIdentityTypes`、`fanIdentityStorage`、`avatarOptions`。
- 拆 `AvatarOptionCard`。
- 保持 UI 不变，只改变代码边界。
- 给 CSS 分块补中文注释并靠近模块。

### 阶段 5：文档与部署同步

- 更新 README 的工程结构说明。
- 更新 Dockerfile 和 Docker Compose 的 Java build context，如果 start 模块打包路径发生变化。
- 更新后续 MVP 计划，明确以后新增功能按分层落位。

## 不做范围

- 不引入 Dubbo、HSF、Nacos 或注册中心。
- 不引入 Kubernetes。
- 不引入 Milvus 或 Elasticsearch。
- 不重做视觉设计。
- 不新增登录系统。
- 不新增实时比分或新闻能力。

这些能力可以在后续独立设计文档中讨论，不能混进本次分层重构。

## 验收标准

- Java 后端为四模块结构，依赖方向清晰。
- React 前端为 app/pages/features/shared/styles 结构。
- 现有用户行为不变。
- `pnpm test`、`pnpm build`、`pnpm test:e2e` 通过。
- Java 测试通过。
- Docker Compose 仍能构建并启动相关服务，或文档明确当前待补的启动限制。
- 新增或迁移的复杂代码包含中文注释，关键业务节点包含中文日志。

## 风险与应对

- 风险：一次性移动太多文件导致测试路径和导入路径混乱。
  应对：按阶段提交，每阶段只移动一个边界。

- 风险：Java 多模块后 Dockerfile 打包路径变化。
  应对：Java 重构阶段同步更新 Dockerfile，并用 Compose 验证。

- 风险：React 样式拆分后页面视觉回退。
  应对：每次页面迁移后用 Playwright 截图检查，并做 ui-ux-pro-max 审查。

- 风险：过早抽象 shared 组件导致学习成本变高。
  应对：只抽已经重复或马上会复用的 Button、TextField、Notice，暂不建立复杂设计系统。
