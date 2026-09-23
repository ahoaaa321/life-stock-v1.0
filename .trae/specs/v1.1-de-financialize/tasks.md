# v1.1 实现任务队列

> 优先级定义：**P0** = 必须在 v1.1 上线前完成；**P1** = v1.1 核心增强；**P2** = 后续迭代。

---

## P0 任务（术语统一 + 公式修正 + 免责声明）

### Task 1: 全局术语替换
- **AC**: R1, Rub1
- **范围**: `website/index.html` 全部文案与 JS 字符串
- **操作**:
  - 股价 → 人生指数
  - 股东注资 → 家庭支持资本
  - K线 → 人生走势图
  - BV 账面价值 → 累计成长资本（万元）
  - EPS 每股收益 → 年度成长力
  - ROE 收益率 → 成长效率
  - PE 市盈率 → 估值倍数（参考）
  - IPO上市 → 人生起步
  - 财报 → 成长报告
  - 下跌文案：亏损 → 调整、暴跌 → 回调
- **TR (rule)**: 全文件 grep 无 v1.0 金融术语残留。
- **Status**: pending

### Task 2: 公式修正
- **AC**: R2, R3, R4, R5, R6, Rub2
- **范围**: `Constants`、`calculateStock`、`getStageCoef`、`decay`
- **操作**:
  - 删除 `NORMALIZATION_K: 13000`，BV 计算改为 `invest / 10000`
  - `TYPE_WEIGHTS.entertainment`: 0.3 → 0.5
  - `decay()`: education 类型直接返回原值（不折旧）
  - `getStageCoef()`: 改为节点间线性插值
  - ROE 计算: `eps / (bv + 1)`
- **TR (rule)**: 单测覆盖 BV 万元换算、education 不折旧、阶段系数插值、ROE 边界。
- **Status**: pending

### Task 3: 免责声明
- **AC**: R8
- **操作**:
  - 首页底部加免责声明文案
  - 首次进入弹窗确认（localStorage 标记）
  - 分享卡片底部加免责声明
- **TR (rule)**: 首页与分享卡片 DOM 中存在免责声明文本。
- **Status**: pending

### Task 4: 计算明细页
- **AC**: R10
- **操作**: 新增"计算明细"按钮 + 弹窗，展示指数拆解步骤。
- **TR (rule)**: 明细页含 BV 构成、阶段系数、里程碑、成长/质量/风险系数。
- **Status**: pending

### Task 5: JSON 导入/导出
- **AC**: R9
- **操作**: 工具栏加"导出""导入"按钮，Blob 下载/FileReader 读取。
- **TR (rule)**: 导出后导入，数据完全一致（deepEqual）。
- **Status**: pending

### Task 6: 分享卡片隐藏金额
- **AC**: R7
- **操作**: 分享卡片移除 BV/EPS/累计投入金额，仅保留指数、趋势、里程碑数、成长效率等级。
- **TR (rule)**: 分享卡片 DOM 中无金额数字（¥ 符号）。
- **Status**: pending

---

## P1 任务（工程化 + 匿名对比）

### Task 7: TypeScript + Vite 迁移
- **AC**: NF1, Rub3
- **操作**: 新建 `life_stock_java/website-vite/`，将 index.html 逻辑拆分为 TS 模块。
- **TR (rule)**: `tsc --noEmit` 通过，`vite build` 成功。
- **Status**: ✅ completed
- **Completion Evidence**: tsc 零错误，vite build 生成 dist（26.89KB JS），页面加载验证通过，问卷→仪表盘→K线全流程正常

### Task 8: 单元测试
- **AC**: NF2
- **操作**: Vitest 覆盖 engine 层所有纯函数。
- **TR (rule)**: 核心公式测试覆盖率 ≥ 80%。
- **Status**: ✅ completed
- **Completion Evidence**: 16/16 测试通过，覆盖 Constants/decay/getStageCoef/calculateStock/generateHistory

### Task 9: 多用户匿名结构对比
- **AC**: F6
- **操作**: 生成匿名结构画像，同龄结构分布对比。
- **TR (rule)**: 对比页无任何金额数字。
- **Status**: pending

---

## P2 任务（增强）

### Task 10: IndexedDB 存储
- **AC**: NF3
- **Status**: pending

### Task 11: 问卷参考区间可视化
- **AC**: F1
- **操作**: 历史投入展示区间（低-高）而非单点。
- **Status**: pending

---

## 依赖关系
- Task 1-6 互相独立，可并行（均修改 index.html，需串行避免冲突）。
- Task 7 依赖 Task 1-6 完成（迁移时基于修正后的逻辑）。
- Task 8 依赖 Task 7。
- Task 9 依赖 Task 7。
