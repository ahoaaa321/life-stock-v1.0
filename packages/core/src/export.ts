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
  lines.push(`  人生指数：${Math.round(snap.price)}`);
  lines.push(`  累计成长资本：${Math.round(snap.bv)}`);
  lines.push(`  成长系数：${snap.growthCoef.toFixed(2)}`);
  lines.push(`  质量系数：${snap.qualityCoef.toFixed(2)}`);
  lines.push(`  风险折扣：${Math.round(snap.riskDiscount * 100)}%`);
  lines.push(`  主观感知权重：${snap.subjectiveAdjust.toFixed(2)}`);
  lines.push('');

  lines.push('【二、本月概览】');
  lines.push(`  月度变化：${report.changePoints >= 0 ? '+' : ''}${report.changePoints} 点（${report.changePct >= 0 ? '+' : ''}${report.changePct}%）`);
  lines.push(`  投入笔数：${report.investCount} 笔，金额 ¥${report.investAmount.toLocaleString()}`);
  lines.push(`  记录天数：${report.journalDays} 天`);
  if (report.highlights.length > 0) {
    lines.push('  本月亮点：');
    report.highlights.forEach((h) => lines.push(`    - ${h}`));
  }
  lines.push('');

  lines.push('【三、投入结构】');
  radar.dimensions.forEach((d) => {
    lines.push(`  ${d.label}：¥${d.amount.toLocaleString()}`);
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
  lines.push('  本报告由「人生即股票」自动生成');
  lines.push('  仅供自我觉察参考，不代表客观评价');
  lines.push('═══════════════════════════════════════');

  return lines.join('\n');
}
