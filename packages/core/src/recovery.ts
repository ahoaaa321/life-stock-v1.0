/**
 * recovery.ts —— 低谷恢复计划（调研驱动：Q5"挫折修复任务引导"74.5% 第一刚需）
 *
 * 设计原则：
 * - 记录挫折后不止给出指数回撤，而是立即给"一个 60 秒可做的小行动"+"恢复期任务清单"
 * - 纯函数、零平台依赖，Web / 小程序共用
 * - 文案使用"回落/调整期"，禁止"亏损/崩盘"等警报词
 */
import type { UserProfile } from './types';

export type SetbackKind = 'jobloss' | 'illness' | 'loss' | 'stagnate';

export interface RecoveryTask {
  id: string;
  text: string;
  /** 建议在第几天做（1~7） */
  day: number;
  done: boolean;
  doneAt?: string;
}

export interface RecoveryPlan {
  id: string;
  setbackType: SetbackKind;
  /** 1~10 严重度 */
  severity: number;
  /** ISO 时间 */
  createdAt: string;
  /** 记录挫折前的指数，用于回暖对比 */
  indexBefore: number;
  /** 60 秒即时行动 */
  instantText: string;
  instantDone: boolean;
  instantDoneAt?: string;
  tasks: RecoveryTask[];
  /** 全部任务（含即时行动）完成时间 */
  completedAt?: string;
}

interface RecoveryKit {
  /** 共情开场 */
  empathy: string;
  /** 60 秒内可完成的即时小行动 */
  instant: string;
  /** 恢复期任务（7 天以内） */
  tasks: { text: string; day: number }[];
  /** 完成即时行动后的回暖语 */
  instantCheer: string;
  /** 全部完成的庆祝语 */
  completeCheer: string;
}

export const RECOVERY_KITS: Record<SetbackKind, RecoveryKit> = {
  jobloss: {
    empathy: '工作的变动不是你的价值下跌，只是曲线绕了个弯。先稳住节奏，再慢慢找回方向。',
    instant: '打开备忘录，写下：现在最担心的 3 件事，和你手里已有的 3 个资源（一项技能、一个朋友、一笔存款都算）。',
    instantCheer: '写下来了，就没那么吓人了——你手里的牌比想象中多。',
    completeCheer: '这一周你没有被变动定义，而是在主动布局下一段路。曲线回暖，你值得这个反弹。',
    tasks: [
      { day: 1, text: '更新一页简历，只写最近做成的 3 件事' },
      { day: 2, text: '联系 3 位旧同事或朋友，简单聊聊近况' },
      { day: 3, text: '投出 2 个认真匹配的岗位（不求多，求准）' },
      { day: 4, text: '学 1 节与目标岗位相关的技能小课' },
      { day: 5, text: '出门运动 30 分钟，让身体先恢复状态' },
      { day: 6, text: '复盘这次变动：它帮你排除了什么不想要的？' },
      { day: 7, text: '给自己做一顿好饭，认真感谢撑过来的自己' },
    ],
  },
  illness: {
    empathy: '健康亮红灯的时候，指数退一小步是身体在提醒你慢一点。照顾好自己，就是最重要的成长投入。',
    instant: '放下手机，做 10 次缓慢的深呼吸：吸气 4 秒，停 2 秒，呼气 6 秒。',
    instantCheer: '感觉到了吗？这 10 次呼吸，就是你今天为恢复做的第一件事。',
    completeCheer: '一周的好好吃饭、好好睡觉，都被身体记住了。健康分会一点点回来，你也是。',
    tasks: [
      { day: 1, text: '整理就医资料/预约一次该做的检查' },
      { day: 1, text: '今晚比平时早睡 30 分钟' },
      { day: 2, text: '出门散步 20 分钟，晒晒太阳' },
      { day: 3, text: '吃一顿热乎、营养均衡的饭' },
      { day: 4, text: '跟一个信任的人说说近况，不用硬撑' },
      { day: 5, text: '记一笔健康投入（一杯牛奶、一次散步都算）' },
      { day: 6, text: '写下今天身体的一个好变化（哪怕只是睡得好些）' },
    ],
  },
  loss: {
    empathy: '积累暂时放缓不等于清零，你过去走过的路、学过的东西，都还在你身上。',
    instant: '倒一杯温水，写下：这次失去教会我的一件事。',
    instantCheer: '能从回落里看出经验，这一笔就没有白白发生。',
    completeCheer: '你没有假装什么都没发生，而是认真收拾了行装。下一段上坡路，你走得更稳。',
    tasks: [
      { day: 1, text: '盘点：列出 5 样仍然属于你的积累与资源' },
      { day: 2, text: '写下 3 条具体的止损行动，今天做掉 1 条' },
      { day: 3, text: '重新核对本月预算，找出可以松一口气的空间' },
      { day: 4, text: '在回落复盘里写下原因和下次的预警信号' },
      { day: 5, text: '做一笔小额学习投入（一本书、一节课都行）' },
      { day: 6, text: '运动 30 分钟，用身体的确定感对冲焦虑' },
      { day: 7, text: '和朋友聊聊天，接收一点来自关系的支持' },
    ],
  },
  stagnate: {
    empathy: '躺平的日子不是浪费，是成长在蓄力。不用一下子振作，先从一件 5 分钟的小事重新启动。',
    instant: '现在选一件 5 分钟内能完成的小事立刻做：叠被子、洗个杯子，或者出门走 5 分钟。',
    instantCheer: '看，动起来没有那么难。这 5 分钟，就是曲线重新抬头的起点。',
    completeCheer: '连续 7 天的小动作之后，你已经不在原地了。允许自己慢慢来，但你确实在前进。',
    tasks: [
      { day: 1, text: '记一笔 0 元投入：今天认真做的任何一件小事' },
      { day: 2, text: '恢复一个以前坚持过的旧习惯，只做最小版本' },
      { day: 3, text: '定一个本周最小目标，小到不可能失败' },
      { day: 4, text: '出门晒太阳 30 分钟，顺便走走' },
      { day: 5, text: '写一句话记录：今天有哪个瞬间还不错？' },
      { day: 6, text: '今晚提前 30 分钟放下手机睡觉' },
      { day: 7, text: '奖励自己一顿好饭，庆祝重新启动的一周' },
    ],
  },
};

function rid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e4).toString(36)}`;
}

/** 创建一份恢复计划（记录挫折时调用） */
export function createRecoveryPlan(
  type: SetbackKind,
  severity: number,
  indexBefore: number,
  now: Date = new Date(),
): RecoveryPlan {
  const kit = RECOVERY_KITS[type];
  return {
    id: rid('rp'),
    setbackType: type,
    severity: Math.min(10, Math.max(1, severity)),
    createdAt: now.toISOString(),
    indexBefore,
    instantText: kit.instant,
    instantDone: false,
    tasks: kit.tasks.map((t) => ({ id: rid('rt'), text: t.text, day: t.day, done: false })),
  };
}

/** 完成/取消完成 60 秒即时行动 */
export function toggleInstant(plan: RecoveryPlan, now: Date = new Date()): RecoveryPlan {
  const done = !plan.instantDone;
  const next: RecoveryPlan = {
    ...plan,
    instantDone: done,
    instantDoneAt: done ? now.toISOString() : undefined,
  };
  return maybeComplete(next, now);
}

/** 勾选/取消勾选某个恢复任务 */
export function toggleRecoveryTask(plan: RecoveryPlan, taskId: string, now: Date = new Date()): RecoveryPlan {
  const next: RecoveryPlan = {
    ...plan,
    tasks: plan.tasks.map((t) =>
      t.id === taskId
        ? { ...t, done: !t.done, doneAt: !t.done ? now.toISOString() : undefined }
        : t,
    ),
  };
  return maybeComplete(next, now);
}

function maybeComplete(plan: RecoveryPlan, now: Date): RecoveryPlan {
  const allDone = plan.instantDone && plan.tasks.every((t) => t.done);
  if (allDone && !plan.completedAt) return { ...plan, completedAt: now.toISOString() };
  if (!allDone && plan.completedAt) return { ...plan, completedAt: undefined };
  return plan;
}

export interface RecoveryProgress {
  done: number;
  total: number;
  pct: number;
  /** 是否已全部完成 */
  finished: boolean;
}

/** 进度（即时行动 + 任务清单合计） */
export function getRecoveryProgress(plan: RecoveryPlan): RecoveryProgress {
  const total = plan.tasks.length + 1;
  const done = plan.tasks.filter((t) => t.done).length + (plan.instantDone ? 1 : 0);
  return { done, total, pct: Math.round((done / total) * 100), finished: done === total };
}

/** 用户最新一份未完成的恢复计划；没有则 null */
export function getActiveRecoveryPlan(user: UserProfile): RecoveryPlan | null {
  const plans = user.recoveryPlans || [];
  for (let i = plans.length - 1; i >= 0; i--) {
    if (!plans[i].completedAt) return plans[i];
  }
  return null;
}

/** 追加/更新用户的恢复计划列表（同 id 覆盖） */
export function upsertRecoveryPlan(user: UserProfile, plan: RecoveryPlan): UserProfile {
  const list = [...(user.recoveryPlans || [])];
  const idx = list.findIndex((p) => p.id === plan.id);
  if (idx >= 0) list[idx] = plan;
  else list.push(plan);
  return { ...user, recoveryPlans: list };
}

/** 恢复套件文案（UI 取共情/庆祝语用） */
export function getRecoveryKit(type: SetbackKind): RecoveryKit {
  return RECOVERY_KITS[type];
}
