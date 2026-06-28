# 总体进度

根据 `doc/proposal.md` 和 `doc/detailed-design.md` 拆分。勾选某个模块前，应先完成对应模块文件中的全部最小任务和验收标准。

## 模块完成清单

- [x] [01-data-models.md](./01-data-models.md) - 数据模型与静态食谱模块
- [x] [02-local-storage-stores.md](./02-local-storage-stores.md) - 本地存储与 Zustand 状态模块
- [ ] [03-shared-ui.md](./03-shared-ui.md) - 公共 UI 组件模块
- [ ] [04-home.md](./04-home.md) - 首页打卡模块
- [ ] [05-recipe-plan.md](./05-recipe-plan.md) - 食谱计划模块
- [ ] [06-dashboard.md](./06-dashboard.md) - 数据看板模块
- [ ] [07-exercise.md](./07-exercise.md) - 运动记录模块
- [ ] [08-profile.md](./08-profile.md) - 个人中心与本地数据管理模块
- [ ] [09-navigation-integration.md](./09-navigation-integration.md) - 导航与页面联调模块
- [ ] [10-qa-acceptance.md](./10-qa-acceptance.md) - 质量验证与验收模块

## 推荐执行顺序

- [x] 第1阶段：完成数据模型与静态食谱。
- [x] 第2阶段：完成本地存储与状态模块。
- [ ] 第3阶段：完成公共 UI 组件。
- [ ] 第4阶段：并行或顺序完成五大页面模块。
- [ ] 第5阶段：完成导航联调。
- [ ] 第6阶段：完成质量验证与验收。

## 当前状态

- [x] 已完成核心数据模型、静态食谱、状态模块、五大页面首版和底部导航接入。
- [x] 已完成 Web 冒烟启动验证，Expo Web 可 bundle 并运行在 `http://localhost:8081`。
- [ ] 公共 UI、五大页面和导航联调仍需逐条对照各模块最小任务补齐高级交互与空状态细节。
- [ ] 尚未完成 iOS 验证。
- [ ] 尚未完成 Android 验证。
