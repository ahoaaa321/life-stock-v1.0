// ============ 结构雷达 ============
import type { UserProfile, InvestType } from './types';

export interface RadarData {
  /** 各维度的数值（0-100 标准化） */
  dimensions: { type: InvestType; label: string; value: number; amount: number }[];
  /** 最突出的维度 */
  dominant: InvestType;
  /** 最薄弱的维度 */
  weakest: InvestType;
  /** 均衡度（0-1，越高越均衡） */
  balance: number;
}

const LABELS: Record<InvestType, string> = {
  education: '🎓 教育',
  skill: '📚 技能',
  health: '💪 健康',
  network: '🤝 人脉',
  entertainment: '🎮 娱乐',
  other: '📦 其他',
};

/** 计算投入结构雷达数据 */
export function calcRadar(user: UserProfile): RadarData {
  const amounts: Record<InvestType, number> = {
    education: 0, skill: 0, health: 0, network: 0, entertainment: 0, other: 0,
  };

  // 合并历史投入与手动记录
  (user.history || []).forEach((h) => { amounts[h.type] = (amounts[h.type] || 0) + h.invest; });
  (user.investments || []).forEach((i) => { amounts[i.type] = (amounts[i.type] || 0) + i.amount; });

  const maxVal = Math.max(...Object.values(amounts), 1);

  const dimensions = (Object.keys(amounts) as InvestType[]).map((type) => ({
    type,
    label: LABELS[type],
    value: Math.round((amounts[type] / maxVal) * 100),
    amount: amounts[type],
  }));

  const sorted = [...dimensions].sort((a, b) => b.amount - a.amount);
  const dominant = sorted[0].type;
  const weakest = sorted[sorted.length - 1].type;

  // 均衡度：变异系数的倒数
  const vals = dimensions.map((d) => d.amount);
  const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
  if (mean === 0) {
    return { dimensions, dominant, weakest, balance: 0 };
  }
  const variance = vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length;
  const std = Math.sqrt(variance);
  const cv = std / mean;
  const balance = Math.max(0, Math.min(1, 1 - cv / 2));

  return { dimensions, dominant, weakest, balance: Math.round(balance * 100) / 100 };
}
