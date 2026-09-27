import type { UserProfile, InvestType, KlinePoint } from '@life-stock/core';
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

// 暴露给 HTML onclick
(window as any).startOnboarding = startOnboarding;
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

// ============ 问卷流程 ============
function startOnboarding() {
  onboardingStep = 0;
  onboardingData = {};
  document.getElementById('landing')?.classList.add('hidden');
  showOnboardingModal();
}

function showOnboardingModal() {
  const steps = getVisibleSteps();
  const step = steps[onboardingStep];
  const modal = createModal(step.title, step.desc);
  let body = '';
  if (step.type === 'number') {
    body = `<input type="number" id="onboardInput" class="form-input" placeholder="${step.placeholder}" style="width:100%;padding:12px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text-primary);font-size:16px;">`;
  } else if (step.type === 'select') {
    body = `<select id="onboardInput" style="width:100%;padding:12px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text-primary);font-size:16px;">
      ${step.options!.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
    </select>`;
  } else if (step.type === 'multi') {
    body = `<div id="multiOptions" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      ${step.options!.map(o => `<label style="display:flex;align-items:center;gap:8px;padding:10px;background:rgba(255,255,255,0.04);border-radius:10px;cursor:pointer;"><input type="checkbox" value="${o.value}"> ${o.label}</label>`).join('')}
    </div>`;
  }
  body += `<div class="form-actions"><button class="btn-primary" onclick="submitOnboarding()">${onboardingStep === getVisibleSteps().length - 1 ? '生成我的成长曲线' : '下一步'}</button></div>`;
  modal.querySelector('.modal-body')!.innerHTML = body;
}

(window as any).submitOnboarding = submitOnboarding;
function submitOnboarding() {
  const step = getVisibleSteps()[onboardingStep];
  if (step.type === 'multi') {
    const checked = Array.from(document.querySelectorAll('#multiOptions input:checked')).map((i: any) => i.value);
    checked.forEach(f => { (onboardingData as any)[f] = true; });
  } else {
    const val = (document.getElementById('onboardInput') as HTMLInputElement).value;
    if (step.type === 'number') (onboardingData as any)[step.field] = Number(val);
    else (onboardingData as any)[step.field] = val;
  }
  onboardingStep++;
  if (onboardingStep >= getVisibleSteps().length) {
    finishOnboarding();
  } else {
    showOnboardingModal();
  }
}

function finishOnboarding() {
  const age = onboardingData.age as number;
  user = {
    age,
    region: onboardingData.region as any,
    area: 'urban',
    income: onboardingData.income as any,
    education: onboardingData.education as any,
    birthYear: new Date().getFullYear() - age,
    annualIncome: isSensitiveConsented() ? (onboardingData.annualIncome as number) : 100000,
    annualIncomeGrowth: Number(onboardingData.annualIncomeGrowth ?? 0.05),
    studyHours: Number(onboardingData.studyHours),
    healthScore: Number(onboardingData.healthScore),
    debtRatio: isSensitiveConsented() ? Number(onboardingData.debtRatio) : 0,
    hasJob: !!(onboardingData as any).hasJob,
    salaryRaised: !!(onboardingData as any).salaryRaised,
    hasLicense: !!(onboardingData as any).hasLicense,
    marathon: !!(onboardingData as any).marathon,
    married: !!(onboardingData as any).married,
    hasHouse: !!(onboardingData as any).hasHouse,
    hasChild: !!(onboardingData as any).hasChild,
    totalInvest: 0,
    history: generateHistory({
      age, region: onboardingData.region as any, area: 'urban',
      income: onboardingData.income as any, education: onboardingData.education as any,
    }),
    investments: [],
    familySupportCapital: 0,
    subjectiveWeight: 1.0,
    version: FORMULA_VERSION,
  };
  saveUser(user);
  closeModal();
  showDashboard();
  showToast(isSensitiveConsented() ? '✅ 成长曲线已生成！' : '✅ 成长曲线已生成（敏感项使用估算值）');
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
    (conf.level !== 'high' ? `，<a href="javascript:showAnchorModal()" style="color:var(--accent-blue);text-decoration:underline;">校准后可降至 ${potPct}%</a>` : '') +
    `<br><a href="javascript:showDetailModal()" style="color:var(--text-muted);text-decoration:underline;">查看数据来源 →</a>`;

  const kline = generateKline(u);
  drawKline(kline, u);

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
  // 里程碑列表
  renderMilestones(u);
  // 投入记录列表
  renderInvestList(u);
  // 一句话记录
  renderJournals(u);
  // 每周一笔状态
  renderWeeklyStatus(u);
}

// ============ 记一笔投入 ============
(window as any).selectInvestType = selectInvestType;
function selectInvestType(type: InvestType) {
  selectedInvestType = type;
  document.querySelectorAll('.invest-type').forEach((el) => {
    el.classList.toggle('selected', el.getAttribute('data-type') === type);
  });
}

(window as any).addInvestment = addInvestment;
function addInvestment() {
  if (!user) return;
  const amountEl = document.getElementById('investAmount') as HTMLInputElement;
  const descEl = document.getElementById('investDesc') as HTMLInputElement;
  const sensitive = isSensitiveConsented();
  const amount = sensitive ? Number(amountEl.value) : 0;
  if (sensitive && (!amount || amount <= 0)) { showToast('请输入有效金额，或留空仅记录事件'); return; }
  user.investments.push({
    type: selectedInvestType,
    amount,
    desc: descEl.value || undefined,
    date: new Date(),
  });
  user.totalInvest += amount;
  amountEl.value = '';
  descEl.value = '';
  saveUser(user);
  showDashboard();
  showToast(sensitive && amount > 0
    ? `✅ 已记录这笔投入 ${amount.toLocaleString()} 元，成长指数已更新`
    : '✅ 已记录这笔投入，成长指数已更新');
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
  const list = document.getElementById('investList')!;
  if (u.investments.length === 0) {
    list.innerHTML = '<div style="text-align:center;color:var(--text-secondary);padding:30px;">还没有投入记录，记一笔试试吧</div>';
    return;
  }
  const typeIcon: Record<string, string> = { education: '🎓', skill: '📚', health: '💪', network: '🤝', entertainment: '🎮', other: '📦' };
  list.innerHTML = u.investments.slice().reverse().map((inv) => `
    <div class="invest-item">
      <span class="i-type">${typeIcon[inv.type] || '📦'}</span>
      <div class="i-info">
        <div>${inv.desc || inv.type} ${inv.impact ? '<span class="i-impact">⭐ 影响大</span>' : ''}</div>
        <div style="font-size:11px;color:var(--text-muted);">${new Date(inv.date).toLocaleDateString('zh-CN')}</div>
      </div>
      <span class="i-amount">${inv.amount > 0 ? inv.amount.toLocaleString() + ' 元' : '未填金额'}</span>
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
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  for (let i = 0; i <= 4; i++) {
    const y = pad.t + (priceH / 4) * i;
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
    ctx.fillStyle = 'rgba(160,163,192,0.6)'; ctx.font = '11px sans-serif';
    ctx.fillText(String(Math.round(maxP - (range / 4) * i)), 5, y + 4);
  }

  const stepX = chartW / (points.length - 1);
  if (peerY >= pad.t && peerY <= pad.t + priceH) {
    ctx.strokeStyle = 'rgba(251,191,36,0.5)'; ctx.lineWidth = 1.2; ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(pad.l, peerY); ctx.lineTo(w - pad.r, peerY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 10px sans-serif';
    ctx.fillText('同龄人 ' + Math.round(peerPrice) + ' 点', w - pad.r + 3, peerY + 3);
  }

  const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + priceH);
  grad.addColorStop(0, 'rgba(94,111,255,0.3)'); grad.addColorStop(1, 'rgba(94,111,255,0)');
  ctx.beginPath(); ctx.moveTo(pad.l, pad.t + priceH);
  points.forEach((p, i) => { const x = pad.l + stepX * i; const y = pad.t + priceH * (1 - (p.price - minP) / range); ctx.lineTo(x, y); });
  ctx.lineTo(pad.l + chartW, pad.t + priceH); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();

  ctx.beginPath();
  ma5.forEach((v, i) => { const x = pad.l + stepX * i; const y = pad.t + priceH * (1 - (v - minP) / range); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
  ctx.strokeStyle = 'rgba(168,85,247,0.7)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);

  ctx.beginPath();
  points.forEach((p, i) => { const x = pad.l + stepX * i; const y = pad.t + priceH * (1 - (p.price - minP) / range); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
  ctx.strokeStyle = '#5e6fff'; ctx.lineWidth = 2.5; ctx.stroke();

  const milestoneAges = [0, 6, 15, 18, 22, 30];
  points.forEach((p, i) => {
    if (milestoneAges.includes(p.age)) {
      const x = pad.l + stepX * i; const y = pad.t + priceH * (1 - (p.price - minP) / range);
      ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fillStyle = '#4ade80'; ctx.fill();
      ctx.strokeStyle = '#0a0e27'; ctx.lineWidth = 2; ctx.stroke();
    }
  });

  const last = points[points.length - 1];
  const lastY = pad.t + priceH * (1 - (last.price - minP) / range);
  ctx.fillStyle = last.price >= peerPrice ? '#22c55e' : '#ef4444';
  ctx.fillRect(w - pad.r, lastY - 9, 50, 18);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(Math.round(last.price) + ' 点', w - pad.r + 25, lastY + 4); ctx.textAlign = 'left';

  points.forEach((p, i) => {
    const x = pad.l + stepX * i; const barH = (p.invest / maxVol) * volH; const barW = Math.max(1, stepX * 0.5);
    ctx.fillStyle = last.price >= prices[0] ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)';
    ctx.fillRect(x - barW / 2, volTop + volH - barH, barW, barH);
  });

  const labelStep = Math.max(1, Math.floor(points.length / 8));
  ctx.fillStyle = 'rgba(160,163,192,0.6)'; ctx.font = '11px sans-serif';
  points.forEach((p, i) => {
    if (i % labelStep === 0 || i === points.length - 1) {
      ctx.fillText(p.age + '岁', pad.l + stepX * i - 10, h - pad.b + 20);
    }
  });

  ctx.font = '10px sans-serif';
  ctx.fillStyle = '#5e6fff'; ctx.fillRect(pad.l + 5, pad.t + 4, 12, 3);
  ctx.fillStyle = '#c8cadf'; ctx.fillText('指数', pad.l + 21, pad.t + 8);
  ctx.fillStyle = '#a855f7'; ctx.fillRect(pad.l + 50, pad.t + 4, 12, 3);
  ctx.fillStyle = '#c8cadf'; ctx.fillText('MA5', pad.l + 66, pad.t + 8);
  ctx.fillStyle = '#fbbf24'; ctx.fillRect(pad.l + 105, pad.t + 4, 12, 3);
  ctx.fillStyle = '#c8cadf'; ctx.fillText('同龄人', pad.l + 121, pad.t + 8);

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
    <div style="display:grid;grid-template-columns:1fr;gap:16px;">
      <!-- B1-1：单笔投入反推校准 -->
      <div style="padding:12px;background:rgba(255,255,255,0.04);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">① 用一笔真实投入反推校准</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">输入你印象深刻的某年真实投入，系统按比例校准所有历史估算。</div>
        <div class="form-label">年龄</div>
        <input type="number" id="anchorAge" value="${user.age}" style="width:100%;padding:10px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text-primary);margin-bottom:10px;">
        <div class="form-label">该年真实投入（元）</div>
        <input type="number" id="anchorAmount" placeholder="如 30000" style="width:100%;padding:10px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text-primary);margin-bottom:10px;">
        <button class="btn-primary" onclick="applyAnchor()" style="width:100%;">应用校准</button>
      </div>

      <!-- B1-2：手动调整家庭支持 -->
      <div style="padding:12px;background:rgba(168,85,247,0.08);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">② 家庭支持（万元，选填）</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">父母/家庭对你的累计投入折算，不折旧、不乘权重，单独计入累计成长值。仅保存在本机。</div>
        <input type="number" id="familyCapital" value="${user.familySupportCapital || 0}" step="1" style="width:100%;padding:10px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text-primary);margin-bottom:10px;">
        <button class="btn-primary" onclick="applyFamilyCapital()" style="width:100%;">保存家庭支持</button>
      </div>

      <!-- B1-3：标记"对我影响大"的投入 -->
      <div style="padding:12px;background:rgba(94,111,255,0.08);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">③ 标记"对我影响很大"的投入</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">已记录的自我投入中，标记后会在明细页高亮展示（不改变数值，仅反映主观感知）。</div>
        ${user.investments.length === 0 ? '<div style="font-size:12px;color:var(--text-muted);">暂无手动记录的投入。先去「记一笔」添加吧。</div>' :
          user.investments.map((inv, i) => `
            <label style="display:flex;align-items:center;gap:8px;padding:8px;background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:6px;cursor:pointer;">
              <input type="checkbox" id="impact_${i}" ${inv.impact ? 'checked' : ''}>
              <span style="font-size:13px;">${inv.desc || inv.type} · ${inv.amount.toLocaleString()} 元</span>
            </label>
          `).join('')}
        ${user.investments.length > 0 ? '<button class="btn-primary" onclick="applyImpact()" style="width:100%;margin-top:8px;">保存标记</button>' : ''}
      </div>

      <!-- 主观感知权重 -->
      <div style="padding:12px;background:rgba(34,197,94,0.08);border-radius:10px;">
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
  const modal = createModal('🔮 未来预测', '基于蒙特卡洛模拟，预测未来10年指数走势');
  modal.querySelector('.modal-body')!.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
      <div style="padding:12px;background:rgba(239,68,68,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">保守 (P10)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-red);">${Math.round(simulations[5])} 点</div></div>
      <div style="padding:12px;background:rgba(94,111,255,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">中性 (P50)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-blue);">${Math.round(simulations[25])} 点</div></div>
      <div style="padding:12px;background:rgba(34,197,94,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">乐观 (P90)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-green);">${Math.round(simulations[45])} 点</div></div>
    </div>
    <p style="color:var(--text-muted);font-size:12px;">假设：年化成长12%，波动率15%，持续学习</p>
  `;
}

function showShareModal() {
  if (!user) return;
  const u = user;
  const stock = calculateStock(u);
  const roeLevel = stock.roe >= 15 ? '优秀' : stock.roe >= 8 ? '良好' : stock.roe >= 3 ? '一般' : '待提升';
  const achieved = MILESTONES.filter(m => m.condition(u)).length;
  const health = stock.effectiveHealth;
  const healthLevel = health >= 80 ? '优秀' : health >= 60 ? '良好' : health >= 40 ? '一般' : '需关注';
  const hours = u.studyHours;
  const studyLevel = hours >= 8 ? '勤奋' : hours >= 3 ? '稳定' : hours >= 1 ? '一般' : '较少';
  const modal = createModal('📤 分享', '生成专属指数卡片');
  modal.querySelector('.modal-body')!.innerHTML = `
    <div style="background:linear-gradient(135deg,#1a1f3a,#2a1f4a);padding:24px;border-radius:16px;text-align:center;">
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">今日宜长进 · 成长指数手账</div>
      <div style="font-size:42px;font-weight:bold;color:var(--accent-blue);">${Math.round(stock.price)} 点</div>
      <div style="color:${stock.change >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'};margin-bottom:16px;">${stock.change >= 0 ? '+' : ''}${stock.change}%</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div><div style="font-size:11px;color:var(--text-muted)">成长效率</div><div style="font-weight:bold">${roeLevel}</div></div>
        <div><div style="font-size:11px;color:var(--text-muted)">里程碑</div><div style="font-weight:bold">${achieved}/${MILESTONES.length}</div></div>
        <div><div style="font-size:11px;color:var(--text-muted)">健康等级</div><div style="font-weight:bold">${healthLevel}</div></div>
        <div><div style="font-size:11px;color:var(--text-muted)">学习习惯</div><div style="font-weight:bold">${studyLevel}</div></div>
      </div>
      <div style="margin-top:16px;font-size:11px;color:var(--text-muted);">成长没有标准答案，每一步都算数</div>
      <div style="margin-top:8px;font-size:10px;color:rgba(255,255,255,0.3);">本数值基于模型估算，不代表真实资产</div>
    </div>
  `;
}

function showSetbackModal() {
  const modal = createModal('💥 记录挫折', '成长有快有慢，记下这段经历，回头看会更清楚');
  modal.querySelector('.modal-body')!.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
      ${[
        { t: 'jobloss', i: '💼', n: '失业/降薪', d: '收入下降' },
        { t: 'illness', i: '🏥', n: '重大疾病', d: '健康衰退' },
        { t: 'loss', i: '📉', n: '投入回落', d: '积累暂时放缓' },
        { t: 'stagnate', i: '😴', n: '躺平/断更', d: '停止成长' },
      ].map(s => `<div class="setback-type" data-type="${s.t}" onclick="selectSetback('${s.t}')" style="padding:12px;background:rgba(255,255,255,0.04);border-radius:10px;cursor:pointer;text-align:center;"><div style="font-size:24px">${s.i}</div><div style="font-weight:bold;margin-top:4px">${s.n}</div><div style="font-size:11px;color:var(--text-muted)">${s.d}</div></div>`).join('')}
    </div>
    <input type="range" id="setbackSeverity" min="1" max="10" value="5" style="width:100%;">
    <div style="text-align:center;color:var(--text-secondary);margin:8px 0;">严重度：<span id="severityVal">5</span></div>
    <div class="form-actions"><button class="btn-primary" style="background:linear-gradient(135deg,#ef4444,#dc2626);" onclick="applySetback()">确认记录</button></div>
  `;
  (document.getElementById('setbackSeverity') as HTMLInputElement).oninput = (e) => {
    document.getElementById('severityVal')!.textContent = (e.target as HTMLInputElement).value;
  };
}
let selectedSetback = '';
(window as any).selectSetback = (t: string) => { selectedSetback = t; };
(window as any).applySetback = applySetback;
function applySetback() {
  if (!user || !selectedSetback) return;
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
  saveUser(user);
  const after = calculateStock(user).price;
  closeModal();
  showToast(`指数 ${before.toFixed(1)} → ${after.toFixed(1)}`);
  showDashboard();
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
      <div style="padding:12px;background:rgba(94,111,255,0.1);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;color:var(--accent-blue);margin-bottom:8px;">📐 计算公式</div>
        <div style="color:var(--text-secondary)">成长指数 = (100 + 累计成长值 × 阶段系数 + min(里程碑加成,200)) × 成长系数 × 质量系数 × (1 - 风险折扣) × 主观调整</div>
      </div>
      <div style="padding:12px;background:rgba(255,255,255,0.04);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;margin-bottom:8px;">② 累计成长值 = ${stock.bv.toFixed(2)}（单位：万元口径）</div>
        ${Object.entries(bvByType).map(([t, v]) => `<div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">${typeNames[t] || t}</span><span>${v.toFixed(2)}</span></div>`).join('')}
        ${u.familySupportCapital ? `<div style="display:flex;justify-content:space-between;color:var(--accent-purple);"><span>家庭支持（不折旧）</span><span>${u.familySupportCapital}</span></div>` : ''}
        <div style="border-top:1px solid rgba(255,255,255,0.1);margin-top:6px;padding-top:6px;font-weight:bold;">成长值 × 阶段系数 = ${stock.bv.toFixed(2)} × ${stageCoef.toFixed(2)} = ${(stock.bv * stageCoef).toFixed(2)}</div>
      </div>

      <!-- A1：数据溯源卡片 -->
      <div style="padding:12px;background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.2);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;color:var(--accent-yellow);margin-bottom:8px;">🔍 历史投入估算 · 数据溯源</div>
        <div style="font-size:12px;color:var(--text-secondary);line-height:1.8;">
          <div><strong>数据来源：</strong>${src.name}（${src.year}）</div>
          <div><strong>原始口径：</strong>${src.caliber}</div>
          <div><strong>调整系数：</strong>地区 ${Constants.REGION_COEF[u.region]} × 城乡 ${Constants.AREA_COEF[u.area]} × 收入 ${Constants.INCOME_COEF[u.income]}</div>
        </div>
        <!-- A2：参考区间，替代"±4%精度" -->
        <div style="margin-top:10px;padding:10px;background:rgba(255,255,255,0.04);border-radius:8px;">
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">📊 各阶段年均教育投入参考区间（元）：</div>
          ${ageRangeKeys.map(k => {
            const r = Constants.AGE_SPEND_RANGE[k];
            return `<div style="display:flex;justify-content:space-between;font-size:12px;"><span style="color:var(--text-secondary)">${k}岁</span><span>${r.low.toLocaleString()} ~ ${r.mid.toLocaleString()} ~ ${r.high.toLocaleString()}</span></div>`;
          }).join('')}
          <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">以上为统计估算区间，非精确值。点击「校准指数」可修正为你的真实投入。</div>
        </div>
      </div>

      <div style="padding:12px;background:rgba(255,255,255,0.04);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;margin-bottom:8px;">③ 里程碑加成 = ${stock.milestoneBonus}（封顶 200）</div>
        ${achieved.map(m => `<div style="font-size:12px;color:var(--text-secondary)">${m.icon} ${m.name} +${m.bonus}</div>`).join('')}
      </div>
      <div style="padding:12px;background:rgba(255,255,255,0.04);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;margin-bottom:8px;">④ 系数</div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">成长系数</span><span>${stock.growthCoef}</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">质量系数（健康${stock.effectiveHealth}）</span><span>${stock.qualityCoef}</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">风险折扣（负债率${(u.debtRatio*100).toFixed(0)}%）</span><span>${stock.riskDiscount}</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">主观感知权重</span><span>${stock.subjectiveAdjust}</span></div>
      </div>

      <!-- 归因分析 -->
      <div style="padding:12px;background:rgba(94,111,255,0.06);border:1px solid rgba(94,111,255,0.2);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;color:var(--accent-blue);margin-bottom:8px;">📊 指数归因 · 每个因子贡献了多少</div>
        ${(() => {
          const items = calcAttribution(u, stock);
          const top = getTopContributor(items);
          return items.map(item => {
            const isMultiplier = item.contribution === 0;
            return `<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
              <span style="color:var(--text-secondary);font-size:12px;">${item.name}</span>
              <span style="font-size:12px;">${isMultiplier ? item.reason : `<strong>+${item.contribution}</strong> · ${item.reason}`}</span>
            </div>`;
          }).join('') +
          (top ? `<div style="margin-top:8px;padding:8px;background:rgba(34,197,94,0.08);border-radius:8px;font-size:12px;color:var(--accent-green);">⭐ 最大贡献：${top.name}（+${top.contribution}点）</div>` : '');
        })()}
      </div>

      <div style="padding:16px;background:linear-gradient(135deg,rgba(94,111,255,0.2),rgba(168,85,247,0.2));border-radius:12px;text-align:center;">
        <div style="color:var(--text-secondary);font-size:12px;">此刻的成长指数</div>
        <div style="font-size:32px;font-weight:bold;color:var(--accent-blue);">${Math.round(stock.price)} 点</div>
      </div>
    </div>
    <div style="margin-top:16px;padding:12px;background:rgba(251,191,36,0.08);border-radius:10px;font-size:12px;color:var(--text-secondary);line-height:1.6;">
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
      <div style="padding:14px;background:rgba(168,85,247,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">家庭支持</div><div style="font-size:20px;font-weight:bold;color:var(--accent-purple);">${parentInvest.toLocaleString()} 元</div></div>
      <div style="padding:14px;background:rgba(251,146,60,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">自我投入</div><div style="font-size:20px;font-weight:bold;color:#fb923c;">${selfInvest.toLocaleString()} 元</div></div>
    </div>
    <div style="height:20px;background:rgba(255,255,255,0.05);border-radius:10px;overflow:hidden;display:flex;">
      <div style="width:${(parentInvest / total * 100)}%;background:var(--accent-purple);"></div>
      <div style="width:${(selfInvest / total * 100)}%;background:#fb923c;"></div>
    </div>
    <div style="margin-top:16px;padding:14px;background:rgba(74,222,128,0.08);border-radius:12px;font-size:13px;color:var(--text-secondary);line-height:1.7;">
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
    document.getElementById('dashboard')?.classList.add('hidden');
    document.getElementById('landing')?.classList.remove('hidden');
  }
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
        <label style="display:flex;gap:10px;align-items:flex-start;padding:12px;background:rgba(255,255,255,0.04);border-radius:10px;margin:10px 0;cursor:pointer;">
          <input type="checkbox" id="consentBase" style="margin-top:3px;">
          <span>我已阅读并同意 <a href="javascript:void(0)" id="linkPrivacy1" style="color:var(--accent-blue);text-decoration:underline;">《隐私政策》</a> 与 <a href="javascript:void(0)" id="linkTerms1" style="color:var(--accent-blue);text-decoration:underline;">《用户协议》</a>，并同意在本机保存年龄、地区、学习、健康自评等<strong>基础成长信息</strong>（不上传服务器）。</span>
        </label>
        <label style="display:flex;gap:10px;align-items:flex-start;padding:12px;background:rgba(255,138,76,0.08);border:1px solid rgba(255,138,76,0.3);border-radius:10px;margin:10px 0;cursor:pointer;">
          <input type="checkbox" id="consentSensitive" style="margin-top:3px;">
          <span><strong>（选填）</strong>我单独同意收集<strong style="color:var(--accent-orange);">敏感信息</strong>：年收入、负债情况、家庭支持金额、每笔花费金额。不勾选也能正常使用，相关字段将使用通用估算值并如实标注。</span>
        </label>
        <p style="font-size:12px;color:var(--text-muted);">你可随时在「设置 → 删除全部数据」中清除全部本机数据。未满 14 周岁请在监护人同意后使用。</p>
        <p style="margin-top:10px;padding:12px;background:rgba(255,255,255,0.04);border-radius:8px;font-size:12px;">
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
}

// ============ 回撤复盘 ============
(window as any).showDrawdownModal = showDrawdownModal;
function showDrawdownModal() {
  if (!user) return;
  const snap = calculateStock(user);
  const kline = generateKline(user);
  const dd = calcDrawdown(kline, snap.price);
  const questions = getReviewQuestions(user);

  const modal = createModal('📉 成长回撤复盘', '复盘是为了觉察，不是自责');
  modal.querySelector('.modal-body')!.innerHTML = `
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">${dd.inDrawdown ? '📉' : '📈'}</div>
        <div style="font-size:22px;font-weight:bold;margin-top:8px;">${dd.inDrawdown ? '阶段性回撤' : '稳健成长'}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">历史峰值</div><div class="metric-value">${Math.round(dd.peak)}</div></div>
        <div class="metric"><div class="metric-label">当前指数</div><div class="metric-value">${Math.round(dd.current)}</div></div>
        <div class="metric"><div class="metric-label">回撤幅度</div><div class="metric-value" style="color:${dd.inDrawdown ? 'var(--accent-orange)' : 'var(--accent-green)'}">${dd.drawdownPct}%</div></div>
        <div class="metric"><div class="metric-label">距峰值</div><div class="metric-value">${dd.peakDaysAgo} 天</div></div>
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;margin-bottom:20px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 复盘建议</div>
        ${dd.suggestions.map((s) => `<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${s}</div>`).join('')}
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">🤔 自问</div>
        ${questions.map((q) => `<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${q}</div>`).join('')}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">回撤是成长的正常阶段，不必焦虑，重在觉察与调整</div>
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
        <input type="number" id="goalTarget" value="${Math.round(snap.price * 1.5)}" style="width:100%;padding:12px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text-primary);margin-top:6px;font-size:18px;">
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
    <div style="margin-top:20px;background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;">
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
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;">⭐ 本月亮点</div>
        ${report.highlights.length > 0 ? report.highlights.map((h) => `<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${h}</div>`).join('') : '<div style="font-size:13px;color:var(--text-muted);">继续积累，下个月会更好</div>'}
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;">
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
  const colors = { education: '#5e6fff', skill: '#9d6fff', health: '#4ade80', network: '#fbbf24', entertainment: '#f87171', other: '#94a3b8' };

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
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;">
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
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.stroke();
  }
  // 轴线
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
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
  ctx.fillStyle = 'rgba(94,111,255,0.3)';
  ctx.fill();
  ctx.strokeStyle = '#5e6fff';
  ctx.lineWidth = 2;
  ctx.stroke();
  // 标签
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
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

  const modal = createModal('📉 折旧预测', '看看你的成长积累随时间如何变化');
  modal.querySelector('.modal-body')!.innerHTML = `
      <div style="text-align:center;margin-bottom:16px;">
        <div style="font-size:14px;color:var(--text-muted);">假设每年新增自我花费约 ${annualInvest.toLocaleString()} 元（估算口径）</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">当前成长值</div><div class="metric-value">${Math.round(snap.bv)}</div></div>
        <div class="metric"><div class="metric-label">5 年后</div><div class="metric-value" style="color:${forecast.bv5y >= snap.bv ? 'var(--accent-green)' : 'var(--accent-orange)'}">${forecast.bv5y}</div></div>
        <div class="metric"><div class="metric-label">10 年后</div><div class="metric-value" style="color:${forecast.bv10y >= snap.bv ? 'var(--accent-green)' : 'var(--accent-orange)'}">${forecast.bv10y}</div></div>
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;">📈 10 年趋势</div>
        ${forecast.points.map((p) => `<div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary);line-height:1.8;"><span>${p.age} 岁</span><span>成长值 ${p.bv}（自然衰减 -${p.depreciation}，新增 +${p.newInvest}）</span></div>`).join('')}
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;">
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
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:12px;">
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
        <input type="number" id="familySupportInput" value="${ledger.totalSupport}" style="width:100%;padding:10px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text-primary);margin-top:6px;">
      </div>
      <button class="btn-primary" onclick="saveFamilySupport()" style="width:100%;padding:12px;">保存</button>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;margin-top:16px;">
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
      <div style="background:linear-gradient(135deg,rgba(94,111,255,0.15),rgba(168,85,247,0.15));border-radius:12px;padding:16px;margin-bottom:16px;">
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">${report.week}</div>
        <div style="font-size:16px;font-weight:600;line-height:1.6;">${report.summary}</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:8px;">${report.moodNote}</div>
      </div>
      ${report.highlights.length > 0 ? `<div style="background:rgba(74,222,128,0.08);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;color:var(--accent-green);">⭐ 本周亮点</div>
        ${report.highlights.map((h) => `<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${h}</div>`).join('')}
      </div>` : ''}
      ${report.improvements.length > 0 ? `<div style="background:rgba(251,191,36,0.08);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;color:var(--accent-yellow);">🔍 待改进</div>
        ${report.improvements.map((i) => `<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${i}</div>`).join('')}
      </div>` : ''}
      <div style="background:rgba(94,111,255,0.08);border-radius:12px;padding:14px;">
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
        ${report.keywords.map((k) => `<span style="padding:6px 14px;border-radius:20px;background:rgba(94,111,255,0.15);font-size:13px;">${k}</span>`).join('')}
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:16px;text-align:center;">
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
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;">📖 年度总结</div>
        <div style="font-size:14px;color:var(--text-secondary);line-height:1.8;">${report.summary}</div>
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;">
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
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:16px;text-align:center;">
        <div style="font-size:14px;color:var(--text-muted);">相对同类锚点</div>
        <div style="font-size:28px;font-weight:bold;color:${diff >= 0 ? 'var(--accent-green)' : 'var(--accent-orange)'};margin-top:6px;">${diff >= 0 ? '+' : ''}${diffPct}%</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:6px;">${diff >= 0 ? '你走在多数人前面，继续保持' : '还有追赶空间，但成长没有终点'}</div>
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;">
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
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;margin-bottom:10px;${c.done ? 'border:1px solid var(--accent-green);' : ''}">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <span style="font-size:22px;">${c.icon}</span>
            <div style="flex:1;">
              <div style="font-weight:600;">${c.name} ${c.done ? '<span style="color:var(--accent-green);">✓ 已完成</span>' : ''}</div>
              <div style="font-size:12px;color:var(--text-muted);">${c.desc}</div>
            </div>
            <div style="font-size:14px;font-weight:bold;color:${c.done ? 'var(--accent-green)' : 'var(--accent-blue)'};">${c.progress}/${c.target} ${c.unit}</div>
          </div>
          <div style="height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
            <div style="height:100%;width:${Math.round((c.progress / c.target) * 100)}%;background:${c.done ? 'var(--accent-green)' : 'linear-gradient(90deg,#5e6fff,#a855f7)'};border-radius:3px;transition:width 0.5s;"></div>
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
      <div style="background:linear-gradient(135deg,rgba(94,111,255,0.12),rgba(168,85,247,0.12));border-radius:12px;padding:16px;margin-bottom:16px;">
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:6px;">${advice.greeting}</div>
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;">👁️ 我观察到</div>
        ${advice.observations.map((o) => `<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${o}</div>`).join('')}
      </div>
      <div style="background:rgba(94,111,255,0.08);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;color:var(--accent-blue);">💡 我的建议</div>
        ${advice.advices.map((a) => `<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${a}</div>`).join('')}
      </div>
      <div style="background:rgba(74,222,128,0.08);border-radius:12px;padding:14px;text-align:center;">
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
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;cursor:pointer;" onclick="this.querySelector('.term-detail').style.display=this.querySelector('.term-detail').style.display==='none'?'block':'none'">
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
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;">
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
      <div style="background:linear-gradient(135deg,rgba(251,191,36,0.1),rgba(248,113,113,0.1));border-radius:16px;padding:24px;margin-bottom:16px;border:1px solid rgba(251,191,36,0.2);">
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
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:16px;max-height:400px;overflow-y:auto;">
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

init();
