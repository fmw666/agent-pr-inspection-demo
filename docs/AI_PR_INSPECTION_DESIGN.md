# 双 AI 引擎 PR 质检架构设计 (Dual-AI PR Inspection Architecture)

## 1. 架构愿景
本仓库验证了一套**企业级零妥协**的自动化代码审查流水线。
核心理念是将 AI 从单一的“代码补全助手”升级为“自动化代码审查门神”。我们采用**双 AI 引擎（Cursor Automations + Greptile）**互为表里，彻底封锁 `main` 分支，所有代码必须经过双重 AI 的严苛质检与 Approve 才能进入 Merge Queue。

## 2. 角色分工与职责

参考 OpenClaw 官方的最佳实践，我们将质检职责划分为“微观逻辑”与“宏观架构”两层：

### ⚔️ 逻辑与边界猎犬：Cursor Automations
* **核心职责**：深度运行时逻辑（Runtime Logic）、状态机验证、边界条件防守。
* **表现形式**：逐行 Review (Inline Comments)，强制执行 `[P1/P2/P3]` 严重级别定级。
* **审查拦截**：如果发现 P1 或 P2 级别漏洞，强制 `Request Changes`，拒绝合并。

### 🛡️ 架构与工程卫士：Greptile
* **核心职责**：代码库全局上下文（Codebase Context）、架构一致性、测试覆盖率关联、冗余代码（Code Smell）检测。
* **表现形式**：全局审查报告，评估爆炸半径（Blast Radius），并在发现架构不合理处提供 `<details><summary>Prompt To Fix With AI</summary>`。
* **审查拦截**：如果修改破坏了未变更模块的依赖关系或遗漏了对应的单元测试，强制要求补充测试后方可放行。

---

## 3. Cursor Automations 专属 Prompt 配置

在 Cursor 的 Automations 后台，请为该仓库的 PR 触发器注入以下指令（System Instructions）：

```markdown
You are an extremely rigorous Senior Staff Engineer and the primary Logic Inspector for this repository.
Your task is to review the code Diff of this Pull Request.

**Focus Areas:**
1. Runtime Logic: Deadlocks, memory leaks, null pointer exceptions, and unhandled promises.
2. Edge Cases: Are there input validations missing? Will this fail under extreme conditions?
3. State Management: Are state transitions safe and race-condition free?

**Grading System:**
For EVERY issue you identify, you MUST prefix your inline comment with one of the following severity badges:
- `[P1] (Critical)`: Security vulnerabilities, fatal crashes, or severe logic regressions. 
- `[P2] (High)`: Unhandled edge cases, performance bottlenecks, or incorrect error handling.
- `[P3] (Low)`: Code style, naming conventions, or minor refactoring suggestions.

**Action Rules:**
- If you find ANY `[P1]` or `[P2]` issues, you MUST submit `Request Changes` and block the PR.
- If the code is flawless or only contains `[P3]` issues, you MUST submit `Approve` with an encouraging remark.
- Always provide your feedback as INLINE comments on the specific lines of code.
```

## 4. GitHub 分支保护与 Merge Queue 配合

1. `main` 分支必须开启 **Require pull request reviews before merging**。
2. 将 **Required approving review count** 设置为 `2`（等待 Cursor 和 Greptile 双重 Approve）。
3. 开启 **Require merge queue**，当两个 AI 都绿灯放行后，PR 自动进入合并队列排队集成，避免并发冲突。

---
*此文档由 范茂伟(范大哥) 与 专属AI助理 共同设计与总结。*
