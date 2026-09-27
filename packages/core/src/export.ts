// ============ 导出成长报告（纯前端，无后端） ============
import type { UserProfile, KlinePoint } from './types';
import { calculateStock } from './formula';
import { generateMonthlyReport } from './report';
import { calcRadar } from './radar';
import { getChallenges } from './challenge';

/** 生成纯文本成长报告 */
export function generateReportText(user: UserProfile, kline: KlinePoint[]): string {
  const snap = calculateStock(user);
  const report = generateMonthlyReport(user, kline);
  const radar = calcRadar(user);
  const challenges = getChallenges(user);

  const lines: string[] = [];
  lines.push('═══════════════════════════════════════');
  lines.push('         人 生 成 长 报 告');
  lines.push('═══════════════════════════════════════');
  lines.push('');
  lines.push(`生成时间：${new Date().toLocaleString('zh-CN')}`);
  lines.push('');

  lines.push('【一、当前状态】');
  lines.push(`  成长指数：${Math.round(snap.price)} 点`);
  lines.push(`  累计成长值：${Math.round(snap.bv)} 点`);
  lines.push(`  成长系数：${snap.growthCoef.toFixed(2)}`);
  lines.push(`  质量系数：${snap.qualityCoef.toFixed(2)}`);
  lines.push(`  风险折扣：${Math.round(snap.riskDiscount * 100)}%`);
  lines.push(`  主观感知权重：${snap.subjectiveAdjust.toFixed(2)}`);
  lines.push('');

  lines.push('【二、本月概览】');
  lines.push(`  月度变化：${report.changePoints >= 0 ? '+' : ''}${report.changePoints} 点（${report.changePct >= 0 ? '+' : ''}${report.changePct}%）`);
  lines.push(`  投入笔数：${report.investCount} 笔，实际花费 ${report.investAmount.toLocaleString()} 元（仅为记录）`);
  lines.push(`  记录天数：${report.journalDays} 天`);
  if (report.highlights.length > 0) {
    lines.push('  本月亮点：');
    report.highlights.forEach((h) => lines.push(`    - ${h}`));
  }
  lines.push('');

  lines.push('【三、投入结构】');
  radar.dimensions.forEach((d) => {
    lines.push(`  ${d.label}：${d.amount.toLocaleString()} 元`);
  });
  lines.push(`  均衡度：${Math.round(radar.balance * 100)}%`);
  lines.push('');

  lines.push('【四、挑战进度】');
  challenges.forEach((c) => {
    lines.push(`  ${c.icon} ${c.name}：${c.progress}/${c.target} ${c.unit} ${c.done ? '✓' : ''}`);
  });
  lines.push('');

  lines.push('【五、下月建议】');
  report.suggestions.forEach((s) => lines.push(`  • ${s}`));
  lines.push('');

  lines.push('═══════════════════════════════════════');
  lines.push('  本报告由「今日宜长进」在你的设备本地生成');
  lines.push('  数值为模型估算，仅供自我观察与反思，不构成理财、职业或心理建议');
  lines.push('═══════════════════════════════════════');

  return lines.join('\n');
}
