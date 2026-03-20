# 串行双 AI 质检系统配置指南

本指南将帮助您配置一套严谨的**串行调度** AI 审查流。

## 🛡️ 第一步：配置 Cursor Automations (Phase 1)
这是第一道门神，拦截所有的低级 Bug 和逻辑漏洞。

1. 在 Cursor 控制台创建 Automation。
2. 触发器选 `Pull Request Opened` 和 `Pull Request Synchronized`。
3. 注入 P1/P2/P3 严苛定级 Prompt（详见前文）。
4. **关键点**：Cursor 只要发现错误，必须提交 `Request Changes`；完全通过则提交 `Approve`。

## ⚔️ 第二步：配置 Greptile 纯被动模式 (Phase 2)
为了避免 Greptile 抢跑，我们需要让它变为“指令触发”模式。

1. 在仓库根目录创建 `greptile.yml`（如果有），或者在 Greptile 后台设置中，将其配置为**不要**在 PR 创建时自动运行。
2. 确保 Greptile 只在代码中被 **@提及** 时（`@greptile-apps[bot]`）才执行 Review。

## 🤖 第三步：部署中枢调度器 (Orchestrator)
我们通过一个 GitHub Action 脚本来监听 Cursor 的结果，如果 Cursor 放行了，Action 会自动唤醒 Greptile。

1. 将本仓库提供的 `.github/workflows/ai-serial-orchestrator.yml` 文件提交到您的 `main` 分支。
2. 这个脚本会自动监听 `pull_request_review` 事件。一旦识别到 Cursor 的 `Approve` 状态，它会自动以官方机器人的身份留言唤醒 Greptile。

## ✅ 第四步：分支保护
将 `main` 的分支保护规则 `Require approvals` 设置为 **2**。
只有连闯两关，拿到两张通行证的 PR 才能被合并！
