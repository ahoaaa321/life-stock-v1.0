# 「今日宜长进」功能增强实施方案（记账 × 股票 × Todo 精华融合）

## 一、现状盘点（Repository Research）

- 架构：`packages/core`（纯 TS 引擎，vitest 37 个测试）+ `website-vite`（单页，逻辑集中在 `src/main.ts` 约 1560 行，样式全在 `index.html` 内联）。数据仅存浏览器 localStorage，无后端、无外部 AI（合规底线不变）。
- 已有功能：问卷建档、成长曲线、投入流水（**只能新增，不能改/删/补记**）、一句话感悟+心情、固定 15 个里程碑、6 个写死的挑战、目标反推、雷达、回落复盘、折旧/情景、家庭账本、周报/年报/同路人/成长伙伴/微课/感恩卡、分享卡、导入导出、隐私双授权。
- 关键约束：
  - 引擎按 `InvestType` 固定六类（education/skill/health/network/entertainment/other）计算权重与折旧；
  - `Investment.date` 参与折旧（越早金额衰减越多）与"近两年投入"停滞判定——补记日期是真实语义；
  - `user.totalInvest` 是流水金额的冗余汇总，改/删时必须重算防漂移；
  - 未同意敏感信息时金额相关能力须降级（预算改按"笔数"）。

## 二、本次功能清单（12 项，全部本地、可编辑、个性化）

### A. 个性化基础
1. **我的名片**：昵称、emoji 头像（预设选）、给自己的成长指数命名（如"阿长进指数"）、一句话签名。显示在仪表盘头部与分享卡；新用户 onboarding 后引导一次（可跳过）。
2. **自定义分类**：六类之外可新增分类（名称+emoji+颜色），并指定归入哪个内置维度参与指数计算（`baseType`，引擎零改动）；可编辑、可归档（归档不出现在选择器，历史记录保留）。投入、习惯、分析三处共用。

### B. 记账软件精华
3. **流水编辑/删除/补记**：每条投入提供 ✏️/🗑；编辑弹窗可改日期（date 选择器，默认今天）、金额、分类（含自定义）、描述；保存后 `totalInvest` 按全量流水重算；删除二次确认。
4. **月度预算**：设置每月投入预算（元）；未授权金额时改为"每月笔数预算"。仪表盘新卡片：本月进度条、剩余/超支（超支红色）、日均、上月对比。
5. **分类分析弹窗**：当月分类占比（暖色 canvas 环形图+图例金额/笔数/占比）、近 6 个月投入趋势柱图、分类环比。
6. **流水搜索与筛选**：投入记录卡顶部加分类筛选 chips（含"全部/自定义分类"）+ 关键词搜索（描述）。

### C. Todo / 习惯软件精华
7. **习惯打卡**：自定义习惯（名称、emoji、每日/每周 N 次、可选关联投入分类、默认"打卡同时记一笔 0 元投入"开关）。仪表盘新"今日习惯"卡：一键打卡、再点取消、显示🔥连续天数、本周圆点进度。
8. **打卡热力图**：习惯详情弹窗展示近 12 周 GitHub 风格暖色热力图 + 最佳连续纪录；点击历史空格可补卡（标注"补"字，仍计入连续，因是自我账本不做惩罚）。
9. **成长待办**：待办卡支持增/改/删、三档优先级、截止日期；完成勾选带庆祝 toast，并可一键"转记投入"或"转记感悟"；逾期红色标记；按 未完成(优先级+截止日)/已完成 排序。

### D. 股票软件精华
10. **指数预警线**：成长曲线卡新增"⚑ 预警"，可设目标位/支撑位两个点数；K 线叠加两条虚线与右侧标签；本地计算穿越即显示祝贺徽章（每档只庆祝一次，状态存档）。
11. **成长大事记时间线**：弹窗按月聚合：投入、感悟、挫折、里程碑达成、连续打卡里程碑（自动生成，不可删）+ 手动"添加大事件"（emoji+标题+日期+备注，可删）。
12. **今日行情条**：仪表盘顶部新增 span2 条带：日期/农历式问候、当前指数与涨跌、今日是否已打卡/已记录、连续火焰、一句引导 CTA（没打卡→"去打卡"，已完成→"今天也在长进"）。

## 三、数据模型变更（`packages/core/src/types.ts`，全部可选字段，旧数据兼容）

```ts
interface CustomType { id: string; name: string; icon: string; color: string; baseType: InvestType; archived?: boolean }
interface Habit { id: string; name: string; icon: string; color: string; cadence: 'daily'|'weekly';
  timesPerWeek: number; linkedType?: string; investOnCheck: boolean; createdAt: Date; archived?: boolean }
interface HabitCheck { habitId: string; date: string /* yyyy-MM-dd 本地 */; makeup?: boolean }
interface GrowthTodo { id: string; title: string; note?: string; priority: 1|2|3; dueDate?: string;
  done: boolean; createdAt: Date; doneAt?: Date }
interface LifeEvent { id: string; date: Date; icon: string; title: string; desc?: string }
interface PriceAlert { target?: number; floor?: number; targetHit?: boolean; floorHit?: boolean }
interface UserProfile {
  customTypes?: CustomType[]; habits?: Habit[]; habitChecks?: HabitCheck[];
  todos?: GrowthTodo[]; lifeEvents?: LifeEvent[];
  monthlyBudget?: number; monthlyCountBudget?: number;
  priceAlert?: PriceAlert;
  nickname?: string; avatar?: string; indexName?: string; signature?: string;
}
interface Investment { customType?: string } // 自定义分类 id；引擎仍用 type(baseType)
```

迁移：`migrate.ts` 无需强迁移（全可选，默认空数组在引擎侧 `|| []` 兜底）；`storage.ts` 的 `loadUser/importUser` 增加新字段 Date 复活，并**顺带修复 journals.date 未复活的现存隐患**。

## 四、文件改动清单

### core 引擎（新增 + 导出，纯函数、可测）
- `src/types.ts`：上述接口；`Investment` 增 `customType?`
- `src/habits.ts`（新）：`createHabit / toggleCheck / isCheckedOn / getHabitStatus（连续/最佳连续/本周次数）/ getHeatmap（12周）`；日期 key 用本地 `yyyy-MM-dd`
- `src/todos.ts`（新）：`createTodo / sortTodos / completeTodo` 等纯函数
- `src/budget.ts`（新）：`getMonthSummary（按月汇总金额与笔数）/ getBudgetStatus`
- `src/analytics.ts`（新）：`categoryBreakdown（合并自定义分类，按 baseType 取权重色）/ monthlyTrend（近6月）`
- `src/events.ts`（新）：`buildTimeline（聚合自动事件+手动事件，按月分组排序）/ addManualEvent`
- `src/alerts.ts`（新）：`evaluateAlert(price, alert) → {targetHitNew, floorHitNew}`
- `src/index.ts`：统一导出
- 不改 `formula.ts / kline.ts` 计算逻辑（自定义分类写入时同步落 `type=baseType`）

### 站点
- `src/main.ts`：新增渲染与弹窗（约 700 行）：名片、自定义分类管理、投入编辑弹窗、预算设置、分析弹窗（手绘 canvas 环形+柱图）、习惯卡/管理/详情热力图弹窗、待办卡与编辑、预警设置弹窗、大事记弹窗、今日行情条；`renderInvestList` 加筛选/搜索/改删；`drawKline` 叠加预警虚线；分享卡接入名片；`showDashboard` 插入新区块渲染；新函数挂 `window`
- `index.html`：dash-grid 新增卡片（今日行情条 span2、今日习惯、成长待办、月度预算），投入卡增加"补记日期"与动态分类 chips（含＋自定义），投入记录卡加筛选/搜索条，曲线卡加"⚑预警"按钮；新增配套 CSS（习惯勾选态、热力图格子、待办优先级条、预算环、时间线节点、名片头部等，全部沿用晨光暖白令牌）；按钮组加 📈分析/📅大事记/⚙️个性化
- `tests/engine.test.ts`：为 habits（连续/断签/周频/补卡/热力图）、todos、budget（跨月边界）、analytics（自定义分类归并）、events、alerts 增加约 20+ 测试

## 五、实施顺序（依赖序）

1. core：types → habits/todos/budget/analytics/events/alerts → index 导出
2. 补测试并先跑 `vitest` 通过
3. storage：Date 复活（含 journals 修复）
4. 站点数据层接线（CRUD + saveUser 重渲染）
5. 记账向：投入编辑/删除/补记 → 搜索筛选 → 预算 → 分析
6. Todo 向：习惯卡+打卡+热力图 → 待办
7. 股票向：预警线叠加 → 大事记 → 今日行情条
8. 个性化：名片（头部+分享卡+onboarding 后引导）→ 自定义分类全链路
9. 收尾样式与移动端 768px 适配

## 六、验证

- `npx tsc --noEmit`、`npx vitest run`（原 37 + 新增全过）、`npm run build`
- 浏览器实测（桌面 1440 + 移动 390）：新用户引导名片、建自定义分类→记账→筛选→编辑→删除全链路、预算超支切换、习惯打卡/取消/补卡/热力图、待办完成转感悟、预警穿越徽章、时间线、今日条联动、分享卡名片、控制台零报错
- 回归：未授权敏感信息时金额框禁用、预算走笔数模式；导入旧数据不报错
- 构建产物同步 `docs/`+`website/`（保留 `.nojekyll`），提交推送，确认 Actions success 与线上生效

## 七、风险与处理

- **自定义分类污染引擎**：写入时双写 `type=baseType` 与 `customType=id`，引擎只读 `type`，零风险。
- **冗余汇总漂移**：编辑/删除流水后从全量流水重算 `totalInvest`。
- **打卡日期时区**：统一本地 `yyyy-MM-dd` key，不用 UTC。
- **功能过多入口拥挤**：按钮已 20+；新入口收进三个主弹窗 + 仪表盘新卡，按钮组只加 3 个（分析/大事记/个性化），其余就近放在卡片标题右侧。
- **文件膨胀**：main.ts 将超 2200 行，本轮保持单文件与现有风格一致；若后续再迭代，下轮再拆模块。
- **合规**：全部本地计算，无新增外部请求；打卡/待办不含金额输入，不受敏感授权影响。
