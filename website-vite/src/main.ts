import type { UserProfile, KlinePoint } from '@life-stock/core';
import { Constants, MILESTONES, DATA_SOURCES } from '@life-stock/core';
import { calculateStock, getStageCoef, decay, calculateBV, calcConfidence } from '@life-stock/core';
import { generateHistory } from '@life-stock/core';
import { generateKline, getPeerBenchmark } from '@life-stock/core';
import { migrate, withVersion, FORMULA_VERSION } from '@life-stock/core';
import { calcAttribution, getTopContributor, setSubjectiveWeight } from '@life-stock/core';
import { createJournal, addJournal as addJournalEntry, getRecentJournals, getJournalStreak } from '@life-stock/core';
import { calcDrawdown, getReviewQuestions } from '@life-stock/core';
import { reverseGoal } from '@life-stock/core';
import { generateMonthlyReport } from '@life-stock/core';
import { getWeeklyStatus } from '@life-stock/core';
import { calcRadar } from '@life-stock/core';
import { forecastDepreciation } from '@life-stock/core';
import { simulateScenarios } from '@life-stock/core';
import { getFamilyLedger } from '@life-stock/core';
import { generateAIWeeklyReport } from '@life-stock/core';
import { generateAnnualReport } from '@life-stock/core';
import { getChallenges, getChallengeCompletion } from '@life-stock/core';
import { getMentorAdvice } from '@life-stock/core';
import { TERM_CARDS, STAGE_GUIDES } from '@life-stock/core';
import { generateGratitudeCard, getGratitudeTemplateCount } from '@life-stock/core';
import { generateReportText } from '@life-stock/core';
import type { Investment, InvestType, CustomType, Habit, GrowthTodo, EnhancedSurveyInput, BigInvestInput, SurveySetbackInput } from '@life-stock/core';
import {
  TYPE_META,
  dayKey, todayKey, parseKey, createHabit, toggleCheck, getHabitStatus, getHeatmap,
  createTodo, toggleDone, isOverdue, sortTodos,
  getBudgetStatus, categoryBreakdown, monthlyTrend,
  buildTimeline, addManualEvent, addSystemEvent, deleteEvent,
  evaluateAlert,
  applyEnhancedSurvey, defaultEduStages, getSurveyCoverage,
  createRecoveryPlan, toggleInstant, toggleRecoveryTask, getRecoveryProgress,
  getActiveRecoveryPlan, upsertRecoveryPlan, getRecoveryKit,
  smartParseInvest,
  redeemSeedCode,
} from '@life-stock/core';
import type { RecoveryPlan, SetbackKind } from '@life-stock/core';
import {
  saveUser, loadUser, clearUser, isDisclaimerConfirmed, confirmDisclaimer,
  exportUser, importUser, isPrivacyConsented, setPrivacyConsent,
  isSensitiveConsented, setSensitiveConsent, deleteAllData,
} from './storage/storage';

// 包装导入导出供 HTML 调用
function exportData() { if (user) exportUser(user); }
function importData(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = importUser(e.target!.result as string);
      user = data;
      saveUser(user);
      showDashboard();
      showToast('✅ 数据已导入');
    } catch {
      showToast('❌ 导入失败：文件格式不正确');
    }
  };
  reader.readAsText(file);
  (event.target as HTMLInputElement).value = '';
}

// ============ 全局状态 ============
let user: UserProfile | null = null;
let onboardingStep = 0;
let selectedInvestType: InvestType = 'education';
let onboardingData: Partial<UserProfile> = {};
/** 问卷模式：quick=快速4问（先体验后补录），full=完整10问，resume=续填剩余问题 */
let onboardingMode: 'quick' | 'full' | 'resume' = 'quick';
/** resume 模式下待填写的字段列表 */
let resumeFields: string[] = [];

/** 种子体验官反馈问卷地址（创建腾讯问卷后替换此常量并重新部署） */
const FEEDBACK_URL = 'https://wj.qq.com/';

// 暴露给 HTML onclick
(window as any).startOnboarding = startOnboarding;
(window as any).resumeOnboarding = resumeOnboarding;
(window as any).showAnchorModal = showAnchorModal;
(window as any).showForecastModal = showForecastModal;
(window as any).showShareModal = showShareModal;
(window as any).showSetbackModal = showSetbackModal;
(window as any).showDetailModal = showDetailModal;
(window as any).showParentModal = showParentModal;
(window as any).editProfile = editProfile;
(window as any).resetAll = resetAll;
(window as any).exportData = exportData;
(window as any).importData = importData;
(window as any).handleDeleteAllData = handleDeleteAllData;
(window as any).closeModal = closeModal;
(window as any).showLegalModal = showLegalModal;

// ============ 问卷步骤 ============
const onboardingSteps = [
  { title: '第1步：你今年多大？', desc: '年龄帮我们找到你在人生曲线上的位置', field: 'age', type: 'number', placeholder: '请输入年龄（1-100）' },
  { title: '第2步：你来自哪里？', desc: '不同城市的成长成本不太一样', field: 'region', type: 'select', options: [
    { value: 'tier1', label: '一线城市（北上广深）' },
    { value: 'new_tier1', label: '新一线城市' },
    { value: 'tier2', label: '二线城市' },
    { value: 'tier3', label: '三线及以下' },
  ]},
  { title: '第3步：家庭条件？', desc: '家庭支持也是成长积累的一部分', field: 'income', type: 'select', options: [
    { value: 'low', label: '困难' }, { value: 'below_avg', label: '偏低' },
    { value: 'avg', label: '一般' }, { value: 'above_avg', label: '较好' }, { value: 'high', label: '富裕' },
  ]},
  { title: '第4步：你的学历？', desc: '学历是会跟你一辈子的资产', field: 'education', type: 'select', options: [
    { value: 'primary', label: '小学' }, { value: 'junior', label: '初中' },
    { value: 'senior', label: '高中' }, { value: 'college', label: '大专' },
    { value: 'bachelor', label: '本科' }, { value: 'master', label: '硕士及以上' },
  ]},
  { title: '第5步：你的年收入？', desc: '收入是成长力的一部分，填税前年薪就好', field: 'annualIncome', type: 'number', placeholder: '请输入税前年收入（元），如 120000' },
  { title: '第6步：收入增长趋势？', desc: '持续增长会让成长更有动力', field: 'annualIncomeGrowth', type: 'select', options: [
    { value: '0', label: '下降' }, { value: '0.05', label: '稳定' },
    { value: '0.1', label: '稳步增长' }, { value: '0.2', label: '快速增长' },
  ]},
  { title: '第7步：每周学习时长？', desc: '学习是最值得的自我投入', field: 'studyHours', type: 'select', options: [
    { value: '0', label: '几乎不学习' }, { value: '2', label: '约2小时' },
    { value: '5', label: '约5小时' }, { value: '10', label: '10小时以上' },
  ]},
  { title: '第8步：健康状况？', desc: '健康是一切的底座', field: 'healthScore', type: 'select', options: [
    { value: '40', label: '较差' }, { value: '60', label: '一般' },
    { value: '75', label: '良好' }, { value: '90', label: '优秀' },
  ]},
  { title: '第9步：负债情况？', desc: '适度负债没关系，留意它的影响就好', field: 'debtRatio', type: 'select', options: [
    { value: '0', label: '无负债' }, { value: '0.1', label: '少量负债' },
    { value: '0.3', label: '中等负债' }, { value: '0.6', label: '高负债' },
  ]},
  { title: '第10步：人生节点（可多选）', desc: '已达成的节点都是成长的里程碑', field: 'milestones', type: 'multi', options: [
    { value: 'hasJob', label: '💼 有工作' }, { value: 'salaryRaised', label: '💰 涨过薪' },
    { value: 'hasLicense', label: '🚗 有驾照' }, { value: 'marathon', label: '🏃 跑过马拉松' },
    { value: 'married', label: '💍 已婚' }, { value: 'hasHouse', label: '🏠 有房' },
    { value: 'hasChild', label: '👶 有孩子' },
  ]},
];

// 未单独同意敏感信息时，跳过收入/负债等问题，改用通用估算值
function getVisibleSteps() {
  if (isSensitiveConsented()) return onboardingSteps;
  return onboardingSteps.filter((s) => s.field !== 'annualIncome' && s.field !== 'debtRatio');
}

/** 快速 4 问：年龄、学历、所在城市、年收入（未授权敏感项时替换为家庭条件） */
function getQuickSteps() {
  const fields = isSensitiveConsented()
    ? ['age', 'education', 'region', 'annualIncome']
    : ['age', 'education', 'region', 'income'];
  return onboardingSteps.filter((s) => fields.includes(s.field));
}

/** 根据当前模式返回要走的步骤列表 */
function getActiveSteps() {
  if (onboardingMode === 'quick') return getQuickSteps();
  if (onboardingMode === 'resume') return onboardingSteps.filter((s) => resumeFields.includes(s.field));
  return getVisibleSteps();
}

// ============ 问卷流程 ============
/** mode: quick=快速4问（默认，先体验后补录），full=完整10问 */
function startOnboarding(mode: 'quick' | 'full' = 'quick') {
  onboardingStep = 0;
  onboardingData = {};
  onboardingMode = mode;
  resumeFields = [];
  document.getElementById('landing')?.classList.add('hidden');
  showOnboardingModal();
}

/** 续填剩余问题（快速用户点击"完善画像"时调用） */
function resumeOnboarding() {
  if (!user) return;
  // 已填写的字段集合，其余视为待续填
  const answered = new Set<string>(['age', 'education', 'region', 'area']);
  if (user.annualIncome && user.annualIncome !== 100000) answered.add('annualIncome');
  if (user.income && user.income !== 'avg') answered.add('income');
  resumeFields = onboardingSteps
    .map((s) => s.field)
    .filter((f) => !answered.has(f))
    // 敏感未授权时跳过
    .filter((f) => isSensitiveConsented() || (f !== 'annualIncome' && f !== 'debtRatio'));
  if (resumeFields.length === 0) {
    showToast('画像已经很完整啦 🌱');
    return;
  }
  onboardingStep = 0;
  onboardingData = {};
  onboardingMode = 'resume';
  showOnboardingModal();
}

function showOnboardingModal() {
  const steps = getActiveSteps();
  const step = steps[onboardingStep];
  const isLast = onboardingStep === steps.length - 1;
  // 动态步骤编号（快速/续填模式下与原问卷题号解耦）
  const stepLabel = `第 ${onboardingStep + 1} / ${steps.length} 步`;
  const cleanTitle = step.title.replace(/^第\d+步：/, '');
  const modal = createModal(`${stepLabel}：${cleanTitle}`, step.desc);
  let body = '';
  if (step.type === 'number') {
    body = `<input type="number" id="onboardInput" class="form-input" placeholder="${step.placeholder}" style="width:100%;padding:12px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);font-size:16px;">`;
  } else if (step.type === 'select') {
    body = `<select id="onboardInput" style="width:100%;padding:12px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);font-size:16px;">
      ${step.options!.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
    </select>`;
  } else if (step.type === 'multi') {
    body = `<div id="multiOptions" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      ${step.options!.map(o => `<label style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--surface-softer);border-radius:10px;cursor:pointer;"><input type="checkbox" value="${o.value}"> ${o.label}</label>`).join('')}
    </div>`;
  }
  const lastBtnText = isLast
    ? (onboardingMode === 'resume' ? '保存并更新曲线' : '生成我的成长曲线')
    : '下一步';
  body += `<div class="form-actions"><button class="btn-primary" onclick="submitOnboarding()">${lastBtnText}</button></div>`;
  // 快速模式提供"跳过剩余，用默认值生成"入口
  if (onboardingMode === 'quick' && !isLast) {
    body += `<div style="text-align:center;margin-top:8px;"><a href="javascript:void(0)" onclick="skipOnboarding()" style="color:var(--text-muted);font-size:13px;text-decoration:underline;">先跳过，用默认值看看</a></div>`;
  }
  modal.querySelector('.modal-body')!.innerHTML = body;
}

(window as any).submitOnboarding = submitOnboarding;
(window as any).skipOnboarding = skipOnboarding;

function submitOnboarding() {
  const steps = getActiveSteps();
  const step = steps[onboardingStep];
  if (step.type === 'multi') {
    const checked = Array.from(document.querySelectorAll('#multiOptions input:checked')).map((i: any) => i.value);
    checked.forEach(f => { (onboardingData as any)[f] = true; });
  } else {
    const val = (document.getElementById('onboardInput') as HTMLInputElement).value;
    if (step.type === 'number') (onboardingData as any)[step.field] = Number(val);
    else (onboardingData as any)[step.field] = val;
  }
  onboardingStep++;
  if (onboardingStep >= steps.length) {
    finishOnboarding();
  } else {
    showOnboardingModal();
  }
}

/** 快速模式下跳过剩余问题，用默认值直接生成 */
function skipOnboarding() {
  finishOnboarding();
}

/** 为快速/跳过模式补全默认画像字段 */
function applyDefaults(data: Partial<UserProfile>): Partial<UserProfile> {
  return {
    income: (data.income as any) || 'avg',
    annualIncome: isSensitiveConsented() ? (data.annualIncome as number) || 100000 : 100000,
    annualIncomeGrowth: Number(data.annualIncomeGrowth ?? 0.05),
    studyHours: Number(data.studyHours ?? 5),
    healthScore: Number(data.healthScore ?? 75),
    debtRatio: isSensitiveConsented() ? Number(data.debtRatio ?? 0) : 0,
    hasJob: !!(data as any).hasJob,
    salaryRaised: !!(data as any).salaryRaised,
    hasLicense: !!(data as any).hasLicense,
    marathon: !!(data as any).marathon,
    married: !!(data as any).married,
    hasHouse: !!(data as any).hasHouse,
    hasChild: !!(data as any).hasChild,
  };
}

function finishOnboarding() {
  if (onboardingMode === 'resume' && user) {
    // 续填：合并到现有 user，保留 investments/history 等
    const patch = applyDefaults(onboardingData);
    Object.assign(user, patch);
    user.quickOnboarded = false;
    // 历史不重算（保留用户已有投入），只更新画像系数
    saveUser(user);
    closeModal();
    showDashboard();
    showToast('✅ 画像已更新，曲线更准啦');
    return;
  }

  const data = applyDefaults(onboardingData);
  const age = Number(onboardingData.age);
  user = {
    age,
    region: (onboardingData.region as any) || 'tier2',
    area: 'urban',
    income: data.income as any,
    education: (onboardingData.education as any) || 'bachelor',
    birthYear: new Date().getFullYear() - age,
    annualIncome: data.annualIncome as number,
    annualIncomeGrowth: data.annualIncomeGrowth as number,
    studyHours: data.studyHours as number,
    healthScore: data.healthScore as number,
    debtRatio: data.debtRatio as number,
    hasJob: data.hasJob as boolean,
    salaryRaised: data.salaryRaised as boolean,
    hasLicense: data.hasLicense as boolean,
    marathon: data.marathon as boolean,
    married: data.married as boolean,
    hasHouse: data.hasHouse as boolean,
    hasChild: data.hasChild as boolean,
    totalInvest: 0,
    history: generateHistory({
      age,
      region: (onboardingData.region as any) || 'tier2',
      area: 'urban',
      income: data.income as any,
      education: (onboardingData.education as any) || 'bachelor',
    }),
    investments: [],
    familySupportCapital: 0,
    subjectiveWeight: 1.0,
    quickOnboarded: onboardingMode === 'quick',
    version: FORMULA_VERSION,
  };
  saveUser(user);
  closeModal();
  showDashboard();
  showToast(isSensitiveConsented() ? '✅ 成长曲线已生成！' : '✅ 成长曲线已生成（敏感项使用估算值）');
  // 新用户引导一次个性名片（可跳过）
  setTimeout(() => showProfileModal(true), 400);
}

// ============ 仪表盘 ============
function showDashboard() {
  if (!user) return;
  const u = user;
  document.getElementById('landing')?.classList.add('hidden');
  document.getElementById('dashboard')?.classList.remove('hidden');
  const stock = calculateStock(u);
  document.getElementById('dashPrice')!.textContent = Math.round(stock.price).toLocaleString() + ' 点';
  const changeEl = document.getElementById('dashChange')!;
  changeEl.textContent = (stock.change >= 0 ? '+' : '') + stock.change + '%';
  changeEl.style.color = stock.change >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
  document.getElementById('dashBV')!.textContent = Math.round(stock.bv).toLocaleString() + ' 点';
  document.getElementById('dashEPS')!.textContent = String(stock.eps);
  document.getElementById('dashROE')!.textContent = stock.roe + '%';
  document.getElementById('dashPE')!.textContent = stock.pe === '—' ? '—' : stock.pe + '倍';

  // B2：置信度标签
  const conf = calcConfidence(u);
  const confColor = conf.level === 'high' ? 'var(--accent-green)' : conf.level === 'medium' ? 'var(--accent-yellow)' : 'var(--accent-red)';
  const estPct = Math.round(conf.estimatedRatio * 100);
  const potPct = Math.round(conf.potentialEstimatedRatio * 100);
  document.getElementById('dashConfidence')!.innerHTML =
    `<span style="color:${confColor};font-weight:bold;">● ${conf.label}</span> ` +
    `本指数含 ${estPct}% 估算成分` +
    (conf.level !== 'high'
      ? `，<a href="javascript:showSurveyModal()" style="color:var(--accent);font-weight:600;text-decoration:underline;">📋 填强化调查表可降至 ${potPct}%</a>`
      : '，真实数据充足') +
    `<br><a href="javascript:showAnchorModal()" style="color:var(--text-muted);text-decoration:underline;">手动校准</a> · ` +
    `<a href="javascript:showDetailModal()" style="color:var(--text-muted);text-decoration:underline;">数据来源</a>`;
  // 曲线卡：强化调查完成状态
  const surveyBadge = document.getElementById('surveyBadge');
  if (surveyBadge) {
    const cov = getSurveyCoverage(u);
    surveyBadge.innerHTML = cov.verifiedYears > 0
      ? `<a onclick="showSurveyModal()" style="font-size:12px;font-weight:600;color:var(--accent-green);cursor:pointer;">✓ 已精确化 ${cov.verifiedYears}/${cov.totalYears} 岁</a>`
      : `<a onclick="showSurveyModal()" style="font-size:12.5px;font-weight:normal;cursor:pointer;color:var(--accent);">📋 强化调查</a>`;
  }

  const kline = generateKline(u);
  drawKline(kline, u);

  // v1.3：预警线评估（穿越即提示，回落自动复位）
  const alertRes = evaluateAlert(stock.price, u.priceAlert || {});
  if (JSON.stringify(alertRes.alert) !== JSON.stringify(u.priceAlert || {})) {
    u.priceAlert = alertRes.alert;
    saveUser(u);
  }
  if (alertRes.targetNew) showToast('🎉 恭喜！成长指数突破目标位');
  if (alertRes.floorNew) showToast('🟡 指数回到支撑位附近，正好打开「回落复盘」看看');
  renderAlertBadge(u);

  // 未单独同意敏感信息时，金额输入框停用（仅记录事件）
  const amountInput = document.getElementById('investAmount') as HTMLInputElement | null;
  if (amountInput) {
    if (isSensitiveConsented()) {
      amountInput.placeholder = '这笔花了多少（元，仅存本机）';
      amountInput.disabled = false;
    } else {
      amountInput.placeholder = '未授权金额信息，可只写描述直接添加';
      amountInput.disabled = true;
      amountInput.value = '';
    }
  }
  const dateInput = document.getElementById('investDate') as HTMLInputElement | null;
  if (dateInput && !dateInput.value) dateInput.value = todayKey();
  // 投入分类（含自定义）
  renderInvestTypeChips(u);
  // 里程碑列表
  renderMilestones(u);
  // 投入记录列表
  renderInvestList(u);
  // 一句话记录
  renderJournals(u);
  // 每周一笔状态
  renderWeeklyStatus(u);
  // v1.3 新卡片
  renderTodayStrip(u, stock);
  renderHabitCard(u);
  renderTodoCard(u);
  renderBudgetCard(u);
  renderRecoveryBanner(u);
  renderQuickOnboardNudge(u);
  renderRecallBanner(u);

  // 种子体验官入口按钮状态
  const seedBtn = document.getElementById('seedEntryBtn');
  if (seedBtn) seedBtn.textContent = u.seedTester ? '🌱 种子体验官' : '🎟️ 内测邀请码';
}

// ============ 记一笔投入 ============
let selectedCustomId: string | null = null;
let investFilter = 'all';
let investKeyword = '';

(window as any).selectInvestKey = selectInvestKey;
function selectInvestKey(key: string) {
  if (!user) return;
  if (key.startsWith('custom:')) {
    selectedCustomId = key.slice(7);
  } else {
    selectedInvestType = key as InvestType;
    selectedCustomId = null;
  }
  renderInvestTypeChips(user);
}

/** 当前表单选中的分类 */
function currentSelection(u: UserProfile): TypeOption {
  if (selectedCustomId) {
    const c = (u.customTypes || []).find((x) => x.id === selectedCustomId && !x.archived);
    if (c) return { key: 'custom:' + c.id, label: c.name, icon: c.icon, color: c.color, type: c.baseType, customId: c.id };
    selectedCustomId = null;
  }
  const m = TYPE_META[selectedInvestType];
  return { key: selectedInvestType, label: m.name, icon: m.icon, color: m.color, type: selectedInvestType };
}

function renderInvestTypeChips(u: UserProfile) {
  const box = document.getElementById('investTypes');
  if (!box) return;
  const sel = currentSelection(u).key;
  box.innerHTML = getTypeOptions(u).map((o) =>
    `<div class="invest-type ${sel === o.key ? 'selected' : ''}" data-key="${o.key}" onclick="selectInvestKey('${o.key}')">${o.icon} ${esc(o.label)}</div>`,
  ).join('') + `<div class="invest-type invest-type-add" onclick="showCustomTypeManager()">＋ 分类</div>`;
}

(window as any).addInvestment = addInvestment;
function addInvestment() {
  if (!user) return;
  const u = user;
  const amountEl = document.getElementById('investAmount') as HTMLInputElement;
  const descEl = document.getElementById('investDesc') as HTMLInputElement;
  const dateEl = document.getElementById('investDate') as HTMLInputElement | null;
  const sensitive = isSensitiveConsented();
  const amount = sensitive ? Number(amountEl.value) : 0;
  if (sensitive && amountEl.value && (!amount || amount < 0)) { showToast('请输入有效金额，或留空仅记录事件'); return; }
  const opt = currentSelection(u);
  const date = dateEl && dateEl.value ? parseKey(dateEl.value) : new Date();
  commitInvestment({ type: opt.type, customId: opt.customId, amount, desc: descEl.value.trim() || undefined, date });
  amountEl.value = '';
  descEl.value = '';
  if (dateEl) dateEl.value = todayKey();
}

/** 投入提交的统一入口（表单与一句话智能记一笔共用），含指数即时回响 */
const INVEST_CHEERS: Record<string, string> = {
  education: '今天学到的，都会在未来替你说话 📚',
  skill: '又给未来的自己存了一项本事 ✨',
  health: '好好照顾自己，是最稳的成长投资 💪',
  network: '关系里的温度，也是成长的养分 🤝',
  entertainment: '会休息的人，才走得远 🎮',
  other: '这一笔小努力，被认真记下了 🌱',
};
function commitInvestment(item: { type: InvestType; customId?: string; amount: number; desc?: string; date: Date }) {
  if (!user) return;
  const u = user;
  const before = calculateStock(u).price;
  u.investments.push({ type: item.type, customType: item.customId, amount: item.amount, desc: item.desc, date: item.date });
  u.totalInvest += item.amount;
  saveUser(u);
  const after = calculateStock(u).price;
  showDashboard();
  // P0-3 即时回响：1 秒内看到指数变化（调研：缺系统反馈 57.1% / 量化卖点 51.1%）
  const delta = after - before;
  const cheer = INVEST_CHEERS[item.customId ? (u.customTypes || []).find((c) => c.id === item.customId)?.baseType || 'other' : item.type] || INVEST_CHEERS.other;
  if (delta !== 0) {
    showToast(`🌱 成长指数 ${before.toFixed(0)} → ${after.toFixed(0)}（${delta > 0 ? '+' : ''}${delta.toFixed(0)}）${cheer}`);
  } else {
    showToast(`✅ 已记下这笔投入 · ${cheer}`);
  }
}

// ============ 一句话智能记一笔（P0-2） ============
const SMART_TYPE_LABEL: Record<string, string> = {
  education: '🎓 教育', skill: '📚 技能', health: '💪 健康',
  network: '🤝 人脉', entertainment: '🎮 娱乐', other: '📦 其他',
};
(window as any).smartInvest = smartInvest;
(window as any).previewSmartInvest = previewSmartInvest;

function previewSmartInvest() {
  if (!user) return;
  const input = document.getElementById('smartInvestInput') as HTMLInputElement;
  const box = document.getElementById('smartPreview');
  if (!box) return;
  const text = input.value.trim();
  if (!text) { box.innerHTML = ''; return; }
  const r = smartParseInvest(text);
  const sensitive = isSensitiveConsented();
  const typeLabel = r.type ? SMART_TYPE_LABEL[r.type] : '🏷️ 用当前分类';
  const amountLabel = !r.matched.amount ? '只记事件'
    : sensitive ? `${r.amount!.toLocaleString()} 元` : '金额已忽略（未授权）';
  const dateLabel = r.date ? `${r.date.getMonth() + 1}月${r.date.getDate()}日` : '今天';
  box.innerHTML = `识别为：<b style="color:var(--text-primary);">${typeLabel} · ${amountLabel} · ${dateLabel}</b>，按「记入」保存，不对可在下方表单修改`;
}

function smartInvest() {
  if (!user) return;
  const u = user;
  const input = document.getElementById('smartInvestInput') as HTMLInputElement;
  const text = input.value.trim();
  if (!text) { showToast('先写一句话，比如：昨天健身课花了 200'); return; }
  const r = smartParseInvest(text);
  const sensitive = isSensitiveConsented();
  // 分类：解析到就用解析的（同步表单选中态），否则用当前选中分类
  let type: InvestType = r.type || selectedInvestType;
  let customId: string | undefined;
  if (r.type) {
    selectedInvestType = r.type;
    selectedCustomId = null;
    renderInvestTypeChips(u);
  } else {
    const opt = currentSelection(u);
    type = opt.type; customId = opt.customId;
  }
  const amount = sensitive ? (r.amount ?? 0) : 0;
  commitInvestment({ type, customId, amount, desc: r.desc || undefined, date: r.date || new Date() });
  input.value = '';
  document.getElementById('smartPreview')!.innerHTML = '';
}

(window as any).editInvest = editInvest;
(window as any).deleteInvest = deleteInvest;
function editInvest(idx: number) {
  if (!user) return;
  const u = user;
  const inv = u.investments[idx];
  if (!inv) return;
  const sensitive = isSensitiveConsented();
  const curKey = inv.customType ? 'custom:' + inv.customType : inv.type;
  const modal = createModal('✏️ 编辑这笔投入', '修改日期、分类、金额或描述，指数会按新内容重算');
  modal.querySelector('.modal-body')!.innerHTML = `
    <label style="font-size:13px;font-weight:bold;">日期</label>
    <input type="date" id="editInvDate" value="${dayKey(new Date(inv.date))}" max="${todayKey()}" style="width:100%;margin:6px 0 14px;">
    <label style="font-size:13px;font-weight:bold;">分类</label>
    <div id="editInvTypes" style="display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 14px;">
      ${getTypeOptions(u).map((o) =>
        `<div class="invest-type ${curKey === o.key ? 'selected' : ''}" onclick="document.querySelectorAll('#editInvTypes .invest-type').forEach(x=>x.classList.remove('selected'));this.classList.add('selected');this.parentNode.dataset.key='${o.key}';">${o.icon} ${esc(o.label)}</div>`).join('')}
    </div>
    <label style="font-size:13px;font-weight:bold;">金额（元）${sensitive ? '' : '· 未授权金额，已停用'}</label>
    <input type="number" id="editInvAmount" value="${inv.amount || ''}" ${sensitive ? '' : 'disabled'} placeholder="可留空，仅记录事件" style="width:100%;margin:6px 0 14px;">
    <label style="font-size:13px;font-weight:bold;">描述</label>
    <input type="text" id="editInvDesc" value="${esc(inv.desc || '')}" placeholder="可选" style="width:100%;margin:6px 0 14px;">
    <div class="form-actions" style="justify-content:space-between;">
      <button class="dash-btn danger" onclick="deleteInvest(${idx})">🗑 删除这笔</button>
      <button class="btn-primary" onclick="saveInvestEdit(${idx})">保存</button>
    </div>`;
  (document.getElementById('editInvTypes') as HTMLElement).dataset.key = curKey;
}

(window as any).saveInvestEdit = saveInvestEdit;
function saveInvestEdit(idx: number) {
  if (!user) return;
  const u = user;
  const inv = u.investments[idx];
  if (!inv) return;
  const key = (document.getElementById('editInvTypes') as HTMLElement).dataset.key || inv.type;
  const opt = getTypeOptions(u).find((o) => o.key === key);
  const dateVal = (document.getElementById('editInvDate') as HTMLInputElement).value;
  const amount = isSensitiveConsented() ? Number((document.getElementById('editInvAmount') as HTMLInputElement).value) || 0 : inv.amount;
  const desc = (document.getElementById('editInvDesc') as HTMLInputElement).value.trim();
  inv.date = dateVal ? parseKey(dateVal) : inv.date;
  inv.type = opt ? opt.type : inv.type;
  inv.customType = opt?.customId;
  inv.amount = amount;
  inv.desc = desc || undefined;
  u.totalInvest = u.investments.reduce((s, i) => s + (i.amount || 0), 0);
  saveUser(u);
  closeModal();
  showDashboard();
  showToast('✅ 已保存修改');
}

function deleteInvest(idx: number) {
  if (!user) return;
  const u = user;
  const inv = u.investments[idx];
  if (!inv) return;
  if (!confirm(`确定删除这笔「${inv.desc || invDisplay(u, inv).name}」记录吗？`)) return;
  u.investments.splice(idx, 1);
  u.totalInvest = u.investments.reduce((s, i) => s + (i.amount || 0), 0);
  saveUser(u);
  closeModal();
  showDashboard();
  showToast('已删除');
}

(window as any).setInvestFilter = setInvestFilter;
function setInvestFilter(key: string) {
  investFilter = key;
  if (user) renderInvestList(user);
}
(window as any).setInvestKeyword = setInvestKeyword;
function setInvestKeyword(v: string) {
  investKeyword = v.trim();
  if (user) renderInvestList(user);
}

function renderMilestones(u: UserProfile) {
  const achieved = MILESTONES.filter((m) => m.condition(u));
  document.getElementById('milestoneCount')!.textContent = `(${achieved.length}/${MILESTONES.length})`;
  const list = document.getElementById('milestoneList')!;
  list.innerHTML = MILESTONES.map((m) => {
    const done = m.condition(u);
    return `<div class="milestone-item ${done ? 'done' : ''}" style="opacity:${done ? 1 : 0.5};">
      <span class="m-icon">${m.icon}</span>
      <span class="m-name">${m.name} <span style="font-size:11px;color:var(--text-muted);">${m.desc}</span></span>
      <span class="m-bonus">${done ? '✓ +' + m.bonus : '+' + m.bonus}</span>
    </div>`;
  }).join('');
}

function renderInvestList(u: UserProfile) {
  const filterBar = document.getElementById('investFilterBar');
  if (filterBar) {
    const opts = [{ key: 'all', label: '全部' }, ...getTypeOptions(u)];
    filterBar.innerHTML = opts.map((o) => {
      const label = 'label' in o ? o.label : (o as any).label;
      const key = (o as any).key;
      return `<span class="filter-chip ${investFilter === key ? 'active' : ''}" onclick="setInvestFilter('${key}')">${label}</span>`;
    }).join('');
  }
  const list = document.getElementById('investList')!;
  if (u.investments.length === 0) {
    list.innerHTML = '<div style="text-align:center;color:var(--text-secondary);padding:30px;">还没有投入记录，记一笔试试吧</div>';
    return;
  }
  const rows = u.investments.map((inv, idx) => ({ inv, idx, disp: invDisplay(u, inv) }))
    .filter(({ inv, disp }) => {
      if (investFilter !== 'all') {
        const key = inv.customType ? 'custom:' + inv.customType : inv.type;
        if (key !== investFilter) return false;
      }
      if (investKeyword) {
        const hay = `${inv.desc || ''}${disp.name}`.toLowerCase();
        if (!hay.includes(investKeyword.toLowerCase())) return false;
      }
      return true;
    })
    .reverse();
  if (rows.length === 0) {
    list.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:24px;">没有符合条件的记录</div>';
    return;
  }
  list.innerHTML = rows.map(({ inv, idx, disp }) => `
    <div class="invest-item">
      <span class="i-type" style="${inv.customType ? `background:${disp.color}22;` : ''}">${disp.icon}</span>
      <div class="i-info">
        <div>${esc(inv.desc || disp.name)} <span style="font-size:10px;color:${disp.color};font-weight:bold;">${esc(disp.name)}</span> ${inv.impact ? '<span class="i-impact">⭐ 影响大</span>' : ''}</div>
        <div style="font-size:11px;color:var(--text-muted);">${new Date(inv.date).toLocaleDateString('zh-CN')}</div>
      </div>
      <span class="i-amount">${inv.amount > 0 ? inv.amount.toLocaleString() + ' 元' : '事件'}</span>
      <span class="i-actions">
        <span class="i-edit" title="编辑" onclick="editInvest(${idx})">✏️</span>
      </span>
    </div>
  `).join('');
}

// ============ K线绘制 ============
function drawKline(points: KlinePoint[], userObj: UserProfile) {
  const canvas = document.getElementById('klineCanvas') as HTMLCanvasElement;
  if (!canvas || points.length < 2) return;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(2, 2);
  const w = rect.width, h = rect.height;
  const pad = { l: 50, r: 55, t: 20, b: 40 };
  const chartW = w - pad.l - pad.r;
  const volH = 50;
  const priceH = h - pad.t - pad.b - volH - 10;
  const volTop = pad.t + priceH + 10;

  const prices = points.map(p => p.price);
  const minP = Math.min(...prices) * 0.95;
  const maxP = Math.max(...prices) * 1.05;
  const range = maxP - minP || 1;
  const maxVol = Math.max(...points.map(p => p.invest), 1);
  const peerPrice = getPeerBenchmark(userObj);
  const peerY = pad.t + priceH * (1 - (peerPrice - minP) / range);

  const ma5 = points.map((p, i) => {
    const start = Math.max(0, i - 4);
    return points.slice(start, i + 1).reduce((s, x) => s + x.price, 0) / (i - start + 1);
  });

  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(120,95,60,0.12)';
  for (let i = 0; i <= 4; i++) {
    const y = pad.t + (priceH / 4) * i;
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
    ctx.fillStyle = 'rgba(163,150,132,0.95)'; ctx.font = '11px sans-serif';
    ctx.fillText(String(Math.round(maxP - (range / 4) * i)), 5, y + 4);
  }

  const stepX = chartW / (points.length - 1);
  if (peerY >= pad.t && peerY <= pad.t + priceH) {
    ctx.strokeStyle = 'rgba(224,153,47,0.55)'; ctx.lineWidth = 1.2; ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(pad.l, peerY); ctx.lineTo(w - pad.r, peerY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#c9871f'; ctx.font = 'bold 10px sans-serif';
    ctx.fillText('同龄人 ' + Math.round(peerPrice) + ' 点', w - pad.r + 3, peerY + 3);
  }

  // v1.3：用户预警线（目标位/支撑位）
  const alert = userObj.priceAlert;
  const drawAlertLine = (value: number | undefined, color: string, label: string) => {
    if (!value || value < minP || value > maxP) return;
    const y = pad.t + priceH * (1 - (value - minP) / range);
    ctx.strokeStyle = color; ctx.lineWidth = 1.4; ctx.setLineDash([8, 4]);
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = color; ctx.font = 'bold 10px sans-serif';
    ctx.fillText(`${label} ${value} 点`, pad.l + 4, y - 4);
  };
  drawAlertLine(alert?.target, '#3fa06a', '🎯 目标');
  drawAlertLine(alert?.floor, '#e05c4b', '🟡 支撑');

  const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + priceH);
  grad.addColorStop(0, 'rgba(255,138,76,0.3)'); grad.addColorStop(1, 'rgba(255,138,76,0)');
  ctx.beginPath(); ctx.moveTo(pad.l, pad.t + priceH);
  points.forEach((p, i) => { const x = pad.l + stepX * i; const y = pad.t + priceH * (1 - (p.price - minP) / range); ctx.lineTo(x, y); });
  ctx.lineTo(pad.l + chartW, pad.t + priceH); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();

  ctx.beginPath();
  ma5.forEach((v, i) => { const x = pad.l + stepX * i; const y = pad.t + priceH * (1 - (v - minP) / range); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
  ctx.strokeStyle = 'rgba(62,155,143,0.7)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);

  ctx.beginPath();
  points.forEach((p, i) => { const x = pad.l + stepX * i; const y = pad.t + priceH * (1 - (p.price - minP) / range); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
  ctx.strokeStyle = '#ff8a4c'; ctx.lineWidth = 2.5; ctx.stroke();

  const milestoneAges = [0, 6, 15, 18, 22, 30];
  points.forEach((p, i) => {
    const x = pad.l + stepX * i; const y = pad.t + priceH * (1 - (p.price - minP) / range);
    if (milestoneAges.includes(p.age)) {
      ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fillStyle = '#3fa06a'; ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();
    } else if (p.verified) {
      // 强化调查核实的非里程碑年份：墨绿空心环
      ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(62,155,143,0.25)'; ctx.fill();
      ctx.strokeStyle = '#3e9b8f'; ctx.lineWidth = 1.5; ctx.stroke();
    }
  });

  const last = points[points.length - 1];
  const lastY = pad.t + priceH * (1 - (last.price - minP) / range);
  ctx.fillStyle = last.price >= peerPrice ? '#3fa06a' : '#e05c4b';
  ctx.fillRect(w - pad.r, lastY - 9, 50, 18);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(Math.round(last.price) + ' 点', w - pad.r + 25, lastY + 4); ctx.textAlign = 'left';

  points.forEach((p, i) => {
    const x = pad.l + stepX * i; const barH = (p.invest / maxVol) * volH; const barW = Math.max(1, stepX * 0.5);
    // v1.3：强化调查覆盖的真实年份用实心墨绿量柱，估算年份保持半透明
    ctx.fillStyle = p.verified ? 'rgba(62,155,143,0.9)' : last.price >= prices[0] ? 'rgba(63,160,106,0.4)' : 'rgba(224,92,75,0.4)';
    ctx.fillRect(x - barW / 2, volTop + volH - barH, barW, barH);
    // 波折年份：价格点下方红色下箭头
    if (p.setback && i < points.length - 1) {
      const y = pad.t + priceH * (1 - (p.price - minP) / range);
      ctx.fillStyle = '#e05c4b'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('▼', x, y + 14); ctx.textAlign = 'left';
    }
  });

  const labelStep = Math.max(1, Math.floor(points.length / 8));
  ctx.fillStyle = 'rgba(163,150,132,0.95)'; ctx.font = '11px sans-serif';
  points.forEach((p, i) => {
    if (i % labelStep === 0 || i === points.length - 1) {
      ctx.fillText(p.age + '岁', pad.l + stepX * i - 10, h - pad.b + 20);
    }
  });

  ctx.font = '10px sans-serif';
  ctx.fillStyle = '#ff8a4c'; ctx.fillRect(pad.l + 5, pad.t + 4, 12, 3);
  ctx.fillStyle = '#6f6558'; ctx.fillText('指数', pad.l + 21, pad.t + 8);
  ctx.fillStyle = '#3e9b8f'; ctx.fillRect(pad.l + 50, pad.t + 4, 12, 3);
  ctx.fillStyle = '#6f6558'; ctx.fillText('MA5', pad.l + 66, pad.t + 8);
  ctx.fillStyle = '#e0992f'; ctx.fillRect(pad.l + 105, pad.t + 4, 12, 3);
  ctx.fillStyle = '#6f6558'; ctx.fillText('同龄人', pad.l + 121, pad.t + 8);
  const hasVerified = points.some((p) => p.verified);
  const hasSetback = points.some((p) => p.setback);
  if (hasVerified) {
    ctx.fillStyle = '#3e9b8f'; ctx.fillRect(pad.l + 175, pad.t + 4, 12, 3);
    ctx.fillStyle = '#6f6558'; ctx.fillText('真实数据', pad.l + 191, pad.t + 8);
  }
  if (hasSetback) {
    ctx.fillStyle = '#e05c4b'; ctx.font = '9px sans-serif';
    ctx.fillText('▼', pad.l + (hasVerified ? 250 : 175), pad.t + 8);
    ctx.fillStyle = '#6f6558'; ctx.font = '10px sans-serif';
    ctx.fillText('波折', pad.l + (hasVerified ? 260 : 185), pad.t + 8);
  }

  document.getElementById('klineAge')!.textContent = `（${last.age}岁，当前 ${Math.round(last.price)} 点）`;
}

// ============ 弹窗工具 ============
function createModal(title: string, desc: string): HTMLElement {
  const container = document.getElementById('modalContainer')!;
  container.innerHTML = `<div class="modal-overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal" style="position:relative;">
      <button class="modal-close" onclick="closeModal()">×</button>
      <h2>${title}</h2>
      <p class="modal-desc">${desc}</p>
      <div class="modal-body"></div>
    </div>
  </div>`;
  return container.querySelector('.modal')!;
}

function closeModal() {
  document.getElementById('modalContainer')!.innerHTML = '';
}

function showToast(msg: string) {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.getElementById('toastContainer')!.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

// ============ 各功能弹窗（简化版） ============
function showAnchorModal() {
  if (!user) return;
  const modal = createModal('🎯 校准指数', '用真实数据修正估算，提升指数置信度');
  modal.querySelector('.modal-body')!.innerHTML = `
    <div onclick="closeModal();showSurveyModal()" style="display:flex;align-items:center;gap:10px;padding:12px 14px;margin-bottom:16px;border-radius:12px;background:linear-gradient(135deg,rgba(255,179,107,0.18),rgba(255,138,76,0.12));border:1px solid rgba(255,138,76,0.35);cursor:pointer;">
      <span style="font-size:22px;">📋</span>
      <div style="flex:1;">
        <div style="font-weight:bold;font-size:13.5px;color:var(--accent-deep);">强化调查表（推荐）</div>
        <div style="font-size:12px;color:var(--text-muted);">填写真实教育花费、职业轨迹与大额投入，一次性把整条 K 线校准成你的真实曲线</div>
      </div>
      <span style="color:var(--accent);font-size:16px;">→</span>
    </div>
    <div style="display:grid;grid-template-columns:1fr;gap:16px;">
      <!-- B1-1：单笔投入反推校准 -->
      <div style="padding:12px;background:var(--surface-softer);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">① 用一笔真实投入反推校准</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">输入你印象深刻的某年真实投入，系统按比例校准所有历史估算。</div>
        <div class="form-label">年龄</div>
        <input type="number" id="anchorAge" value="${user.age}" style="width:100%;padding:10px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);margin-bottom:10px;">
        <div class="form-label">该年真实投入（元）</div>
        <input type="number" id="anchorAmount" placeholder="如 30000" style="width:100%;padding:10px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);margin-bottom:10px;">
        <button class="btn-primary" onclick="applyAnchor()" style="width:100%;">应用校准</button>
      </div>

      <!-- B1-2：手动调整家庭支持 -->
      <div style="padding:12px;background:rgba(62,155,143,0.08);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">② 家庭支持（万元，选填）</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">父母/家庭对你的累计投入折算，不折旧、不乘权重，单独计入累计成长值。仅保存在本机。</div>
        <input type="number" id="familyCapital" value="${user.familySupportCapital || 0}" step="1" style="width:100%;padding:10px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);margin-bottom:10px;">
        <button class="btn-primary" onclick="applyFamilyCapital()" style="width:100%;">保存家庭支持</button>
      </div>

      <!-- B1-3：标记"对我影响大"的投入 -->
      <div style="padding:12px;background:rgba(255,138,76,0.08);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">③ 标记"对我影响很大"的投入</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">已记录的自我投入中，标记后会在明细页高亮展示（不改变数值，仅反映主观感知）。</div>
        ${user.investments.length === 0 ? '<div style="font-size:12px;color:var(--text-muted);">暂无手动记录的投入。先去「记一笔」添加吧。</div>' :
          user.investments.map((inv, i) => `
            <label style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--surface-softer);border-radius:8px;margin-bottom:6px;cursor:pointer;">
              <input type="checkbox" id="impact_${i}" ${inv.impact ? 'checked' : ''}>
              <span style="font-size:13px;">${inv.desc || inv.type} · ${inv.amount.toLocaleString()} 元</span>
            </label>
          `).join('')}
        ${user.investments.length > 0 ? '<button class="btn-primary" onclick="applyImpact()" style="width:100%;margin-top:8px;">保存标记</button>' : ''}
      </div>

      <!-- 主观感知权重 -->
      <div style="padding:12px;background:rgba(63,160,106,0.08);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">④ 主观感知权重（${user.subjectiveWeight || 1.0}）</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">你觉得自己的成长值这个权重吗？1.0 为中性，0.5 偏低、1.5 偏高。这是你的主观判断，不影响客观累计成长值。</div>
        <input type="range" id="subjectiveRange" min="0.5" max="1.5" step="0.05" value="${user.subjectiveWeight || 1.0}" style="width:100%;" oninput="document.getElementById('subjVal').textContent=this.value">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);">
          <span>0.5（偏低）</span><span id="subjVal">${user.subjectiveWeight || 1.0}</span><span>1.5（偏高）</span>
        </div>
        <button class="btn-primary" onclick="applySubjective()" style="width:100%;margin-top:10px;">保存主观权重</button>
      </div>
    </div>
  `;
}

(window as any).applySubjective = applySubjective;
function applySubjective() {
  if (!user) return;
  const val = Number((document.getElementById('subjectiveRange') as HTMLInputElement).value);
  user.subjectiveWeight = setSubjectiveWeight(val);
  saveUser(user);
  showDashboard();
  showToast('✅ 主观权重已设为 ' + user.subjectiveWeight);
  closeModal();
}

(window as any).applyFamilyCapital = applyFamilyCapital;
function applyFamilyCapital() {
  if (!user) return;
  const val = Number((document.getElementById('familyCapital') as HTMLInputElement).value);
  user.familySupportCapital = Math.max(0, val);
  saveUser(user);
  showDashboard();
  showToast('✅ 家庭支持已更新');
  closeModal();
}

(window as any).applyImpact = applyImpact;
function applyImpact() {
  if (!user) return;
  user.investments = user.investments.map((inv, i) => {
    const cb = document.getElementById('impact_' + i) as HTMLInputElement;
    return { ...inv, impact: cb?.checked || false };
  });
  saveUser(user);
  showToast('✅ 标记已保存');
  closeModal();
}

(window as any).applyAnchor = applyAnchor;
function applyAnchor() {
  if (!user) return;
  const age = Number((document.getElementById('anchorAge') as HTMLInputElement).value);
  const amount = Number((document.getElementById('anchorAmount') as HTMLInputElement).value);
  const idx = user.history.findIndex(h => h.age === age);
  if (idx >= 0) {
    const ratio = amount / user.history[idx].invest;
    user.history = user.history.map(h => ({ ...h, invest: h.invest * ratio }));
    saveUser(user);
    showDashboard();
    showToast('✅ 校准成功！系数 ' + ratio.toFixed(2));
  }
  closeModal();
}

function showForecastModal() {
  if (!user) return;
  const u = user;
  const base = calculateStock(u).price;
  const simulations = Array.from({ length: 50 }, () => {
    let price = base;
    for (let y = 0; y < 10; y++) {
      const r = 0.12 + (Math.random() - 0.5) * 0.3;
      price *= (1 + r);
    }
    return price;
  }).sort((a, b) => a - b);
  const modal = createModal('🔮 未来展望', '基于假设参数的模拟推演，非预测承诺');
  modal.querySelector('.modal-body')!.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
      <div style="padding:12px;background:rgba(224,92,75,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">保守 (P10)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-red);">${Math.round(simulations[5])} 点</div></div>
      <div style="padding:12px;background:rgba(255,138,76,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">中性 (P50)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-blue);">${Math.round(simulations[25])} 点</div></div>
      <div style="padding:12px;background:rgba(63,160,106,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">乐观 (P90)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-green);">${Math.round(simulations[45])} 点</div></div>
    </div>
    <p style="color:var(--text-muted);font-size:12px;">假设：年化成长12%，波动率15%，持续学习</p>
  `;
}

function showShareModal() {
  if (!user) return;
  const u = user;
  const stock = calculateStock(u);
  // 成长阶段称号（按年龄，无数字）
  const stageTitle =
    u.age < 18 ? '萌芽期' :
    u.age < 23 ? '学生期' :
    u.age < 29 ? '职场初期' :
    u.age < 36 ? '职场上升期' :
    u.age < 46 ? '成熟期' : '从容期';
  // 挑一个最有分量的已达成里程碑（排除出生/入学等年龄自动触发的，优先用户主动达成的）
  const activeMilestones = MILESTONES.filter((m) => m.condition(u));
  const meaningful = activeMilestones.filter((m) =>
    !['birth', 'school', 'middle', 'highschool', '30'].includes(m.id),
  );
  const picked = (meaningful.length > 0 ? meaningful : activeMilestones).slice(-1)[0];
  // 黄历梗：按连续记录 / 状态
  const streak = (() => {
    const dates = new Set<string>();
    (u.journals || []).forEach((j) => dates.add(dayKey(new Date(j.date))));
    (u.investments || []).forEach((inv) => dates.add(dayKey(new Date(inv.date))));
    let s = 0; const d = new Date();
    while (dates.has(dayKey(d))) { s++; d.setDate(d.getDate() - 1); }
    return s;
  })();
  let huangli: string;
  if (picked && streak === 0) huangli = `今日宜庆祝 · ${picked.icon} ${picked.name}`;
  else if (streak >= 7) huangli = `今日宜坚持 · 已连续 ${streak} 天`;
  else if (streak >= 1) huangli = `今日宜投入 · 已连续 ${streak} 天`;
  else if (stock.change < 0) huangli = '今日宜休整 · 退一步是为了喘口气';
  else huangli = '今日宜动笔 · 哪怕只写一句话';

  const modal = createModal('📤 分享', '生成一张不暴露数字的成长卡片');
  modal.querySelector('.modal-body')!.innerHTML = `
    <div style="background:linear-gradient(160deg,#FFE8D6 0%,#FFD9BE 40%,#FFC9A8 100%);padding:28px 24px;border-radius:20px;text-align:center;color:#4A3B2A;box-shadow:0 16px 40px rgba(255,138,76,0.28);max-width:360px;margin:0 auto;aspect-ratio: 9/16;display:flex;flex-direction:column;justify-content:space-between;">
      <div>
        <div style="font-size:13px;color:#A8734D;letter-spacing:3px;font-weight:600;">今日宜长进</div>
        <div style="font-size:11px;color:#C9936A;margin-top:4px;letter-spacing:1px;">成长指数手账</div>
      </div>

      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:18px;">
        <div style="font-size:56px;line-height:1;">${u.avatar || '🌱'}</div>
        <div>
          <div style="font-size:12px;color:#A8734D;margin-bottom:6px;">我的成长阶段</div>
          <div style="font-size:30px;font-weight:bold;color:#4A3B2A;letter-spacing:2px;">${stageTitle}</div>
        </div>
        <div style="background:rgba(255,255,255,0.5);border-radius:14px;padding:14px 16px;margin:0 10px;">
          <div style="font-size:12px;color:#A8734D;margin-bottom:6px;">已达成的长进</div>
          <div style="font-size:18px;font-weight:600;color:#4A3B2A;">
            ${picked ? `${picked.icon} ${picked.name}` : '正在路上'}
          </div>
          ${activeMilestones.length > 1 ? `<div style="font-size:11px;color:#A8734D;margin-top:6px;">还有 ${activeMilestones.length - 1} 个里程碑静静发光</div>` : ''}
        </div>
        <div style="background:rgba(91,154,111,0.12);border-radius:12px;padding:12px 16px;margin:0 10px;border:1px dashed rgba(91,154,111,0.4);">
          <div style="font-size:15px;font-weight:600;color:#5B9A6F;">${huangli}</div>
        </div>
      </div>

      <div>
        <div style="font-size:11px;color:#A8734D;line-height:1.7;">成长没有标准答案<br>每一步都算数</div>
        <div style="font-size:9px;color:#C9936A;margin-top:8px;">本卡片不包含任何个人数值 · 仅供自我观察</div>
      </div>
    </div>
    <div style="text-align:center;margin-top:14px;font-size:12px;color:var(--text-muted);">长按或截图即可保存分享</div>
  `;
}

function showSetbackModal() {
  const modal = createModal('💥 记录一段波折', '成长有快有慢。记下它，我们会陪你制定一份恢复期行动清单');
  modal.querySelector('.modal-body')!.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
      ${[
        { t: 'jobloss', i: '💼', n: '工作变动', d: '降薪/失业' },
        { t: 'illness', i: '🏥', n: '健康风波', d: '身体亮红灯' },
        { t: 'loss', i: '🌧️', n: '失去与回落', d: '积累暂时放缓' },
        { t: 'stagnate', i: '🪫', n: '躺平/断更', d: '暂时停了下来' },
      ].map(s => `<div class="setback-type" data-type="${s.t}" onclick="selectSetback('${s.t}')" style="padding:12px;background:var(--surface-softer);border-radius:10px;cursor:pointer;text-align:center;"><div style="font-size:24px">${s.i}</div><div style="font-weight:bold;margin-top:4px">${s.n}</div><div style="font-size:11px;color:var(--text-muted)">${s.d}</div></div>`).join('')}
    </div>
    <input type="range" id="setbackSeverity" min="1" max="10" value="5" style="width:100%;accent-color:#C9936A;">
    <div style="text-align:center;color:var(--text-secondary);margin:8px 0;">影响程度：<span id="severityVal">5</span> / 10</div>
    <div style="font-size:12px;color:var(--text-muted);background:var(--surface-softer);border-radius:10px;padding:10px;margin-bottom:14px;line-height:1.7;">记录后不会只看到数字回落——你会立即得到 <b>1 个 60 秒能做的小行动</b> 和一份 <b>7 天恢复期清单</b>，勾选完成即可看到回暖。</div>
    <div class="form-actions"><button class="btn-primary" style="background:linear-gradient(135deg,#C9936A,#A8734D);" onclick="applySetback()">记录并生成恢复计划</button></div>
  `;
  (document.getElementById('setbackSeverity') as HTMLInputElement).oninput = (e) => {
    document.getElementById('severityVal')!.textContent = (e.target as HTMLInputElement).value;
  };
}
let selectedSetback = '';
(window as any).selectSetback = (t: string) => {
  selectedSetback = t;
  document.querySelectorAll('.setback-type').forEach((el) => {
    (el as HTMLElement).style.outline = (el as HTMLElement).dataset.type === t ? '2px solid #C9936A' : 'none';
  });
};
(window as any).applySetback = applySetback;
function applySetback() {
  if (!user || !selectedSetback) { showToast('先选一个最接近的类型吧'); return; }
  const factor = Number((document.getElementById('setbackSeverity') as HTMLInputElement).value) / 10;
  const before = calculateStock(user).price;
  if (selectedSetback === 'jobloss') {
    user.annualIncome = Math.max(0, user.annualIncome * (1 - 0.3 * factor));
    user.annualIncomeGrowth = -0.1;
  } else if (selectedSetback === 'illness') {
    user.healthScore = Math.max(20, user.healthScore - 30 * factor);
    user.debtRatio = Math.min(0.8, user.debtRatio + 0.2 * factor);
  } else if (selectedSetback === 'loss') {
    const loss = user.totalInvest * 0.15 * factor;
    user.totalInvest = Math.max(0, user.totalInvest - loss);
    user.history = user.history.map(h => ({ ...h, invest: h.invest * (1 - 0.15 * factor) }));
  } else if (selectedSetback === 'stagnate') {
    user.studyHours = Math.max(0, user.studyHours - 2 * factor);
  }
  // 生成恢复计划（P0-1：调研 Q5 挫折修复 74.5% 第一刚需）
  const plan = createRecoveryPlan(selectedSetback as SetbackKind, Math.round(factor * 10), before);
  user = upsertRecoveryPlan(user, plan);
  saveUser(user);
  showRecoveryPlanModal(plan.id, before);
  showDashboard();
}

// ============ 恢复计划弹窗 ============
const SETBACK_TITLES: Record<SetbackKind, string> = {
  jobloss: '💼 工作变动恢复期', illness: '🏥 健康恢复期',
  loss: '🌧️ 回落调整期', stagnate: '🪫 重新启动期',
};
(window as any).showRecoveryPlanModal = (id?: string) => { if (user) showRecoveryPlanModal(id); };
(window as any).toggleRecoveryInstant = (id: string) => { if (user) toggleRecoveryInstant(id); };
(window as any).toggleRecoveryTaskItem = (planId: string, taskId: string) => {
  if (user) toggleRecoveryTaskItem(planId, taskId);
};

function showRecoveryPlanModal(planId?: string, beforePrice?: number) {
  if (!user) return;
  const u = user;
  const plan = (u.recoveryPlans || []).slice().reverse().find((p) => p.id === planId)
    || getActiveRecoveryPlan(u)
    || (u.recoveryPlans || [])[u.recoveryPlans!.length - 1];
  if (!plan) return;
  const kit = getRecoveryKit(plan.setbackType);
  const after = calculateStock(u).price;
  const prog = getRecoveryProgress(plan);
  const modal = createModal(SETBACK_TITLES[plan.setbackType] || '🌱 恢复期', kit.empathy);
  const delta = after - plan.indexBefore;
  modal.querySelector('.modal-body')!.innerHTML = `
    <div style="display:flex;gap:10px;align-items:center;padding:12px 14px;background:var(--surface-softer);border-radius:12px;margin-bottom:14px;">
      <div style="font-size:22px">${delta >= 0 ? '🌤️' : '🌧️'}</div>
      <div style="flex:1;">
        <div style="font-size:12px;color:var(--text-muted);">记录时成长指数</div>
        <div style="font-weight:bold;font-size:15px;">${plan.indexBefore.toFixed(0)} 点 <span style="color:var(--text-muted);font-weight:normal;font-size:12px;">→ 此刻 ${after.toFixed(0)} 点</span></div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:12px;color:var(--text-muted);">恢复进度</div>
        <div style="font-weight:bold;color:#C9936A;">${prog.done}/${prog.total}</div>
      </div>
    </div>
    <div style="height:8px;background:var(--surface-softer);border-radius:99px;overflow:hidden;margin-bottom:16px;">
      <div style="height:100%;width:${prog.pct}%;background:linear-gradient(90deg,#E8B88A,#5B9A6F);border-radius:99px;transition:width .4s;"></div>
    </div>

    <div style="font-size:13px;font-weight:bold;margin-bottom:8px;">⏱️ 现在就做（60 秒）</div>
    <div onclick="toggleRecoveryInstant('${plan.id}')" style="display:flex;gap:10px;align-items:flex-start;padding:14px;border-radius:12px;margin-bottom:16px;cursor:pointer;border:1.5px solid ${plan.instantDone ? '#5B9A6F' : 'rgba(201,147,106,0.45)'};background:${plan.instantDone ? 'rgba(91,154,111,0.10)' : 'rgba(255,138,76,0.06)'};">
      <div style="width:22px;height:22px;border-radius:50%;border:2px solid ${plan.instantDone ? '#5B9A6F' : '#C9936A'};flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#5B9A6F;font-size:13px;font-weight:bold;">${plan.instantDone ? '✓' : ''}</div>
      <div style="flex:1;">
        <div style="font-size:13.5px;line-height:1.7;${plan.instantDone ? 'text-decoration:line-through;color:var(--text-muted);' : ''}">${esc(plan.instantText)}</div>
        ${plan.instantDone ? `<div style="font-size:12px;color:#5B9A6F;margin-top:6px;">${esc(kit.instantCheer)}</div>` : '<div style="font-size:11px;color:var(--text-muted);margin-top:6px;">点一下这个卡片，做完就打勾</div>'}
      </div>
    </div>

    <div style="font-size:13px;font-weight:bold;margin-bottom:8px;">🌱 接下来的恢复期（按自己的节奏来）</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
      ${plan.tasks.map((t) => `
        <div onclick="toggleRecoveryTaskItem('${plan.id}','${t.id}')" style="display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border-radius:10px;cursor:pointer;background:var(--surface-softer);">
          <div style="width:20px;height:20px;border-radius:6px;border:2px solid ${t.done ? '#5B9A6F' : '#D9C7A8'};flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;background:${t.done ? '#5B9A6F' : 'transparent'};">${t.done ? '✓' : ''}</div>
          <div style="flex:1;font-size:13px;line-height:1.6;${t.done ? 'text-decoration:line-through;color:var(--text-muted);' : ''}">${esc(t.text)}</div>
          <div style="font-size:11px;color:var(--text-muted);flex-shrink:0;">D${t.day}</div>
        </div>`).join('')}
    </div>

    ${prog.finished ? `<div style="padding:14px;border-radius:12px;background:linear-gradient(135deg,rgba(91,154,111,0.14),rgba(255,138,76,0.10));font-size:13.5px;line-height:1.8;margin-bottom:14px;">🎉 ${esc(kit.completeCheer)}</div>` : ''}
    <div class="form-actions">
      <button class="dash-btn" onclick="closeModal()">今天先到这里</button>
      <button class="btn-primary" onclick="closeModal()">我会慢慢做完</button>
    </div>
  `;
  if (beforePrice !== undefined && delta < 0) {
    showToast(`成长指数 ${beforePrice.toFixed(0)} → ${after.toFixed(0)}，退一步是为了喘口气`);
  }
}

function toggleRecoveryInstant(planId: string) {
  if (!user) return;
  const plans = user.recoveryPlans || [];
  const p = plans.find((x) => x.id === planId);
  if (!p) return;
  const next = toggleInstant(p);
  user = upsertRecoveryPlan(user, next);
  saveUser(user);
  const wasFinished = !!next.completedAt;
  showRecoveryPlanModal(planId);
  renderRecoveryBanner(user);
  if (next.instantDone) showToast('🌱 这一步做完，恢复就开始了');
  if (wasFinished) celebrateRecovery();
}

function toggleRecoveryTaskItem(planId: string, taskId: string) {
  if (!user) return;
  const plans = user.recoveryPlans || [];
  const p = plans.find((x) => x.id === planId);
  if (!p) return;
  const wasFinished = !!p.completedAt;
  const next = toggleRecoveryTask(p, taskId);
  user = upsertRecoveryPlan(user, next);
  saveUser(user);
  showRecoveryPlanModal(planId);
  renderRecoveryBanner(user);
  if (!wasFinished && next.completedAt) celebrateRecovery();
}

function celebrateRecovery() {
  // 完成恢复计划：给一笔 0 元健康/自我关怀投入，让回暖在曲线上也被看见
  if (!user) return;
  showToast('🎉 恢复期任务全部完成，欢迎回到上坡路');
}

function showDetailModal() {
  if (!user) return;
  const u = user;
  const stock = calculateStock(u);
  const stageCoef = getStageCoef(u.age);
  const achieved = MILESTONES.filter(m => m.condition(u));
  const bvByType: Record<string, number> = {};
  u.history.forEach(h => {
    const w = Constants.TYPE_WEIGHTS[h.type] || 1;
    const val = (h.invest / 10000) * w * decay(1, Math.max(0, u.age - h.age), h.type);
    bvByType[h.type] = (bvByType[h.type] || 0) + val;
  });
  const typeNames: Record<string, string> = { education: '教育', skill: '技能', health: '健康', network: '人脉', entertainment: '娱乐', other: '其他' };
  // A1/A2：估算区间与数据来源
  const src = DATA_SOURCES.education_cost;
  const ageRangeKeys = Object.keys(Constants.AGE_SPEND_RANGE);
  const modal = createModal('📋 计算明细', '看清每一个数字的来龙去脉');
  modal.querySelector('.modal-body')!.innerHTML = `
    <div style="font-family:monospace;font-size:13px;line-height:2;">
      <div style="padding:12px;background:rgba(255,138,76,0.1);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;color:var(--accent-blue);margin-bottom:8px;">📐 计算公式</div>
        <div style="color:var(--text-secondary)">成长指数 = (100 + 累计成长值 × 阶段系数 + min(里程碑加成,200)) × 成长系数 × 质量系数 × (1 - 风险折扣) × 主观调整</div>
      </div>
      <div style="padding:12px;background:var(--surface-softer);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;margin-bottom:8px;">② 累计成长值 = ${stock.bv.toFixed(2)}（单位：万元口径）</div>
        ${Object.entries(bvByType).map(([t, v]) => `<div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">${typeNames[t] || t}</span><span>${v.toFixed(2)}</span></div>`).join('')}
        ${u.familySupportCapital ? `<div style="display:flex;justify-content:space-between;color:var(--accent-purple);"><span>家庭支持（不折旧）</span><span>${u.familySupportCapital}</span></div>` : ''}
        <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px;font-weight:bold;">成长值 × 阶段系数 = ${stock.bv.toFixed(2)} × ${stageCoef.toFixed(2)} = ${(stock.bv * stageCoef).toFixed(2)}</div>
      </div>

      <!-- A1：数据溯源卡片 -->
      <div style="padding:12px;background:rgba(224,153,47,0.06);border:1px solid rgba(224,153,47,0.2);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;color:var(--accent-yellow);margin-bottom:8px;">🔍 历史投入估算 · 数据溯源</div>
        <div style="font-size:12px;color:var(--text-secondary);line-height:1.8;">
          <div><strong>数据来源：</strong>${src.name}（${src.year}）</div>
          <div><strong>原始口径：</strong>${src.caliber}</div>
          <div><strong>调整系数：</strong>地区 ${Constants.REGION_COEF[u.region]} × 城乡 ${Constants.AREA_COEF[u.area]} × 收入 ${Constants.INCOME_COEF[u.income]}</div>
        </div>
        <!-- A2：参考区间，替代"±4%精度" -->
        <div style="margin-top:10px;padding:10px;background:var(--surface-softer);border-radius:8px;">
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">📊 各阶段年均教育投入参考区间（元）：</div>
          ${ageRangeKeys.map(k => {
            const r = Constants.AGE_SPEND_RANGE[k];
            return `<div style="display:flex;justify-content:space-between;font-size:12px;"><span style="color:var(--text-secondary)">${k}岁</span><span>${r.low.toLocaleString()} ~ ${r.mid.toLocaleString()} ~ ${r.high.toLocaleString()}</span></div>`;
          }).join('')}
          <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">以上为统计估算区间，非精确值。点击「校准指数」可修正为你的真实投入。</div>
        </div>
      </div>

      <div style="padding:12px;background:var(--surface-softer);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;margin-bottom:8px;">③ 里程碑加成 = ${stock.milestoneBonus}（封顶 200）</div>
        ${achieved.map(m => `<div style="font-size:12px;color:var(--text-secondary)">${m.icon} ${m.name} +${m.bonus}</div>`).join('')}
      </div>
      <div style="padding:12px;background:var(--surface-softer);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;margin-bottom:8px;">④ 系数</div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">成长系数</span><span>${stock.growthCoef}</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">质量系数（健康${stock.effectiveHealth}）</span><span>${stock.qualityCoef}</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">风险折扣（负债率${(u.debtRatio*100).toFixed(0)}%）</span><span>${stock.riskDiscount}</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">主观感知权重</span><span>${stock.subjectiveAdjust}</span></div>
      </div>

      <!-- 归因分析 -->
      <div style="padding:12px;background:rgba(255,138,76,0.06);border:1px solid rgba(255,138,76,0.2);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;color:var(--accent-blue);margin-bottom:8px;">📊 指数归因 · 每个因子贡献了多少</div>
        ${(() => {
          const items = calcAttribution(u, stock);
          const top = getTopContributor(items);
          return items.map(item => {
            const isMultiplier = item.contribution === 0;
            return `<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid var(--surface-soft);">
              <span style="color:var(--text-secondary);font-size:12px;">${item.name}</span>
              <span style="font-size:12px;">${isMultiplier ? item.reason : `<strong>+${item.contribution}</strong> · ${item.reason}`}</span>
            </div>`;
          }).join('') +
          (top ? `<div style="margin-top:8px;padding:8px;background:rgba(63,160,106,0.08);border-radius:8px;font-size:12px;color:var(--accent-green);">⭐ 最大贡献：${top.name}（+${top.contribution}点）</div>` : '');
        })()}
      </div>

      <div style="padding:16px;background:linear-gradient(135deg,rgba(255,138,76,0.2),rgba(62,155,143,0.2));border-radius:12px;text-align:center;">
        <div style="color:var(--text-secondary);font-size:12px;">此刻的成长指数</div>
        <div style="font-size:32px;font-weight:bold;color:var(--accent-blue);">${Math.round(stock.price)} 点</div>
      </div>
    </div>
    <div style="margin-top:16px;padding:12px;background:rgba(224,153,47,0.08);border-radius:10px;font-size:12px;color:var(--text-secondary);line-height:1.6;">
      温馨提示：以上数值基于模型估算，仅供自我观察与娱乐参考，不构成理财、职业或心理建议，也不预测未来收入。<br>
      本指数<strong>不衡量</strong>幸福感、关系质量、心理健康、创造力与社会贡献——成长没有标准曲线。
    </div>
  `;
}

function showParentModal() {
  if (!user) return;
  const parentInvest = user.history.reduce((s, h) => s + h.invest, 0);
  const selfInvest = user.investments.reduce((s, i) => s + i.amount, 0);
  const total = parentInvest + selfInvest;
  const stock = calculateStock(user);
  const modal = createModal('👨‍👩‍👧 家庭视角', '家人的每一份支持，都是你成长的底气');
  modal.querySelector('.modal-body')!.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
      <div style="padding:14px;background:rgba(62,155,143,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">家庭支持</div><div style="font-size:20px;font-weight:bold;color:var(--accent-purple);">${parentInvest.toLocaleString()} 元</div></div>
      <div style="padding:14px;background:rgba(251,146,60,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">自我投入</div><div style="font-size:20px;font-weight:bold;color:#ff8a4c;">${selfInvest.toLocaleString()} 元</div></div>
    </div>
    <div style="height:20px;background:var(--surface-soft);border-radius:10px;overflow:hidden;display:flex;">
      <div style="width:${(parentInvest / total * 100)}%;background:var(--accent-purple);"></div>
      <div style="width:${(selfInvest / total * 100)}%;background:#ff8a4c;"></div>
    </div>
    <div style="margin-top:16px;padding:14px;background:rgba(63,160,106,0.1);border-radius:12px;font-size:13px;color:var(--text-secondary);line-height:1.7;">
      💡 当前 ${user.age} 岁，成长指数已从基准 100 走到 ${Math.round(stock.price)} 点。<br>
      ${selfInvest === 0 ? '⚠️ 还没有记录自我投入，试试"记一笔"吧！' : '继续加油，每一笔自我投入都在为成长添砖加瓦。'}
    </div>
  `;
}

function editProfile() {
  showToast('请重置后重新填写问卷（投入记录会保留）');
}

function resetAll() {
  if (confirm('确定要重置所有数据吗？')) {
    clearUser();
    user = null;
    quickNudgeDismissed = false;
    recallDismissed = false;
    document.getElementById('dashboard')?.classList.add('hidden');
    document.getElementById('landing')?.classList.remove('hidden');
  }
}

// ============ 种子体验官邀请码 ============
(window as any).showSeedModal = showSeedModal;
function showSeedModal() {
  if (!user) return;
  const modal = createModal('🎟️ 首批内测体验官', '邀请码来自内测邀请通知，仅 5 个名额');
  if (user.seedTester) {
    const date = user.seedActivatedAt
      ? new Date(user.seedActivatedAt).toLocaleDateString('zh-CN')
      : '';
    modal.querySelector('.modal-body')!.innerHTML = `
      <div style="text-align:center;padding:8px 0;">
        <div style="font-size:48px;margin-bottom:8px;">🌱</div>
        <div style="font-size:20px;font-weight:bold;margin-bottom:4px;">种子体验官</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;">邀请码 ${user.seedCode}${date ? ` · ${date} 激活` : ''}</div>
        <div style="background:linear-gradient(135deg,rgba(91,154,111,0.10),rgba(255,138,76,0.08));border-radius:12px;padding:14px;font-size:13px;color:var(--text-secondary);line-height:1.8;text-align:left;margin-bottom:16px;">
          谢谢你陪「今日宜长进」长大 🙏<br>
          体验 3~5 天后，欢迎花 3 分钟告诉我们哪里顺手、哪里别扭——你的每条意见都会直接影响下一个版本（包括微信小程序的开发优先级）。
        </div>
        <div class="form-actions">
          <a class="btn-primary" href="${FEEDBACK_URL}" target="_blank" rel="noopener" style="text-decoration:none;display:inline-flex;align-items:center;justify-content:center;">💌 填写反馈问卷</a>
        </div>
      </div>`;
    return;
  }
  modal.querySelector('.modal-body')!.innerHTML = `
    <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;margin-bottom:14px;">
      如果你收到了内测邀请通知，在下方输入专属邀请码即可激活。激活后你的身份仅保存在本机，不会上传任何信息。
    </div>
    <input type="text" id="seedCodeInput" placeholder="如 GROWTH-01"
           style="width:100%;padding:12px 14px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);font-size:16px;letter-spacing:1px;text-transform:uppercase;"
           onkeydown="if(event.key==='Enter')redeemCode()">
    <div id="seedCodeError" style="font-size:12.5px;color:var(--accent-red);margin-top:8px;min-height:18px;"></div>
    <div class="form-actions"><button class="btn-primary" onclick="redeemCode()">激活</button></div>`;
  setTimeout(() => (document.getElementById('seedCodeInput') as HTMLInputElement)?.focus(), 100);
}

(window as any).redeemCode = redeemCode;
function redeemCode() {
  if (!user) return;
  const raw = (document.getElementById('seedCodeInput') as HTMLInputElement).value;
  const result = redeemSeedCode(user, raw);
  const errEl = document.getElementById('seedCodeError');
  if (!result.ok) {
    if (errEl) {
      errEl.textContent = result.reason === 'empty' ? '请输入邀请码'
        : result.reason === 'invalid' ? '邀请码不对哦，检查一下大小写～（格式如 GROWTH-01）'
        : '你已经是种子体验官啦 🌱';
    }
    return;
  }
  user = result.user;
  saveUser(user);
  closeModal();
  showDashboard();
  showToast('🌱 激活成功，欢迎成为种子体验官！');
  setTimeout(() => showSeedModal(), 500);
}

// ============ 隐私政策 / 用户协议 ============
const LEGAL_EFFECTIVE_DATE = '2026-06-01';

const PRIVACY_POLICY_HTML = `
  <div style="font-size:13px;color:var(--text-secondary);line-height:1.9;text-align:left;">
    <p style="color:var(--text-muted);">生效日期：${LEGAL_EFFECTIVE_DATE}。最近更新：${LEGAL_EFFECTIVE_DATE}。</p>
    <p><strong>一、我们是谁</strong><br>「今日宜长进」（成长指数手账）是一款个人成长记录与自我反思工具，本应用没有后端服务器。</p>
    <p><strong>二、我们收集的信息</strong><br>1. <strong>基础成长信息</strong>：年龄、所在地区、家庭条件区间、学历、学习时长、健康自评、人生节点等，用于生成成长曲线。<br>
    2. <strong>敏感信息（需你单独勾选同意）</strong>：年收入、收入增长、负债情况、家庭支持金额、每笔花费的具体金额。这些信息属于敏感个人信息，仅在你单独勾选「同意收集敏感信息」后才会被记录。</p>
    <p><strong>三、信息存储与使用</strong><br>所有信息默认仅保存在你当前设备的浏览器本地存储（localStorage）中，<strong>不会上传到任何服务器</strong>，本应用不提供账号体系与云端同步。信息仅用于在你本机计算成长指数、绘制成长曲线与生成本地周报。</p>
    <p><strong>四、拒绝授权的影响</strong><br>你可以拒绝提供敏感信息，应用仍可正常使用：收入、负债与金额类字段将使用通用估算值（估算占比会在页面如实标注），你也可以随时改主意并在重新进入时补充真实信息。</p>
    <p><strong>五、未成年人</strong><br>若你未满 14 周岁，请在监护人陪同与同意后使用本应用并填写信息。</p>
    <p><strong>六、如何删除信息</strong><br>你可在「设置」中使用「删除全部数据」一键清除本机所有数据；也可以直接清除浏览器站点数据。删除后数据无法恢复。</p>
    <p><strong>七、联系我们</strong><br>如对本政策有疑问，可通过应用仓库的 Issue 渠道反馈。</p>
  </div>`;

const TERMS_HTML = `
  <div style="font-size:13px;color:var(--text-secondary);line-height:1.9;text-align:left;">
    <p style="color:var(--text-muted);">生效日期：${LEGAL_EFFECTIVE_DATE}。</p>
    <p><strong>一、服务性质</strong><br>「今日宜长进」是个人成长记录与自我反思工具，<strong>不是</strong>金融理财、证券投资、职业咨询、医疗健康或心理咨询服务。成长指数（单位：点）为模型估算数值，仅供娱乐与自我观察。</p>
    <p><strong>二、不构成专业建议</strong><br>应用内的指数、曲线、周报、伙伴对话等内容均由本地规则/模板基于你填写的信息生成，不构成任何理财、证券、职业规划、医疗或心理建议，<strong>不得用于任何投资决策</strong>，也不预测你的未来收入。模型存在误差，页面会标注估算成分与置信度。</p>
    <p><strong>三、情绪与健康提示</strong><br>应用内容不能替代专业心理咨询或医疗诊断。如果你正经历严重的情绪困扰，请及时联系专业人士或拨打心理援助热线（如全国心理援助热线 12356）。</p>
    <p><strong>四、你的内容与数据</strong><br>你填写的所有内容均保存在你的设备本地，由你自行负责保管与备份。导出、分享或在公共设备使用后，请自行删除数据。</p>
    <p><strong>五、合理使用</strong><br>请勿利用本应用从事违法违规活动，或以本应用输出冒充专业意见对外传播。</p>
    <p><strong>六、免责与争议</strong><br>在法律允许的最大范围内，我们不对你因使用或无法使用本应用而产生的间接损失承担责任。与本协议相关的争议，双方应友好协商解决；协商不成的，适用中华人民共和国法律。</p>
  </div>`;

function showLegalModal(type: 'privacy' | 'terms') {
  const isPrivacy = type === 'privacy';
  const modal = createModal(
    isPrivacy ? '🔒 隐私政策' : '📜 用户协议',
    isPrivacy ? '请仔细阅读，重点内容已加粗' : '使用本应用前请知悉',
  );
  modal.style.maxWidth = '560px';
  modal.querySelector('.modal-body')!.innerHTML = isPrivacy ? PRIVACY_POLICY_HTML : TERMS_HTML;
  // 允许在隐私同意弹窗之上打开
  const overlay = modal.parentElement as HTMLElement | null;
  if (overlay) overlay.style.zIndex = '10001';
}

// ============ 初始化 ============
function init() {
  // 首次启动：隐私授权（基础数据 + 敏感信息单独勾选）
  if (!isPrivacyConsented()) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal" style="max-width:500px;">
      <h2>🔒 隐私保护指引</h2>
      <div style="color:var(--text-secondary);line-height:1.9;margin:16px 0;text-align:left;font-size:14px;">
        <p>欢迎使用「今日宜长进」。在开始前，请阅读并选择你授权的范围：</p>
        <label style="display:flex;gap:10px;align-items:flex-start;padding:12px;background:var(--surface-softer);border-radius:10px;margin:10px 0;cursor:pointer;">
          <input type="checkbox" id="consentBase" style="margin-top:3px;">
          <span>我已阅读并同意 <a href="javascript:void(0)" id="linkPrivacy1" style="color:var(--accent-blue);text-decoration:underline;">《隐私政策》</a> 与 <a href="javascript:void(0)" id="linkTerms1" style="color:var(--accent-blue);text-decoration:underline;">《用户协议》</a>，并同意在本机保存年龄、地区、学习、健康自评等<strong>基础成长信息</strong>（不上传服务器）。</span>
        </label>
        <label style="display:flex;gap:10px;align-items:flex-start;padding:12px;background:rgba(255,138,76,0.08);border:1px solid rgba(255,138,76,0.3);border-radius:10px;margin:10px 0;cursor:pointer;">
          <input type="checkbox" id="consentSensitive" style="margin-top:3px;">
          <span><strong>（选填）</strong>我单独同意收集<strong style="color:var(--accent-orange);">敏感信息</strong>：年收入、负债情况、家庭支持金额、每笔花费金额。不勾选也能正常使用，相关字段将使用通用估算值并如实标注。</span>
        </label>
        <p style="font-size:12px;color:var(--text-muted);">你可随时在「设置 → 删除全部数据」中清除全部本机数据。未满 14 周岁请在监护人同意后使用。</p>
        <p style="margin-top:10px;padding:12px;background:var(--surface-softer);border-radius:8px;font-size:12px;">
          ⚠️ 本应用为个人成长记录与自我反思工具，数值均为模型估算，<strong>仅供娱乐与自我观察，不构成理财、职业或心理建议，也不预测收入</strong>。
        </p>
      </div>
      <div class="form-actions"><button class="btn-primary" id="consentPrivacy">继续</button></div>
    </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector<HTMLAnchorElement>('#linkPrivacy1')!.onclick = () => showLegalModal('privacy');
    overlay.querySelector<HTMLAnchorElement>('#linkTerms1')!.onclick = () => showLegalModal('terms');
    const btn = overlay.querySelector<HTMLButtonElement>('#consentPrivacy')!;
    btn.onclick = () => {
      if (!overlay.querySelector<HTMLInputElement>('#consentBase')!.checked) {
        showToast('请先勾选并同意《隐私政策》与《用户协议》');
        return;
      }
      setPrivacyConsent();
      setSensitiveConsent(overlay.querySelector<HTMLInputElement>('#consentSensitive')!.checked);
      overlay.remove();
      showDisclaimerIfNeeded();
    };
    return; // 等待用户同意后再继续
  }
  showDisclaimerIfNeeded();
}

function showDisclaimerIfNeeded() {
  if (!isDisclaimerConfirmed()) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal" style="max-width:480px;">
      <h2>⚠️ 温馨提示</h2>
      <p style="color:var(--text-secondary);line-height:1.9;margin:16px 0;">
        「今日宜长进」是一款<strong>个人成长记录与自我反思工具</strong>，所有数值均为模型估算，<strong style="color:var(--accent-yellow)">仅供娱乐与自我观察，不构成理财、职业或心理建议，也不预测收入</strong>。<br><br>
        今日宜长进，成长没有标准曲线。
      </p>
      <div class="form-actions"><button class="btn-primary" id="confirmDisclaimer">我知道了</button></div>
    </div>`;
    document.body.appendChild(overlay);
    document.getElementById('confirmDisclaimer')!.onclick = () => {
      confirmDisclaimer();
      overlay.remove();
      loadSavedUser();
    };
  } else {
    loadSavedUser();
  }
}

function loadSavedUser() {
  const saved = loadUser();
  if (saved) {
    user = saved;
    showDashboard();
  }
}

// F12：删除全部数据
function handleDeleteAllData() {
  if (!confirm('确定要删除全部数据吗？此操作不可恢复。')) return;
  deleteAllData();
  user = null;
  document.getElementById('dashboard')?.classList.add('hidden');
  document.getElementById('landing')?.classList.remove('hidden');
  showToast('✅ 全部数据已删除');
}

// ============ 一句话记录 ============
let selectedMood: 'great' | 'good' | 'ok' | 'low' | undefined;
(window as any).setJournalMood = setJournalMood;
function setJournalMood(mood: 'great' | 'good' | 'ok' | 'low') {
  selectedMood = selectedMood === mood ? undefined : mood;
  document.querySelectorAll('.mood-btn').forEach((el) => {
    el.classList.toggle('selected', el.getAttribute('data-mood') === selectedMood);
  });
}

(window as any).addJournal = addJournal;
function addJournal() {
  if (!user) return;
  const input = document.getElementById('journalInput') as HTMLInputElement;
  const content = input.value.trim();
  if (!content) { showToast('请输入内容'); return; }
  const entry = createJournal(content, selectedMood);
  user = addJournalEntry(user, entry);
  input.value = '';
  selectedMood = undefined;
  document.querySelectorAll('.mood-btn').forEach((el) => el.classList.remove('selected'));
  saveUser(user);
  renderJournals(user);
  renderWeeklyStatus(user);
  showToast('✅ 已记录');
}

function renderJournals(u: UserProfile) {
  const list = document.getElementById('recentJournals');
  if (!list) return;
  const recent = getRecentJournals(u, 8);
  if (recent.length === 0) {
    list.innerHTML = '<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:10px;">还没有记录，写下此刻的想法吧</div>';
    return;
  }
  const moodIcon: Record<string, string> = { great: '😄', good: '🙂', ok: '😐', low: '😔' };
  list.innerHTML = recent.map((j) => `
    <div class="journal-item">
      <span class="j-mood">${j.mood ? moodIcon[j.mood] : '📝'}</span>
      <div class="j-content">
        <div>${j.content}</div>
        <div class="j-date">${new Date(j.date).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    </div>
  `).join('');
}

// ============ 每周一笔 ============
function renderWeeklyStatus(u: UserProfile) {
  const status = getWeeklyStatus(u);
  const badge = document.getElementById('weeklyBadge');
  const tip = document.getElementById('weeklyTip');
  if (badge) badge.textContent = status.streakWeeks > 0 ? `🔥 连续 ${status.streakWeeks} 周` : '';
  if (tip) tip.textContent = status.message;

  // P1-4 每周变化正反馈：本周 vs 上周记录笔数对比，只给正向/鼓励性反馈
  const fb = document.getElementById('weeklyFeedback');
  if (fb) {
    const weekStart = (() => { const d = new Date(); const day = d.getDay(); const diff = day === 0 ? -6 : 1 - day; d.setDate(d.getDate() + diff); d.setHours(0,0,0,0); return d; })();
    const lastStart = new Date(weekStart); lastStart.setDate(weekStart.getDate() - 7);
    const inRange = (d: Date, s: Date, e: Date) => { const t = new Date(d).getTime(); return t >= s.getTime() && t < e.getTime(); };
    const countIn = (s: Date, e: Date) => {
      let c = 0;
      (u.journals || []).forEach((j) => { if (inRange(new Date(j.date), s, e)) c++; });
      (u.investments || []).forEach((inv) => { if (inRange(new Date(inv.date), s, e)) c++; });
      return c;
    };
    const thisWeek = countIn(weekStart, new Date(weekStart.getTime() + 7*86400000));
    const lastWeek = countIn(lastStart, weekStart);
    let msg: string, color: string;
    if (lastWeek === 0 && thisWeek > 0) {
      msg = `🌱 这周已经动笔 ${thisWeek} 次，比上周更在状态了`;
      color = 'var(--accent-green)';
    } else if (thisWeek > lastWeek) {
      msg = `📈 本周 ${thisWeek} 次记录，比上周多 ${thisWeek - lastWeek} 次，稳稳向上`;
      color = 'var(--accent-green)';
    } else if (thisWeek === lastWeek && thisWeek > 0) {
      msg = `🌤️ 本周 ${thisWeek} 次记录，和上周一样稳，保持也是一种前进`;
      color = 'var(--accent-yellow)';
    } else if (thisWeek === 0 && lastWeek > 0) {
      msg = `☕ 这周还没动笔，上周有 ${lastWeek} 次——今天写一句就好`;
      color = 'var(--accent-orange)';
    } else {
      msg = `✍️ 写下第一句，本周的成长山坡就开始了`;
      color = 'var(--accent-orange)';
    }
    fb.textContent = msg;
    fb.style.color = color;
  }
}

// ============ 回撤复盘 ============
(window as any).showDrawdownModal = showDrawdownModal;
function showDrawdownModal() {
  if (!user) return;
  const snap = calculateStock(user);
  const kline = generateKline(user);
  const dd = calcDrawdown(kline, snap.price);
  const questions = getReviewQuestions(user);

  const modal = createModal('📉 成长回落复盘', '复盘是为了觉察，不是自责');
  modal.querySelector('.modal-body')!.innerHTML = `
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">${dd.inDrawdown ? '📉' : '📈'}</div>
        <div style="font-size:22px;font-weight:bold;margin-top:8px;">${dd.inDrawdown ? '阶段性回落' : '稳健成长'}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">历史峰值</div><div class="metric-value">${Math.round(dd.peak)}</div></div>
        <div class="metric"><div class="metric-label">当前指数</div><div class="metric-value">${Math.round(dd.current)}</div></div>
        <div class="metric"><div class="metric-label">回落幅度</div><div class="metric-value" style="color:${dd.inDrawdown ? 'var(--accent-orange)' : 'var(--accent-green)'}">${dd.drawdownPct}%</div></div>
        <div class="metric"><div class="metric-label">距峰值</div><div class="metric-value">${dd.peakDaysAgo} 天</div></div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-bottom:20px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 复盘建议</div>
        ${dd.suggestions.map((s) => `<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${s}</div>`).join('')}
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">🤔 自问</div>
        ${questions.map((q) => `<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${q}</div>`).join('')}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">回落是成长的正常阶段，不必焦虑，重在觉察与调整</div>
  `;
}

// ============ 目标反推 ============
(window as any).showGoalModal = showGoalModal;
function showGoalModal() {
  if (!user) return;
  const snap = calculateStock(user);
  const modal = createModal('🏁 目标反推', '设定目标，反推所需投入');
  modal.querySelector('.modal-body')!.innerHTML = `
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">🏁</div>
        <div style="font-size:22px;font-weight:bold;margin-top:8px;">目标反推</div>
        <div style="font-size:13px;color:var(--text-muted);margin-top:4px;">当前指数 ${Math.round(snap.price)}，设定目标看看需要多少投入</div>
      </div>
      <div style="margin-bottom:16px;">
        <label style="font-size:13px;color:var(--text-secondary);">目标成长指数（点）</label>
        <input type="number" id="goalTarget" value="${Math.round(snap.price * 1.5)}" style="width:100%;padding:12px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);margin-top:6px;font-size:18px;">
      </div>
      <button class="btn-primary" onclick="calcGoal()" style="width:100%;padding:14px;font-size:16px;">反推所需投入</button>
      <div id="goalResult"></div>
  `;
}

(window as any).calcGoal = calcGoal;
function calcGoal() {
  if (!user) return;
  const target = Number((document.getElementById('goalTarget') as HTMLInputElement).value);
  if (!target || target <= 0) { showToast('请输入有效目标'); return; }
  const plan = reverseGoal(user, target);
  const result = document.getElementById('goalResult')!;
  result.innerHTML = `
    <div style="margin-top:20px;background:var(--surface-soft);border-radius:12px;padding:16px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
        <div class="metric"><div class="metric-label">目标成长指数</div><div class="metric-value">${plan.target} 点</div></div>
        <div class="metric"><div class="metric-label">此刻成长指数</div><div class="metric-value">${plan.current} 点</div></div>
        <div class="metric"><div class="metric-label">还差</div><div class="metric-value" style="color:var(--accent-blue);">${plan.gap} 点</div></div>
        <div class="metric"><div class="metric-label">还需成长值（粗估）</div><div class="metric-value">约 ${plan.additionalInvest} 点</div></div>
      </div>
      <div style="font-size:14px;color:var(--text-secondary);line-height:1.8;">
        ${plan.suggestions.map((s) => `<div>• ${s}</div>`).join('')}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">${plan.confidence}</div>
    </div>
  `;
}

// ============ 月报 ============
(window as any).showReportModal = showReportModal;
function showReportModal() {
  if (!user) return;
  const kline = generateKline(user);
  const report = generateMonthlyReport(user, kline);
  const moodText = report.avgMood === null ? '暂无' :
    report.avgMood >= 3.5 ? '😄 很好' :
    report.avgMood >= 2.5 ? '🙂 不错' :
    report.avgMood >= 1.5 ? '😐 一般' : '😔 偏低';

  const modal = createModal('📊 月度成长报告', report.month + ' 月报');
  modal.querySelector('.modal-body')!.innerHTML = `
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">📊</div>
        <div style="font-size:22px;font-weight:bold;margin-top:8px;">${report.month} 成长月报</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">月内变化</div><div class="metric-value" style="color:${report.changePoints >= 0 ? 'var(--accent-green)' : 'var(--accent-orange)'}">${report.changePoints >= 0 ? '+' : ''}${report.changePoints}</div></div>
        <div class="metric"><div class="metric-label">投入笔数</div><div class="metric-value">${report.investCount}</div></div>
        <div class="metric"><div class="metric-label">记录天数</div><div class="metric-value">${report.journalDays}</div></div>
        <div class="metric"><div class="metric-label">实际花费（仅记录）</div><div class="metric-value">${report.investAmount.toLocaleString()} 元</div></div>
        <div class="metric"><div class="metric-label">月初指数</div><div class="metric-value">${report.startPrice}</div></div>
        <div class="metric"><div class="metric-label">月末指数</div><div class="metric-value">${report.endPrice}</div></div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;">⭐ 本月亮点</div>
        ${report.highlights.length > 0 ? report.highlights.map((h) => `<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${h}</div>`).join('') : '<div style="font-size:13px;color:var(--text-muted);">继续积累，下个月会更好</div>'}
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">📌 下月建议</div>
        ${report.suggestions.map((s) => `<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${s}</div>`).join('')}
      </div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:16px;text-align:center;">平均情绪：${moodText} · 报告仅基于你的记录生成，不代表客观评价</div>
  `;
}

// ============ 结构雷达 ============
(window as any).showRadarModal = showRadarModal;
function showRadarModal() {
  if (!user) return;
  const radar = calcRadar(user);
  const colors = { education: '#ff8a4c', skill: '#f5a623', health: '#3fa06a', network: '#3e9b8f', entertainment: '#e0705b', other: '#a79b8c' };

  // 用 canvas 画雷达图
  const canvasHtml = `<canvas id="radarCanvas" width="300" height="300" style="display:block;margin:0 auto;"></canvas>`;

  const modal = createModal('🎯 投入结构雷达', '看看你的成长积累分布是否均衡');
  modal.querySelector('.modal-body')!.innerHTML = `
      <div style="text-align:center;margin-bottom:16px;">${canvasHtml}</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:16px;">
        ${radar.dimensions.map((d) => `<div style="font-size:12px;color:var(--text-secondary);"><span style="color:${colors[d.type]}">●</span> ${d.label.split(' ')[1]}: ${d.amount.toLocaleString()} 元</div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
        <div class="metric"><div class="metric-label">均衡度</div><div class="metric-value">${Math.round(radar.balance * 100)}%</div></div>
        <div class="metric"><div class="metric-label">最突出</div><div class="metric-value">${radar.dimensions.find((d) => d.type === radar.dominant)?.label.split(' ')[1]}</div></div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 结构建议</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">
          ${radar.balance >= 0.6 ? '投入结构较均衡，继续保持多维发展。' : `${radar.dimensions.find((d) => d.type === radar.weakest)?.label}维度投入较少，可适当增加。`}
          健康是一切成长的底座，建议保持健康维度的持续投入。
        </div>
      </div>
  `;

  // 绘制雷达图
  setTimeout(() => drawRadar(radar, colors), 50);
}

function drawRadar(radar: any, colors: Record<string, string>) {
  const canvas = document.getElementById('radarCanvas') as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext('2d')!;
  const cx = 150, cy = 150, r = 110;
  ctx.clearRect(0, 0, 300, 300);
  const dims = radar.dimensions;
  const n = dims.length;
  // 网格
  for (let level = 1; level <= 4; level++) {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const rr = (r * level) / 4;
      const x = cx + rr * Math.cos(angle);
      const y = cy + rr * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(120,95,60,0.16)';
    ctx.stroke();
  }
  // 轴线
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
    ctx.strokeStyle = 'rgba(120,95,60,0.2)';
    ctx.stroke();
  }
  // 数据
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const val = dims[i].value / 100;
    const x = cx + r * val * Math.cos(angle);
    const y = cy + r * val * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,138,76,0.3)';
  ctx.fill();
  ctx.strokeStyle = '#ff8a4c';
  ctx.lineWidth = 2;
  ctx.stroke();
  // 标签
  ctx.fillStyle = '#5c5246';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const x = cx + (r + 20) * Math.cos(angle);
    const y = cy + (r + 20) * Math.sin(angle);
    ctx.fillText(dims[i].label.split(' ')[1], x, y + 4);
  }
}

// ============ 折旧预测 ============
(window as any).showDepreciationModal = showDepreciationModal;
function showDepreciationModal() {
  if (!user) return;
  const snap = calculateStock(user);
  const annualInvest = Math.round((user.annualIncome * 0.1) / 12);
  const forecast = forecastDepreciation(user, 10, annualInvest);

  const modal = createModal('📉 折旧推演', '看看你的成长积累随时间如何变化');
  modal.querySelector('.modal-body')!.innerHTML = `
      <div style="text-align:center;margin-bottom:16px;">
        <div style="font-size:14px;color:var(--text-muted);">假设每年新增自我花费约 ${annualInvest.toLocaleString()} 元（估算口径）</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">当前成长值</div><div class="metric-value">${Math.round(snap.bv)}</div></div>
        <div class="metric"><div class="metric-label">5 年后</div><div class="metric-value" style="color:${forecast.bv5y >= snap.bv ? 'var(--accent-green)' : 'var(--accent-orange)'}">${forecast.bv5y}</div></div>
        <div class="metric"><div class="metric-label">10 年后</div><div class="metric-value" style="color:${forecast.bv10y >= snap.bv ? 'var(--accent-green)' : 'var(--accent-orange)'}">${forecast.bv10y}</div></div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;">📈 10 年趋势</div>
        ${forecast.points.map((p) => `<div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary);line-height:1.8;"><span>${p.age} 岁</span><span>成长值 ${p.bv}（自然衰减 -${p.depreciation}，新增 +${p.newInvest}）</span></div>`).join('')}
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 建议</div>
        ${forecast.suggestions.map((s) => `<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${s}</div>`).join('')}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">年折旧率约 ${forecast.annualDecayRate * 100}%，仅作趋势参考</div>
  `;
}

// ============ 情景模拟 ============
(window as any).showScenarioModal = showScenarioModal;
function showScenarioModal() {
  if (!user) return;
  const scenarios = simulateScenarios(user);
  const modal = createModal('🎲 情景模拟', '不同节奏下，你的指数会怎样');
  modal.querySelector('.modal-body')!.innerHTML = `
      ${scenarios.map((s) => `
        <div style="background:var(--surface-soft);border-radius:12px;padding:16px;margin-bottom:12px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <span style="font-size:24px;">${s.icon}</span>
            <div>
              <div style="font-weight:600;">${s.label}</div>
              <div style="font-size:12px;color:var(--text-muted);">${s.desc}</div>
            </div>
            <div style="margin-left:auto;text-align:right;">
              <div style="font-size:22px;font-weight:bold;color:${s.changePct >= 0 ? 'var(--accent-green)' : 'var(--accent-orange)'}">${s.price} 点</div>
              <div style="font-size:12px;color:${s.changePct >= 0 ? 'var(--accent-green)' : 'var(--accent-orange)'}">${s.changePct >= 0 ? '+' : ''}${s.changePct}%</div>
            </div>
          </div>
          <div style="font-size:12px;color:var(--text-muted);">学习 ${s.params.studyHours}h/周 · 健康 ${s.params.healthScore} · 收入增长 ${Math.round(s.params.incomeGrowth * 100)}% · 负债 ${Math.round(s.params.debtRatio * 100)}%</div>
        </div>
      `).join('')}
      <div style="font-size:11px;color:var(--text-muted);text-align:center;">情景为参数调整后的模拟结果，不代表预测承诺</div>
  `;
}

// ============ 家庭账本 ============
(window as any).showFamilyModal = showFamilyModal;
function showFamilyModal() {
  if (!user) return;
  const ledger = getFamilyLedger(user);
  const modal = createModal('👨‍👩‍👧 家庭账本', '记录家庭/父母的支持，看见成长背后的力量');
  modal.querySelector('.modal-body')!.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">累计家庭支持</div><div class="metric-value">${ledger.totalSupport} 万</div></div>
        <div class="metric"><div class="metric-label">占总积累比</div><div class="metric-value">${Math.round(ledger.supportRatio * 100)}%</div></div>
      </div>
      <div style="margin-bottom:16px;">
        <label style="font-size:13px;color:var(--text-secondary);">家庭支持（万元，选填，仅存本机）</label>
        <input type="number" id="familySupportInput" value="${ledger.totalSupport}" style="width:100%;padding:10px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);margin-top:6px;">
      </div>
      <button class="btn-primary" onclick="saveFamilySupport()" style="width:100%;padding:12px;">保存</button>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-top:16px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 说明</div>
        ${ledger.suggestions.map((s) => `<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${s}</div>`).join('')}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">家庭支持不折旧、不乘权重，单独计入成长值，不参与主观调整</div>
  `;
}

(window as any).saveFamilySupport = saveFamilySupport;
function saveFamilySupport() {
  if (!user) return;
  const val = Number((document.getElementById('familySupportInput') as HTMLInputElement).value) || 0;
  user.familySupportCapital = val;
  saveUser(user);
  showDashboard();
  showToast('✅ 家庭支持已更新');
  closeModal();
}

// ============ AI 周报 ============
(window as any).showAIWeeklyModal = showAIWeeklyModal;
function showAIWeeklyModal() {
  if (!user) return;
  const report = generateAIWeeklyReport(user);
  const modal = createModal('📝 本周周报', '基于你的记录由模板在本地生成，不上传数据');
  modal.querySelector('.modal-body')!.innerHTML = `
      <div style="background:linear-gradient(135deg,rgba(255,138,76,0.15),rgba(62,155,143,0.15));border-radius:12px;padding:16px;margin-bottom:16px;">
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">${report.week}</div>
        <div style="font-size:16px;font-weight:600;line-height:1.6;">${report.summary}</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:8px;">${report.moodNote}</div>
      </div>
      ${report.highlights.length > 0 ? `<div style="background:rgba(63,160,106,0.1);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;color:var(--accent-green);">⭐ 本周亮点</div>
        ${report.highlights.map((h) => `<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${h}</div>`).join('')}
      </div>` : ''}
      ${report.improvements.length > 0 ? `<div style="background:rgba(224,153,47,0.08);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;color:var(--accent-yellow);">🔍 待改进</div>
        ${report.improvements.map((i) => `<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${i}</div>`).join('')}
      </div>` : ''}
      <div style="background:rgba(255,138,76,0.08);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;color:var(--accent-blue);">🎯 下周行动</div>
        ${report.actions.map((a) => `<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${a}</div>`).join('')}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">周报由规则引擎在本地生成，不调用任何外部 AI 服务，不上传你的数据</div>
  `;
}

// ============ 年报 ============
(window as any).showAnnualModal = showAnnualModal;
function showAnnualModal() {
  if (!user) return;
  const kline = generateKline(user);
  const report = generateAnnualReport(user, kline);
  const moodText = report.avgMood === null ? '暂无' :
    report.avgMood >= 3.5 ? '😄 很好' : report.avgMood >= 2.5 ? '🙂 不错' : report.avgMood >= 1.5 ? '😐 一般' : '😔 偏低';

  const modal = createModal('🎊 年度报告', `${report.year} 年成长总结`);
  modal.querySelector('.modal-body')!.innerHTML = `
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">🎊</div>
        <div style="font-size:24px;font-weight:bold;margin-top:8px;">${report.year} 年报</div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:20px;">
        ${report.keywords.map((k) => `<span style="padding:6px 14px;border-radius:20px;background:rgba(255,138,76,0.15);font-size:13px;">${k}</span>`).join('')}
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:16px;margin-bottom:16px;text-align:center;">
        <div style="font-size:14px;color:var(--text-muted);">年度指数变化</div>
        <div style="font-size:32px;font-weight:bold;color:${report.changePoints >= 0 ? 'var(--accent-green)' : 'var(--accent-orange)'}">${report.changePoints >= 0 ? '+' : ''}${report.changePoints}</div>
        <div style="font-size:13px;color:var(--text-muted);">${report.startPrice} → ${report.endPrice}（${report.changePct >= 0 ? '+' : ''}${report.changePct}%）</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
        <div class="metric"><div class="metric-label">年度实际花费</div><div class="metric-value">${report.totalInvest.toLocaleString()} 元</div></div>
        <div class="metric"><div class="metric-label">投入笔数</div><div class="metric-value">${report.investCount}</div></div>
        <div class="metric"><div class="metric-label">里程碑</div><div class="metric-value">${report.milestoneCount}</div></div>
        <div class="metric"><div class="metric-label">记录天数</div><div class="metric-value">${report.journalDays}</div></div>
        <div class="metric"><div class="metric-label">平均情绪</div><div class="metric-value" style="font-size:16px;">${moodText}</div></div>
        <div class="metric"><div class="metric-label">均衡度</div><div class="metric-value">${report.milestoneCount > 0 ? '良好' : '—'}</div></div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;">📖 年度总结</div>
        <div style="font-size:14px;color:var(--text-secondary);line-height:1.8;">${report.summary}</div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">🌱 下年度方向</div>
        ${report.nextYearPlan.map((p) => `<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${p}</div>`).join('')}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">年报基于你的记录生成，是回顾也是鼓励，不是评价</div>
  `;
}

// ============ 同路人 ============
(window as any).showPeerModal = showPeerModal;
function showPeerModal() {
  if (!user) return;
  const snap = calculateStock(user);
  const peerBV = getPeerBenchmark(user);
  const userBV = snap.bv;
  const diff = userBV - peerBV;
  const diffPct = peerBV > 0 ? Math.round((diff / peerBV) * 100) : 0;

  const modal = createModal('👥 同路人', '看看相似背景的成长者们大致在哪里（匿名统计锚点）');
  modal.querySelector('.modal-body')!.innerHTML = `
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">👥</div>
        <div style="font-size:18px;font-weight:600;margin-top:8px;">你不是一个人在成长</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">你的成长积累</div><div class="metric-value">${Math.round(userBV)}</div></div>
        <div class="metric"><div class="metric-label">同类锚点（估算）</div><div class="metric-value">${Math.round(peerBV)}</div></div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:16px;margin-bottom:16px;text-align:center;">
        <div style="font-size:14px;color:var(--text-muted);">相对同类锚点</div>
        <div style="font-size:28px;font-weight:bold;color:${diff >= 0 ? 'var(--accent-green)' : 'var(--accent-orange)'};margin-top:6px;">${diff >= 0 ? '+' : ''}${diffPct}%</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:6px;">${diff >= 0 ? '你走在多数人前面，继续保持' : '还有追赶空间，但成长没有终点'}</div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 关于对比</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">
          这个锚点是基于相似年龄、城市、学历的统计估算，仅作参考。每个人的成长节奏不同，<br>
          与昨天的自己比较，比与他人比较更有意义。
        </div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">锚点数据为估算值，不构成任何评价或排名</div>
  `;
}

// ============ 挑战系统 ============
(window as any).showChallengeModal = showChallengeModal;
function showChallengeModal() {
  if (!user) return;
  const challenges = getChallenges(user);
  const completion = getChallengeCompletion(user);

  const modal = createModal('🎯 成长挑战', '完成挑战，见证坚持的力量');
  modal.querySelector('.modal-body')!.innerHTML = `
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">🎯</div>
        <div style="font-size:22px;font-weight:bold;margin-top:8px;">挑战完成度 ${completion}%</div>
      </div>
      ${challenges.map((c) => `
        <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-bottom:10px;${c.done ? 'border:1px solid var(--accent-green);' : ''}">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <span style="font-size:22px;">${c.icon}</span>
            <div style="flex:1;">
              <div style="font-weight:600;">${c.name} ${c.done ? '<span style="color:var(--accent-green);">✓ 已完成</span>' : ''}</div>
              <div style="font-size:12px;color:var(--text-muted);">${c.desc}</div>
            </div>
            <div style="font-size:14px;font-weight:bold;color:${c.done ? 'var(--accent-green)' : 'var(--accent-blue)'};">${c.progress}/${c.target} ${c.unit}</div>
          </div>
          <div style="height:6px;background:var(--surface-strong);border-radius:3px;overflow:hidden;">
            <div style="height:100%;width:${Math.round((c.progress / c.target) * 100)}%;background:${c.done ? 'var(--accent-green)' : 'linear-gradient(90deg,#ffb36b,#ff8a4c)'};border-radius:3px;transition:width 0.5s;"></div>
          </div>
        </div>
      `).join('')}
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">挑战数据基于你的本地记录，完成后自动更新</div>
  `;
}

// ============ 虚拟导师 ============
(window as any).showMentorModal = showMentorModal;
function showMentorModal() {
  if (!user) return;
  const advice = getMentorAdvice(user);

  const modal = createModal('🌱 成长伙伴', advice.persona);
  modal.querySelector('.modal-body')!.innerHTML = `
      <div style="background:linear-gradient(135deg,rgba(255,138,76,0.12),rgba(62,155,143,0.12));border-radius:12px;padding:16px;margin-bottom:16px;">
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:6px;">${advice.greeting}</div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;">👁️ 我观察到</div>
        ${advice.observations.map((o) => `<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${o}</div>`).join('')}
      </div>
      <div style="background:rgba(255,138,76,0.08);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;color:var(--accent-blue);">💡 我的建议</div>
        ${advice.advices.map((a) => `<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${a}</div>`).join('')}
      </div>
      <div style="background:rgba(63,160,106,0.1);border-radius:12px;padding:14px;text-align:center;">
        <div style="font-size:14px;color:var(--accent-green);font-style:italic;line-height:1.6;">${advice.encouragement}</div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">伙伴建议由规则模板生成，仅作自我反思参考，不是专业心理咨询；如遇严重情绪困扰，请拨打心理援助热线 12356。<br>最终决定权，始终在你手中。</div>
  `;
}

// ============ 微课 / 术语卡 ============
let microTab = 'terms';
(window as any).showMicroModal = showMicroModal;
function showMicroModal() {
  if (!user) return;
  const modal = createModal('📚 微课', '学习成长术语，理解你的指数');
  const body = modal.querySelector('.modal-body')!;

  const renderTerms = () => `
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${TERM_CARDS.map((t) => `
        <div style="background:var(--surface-soft);border-radius:12px;padding:14px;cursor:pointer;" onclick="this.querySelector('.term-detail').style.display=this.querySelector('.term-detail').style.display==='none'?'block':'none'">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:22px;">${t.icon}</span>
            <div style="flex:1;">
              <div style="font-weight:600;">${t.term} <span style="font-size:11px;color:var(--text-muted);font-weight:normal;">[${t.category}]</span></div>
              <div style="font-size:12px;color:var(--text-muted);">${t.short}</div>
            </div>
            <span style="font-size:12px;color:var(--text-muted);">▼</span>
          </div>
          <div class="term-detail" style="display:none;margin-top:10px;font-size:13px;color:var(--text-secondary);line-height:1.7;border-top:1px solid var(--border);padding-top:10px;">${t.detail}</div>
        </div>
      `).join('')}
    </div>
  `;

  const renderStages = () => `
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${STAGE_GUIDES.map((s) => `
        <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
          <div style="font-weight:600;margin-bottom:4px;">${s.stage} <span style="font-size:12px;color:var(--text-muted);font-weight:normal;">${s.ageRange}</span></div>
          <div style="font-size:13px;color:var(--accent-blue);margin-bottom:8px;">重心：${s.focus}</div>
          ${s.tips.map((t) => `<div style="font-size:13px;color:var(--text-secondary);line-height:1.7;">• ${t}</div>`).join('')}
        </div>
      `).join('')}
    </div>
  `;

  body.innerHTML = `
    <div style="display:flex;gap:8px;margin-bottom:16px;">
      <button class="btn-primary" onclick="switchMicroTab('terms')" id="tab-terms" style="flex:1;${microTab === 'terms' ? '' : 'opacity:0.6;'}">📖 术语卡</button>
      <button class="btn-primary" onclick="switchMicroTab('stages')" id="tab-stages" style="flex:1;${microTab === 'stages' ? '' : 'opacity:0.6;'}">🧭 阶段指南</button>
    </div>
    <div id="microContent">${microTab === 'terms' ? renderTerms() : renderStages()}</div>
  `;
}

(window as any).switchMicroTab = switchMicroTab;
function switchMicroTab(tab: string) {
  microTab = tab;
  showMicroModal();
}

// ============ 感恩卡片 ============
let gratitudeIndex = 0;
(window as any).showGratitudeModal = showGratitudeModal;
function showGratitudeModal() {
  if (!user) return;
  const card = generateGratitudeCard(user, gratitudeIndex);
  const total = getGratitudeTemplateCount();

  const modal = createModal('💌 感恩卡片', '亲子连接 · 表达感谢');
  modal.querySelector('.modal-body')!.innerHTML = `
      <div style="text-align:center;margin-bottom:16px;">
        <div style="font-size:48px;">💌</div>
      </div>
      <div style="background:linear-gradient(135deg,rgba(224,153,47,0.1),rgba(224,92,75,0.1));border-radius:16px;padding:24px;margin-bottom:16px;border:1px solid rgba(224,153,47,0.2);">
        <div style="font-size:18px;font-weight:bold;margin-bottom:16px;text-align:center;color:var(--accent-yellow);">${card.title}</div>
        <div style="font-size:15px;line-height:2;color:var(--text-secondary);text-align:center;">${card.content}</div>
        <div style="font-size:13px;color:var(--text-muted);text-align:right;margin-top:20px;">${card.signature}</div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:12px;">
        <button class="btn-primary" onclick="prevGratitude()" style="flex:1;opacity:0.8;">← 上一张</button>
        <button class="btn-primary" onclick="nextGratitude()" style="flex:1;opacity:0.8;">下一张 →</button>
      </div>
      <button class="btn-primary" onclick="copyGratitude()" style="width:100%;padding:12px;">📋 复制卡片内容</button>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">第 ${gratitudeIndex + 1}/${total} 张 · 卡片内容可自由编辑后发送给家人</div>
  `;
}

(window as any).nextGratitude = nextGratitude;
function nextGratitude() {
  if (!user) return;
  gratitudeIndex = (gratitudeIndex + 1) % getGratitudeTemplateCount();
  showGratitudeModal();
}

(window as any).prevGratitude = prevGratitude;
function prevGratitude() {
  if (!user) return;
  gratitudeIndex = (gratitudeIndex - 1 + getGratitudeTemplateCount()) % getGratitudeTemplateCount();
  showGratitudeModal();
}

(window as any).copyGratitude = copyGratitude;
function copyGratitude() {
  if (!user) return;
  const card = generateGratitudeCard(user, gratitudeIndex);
  const text = `${card.title}\n\n${card.content}\n\n${card.signature}`;
  navigator.clipboard.writeText(text).then(() => {
    showToast('✅ 已复制，可粘贴发给家人');
  }).catch(() => {
    showToast('复制失败，请手动选择文本');
  });
}

// ============ 导出报告 ============
(window as any).showExportReportModal = showExportReportModal;
function showExportReportModal() {
  if (!user) return;
  const kline = generateKline(user);
  const text = generateReportText(user, kline);

  const modal = createModal('📄 导出成长报告', '生成纯文本报告，可保存或分享');
  modal.querySelector('.modal-body')!.innerHTML = `
      <div style="background:var(--surface-soft);border-radius:12px;padding:16px;margin-bottom:16px;max-height:400px;overflow-y:auto;">
        <pre style="font-family:monospace;font-size:12px;line-height:1.6;white-space:pre-wrap;color:var(--text-secondary);">${text}</pre>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn-primary" onclick="copyReport()" style="flex:1;padding:12px;">📋 复制文本</button>
        <button class="btn-primary" onclick="downloadReport()" style="flex:1;padding:12px;">⬇️ 下载 .txt</button>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">报告内容均来自你的本地数据，不包含任何个人身份信息</div>
  `;
}

(window as any).copyReport = copyReport;
function copyReport() {
  if (!user) return;
  const kline = generateKline(user);
  const text = generateReportText(user, kline);
  navigator.clipboard.writeText(text).then(() => showToast('✅ 报告已复制')).catch(() => showToast('复制失败'));
}

(window as any).downloadReport = downloadReport;
function downloadReport() {
  if (!user) return;
  const kline = generateKline(user);
  const text = generateReportText(user, kline);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `成长报告_${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('✅ 报告已下载');
}

// =====================================================================
// ============ v1.3 个性化与互动功能 ============
// =====================================================================

function esc(s: unknown): string {
  return String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

interface TypeOption {
  key: string;
  label: string;
  icon: string;
  color: string;
  type: InvestType;
  customId?: string;
}

function activeCustomTypes(u: UserProfile): CustomType[] {
  return (u.customTypes || []).filter((c) => !c.archived);
}
function getTypeOptions(u: UserProfile): TypeOption[] {
  const builtins = (Object.keys(TYPE_META) as InvestType[]).map((t) => ({
    key: t, label: TYPE_META[t].name, icon: TYPE_META[t].icon, color: TYPE_META[t].color, type: t,
  }));
  const customs = activeCustomTypes(u).map((c) => ({
    key: 'custom:' + c.id, label: c.name, icon: c.icon, color: c.color, type: c.baseType, customId: c.id,
  }));
  return [...builtins, ...customs];
}
function invDisplay(u: UserProfile, inv: Investment): { icon: string; name: string; color: string } {
  if (inv.customType) {
    const c = (u.customTypes || []).find((x) => x.id === inv.customType);
    if (c) return { icon: c.icon, name: c.name, color: c.color };
  }
  const m = TYPE_META[inv.type] || TYPE_META.other;
  return { icon: m.icon, name: m.name, color: m.color };
}

/** 通用 emoji/颜色小芯片选择 */
(window as any).selectChip = function (groupId: string, el: HTMLElement, value: string) {
  const box = document.getElementById(groupId)!;
  box.querySelectorAll('.picker-chip').forEach((x) => x.classList.remove('selected'));
  el.classList.add('selected');
  box.dataset.value = value;
};
function chipPicker(groupId: string, values: string[], selected: string, kind: 'emoji' | 'color'): string {
  return `<div id="${groupId}" class="${kind}-picker picker-row" data-value="${esc(selected)}">
    ${values.map((v) => {
      const active = v === selected;
      const inner = kind === 'color'
        ? `<span class="color-dot" style="background:${v}"></span>`
        : v;
      return `<span class="picker-chip ${active ? 'selected' : ''}" onclick="selectChip('${groupId}',this,'${v}')">${inner}</span>`;
    }).join('')}
  </div>`;
}

// ---------- 自定义分类 ----------
const CATEGORY_ICONS = ['📦', '📖', '🎨', '🎸', '💻', '🌱', '🧠', '🙏', '☕', '🚶', '🧩', '🗼'];
const CATEGORY_COLORS = ['#ff8a4c', '#f5a623', '#3fa06a', '#3e9b8f', '#e0705b', '#7d8cf6', '#b06fd0', '#a79b8c'];

(window as any).showCustomTypeManager = showCustomTypeManager;
function showCustomTypeManager(editId?: string) {
  if (!user) return;
  const u = user;
  const editing = editId ? (u.customTypes || []).find((c) => c.id === editId) : null;
  const baseOptions = (Object.keys(TYPE_META) as InvestType[])
    .map((t) => `<option value="${t}" ${editing?.baseType === t ? 'selected' : ''}>${TYPE_META[t].icon} ${TYPE_META[t].name}（计入${TYPE_META[t].name}维度）</option>`).join('');
  const modal = createModal('🏷️ 自定义分类', '新增你自己的投入分类；它会归入一个内置维度参与指数计算');
  modal.querySelector('.modal-body')!.innerHTML = `
    <div id="ctList" style="display:flex;flex-direction:column;gap:8px;margin-bottom:18px;">
      ${(u.customTypes || []).length === 0 ? '<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:8px;">还没有自定义分类</div>' : ''}
      ${(u.customTypes || []).map((c) => `
        <div class="ct-row ${c.archived ? 'archived' : ''}">
          <span class="ct-icon" style="background:${c.color}22;color:${c.color}">${c.icon}</span>
          <span class="ct-name">${esc(c.name)} <small>→ ${TYPE_META[c.baseType].name}</small></span>
          <span class="ct-ops">
            ${c.archived
              ? `<a onclick="ctRestore('${c.id}')">恢复</a> <a class="danger-link" onclick="ctDelete('${c.id}')">彻底删除</a>`
              : `<a onclick="showCustomTypeManager('${c.id}')">编辑</a> <a onclick="ctArchive('${c.id}')">归档</a>`}
          </span>
        </div>`).join('')}
    </div>
    <div class="sub-form" id="ctForm">
      <div style="font-weight:bold;margin-bottom:10px;">${editing ? '编辑分类' : '新建分类'}</div>
      <input type="text" id="ctName" placeholder="分类名称，如：日语课 / 考研 / 马拉松" value="${esc(editing?.name || '')}" style="width:100%;margin-bottom:10px;">
      <label class="field-label">图标</label>
      ${chipPicker('ctIcon', CATEGORY_ICONS, editing?.icon || '📦', 'emoji')}
      <label class="field-label">颜色</label>
      ${chipPicker('ctColor', CATEGORY_COLORS, editing?.color || '#ff8a4c', 'color')}
      <label class="field-label">归入维度（影响权重与折旧）</label>
      <select id="ctBase" style="width:100%;margin:6px 0 14px;">${baseOptions}</select>
      <div class="form-actions">
        ${editing ? '<button class="dash-btn" onclick="showCustomTypeManager()">取消</button>' : ''}
        <button class="btn-primary" onclick="ctSave('${editing?.id || ''}')">${editing ? '保存修改' : '＋ 添加分类'}</button>
      </div>
    </div>`;
}

(window as any).ctSave = function (editId: string) {
  if (!user) return;
  const name = (document.getElementById('ctName') as HTMLInputElement).value.trim();
  if (!name) { showToast('请填写分类名称'); return; }
  const icon = document.getElementById('ctIcon')!.dataset.value || '📦';
  const color = document.getElementById('ctColor')!.dataset.value || '#ff8a4c';
  const baseType = (document.getElementById('ctBase') as HTMLSelectElement).value as InvestType;
  const list = user.customTypes || (user.customTypes = []);
  if (editId) {
    const c = list.find((x) => x.id === editId);
    if (c) Object.assign(c, { name, icon, color, baseType });
  } else {
    if (list.some((c) => c.name === name && !c.archived)) { showToast('已有同名分类'); return; }
    list.push({ id: 'ct_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name, icon, color, baseType });
  }
  saveUser(user);
  showCustomTypeManager();
  showDashboard();
  showToast('✅ 分类已保存');
};
(window as any).ctArchive = function (id: string) {
  if (!user) return;
  const c = user.customTypes!.find((x) => x.id === id);
  if (c) c.archived = true;
  saveUser(user); showCustomTypeManager(); showDashboard();
};
(window as any).ctRestore = function (id: string) {
  if (!user) return;
  const c = user.customTypes!.find((x) => x.id === id);
  if (c) c.archived = false;
  saveUser(user); showCustomTypeManager(); showDashboard();
};
(window as any).ctDelete = function (id: string) {
  if (!user) return;
  if (!confirm('彻底删除后，相关记录会回到它归入的内置分类下，确定吗？')) return;
  user.customTypes = (user.customTypes || []).filter((c) => c.id !== id);
  user.investments.forEach((inv) => { if (inv.customType === id) inv.customType = undefined; });
  saveUser(user); showCustomTypeManager(); showDashboard();
};

// ---------- 个性名片 ----------
const AVATARS = ['🌱', '☀️', '🌙', '⭐', '🔥', '🍀', '🌻', '🍊', '🐱', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐸', '🐵', '🦉', '🐳', '🎈', '💎', '🚀', '🏔️'];

(window as any).showProfileModal = showProfileModal;
function showProfileModal(firstRun = false) {
  if (!user) return;
  const u = user;
  const modal = createModal(firstRun ? '👋 打造你的专属名片' : '👤 个性化名片', firstRun ? '给自己起个名字、选个头像，让这只"成长指数"真正属于你（可跳过）' : '昵称、头像与指数名称会出现在仪表盘和分享卡上');
  modal.querySelector('.modal-body')!.innerHTML = `
    <label class="field-label">头像</label>
    ${chipPicker('pAvatar', AVATARS, u.avatar || '🌱', 'emoji')}
    <label class="field-label">昵称</label>
    <input type="text" id="pNickname" maxlength="12" placeholder="怎么称呼你？" value="${esc(u.nickname || '')}" style="width:100%;margin:6px 0 14px;">
    <label class="field-label">我的指数名称</label>
    <input type="text" id="pIndexName" maxlength="14" placeholder="如：阿长进指数 / 小树苗成长指数" value="${esc(u.indexName || '')}" style="width:100%;margin:6px 0 14px;">
    <label class="field-label">一句话签名</label>
    <input type="text" id="pSignature" maxlength="30" placeholder="如：日拱一卒，功不唐捐" value="${esc(u.signature || '')}" style="width:100%;margin:6px 0 14px;">
    <div class="form-actions" style="justify-content:space-between;">
      ${firstRun ? '<button class="dash-btn" onclick="closeModal()">稍后再说</button>' : '<button class="dash-btn" onclick="showCustomTypeManager()">🏷️ 管理分类</button>'}
      <button class="btn-primary" onclick="profileSave(${firstRun})">保存名片</button>
    </div>`;
}

(window as any).profileSave = function (firstRun: boolean) {
  if (!user) return;
  user.avatar = document.getElementById('pAvatar')!.dataset.value || '🌱';
  user.nickname = (document.getElementById('pNickname') as HTMLInputElement).value.trim() || undefined;
  user.indexName = (document.getElementById('pIndexName') as HTMLInputElement).value.trim() || undefined;
  user.signature = (document.getElementById('pSignature') as HTMLInputElement).value.trim() || undefined;
  saveUser(user);
  closeModal();
  showDashboard();
  showToast('✅ 名片已保存');
};

// ---------- 月度预算 ----------
function renderBudgetCard(u: UserProfile) {
  const box = document.getElementById('budgetBody');
  if (!box) return;
  const sensitive = isSensitiveConsented();
  const st = getBudgetStatus(u, { sensitive });
  const unit = st.mode === 'amount' ? '元' : '笔';
  if (st.budget === null) {
    box.innerHTML = `
      <div style="font-size:12.5px;color:var(--text-secondary);line-height:1.7;margin-bottom:12px;">
        给本月的成长投入定个小目标${sensitive ? '（金额）' : '（笔数）'}，让投入像记账一样有节奏。
      </div>
      <button class="btn-primary" style="width:100%;" onclick="showBudgetModal()">🎯 设置本月预算</button>`;
    return;
  }
  const pct = Math.min(100, Math.round((st.ratio || 0) * 100));
  const barColor = st.overrun ? 'var(--accent-red)' : pct >= 80 ? 'var(--accent-yellow)' : 'var(--accent-green)';
  const deltaTxt = st.deltaPct === null ? '上月无记录' :
    `${st.deltaPct >= 0 ? '↑' : '↓'} 比上月${Math.abs(Math.round(st.deltaPct * 100))}%`;
  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
      <span style="font-size:22px;font-weight:bold;color:${st.overrun ? 'var(--accent-red)' : 'var(--text-primary)'}">${Math.round(st.spent).toLocaleString()} <span style="font-size:12px;font-weight:normal;">/ ${st.budget.toLocaleString()} ${unit}</span></span>
      <a style="font-size:12px;cursor:pointer;" onclick="showBudgetModal()">⚙️ 调整</a>
    </div>
    <div class="budget-bar"><div class="budget-fill" style="width:${pct}%;background:${barColor};"></div></div>
    <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--text-muted);margin-top:8px;">
      <span>${st.overrun ? `已超 ${Math.round(-st.remaining!).toLocaleString()} ${unit}` : `还可投入 ${Math.round(st.remaining!).toLocaleString()} ${unit}`}</span>
      <span>日均 ${st.dailyAvg.toFixed(1)} ${unit} · ${deltaTxt}</span>
    </div>`;
}

/** v1.5 低谷恢复计划横幅：有未完成计划时显示在曲线上方（调研 Q5 74.5% 第一刚需） */
const RECOVERY_BANNER_META: Record<SetbackKind, { icon: string; name: string }> = {
  jobloss: { icon: '💼', name: '工作变动' },
  illness: { icon: '🏥', name: '健康风波' },
  loss: { icon: '🌧️', name: '回落调整' },
  stagnate: { icon: '🪫', name: '重新启动' },
};
function renderRecoveryBanner(u: UserProfile) {
  const wrap = document.getElementById('recoveryBannerWrap');
  if (!wrap) return;
  const plan = getActiveRecoveryPlan(u);
  if (!plan) { wrap.style.display = 'none'; wrap.innerHTML = ''; return; }
  const prog = getRecoveryProgress(plan);
  const meta = RECOVERY_BANNER_META[plan.setbackType] || { icon: '🌱', name: '恢复期' };
  wrap.style.display = 'block';
  wrap.innerHTML = `
    <div class="dash-card" onclick="showRecoveryPlanModal('${plan.id}')" style="padding:14px 20px;cursor:pointer;border-left:4px solid #C9936A;">
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="font-size:26px;">${meta.icon}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:bold;font-size:14.5px;margin-bottom:3px;">${meta.name}恢复期 · 已完成 ${prog.done}/${prog.total} 个小行动</div>
          <div style="height:6px;background:var(--surface-softer);border-radius:99px;overflow:hidden;">
            <div style="height:100%;width:${prog.pct}%;background:linear-gradient(90deg,#E8B88A,#5B9A6F);border-radius:99px;"></div>
          </div>
        </div>
        <a style="font-size:13px;color:#C9936A;font-weight:bold;white-space:nowrap;cursor:pointer;">继续 →</a>
      </div>
    </div>`;
}

/** 快速 4 问用户的画像完善引导横幅（温和、可一键关闭） */
let quickNudgeDismissed = false;
function renderQuickOnboardNudge(u: UserProfile) {
  const wrap = document.getElementById('quickOnboardNudge');
  if (!wrap) return;
  if (!u.quickOnboarded || quickNudgeDismissed) {
    wrap.style.display = 'none';
    wrap.innerHTML = '';
    return;
  }
  wrap.style.display = 'block';
  wrap.innerHTML = `
    <div class="dash-card" style="padding:14px 20px;border-left:4px solid #5B9A6F;background:linear-gradient(135deg,rgba(91,154,111,0.10),rgba(255,138,76,0.06));">
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="font-size:24px;">✏️</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:bold;font-size:14px;margin-bottom:2px;">再补 6 个小问题，曲线会更像你</div>
          <div style="font-size:12.5px;color:var(--text-secondary);">目前用的是通用估算值（收入增速、学习时长、健康、负债、里程碑…），随时可以回来改。</div>
        </div>
        <button onclick="resumeOnboarding()" class="btn-primary" style="padding:8px 16px;font-size:13px;white-space:nowrap;">去完善</button>
        <a onclick="dismissQuickNudge()" style="font-size:18px;color:var(--text-muted);cursor:pointer;padding:0 6px;line-height:1;" title="暂时不">×</a>
      </div>
    </div>`;
}
(window as any).dismissQuickNudge = function () {
  quickNudgeDismissed = true;
  const wrap = document.getElementById('quickOnboardNudge');
  if (wrap) { wrap.style.display = 'none'; wrap.innerHTML = ''; }
};

/** 计算最后一次记录（一句话 / 投入）距今天数；无记录返回 Infinity */
function daysSinceLastRecord(u: UserProfile): number {
  const dates: Date[] = [];
  (u.journals || []).forEach((j) => dates.push(new Date(j.date)));
  (u.investments || []).forEach((inv) => dates.push(new Date(inv.date)));
  if (dates.length === 0) return Infinity;
  const last = new Date(Math.max(...dates.map((d) => d.getTime())));
  const diff = (Date.now() - last.getTime()) / (24 * 60 * 60 * 1000);
  return Math.floor(diff);
}

/** 温和召回横幅：断更 3 天以上显示"今日宜动笔"，一键直达记一笔 */
let recallDismissed = false;
const RECALL_TIPS = [
  '哪怕只写一句话，今天也没有白过 🌱',
  '记录不是任务，是和自己的一次对话',
  '退一步是为了喘口气，但别忘带上自己',
  '今天的一小步，也是成长山坡上的一步',
  '你已经走了这么远，今天也轻推自己一下吧',
];
function renderRecallBanner(u: UserProfile) {
  const wrap = document.getElementById('recallBannerWrap');
  if (!wrap) return;
  const gap = daysSinceLastRecord(u);
  if (gap < 3 || recallDismissed) {
    wrap.style.display = 'none';
    wrap.innerHTML = '';
    return;
  }
  const tip = RECALL_TIPS[Math.floor(Math.random() * RECALL_TIPS.length)];
  const label = gap === Infinity ? '还没有写下第一笔' : `已经 ${gap} 天没动笔了`;
  wrap.style.display = 'block';
  wrap.innerHTML = `
    <div class="dash-card" style="padding:14px 20px;border-left:4px solid #FF8A4C;background:linear-gradient(135deg,rgba(255,138,76,0.10),rgba(255,179,107,0.06));">
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="font-size:24px;">🖋️</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:bold;font-size:14px;margin-bottom:2px;">今日宜动笔 · ${label}</div>
          <div style="font-size:12.5px;color:var(--text-secondary);">${tip}</div>
        </div>
        <button onclick="document.getElementById('smartInvestInput')?.focus();document.getElementById('smartInvestInput')?.scrollIntoView({behavior:'smooth',block:'center'});" class="btn-primary" style="padding:8px 16px;font-size:13px;white-space:nowrap;">记一笔</button>
        <a onclick="dismissRecall()" style="font-size:18px;color:var(--text-muted);cursor:pointer;padding:0 6px;line-height:1;" title="今天先不">×</a>
      </div>
    </div>`;
}
(window as any).dismissRecall = function () {
  recallDismissed = true;
  const wrap = document.getElementById('recallBannerWrap');
  if (wrap) { wrap.style.display = 'none'; wrap.innerHTML = ''; }
};

(window as any).showBudgetModal = showBudgetModal;
function showBudgetModal() {
  if (!user) return;
  const sensitive = isSensitiveConsented();
  const cur = sensitive ? (user.monthlyBudget || '') : (user.monthlyCountBudget || '');
  const modal = createModal('🎯 月度预算', sensitive
    ? '设定每月愿意为自己投入的金额上限，仅存本机'
    : '你尚未授权金额信息，可按每月投入笔数设定节奏');
  modal.querySelector('.modal-body')!.innerHTML = `
    <input type="number" id="budgetInput" value="${cur}" placeholder="${sensitive ? '如 2000（元/月）' : '如 8（笔/月）'}" style="width:100%;margin-bottom:14px;">
    <div class="form-actions" style="justify-content:space-between;">
      <button class="dash-btn" onclick="budgetClear()">取消预算</button>
      <button class="btn-primary" onclick="budgetSave()">保存</button>
    </div>`;
}
(window as any).budgetSave = function () {
  if (!user) return;
  const v = Number((document.getElementById('budgetInput') as HTMLInputElement).value);
  if (!v || v <= 0) { showToast('请输入大于 0 的数字'); return; }
  if (isSensitiveConsented()) user.monthlyBudget = v;
  else user.monthlyCountBudget = v;
  saveUser(user); closeModal(); showDashboard(); showToast('✅ 预算已设置');
};
(window as any).budgetClear = function () {
  if (!user) return;
  user.monthlyBudget = undefined;
  user.monthlyCountBudget = undefined;
  saveUser(user); closeModal(); showDashboard();
};

// ---------- 分类分析 ----------
let analyticsYear = new Date().getFullYear();
let analyticsMonth = new Date().getMonth();
(window as any).showAnalyticsModal = showAnalyticsModal;
function showAnalyticsModal(delta = 0) {
  if (!user) return;
  const u = user;
  if (delta !== 0) {
    const d = new Date(analyticsYear, analyticsMonth + delta, 1);
    analyticsYear = d.getFullYear();
    analyticsMonth = d.getMonth();
  }
  const sensitive = isSensitiveConsented();
  const slices = categoryBreakdown(u, analyticsYear, analyticsMonth);
  const trend = monthlyTrend(u, 6);
  const maxTrend = Math.max(1, ...trend.map((t) => t.amount));
  const totalAmount = slices.reduce((s, x) => s + x.amount, 0);
  const totalCount = slices.reduce((s, x) => s + x.count, 0);
  const modal = createModal('📈 投入分析', '看看你的成长投入都花在了哪些地方');
  modal.querySelector('.modal-body')!.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <button class="dash-btn" onclick="showAnalyticsModal(-1)">‹</button>
      <strong>${analyticsYear} 年 ${analyticsMonth + 1} 月</strong>
      <button class="dash-btn" onclick="showAnalyticsModal(1)">›</button>
    </div>
    <div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap;">
      <canvas id="donutCanvas" width="170" height="170" style="width:170px;height:170px;"></canvas>
      <div style="flex:1;min-width:180px;display:flex;flex-direction:column;gap:7px;">
        ${slices.length === 0 ? '<div style="color:var(--text-muted);font-size:13px;">本月还没有投入记录</div>' : slices.map((s) => `
          <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;">
            <span style="width:10px;height:10px;border-radius:3px;background:${s.color};display:inline-block;"></span>
            <span style="flex:1;">${s.icon} ${esc(s.name)}</span>
            <span style="color:var(--text-muted);">${s.count}笔 · ${Math.round(s.ratio * 100)}%</span>
            <span style="font-weight:bold;min-width:64px;text-align:right;">${sensitive ? s.amount.toLocaleString() + ' 元' : '—'}</span>
          </div>`).join('')}
      </div>
    </div>
    <div style="margin:18px 0 8px;font-size:13px;font-weight:bold;">近 6 个月趋势 ${sensitive ? '' : '（金额需授权后显示）'}</div>
    <div style="display:flex;gap:10px;align-items:flex-end;height:110px;padding:0 4px;border-bottom:1px solid var(--hairline);">
      ${trend.map((t) => {
        const isCur = analyticsYear === new Date().getFullYear() && analyticsMonth === new Date().getMonth() && t.label === `${new Date().getMonth() + 1}月`;
        const h = Math.max(3, Math.round((t.amount / maxTrend) * 90));
        return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;">
          <span style="font-size:9.5px;color:var(--text-muted);">${sensitive && t.amount > 0 ? (t.amount >= 10000 ? (t.amount / 10000).toFixed(1) + '万' : t.amount) : (t.count > 0 ? t.count + '笔' : '')}</span>
          <div style="width:100%;max-width:26px;height:${h}px;border-radius:5px 5px 0 0;background:${isCur ? 'linear-gradient(180deg,#ffb36b,#ff8a4c)' : 'var(--surface-strong)'};"></div>
          <span style="font-size:10px;color:var(--text-muted);">${t.label}</span>
        </div>`;
      }).join('')}
    </div>
    <div style="font-size:11.5px;color:var(--text-muted);margin-top:10px;">本月合计 ${totalCount} 笔${sensitive ? ` · ${totalAmount.toLocaleString()} 元` : ''}（按记录日期统计）</div>`;
  requestAnimationFrame(() => drawDonut(slices, sensitive ? 'amount' : 'count', sensitive ? totalAmount : totalCount));
}

function drawDonut(slices: ReturnType<typeof categoryBreakdown>, metric: 'amount' | 'count', total: number) {
  const canvas = document.getElementById('donutCanvas') as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d')!;
  const dpr = 2;
  canvas.width = 170 * dpr; canvas.height = 170 * dpr;
  ctx.scale(dpr, dpr);
  const cx = 85, cy = 85, r = 70, inner = 46;
  ctx.clearRect(0, 0, 170, 170);
  if (slices.length === 0 || total <= 0) {
    ctx.fillStyle = '#f2e9db';
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#a39684'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('暂无数据', cx, cy + 4); ctx.textAlign = 'left';
    return;
  }
  let start = -Math.PI / 2;
  for (const s of slices) {
    const v = metric === 'amount' ? s.amount : s.count;
    const angle = (v / total) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, start + angle);
    ctx.closePath(); ctx.fillStyle = s.color; ctx.fill();
    start += angle;
  }
  ctx.beginPath(); ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff'; ctx.fill();
  ctx.fillStyle = '#3b332b'; ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(metric === 'amount' ? `${Math.round(total).toLocaleString()}` : `${total} 笔`, cx, cy + 2);
  ctx.font = '10px sans-serif'; ctx.fillStyle = '#a39684';
  ctx.fillText(metric === 'amount' ? '本月投入（元）' : '本月投入', cx, cy + 18);
  ctx.textAlign = 'left';
}

// ---------- 习惯打卡 ----------
const HABIT_ICONS = ['⭐', '📖', '💪', '🏃', '🧘', '🎯', '💧', '🌙', '☀️', '✍️', '🎨', '🎸', '💻', '🌱', '🧠', '🙏'];
const HABIT_COLORS = CATEGORY_COLORS;

function renderHabitCard(u: UserProfile) {
  const body = document.getElementById('habitBody');
  if (!body) return;
  const habits = (u.habits || []).filter((h) => !h.archived);
  if (habits.length === 0) {
    body.innerHTML = `<div style="font-size:12.5px;color:var(--text-secondary);line-height:1.7;margin-bottom:10px;">像 Todo 软件一样，给自己定几个每日小习惯，打卡会自动记入成长轨迹。</div>
      <button class="btn-primary" style="width:100%;" onclick="showHabitForm()">＋ 新建第一个习惯</button>`;
    return;
  }
  const today = todayKey();
  body.innerHTML = habits.map((h) => {
    const st = getHabitStatus(u, h);
    const dots = st.weekDots.map((hit, i) => {
      const d = new Date();
      const dow = (d.getDay() + 6) % 7;
      const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - dow);
      monday.setDate(monday.getDate() + i);
      const future = dayKey(monday) > today;
      return `<span class="week-dot ${hit ? 'hit' : ''} ${future ? 'future' : ''}" style="${hit ? `background:${h.color};border-color:${h.color};` : ''}" title="${dayKey(monday)}"></span>`;
    }).join('');
    return `<div class="habit-row">
      <span class="habit-icon" style="background:${h.color}22;color:${h.color}">${h.icon}</span>
      <div class="habit-main">
        <div class="habit-name">${esc(h.name)} <span class="habit-streak">🔥 ${st.streak}</span></div>
        <div class="habit-sub">
          <span class="week-dots">${dots}</span>
          ${h.cadence === 'weekly' ? `<span class="habit-target">${st.weekCount}/${h.timesPerWeek} 次</span>` : `<a onclick="showHabitDetail('${h.id}')">最佳 ${st.bestStreak} 天</a>`}
        </div>
      </div>
      <button class="habit-check ${st.doneToday ? 'done' : ''}" style="${st.doneToday ? `background:${h.color};border-color:${h.color};` : `color:${h.color};border-color:${h.color};`}" onclick="toggleHabit('${h.id}')">${st.doneToday ? '✓' : '打卡'}</button>
    </div>`;
  }).join('') + `<div style="display:flex;gap:8px;margin-top:10px;">
      <button class="dash-btn" style="flex:1;" onclick="showHabitForm()">＋ 新习惯</button>
      <button class="dash-btn" style="flex:1;" onclick="showHabitManager()">管理</button>
    </div>`;
}

(window as any).toggleHabit = toggleHabit;
function toggleHabit(habitId: string, key: string = todayKey()) {
  if (!user) return;
  const u = user;
  const h = (u.habits || []).find((x) => x.id === habitId);
  if (!h) return;
  const prevStreak = getHabitStatus(u, h).streak;
  const r = toggleCheck(u, habitId, key);
  let next = r.user;
  if (r.action === 'checked') {
    // 今日打卡且习惯开启联动 → 记一笔 0 元投入事件
    if (key === todayKey() && h.investOnCheck) {
      const opts = getTypeOptions(u);
      const opt = h.linkedType ? opts.find((o) => o.key === h.linkedType) : undefined;
      next.investments.push({
        date: new Date(), amount: 0,
        type: opt?.type || 'other', customType: opt?.customId,
        desc: `「${h.name}」打卡`,
      });
    }
    const st = getHabitStatus(next, h);
    if (prevStreak < 7 && st.streak >= 7) {
      next = addSystemEvent(next, { icon: '🔥', title: `「${h.name}」连续打卡 7 天`, date: new Date() });
    } else if (prevStreak < 30 && st.streak >= 30) {
      next = addSystemEvent(next, { icon: '🌟', title: `「${h.name}」连续打卡 30 天`, date: new Date() });
    }
  }
  user = next;
  saveUser(user);
  const openedModal = document.querySelector('#modalContainer .modal');
  showDashboard();
  if (openedModal) showHabitDetail(habitId);
  showToast(r.action === 'checked'
    ? `✅ 打卡成功！🔥 连续 ${getHabitStatus(user, h).streak} 天`
    : '已取消今日打卡');
}

(window as any).showHabitForm = showHabitForm;
function showHabitForm(editId?: string) {
  if (!user) return;
  const u = user;
  const h = editId ? (u.habits || []).find((x) => x.id === editId) : null;
  const typeOpts = getTypeOptions(u).map((o) =>
    `<option value="${o.key}" ${h?.linkedType === o.key ? 'selected' : ''}>${o.icon} ${o.label}</option>`).join('');
  const modal = createModal(h ? '✏️ 编辑习惯' : '＋ 新建习惯', '小而稳定的习惯，是最靠谱的成长杠杆');
  modal.querySelector('.modal-body')!.innerHTML = `
    <input type="text" id="hName" maxlength="16" placeholder="习惯名称，如：每天阅读 20 分钟" value="${esc(h?.name || '')}" style="width:100%;margin-bottom:12px;">
    <label class="field-label">图标</label>
    ${chipPicker('hIcon', HABIT_ICONS, h?.icon || '⭐', 'emoji')}
    <label class="field-label">颜色</label>
    ${chipPicker('hColor', HABIT_COLORS, h?.color || '#ff8a4c', 'color')}
    <label class="field-label">频率</label>
    <select id="hCadence" style="width:100%;margin:6px 0 10px;" onchange="document.getElementById('hTimesRow').style.display=this.value==='weekly'?'flex':'none';">
      <option value="daily" ${h?.cadence === 'daily' ? 'selected' : ''}>每天</option>
      <option value="weekly" ${h?.cadence === 'weekly' ? 'selected' : ''}>每周 N 次</option>
    </select>
    <div id="hTimesRow" style="align-items:center;gap:8px;margin-bottom:12px;display:${h?.cadence === 'weekly' ? 'flex' : 'none'};">
      每周完成 <input type="number" id="hTimes" min="1" max="7" value="${h?.timesPerWeek || 3}" style="width:70px;"> 次
    </div>
    <label class="field-label">打卡联动（可选）</label>
    <select id="hLinked" style="width:100%;margin:6px 0 10px;">
      <option value="">不关联投入分类（默认）</option>${typeOpts}
    </select>
    <label style="display:flex;align-items:center;gap:8px;font-size:13px;margin-bottom:16px;cursor:pointer;">
      <input type="checkbox" id="hInvest" ${h?.investOnCheck === false ? '' : 'checked'}> 打卡时自动记一笔 0 元投入（让指数看到你的坚持）
    </label>
    <div class="form-actions">
      ${h ? '<button class="dash-btn danger" onclick="habitDelete(\'' + h.id + '\')">删除习惯</button>' : ''}
      <button class="btn-primary" onclick="habitSave('${h?.id || ''}')">${h ? '保存' : '创建习惯'}</button>
    </div>`;
}

(window as any).habitSave = function (editId: string) {
  if (!user) return;
  const u = user;
  const name = (document.getElementById('hName') as HTMLInputElement).value.trim();
  if (!name) { showToast('请填写习惯名称'); return; }
  const data = {
    name,
    icon: document.getElementById('hIcon')!.dataset.value || '⭐',
    color: document.getElementById('hColor')!.dataset.value || '#ff8a4c',
    cadence: (document.getElementById('hCadence') as HTMLSelectElement).value as 'daily' | 'weekly',
    timesPerWeek: Math.min(7, Math.max(1, Number((document.getElementById('hTimes') as HTMLInputElement).value) || 3)),
    linkedType: (document.getElementById('hLinked') as HTMLSelectElement).value || undefined,
    investOnCheck: (document.getElementById('hInvest') as HTMLInputElement).checked,
  };
  if (editId) {
    const old = (u.habits || []).find((x) => x.id === editId);
    if (old) Object.assign(old, data);
  } else {
    const habit = createHabit(data);
    u.habits = [...(u.habits || []), habit];
  }
  saveUser(u); closeModal(); showHabitManager(); showDashboard(); showToast('✅ 习惯已保存');
};

(window as any).showHabitManager = showHabitManager;
function showHabitManager() {
  if (!user) return;
  const u = user;
  const modal = createModal('🗂️ 习惯管理', '归档后习惯不再出现在今日列表，记录保留');
  const list = (u.habits || []).map((h) => {
    const st = getHabitStatus(u, h);
    return `<div class="ct-row ${h.archived ? 'archived' : ''}">
      <span class="ct-icon" style="background:${h.color}22;color:${h.color}">${h.icon}</span>
      <span class="ct-name">${esc(h.name)} <small>${h.cadence === 'daily' ? '每天' : `每周${h.timesPerWeek}次`} · 🔥${st.streak} · 最佳${st.bestStreak}</small></span>
      <span class="ct-ops">
        <a onclick="showHabitDetail('${h.id}')">热力图</a>
        <a onclick="showHabitForm('${h.id}')">编辑</a>
        ${h.archived ? `<a onclick="habitRestore('${h.id}')">恢复</a>` : `<a onclick="habitArchive('${h.id}')">归档</a>`}
      </span>
    </div>`;
  }).join('') || '<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:8px;">还没有习惯</div>';
  modal.querySelector('.modal-body')!.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">${list}</div>
    <button class="btn-primary" style="width:100%;" onclick="showHabitForm()">＋ 新建习惯</button>`;
}
(window as any).habitArchive = function (id: string) {
  if (!user) return;
  const h = user.habits!.find((x) => x.id === id);
  if (h) h.archived = true;
  saveUser(user); showHabitManager(); showDashboard();
};
(window as any).habitRestore = function (id: string) {
  if (!user) return;
  const h = user.habits!.find((x) => x.id === id);
  if (h) h.archived = false;
  saveUser(user); showHabitManager(); showDashboard();
};
(window as any).habitDelete = function (id: string) {
  if (!user) return;
  if (!confirm('删除习惯会同时删除它的全部打卡记录，确定吗？')) return;
  user.habits = (user.habits || []).filter((h) => h.id !== id);
  user.habitChecks = (user.habitChecks || []).filter((c) => c.habitId !== id);
  saveUser(user); closeModal(); showHabitManager(); showDashboard();
};

(window as any).showHabitDetail = showHabitDetail;
function showHabitDetail(id: string) {
  if (!user) return;
  const u = user;
  const h = (u.habits || []).find((x) => x.id === id);
  if (!h) return;
  const st = getHabitStatus(u, h);
  const heat = getHeatmap(u, h, 12);
  const weekdayLabels = ['一', '二', '三', '四', '五', '六', '日'];
  // 转成行优先：7 行 x 12 列
  const cells: string[] = [];
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 12; col++) {
      const d = heat[col][row];
      const cls = d.checked ? 'checked' : d.future ? 'future' : 'empty';
      const style = d.checked ? `background:${h.color};` : '';
      const click = d.future ? '' : `onclick="toggleHabit('${h.id}','${d.date}')"`;
      cells.push(`<span class="heat-cell ${cls}" title="${d.date}${d.makeup ? '（补卡）' : ''}" ${click} style="${style}">${d.makeup ? '·' : ''}</span>`);
    }
  }
  const modal = createModal(`${h.icon} ${esc(h.name)} · 打卡详情`, '点击空格可以补卡，补卡会正常计入连续天数');
  modal.querySelector('.modal-body')!.innerHTML = `
    <div style="display:flex;gap:14px;margin-bottom:16px;flex-wrap:wrap;">
      <div class="habit-stat"><span>🔥</span><div><strong>${st.streak}</strong><small>当前连续</small></div></div>
      <div class="habit-stat"><span>🏅</span><div><strong>${st.bestStreak}</strong><small>最佳连续（天）</small></div></div>
      <div class="habit-stat"><span>📅</span><div><strong>${st.weekCount}${h.cadence === 'weekly' ? '/' + h.timesPerWeek : ''}</strong><small>本周次数</small></div></div>
    </div>
    <div style="display:flex;gap:6px;align:flex-start;">
      <div style="display:flex;flex-direction:column;gap:3px;padding-top:2px;">
        ${weekdayLabels.map((w) => `<span style="height:22px;font-size:10px;line-height:18px;color:var(--text-muted);">${w}</span>`).join('')}
      </div>
      <div class="heatmap">${cells.join('')}</div>
    </div>
    <div style="font-size:11px;color:var(--text-muted);margin-top:10px;">近 12 周 · 颜色越深代表已打卡 · 「·」为补卡</div>
    <div class="form-actions" style="margin-top:14px;">
      <button class="dash-btn" onclick="showHabitForm('${h.id}')">编辑习惯</button>
      <button class="btn-primary" onclick="closeModal()">完成</button>
    </div>`;
}

// ---------- 成长待办 ----------
function renderTodoCard(u: UserProfile) {
  const body = document.getElementById('todoBody');
  if (!body) return;
  const todos = sortTodos(u.todos || []).slice(0, 20);
  const today = todayKey();
  const priMeta: Record<number, { label: string; color: string }> = {
    1: { label: '高优先', color: '#e05c4b' },
    2: { label: '中', color: '#f5a623' },
    3: { label: '低', color: '#a39684' },
  };
  body.innerHTML = (todos.length === 0 ? '<div style="color:var(--text-muted);font-size:13px;margin-bottom:10px;">还没有待办，写下一件想推进的小事吧</div>' : '') +
    todos.map((t) => {
      const overdue = isOverdue(t, today);
      const p = priMeta[t.priority];
      return `<div class="todo-row ${t.done ? 'done' : ''}" style="border-left-color:${p.color}">
        <span class="todo-check" onclick="todoToggle('${t.id}')">${t.done ? '✓' : ''}</span>
        <div class="todo-main" onclick="todoToggle('${t.id}')">
          <div class="todo-title">${esc(t.title)}</div>
          <div class="todo-meta">
            <span class="todo-pri" style="color:${p.color}">${p.label}</span>
            ${t.dueDate ? `<span class="todo-due ${overdue ? 'overdue' : ''}">${overdue ? '已逾期 · ' : ''}${t.dueDate.slice(5)} 截止</span>` : ''}
            ${t.done ? `<a onclick="event.stopPropagation();todoConvertInvest('${t.id}')">→ 记投入</a> <a onclick="event.stopPropagation();todoConvertJournal('${t.id}')">→ 写感悟</a>` : ''}
          </div>
        </div>
        <span class="i-edit" onclick="editTodo('${t.id}')">✏️</span>
      </div>`;
    }).join('');
}

(window as any).todoAdd = function () {
  if (!user) return;
  const title = (document.getElementById('todoInput') as HTMLInputElement).value.trim();
  if (!title) { showToast('先写点什么吧'); return; }
  const priority = Number((document.getElementById('todoPriority') as HTMLSelectElement).value) as 1 | 2 | 3;
  const dueDate = (document.getElementById('todoDue') as HTMLInputElement).value || undefined;
  user.todos = [...(user.todos || []), createTodo({ title, priority, dueDate })];
  saveUser(user);
  (document.getElementById('todoInput') as HTMLInputElement).value = '';
  (document.getElementById('todoDue') as HTMLInputElement).value = '';
  showDashboard();
  showToast('✅ 已添加');
};
(window as any).todoToggle = function (id: string) {
  if (!user) return;
  const t = (user.todos || []).find((x) => x.id === id);
  if (!t) return;
  const wasDone = t.done;
  Object.assign(t, toggleDone(t));
  saveUser(user);
  showDashboard();
  if (!wasDone) showToast('🎉 完成一件！可以把它转成投入或感悟');
};
(window as any).editTodo = function (id: string) {
  if (!user) return;
  const t = (user.todos || []).find((x) => x.id === id);
  if (!t) return;
  const modal = createModal('✏️ 编辑待办', '');
  modal.querySelector('.modal-body')!.innerHTML = `
    <input type="text" id="tTitle" value="${esc(t.title)}" maxlength="60" style="width:100%;margin-bottom:12px;">
    <textarea id="tNote" rows="2" placeholder="备注（可选）" style="width:100%;margin-bottom:12px;">${esc(t.note || '')}</textarea>
    <div style="display:flex;gap:10px;margin-bottom:12px;">
      <select id="tPriority" style="flex:1;">
        <option value="1" ${t.priority === 1 ? 'selected' : ''}>高优先</option>
        <option value="2" ${t.priority === 2 ? 'selected' : ''}>中优先</option>
        <option value="3" ${t.priority === 3 ? 'selected' : ''}>低优先</option>
      </select>
      <input type="date" id="tDue" value="${t.dueDate || ''}" style="flex:1;">
    </div>
    <div class="form-actions" style="justify-content:space-between;">
      <button class="dash-btn danger" onclick="todoDelete('${t.id}')">删除</button>
      <button class="btn-primary" onclick="todoSave('${t.id}')">保存</button>
    </div>`;
};
(window as any).todoSave = function (id: string) {
  if (!user) return;
  const t = (user.todos || []).find((x) => x.id === id);
  if (!t) return;
  const title = (document.getElementById('tTitle') as HTMLInputElement).value.trim();
  if (!title) { showToast('标题不能为空'); return; }
  t.title = title;
  t.note = (document.getElementById('tNote') as HTMLTextAreaElement).value.trim() || undefined;
  t.priority = Number((document.getElementById('tPriority') as HTMLSelectElement).value) as 1 | 2 | 3;
  t.dueDate = (document.getElementById('tDue') as HTMLInputElement).value || undefined;
  saveUser(user); closeModal(); showDashboard(); showToast('✅ 已保存');
};
(window as any).todoDelete = function (id: string) {
  if (!user) return;
  if (!confirm('删除这条待办？')) return;
  user.todos = (user.todos || []).filter((x) => x.id !== id);
  saveUser(user); closeModal(); showDashboard();
};
(window as any).todoConvertInvest = function (id: string) {
  if (!user) return;
  const t = (user.todos || []).find((x) => x.id === id);
  if (!t) return;
  const el = document.getElementById('investDesc') as HTMLInputElement;
  el.value = `完成：${t.title}`;
  closeModal();
  document.getElementById('investAmount')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  document.getElementById('investAmount')?.focus({ preventScroll: true });
  showToast('已填入投入描述，补个金额或直接添加');
};
(window as any).todoConvertJournal = function (id: string) {
  if (!user) return;
  const t = (user.todos || []).find((x) => x.id === id);
  if (!t) return;
  const el = document.getElementById('journalInput') as HTMLInputElement;
  el.value = `今天完成了「${t.title}」`;
  closeModal();
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.focus();
};

// ---------- 成长大事记 ----------
const EVENT_ICONS = ['🌟', '🎉', '🎓', '💼', '💍', '🏠', '🏆', '🚀', '🌈', '🧭'];
(window as any).showTimelineModal = showTimelineModal;
function showTimelineModal() {
  if (!user) return;
  const u = user;
  const tl = buildTimeline(u);
  const modal = createModal('📅 成长大事记', '你的每一笔投入、感悟与重要时刻，都会沉淀在这里');
  modal.querySelector('.modal-body')!.innerHTML = `
    <div class="sub-form" style="margin-bottom:18px;">
      <div style="font-weight:bold;margin-bottom:8px;">记录一个大事件</div>
      ${chipPicker('eIcon', EVENT_ICONS, '🌟', 'emoji')}
      <input type="text" id="eTitle" placeholder="事件标题，如：拿到心仪 offer" style="width:100%;margin:10px 0;">
      <div style="display:flex;gap:10px;">
        <input type="date" id="eDate" value="${todayKey()}" max="${todayKey()}" style="flex:1;">
        <button class="btn-primary" onclick="timelineAdd()">添加</button>
      </div>
      <input type="text" id="eDesc" placeholder="备注（可选）" style="width:100%;margin-top:10px;">
    </div>
    ${tl.achievedMilestones.length ? `<div style="margin-bottom:16px;"><div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">🏅 已达成的里程碑</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">${tl.achievedMilestones.map((m) => `<span class="milestone-chip">${m.icon} ${esc(m.name)}</span>`).join('')}</div></div>` : ''}
    <div class="timeline">
      ${tl.months.length === 0 ? '<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:16px;">还没有大事记，去记一笔投入或写句话吧</div>' : ''}
      ${tl.months.map((m) => `
        <div class="tl-month">
          <div class="tl-month-label">${m.label}</div>
          <div class="tl-items">
            ${m.items.map((it) => `<div class="tl-item">
              <span class="tl-dot">${it.icon}</span>
              <div class="tl-content">
                <div class="tl-title">${esc(it.title)}</div>
                <div class="tl-desc">${it.date.toLocaleDateString('zh-CN')}${it.desc ? ' · ' + esc(it.desc) : ''}</div>
              </div>
              ${it.deletable ? `<span class="i-edit" onclick="timelineDelete('${it.id}')">🗑</span>` : ''}
            </div>`).join('')}
          </div>
        </div>`).join('')}
    </div>`;
}
(window as any).timelineAdd = function () {
  if (!user) return;
  const title = (document.getElementById('eTitle') as HTMLInputElement).value.trim();
  if (!title) { showToast('写个标题吧'); return; }
  const icon = document.getElementById('eIcon')!.dataset.value || '🌟';
  const dateVal = (document.getElementById('eDate') as HTMLInputElement).value;
  const desc = (document.getElementById('eDesc') as HTMLInputElement).value.trim() || undefined;
  user = addManualEvent(user, { title, icon, desc, date: dateVal ? parseKey(dateVal) : new Date() });
  saveUser(user);
  showTimelineModal();
  showToast('✅ 已加入大事记');
};
(window as any).timelineDelete = function (id: string) {
  if (!user) return;
  user = deleteEvent(user, id);
  saveUser(user);
  showTimelineModal();
};

// ---------- 指数预警线 ----------
(window as any).showAlertModal = showAlertModal;
function showAlertModal() {
  if (!user) return;
  const u = user;
  const price = Math.round(calculateStock(u).price);
  const a = u.priceAlert || {};
  const modal = createModal('⚑ 指数预警线', '本地计算：成长指数触及目标位或回落至支撑位时，给你一个提示');
  modal.querySelector('.modal-body')!.innerHTML = `
    <div style="padding:10px 14px;background:var(--surface-softer);border-radius:10px;font-size:13px;margin-bottom:14px;">当前指数：<strong>${price} 点</strong></div>
    <label class="field-label">🎯 目标位（点）</label>
    <input type="number" id="alertTarget" value="${a.target ?? ''}" placeholder="如 ${price + 30}，留空不设" style="width:100%;margin:6px 0 14px;">
    <label class="field-label">🟡 支撑位（点）</label>
    <input type="number" id="alertFloor" value="${a.floor ?? ''}" placeholder="如 ${Math.max(50, price - 20)}，留空不设" style="width:100%;margin:6px 0 14px;">
    <div class="form-actions" style="justify-content:space-between;">
      <button class="dash-btn" onclick="alertClear()">清除预警</button>
      <button class="btn-primary" onclick="alertSave()">保存</button>
    </div>`;
}
(window as any).alertSave = function () {
  if (!user) return;
  const t = Number((document.getElementById('alertTarget') as HTMLInputElement).value);
  const f = Number((document.getElementById('alertFloor') as HTMLInputElement).value);
  const prev = user.priceAlert || {};
  user.priceAlert = {
    target: t > 0 ? t : undefined,
    floor: f > 0 ? f : undefined,
    // 修改了线位则重新判定
    targetHit: t > 0 && t === prev.target ? !!prev.targetHit : false,
    floorHit: f > 0 && f === prev.floor ? !!prev.floorHit : false,
  };
  saveUser(user); closeModal(); showDashboard(); showToast('✅ 预警线已保存');
};
(window as any).alertClear = function () {
  if (!user) return;
  user.priceAlert = undefined;
  saveUser(user); closeModal(); showDashboard();
};
function renderAlertBadge(u: UserProfile) {
  const el = document.getElementById('alertBadge');
  if (!el) return;
  const a = u.priceAlert;
  if (!a) { el.innerHTML = ''; return; }
  const parts: string[] = [];
  if (a.targetHit) parts.push(`<span class="alert-chip hit">🎉 已突破 ${a.target} 点</span>`);
  if (a.floorHit) parts.push(`<span class="alert-chip warn">🟡 在支撑位 ${a.floor} 附近</span>`);
  el.innerHTML = parts.join(' ');
}

// ---------- 今日行情条 ----------
function renderTodayStrip(u: UserProfile, stock: StockSnapshotLike) {
  const el = document.getElementById('todayStrip');
  if (!el) return;
  const now = new Date();
  const h = now.getHours();
  const greet = h < 6 ? '夜深了' : h < 11 ? '早上好' : h < 14 ? '中午好' : h < 18 ? '下午好' : '晚上好';
  const week = '周' + ['日', '一', '二', '三', '四', '五', '六'][now.getDay()];
  const habits = (u.habits || []).filter((x) => !x.archived);
  const doneHabits = habits.filter((x) => getHabitStatus(u, x).doneToday).length;
  const today = todayKey();
  const journalToday = (u.journals || []).some((j) => dayKey(new Date(j.date)) === today);
  const invToday = (u.investments || []).some((inv) => dayKey(new Date(inv.date)) === today);
  const recordedToday = journalToday || invToday;
  const maxStreak = habits.reduce((m, x) => Math.max(m, getHabitStatus(u, x).streak), 0);
  // 连续记录天数（含一句话与投入）
  const recordStreak = (() => {
    const dates = new Set<string>();
    (u.journals || []).forEach((j) => dates.add(dayKey(new Date(j.date))));
    (u.investments || []).forEach((inv) => dates.add(dayKey(new Date(inv.date))));
    let s = 0;
    const d = new Date();
    while (dates.has(dayKey(d))) { s++; d.setDate(d.getDate() - 1); }
    return s;
  })();
  let cta: string;
  if (habits.length > 0 && doneHabits < habits.length) {
    cta = `<button class="strip-cta" onclick="document.getElementById('habitCard').scrollIntoView({behavior:'smooth',block:'center'})">去打卡 →</button>`;
  } else if (!recordedToday) {
    cta = `<button class="strip-cta" onclick="document.getElementById('journalInput').scrollIntoView({behavior:'smooth',block:'center'});document.getElementById('journalInput').focus();">写一句 →</button>`;
  } else {
    cta = `<span class="strip-done">✨ 今天也在长进</span>`;
  }
  el.innerHTML = `
    <div class="strip-left">
      <span class="strip-avatar">${u.avatar || '🌱'}</span>
      <div>
        <div class="strip-greet">${greet}，${esc(u.nickname || '朋友')}${u.seedTester ? ' <span style="font-size:11px;color:#5B9A6F;border:1px solid rgba(91,154,111,0.5);border-radius:99px;padding:1px 8px;margin-left:4px;vertical-align:middle;white-space:nowrap;">🌱 种子体验官</span>' : ''}</div>
        <div class="strip-sub">${now.getMonth() + 1}月${now.getDate()}日 ${week}${u.indexName ? ` · ${esc(u.indexName)}` : ''}${u.signature ? ` · ${esc(u.signature)}` : ''}</div>
      </div>
    </div>
    <div class="strip-right">
      <span class="strip-chip ${habits.length > 0 && doneHabits === habits.length ? 'ok' : ''}">✅ 习惯 ${doneHabits}/${habits.length}</span>
      <span class="strip-chip ${recordedToday ? 'ok' : ''}">${recordedToday ? '📝 已记录' : '📝 未记录'}</span>
      ${recordStreak > 0 ? `<span class="strip-chip fire">🔥 连续 ${recordStreak} 天</span>` : ''}
      ${maxStreak > 0 ? `<span class="strip-chip fire">🔥 ${maxStreak} 天</span>` : ''}
      <span class="strip-price" style="color:${stock.change >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}">${Math.round(stock.price)} 点 · ${stock.change >= 0 ? '+' : ''}${stock.change}%</span>
      ${cta}
    </div>`;
}
type StockSnapshotLike = { price: number; change: number };

// ============ v1.3 强化调查表（用真实履历校准 K 线） ============
const SURVEY_TITLES = ['① 教育经历', '② 职业与收入', '③ 大额投入', '④ 当前状态', '⑤ 家庭与波折', '⑥ 确认应用'];
const SURVEY_DESCS = [
  '填真实的学费与培训花费，曲线会用真实数字替换对应年龄的统计估算；记不清就留空',
  '有了工作轨迹，学生时代不再虚增收入贡献，工作后的成长曲线按你的真实涨薪节奏走',
  '回忆几笔影响很大的真实投入（考研、留学、私教、证书…），记不清金额可填 0 只记事件',
  '用现在的真实状态校准成长系数与质量系数',
  '家庭支持单独计入累计成长值；波折会在对应年龄形成一次可解释的回撤',
  '确认后，K 线将以真实数据为主、统计估算只补空白年份',
];
const SETBACK_OPTS: { t: SurveySetbackInput['type']; n: string }[] = [
  { t: 'jobloss', n: '💼 工作变动' },
  { t: 'illness', n: '🏥 健康风波' },
  { t: 'loss', n: '🌧️ 失去与告别' },
  { t: 'stagnate', n: '🪫 长期停滞' },
];
let surveyStep = 0;
let surveyDraft: EnhancedSurveyInput | null = null;
let surveyEduChecked: boolean[] = [];

function defaultWorkStart(edu: string): number {
  return edu === 'master' ? 25 : edu === 'bachelor' || edu === 'college' ? 22 : edu === 'senior' ? 18 : 16;
}
function eduAgeBand(age: number): string {
  if (age <= 2) return '0-2';
  if (age <= 5) return '3-5';
  if (age <= 14) return '6-14';
  if (age <= 17) return '15-17';
  return '18-22';
}
function initSurveyDraft(u: UserProfile): EnhancedSurveyInput {
  const saved = u.enhancedSurvey;
  const presetRows = defaultEduStages(u);
  surveyEduChecked = saved?.eduStages?.length
    ? presetRows.map((p) => saved.eduStages!.some((s) => s.name === p.name))
    : presetRows.map((p) => p.enrolled);
  return {
    eduStages: saved?.eduStages?.length
      ? saved.eduStages.map((s) => ({ ...s }))
      : presetRows.map((p) => ({ name: p.name, startAge: p.startAge, endAge: p.endAge, totalCost: 0 })),
    bigInvests: saved?.bigInvests ? saved.bigInvests.map((b) => ({ ...b })) : [],
    career: {
      workStartAge: saved?.career?.workStartAge ?? defaultWorkStart(u.education),
      startingSalary: saved?.career?.startingSalary,
      avgRaisePct: saved?.career?.avgRaisePct ?? 5,
      currentSalary: saved?.career?.currentSalary ?? u.annualIncome,
    },
    studyHours: saved?.studyHours ?? u.studyHours,
    healthScore: saved?.healthScore ?? u.healthScore,
    familySupportCapital: (saved?.familySupportCapital ?? u.familySupportCapital) || 0,
    setbacks: saved?.setbacks ? saved.setbacks.map((s) => ({ ...s })) : [],
  };
}

(window as any).showSurveyModal = function (step = 0) {
  if (!user) return;
  surveyStep = step;
  surveyDraft = initSurveyDraft(user);
  renderSurvey();
};

function svMoneyAttr(): string {
  return isSensitiveConsented() ? '' : 'disabled';
}

function renderSurvey() {
  if (!user || !surveyDraft) return;
  const u = user;
  const d = surveyDraft;
  const moneyOK = isSensitiveConsented();
  const i = surveyStep;
  const modal = createModal('📋 强化调查 · ' + SURVEY_TITLES[i], SURVEY_DESCS[i]);
  const dots = SURVEY_TITLES.map((_, k) =>
    `<span class="sv-dot ${k === i ? 'active' : ''} ${k < i ? 'done' : ''}">${k < i ? '✓' : k + 1}</span>`).join('');
  let body = `<div class="sv-dots">${dots}</div>`;

  if (i === 0) {
    body += `<div class="sv-tip">以下年龄为常规学制参考，可自行修改；勾选并填写总花费的阶段才会替换估算${moneyOK ? '' : '（未授权金额信息，金额框已停用，仅年龄/学历仍可确认）'}</div>`;
    body += (d.eduStages || []).map((s, k) => {
      const on = surveyEduChecked[k];
      const years = Math.max(1, s.endAge - s.startAge + 1);
      const mid = Constants.AGE_SPEND_RANGE[eduAgeBand(s.startAge)]?.mid || 30000;
      return `<div class="sv-edu-row ${on ? '' : 'off'}">
        <label style="display:flex;align-items:center;gap:6px;min-width:110px;font-weight:600;font-size:13px;cursor:pointer;">
          <input type="checkbox" ${on ? 'checked' : ''} onchange="this.closest('.sv-edu-row').classList.toggle('off',!this.checked)"> ${s.name}
        </label>
        <span style="display:flex;align-items:center;gap:4px;font-size:12.5px;color:var(--text-secondary);">
          <input type="number" class="sv-edu-start" value="${s.startAge}" min="0" max="${u.age}" style="width:52px;padding:6px;">
          ~<input type="number" class="sv-edu-end" value="${s.endAge}" min="0" max="${u.age}" style="width:52px;padding:6px;">岁
        </span>
        <input type="number" class="sv-edu-cost" value="${s.totalCost || ''}" placeholder="总花费（参考约 ${Math.round(mid * years / 10000)} 万）" ${svMoneyAttr()} style="flex:1;min-width:150px;padding:8px 10px;font-size:13px;">
      </div>`;
    }).join('');
  } else if (i === 1) {
    body += `<div class="sv-field"><label>参加工作年龄</label>
      <input type="number" id="svWorkStart" value="${d.career?.workStartAge ?? ''}" min="0" max="${u.age}" style="width:100%;padding:9px 12px;"></div>`;
    body += `<div class="sv-field"><label>第一份工作年薪（元）${moneyOK ? '' : '· 未授权金额，已停用'}</label>
      <input type="number" id="svStartSalary" value="${d.career?.startingSalary ?? ''}" placeholder="如 80000" ${svMoneyAttr()} style="width:100%;padding:9px 12px;"></div>`;
    body += `<div class="sv-field"><label>年均加薪幅度（%，可为负）</label>
      <input type="number" id="svRaise" value="${d.career?.avgRaisePct ?? 5}" step="0.5" style="width:100%;padding:9px 12px;"></div>`;
    body += `<div class="sv-field"><label>当前年薪确认（元）${moneyOK ? '' : '· 未授权金额，已停用'}</label>
      <input type="number" id="svCurrentSalary" value="${d.career?.currentSalary ?? ''}" ${svMoneyAttr()} style="width:100%;padding:9px 12px;"></div>`;
    if (!moneyOK) body += `<div class="sv-tip">在隐私设置中授权金额信息后，可填写精确薪资；不填则沿用模型估算。</div>`;
  } else if (i === 2) {
    body += `<div class="sv-tip">这些投入会以真实类型计入对应年龄（技能会折旧、健康影响质量系数），让曲线拐点有真实依据。</div>`;
    body += (d.bigInvests || []).map((b, k) => `
      <div class="sv-subrow">
        <select class="sv-bi-age" style="width:78px;">${ageOptions(u.age, b.age)}</select>
        <select class="sv-bi-type" style="flex:1;min-width:96px;">${typeOptions(b.type)}</select>
        <input type="number" class="sv-bi-amount" value="${b.amount || ''}" placeholder="金额，可空" ${svMoneyAttr()} style="width:110px;padding:7px;font-size:12.5px;">
        <input type="text" class="sv-bi-desc" value="${esc(b.desc || '')}" placeholder="描述（可选）" style="flex:2;min-width:120px;padding:7px;font-size:12.5px;">
        <button class="sv-del" onclick="svDelBigInvest(${k})">✕</button>
      </div>`).join('');
    body += `<button class="dash-btn" style="width:100%;margin-top:8px;" onclick="svAddBigInvest()">＋ 添加一笔真实投入</button>`;
  } else if (i === 3) {
    const hs = d.studyHours ?? 5;
    const hp = d.healthScore ?? 70;
    body += `<div class="sv-field"><label>现在平均每周学习 / 自我提升时长（小时）</label>
      <input type="number" id="svHours" value="${hs}" min="0" max="40" step="0.5" style="width:100%;padding:9px 12px;"></div>`;
    body += `<div class="sv-field"><label>当前健康状态自评：<b id="svHealthVal" style="color:var(--accent);">${hp}</b> / 100</label>
      <input type="range" id="svHealth" min="0" max="100" value="${hp}" style="width:100%;" oninput="document.getElementById('svHealthVal').textContent=this.value"></div>
      <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--text-muted);"><span>0 很糟</span><span>50 一般</span><span>100 很好</span></div>`;
  } else if (i === 4) {
    body += `<div class="sv-field"><label>家庭累计支持（万元，选填）${moneyOK ? '' : '· 未授权金额，已停用'}</label>
      <input type="number" id="svFamily" value="${d.familySupportCapital || 0}" min="0" step="1" ${svMoneyAttr()} style="width:100%;padding:9px 12px;">
      <div style="font-size:11.5px;color:var(--text-muted);margin-top:4px;">父母/家庭对你的累计投入折算，不折旧、不乘权重，单独计入累计成长值。</div></div>`;
    body += `<div class="field-label">经历过的重大波折（选填，用于解释曲线上的回撤）</div>`;
    body += (d.setbacks || []).map((s, k) => `
      <div class="sv-subrow">
        <select class="sv-sb-age" style="width:78px;">${ageOptions(u.age, s.age)}</select>
        <select class="sv-sb-type" style="flex:1;min-width:110px;">${SETBACK_OPTS.map((o) => `<option value="${o.t}" ${s.type === o.t ? 'selected' : ''}>${o.n}</option>`).join('')}</select>
        <select class="sv-sb-sev" style="width:96px;">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => `<option value="${n}" ${s.severity === n ? 'selected' : ''}>影响 ${n}/10</option>`).join('')}</select>
        <button class="sv-del" onclick="svDelSetback(${k})">✕</button>
      </div>`).join('');
    body += `<button class="dash-btn" style="width:100%;margin-top:8px;" onclick="svAddSetback()">＋ 添加一段波折</button>`;
  } else {
    const preview = applyEnhancedSurvey(u, d);
    const estBefore = Math.round(preview.before.estimatedRatio * 100);
    const estAfter = Math.round(preview.after.estimatedRatio * 100);
    const cov = preview.coverage;
    const eduCount = (d.eduStages || []).filter((s) => s.totalCost > 0).length;
    body += `<div class="sv-result">
      <div class="sv-result-main">
        <div><span class="sv-big">${estBefore}%</span><span class="sv-arrow">→</span><span class="sv-big" style="color:var(--accent-green);">${estAfter}%</span><div class="sv-cap">估算成分占比</div></div>
        <div><span class="sv-big" style="font-size:18px;">${preview.before.label}</span><span class="sv-arrow">→</span><span class="sv-big" style="font-size:18px;color:var(--accent-green);">${preview.after.label}</span><div class="sv-cap">置信度</div></div>
        <div><span class="sv-big" style="font-size:18px;">${cov.verifiedYears}<small style="font-size:12px;">/${cov.totalYears} 岁</small></span><div class="sv-cap">真实数据覆盖</div></div>
      </div>
      <ul class="sv-summary">
        <li>📚 ${eduCount} 个教育阶段将用真实花费替换统计估算</li>
        <li>💡 ${(d.bigInvests || []).length} 笔大额投入按真实年龄与类型计入</li>
        <li>💼 职业轨迹：${d.career?.workStartAge ?? '?'} 岁参加工作${d.career?.avgRaisePct != null ? `，年均加薪 ${d.career.avgRaisePct}%` : ''}</li>
        <li>💥 ${(d.setbacks || []).length} 段波折会在对应年龄形成可解释的回撤</li>
        <li>📉 真实年份曲线波动收窄，当前点位与实时指数一致</li>
      </ul>
      <div class="sv-tip">数据只保存在本机，随时可重新填写；留空的年份继续使用统计区间估算。</div>
    </div>`;
  }

  body += `<div class="form-actions" style="margin-top:18px;">
    ${i > 0 ? '<button class="dash-btn" onclick="svGo(-1)">上一步</button>' : '<span></span>'}
    ${i < 5
      ? '<button class="btn-primary" onclick="svGo(1)">下一步 →</button>'
      : '<button class="btn-primary" onclick="svApplySurvey()">✅ 应用到我的 K 线</button>'}
  </div>`;
  modal.querySelector('.modal-body')!.innerHTML = body;
}

function ageOptions(maxAge: number, selected?: number): string {
  return Array.from({ length: maxAge + 1 }, (_, a) => `<option value="${a}" ${selected === a ? 'selected' : ''}>${a} 岁</option>`).join('');
}
function typeOptions(selected: InvestType): string {
  return (Object.keys(TYPE_META) as InvestType[]).map((t) =>
    `<option value="${t}" ${selected === t ? 'selected' : ''}>${TYPE_META[t].icon} ${TYPE_META[t].name}</option>`).join('');
}

/** 把当前步 DOM 写回 draft */
function collectSurveyStep() {
  if (!user || !surveyDraft) return;
  const d = surveyDraft;
  const i = surveyStep;
  const num = (id: string) => {
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (!el || el.disabled) return undefined;
    const v = Number(el.value);
    return el.value === '' || isNaN(v) ? undefined : v;
  };
  if (i === 0) {
    const rows = document.querySelectorAll('.sv-edu-row');
    surveyEduChecked = [];
    d.eduStages = [];
    rows.forEach((row, k) => {
      const on = (row.querySelector('input[type=checkbox]') as HTMLInputElement).checked;
      surveyEduChecked.push(on);
      if (!on) return;
      const start = Number((row.querySelector('.sv-edu-start') as HTMLInputElement).value);
      const end = Number((row.querySelector('.sv-edu-end') as HTMLInputElement).value);
      const costEl = row.querySelector('.sv-edu-cost') as HTMLInputElement;
      const cost = costEl.disabled || costEl.value === '' ? 0 : Math.max(0, Number(costEl.value) || 0);
      const name = defaultEduStages(user!)[k]?.name || `阶段${k + 1}`;
      if (isFinite(start) && isFinite(end) && end >= start && start >= 0 && end <= user!.age) {
        d.eduStages!.push({ name, startAge: start, endAge: end, totalCost: cost });
      }
    });
  } else if (i === 1) {
    d.career = {
      workStartAge: num('svWorkStart'),
      startingSalary: num('svStartSalary'),
      avgRaisePct: num('svRaise'),
      currentSalary: num('svCurrentSalary'),
    };
  } else if (i === 2) {
    d.bigInvests = [...document.querySelectorAll('.sv-subrow')]
      .filter((r) => r.querySelector('.sv-bi-age'))
      .map((r) => ({
        age: Number((r.querySelector('.sv-bi-age') as HTMLSelectElement).value),
        type: (r.querySelector('.sv-bi-type') as HTMLSelectElement).value as InvestType,
        amount: Math.max(0, Number((r.querySelector('.sv-bi-amount') as HTMLInputElement).value) || 0),
        desc: ((r.querySelector('.sv-bi-desc') as HTMLInputElement).value || '').trim() || undefined,
      })) as BigInvestInput[];
  } else if (i === 3) {
    d.studyHours = num('svHours');
    d.healthScore = num('svHealth');
  } else if (i === 4) {
    const fam = num('svFamily');
    if (fam !== undefined) d.familySupportCapital = fam;
    d.setbacks = [...document.querySelectorAll('.sv-subrow')]
      .filter((r) => r.querySelector('.sv-sb-age'))
      .map((r) => ({
        age: Number((r.querySelector('.sv-sb-age') as HTMLSelectElement).value),
        type: (r.querySelector('.sv-sb-type') as HTMLSelectElement).value as SurveySetbackInput['type'],
        severity: Number((r.querySelector('.sv-sb-sev') as HTMLSelectElement).value),
      }));
  }
}

(window as any).svGo = function (delta: number) {
  collectSurveyStep();
  surveyStep = Math.max(0, Math.min(5, surveyStep + delta));
  renderSurvey();
};
(window as any).svAddBigInvest = function () {
  collectSurveyStep();
  surveyDraft!.bigInvests = [...(surveyDraft!.bigInvests || []), { age: user!.age, amount: 0, type: 'skill', desc: undefined }];
  renderSurvey();
};
(window as any).svDelBigInvest = function (k: number) {
  collectSurveyStep();
  surveyDraft!.bigInvests = (surveyDraft!.bigInvests || []).filter((_, idx) => idx !== k);
  renderSurvey();
};
(window as any).svAddSetback = function () {
  collectSurveyStep();
  surveyDraft!.setbacks = [...(surveyDraft!.setbacks || []), { age: user!.age - 1, type: 'stagnate', severity: 5 }];
  renderSurvey();
};
(window as any).svDelSetback = function (k: number) {
  collectSurveyStep();
  surveyDraft!.setbacks = (surveyDraft!.setbacks || []).filter((_, idx) => idx !== k);
  renderSurvey();
};
(window as any).svApplySurvey = function () {
  if (!user || !surveyDraft) return;
  collectSurveyStep();
  const result = applyEnhancedSurvey(user, surveyDraft);
  user = result.user;
  saveUser(user);
  closeModal();
  showDashboard();
  showToast(`✅ 已用真实数据重建 K 线（估算成分 ${Math.round(result.before.estimatedRatio * 100)}% → ${Math.round(result.after.estimatedRatio * 100)}%）`);
};

init();
