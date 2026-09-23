import type { Milestone } from './types';

// ============ 里程碑定义 ============

export const MILESTONES: Milestone[] = [
  { id: 'birth', name: '出生', icon: '👶', desc: '人生起点', bonus: 20, condition: (p) => p.age >= 0 },
  { id: 'school', name: '小学入学', icon: '🎒', desc: '基础教育开始', bonus: 10, condition: (p) => p.age >= 6 },
  { id: 'middle', name: '初中毕业', icon: '📖', desc: '义务教育完成', bonus: 15, condition: (p) => p.age >= 15 },
  { id: 'highschool', name: '高中毕业', icon: '🎓', desc: '成年预备', bonus: 20, condition: (p) => p.age >= 18 },
  { id: 'college', name: '大学毕业', icon: '🎓', desc: '步入社会', bonus: 30, condition: (p) => p.age >= 22 },
  { id: 'firstjob', name: '第一份工作', icon: '💼', desc: '独立起步', bonus: 30, condition: (p) => p.hasJob },
  { id: 'firstraise', name: '第一次涨薪', icon: '💰', desc: '成长被认可', bonus: 15, condition: (p) => p.salaryRaised },
  { id: 'license', name: '拿到驾照', icon: '🚗', desc: '技能+1', bonus: 5, condition: (p) => p.hasLicense },
  { id: 'marathon', name: '跑完马拉松', icon: '🏃', desc: '健康资产', bonus: 8, condition: (p) => p.marathon },
  { id: 'marriage', name: '结婚', icon: '💍', desc: '人生伙伴', bonus: 20, condition: (p) => p.married },
  { id: 'home', name: '买房', icon: '🏠', desc: '安定居所', bonus: 25, condition: (p) => p.hasHouse },
  { id: 'child', name: '为人父母', icon: '👶', desc: '新的责任', bonus: 15, condition: (p) => p.hasChild },
  { id: '30', name: '三十而立', icon: '🎯', desc: '人生分水岭', bonus: 25, condition: (p) => p.age >= 30 },
  { id: '100k', name: '十万投入', icon: '💎', desc: '累计投入超10万', bonus: 15, condition: (p) => p.totalInvest >= 100000 },
  { id: '500k', name: '五十万投入', icon: '👑', desc: '累计投入超50万', bonus: 30, condition: (p) => p.totalInvest >= 500000 },
];
