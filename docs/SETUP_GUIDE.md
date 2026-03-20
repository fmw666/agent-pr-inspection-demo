# 双 AI 引擎 PR 质检系统完整配置指南 (Setup Guide)

本文档详细记录了如何从零开始，为您自己的 GitHub 仓库配置这套基于 **Cursor Automations** 和 **Greptile** 的双重 AI 质检流水线。

---

## 🚀 步骤一：配置 GitHub 分支保护与 Merge Queue
为了强制所有代码必须经过 AI 审查，我们需要锁死 `main` 分支。

1. 进入 GitHub 仓库 -> `Settings` -> 左侧菜单栏选择 `Branches`。
2. 在 **Branch protection rules** 中点击 `Add branch protection rule`。
3. **Branch name pattern** 填写：`main`。
4. **Protect matching branches** 勾选以下项：
   - [x] **Require a pull request before merging**
     - [x] **Require approvals** -> 选择 **2** (等待两个 AI 机器人都点 Approve)。
     - [x] **Dismiss stale pull request approvals when new commits are pushed** (有新提交时重置之前的点赞，强迫 AI 重新检查)。
   - [x] **Do not allow bypassing the above settings** (强制即使是管理员 Admin 也要遵守规则)。
5. 点击 `Create/Save changes` 保存。
6. (可选) 进入 `Settings` -> `General` -> 勾选 `Allow auto-merge` 和 `Require merge queue`，实现全自动排队合并。

---

## 🛡️ 步骤二：安装 Greptile (宏观架构卫士)
Greptile 负责检查全局代码架构、测试覆盖率以及潜在的代码库连锁反应。

1. 访问 [GitHub Marketplace: Greptile](https://github.com/marketplace/greptile)。
2. 点击页面右上角的绿底按钮 `Install it for free`（或者 Set up a plan）。
3. 选择安装的组织/账号（如 `fmw666`）。
4. **Repository access** 选择 `Only select repositories`，然后选择你的目标仓库（如 `agent-pr-inspection-demo`）。
5. 点击 `Install` 并进行账号授权。
6. 安装完成后，只要有新的 PR 提交，Greptile 就会自动被唤醒并发表 Review 评论。

---

## ⚔️ 步骤三：配置 Cursor Automations (微观逻辑猎犬)
Cursor Automations 负责审查具体的代码逻辑、语法漏洞、并执行严格的 `[P1/P2/P3]` 分级。

1. 登录 [Cursor 网页端控制台](https://cursor.com/)。
2. 导航至 `Automations` 面板。
3. 点击 **Connect to GitHub**（按照页面提示安装 Cursor 的 GitHub App 授权目标仓库）。
4. 点击 **Create Automation**。
5. **设置 Trigger (触发器)**:
   - 平台选择 `GitHub`。
   - 事件勾选 `Pull Request Opened` (新建 PR 时触发) 和 `Pull Request Synchronized` (PR 有新 commit 时触发)。
6. **设置 Action / Agent Instructions (审查规则 Prompt)**:
   复制并粘贴以下指令内容：

   ```text
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
7. 保存并启用该 Automation。

---

## ✅ 步骤四：测试工作流
所有配置完成后，测试这套流水线的最佳方式：

1. `git checkout -b test/bad-code` 创建一个新分支。
2. 故意写一段有明显 Bug 或未处理异常的代码（比如强行使用未定义的变量）。
3. `git commit` 并 `git push` 上去。
4. 去 GitHub 创建一个 PR 到 `main`。
5. 去泡杯咖啡 ☕，看看 Cursor 和 Greptile 是如何无情地把你的 PR “打回重做”的！
