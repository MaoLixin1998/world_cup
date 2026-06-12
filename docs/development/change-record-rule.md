# 项目内变更沉淀规则

## 规则

以后每一次代码、配置、架构、UI 或文档改动，都必须在对应项目中沉淀一份变更记录文件。

这份文件不是替代 git commit，而是给学习和复盘用：不用翻聊天记录，也能知道当时为什么改、改了哪里、怎么验证。

## 放在哪里

按改动所属项目放置：

```text
apps/backend-java/docs/changes/
apps/rag-python/docs/changes/
apps/web-react/docs/changes/
apps/web-vue/docs/changes/
packages/api-contracts/docs/changes/
infra/docs/changes/
docs/changes/
```

如果一次改动跨多个项目：

- 主要改动项目必须有记录。
- 其他被明显影响的项目也要有记录。
- 纯仓库流程、规范、计划类改动放到 `docs/changes/`。

## 文件命名

使用日期 + 简短主题：

```text
YYYY-MM-DD-short-topic.md
```

示例：

```text
apps/backend-java/docs/changes/2026-06-12-service-layer-responsibility.md
apps/web-react/docs/changes/2026-06-12-beginner-comments.md
docs/changes/2026-06-12-change-record-rule.md
```

## 文件内容模板

```markdown
# 变更标题

## 背景

为什么要改。

## 改了什么

- 改动点 1
- 改动点 2

## 学习笔记

这次改动里值得记住的概念、分层规则或工程经验。

## 验证

- 执行过的命令
- 测试结果

## 后续

还需要继续处理的事项；没有就写“暂无”。
```

## 执行要求

- 变更记录必须和对应代码改动同一次提交或紧邻提交。
- 记录要用中文。
- 记录要写给“没学过该技术的人”也能看懂。
- 不记录密钥、token、个人敏感信息。
- 不把大段日志或无关终端输出粘进去，只写关键结果。
