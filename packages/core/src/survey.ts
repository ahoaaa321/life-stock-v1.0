// ============ 强化调查表（用真实履历校准 K 线数据来源） ============
import type {
  UserProfile, HistoryItem,
  EnhancedSurveyInput, EduStageInput,
  SurveyCoverage,
} from './types';
import { calcConfidence } from './formula';
import type { ConfidenceInfo } from './formula';

/** 常见学制预设（仅作表单默认值，用户可改年龄/取消勾选） */
export const EDU_STAGE_PRESETS: { name: string; startAge: number; endAge: number }[] = [
  { name: '学前/幼儿园', startAge: 3, endAge: 5 },
  { name: '小学', startAge: 6, endAge: 11 },
  { name: '初中', startAge: 12, endAge: 14 },
  { name: '高中/中职', startAge: 15, endAge: 17 },
  { name: '大学/大专', startAge: 18, endAge: 21 },
  { name: '研究生', startAge: 22, endAge: 24 },
];

/** 学历默认读到的最高阶段（用于预勾选） */
const EDU_STAGE_INDEX: Record<string, number> = {
  primary: 1, junior: 2, senior: 3, college: 4, bachelor: 4, master: 5,
};

/** 生成调查默认教育行：已发生的阶段预勾选，截止年龄不超过当前年龄 */
export function defaultEduStages(user: UserProfile): (EduStageInput & { enrolled: boolean })[] {
  const maxStage = EDU_STAGE_INDEX[user.education] ?? 2;
  return EDU_STAGE_PRESETS.map((p, i) => {
    const endAge = Math.min(p.endAge, user.age);
    return {
      name: p.name,
      startAge: p.startAge,
      endAge,
      totalCost: 0,
      enrolled: i <= maxStage && p.startAge <= user.age,
    };
  }).filter((s) => s.startAge <= user.age);
}

export interface ApplySurveyResult {
  user: UserProfile;
  before: ConfidenceInfo;
  after: ConfidenceInfo;
  coverage: SurveyCoverage;
}

function clampNum(v: unknown, min: number, max: number): number | undefined {
  const n = Number(v);
  if (!isFinite(n) || Number.isNaN(n)) return undefined;
  return Math.max(min, Math.min(max, n));
}

/**
 * 用强化调查的真实数据重建 K 线数据来源（幂等：重复提交不会产生重复行）
 *
 * - 教育阶段：按年龄均摊总花费，替换对应年龄的模型估算教育投入
 * - 大额投入：以真实类型/年龄入历史，享受正确的折旧与权重
 * - 职业轨迹：用于 K 线历史收入与成长系数重建
 * - 波折：合并到 setbacks（同年同类型去重）
 * - 学习时长/健康分/家庭支持：覆盖当前画像
 */
export function applyEnhancedSurvey(
  user: UserProfile,
  input: EnhancedSurveyInput,
  now: Date = new Date(),
): ApplySurveyResult {
  const before = calcConfidence(user);

  // 1) 移除旧的调查数据行（幂等），保留模型估算行
  let history: HistoryItem[] = (user.history || []).filter((h) => h.source !== 'survey');

  // 2) 教育阶段：替换所覆盖年龄的估算教育行
  const eduAges = new Set<number>();
  const stages = (input.eduStages || []).filter(
    (s) => s && s.totalCost > 0 && s.endAge >= s.startAge && s.startAge >= 0 && s.endAge <= user.age,
  );
  for (const s of stages) {
    const years = s.endAge - s.startAge + 1;
    const perYear = Math.round((s.totalCost / years) * 100) / 100;
    for (let age = s.startAge; age <= s.endAge; age++) eduAges.add(age);
    // 先暂存，稍后统一排序
    for (let age = s.startAge; age <= s.endAge; age++) {
      history.push({ age, invest: perYear, type: 'education', source: 'survey', desc: s.name });
    }
  }
  if (eduAges.size > 0) {
    history = history.filter((h) => !(h.source === 'estimated' && h.type === 'education' && eduAges.has(h.age)));
  }

  // 3) 大额投入（0 元也算真实事件，标记该年龄为已核实）
  for (const b of input.bigInvests || []) {
    if (!b || b.age < 0 || b.age > user.age) continue;
    const amount = Math.max(0, Number(b.amount) || 0);
    history.push({
      age: b.age, invest: amount, type: b.type,
      source: 'survey', desc: b.desc?.trim() || undefined,
    });
  }

  history.sort((a, b) => (a.age - b.age) || (a.type < b.type ? -1 : 1));

  const next: UserProfile = { ...user, history };

  // 4) 当前画像校准
  const studyHours = clampNum(input.studyHours, 0, 40);
  if (studyHours !== undefined) next.studyHours = studyHours;
  const healthScore = clampNum(input.healthScore, 0, 100);
  if (healthScore !== undefined) next.healthScore = healthScore;
  const family = clampNum(input.familySupportCapital, 0, 100000);
  if (family !== undefined) next.familySupportCapital = family;

  // 5) 职业与收入轨迹
  const career = input.career;
  if (career) {
    const workStartAge = clampNum(career.workStartAge, 0, user.age);
    const startingSalary = clampNum(career.startingSalary, 0, 100000000);
    const avgRaisePct = clampNum(career.avgRaisePct, -10, 50);
    const currentSalary = clampNum(career.currentSalary, 0, 100000000);
    next.enhancedSurvey = {
      ...(next.enhancedSurvey || {}),
      completedAt: next.enhancedSurvey?.completedAt || now,
      career: {
        workStartAge: workStartAge ?? undefined,
        startingSalary: startingSalary ?? undefined,
        avgRaisePct: avgRaisePct ?? undefined,
        currentSalary: currentSalary ?? undefined,
      },
    };
    if (avgRaisePct !== undefined) next.annualIncomeGrowth = Math.round(avgRaisePct * 100) / 10000;
    if (currentSalary !== undefined && currentSalary > 0) next.annualIncome = currentSalary;
  }

  // 6) 波折合并（同年同类型视为同一件，去重）
  if (input.setbacks && input.setbacks.length > 0) {
    const existing = new Set((next.setbacks || []).map((s) => {
      const age = s.date.getFullYear() - next.birthYear;
      return `${age}:${s.type}`;
    }));
    const added = next.setbacks ? [...next.setbacks] : [];
    for (const sb of input.setbacks) {
      const age = clampNum(sb.age, 0, next.age);
      if (age === undefined) continue;
      const severity = clampNum(sb.severity, 1, 10) ?? 5;
      const key = `${age}:${sb.type}`;
      if (existing.has(key)) continue;
      existing.add(key);
      added.push({ date: new Date(next.birthYear + age, 5, 1), type: sb.type, severity });
    }
    next.setbacks = added;
  }

  // 7) 归档调查答案
  const savedCareer = next.enhancedSurvey?.career;
  next.enhancedSurvey = {
    eduStages: stages,
    bigInvests: (input.bigInvests || []).filter((b) => b && b.age >= 0 && b.age <= user.age),
    career: savedCareer,
    studyHours: studyHours ?? next.enhancedSurvey?.studyHours,
    healthScore: healthScore ?? next.enhancedSurvey?.healthScore,
    familySupportCapital: family ?? next.enhancedSurvey?.familySupportCapital,
    setbacks: (input.setbacks || []).filter((s) => s && s.age >= 0 && s.age <= user.age),
    completedAt: now,
  };

  return { user: next, before, after: calcConfidence(next), coverage: getSurveyCoverage(next) };
}

/** 已被真实数据覆盖的年龄集合（调查历史 + 手动投入所属年龄） */
export function verifiedAges(user: UserProfile): Set<number> {
  const ages = new Set<number>();
  (user.history || []).forEach((h) => { if (h.source === 'survey') ages.add(h.age); });
  (user.investments || []).forEach((inv) => {
    const age = inv.date.getFullYear() - user.birthYear;
    if (age >= 0 && age <= user.age) ages.add(age);
  });
  return ages;
}

/** 调查覆盖度：真实数据年龄 / 总年龄 */
export function getSurveyCoverage(user: UserProfile): SurveyCoverage {
  const totalYears = user.age + 1;
  const verifiedYears = verifiedAges(user).size;
  return {
    verifiedYears,
    totalYears,
    ratio: totalYears > 0 ? Math.round((verifiedYears / totalYears) * 100) / 100 : 0,
  };
}

/**
 * 重建某年龄的年收入（元）
 * 有职业轨迹：工作前为 0，工作后按起薪与年均加薪复利，封顶为当前年薪的 1.1 倍
 * 无职业轨迹：沿用当前画像（旧行为）
 */
export function getIncomeAtAge(user: UserProfile, age: number): number {
  const c = user.enhancedSurvey?.career;
  if (c && c.workStartAge != null && (c.startingSalary ?? 0) > 0) {
    if (age < c.workStartAge) return 0;
    const g = Math.max(-0.1, Math.min(0.5, ((c.avgRaisePct ?? 5) as number) / 100));
    const v = (c.startingSalary as number) * Math.pow(1 + g, age - c.workStartAge);
    const cap = user.annualIncome > 0 ? user.annualIncome * 1.1 : Infinity;
    return Math.round(Math.min(v, cap));
  }
  return user.annualIncome || 0;
}

/** 某年龄适用的收入增速（小数）：参加工作前为 0 */
export function getIncomeGrowthAtAge(user: UserProfile, age: number): number {
  const c = user.enhancedSurvey?.career;
  if (c && c.workStartAge != null && age < c.workStartAge) return 0;
  return user.annualIncomeGrowth || 0;
}

/** 该年龄的波折严重度（0~10），无则 0 */
export function setbackSeverityAtAge(user: UserProfile, age: number): number {
  let maxSev = 0;
  (user.setbacks || []).forEach((s) => {
    const sbAge = s.date.getFullYear() - user.birthYear;
    if (sbAge === age) maxSev = Math.max(maxSev, s.severity);
  });
  return maxSev;
}
