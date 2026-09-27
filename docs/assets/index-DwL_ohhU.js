(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const et="1.2",Lt=200,jt=.65,Rt=1.5,_t=.6,Ht=1.3,Bt=.3,y={BASE_INDEX:100,TYPE_WEIGHTS:{education:1.5,skill:1.3,health:1.1,network:1,entertainment:.5,other:.5},TYPE_HALF_LIFE:{education:1/0,skill:5,health:4,network:3,entertainment:1,other:2},REGION_COEF:{tier1:1.8,new_tier1:1.4,tier2:1.1,tier3:.8},AREA_COEF:{urban:1,rural:.68},INCOME_COEF:{low:.35,below_avg:.65,avg:1,above_avg:1.55,high:2.9},STAGE_COEF:[{age:0,coef:.2},{age:6,coef:.3},{age:12,coef:.5},{age:18,coef:.9},{age:25,coef:1.1},{age:35,coef:1.5},{age:50,coef:1.3},{age:65,coef:1},{age:80,coef:.8}],AGE_SPEND:{"0-2":24538,"3-5":36538,"6-14":27007,"15-17":29007,"18-22":29135},AGE_SPEND_RANGE:{"0-2":{low:18e3,mid:24538,high:35e3},"3-5":{low:25e3,mid:36538,high:52e3},"6-14":{low:18e3,mid:27007,high:4e4},"15-17":{low:2e4,mid:29007,high:42e3},"18-22":{low:18e3,mid:29135,high:45e3}}},Ot={education_cost:{name:"育娲人口研究《中国生育成本报告》",year:"2022",caliber:"全国家庭 0-17 岁子女年均教育/养育投入"}},j=[{id:"birth",name:"出生",icon:"👶",desc:"人生起点",bonus:20,condition:t=>t.age>=0},{id:"school",name:"小学入学",icon:"🎒",desc:"基础教育开始",bonus:10,condition:t=>t.age>=6},{id:"middle",name:"初中毕业",icon:"📖",desc:"义务教育完成",bonus:15,condition:t=>t.age>=15},{id:"highschool",name:"高中毕业",icon:"🎓",desc:"成年预备",bonus:20,condition:t=>t.age>=18},{id:"college",name:"大学毕业",icon:"🎓",desc:"步入社会",bonus:30,condition:t=>t.age>=22},{id:"firstjob",name:"第一份工作",icon:"💼",desc:"独立起步",bonus:30,condition:t=>t.hasJob},{id:"firstraise",name:"第一次涨薪",icon:"💰",desc:"成长被认可",bonus:15,condition:t=>t.salaryRaised},{id:"license",name:"拿到驾照",icon:"🚗",desc:"技能+1",bonus:5,condition:t=>t.hasLicense},{id:"marathon",name:"跑完马拉松",icon:"🏃",desc:"健康资产",bonus:8,condition:t=>t.marathon},{id:"marriage",name:"结婚",icon:"💍",desc:"人生伙伴",bonus:20,condition:t=>t.married},{id:"home",name:"买房",icon:"🏠",desc:"安定居所",bonus:25,condition:t=>t.hasHouse},{id:"child",name:"为人父母",icon:"👶",desc:"新的责任",bonus:15,condition:t=>t.hasChild},{id:"30",name:"三十而立",icon:"🎯",desc:"人生分水岭",bonus:25,condition:t=>t.age>=30},{id:"100k",name:"十万投入",icon:"💎",desc:"累计投入超10万",bonus:15,condition:t=>t.totalInvest>=1e5},{id:"500k",name:"五十万投入",icon:"👑",desc:"累计投入超50万",bonus:30,condition:t=>t.totalInvest>=5e5}],ft=.5,ht=1.5,Gt=1;function yt(t,e,n){return Math.max(e,Math.min(n,t))}function Nt(t){return t.subjectiveWeight===void 0||t.subjectiveWeight===null?Gt:yt(t.subjectiveWeight,ft,ht)}function Ft(t){return yt(t,ft,ht)}function F(t,e,n){return Math.max(e,Math.min(n,t))}function qt(t){const e=t.history?.length||0,n=t.investments?.length||0,o=e+n,i=e,s=o>0?i/o:1;let l;const r=o>0?n/o:0;r>=.5?l="high":r>=.2?l="medium":l="low";const c={high:"高置信",medium:"中置信",low:"低置信"},d=o>0?i/(o+1):.5;return{level:l,estimatedRatio:Math.round(s*100)/100,manualCount:n,estimatedCount:i,label:c[l],potentialEstimatedRatio:Math.round(d*100)/100}}function K(t,e,n){if(n==="education")return t;const o=y.TYPE_HALF_LIFE[n]||5;return isFinite(o)?t*Math.exp(-.693*e/o):t}function nt(t){const e=y.STAGE_COEF;if(t<=e[0].age)return e[0].coef;for(let n=0;n<e.length-1;n++)if(t>=e[n].age&&t<=e[n+1].age){const o=(t-e[n].age)/(e[n+1].age-e[n].age);return e[n].coef+o*(e[n+1].coef-e[n].coef)}return e[e.length-1].coef}function Wt(t){const e=F((t.annualIncomeGrowth||0)*2,-.35,.35),n=F(((t.studyHours||0)-5)/20,-.15,.15);return F(1+e+n,jt,Rt)}function Yt(t){return F(.6+t/100*.7,_t,Ht)}function Ut(t){return F((t.debtRatio||0)*.3,0,Bt)}function bt(t,e=new Date){let n=0;return t.history.forEach(o=>{const i=t.age-o.age,s=y.TYPE_WEIGHTS[o.type]||1;n+=o.invest/1e4*s*K(1,Math.max(0,i),o.type)}),t.investments.forEach(o=>{const i=(e.getTime()-o.date.getTime())/315576e5,s=y.TYPE_WEIGHTS[o.type]||1;n+=o.amount/1e4*s*K(1,Math.max(0,i),o.type)}),t.familySupportCapital&&(n+=t.familySupportCapital),n}function S(t,e=new Date){const n=bt(t,e),o=nt(t.age),i=j.filter(m=>m.condition(t)).reduce((m,z)=>m+z.bonus,0),s=Math.min(Lt,i),l=(t.annualIncome||0)/1e4,r=n>0?Math.min(1e3,l/(n+1)*100):0,d=t.investments.filter(m=>(e.getTime()-m.date.getTime())/315576e5<2&&["education","skill","health"].includes(m.type)).length>0?1:Math.max(.65,1-(t.age-22)*.012);let p=t.healthScore||50;const u=t.investments.filter(m=>(e.getTime()-m.date.getTime())/315576e5<2&&m.type==="health");t.age>30&&u.length===0&&(p=Math.max(20,p-(t.age-30)*1.5));const v=Wt(t)*d,f=Yt(p),h=Ut(t),C=Nt(t),b=(y.BASE_INDEX+n*o+s)*v*f*(1-h)*C,I=(b-y.BASE_INDEX)/y.BASE_INDEX*100,E=l>0?Math.round(b/l*10)/10+"倍":"—";return{price:Math.round(b*10)/10,change:Math.round(I*10)/10,bv:Math.round(n*10)/10,eps:Math.round(l*100)/100,roe:Math.round(r*10)/10,pe:E,milestoneBonus:s,growthCoef:Math.round(v*100)/100,qualityCoef:Math.round(f*100)/100,stagnationPenalty:Math.round(d*100)/100,effectiveHealth:Math.round(p),riskDiscount:Math.round(h*100)/100,subjectiveAdjust:Math.round(C*100)/100}}function Jt(t){const e=y.REGION_COEF[t.region]*y.AREA_COEF[t.area]*y.INCOME_COEF[t.income],n=[];for(let o=0;o<=t.age;o++){let i;o<=2?i=y.AGE_SPEND["0-2"]:o<=5?i=y.AGE_SPEND["3-5"]:o<=14?i=y.AGE_SPEND["6-14"]:o<=17?i=y.AGE_SPEND["15-17"]:i=y.AGE_SPEND["18-22"],i=i*e*(.9+Math.random()*.2),n.push({age:o,invest:i,type:"education"})}if(t.anchor){const o=t.anchor.age;n[o]&&(n[o].invest=t.anchor.amount)}return n}function H(t){const e=[];let n=0;for(let o=0;o<=t.age;o++){let s=t.history.filter(u=>u.age===o).reduce((u,g)=>u+g.invest,0);const l=t.investments.filter(u=>Math.floor((u.date.getTime()-new Date(t.birthYear+o,0,1).getTime())/315576e5)===o);s+=l.reduce((u,g)=>u+g.amount,0),n+=s;const r={...t,age:o,history:t.history.filter(u=>u.age<=o),investments:l},c=S(r),d=1+(Math.random()-.5)*.16,p=c.price*d;e.push({age:o,price:Math.round(p*10)/10,invest:s,total:n})}return e}function xt(t){const e={primary:.5,junior:.8,senior:1,college:1.2,bachelor:1.3,master:1.5},n={age:t.age,region:t.region,area:t.area,income:"avg",education:t.education,birthYear:t.birthYear,annualIncome:8e4*(e[t.education]||1),annualIncomeGrowth:.05,studyHours:2,healthScore:65,debtRatio:.05,hasJob:t.age>=22,salaryRaised:t.age>=25,hasLicense:t.age>=20,marathon:!1,married:t.age>=28,hasHouse:t.age>=30,hasChild:t.age>=32,totalInvest:0,history:Vt(t),investments:[]};return S(n).price}function Vt(t){const e=y.REGION_COEF[t.region]*y.AREA_COEF[t.area]*y.INCOME_COEF.avg,n=[];for(let o=0;o<=t.age;o++){let i;o<=2?i=y.AGE_SPEND["0-2"]:o<=5?i=y.AGE_SPEND["3-5"]:o<=14?i=y.AGE_SPEND["6-14"]:o<=17?i=y.AGE_SPEND["15-17"]:i=y.AGE_SPEND["18-22"],i=i*e,n.push({age:o,invest:i,type:"education"})}return n}function wt(t,e){let n={...t};return(!e||e<"1.2")&&n.familySupportCapital===void 0&&(n.familySupportCapital=0),n.version=et,n}function Kt(t){return{...t,version:et,disclaimer:"本工具为个人成长记录与自我反思工具，所有数值为模型估算，仅供娱乐与自我观察，不构成理财、职业或心理咨询建议，也不预测收入。"}}function Xt(t,e){const n=nt(t.age),o=100,i=e.bv*n,s=e.milestoneBonus,l=[{key:"growth",name:"成长系数",value:e.growthCoef,reason:`收入增速与学习时长决定，含停滞衰减 ${e.stagnationPenalty}`},{key:"quality",name:"质量系数",value:e.qualityCoef,reason:`基于有效健康分 ${e.effectiveHealth}`},{key:"risk",name:"风险折扣",value:1-e.riskDiscount,reason:`负债率 ${(t.debtRatio||0)*100}%，折扣 ${(e.riskDiscount*100).toFixed(0)}%`},{key:"subjective",name:"主观感知",value:e.subjectiveAdjust,reason:`你设定的主观权重 ${e.subjectiveAdjust.toFixed(2)}（1.0 为中性）`}],r=l.reduce((p,u)=>p*u.value,1),c=e.price,d=[];return d.push({key:"base",name:"基准指数",contribution:Math.round(o*r*10)/10,ratio:c>0?o*r/c:0,reason:"所有人同一起点 100 分"}),d.push({key:"bv",name:"累计成长值",contribution:Math.round(i*r*10)/10,ratio:c>0?i*r/c:0,reason:`成长值 ${e.bv} 点 × 阶段系数 ${n.toFixed(2)}（${t.age}岁）`}),d.push({key:"milestone",name:"里程碑加成",contribution:Math.round(s*r*10)/10,ratio:c>0?s*r/c:0,reason:"已达成里程碑加分（封顶 200）"}),l.forEach(p=>{d.push({key:p.key,name:p.name,contribution:0,ratio:0,reason:p.reason+`（×${p.value.toFixed(2)}）`})}),d}function Qt(t){const e=t.filter(n=>n.contribution>0);return e.length===0?null:e.reduce((n,o)=>n.contribution>o.contribution?n:o)}const Zt={great:4,good:3,ok:2,low:1};function te(t,e,n){return{id:`j_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,date:new Date,content:t.trim(),mood:e,category:n}}function ee(t,e){return{...t,journals:[...t.journals||[],e]}}function ne(t,e=10){return[...t.journals||[]].sort((n,o)=>new Date(o.date).getTime()-new Date(n.date).getTime()).slice(0,e)}function ot(t,e){const n=Date.now()-e*24*60*60*1e3;return(t.journals||[]).filter(o=>new Date(o.date).getTime()>=n).length}function $t(t){const e=new Set((t.journals||[]).map(i=>new Date(i.date).toDateString()));let n=0;const o=new Date;for(;e.has(o.toDateString());)n++,o.setDate(o.getDate()-1);return n}function it(t,e=30){const n=Date.now()-e*24*60*60*1e3,o=(t.journals||[]).filter(s=>s.mood&&new Date(s.date).getTime()>=n);return o.length===0?null:o.reduce((s,l)=>s+Zt[l.mood],0)/o.length}function oe(t,e){if(t.length===0)return{peak:e,current:e,drawdownPct:0,drawdownPoints:0,peakDaysAgo:0,inDrawdown:!1,suggestions:["开始记录你的第一笔成长投入吧"]};const n=Math.max(...t.map(d=>d.price),e),o=Math.max(0,n-e),i=n>0?o/n*100:0,s=t.reduce((d,p)=>p.price>d.price?p:d,t[0]),l=t[t.length-1].age,r=Math.round((l-s.age)*365),c=[];return i===0?c.push("当前处于历史高位，继续保持成长节奏"):i<5?(c.push("小幅波动属正常，不必过度焦虑"),c.push("检查近期投入是否连续，保持每周一笔")):i<15?(c.push("阶段性回落，可复盘近期是否有停滞期"),c.push("健康与学习时长对成长系数影响较大")):(c.push("回落幅度较大，建议认真复盘近期生活变化"),c.push("可在「记录挫折」中标记事件，帮助归因")),{peak:n,current:e,drawdownPct:Math.round(i*10)/10,drawdownPoints:Math.round(o),peakDaysAgo:Math.max(0,r),inDrawdown:i>.5,suggestions:c}}function ie(t){const e=["最近哪件事最影响你的状态？","这个阶段你的投入重心放在了哪里？","有什么是你想调整或继续的？"];return t.setbacks&&t.setbacks.length>0&&e.unshift("你记录的挫折事件，现在回看有什么新感悟？"),e}function ae(t,e){const n=S(t),o=n.price,i=Math.max(0,e-o),s=n.growthCoef*n.qualityCoef*(1-n.riskDiscount)*n.subjectiveAdjust,l=n.stageCoef||1,r=Math.max(0,(e/s-100-n.milestoneBonus)/l),c=n.bv,d=Math.max(0,r-c),p=d,u=t.annualIncome*.05/12,g=t.annualIncome*.15/12,v=g>0?Math.ceil(d/g):999,f=u>0?Math.ceil(d/u):999,h=[];return i<=0?h.push("已达到目标，可设定更高的成长目标"):(h.push(`距离目标还差 ${Math.round(i)} 点`),h.push(`按当前节奏约需 ${v}-${f} 个月（仅作参考）`),h.push("提升学习时长与健康评分，可加速成长系数"),h.push("达成更多里程碑可获得额外加成")),{target:e,current:Math.round(o),gap:Math.round(i),requiredBV:Math.round(r),additionalInvest:Math.round(p),monthsRange:[Math.min(v,999),Math.min(f,999)],suggestions:h,confidence:"估算基于当前系数与线性假设，实际成长受多因素影响，请理性参考"}}function Mt(t,e){const n=new Date,o=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`,s=S(t).price,l=new Date(n.getFullYear(),n.getMonth(),1),r=n.getFullYear()-t.birthYear-(n.getMonth()<l.getMonth()?1:0);let c=s;if(e.length>0){const m=e.filter(z=>z.age<=r-.08);m.length>0?c=m[m.length-1].price:c=e[0].price}const d=s-c,p=c>0?d/c*100:0,u=new Date(n.getFullYear(),n.getMonth(),1).getTime(),g=(t.investments||[]).filter(m=>new Date(m.date).getTime()>=u),v=g.length,f=g.reduce((m,z)=>m+z.amount,0),h=ot(t,30),C=it(t,30),b=[];v>0&&b.push(`本月记录了 ${v} 笔自我投入`),d>0?b.push(`成长指数上升 ${Math.round(d)} 点`):d<0&&b.push("本月指数有所回落，可查看回落复盘");const I=t._milestones||[];I>0&&b.push(`达成 ${I} 个里程碑`);const E=[];return v===0&&E.push("建议每周至少记录一笔投入，保持成长节奏"),h<5&&E.push("增加一句话记录的频率，帮助觉察成长"),C!==null&&C<2.5&&E.push("近期情绪偏低，关注健康与休息"),E.length===0&&E.push("保持当前节奏，继续积累成长值"),{month:o,startPrice:Math.round(c),endPrice:Math.round(s),changePoints:Math.round(d),changePct:Math.round(p*10)/10,investCount:v,investAmount:f,journalDays:h,avgMood:C,highlights:b,suggestions:E}}function pt(t){const e=t.getDay(),n=e===0?-6:1-e,o=new Date(t);return o.setDate(t.getDate()+n),o.setHours(0,0,0,0),o}function at(t){const e=new Date,n=pt(e),o=new Date(n);o.setDate(n.getDate()+7);const s=(t.investments||[]).filter(u=>{const g=new Date(u.date).getTime();return g>=n.getTime()&&g<o.getTime()}).length,l=s>0;let r=0,c=new Date(e);for(;;){const u=pt(c),g=new Date(u);if(g.setDate(u.getDate()+7),(t.investments||[]).some(f=>{const h=new Date(f.date).getTime();return h>=u.getTime()&&h<g.getTime()}))r++,c=new Date(u),c.setDate(u.getDate()-1);else{if(r===0&&c.getTime()===e.getTime()){c=new Date(u),c.setDate(u.getDate()-1);continue}break}if(r>520)break}const d=Math.max(0,7-(e.getDay()===0?7:e.getDay()-1));let p;return l?p=`本周已记录 ${s} 笔，继续保持！连续 ${r} 周`:d<=2?p=`本周还剩 ${d} 天，记一笔投入保持连续吧`:p=`本周还剩 ${d} 天，期待你的第一笔投入`,{investedThisWeek:l,countThisWeek:s,streakWeeks:r,daysLeftInWeek:d,message:p}}const se={education:"🎓 教育",skill:"📚 技能",health:"💪 健康",network:"🤝 人脉",entertainment:"🎮 娱乐",other:"📦 其他"};function V(t){const e={education:0,skill:0,health:0,network:0,entertainment:0,other:0};(t.history||[]).forEach(v=>{e[v.type]=(e[v.type]||0)+v.invest}),(t.investments||[]).forEach(v=>{e[v.type]=(e[v.type]||0)+v.amount});const n=Math.max(...Object.values(e),1),o=Object.keys(e).map(v=>({type:v,label:se[v],value:Math.round(e[v]/n*100),amount:e[v]})),i=[...o].sort((v,f)=>f.amount-v.amount),s=i[0].type,l=i[i.length-1].type,r=o.map(v=>v.amount),c=r.reduce((v,f)=>v+f,0)/r.length;if(c===0)return{dimensions:o,dominant:s,weakest:l,balance:0};const d=r.reduce((v,f)=>v+(f-c)**2,0)/r.length,u=Math.sqrt(d)/c,g=Math.max(0,Math.min(1,1-u/2));return{dimensions:o,dominant:s,weakest:l,balance:Math.round(g*100)/100}}function re(t,e=10,n=0){const o=t.age,i=[];let s=bt(t);const l=.06;for(let p=1;p<=e;p++){const u=o+p,g=Math.round(s*l),v=n;s=s-g+v,s=Math.max(0,s),i.push({age:u,bv:Math.round(s),depreciation:g,newInvest:v})}const r=i[4]?.bv||0,c=i[9]?.bv||0,d=[];return n===0&&d.push("未设定年度新增投入，成长值会随时间自然衰减"),c<s*.5&&(d.push("按当前节奏，10 年后成长积累可能缩水过半"),d.push("建议增加年度投入，或提升投入质量")),r>s&&d.push("按当前投入节奏，5 年后成长积累仍在增长"),d.push("健康与技能类投入折旧较慢，优先配置"),{points:i,bv5y:r,bv10y:c,annualDecayRate:l,suggestions:d}}function le(t){const e=S(t).price;return[{scenario:"optimistic",label:"乐观",icon:"🚀",desc:"学习时长增加、健康改善、收入增长提速",mod:{studyHours:t.studyHours+5,healthScore:Math.min(100,t.healthScore+15),annualIncomeGrowth:t.annualIncomeGrowth+.05,debtRatio:Math.max(0,t.debtRatio-.1)}},{scenario:"neutral",label:"中性",icon:"➡️",desc:"保持当前节奏不变",mod:{}},{scenario:"pessimistic",label:"保守",icon:"🛡️",desc:"学习时长减少、健康下滑、收入停滞",mod:{studyHours:Math.max(0,t.studyHours-3),healthScore:Math.max(0,t.healthScore-15),annualIncomeGrowth:Math.max(0,t.annualIncomeGrowth-.05),debtRatio:Math.min(1,t.debtRatio+.1)}}].map(o=>{const i={...t,...o.mod},s=S(i);return{scenario:o.scenario,label:o.label,icon:o.icon,price:Math.round(s.price),changePct:e>0?Math.round((s.price-e)/e*1e3)/10:0,desc:o.desc,params:{studyHours:i.studyHours,healthScore:i.healthScore,incomeGrowth:i.annualIncomeGrowth,debtRatio:i.debtRatio}}})}function de(t){const e=t.familySupportCapital||0,n=t._familyEntries||[],o=(t.totalInvest||0)+e,i=o>0?e/o:0,s=[];return e===0&&s.push("可记录家庭/父母的累计投入，更全面地认识成长积累"),i>.5&&s.push("家庭支持占比较高，可逐步增加自我投入占比"),i>0&&i<=.5&&s.push("家庭支持与自我投入比例健康，继续保持"),n.length===0&&e>0&&s.push("可补充家庭投入的明细记录，便于感恩与回顾"),{totalSupport:e,entries:n,supportRatio:Math.round(i*100)/100,suggestions:s}}function ce(t){const e=new Date,n=new Date(e),o=n.getDay(),i=o===0?-6:1-o;n.setDate(e.getDate()+i);const s=`${n.getFullYear()}年${n.getMonth()+1}月第${Math.ceil(n.getDate()/7)}周`,l=S(t),r=at(t),c=ot(t,7);$t(t);const d=it(t,7),p=V(t),u=[],g=[],v=[];r.investedThisWeek?u.push(`本周记录了 ${r.countThisWeek} 笔投入${r.streakWeeks>1?`，连续 ${r.streakWeeks} 周`:""}`):(g.push("本周还没有记录投入，下周至少记一笔"),v.push("周末前记录一笔自我投入")),c>=5?u.push(`本周记录了 ${c} 条成长感悟，觉察力在线`):c>=1?v.push("下周把记录频率提升到 3 次以上"):(g.push("本周没有成长记录，觉察是成长的第一步"),v.push("每天花 1 分钟写下一个想法"));let f="本周无情绪数据";if(d!==null&&(d>=3.5?(u.push("本周整体情绪很好，状态饱满"),f="😄 情绪很好，继续保持"):d>=2.5?f="🙂 情绪平稳":(g.push("本周情绪偏低，关注休息与健康"),f="😔 情绪偏低，多关注自己",v.push("安排一次放松或运动"))),p.balance>=.6)u.push("投入结构较均衡，多维发展");else{const C=p.dimensions.find(b=>b.type===p.weakest)?.label||"";g.push(`投入结构不均衡，${C}维度较弱`),v.push(`下周在${C}上增加一点投入`)}l.growthCoef>=1.2?u.push("成长动力强劲，保持当前节奏"):l.growthCoef<.9&&(g.push("成长动力偏弱，检查学习时长与健康"),v.push("增加每周学习时长，关注健康评分"));let h;return u.length>=2?h="本周成长势头良好，继续保持多维投入与觉察。":g.length>=2?h="本周有提升空间，从小行动开始调整节奏。":h="本周平稳，保持觉察，持续积累。",v.length===0&&v.push("保持当前节奏，下周复盘时看看有什么新变化"),{week:s,summary:h,highlights:u,improvements:g,actions:v,moodNote:f}}function pe(t,e){const n=new Date,o=n.getFullYear(),i=S(t),s=n.getFullYear()-t.birthYear-1;let l=i.price;const r=e.filter(m=>m.age<=s);r.length>0&&(l=r[r.length-1].price);const c=i.price-l,d=l>0?c/l*100:0,p=new Date(o,0,1).getTime(),u=(t.investments||[]).filter(m=>new Date(m.date).getTime()>=p),g=u.reduce((m,z)=>m+z.amount,0),v=u.length,f=ot(t,365),h=it(t,365),C=j.filter(m=>m.condition(t)).length,b=[];C>=5&&b.push("🏆 里程碑丰收"),v>=12&&b.push("💰 持续投入"),f>=100&&b.push("📝 勤于觉察"),t.healthScore>=75&&b.push("💪 健康在线"),i.growthCoef>=1.2&&b.push("🚀 高速成长"),b.length===0&&b.push("🌱 稳步积累");let I;c>0?I=`这一年，你的成长指数上升了 ${Math.round(c)} 点。每一笔投入、每一次觉察，都在累积成看得见的成长。`:c<0?I=`这一年有些起伏，指数回落了 ${Math.round(Math.abs(c))} 点。回落不是失败，是重新认识自己的机会。`:I="这一年平稳度过，成长在潜移默化中发生。";const E=[];return v<12&&E.push("每月至少记录一笔投入"),f<50&&E.push("每周记录 2-3 条成长感悟"),t.healthScore<70&&E.push("提升健康评分到 70 以上"),i.growthCoef<1&&E.push("增加学习时长，提升成长系数"),E.length===0&&E.push("保持当前节奏，设定更高的成长目标"),{year:o,startPrice:Math.round(l),endPrice:Math.round(i.price),changePoints:Math.round(c),changePct:Math.round(d*10)/10,totalInvest:g,investCount:v,journalDays:f,avgMood:h,milestoneCount:C,keywords:b,summary:I,nextYearPlan:E}}function st(t){const e=$t(t),n=at(t),o=(t.investments||[]).length,i=(t.journals||[]).length,s=t._milestones||0;return[{id:"streak7",name:"七日觉察",icon:"🔥",desc:"连续 7 天记录成长感悟",progress:Math.min(e,7),target:7,done:e>=7,unit:"天"},{id:"streak30",name:"月度坚持",icon:"🌟",desc:"连续 30 天记录成长感悟",progress:Math.min(e,30),target:30,done:e>=30,unit:"天"},{id:"invest10",name:"十笔投入",icon:"💰",desc:"累计记录 10 笔自我投入",progress:Math.min(o,10),target:10,done:o>=10,unit:"笔"},{id:"weekly4",name:"周周不断",icon:"📅",desc:"连续 4 周每周至少一笔投入",progress:Math.min(n.streakWeeks,4),target:4,done:n.streakWeeks>=4,unit:"周"},{id:"journal50",name:"觉察达人",icon:"📝",desc:"累计记录 50 条成长感悟",progress:Math.min(i,50),target:50,done:i>=50,unit:"条"},{id:"milestone5",name:"里程碑收集者",icon:"🏆",desc:"达成 5 个成长里程碑",progress:Math.min(s,5),target:5,done:s>=5,unit:"个"}]}function ue(t){const e=st(t),n=e.filter(o=>o.done).length;return Math.round(n/e.length*100)}const ut=[{name:"成长教练",tone:"理性鼓励"},{name:"职场前辈",tone:"务实建议"},{name:"生活哲学家",tone:"温柔启发"}];function ve(t){const e=S(t),n=V(t),o=ut[new Date().getDate()%ut.length],i=[],s=[];if(e.growthCoef>=1.2?i.push("你的成长动力很强，学习与投入节奏不错"):e.growthCoef<.9?i.push("近期成长动力偏弱，可能需要调整节奏"):i.push("成长节奏平稳，稳扎稳打"),t.healthScore>=80?i.push("健康状态良好，这是持续成长的底座"):t.healthScore<60&&i.push("健康评分偏低，身体是一切的基础"),n.balance>=.6)i.push("投入结构均衡，多维发展");else{const p=n.dimensions.find(u=>u.type===n.weakest)?.label.split(" ")[1]||"";i.push(`${p}维度投入相对较少`)}t.studyHours<5&&s.push("尝试每周增加 2-3 小时学习时间，成长系数会明显提升"),t.healthScore<70&&s.push("安排规律运动和睡眠，健康评分每提升 10 分，质量系数约提升 7%"),n.balance<.5&&s.push("在保持优势维度的同时，给薄弱维度一些投入，结构会更稳"),e.subjectiveAdjust<1&&s.push("你对自己的评价偏保守，不妨多看看已取得的进步"),s.length===0&&s.push("当前状态不错，给自己设定一个稍高的目标，然后稳步推进");const l=["成长不是百米冲刺，而是马拉松。你已经在路上了。","每一笔投入、每一次觉察，都在塑造未来的你。","不必和别人比，今天的你比昨天好一点，就是胜利。","低谷是蓄力，高峰是收获。享受这个过程。"],r=l[new Date().getDay()%l.length],c=new Date().getHours();let d;return c<6?d="夜深了，注意休息。":c<12?d="早上好，新的一天开始了。":c<18?d="下午好，今天过得怎么样？":d="晚上好，回顾一下今天的成长吧。",{persona:`${o.name}（${o.tone}）`,greeting:d,observations:i,advices:s,encouragement:r}}const ge=[{term:"成长积累",icon:"💎",short:"你累计投入自己的总和",detail:"包括教育、技能、健康、人脉等各维度的投入总和。它会随时间自然衰减，需要持续投入来保持与增长。",category:"基础"},{term:"成长指数",icon:"📈",short:"综合反映你当前成长状态的数值（单位：点）",detail:"基于成长积累、成长系数、质量系数、风险折扣、主观感知权重等综合计算。它不是分数，也不是金钱，而是一个帮助你觉察和调整的参考。",category:"基础"},{term:"成长系数",icon:"🚀",short:"反映你当前成长速度的倍率",detail:"受收入增长、学习时长、停滞惩罚等影响。学习时长每增加 5 小时/周，成长系数约提升 0.25。",category:"成长"},{term:"质量系数",icon:"✨",short:"反映生活质量对成长的放大作用",detail:"主要由健康评分决定。健康是 1，其他是 0。健康评分每提升 10 分，质量系数约提升 7%。",category:"成长"},{term:"主观感知权重",icon:"🎯",short:"你对自身成长价值的主观评估",detail:'范围 0.5-1.5，默认 1.0 中性。这是你对自己的主观评估，不影响客观成长积累，只影响你"感受到"的指数。',category:"心理"},{term:"折旧",icon:"📉",short:"成长积累随时间自然损耗",detail:"知识会遗忘，技能会生疏，健康会衰退。不同类型的投入折旧速度不同：健康最稳，教育折旧较快。持续投入是对抗折旧的唯一方式。",category:"方法"},{term:"回落",icon:"💧",short:"成长指数从阶段性高点回落的幅度",detail:"成长不是直线上升，回落是正常的。关键不是避免回落，而是在回落中复盘觉察，找到调整方向。",category:"心理"},{term:"里程碑",icon:"🏆",short:"成长路上的标志性节点",detail:"如获得第一份工作、升职加薪、考取证书等。里程碑会给指数带来额外加成，是对阶段性成长的肯定。",category:"成长"}],me=[{stage:"学生期",ageRange:"18-22 岁",focus:"积累基础，探索方向",tips:["教育投入是核心，学好专业基础","多尝试不同领域，找到兴趣所在","开始建立健康习惯，受益终身","人脉投入从同学关系开始"]},{stage:"职场初期",ageRange:"23-28 岁",focus:"快速学习，建立能力",tips:["技能投入优先，快速提升职场竞争力","健康不能忽视，避免透支身体","人脉从同事和行业社群拓展","设定 3 年成长目标，定期复盘"]},{stage:"职场上升期",ageRange:"29-35 岁",focus:"深度积累，形成壁垒",tips:["在专业领域深耕，建立不可替代性","开始关注财务管理，控制负债",'健康管理从"被动"变"主动"'," mentoring 他人也是自我成长"]},{stage:"成熟期",ageRange:"36-45 岁",focus:"稳定输出，传承价值",tips:['从"学"转向"用"和"教"',"家庭与事业的平衡是关键","健康投入比重需提高","帮助年轻人成长，回馈社会"]}],X=[{title:"致支持我的家人",content:"谢谢你们一直以来的支持和陪伴。我正在认真生活、持续成长，每一点进步都有你们的功劳。我会照顾好自己，也会努力成为更好的人。"},{title:"给爸爸妈妈的一封信",content:"这些年辛苦了。我知道成长不是一件容易的事，而你们的爱是我最坚实的后盾。我会好好珍惜自己，也会常回家看看。"},{title:"感恩有你",content:"感谢你在我成长路上的每一份付出。也许我不常说，但我都记得。我会带着这份爱，继续向前走。"},{title:"我在好好长大",content:"请放心，我在认真生活、努力成长。健康、学习、工作，我都在用心经营。谢谢你给我的一切，我会用成长来回报。"}];function kt(t,e){const n=e??new Date().getDate()%X.length,o=X[n];return{title:o.title,content:o.content,signature:`—— 一个正在成长的人（${t.age} 岁）`}}function U(){return X.length}function rt(t,e){const n=S(t),o=Mt(t,e),i=V(t),s=st(t),l=[];return l.push("═══════════════════════════════════════"),l.push("         人 生 成 长 报 告"),l.push("═══════════════════════════════════════"),l.push(""),l.push(`生成时间：${new Date().toLocaleString("zh-CN")}`),l.push(""),l.push("【一、当前状态】"),l.push(`  成长指数：${Math.round(n.price)} 点`),l.push(`  累计成长值：${Math.round(n.bv)} 点`),l.push(`  成长系数：${n.growthCoef.toFixed(2)}`),l.push(`  质量系数：${n.qualityCoef.toFixed(2)}`),l.push(`  风险折扣：${Math.round(n.riskDiscount*100)}%`),l.push(`  主观感知权重：${n.subjectiveAdjust.toFixed(2)}`),l.push(""),l.push("【二、本月概览】"),l.push(`  月度变化：${o.changePoints>=0?"+":""}${o.changePoints} 点（${o.changePct>=0?"+":""}${o.changePct}%）`),l.push(`  投入笔数：${o.investCount} 笔，实际花费 ${o.investAmount.toLocaleString()} 元（仅为记录）`),l.push(`  记录天数：${o.journalDays} 天`),o.highlights.length>0&&(l.push("  本月亮点："),o.highlights.forEach(r=>l.push(`    - ${r}`))),l.push(""),l.push("【三、投入结构】"),i.dimensions.forEach(r=>{l.push(`  ${r.label}：${r.amount.toLocaleString()} 元`)}),l.push(`  均衡度：${Math.round(i.balance*100)}%`),l.push(""),l.push("【四、挑战进度】"),s.forEach(r=>{l.push(`  ${r.icon} ${r.name}：${r.progress}/${r.target} ${r.unit} ${r.done?"✓":""}`)}),l.push(""),l.push("【五、下月建议】"),o.suggestions.forEach(r=>l.push(`  • ${r}`)),l.push(""),l.push("═══════════════════════════════════════"),l.push("  本报告由「今日宜长进」在你的设备本地生成"),l.push("  数值为模型估算，仅供自我观察与反思，不构成理财、职业或心理建议"),l.push("═══════════════════════════════════════"),l.join(`
`)}class fe{get(e){return localStorage.getItem(e)}set(e,n){localStorage.setItem(e,n)}remove(e){localStorage.removeItem(e)}clear(){localStorage.clear()}}const P=new fe,lt="lifeStockUser",St="disclaimerConfirmed",Et="privacyConsent",Q="sensitiveConsent";function A(t){P.set(lt,JSON.stringify(t))}function he(){const t=P.get(lt);if(!t)return null;try{const e=JSON.parse(t),n=wt(e,e.version);return n.investments=(n.investments||[]).map(o=>({...o,date:new Date(o.date)})),n.setbacks&&(n.setbacks=n.setbacks.map(o=>({...o,date:new Date(o.date)}))),n}catch{return null}}function ye(){P.remove(lt)}function be(){return P.get(Et)==="1"}function xe(){P.set(Et,"1")}function G(){return P.get(Q)==="1"}function we(t){t?P.set(Q,"1"):P.remove(Q)}function $e(){P.clear()}function Me(){return P.get(St)==="1"}function ke(){P.set(St,"1")}function Se(t){const e={...Kt(t),exportTime:new Date().toISOString()},n=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),o=URL.createObjectURL(n),i=document.createElement("a");i.href=o,i.download=`life-index-${t.age}岁-${new Date().toISOString().slice(0,10)}.json`,i.click(),URL.revokeObjectURL(o)}function Ee(t){const e=JSON.parse(t);if(!e.age||!e.history)throw new Error("文件格式不正确");const n=wt(e,e.version);return n.investments=(n.investments||[]).map(o=>({...o,date:new Date(o.date)})),n.setbacks&&(n.setbacks=n.setbacks.map(o=>({...o,date:new Date(o.date)}))),n}function Ie(){a&&Se(a)}function Ce(t){const e=t.target.files?.[0];if(!e)return;const n=new FileReader;n.onload=o=>{try{a=Ee(o.target.result),A(a),L(),k("✅ 数据已导入")}catch{k("❌ 导入失败：文件格式不正确")}},n.readAsText(e),t.target.value=""}let a=null,N=0,It="education",w={};window.startOnboarding=De;window.showAnchorModal=_e;window.showForecastModal=Ne;window.showShareModal=Fe;window.showSetbackModal=qe;window.showDetailModal=Ye;window.showParentModal=Ue;window.editProfile=Je;window.resetAll=Ve;window.exportData=Ie;window.importData=Ce;window.handleDeleteAllData=Ze;window.closeModal=R;window.showLegalModal=tt;const vt=[{title:"第1步：你今年多大？",desc:"年龄帮我们找到你在人生曲线上的位置",field:"age",type:"number",placeholder:"请输入年龄（1-100）"},{title:"第2步：你来自哪里？",desc:"不同城市的成长成本不太一样",field:"region",type:"select",options:[{value:"tier1",label:"一线城市（北上广深）"},{value:"new_tier1",label:"新一线城市"},{value:"tier2",label:"二线城市"},{value:"tier3",label:"三线及以下"}]},{title:"第3步：家庭条件？",desc:"家庭支持也是成长积累的一部分",field:"income",type:"select",options:[{value:"low",label:"困难"},{value:"below_avg",label:"偏低"},{value:"avg",label:"一般"},{value:"above_avg",label:"较好"},{value:"high",label:"富裕"}]},{title:"第4步：你的学历？",desc:"学历是会跟你一辈子的资产",field:"education",type:"select",options:[{value:"primary",label:"小学"},{value:"junior",label:"初中"},{value:"senior",label:"高中"},{value:"college",label:"大专"},{value:"bachelor",label:"本科"},{value:"master",label:"硕士及以上"}]},{title:"第5步：你的年收入？",desc:"收入是成长力的一部分，填税前年薪就好",field:"annualIncome",type:"number",placeholder:"请输入税前年收入（元），如 120000"},{title:"第6步：收入增长趋势？",desc:"持续增长会让成长更有动力",field:"annualIncomeGrowth",type:"select",options:[{value:"0",label:"下降"},{value:"0.05",label:"稳定"},{value:"0.1",label:"稳步增长"},{value:"0.2",label:"快速增长"}]},{title:"第7步：每周学习时长？",desc:"学习是最值得的自我投入",field:"studyHours",type:"select",options:[{value:"0",label:"几乎不学习"},{value:"2",label:"约2小时"},{value:"5",label:"约5小时"},{value:"10",label:"10小时以上"}]},{title:"第8步：健康状况？",desc:"健康是一切的底座",field:"healthScore",type:"select",options:[{value:"40",label:"较差"},{value:"60",label:"一般"},{value:"75",label:"良好"},{value:"90",label:"优秀"}]},{title:"第9步：负债情况？",desc:"适度负债没关系，留意它的影响就好",field:"debtRatio",type:"select",options:[{value:"0",label:"无负债"},{value:"0.1",label:"少量负债"},{value:"0.3",label:"中等负债"},{value:"0.6",label:"高负债"}]},{title:"第10步：人生节点（可多选）",desc:"已达成的节点都是成长的里程碑",field:"milestones",type:"multi",options:[{value:"hasJob",label:"💼 有工作"},{value:"salaryRaised",label:"💰 涨过薪"},{value:"hasLicense",label:"🚗 有驾照"},{value:"marathon",label:"🏃 跑过马拉松"},{value:"married",label:"💍 已婚"},{value:"hasHouse",label:"🏠 有房"},{value:"hasChild",label:"👶 有孩子"}]}];function J(){return G()?vt:vt.filter(t=>t.field!=="annualIncome"&&t.field!=="debtRatio")}function De(){N=0,w={},document.getElementById("landing")?.classList.add("hidden"),Ct()}function Ct(){const e=J()[N],n=$(e.title,e.desc);let o="";e.type==="number"?o=`<input type="number" id="onboardInput" class="form-input" placeholder="${e.placeholder}" style="width:100%;padding:12px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);font-size:16px;">`:e.type==="select"?o=`<select id="onboardInput" style="width:100%;padding:12px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);font-size:16px;">
      ${e.options.map(i=>`<option value="${i.value}">${i.label}</option>`).join("")}
    </select>`:e.type==="multi"&&(o=`<div id="multiOptions" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      ${e.options.map(i=>`<label style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--surface-softer);border-radius:10px;cursor:pointer;"><input type="checkbox" value="${i.value}"> ${i.label}</label>`).join("")}
    </div>`),o+=`<div class="form-actions"><button class="btn-primary" onclick="submitOnboarding()">${N===J().length-1?"生成我的成长曲线":"下一步"}</button></div>`,n.querySelector(".modal-body").innerHTML=o}window.submitOnboarding=Te;function Te(){const t=J()[N];if(t.type==="multi")Array.from(document.querySelectorAll("#multiOptions input:checked")).map(n=>n.value).forEach(n=>{w[n]=!0});else{const e=document.getElementById("onboardInput").value;t.type==="number"?w[t.field]=Number(e):w[t.field]=e}N++,N>=J().length?ze():Ct()}function ze(){const t=w.age;a={age:t,region:w.region,area:"urban",income:w.income,education:w.education,birthYear:new Date().getFullYear()-t,annualIncome:G()?w.annualIncome:1e5,annualIncomeGrowth:Number(w.annualIncomeGrowth??.05),studyHours:Number(w.studyHours),healthScore:Number(w.healthScore),debtRatio:G()?Number(w.debtRatio):0,hasJob:!!w.hasJob,salaryRaised:!!w.salaryRaised,hasLicense:!!w.hasLicense,marathon:!!w.marathon,married:!!w.married,hasHouse:!!w.hasHouse,hasChild:!!w.hasChild,totalInvest:0,history:Jt({age:t,region:w.region,area:"urban",income:w.income,education:w.education}),investments:[],familySupportCapital:0,subjectiveWeight:1,version:et},A(a),R(),L(),k(G()?"✅ 成长曲线已生成！":"✅ 成长曲线已生成（敏感项使用估算值）")}function L(){if(!a)return;const t=a;document.getElementById("landing")?.classList.add("hidden"),document.getElementById("dashboard")?.classList.remove("hidden");const e=S(t);document.getElementById("dashPrice").textContent=Math.round(e.price).toLocaleString()+" 点";const n=document.getElementById("dashChange");n.textContent=(e.change>=0?"+":"")+e.change+"%",n.style.color=e.change>=0?"var(--accent-green)":"var(--accent-red)",document.getElementById("dashBV").textContent=Math.round(e.bv).toLocaleString()+" 点",document.getElementById("dashEPS").textContent=String(e.eps),document.getElementById("dashROE").textContent=e.roe+"%",document.getElementById("dashPE").textContent=e.pe==="—"?"—":e.pe+"倍";const o=qt(t),i=o.level==="high"?"var(--accent-green)":o.level==="medium"?"var(--accent-yellow)":"var(--accent-red)",s=Math.round(o.estimatedRatio*100),l=Math.round(o.potentialEstimatedRatio*100);document.getElementById("dashConfidence").innerHTML=`<span style="color:${i};font-weight:bold;">● ${o.label}</span> 本指数含 ${s}% 估算成分`+(o.level!=="high"?`，<a href="javascript:showAnchorModal()" style="color:var(--accent-blue);text-decoration:underline;">校准后可降至 ${l}%</a>`:"")+'<br><a href="javascript:showDetailModal()" style="color:var(--text-muted);text-decoration:underline;">查看数据来源 →</a>';const r=H(t);Re(r,t);const c=document.getElementById("investAmount");c&&(G()?(c.placeholder="这笔花了多少（元，仅存本机）",c.disabled=!1):(c.placeholder="未授权金额信息，可只写描述直接添加",c.disabled=!0,c.value="")),Le(t),je(t),Dt(t),Tt(t)}window.selectInvestType=Pe;function Pe(t){It=t,document.querySelectorAll(".invest-type").forEach(e=>{e.classList.toggle("selected",e.getAttribute("data-type")===t)})}window.addInvestment=Ae;function Ae(){if(!a)return;const t=document.getElementById("investAmount"),e=document.getElementById("investDesc"),n=G(),o=n?Number(t.value):0;if(n&&(!o||o<=0)){k("请输入有效金额，或留空仅记录事件");return}a.investments.push({type:It,amount:o,desc:e.value||void 0,date:new Date}),a.totalInvest+=o,t.value="",e.value="",A(a),L(),k(n&&o>0?`✅ 已记录这笔投入 ${o.toLocaleString()} 元，成长指数已更新`:"✅ 已记录这笔投入，成长指数已更新")}function Le(t){const e=j.filter(o=>o.condition(t));document.getElementById("milestoneCount").textContent=`(${e.length}/${j.length})`;const n=document.getElementById("milestoneList");n.innerHTML=j.map(o=>{const i=o.condition(t);return`<div class="milestone-item ${i?"done":""}" style="opacity:${i?1:.5};">
      <span class="m-icon">${o.icon}</span>
      <span class="m-name">${o.name} <span style="font-size:11px;color:var(--text-muted);">${o.desc}</span></span>
      <span class="m-bonus">${i?"✓ +"+o.bonus:"+"+o.bonus}</span>
    </div>`}).join("")}function je(t){const e=document.getElementById("investList");if(t.investments.length===0){e.innerHTML='<div style="text-align:center;color:var(--text-secondary);padding:30px;">还没有投入记录，记一笔试试吧</div>';return}const n={education:"🎓",skill:"📚",health:"💪",network:"🤝",entertainment:"🎮",other:"📦"};e.innerHTML=t.investments.slice().reverse().map(o=>`
    <div class="invest-item">
      <span class="i-type">${n[o.type]||"📦"}</span>
      <div class="i-info">
        <div>${o.desc||o.type} ${o.impact?'<span class="i-impact">⭐ 影响大</span>':""}</div>
        <div style="font-size:11px;color:var(--text-muted);">${new Date(o.date).toLocaleDateString("zh-CN")}</div>
      </div>
      <span class="i-amount">${o.amount>0?o.amount.toLocaleString()+" 元":"未填金额"}</span>
    </div>
  `).join("")}function Re(t,e){const n=document.getElementById("klineCanvas");if(!n||t.length<2)return;const o=n.getBoundingClientRect();n.width=o.width*2,n.height=o.height*2;const i=n.getContext("2d");i.scale(2,2);const s=o.width,l=o.height,r={l:50,r:55,t:20,b:40},c=s-r.l-r.r,d=50,p=l-r.t-r.b-d-10,u=r.t+p+10,g=t.map(M=>M.price),v=Math.min(...g)*.95,f=Math.max(...g)*1.05,h=f-v||1,C=Math.max(...t.map(M=>M.invest),1),b=xt(e),I=r.t+p*(1-(b-v)/h),E=t.map((M,x)=>{const D=Math.max(0,x-4);return t.slice(D,x+1).reduce((T,W)=>T+W.price,0)/(x-D+1)});i.clearRect(0,0,s,l),i.strokeStyle="rgba(120,95,60,0.12)";for(let M=0;M<=4;M++){const x=r.t+p/4*M;i.beginPath(),i.moveTo(r.l,x),i.lineTo(s-r.r,x),i.stroke(),i.fillStyle="rgba(163,150,132,0.95)",i.font="11px sans-serif",i.fillText(String(Math.round(f-h/4*M)),5,x+4)}const m=c/(t.length-1);I>=r.t&&I<=r.t+p&&(i.strokeStyle="rgba(224,153,47,0.55)",i.lineWidth=1.2,i.setLineDash([6,4]),i.beginPath(),i.moveTo(r.l,I),i.lineTo(s-r.r,I),i.stroke(),i.setLineDash([]),i.fillStyle="#c9871f",i.font="bold 10px sans-serif",i.fillText("同龄人 "+Math.round(b)+" 点",s-r.r+3,I+3));const z=i.createLinearGradient(0,r.t,0,r.t+p);z.addColorStop(0,"rgba(255,138,76,0.3)"),z.addColorStop(1,"rgba(255,138,76,0)"),i.beginPath(),i.moveTo(r.l,r.t+p),t.forEach((M,x)=>{const D=r.l+m*x,T=r.t+p*(1-(M.price-v)/h);i.lineTo(D,T)}),i.lineTo(r.l+c,r.t+p),i.closePath(),i.fillStyle=z,i.fill(),i.beginPath(),E.forEach((M,x)=>{const D=r.l+m*x,T=r.t+p*(1-(M-v)/h);x===0?i.moveTo(D,T):i.lineTo(D,T)}),i.strokeStyle="rgba(62,155,143,0.7)",i.lineWidth=1.5,i.setLineDash([4,3]),i.stroke(),i.setLineDash([]),i.beginPath(),t.forEach((M,x)=>{const D=r.l+m*x,T=r.t+p*(1-(M.price-v)/h);x===0?i.moveTo(D,T):i.lineTo(D,T)}),i.strokeStyle="#ff8a4c",i.lineWidth=2.5,i.stroke();const Pt=[0,6,15,18,22,30];t.forEach((M,x)=>{if(Pt.includes(M.age)){const D=r.l+m*x,T=r.t+p*(1-(M.price-v)/h);i.beginPath(),i.arc(D,T,5,0,Math.PI*2),i.fillStyle="#3fa06a",i.fill(),i.strokeStyle="#ffffff",i.lineWidth=2,i.stroke()}});const B=t[t.length-1],ct=r.t+p*(1-(B.price-v)/h);i.fillStyle=B.price>=b?"#3fa06a":"#e05c4b",i.fillRect(s-r.r,ct-9,50,18),i.fillStyle="#fff",i.font="bold 11px sans-serif",i.textAlign="center",i.fillText(Math.round(B.price)+" 点",s-r.r+25,ct+4),i.textAlign="left",t.forEach((M,x)=>{const D=r.l+m*x,T=M.invest/C*d,W=Math.max(1,m*.5);i.fillStyle=B.price>=g[0]?"rgba(63,160,106,0.5)":"rgba(224,92,75,0.5)",i.fillRect(D-W/2,u+d-T,W,T)});const At=Math.max(1,Math.floor(t.length/8));i.fillStyle="rgba(163,150,132,0.95)",i.font="11px sans-serif",t.forEach((M,x)=>{(x%At===0||x===t.length-1)&&i.fillText(M.age+"岁",r.l+m*x-10,l-r.b+20)}),i.font="10px sans-serif",i.fillStyle="#ff8a4c",i.fillRect(r.l+5,r.t+4,12,3),i.fillStyle="#6f6558",i.fillText("指数",r.l+21,r.t+8),i.fillStyle="#3e9b8f",i.fillRect(r.l+50,r.t+4,12,3),i.fillStyle="#6f6558",i.fillText("MA5",r.l+66,r.t+8),i.fillStyle="#e0992f",i.fillRect(r.l+105,r.t+4,12,3),i.fillStyle="#6f6558",i.fillText("同龄人",r.l+121,r.t+8),document.getElementById("klineAge").textContent=`（${B.age}岁，当前 ${Math.round(B.price)} 点）`}function $(t,e){const n=document.getElementById("modalContainer");return n.innerHTML=`<div class="modal-overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal" style="position:relative;">
      <button class="modal-close" onclick="closeModal()">×</button>
      <h2>${t}</h2>
      <p class="modal-desc">${e}</p>
      <div class="modal-body"></div>
    </div>
  </div>`,n.querySelector(".modal")}function R(){document.getElementById("modalContainer").innerHTML=""}function k(t){const e=document.createElement("div");e.className="toast",e.textContent=t,document.getElementById("toastContainer").appendChild(e),setTimeout(()=>e.remove(),2500)}function _e(){if(!a)return;const t=$("🎯 校准指数","用真实数据修正估算，提升指数置信度");t.querySelector(".modal-body").innerHTML=`
    <div style="display:grid;grid-template-columns:1fr;gap:16px;">
      <!-- B1-1：单笔投入反推校准 -->
      <div style="padding:12px;background:var(--surface-softer);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">① 用一笔真实投入反推校准</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">输入你印象深刻的某年真实投入，系统按比例校准所有历史估算。</div>
        <div class="form-label">年龄</div>
        <input type="number" id="anchorAge" value="${a.age}" style="width:100%;padding:10px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);margin-bottom:10px;">
        <div class="form-label">该年真实投入（元）</div>
        <input type="number" id="anchorAmount" placeholder="如 30000" style="width:100%;padding:10px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);margin-bottom:10px;">
        <button class="btn-primary" onclick="applyAnchor()" style="width:100%;">应用校准</button>
      </div>

      <!-- B1-2：手动调整家庭支持 -->
      <div style="padding:12px;background:rgba(62,155,143,0.08);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">② 家庭支持（万元，选填）</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">父母/家庭对你的累计投入折算，不折旧、不乘权重，单独计入累计成长值。仅保存在本机。</div>
        <input type="number" id="familyCapital" value="${a.familySupportCapital||0}" step="1" style="width:100%;padding:10px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);margin-bottom:10px;">
        <button class="btn-primary" onclick="applyFamilyCapital()" style="width:100%;">保存家庭支持</button>
      </div>

      <!-- B1-3：标记"对我影响大"的投入 -->
      <div style="padding:12px;background:rgba(255,138,76,0.08);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">③ 标记"对我影响很大"的投入</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">已记录的自我投入中，标记后会在明细页高亮展示（不改变数值，仅反映主观感知）。</div>
        ${a.investments.length===0?'<div style="font-size:12px;color:var(--text-muted);">暂无手动记录的投入。先去「记一笔」添加吧。</div>':a.investments.map((e,n)=>`
            <label style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--surface-softer);border-radius:8px;margin-bottom:6px;cursor:pointer;">
              <input type="checkbox" id="impact_${n}" ${e.impact?"checked":""}>
              <span style="font-size:13px;">${e.desc||e.type} · ${e.amount.toLocaleString()} 元</span>
            </label>
          `).join("")}
        ${a.investments.length>0?'<button class="btn-primary" onclick="applyImpact()" style="width:100%;margin-top:8px;">保存标记</button>':""}
      </div>

      <!-- 主观感知权重 -->
      <div style="padding:12px;background:rgba(63,160,106,0.08);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">④ 主观感知权重（${a.subjectiveWeight||1}）</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">你觉得自己的成长值这个权重吗？1.0 为中性，0.5 偏低、1.5 偏高。这是你的主观判断，不影响客观累计成长值。</div>
        <input type="range" id="subjectiveRange" min="0.5" max="1.5" step="0.05" value="${a.subjectiveWeight||1}" style="width:100%;" oninput="document.getElementById('subjVal').textContent=this.value">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);">
          <span>0.5（偏低）</span><span id="subjVal">${a.subjectiveWeight||1}</span><span>1.5（偏高）</span>
        </div>
        <button class="btn-primary" onclick="applySubjective()" style="width:100%;margin-top:10px;">保存主观权重</button>
      </div>
    </div>
  `}window.applySubjective=He;function He(){if(!a)return;const t=Number(document.getElementById("subjectiveRange").value);a.subjectiveWeight=Ft(t),A(a),L(),k("✅ 主观权重已设为 "+a.subjectiveWeight),R()}window.applyFamilyCapital=Be;function Be(){if(!a)return;const t=Number(document.getElementById("familyCapital").value);a.familySupportCapital=Math.max(0,t),A(a),L(),k("✅ 家庭支持已更新"),R()}window.applyImpact=Oe;function Oe(){a&&(a.investments=a.investments.map((t,e)=>{const n=document.getElementById("impact_"+e);return{...t,impact:n?.checked||!1}}),A(a),k("✅ 标记已保存"),R())}window.applyAnchor=Ge;function Ge(){if(!a)return;const t=Number(document.getElementById("anchorAge").value),e=Number(document.getElementById("anchorAmount").value),n=a.history.findIndex(o=>o.age===t);if(n>=0){const o=e/a.history[n].invest;a.history=a.history.map(i=>({...i,invest:i.invest*o})),A(a),L(),k("✅ 校准成功！系数 "+o.toFixed(2))}R()}function Ne(){if(!a)return;const e=S(a).price,n=Array.from({length:50},()=>{let i=e;for(let s=0;s<10;s++){const l=.12+(Math.random()-.5)*.3;i*=1+l}return i}).sort((i,s)=>i-s),o=$("🔮 未来展望","基于假设参数的模拟推演，非预测承诺");o.querySelector(".modal-body").innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
      <div style="padding:12px;background:rgba(224,92,75,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">保守 (P10)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-red);">${Math.round(n[5])} 点</div></div>
      <div style="padding:12px;background:rgba(255,138,76,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">中性 (P50)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-blue);">${Math.round(n[25])} 点</div></div>
      <div style="padding:12px;background:rgba(63,160,106,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">乐观 (P90)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-green);">${Math.round(n[45])} 点</div></div>
    </div>
    <p style="color:var(--text-muted);font-size:12px;">假设：年化成长12%，波动率15%，持续学习</p>
  `}function Fe(){if(!a)return;const t=a,e=S(t),n=e.roe>=15?"优秀":e.roe>=8?"良好":e.roe>=3?"一般":"待提升",o=j.filter(d=>d.condition(t)).length,i=e.effectiveHealth,s=i>=80?"优秀":i>=60?"良好":i>=40?"一般":"需关注",l=t.studyHours,r=l>=8?"勤奋":l>=3?"稳定":l>=1?"一般":"较少",c=$("📤 分享","生成专属指数卡片");c.querySelector(".modal-body").innerHTML=`
    <div style="background:linear-gradient(135deg,#ffb36b,#ff8a4c 60%,#f2702e);padding:24px;border-radius:16px;text-align:center;color:#fff;box-shadow:0 12px 32px rgba(255,138,76,0.28);">
      <div style="font-size:12px;color:rgba(255,255,255,0.85);margin-bottom:8px;letter-spacing:2px;">今日宜长进 · 成长指数手账</div>
      <div style="font-size:42px;font-weight:bold;color:#fff;">${Math.round(e.price)} 点</div>
      <div style="color:rgba(255,255,255,0.92);margin-bottom:16px;">${e.change>=0?"+":""}${e.change}%</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div><div style="font-size:11px;color:rgba(255,255,255,0.75)">成长效率</div><div style="font-weight:bold;color:#fff">${n}</div></div>
        <div><div style="font-size:11px;color:rgba(255,255,255,0.75)">里程碑</div><div style="font-weight:bold;color:#fff">${o}/${j.length}</div></div>
        <div><div style="font-size:11px;color:rgba(255,255,255,0.75)">健康等级</div><div style="font-weight:bold;color:#fff">${s}</div></div>
        <div><div style="font-size:11px;color:rgba(255,255,255,0.75)">学习习惯</div><div style="font-weight:bold;color:#fff">${r}</div></div>
      </div>
      <div style="margin-top:16px;font-size:11px;color:rgba(255,255,255,0.85);">成长没有标准答案，每一步都算数</div>
      <div style="margin-top:8px;font-size:10px;color:rgba(255,255,255,0.55);">数值为模型估算，仅供自我观察，不构成任何建议</div>
    </div>
  `}function qe(){const t=$("💥 记录挫折","成长有快有慢，记下这段经历，回头看会更清楚");t.querySelector(".modal-body").innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
      ${[{t:"jobloss",i:"💼",n:"失业/降薪",d:"收入下降"},{t:"illness",i:"🏥",n:"重大疾病",d:"健康衰退"},{t:"loss",i:"📉",n:"投入回落",d:"积累暂时放缓"},{t:"stagnate",i:"😴",n:"躺平/断更",d:"停止成长"}].map(e=>`<div class="setback-type" data-type="${e.t}" onclick="selectSetback('${e.t}')" style="padding:12px;background:var(--surface-softer);border-radius:10px;cursor:pointer;text-align:center;"><div style="font-size:24px">${e.i}</div><div style="font-weight:bold;margin-top:4px">${e.n}</div><div style="font-size:11px;color:var(--text-muted)">${e.d}</div></div>`).join("")}
    </div>
    <input type="range" id="setbackSeverity" min="1" max="10" value="5" style="width:100%;">
    <div style="text-align:center;color:var(--text-secondary);margin:8px 0;">严重度：<span id="severityVal">5</span></div>
    <div class="form-actions"><button class="btn-primary" style="background:linear-gradient(135deg,#e05c4b,#c94736);" onclick="applySetback()">确认记录</button></div>
  `,document.getElementById("setbackSeverity").oninput=e=>{document.getElementById("severityVal").textContent=e.target.value}}let O="";window.selectSetback=t=>{O=t};window.applySetback=We;function We(){if(!a||!O)return;const t=Number(document.getElementById("setbackSeverity").value)/10,e=S(a).price;if(O==="jobloss")a.annualIncome=Math.max(0,a.annualIncome*(1-.3*t)),a.annualIncomeGrowth=-.1;else if(O==="illness")a.healthScore=Math.max(20,a.healthScore-30*t),a.debtRatio=Math.min(.8,a.debtRatio+.2*t);else if(O==="loss"){const o=a.totalInvest*.15*t;a.totalInvest=Math.max(0,a.totalInvest-o),a.history=a.history.map(i=>({...i,invest:i.invest*(1-.15*t)}))}else O==="stagnate"&&(a.studyHours=Math.max(0,a.studyHours-2*t));A(a);const n=S(a).price;R(),k(`指数 ${e.toFixed(1)} → ${n.toFixed(1)}`),L()}function Ye(){if(!a)return;const t=a,e=S(t),n=nt(t.age),o=j.filter(d=>d.condition(t)),i={};t.history.forEach(d=>{const p=y.TYPE_WEIGHTS[d.type]||1,u=d.invest/1e4*p*K(1,Math.max(0,t.age-d.age),d.type);i[d.type]=(i[d.type]||0)+u});const s={education:"教育",skill:"技能",health:"健康",network:"人脉",entertainment:"娱乐",other:"其他"},l=Ot.education_cost,r=Object.keys(y.AGE_SPEND_RANGE),c=$("📋 计算明细","看清每一个数字的来龙去脉");c.querySelector(".modal-body").innerHTML=`
    <div style="font-family:monospace;font-size:13px;line-height:2;">
      <div style="padding:12px;background:rgba(255,138,76,0.1);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;color:var(--accent-blue);margin-bottom:8px;">📐 计算公式</div>
        <div style="color:var(--text-secondary)">成长指数 = (100 + 累计成长值 × 阶段系数 + min(里程碑加成,200)) × 成长系数 × 质量系数 × (1 - 风险折扣) × 主观调整</div>
      </div>
      <div style="padding:12px;background:var(--surface-softer);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;margin-bottom:8px;">② 累计成长值 = ${e.bv.toFixed(2)}（单位：万元口径）</div>
        ${Object.entries(i).map(([d,p])=>`<div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">${s[d]||d}</span><span>${p.toFixed(2)}</span></div>`).join("")}
        ${t.familySupportCapital?`<div style="display:flex;justify-content:space-between;color:var(--accent-purple);"><span>家庭支持（不折旧）</span><span>${t.familySupportCapital}</span></div>`:""}
        <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px;font-weight:bold;">成长值 × 阶段系数 = ${e.bv.toFixed(2)} × ${n.toFixed(2)} = ${(e.bv*n).toFixed(2)}</div>
      </div>

      <!-- A1：数据溯源卡片 -->
      <div style="padding:12px;background:rgba(224,153,47,0.06);border:1px solid rgba(224,153,47,0.2);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;color:var(--accent-yellow);margin-bottom:8px;">🔍 历史投入估算 · 数据溯源</div>
        <div style="font-size:12px;color:var(--text-secondary);line-height:1.8;">
          <div><strong>数据来源：</strong>${l.name}（${l.year}）</div>
          <div><strong>原始口径：</strong>${l.caliber}</div>
          <div><strong>调整系数：</strong>地区 ${y.REGION_COEF[t.region]} × 城乡 ${y.AREA_COEF[t.area]} × 收入 ${y.INCOME_COEF[t.income]}</div>
        </div>
        <!-- A2：参考区间，替代"±4%精度" -->
        <div style="margin-top:10px;padding:10px;background:var(--surface-softer);border-radius:8px;">
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">📊 各阶段年均教育投入参考区间（元）：</div>
          ${r.map(d=>{const p=y.AGE_SPEND_RANGE[d];return`<div style="display:flex;justify-content:space-between;font-size:12px;"><span style="color:var(--text-secondary)">${d}岁</span><span>${p.low.toLocaleString()} ~ ${p.mid.toLocaleString()} ~ ${p.high.toLocaleString()}</span></div>`}).join("")}
          <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">以上为统计估算区间，非精确值。点击「校准指数」可修正为你的真实投入。</div>
        </div>
      </div>

      <div style="padding:12px;background:var(--surface-softer);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;margin-bottom:8px;">③ 里程碑加成 = ${e.milestoneBonus}（封顶 200）</div>
        ${o.map(d=>`<div style="font-size:12px;color:var(--text-secondary)">${d.icon} ${d.name} +${d.bonus}</div>`).join("")}
      </div>
      <div style="padding:12px;background:var(--surface-softer);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;margin-bottom:8px;">④ 系数</div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">成长系数</span><span>${e.growthCoef}</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">质量系数（健康${e.effectiveHealth}）</span><span>${e.qualityCoef}</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">风险折扣（负债率${(t.debtRatio*100).toFixed(0)}%）</span><span>${e.riskDiscount}</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">主观感知权重</span><span>${e.subjectiveAdjust}</span></div>
      </div>

      <!-- 归因分析 -->
      <div style="padding:12px;background:rgba(255,138,76,0.06);border:1px solid rgba(255,138,76,0.2);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;color:var(--accent-blue);margin-bottom:8px;">📊 指数归因 · 每个因子贡献了多少</div>
        ${(()=>{const d=Xt(t,e),p=Qt(d);return d.map(u=>{const g=u.contribution===0;return`<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid var(--surface-soft);">
              <span style="color:var(--text-secondary);font-size:12px;">${u.name}</span>
              <span style="font-size:12px;">${g?u.reason:`<strong>+${u.contribution}</strong> · ${u.reason}`}</span>
            </div>`}).join("")+(p?`<div style="margin-top:8px;padding:8px;background:rgba(63,160,106,0.08);border-radius:8px;font-size:12px;color:var(--accent-green);">⭐ 最大贡献：${p.name}（+${p.contribution}点）</div>`:"")})()}
      </div>

      <div style="padding:16px;background:linear-gradient(135deg,rgba(255,138,76,0.2),rgba(62,155,143,0.2));border-radius:12px;text-align:center;">
        <div style="color:var(--text-secondary);font-size:12px;">此刻的成长指数</div>
        <div style="font-size:32px;font-weight:bold;color:var(--accent-blue);">${Math.round(e.price)} 点</div>
      </div>
    </div>
    <div style="margin-top:16px;padding:12px;background:rgba(224,153,47,0.08);border-radius:10px;font-size:12px;color:var(--text-secondary);line-height:1.6;">
      温馨提示：以上数值基于模型估算，仅供自我观察与娱乐参考，不构成理财、职业或心理建议，也不预测未来收入。<br>
      本指数<strong>不衡量</strong>幸福感、关系质量、心理健康、创造力与社会贡献——成长没有标准曲线。
    </div>
  `}function Ue(){if(!a)return;const t=a.history.reduce((s,l)=>s+l.invest,0),e=a.investments.reduce((s,l)=>s+l.amount,0),n=t+e,o=S(a),i=$("👨‍👩‍👧 家庭视角","家人的每一份支持，都是你成长的底气");i.querySelector(".modal-body").innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
      <div style="padding:14px;background:rgba(62,155,143,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">家庭支持</div><div style="font-size:20px;font-weight:bold;color:var(--accent-purple);">${t.toLocaleString()} 元</div></div>
      <div style="padding:14px;background:rgba(251,146,60,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">自我投入</div><div style="font-size:20px;font-weight:bold;color:#ff8a4c;">${e.toLocaleString()} 元</div></div>
    </div>
    <div style="height:20px;background:var(--surface-soft);border-radius:10px;overflow:hidden;display:flex;">
      <div style="width:${t/n*100}%;background:var(--accent-purple);"></div>
      <div style="width:${e/n*100}%;background:#ff8a4c;"></div>
    </div>
    <div style="margin-top:16px;padding:14px;background:rgba(63,160,106,0.1);border-radius:12px;font-size:13px;color:var(--text-secondary);line-height:1.7;">
      💡 当前 ${a.age} 岁，成长指数已从基准 100 走到 ${Math.round(o.price)} 点。<br>
      ${e===0?'⚠️ 还没有记录自我投入，试试"记一笔"吧！':"继续加油，每一笔自我投入都在为成长添砖加瓦。"}
    </div>
  `}function Je(){k("请重置后重新填写问卷（投入记录会保留）")}function Ve(){confirm("确定要重置所有数据吗？")&&(ye(),a=null,document.getElementById("dashboard")?.classList.add("hidden"),document.getElementById("landing")?.classList.remove("hidden"))}const Z="2026-06-01",Ke=`
  <div style="font-size:13px;color:var(--text-secondary);line-height:1.9;text-align:left;">
    <p style="color:var(--text-muted);">生效日期：${Z}。最近更新：${Z}。</p>
    <p><strong>一、我们是谁</strong><br>「今日宜长进」（成长指数手账）是一款个人成长记录与自我反思工具，本应用没有后端服务器。</p>
    <p><strong>二、我们收集的信息</strong><br>1. <strong>基础成长信息</strong>：年龄、所在地区、家庭条件区间、学历、学习时长、健康自评、人生节点等，用于生成成长曲线。<br>
    2. <strong>敏感信息（需你单独勾选同意）</strong>：年收入、收入增长、负债情况、家庭支持金额、每笔花费的具体金额。这些信息属于敏感个人信息，仅在你单独勾选「同意收集敏感信息」后才会被记录。</p>
    <p><strong>三、信息存储与使用</strong><br>所有信息默认仅保存在你当前设备的浏览器本地存储（localStorage）中，<strong>不会上传到任何服务器</strong>，本应用不提供账号体系与云端同步。信息仅用于在你本机计算成长指数、绘制成长曲线与生成本地周报。</p>
    <p><strong>四、拒绝授权的影响</strong><br>你可以拒绝提供敏感信息，应用仍可正常使用：收入、负债与金额类字段将使用通用估算值（估算占比会在页面如实标注），你也可以随时改主意并在重新进入时补充真实信息。</p>
    <p><strong>五、未成年人</strong><br>若你未满 14 周岁，请在监护人陪同与同意后使用本应用并填写信息。</p>
    <p><strong>六、如何删除信息</strong><br>你可在「设置」中使用「删除全部数据」一键清除本机所有数据；也可以直接清除浏览器站点数据。删除后数据无法恢复。</p>
    <p><strong>七、联系我们</strong><br>如对本政策有疑问，可通过应用仓库的 Issue 渠道反馈。</p>
  </div>`,Xe=`
  <div style="font-size:13px;color:var(--text-secondary);line-height:1.9;text-align:left;">
    <p style="color:var(--text-muted);">生效日期：${Z}。</p>
    <p><strong>一、服务性质</strong><br>「今日宜长进」是个人成长记录与自我反思工具，<strong>不是</strong>金融理财、证券投资、职业咨询、医疗健康或心理咨询服务。成长指数（单位：点）为模型估算数值，仅供娱乐与自我观察。</p>
    <p><strong>二、不构成专业建议</strong><br>应用内的指数、曲线、周报、伙伴对话等内容均由本地规则/模板基于你填写的信息生成，不构成任何理财、证券、职业规划、医疗或心理建议，<strong>不得用于任何投资决策</strong>，也不预测你的未来收入。模型存在误差，页面会标注估算成分与置信度。</p>
    <p><strong>三、情绪与健康提示</strong><br>应用内容不能替代专业心理咨询或医疗诊断。如果你正经历严重的情绪困扰，请及时联系专业人士或拨打心理援助热线（如全国心理援助热线 12356）。</p>
    <p><strong>四、你的内容与数据</strong><br>你填写的所有内容均保存在你的设备本地，由你自行负责保管与备份。导出、分享或在公共设备使用后，请自行删除数据。</p>
    <p><strong>五、合理使用</strong><br>请勿利用本应用从事违法违规活动，或以本应用输出冒充专业意见对外传播。</p>
    <p><strong>六、免责与争议</strong><br>在法律允许的最大范围内，我们不对你因使用或无法使用本应用而产生的间接损失承担责任。与本协议相关的争议，双方应友好协商解决；协商不成的，适用中华人民共和国法律。</p>
  </div>`;function tt(t){const e=t==="privacy",n=$(e?"🔒 隐私政策":"📜 用户协议",e?"请仔细阅读，重点内容已加粗":"使用本应用前请知悉");n.style.maxWidth="560px",n.querySelector(".modal-body").innerHTML=e?Ke:Xe;const o=n.parentElement;o&&(o.style.zIndex="10001")}function Qe(){if(!be()){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`<div class="modal" style="max-width:500px;">
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
    </div>`,document.body.appendChild(t),t.querySelector("#linkPrivacy1").onclick=()=>tt("privacy"),t.querySelector("#linkTerms1").onclick=()=>tt("terms");const e=t.querySelector("#consentPrivacy");e.onclick=()=>{if(!t.querySelector("#consentBase").checked){k("请先勾选并同意《隐私政策》与《用户协议》");return}xe(),we(t.querySelector("#consentSensitive").checked),t.remove(),gt()};return}gt()}function gt(){if(Me())mt();else{const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`<div class="modal" style="max-width:480px;">
      <h2>⚠️ 温馨提示</h2>
      <p style="color:var(--text-secondary);line-height:1.9;margin:16px 0;">
        「今日宜长进」是一款<strong>个人成长记录与自我反思工具</strong>，所有数值均为模型估算，<strong style="color:var(--accent-yellow)">仅供娱乐与自我观察，不构成理财、职业或心理建议，也不预测收入</strong>。<br><br>
        今日宜长进，成长没有标准曲线。
      </p>
      <div class="form-actions"><button class="btn-primary" id="confirmDisclaimer">我知道了</button></div>
    </div>`,document.body.appendChild(t),document.getElementById("confirmDisclaimer").onclick=()=>{ke(),t.remove(),mt()}}}function mt(){const t=he();t&&(a=t,L())}function Ze(){confirm("确定要删除全部数据吗？此操作不可恢复。")&&($e(),a=null,document.getElementById("dashboard")?.classList.add("hidden"),document.getElementById("landing")?.classList.remove("hidden"),k("✅ 全部数据已删除"))}let q;window.setJournalMood=tn;function tn(t){q=q===t?void 0:t,document.querySelectorAll(".mood-btn").forEach(e=>{e.classList.toggle("selected",e.getAttribute("data-mood")===q)})}window.addJournal=en;function en(){if(!a)return;const t=document.getElementById("journalInput"),e=t.value.trim();if(!e){k("请输入内容");return}const n=te(e,q);a=ee(a,n),t.value="",q=void 0,document.querySelectorAll(".mood-btn").forEach(o=>o.classList.remove("selected")),A(a),Dt(a),Tt(a),k("✅ 已记录")}function Dt(t){const e=document.getElementById("recentJournals");if(!e)return;const n=ne(t,8);if(n.length===0){e.innerHTML='<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:10px;">还没有记录，写下此刻的想法吧</div>';return}const o={great:"😄",good:"🙂",ok:"😐",low:"😔"};e.innerHTML=n.map(i=>`
    <div class="journal-item">
      <span class="j-mood">${i.mood?o[i.mood]:"📝"}</span>
      <div class="j-content">
        <div>${i.content}</div>
        <div class="j-date">${new Date(i.date).toLocaleString("zh-CN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
      </div>
    </div>
  `).join("")}function Tt(t){const e=at(t),n=document.getElementById("weeklyBadge"),o=document.getElementById("weeklyTip");n&&(n.textContent=e.streakWeeks>0?`🔥 连续 ${e.streakWeeks} 周`:""),o&&(o.textContent=e.message)}window.showDrawdownModal=nn;function nn(){if(!a)return;const t=S(a),e=H(a),n=oe(e,t.price),o=ie(a),i=$("📉 成长回落复盘","复盘是为了觉察，不是自责");i.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">${n.inDrawdown?"📉":"📈"}</div>
        <div style="font-size:22px;font-weight:bold;margin-top:8px;">${n.inDrawdown?"阶段性回落":"稳健成长"}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">历史峰值</div><div class="metric-value">${Math.round(n.peak)}</div></div>
        <div class="metric"><div class="metric-label">当前指数</div><div class="metric-value">${Math.round(n.current)}</div></div>
        <div class="metric"><div class="metric-label">回落幅度</div><div class="metric-value" style="color:${n.inDrawdown?"var(--accent-orange)":"var(--accent-green)"}">${n.drawdownPct}%</div></div>
        <div class="metric"><div class="metric-label">距峰值</div><div class="metric-value">${n.peakDaysAgo} 天</div></div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-bottom:20px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 复盘建议</div>
        ${n.suggestions.map(s=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${s}</div>`).join("")}
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">🤔 自问</div>
        ${o.map(s=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${s}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">回落是成长的正常阶段，不必焦虑，重在觉察与调整</div>
  `}window.showGoalModal=on;function on(){if(!a)return;const t=S(a),e=$("🏁 目标反推","设定目标，反推所需投入");e.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">🏁</div>
        <div style="font-size:22px;font-weight:bold;margin-top:8px;">目标反推</div>
        <div style="font-size:13px;color:var(--text-muted);margin-top:4px;">当前指数 ${Math.round(t.price)}，设定目标看看需要多少投入</div>
      </div>
      <div style="margin-bottom:16px;">
        <label style="font-size:13px;color:var(--text-secondary);">目标成长指数（点）</label>
        <input type="number" id="goalTarget" value="${Math.round(t.price*1.5)}" style="width:100%;padding:12px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);margin-top:6px;font-size:18px;">
      </div>
      <button class="btn-primary" onclick="calcGoal()" style="width:100%;padding:14px;font-size:16px;">反推所需投入</button>
      <div id="goalResult"></div>
  `}window.calcGoal=an;function an(){if(!a)return;const t=Number(document.getElementById("goalTarget").value);if(!t||t<=0){k("请输入有效目标");return}const e=ae(a,t),n=document.getElementById("goalResult");n.innerHTML=`
    <div style="margin-top:20px;background:var(--surface-soft);border-radius:12px;padding:16px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
        <div class="metric"><div class="metric-label">目标成长指数</div><div class="metric-value">${e.target} 点</div></div>
        <div class="metric"><div class="metric-label">此刻成长指数</div><div class="metric-value">${e.current} 点</div></div>
        <div class="metric"><div class="metric-label">还差</div><div class="metric-value" style="color:var(--accent-blue);">${e.gap} 点</div></div>
        <div class="metric"><div class="metric-label">还需成长值（粗估）</div><div class="metric-value">约 ${e.additionalInvest} 点</div></div>
      </div>
      <div style="font-size:14px;color:var(--text-secondary);line-height:1.8;">
        ${e.suggestions.map(o=>`<div>• ${o}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">${e.confidence}</div>
    </div>
  `}window.showReportModal=sn;function sn(){if(!a)return;const t=H(a),e=Mt(a,t),n=e.avgMood===null?"暂无":e.avgMood>=3.5?"😄 很好":e.avgMood>=2.5?"🙂 不错":e.avgMood>=1.5?"😐 一般":"😔 偏低",o=$("📊 月度成长报告",e.month+" 月报");o.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">📊</div>
        <div style="font-size:22px;font-weight:bold;margin-top:8px;">${e.month} 成长月报</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">月内变化</div><div class="metric-value" style="color:${e.changePoints>=0?"var(--accent-green)":"var(--accent-orange)"}">${e.changePoints>=0?"+":""}${e.changePoints}</div></div>
        <div class="metric"><div class="metric-label">投入笔数</div><div class="metric-value">${e.investCount}</div></div>
        <div class="metric"><div class="metric-label">记录天数</div><div class="metric-value">${e.journalDays}</div></div>
        <div class="metric"><div class="metric-label">实际花费（仅记录）</div><div class="metric-value">${e.investAmount.toLocaleString()} 元</div></div>
        <div class="metric"><div class="metric-label">月初指数</div><div class="metric-value">${e.startPrice}</div></div>
        <div class="metric"><div class="metric-label">月末指数</div><div class="metric-value">${e.endPrice}</div></div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;">⭐ 本月亮点</div>
        ${e.highlights.length>0?e.highlights.map(i=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${i}</div>`).join(""):'<div style="font-size:13px;color:var(--text-muted);">继续积累，下个月会更好</div>'}
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">📌 下月建议</div>
        ${e.suggestions.map(i=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${i}</div>`).join("")}
      </div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:16px;text-align:center;">平均情绪：${n} · 报告仅基于你的记录生成，不代表客观评价</div>
  `}window.showRadarModal=rn;function rn(){if(!a)return;const t=V(a),e={education:"#ff8a4c",skill:"#f5a623",health:"#3fa06a",network:"#3e9b8f",entertainment:"#e0705b",other:"#a79b8c"},n='<canvas id="radarCanvas" width="300" height="300" style="display:block;margin:0 auto;"></canvas>',o=$("🎯 投入结构雷达","看看你的成长积累分布是否均衡");o.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:16px;">${n}</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:16px;">
        ${t.dimensions.map(i=>`<div style="font-size:12px;color:var(--text-secondary);"><span style="color:${e[i.type]}">●</span> ${i.label.split(" ")[1]}: ${i.amount.toLocaleString()} 元</div>`).join("")}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
        <div class="metric"><div class="metric-label">均衡度</div><div class="metric-value">${Math.round(t.balance*100)}%</div></div>
        <div class="metric"><div class="metric-label">最突出</div><div class="metric-value">${t.dimensions.find(i=>i.type===t.dominant)?.label.split(" ")[1]}</div></div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 结构建议</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">
          ${t.balance>=.6?"投入结构较均衡，继续保持多维发展。":`${t.dimensions.find(i=>i.type===t.weakest)?.label}维度投入较少，可适当增加。`}
          健康是一切成长的底座，建议保持健康维度的持续投入。
        </div>
      </div>
  `,setTimeout(()=>ln(t),50)}function ln(t,e){const n=document.getElementById("radarCanvas");if(!n)return;const o=n.getContext("2d"),i=150,s=150,l=110;o.clearRect(0,0,300,300);const r=t.dimensions,c=r.length;for(let d=1;d<=4;d++){o.beginPath();for(let p=0;p<c;p++){const u=Math.PI*2*p/c-Math.PI/2,g=l*d/4,v=i+g*Math.cos(u),f=s+g*Math.sin(u);p===0?o.moveTo(v,f):o.lineTo(v,f)}o.closePath(),o.strokeStyle="rgba(120,95,60,0.16)",o.stroke()}for(let d=0;d<c;d++){const p=Math.PI*2*d/c-Math.PI/2;o.beginPath(),o.moveTo(i,s),o.lineTo(i+l*Math.cos(p),s+l*Math.sin(p)),o.strokeStyle="rgba(120,95,60,0.2)",o.stroke()}o.beginPath();for(let d=0;d<c;d++){const p=Math.PI*2*d/c-Math.PI/2,u=r[d].value/100,g=i+l*u*Math.cos(p),v=s+l*u*Math.sin(p);d===0?o.moveTo(g,v):o.lineTo(g,v)}o.closePath(),o.fillStyle="rgba(255,138,76,0.3)",o.fill(),o.strokeStyle="#ff8a4c",o.lineWidth=2,o.stroke(),o.fillStyle="#5c5246",o.font="12px sans-serif",o.textAlign="center";for(let d=0;d<c;d++){const p=Math.PI*2*d/c-Math.PI/2,u=i+(l+20)*Math.cos(p),g=s+(l+20)*Math.sin(p);o.fillText(r[d].label.split(" ")[1],u,g+4)}}window.showDepreciationModal=dn;function dn(){if(!a)return;const t=S(a),e=Math.round(a.annualIncome*.1/12),n=re(a,10,e),o=$("📉 折旧推演","看看你的成长积累随时间如何变化");o.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:16px;">
        <div style="font-size:14px;color:var(--text-muted);">假设每年新增自我花费约 ${e.toLocaleString()} 元（估算口径）</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">当前成长值</div><div class="metric-value">${Math.round(t.bv)}</div></div>
        <div class="metric"><div class="metric-label">5 年后</div><div class="metric-value" style="color:${n.bv5y>=t.bv?"var(--accent-green)":"var(--accent-orange)"}">${n.bv5y}</div></div>
        <div class="metric"><div class="metric-label">10 年后</div><div class="metric-value" style="color:${n.bv10y>=t.bv?"var(--accent-green)":"var(--accent-orange)"}">${n.bv10y}</div></div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;">📈 10 年趋势</div>
        ${n.points.map(i=>`<div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary);line-height:1.8;"><span>${i.age} 岁</span><span>成长值 ${i.bv}（自然衰减 -${i.depreciation}，新增 +${i.newInvest}）</span></div>`).join("")}
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 建议</div>
        ${n.suggestions.map(i=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${i}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">年折旧率约 ${n.annualDecayRate*100}%，仅作趋势参考</div>
  `}window.showScenarioModal=cn;function cn(){if(!a)return;const t=le(a),e=$("🎲 情景模拟","不同节奏下，你的指数会怎样");e.querySelector(".modal-body").innerHTML=`
      ${t.map(n=>`
        <div style="background:var(--surface-soft);border-radius:12px;padding:16px;margin-bottom:12px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <span style="font-size:24px;">${n.icon}</span>
            <div>
              <div style="font-weight:600;">${n.label}</div>
              <div style="font-size:12px;color:var(--text-muted);">${n.desc}</div>
            </div>
            <div style="margin-left:auto;text-align:right;">
              <div style="font-size:22px;font-weight:bold;color:${n.changePct>=0?"var(--accent-green)":"var(--accent-orange)"}">${n.price} 点</div>
              <div style="font-size:12px;color:${n.changePct>=0?"var(--accent-green)":"var(--accent-orange)"}">${n.changePct>=0?"+":""}${n.changePct}%</div>
            </div>
          </div>
          <div style="font-size:12px;color:var(--text-muted);">学习 ${n.params.studyHours}h/周 · 健康 ${n.params.healthScore} · 收入增长 ${Math.round(n.params.incomeGrowth*100)}% · 负债 ${Math.round(n.params.debtRatio*100)}%</div>
        </div>
      `).join("")}
      <div style="font-size:11px;color:var(--text-muted);text-align:center;">情景为参数调整后的模拟结果，不代表预测承诺</div>
  `}window.showFamilyModal=pn;function pn(){if(!a)return;const t=de(a),e=$("👨‍👩‍👧 家庭账本","记录家庭/父母的支持，看见成长背后的力量");e.querySelector(".modal-body").innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">累计家庭支持</div><div class="metric-value">${t.totalSupport} 万</div></div>
        <div class="metric"><div class="metric-label">占总积累比</div><div class="metric-value">${Math.round(t.supportRatio*100)}%</div></div>
      </div>
      <div style="margin-bottom:16px;">
        <label style="font-size:13px;color:var(--text-secondary);">家庭支持（万元，选填，仅存本机）</label>
        <input type="number" id="familySupportInput" value="${t.totalSupport}" style="width:100%;padding:10px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);margin-top:6px;">
      </div>
      <button class="btn-primary" onclick="saveFamilySupport()" style="width:100%;padding:12px;">保存</button>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-top:16px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 说明</div>
        ${t.suggestions.map(n=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${n}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">家庭支持不折旧、不乘权重，单独计入成长值，不参与主观调整</div>
  `}window.saveFamilySupport=un;function un(){if(!a)return;const t=Number(document.getElementById("familySupportInput").value)||0;a.familySupportCapital=t,A(a),L(),k("✅ 家庭支持已更新"),R()}window.showAIWeeklyModal=vn;function vn(){if(!a)return;const t=ce(a),e=$("📝 本周周报","基于你的记录由模板在本地生成，不上传数据");e.querySelector(".modal-body").innerHTML=`
      <div style="background:linear-gradient(135deg,rgba(255,138,76,0.15),rgba(62,155,143,0.15));border-radius:12px;padding:16px;margin-bottom:16px;">
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">${t.week}</div>
        <div style="font-size:16px;font-weight:600;line-height:1.6;">${t.summary}</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:8px;">${t.moodNote}</div>
      </div>
      ${t.highlights.length>0?`<div style="background:rgba(63,160,106,0.1);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;color:var(--accent-green);">⭐ 本周亮点</div>
        ${t.highlights.map(n=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${n}</div>`).join("")}
      </div>`:""}
      ${t.improvements.length>0?`<div style="background:rgba(224,153,47,0.08);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;color:var(--accent-yellow);">🔍 待改进</div>
        ${t.improvements.map(n=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${n}</div>`).join("")}
      </div>`:""}
      <div style="background:rgba(255,138,76,0.08);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;color:var(--accent-blue);">🎯 下周行动</div>
        ${t.actions.map(n=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${n}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">周报由规则引擎在本地生成，不调用任何外部 AI 服务，不上传你的数据</div>
  `}window.showAnnualModal=gn;function gn(){if(!a)return;const t=H(a),e=pe(a,t),n=e.avgMood===null?"暂无":e.avgMood>=3.5?"😄 很好":e.avgMood>=2.5?"🙂 不错":e.avgMood>=1.5?"😐 一般":"😔 偏低",o=$("🎊 年度报告",`${e.year} 年成长总结`);o.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">🎊</div>
        <div style="font-size:24px;font-weight:bold;margin-top:8px;">${e.year} 年报</div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:20px;">
        ${e.keywords.map(i=>`<span style="padding:6px 14px;border-radius:20px;background:rgba(255,138,76,0.15);font-size:13px;">${i}</span>`).join("")}
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:16px;margin-bottom:16px;text-align:center;">
        <div style="font-size:14px;color:var(--text-muted);">年度指数变化</div>
        <div style="font-size:32px;font-weight:bold;color:${e.changePoints>=0?"var(--accent-green)":"var(--accent-orange)"}">${e.changePoints>=0?"+":""}${e.changePoints}</div>
        <div style="font-size:13px;color:var(--text-muted);">${e.startPrice} → ${e.endPrice}（${e.changePct>=0?"+":""}${e.changePct}%）</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
        <div class="metric"><div class="metric-label">年度实际花费</div><div class="metric-value">${e.totalInvest.toLocaleString()} 元</div></div>
        <div class="metric"><div class="metric-label">投入笔数</div><div class="metric-value">${e.investCount}</div></div>
        <div class="metric"><div class="metric-label">里程碑</div><div class="metric-value">${e.milestoneCount}</div></div>
        <div class="metric"><div class="metric-label">记录天数</div><div class="metric-value">${e.journalDays}</div></div>
        <div class="metric"><div class="metric-label">平均情绪</div><div class="metric-value" style="font-size:16px;">${n}</div></div>
        <div class="metric"><div class="metric-label">均衡度</div><div class="metric-value">${e.milestoneCount>0?"良好":"—"}</div></div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;">📖 年度总结</div>
        <div style="font-size:14px;color:var(--text-secondary);line-height:1.8;">${e.summary}</div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">🌱 下年度方向</div>
        ${e.nextYearPlan.map(i=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${i}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">年报基于你的记录生成，是回顾也是鼓励，不是评价</div>
  `}window.showPeerModal=mn;function mn(){if(!a)return;const t=S(a),e=xt(a),n=t.bv,o=n-e,i=e>0?Math.round(o/e*100):0,s=$("👥 同路人","看看相似背景的成长者们大致在哪里（匿名统计锚点）");s.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">👥</div>
        <div style="font-size:18px;font-weight:600;margin-top:8px;">你不是一个人在成长</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">你的成长积累</div><div class="metric-value">${Math.round(n)}</div></div>
        <div class="metric"><div class="metric-label">同类锚点（估算）</div><div class="metric-value">${Math.round(e)}</div></div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:16px;margin-bottom:16px;text-align:center;">
        <div style="font-size:14px;color:var(--text-muted);">相对同类锚点</div>
        <div style="font-size:28px;font-weight:bold;color:${o>=0?"var(--accent-green)":"var(--accent-orange)"};margin-top:6px;">${o>=0?"+":""}${i}%</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:6px;">${o>=0?"你走在多数人前面，继续保持":"还有追赶空间，但成长没有终点"}</div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 关于对比</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">
          这个锚点是基于相似年龄、城市、学历的统计估算，仅作参考。每个人的成长节奏不同，<br>
          与昨天的自己比较，比与他人比较更有意义。
        </div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">锚点数据为估算值，不构成任何评价或排名</div>
  `}window.showChallengeModal=fn;function fn(){if(!a)return;const t=st(a),e=ue(a),n=$("🎯 成长挑战","完成挑战，见证坚持的力量");n.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">🎯</div>
        <div style="font-size:22px;font-weight:bold;margin-top:8px;">挑战完成度 ${e}%</div>
      </div>
      ${t.map(o=>`
        <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-bottom:10px;${o.done?"border:1px solid var(--accent-green);":""}">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <span style="font-size:22px;">${o.icon}</span>
            <div style="flex:1;">
              <div style="font-weight:600;">${o.name} ${o.done?'<span style="color:var(--accent-green);">✓ 已完成</span>':""}</div>
              <div style="font-size:12px;color:var(--text-muted);">${o.desc}</div>
            </div>
            <div style="font-size:14px;font-weight:bold;color:${o.done?"var(--accent-green)":"var(--accent-blue)"};">${o.progress}/${o.target} ${o.unit}</div>
          </div>
          <div style="height:6px;background:var(--surface-strong);border-radius:3px;overflow:hidden;">
            <div style="height:100%;width:${Math.round(o.progress/o.target*100)}%;background:${o.done?"var(--accent-green)":"linear-gradient(90deg,#ffb36b,#ff8a4c)"};border-radius:3px;transition:width 0.5s;"></div>
          </div>
        </div>
      `).join("")}
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">挑战数据基于你的本地记录，完成后自动更新</div>
  `}window.showMentorModal=hn;function hn(){if(!a)return;const t=ve(a),e=$("🌱 成长伙伴",t.persona);e.querySelector(".modal-body").innerHTML=`
      <div style="background:linear-gradient(135deg,rgba(255,138,76,0.12),rgba(62,155,143,0.12));border-radius:12px;padding:16px;margin-bottom:16px;">
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:6px;">${t.greeting}</div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;">👁️ 我观察到</div>
        ${t.observations.map(n=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${n}</div>`).join("")}
      </div>
      <div style="background:rgba(255,138,76,0.08);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;color:var(--accent-blue);">💡 我的建议</div>
        ${t.advices.map(n=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${n}</div>`).join("")}
      </div>
      <div style="background:rgba(63,160,106,0.1);border-radius:12px;padding:14px;text-align:center;">
        <div style="font-size:14px;color:var(--accent-green);font-style:italic;line-height:1.6;">${t.encouragement}</div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">伙伴建议由规则模板生成，仅作自我反思参考，不是专业心理咨询；如遇严重情绪困扰，请拨打心理援助热线 12356。<br>最终决定权，始终在你手中。</div>
  `}let Y="terms";window.showMicroModal=zt;function zt(){if(!a)return;const e=$("📚 微课","学习成长术语，理解你的指数").querySelector(".modal-body"),n=()=>`
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${ge.map(i=>`
        <div style="background:var(--surface-soft);border-radius:12px;padding:14px;cursor:pointer;" onclick="this.querySelector('.term-detail').style.display=this.querySelector('.term-detail').style.display==='none'?'block':'none'">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:22px;">${i.icon}</span>
            <div style="flex:1;">
              <div style="font-weight:600;">${i.term} <span style="font-size:11px;color:var(--text-muted);font-weight:normal;">[${i.category}]</span></div>
              <div style="font-size:12px;color:var(--text-muted);">${i.short}</div>
            </div>
            <span style="font-size:12px;color:var(--text-muted);">▼</span>
          </div>
          <div class="term-detail" style="display:none;margin-top:10px;font-size:13px;color:var(--text-secondary);line-height:1.7;border-top:1px solid var(--border);padding-top:10px;">${i.detail}</div>
        </div>
      `).join("")}
    </div>
  `,o=()=>`
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${me.map(i=>`
        <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
          <div style="font-weight:600;margin-bottom:4px;">${i.stage} <span style="font-size:12px;color:var(--text-muted);font-weight:normal;">${i.ageRange}</span></div>
          <div style="font-size:13px;color:var(--accent-blue);margin-bottom:8px;">重心：${i.focus}</div>
          ${i.tips.map(s=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.7;">• ${s}</div>`).join("")}
        </div>
      `).join("")}
    </div>
  `;e.innerHTML=`
    <div style="display:flex;gap:8px;margin-bottom:16px;">
      <button class="btn-primary" onclick="switchMicroTab('terms')" id="tab-terms" style="flex:1;${Y==="terms"?"":"opacity:0.6;"}">📖 术语卡</button>
      <button class="btn-primary" onclick="switchMicroTab('stages')" id="tab-stages" style="flex:1;${Y==="stages"?"":"opacity:0.6;"}">🧭 阶段指南</button>
    </div>
    <div id="microContent">${Y==="terms"?n():o()}</div>
  `}window.switchMicroTab=yn;function yn(t){Y=t,zt()}let _=0;window.showGratitudeModal=dt;function dt(){if(!a)return;const t=kt(a,_),e=U(),n=$("💌 感恩卡片","亲子连接 · 表达感谢");n.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:16px;">
        <div style="font-size:48px;">💌</div>
      </div>
      <div style="background:linear-gradient(135deg,rgba(224,153,47,0.1),rgba(224,92,75,0.1));border-radius:16px;padding:24px;margin-bottom:16px;border:1px solid rgba(224,153,47,0.2);">
        <div style="font-size:18px;font-weight:bold;margin-bottom:16px;text-align:center;color:var(--accent-yellow);">${t.title}</div>
        <div style="font-size:15px;line-height:2;color:var(--text-secondary);text-align:center;">${t.content}</div>
        <div style="font-size:13px;color:var(--text-muted);text-align:right;margin-top:20px;">${t.signature}</div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:12px;">
        <button class="btn-primary" onclick="prevGratitude()" style="flex:1;opacity:0.8;">← 上一张</button>
        <button class="btn-primary" onclick="nextGratitude()" style="flex:1;opacity:0.8;">下一张 →</button>
      </div>
      <button class="btn-primary" onclick="copyGratitude()" style="width:100%;padding:12px;">📋 复制卡片内容</button>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">第 ${_+1}/${e} 张 · 卡片内容可自由编辑后发送给家人</div>
  `}window.nextGratitude=bn;function bn(){a&&(_=(_+1)%U(),dt())}window.prevGratitude=xn;function xn(){a&&(_=(_-1+U())%U(),dt())}window.copyGratitude=wn;function wn(){if(!a)return;const t=kt(a,_),e=`${t.title}

${t.content}

${t.signature}`;navigator.clipboard.writeText(e).then(()=>{k("✅ 已复制，可粘贴发给家人")}).catch(()=>{k("复制失败，请手动选择文本")})}window.showExportReportModal=$n;function $n(){if(!a)return;const t=H(a),e=rt(a,t),n=$("📄 导出成长报告","生成纯文本报告，可保存或分享");n.querySelector(".modal-body").innerHTML=`
      <div style="background:var(--surface-soft);border-radius:12px;padding:16px;margin-bottom:16px;max-height:400px;overflow-y:auto;">
        <pre style="font-family:monospace;font-size:12px;line-height:1.6;white-space:pre-wrap;color:var(--text-secondary);">${e}</pre>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn-primary" onclick="copyReport()" style="flex:1;padding:12px;">📋 复制文本</button>
        <button class="btn-primary" onclick="downloadReport()" style="flex:1;padding:12px;">⬇️ 下载 .txt</button>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">报告内容均来自你的本地数据，不包含任何个人身份信息</div>
  `}window.copyReport=Mn;function Mn(){if(!a)return;const t=H(a),e=rt(a,t);navigator.clipboard.writeText(e).then(()=>k("✅ 报告已复制")).catch(()=>k("复制失败"))}window.downloadReport=kn;function kn(){if(!a)return;const t=H(a),e=rt(a,t),n=new Blob([e],{type:"text/plain;charset=utf-8"}),o=URL.createObjectURL(n),i=document.createElement("a");i.href=o,i.download=`成长报告_${new Date().toISOString().slice(0,10)}.txt`,i.click(),URL.revokeObjectURL(o),k("✅ 报告已下载")}Qe();
