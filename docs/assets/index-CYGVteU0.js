(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();const K="1.2",Ct=200,Tt=.65,zt=1.5,At=.6,Pt=1.3,jt=.3,y={BASE_INDEX:100,TYPE_WEIGHTS:{education:1.5,skill:1.3,health:1.1,network:1,entertainment:.5,other:.5},TYPE_HALF_LIFE:{education:1/0,skill:5,health:4,network:3,entertainment:1,other:2},REGION_COEF:{tier1:1.8,new_tier1:1.4,tier2:1.1,tier3:.8},AREA_COEF:{urban:1,rural:.68},INCOME_COEF:{low:.35,below_avg:.65,avg:1,above_avg:1.55,high:2.9},STAGE_COEF:[{age:0,coef:.2},{age:6,coef:.3},{age:12,coef:.5},{age:18,coef:.9},{age:25,coef:1.1},{age:35,coef:1.5},{age:50,coef:1.3},{age:65,coef:1},{age:80,coef:.8}],AGE_SPEND:{"0-2":24538,"3-5":36538,"6-14":27007,"15-17":29007,"18-22":29135},AGE_SPEND_RANGE:{"0-2":{low:18e3,mid:24538,high:35e3},"3-5":{low:25e3,mid:36538,high:52e3},"6-14":{low:18e3,mid:27007,high:4e4},"15-17":{low:2e4,mid:29007,high:42e3},"18-22":{low:18e3,mid:29135,high:45e3}}},Lt={education_cost:{name:"育娲人口研究《中国生育成本报告》",year:"2022",caliber:"全国家庭 0-17 岁子女年均教育/养育投入"}},j=[{id:"birth",name:"出生",icon:"👶",desc:"人生起点",bonus:20,condition:t=>t.age>=0},{id:"school",name:"小学入学",icon:"🎒",desc:"基础教育开始",bonus:10,condition:t=>t.age>=6},{id:"middle",name:"初中毕业",icon:"📖",desc:"义务教育完成",bonus:15,condition:t=>t.age>=15},{id:"highschool",name:"高中毕业",icon:"🎓",desc:"成年预备",bonus:20,condition:t=>t.age>=18},{id:"college",name:"大学毕业",icon:"🎓",desc:"步入社会",bonus:30,condition:t=>t.age>=22},{id:"firstjob",name:"第一份工作",icon:"💼",desc:"独立起步",bonus:30,condition:t=>t.hasJob},{id:"firstraise",name:"第一次涨薪",icon:"💰",desc:"成长被认可",bonus:15,condition:t=>t.salaryRaised},{id:"license",name:"拿到驾照",icon:"🚗",desc:"技能+1",bonus:5,condition:t=>t.hasLicense},{id:"marathon",name:"跑完马拉松",icon:"🏃",desc:"健康资产",bonus:8,condition:t=>t.marathon},{id:"marriage",name:"结婚",icon:"💍",desc:"人生伙伴",bonus:20,condition:t=>t.married},{id:"home",name:"买房",icon:"🏠",desc:"安定居所",bonus:25,condition:t=>t.hasHouse},{id:"child",name:"为人父母",icon:"👶",desc:"新的责任",bonus:15,condition:t=>t.hasChild},{id:"30",name:"三十而立",icon:"🎯",desc:"人生分水岭",bonus:25,condition:t=>t.age>=30},{id:"100k",name:"十万投入",icon:"💎",desc:"累计投入超10万",bonus:15,condition:t=>t.totalInvest>=1e5},{id:"500k",name:"五十万投入",icon:"👑",desc:"累计投入超50万",bonus:30,condition:t=>t.totalInvest>=5e5}],pt=.5,ut=1.5,Rt=1;function vt(t,e,n){return Math.max(e,Math.min(n,t))}function Bt(t){return t.subjectiveWeight===void 0||t.subjectiveWeight===null?Rt:vt(t.subjectiveWeight,pt,ut)}function _t(t){return vt(t,pt,ut)}function G(t,e,n){return Math.max(e,Math.min(n,t))}function Ht(t){const e=t.history?.length||0,n=t.investments?.length||0,i=e+n,o=e,s=i>0?o/i:1;let l;const r=i>0?n/i:0;r>=.5?l="high":r>=.2?l="medium":l="low";const p={high:"高置信",medium:"中置信",low:"低置信"},d=i>0?o/(i+1):.5;return{level:l,estimatedRatio:Math.round(s*100)/100,manualCount:n,estimatedCount:o,label:p[l],potentialEstimatedRatio:Math.round(d*100)/100}}function J(t,e,n){if(n==="education")return t;const i=y.TYPE_HALF_LIFE[n]||5;return isFinite(i)?t*Math.exp(-.693*e/i):t}function Q(t){const e=y.STAGE_COEF;if(t<=e[0].age)return e[0].coef;for(let n=0;n<e.length-1;n++)if(t>=e[n].age&&t<=e[n+1].age){const i=(t-e[n].age)/(e[n+1].age-e[n].age);return e[n].coef+i*(e[n+1].coef-e[n].coef)}return e[e.length-1].coef}function Ot(t){const e=G((t.annualIncomeGrowth||0)*2,-.35,.35),n=G(((t.studyHours||0)-5)/20,-.15,.15);return G(1+e+n,Tt,zt)}function Nt(t){return G(.6+t/100*.7,At,Pt)}function Gt(t){return G((t.debtRatio||0)*.3,0,jt)}function gt(t,e=new Date){let n=0;return t.history.forEach(i=>{const o=t.age-i.age,s=y.TYPE_WEIGHTS[i.type]||1;n+=i.invest/1e4*s*J(1,Math.max(0,o),i.type)}),t.investments.forEach(i=>{const o=(e.getTime()-i.date.getTime())/315576e5,s=y.TYPE_WEIGHTS[i.type]||1;n+=i.amount/1e4*s*J(1,Math.max(0,o),i.type)}),t.familySupportCapital&&(n+=t.familySupportCapital),n}function k(t,e=new Date){const n=gt(t,e),i=Q(t.age),o=j.filter(m=>m.condition(t)).reduce((m,z)=>m+z.bonus,0),s=Math.min(Ct,o),l=(t.annualIncome||0)/1e4,r=n>0?Math.min(1e3,l/(n+1)*100):0,d=t.investments.filter(m=>(e.getTime()-m.date.getTime())/315576e5<2&&["education","skill","health"].includes(m.type)).length>0?1:Math.max(.65,1-(t.age-22)*.012);let c=t.healthScore||50;const u=t.investments.filter(m=>(e.getTime()-m.date.getTime())/315576e5<2&&m.type==="health");t.age>30&&u.length===0&&(c=Math.max(20,c-(t.age-30)*1.5));const v=Ot(t)*d,h=Nt(c),f=Gt(t),D=Bt(t),b=(y.BASE_INDEX+n*i+s)*v*h*(1-f)*D,I=(b-y.BASE_INDEX)/y.BASE_INDEX*100,E=l>0?Math.round(b/l*10)/10+"倍":"—";return{price:Math.round(b*10)/10,change:Math.round(I*10)/10,bv:Math.round(n*10)/10,eps:Math.round(l*100)/100,roe:Math.round(r*10)/10,pe:E,milestoneBonus:s,growthCoef:Math.round(v*100)/100,qualityCoef:Math.round(h*100)/100,stagnationPenalty:Math.round(d*100)/100,effectiveHealth:Math.round(c),riskDiscount:Math.round(f*100)/100,subjectiveAdjust:Math.round(D*100)/100}}function Ft(t){const e=y.REGION_COEF[t.region]*y.AREA_COEF[t.area]*y.INCOME_COEF[t.income],n=[];for(let i=0;i<=t.age;i++){let o;i<=2?o=y.AGE_SPEND["0-2"]:i<=5?o=y.AGE_SPEND["3-5"]:i<=14?o=y.AGE_SPEND["6-14"]:i<=17?o=y.AGE_SPEND["15-17"]:o=y.AGE_SPEND["18-22"],o=o*e*(.9+Math.random()*.2),n.push({age:i,invest:o,type:"education"})}if(t.anchor){const i=t.anchor.age;n[i]&&(n[i].invest=t.anchor.amount)}return n}function _(t){const e=[];let n=0;for(let i=0;i<=t.age;i++){let s=t.history.filter(u=>u.age===i).reduce((u,g)=>u+g.invest,0);const l=t.investments.filter(u=>Math.floor((u.date.getTime()-new Date(t.birthYear+i,0,1).getTime())/315576e5)===i);s+=l.reduce((u,g)=>u+g.amount,0),n+=s;const r={...t,age:i,history:t.history.filter(u=>u.age<=i),investments:l},p=k(r),d=1+(Math.random()-.5)*.16,c=p.price*d;e.push({age:i,price:Math.round(c*10)/10,invest:s,total:n})}return e}function mt(t){const e={primary:.5,junior:.8,senior:1,college:1.2,bachelor:1.3,master:1.5},n={age:t.age,region:t.region,area:t.area,income:"avg",education:t.education,birthYear:t.birthYear,annualIncome:8e4*(e[t.education]||1),annualIncomeGrowth:.05,studyHours:2,healthScore:65,debtRatio:.05,hasJob:t.age>=22,salaryRaised:t.age>=25,hasLicense:t.age>=20,marathon:!1,married:t.age>=28,hasHouse:t.age>=30,hasChild:t.age>=32,totalInvest:0,history:qt(t),investments:[]};return k(n).price}function qt(t){const e=y.REGION_COEF[t.region]*y.AREA_COEF[t.area]*y.INCOME_COEF.avg,n=[];for(let i=0;i<=t.age;i++){let o;i<=2?o=y.AGE_SPEND["0-2"]:i<=5?o=y.AGE_SPEND["3-5"]:i<=14?o=y.AGE_SPEND["6-14"]:i<=17?o=y.AGE_SPEND["15-17"]:o=y.AGE_SPEND["18-22"],o=o*e,n.push({age:i,invest:o,type:"education"})}return n}function ht(t,e){let n={...t};return(!e||e<"1.2")&&n.familySupportCapital===void 0&&(n.familySupportCapital=0),n.version=K,n}function Wt(t){return{...t,version:K,disclaimer:"本产品为个人成长量化工具，所有数值基于模型估算，不代表真实资产或投资建议。"}}function Yt(t,e){const n=Q(t.age),i=100,o=e.bv*n,s=e.milestoneBonus,l=[{key:"growth",name:"成长系数",value:e.growthCoef,reason:`收入增速与学习时长决定，含停滞衰减 ${e.stagnationPenalty}`},{key:"quality",name:"质量系数",value:e.qualityCoef,reason:`基于有效健康分 ${e.effectiveHealth}`},{key:"risk",name:"风险折扣",value:1-e.riskDiscount,reason:`负债率 ${(t.debtRatio||0)*100}%，折扣 ${(e.riskDiscount*100).toFixed(0)}%`},{key:"subjective",name:"主观感知",value:e.subjectiveAdjust,reason:`你设定的主观权重 ${e.subjectiveAdjust.toFixed(2)}（1.0 为中性）`}],r=l.reduce((c,u)=>c*u.value,1),p=e.price,d=[];return d.push({key:"base",name:"基准指数",contribution:Math.round(i*r*10)/10,ratio:p>0?i*r/p:0,reason:"所有人同一起点 100 分"}),d.push({key:"bv",name:"累计成长资本",contribution:Math.round(o*r*10)/10,ratio:p>0?o*r/p:0,reason:`BV ${e.bv}万 × 阶段系数 ${n.toFixed(2)}（${t.age}岁）`}),d.push({key:"milestone",name:"里程碑加成",contribution:Math.round(s*r*10)/10,ratio:p>0?s*r/p:0,reason:"已达成里程碑加分（封顶 200）"}),l.forEach(c=>{d.push({key:c.key,name:c.name,contribution:0,ratio:0,reason:c.reason+`（×${c.value.toFixed(2)}）`})}),d}function Ut(t){const e=t.filter(n=>n.contribution>0);return e.length===0?null:e.reduce((n,i)=>n.contribution>i.contribution?n:i)}const Vt={great:4,good:3,ok:2,low:1};function Jt(t,e,n){return{id:`j_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,date:new Date,content:t.trim(),mood:e,category:n}}function Xt(t,e){return{...t,journals:[...t.journals||[],e]}}function Kt(t,e=10){return[...t.journals||[]].sort((n,i)=>new Date(i.date).getTime()-new Date(n.date).getTime()).slice(0,e)}function Z(t,e){const n=Date.now()-e*24*60*60*1e3;return(t.journals||[]).filter(i=>new Date(i.date).getTime()>=n).length}function ft(t){const e=new Set((t.journals||[]).map(o=>new Date(o.date).toDateString()));let n=0;const i=new Date;for(;e.has(i.toDateString());)n++,i.setDate(i.getDate()-1);return n}function tt(t,e=30){const n=Date.now()-e*24*60*60*1e3,i=(t.journals||[]).filter(s=>s.mood&&new Date(s.date).getTime()>=n);return i.length===0?null:i.reduce((s,l)=>s+Vt[l.mood],0)/i.length}function Qt(t,e){if(t.length===0)return{peak:e,current:e,drawdownPct:0,drawdownPoints:0,peakDaysAgo:0,inDrawdown:!1,suggestions:["开始记录你的第一笔成长投入吧"]};const n=Math.max(...t.map(d=>d.price),e),i=Math.max(0,n-e),o=n>0?i/n*100:0,s=t.reduce((d,c)=>c.price>d.price?c:d,t[0]),l=t[t.length-1].age,r=Math.round((l-s.age)*365),p=[];return o===0?p.push("当前处于历史高位，继续保持成长节奏"):o<5?(p.push("小幅波动属正常，不必过度焦虑"),p.push("检查近期投入是否连续，保持每周一笔")):o<15?(p.push("阶段性回落，可复盘近期是否有停滞期"),p.push("健康与学习时长对成长系数影响较大")):(p.push("回撤较大，建议认真复盘近期生活变化"),p.push("可在「记录挫折」中标记事件，帮助归因")),{peak:n,current:e,drawdownPct:Math.round(o*10)/10,drawdownPoints:Math.round(i),peakDaysAgo:Math.max(0,r),inDrawdown:o>.5,suggestions:p}}function Zt(t){const e=["最近哪件事最影响你的状态？","这个阶段你的投入重心放在了哪里？","有什么是你想调整或继续的？"];return t.setbacks&&t.setbacks.length>0&&e.unshift("你记录的挫折事件，现在回看有什么新感悟？"),e}function te(t,e){const n=k(t),i=n.price,o=Math.max(0,e-i),s=n.growthCoef*n.qualityCoef*(1-n.riskDiscount)*n.subjectiveAdjust,l=n.stageCoef||1,r=Math.max(0,(e/s-100-n.milestoneBonus)/l),p=n.bv,d=Math.max(0,r-p),c=d,u=t.annualIncome*.05/12,g=t.annualIncome*.15/12,v=g>0?Math.ceil(d/g):999,h=u>0?Math.ceil(d/u):999,f=[];return o<=0?f.push("已达到目标，可设定更高的成长目标"):(f.push(`距离目标还差 ${Math.round(o)} 点`),f.push(`按当前节奏约需 ${v}-${h} 个月（仅作参考）`),f.push("提升学习时长与健康评分，可加速成长系数"),f.push("达成更多里程碑可获得额外加成")),{target:e,current:Math.round(i),gap:Math.round(o),requiredBV:Math.round(r),additionalInvest:Math.round(c),monthsRange:[Math.min(v,999),Math.min(h,999)],suggestions:f,confidence:"估算基于当前系数与线性假设，实际成长受多因素影响，请理性参考"}}function yt(t,e){const n=new Date,i=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`,s=k(t).price,l=new Date(n.getFullYear(),n.getMonth(),1),r=n.getFullYear()-t.birthYear-(n.getMonth()<l.getMonth()?1:0);let p=s;if(e.length>0){const m=e.filter(z=>z.age<=r-.08);m.length>0?p=m[m.length-1].price:p=e[0].price}const d=s-p,c=p>0?d/p*100:0,u=new Date(n.getFullYear(),n.getMonth(),1).getTime(),g=(t.investments||[]).filter(m=>new Date(m.date).getTime()>=u),v=g.length,h=g.reduce((m,z)=>m+z.amount,0),f=Z(t,30),D=tt(t,30),b=[];v>0&&b.push(`本月记录了 ${v} 笔自我投入`),d>0?b.push(`人生指数上升 ${Math.round(d)} 点`):d<0&&b.push("本月指数有所回落，可查看回撤复盘");const I=t._milestones||[];I>0&&b.push(`达成 ${I} 个里程碑`);const E=[];return v===0&&E.push("建议每周至少记录一笔投入，保持成长节奏"),f<5&&E.push("增加一句话记录的频率，帮助觉察成长"),D!==null&&D<2.5&&E.push("近期情绪偏低，关注健康与休息"),E.length===0&&E.push("保持当前节奏，继续积累成长资本"),{month:i,startPrice:Math.round(p),endPrice:Math.round(s),changePoints:Math.round(d),changePct:Math.round(c*10)/10,investCount:v,investAmount:h,journalDays:f,avgMood:D,highlights:b,suggestions:E}}function rt(t){const e=t.getDay(),n=e===0?-6:1-e,i=new Date(t);return i.setDate(t.getDate()+n),i.setHours(0,0,0,0),i}function et(t){const e=new Date,n=rt(e),i=new Date(n);i.setDate(n.getDate()+7);const s=(t.investments||[]).filter(u=>{const g=new Date(u.date).getTime();return g>=n.getTime()&&g<i.getTime()}).length,l=s>0;let r=0,p=new Date(e);for(;;){const u=rt(p),g=new Date(u);if(g.setDate(u.getDate()+7),(t.investments||[]).some(h=>{const f=new Date(h.date).getTime();return f>=u.getTime()&&f<g.getTime()}))r++,p=new Date(u),p.setDate(u.getDate()-1);else{if(r===0&&p.getTime()===e.getTime()){p=new Date(u),p.setDate(u.getDate()-1);continue}break}if(r>520)break}const d=Math.max(0,7-(e.getDay()===0?7:e.getDay()-1));let c;return l?c=`本周已记录 ${s} 笔，继续保持！连续 ${r} 周`:d<=2?c=`本周还剩 ${d} 天，记一笔投入保持连续吧`:c=`本周还剩 ${d} 天，期待你的第一笔投入`,{investedThisWeek:l,countThisWeek:s,streakWeeks:r,daysLeftInWeek:d,message:c}}const ee={education:"🎓 教育",skill:"📚 技能",health:"💪 健康",network:"🤝 人脉",entertainment:"🎮 娱乐",other:"📦 其他"};function V(t){const e={education:0,skill:0,health:0,network:0,entertainment:0,other:0};(t.history||[]).forEach(v=>{e[v.type]=(e[v.type]||0)+v.invest}),(t.investments||[]).forEach(v=>{e[v.type]=(e[v.type]||0)+v.amount});const n=Math.max(...Object.values(e),1),i=Object.keys(e).map(v=>({type:v,label:ee[v],value:Math.round(e[v]/n*100),amount:e[v]})),o=[...i].sort((v,h)=>h.amount-v.amount),s=o[0].type,l=o[o.length-1].type,r=i.map(v=>v.amount),p=r.reduce((v,h)=>v+h,0)/r.length;if(p===0)return{dimensions:i,dominant:s,weakest:l,balance:0};const d=r.reduce((v,h)=>v+(h-p)**2,0)/r.length,u=Math.sqrt(d)/p,g=Math.max(0,Math.min(1,1-u/2));return{dimensions:i,dominant:s,weakest:l,balance:Math.round(g*100)/100}}function ne(t,e=10,n=0){const i=t.age,o=[];let s=gt(t);const l=.06;for(let c=1;c<=e;c++){const u=i+c,g=Math.round(s*l),v=n;s=s-g+v,s=Math.max(0,s),o.push({age:u,bv:Math.round(s),depreciation:g,newInvest:v})}const r=o[4]?.bv||0,p=o[9]?.bv||0,d=[];return n===0&&d.push("未设定年度新增投入，资本会持续折旧"),p<s*.5&&(d.push("按当前节奏，10 年后资本可能缩水过半"),d.push("建议增加年度投入，或提升投入质量")),r>s&&d.push("按当前投入节奏，5 年后资本仍在增长"),d.push("健康与技能类投入折旧较慢，优先配置"),{points:o,bv5y:r,bv10y:p,annualDecayRate:l,suggestions:d}}function oe(t){const e=k(t).price;return[{scenario:"optimistic",label:"乐观",icon:"🚀",desc:"学习时长增加、健康改善、收入增长提速",mod:{studyHours:t.studyHours+5,healthScore:Math.min(100,t.healthScore+15),annualIncomeGrowth:t.annualIncomeGrowth+.05,debtRatio:Math.max(0,t.debtRatio-.1)}},{scenario:"neutral",label:"中性",icon:"➡️",desc:"保持当前节奏不变",mod:{}},{scenario:"pessimistic",label:"保守",icon:"🛡️",desc:"学习时长减少、健康下滑、收入停滞",mod:{studyHours:Math.max(0,t.studyHours-3),healthScore:Math.max(0,t.healthScore-15),annualIncomeGrowth:Math.max(0,t.annualIncomeGrowth-.05),debtRatio:Math.min(1,t.debtRatio+.1)}}].map(i=>{const o={...t,...i.mod},s=k(o);return{scenario:i.scenario,label:i.label,icon:i.icon,price:Math.round(s.price),changePct:e>0?Math.round((s.price-e)/e*1e3)/10:0,desc:i.desc,params:{studyHours:o.studyHours,healthScore:o.healthScore,incomeGrowth:o.annualIncomeGrowth,debtRatio:o.debtRatio}}})}function ie(t){const e=t.familySupportCapital||0,n=t._familyEntries||[],i=(t.totalInvest||0)+e,o=i>0?e/i:0,s=[];return e===0&&s.push("可记录家庭/父母的累计投入，更全面地认识成长资本"),o>.5&&s.push("家庭支持占比较高，可逐步增加自我投入占比"),o>0&&o<=.5&&s.push("家庭支持与自我投入比例健康，继续保持"),n.length===0&&e>0&&s.push("可补充家庭投入的明细记录，便于感恩与回顾"),{totalSupport:e,entries:n,supportRatio:Math.round(o*100)/100,suggestions:s}}function ae(t){const e=new Date,n=new Date(e),i=n.getDay(),o=i===0?-6:1-i;n.setDate(e.getDate()+o);const s=`${n.getFullYear()}年${n.getMonth()+1}月第${Math.ceil(n.getDate()/7)}周`,l=k(t),r=et(t),p=Z(t,7);ft(t);const d=tt(t,7),c=V(t),u=[],g=[],v=[];r.investedThisWeek?u.push(`本周记录了 ${r.countThisWeek} 笔投入${r.streakWeeks>1?`，连续 ${r.streakWeeks} 周`:""}`):(g.push("本周还没有记录投入，下周至少记一笔"),v.push("周末前记录一笔自我投入")),p>=5?u.push(`本周记录了 ${p} 条成长感悟，觉察力在线`):p>=1?v.push("下周把记录频率提升到 3 次以上"):(g.push("本周没有成长记录，觉察是成长的第一步"),v.push("每天花 1 分钟写下一个想法"));let h="本周无情绪数据";if(d!==null&&(d>=3.5?(u.push("本周整体情绪很好，状态饱满"),h="😄 情绪很好，继续保持"):d>=2.5?h="🙂 情绪平稳":(g.push("本周情绪偏低，关注休息与健康"),h="😔 情绪偏低，多关注自己",v.push("安排一次放松或运动"))),c.balance>=.6)u.push("投入结构较均衡，多维发展");else{const D=c.dimensions.find(b=>b.type===c.weakest)?.label||"";g.push(`投入结构不均衡，${D}维度较弱`),v.push(`下周在${D}上增加一点投入`)}l.growthCoef>=1.2?u.push("成长动力强劲，保持当前节奏"):l.growthCoef<.9&&(g.push("成长动力偏弱，检查学习时长与健康"),v.push("增加每周学习时长，关注健康评分"));let f;return u.length>=2?f="本周成长势头良好，继续保持多维投入与觉察。":g.length>=2?f="本周有提升空间，从小行动开始调整节奏。":f="本周平稳，保持觉察，持续积累。",v.length===0&&v.push("保持当前节奏，下周复盘时看看有什么新变化"),{week:s,summary:f,highlights:u,improvements:g,actions:v,moodNote:h}}function se(t,e){const n=new Date,i=n.getFullYear(),o=k(t),s=n.getFullYear()-t.birthYear-1;let l=o.price;const r=e.filter(m=>m.age<=s);r.length>0&&(l=r[r.length-1].price);const p=o.price-l,d=l>0?p/l*100:0,c=new Date(i,0,1).getTime(),u=(t.investments||[]).filter(m=>new Date(m.date).getTime()>=c),g=u.reduce((m,z)=>m+z.amount,0),v=u.length,h=Z(t,365),f=tt(t,365),D=j.filter(m=>m.condition(t)).length,b=[];D>=5&&b.push("🏆 里程碑丰收"),v>=12&&b.push("💰 持续投入"),h>=100&&b.push("📝 勤于觉察"),t.healthScore>=75&&b.push("💪 健康在线"),o.growthCoef>=1.2&&b.push("🚀 高速成长"),b.length===0&&b.push("🌱 稳步积累");let I;p>0?I=`这一年，你的人生指数上升了 ${Math.round(p)} 点。每一笔投入、每一次觉察，都在累积成看得见的成长。`:p<0?I=`这一年有些起伏，指数回落了 ${Math.round(Math.abs(p))} 点。回撤不是失败，是重新认识自己的机会。`:I="这一年平稳度过，成长在潜移默化中发生。";const E=[];return v<12&&E.push("每月至少记录一笔投入"),h<50&&E.push("每周记录 2-3 条成长感悟"),t.healthScore<70&&E.push("提升健康评分到 70 以上"),o.growthCoef<1&&E.push("增加学习时长，提升成长系数"),E.length===0&&E.push("保持当前节奏，设定更高的成长目标"),{year:i,startPrice:Math.round(l),endPrice:Math.round(o.price),changePoints:Math.round(p),changePct:Math.round(d*10)/10,totalInvest:g,investCount:v,journalDays:h,avgMood:f,milestoneCount:D,keywords:b,summary:I,nextYearPlan:E}}function nt(t){const e=ft(t),n=et(t),i=(t.investments||[]).length,o=(t.journals||[]).length,s=t._milestones||0;return[{id:"streak7",name:"七日觉察",icon:"🔥",desc:"连续 7 天记录成长感悟",progress:Math.min(e,7),target:7,done:e>=7,unit:"天"},{id:"streak30",name:"月度坚持",icon:"🌟",desc:"连续 30 天记录成长感悟",progress:Math.min(e,30),target:30,done:e>=30,unit:"天"},{id:"invest10",name:"十笔投入",icon:"💰",desc:"累计记录 10 笔自我投入",progress:Math.min(i,10),target:10,done:i>=10,unit:"笔"},{id:"weekly4",name:"周周不断",icon:"📅",desc:"连续 4 周每周至少一笔投入",progress:Math.min(n.streakWeeks,4),target:4,done:n.streakWeeks>=4,unit:"周"},{id:"journal50",name:"觉察达人",icon:"📝",desc:"累计记录 50 条成长感悟",progress:Math.min(o,50),target:50,done:o>=50,unit:"条"},{id:"milestone5",name:"里程碑收集者",icon:"🏆",desc:"达成 5 个成长里程碑",progress:Math.min(s,5),target:5,done:s>=5,unit:"个"}]}function re(t){const e=nt(t),n=e.filter(i=>i.done).length;return Math.round(n/e.length*100)}const lt=[{name:"成长教练",tone:"理性鼓励"},{name:"职场前辈",tone:"务实建议"},{name:"生活哲学家",tone:"温柔启发"}];function le(t){const e=k(t),n=V(t),i=lt[new Date().getDate()%lt.length],o=[],s=[];if(e.growthCoef>=1.2?o.push("你的成长动力很强，学习与投入节奏不错"):e.growthCoef<.9?o.push("近期成长动力偏弱，可能需要调整节奏"):o.push("成长节奏平稳，稳扎稳打"),t.healthScore>=80?o.push("健康状态良好，这是持续成长的底座"):t.healthScore<60&&o.push("健康评分偏低，身体是一切的基础"),n.balance>=.6)o.push("投入结构均衡，多维发展");else{const c=n.dimensions.find(u=>u.type===n.weakest)?.label.split(" ")[1]||"";o.push(`${c}维度投入相对较少`)}t.studyHours<5&&s.push("尝试每周增加 2-3 小时学习时间，成长系数会明显提升"),t.healthScore<70&&s.push("安排规律运动和睡眠，健康评分每提升 10 分，质量系数约提升 7%"),n.balance<.5&&s.push("在保持优势维度的同时，给薄弱维度一些投入，结构会更稳"),e.subjectiveAdjust<1&&s.push("你对自己的评价偏保守，不妨多看看已取得的进步"),s.length===0&&s.push("当前状态不错，给自己设定一个稍高的目标，然后稳步推进");const l=["成长不是百米冲刺，而是马拉松。你已经在路上了。","每一笔投入、每一次觉察，都在塑造未来的你。","不必和别人比，今天的你比昨天好一点，就是胜利。","低谷是蓄力，高峰是收获。享受这个过程。"],r=l[new Date().getDay()%l.length],p=new Date().getHours();let d;return p<6?d="夜深了，注意休息。":p<12?d="早上好，新的一天开始了。":p<18?d="下午好，今天过得怎么样？":d="晚上好，回顾一下今天的成长吧。",{persona:`${i.name}（${i.tone}）`,greeting:d,observations:o,advices:s,encouragement:r}}const de=[{term:"成长资本",icon:"💎",short:"你累计投入自己的总价值",detail:"包括教育、技能、健康、人脉等各维度的投入总和。与金钱不同，成长资本会随时间折旧，需要持续投入来保值增值。",category:"基础"},{term:"人生指数",icon:"📈",short:"综合衡量你当前成长状态的数值",detail:"基于成长资本、成长系数、质量系数、风险折扣、主观感知权重等综合计算。它不是分数，而是一个帮助你觉察和调整的参考。",category:"基础"},{term:"成长系数",icon:"🚀",short:"反映你当前成长速度的倍率",detail:"受收入增长、学习时长、停滞惩罚等影响。学习时长每增加 5 小时/周，成长系数约提升 0.25。",category:"成长"},{term:"质量系数",icon:"✨",short:"反映生活质量对成长的放大作用",detail:"主要由健康评分决定。健康是 1，其他是 0。健康评分每提升 10 分，质量系数约提升 7%。",category:"成长"},{term:"主观感知权重",icon:"🎯",short:"你对自身成长价值的主观评估",detail:'范围 0.5-1.5，默认 1.0 中性。这是你给自己的定价，不影响客观成长资本，只影响你"感受到"的指数。',category:"心理"},{term:"折旧",icon:"📉",short:"成长资本随时间自然损耗",detail:"知识会遗忘，技能会生疏，健康会衰退。不同类型的投入折旧速度不同：健康最稳，教育折旧较快。持续投入是对抗折旧的唯一方式。",category:"方法"},{term:"回撤",icon:"💧",short:"指数从阶段性高点回落的幅度",detail:"成长不是直线上升，回撤是正常的。关键不是避免回撤，而是在回撤中复盘觉察，找到调整方向。",category:"心理"},{term:"里程碑",icon:"🏆",short:"成长路上的标志性节点",detail:"如获得第一份工作、升职加薪、考取证书等。里程碑会给指数带来额外加成，是对阶段性成长的肯定。",category:"成长"}],ce=[{stage:"学生期",ageRange:"18-22 岁",focus:"积累基础，探索方向",tips:["教育投入是核心，学好专业基础","多尝试不同领域，找到兴趣所在","开始建立健康习惯，受益终身","人脉投入从同学关系开始"]},{stage:"职场初期",ageRange:"23-28 岁",focus:"快速学习，建立能力",tips:["技能投入优先，快速提升职场竞争力","健康不能忽视，避免透支身体","人脉从同事和行业社群拓展","设定 3 年成长目标，定期复盘"]},{stage:"职场上升期",ageRange:"29-35 岁",focus:"深度积累，形成壁垒",tips:["在专业领域深耕，建立不可替代性","开始关注财务管理，控制负债",'健康管理从"被动"变"主动"'," mentoring 他人也是自我成长"]},{stage:"成熟期",ageRange:"36-45 岁",focus:"稳定输出，传承价值",tips:['从"学"转向"用"和"教"',"家庭与事业的平衡是关键","健康投入比重需提高","帮助年轻人成长，回馈社会"]}],X=[{title:"致支持我的家人",content:"谢谢你们一直以来的支持和陪伴。我正在认真生活、持续成长，每一点进步都有你们的功劳。我会照顾好自己，也会努力成为更好的人。"},{title:"给爸爸妈妈的一封信",content:"这些年辛苦了。我知道成长不是一件容易的事，而你们的爱是我最坚实的后盾。我会好好珍惜自己，也会常回家看看。"},{title:"感恩有你",content:"感谢你在我成长路上的每一份付出。也许我不常说，但我都记得。我会带着这份爱，继续向前走。"},{title:"我在好好长大",content:"请放心，我在认真生活、努力成长。健康、学习、工作，我都在用心经营。谢谢你给我的一切，我会用成长来回报。"}];function bt(t,e){const n=e??new Date().getDate()%X.length,i=X[n];return{title:i.title,content:i.content,signature:`—— 一个正在成长的人（${t.age} 岁）`}}function Y(){return X.length}function ot(t,e){const n=k(t),i=yt(t,e),o=V(t),s=nt(t),l=[];return l.push("═══════════════════════════════════════"),l.push("         人 生 成 长 报 告"),l.push("═══════════════════════════════════════"),l.push(""),l.push(`生成时间：${new Date().toLocaleString("zh-CN")}`),l.push(""),l.push("【一、当前状态】"),l.push(`  人生指数：${Math.round(n.price)}`),l.push(`  累计成长资本：${Math.round(n.bv)}`),l.push(`  成长系数：${n.growthCoef.toFixed(2)}`),l.push(`  质量系数：${n.qualityCoef.toFixed(2)}`),l.push(`  风险折扣：${Math.round(n.riskDiscount*100)}%`),l.push(`  主观感知权重：${n.subjectiveAdjust.toFixed(2)}`),l.push(""),l.push("【二、本月概览】"),l.push(`  月度变化：${i.changePoints>=0?"+":""}${i.changePoints} 点（${i.changePct>=0?"+":""}${i.changePct}%）`),l.push(`  投入笔数：${i.investCount} 笔，金额 ¥${i.investAmount.toLocaleString()}`),l.push(`  记录天数：${i.journalDays} 天`),i.highlights.length>0&&(l.push("  本月亮点："),i.highlights.forEach(r=>l.push(`    - ${r}`))),l.push(""),l.push("【三、投入结构】"),o.dimensions.forEach(r=>{l.push(`  ${r.label}：¥${r.amount.toLocaleString()}`)}),l.push(`  均衡度：${Math.round(o.balance*100)}%`),l.push(""),l.push("【四、挑战进度】"),s.forEach(r=>{l.push(`  ${r.icon} ${r.name}：${r.progress}/${r.target} ${r.unit} ${r.done?"✓":""}`)}),l.push(""),l.push("【五、下月建议】"),i.suggestions.forEach(r=>l.push(`  • ${r}`)),l.push(""),l.push("═══════════════════════════════════════"),l.push("  本报告由「人生即股票」自动生成"),l.push("  仅供自我觉察参考，不代表客观评价"),l.push("═══════════════════════════════════════"),l.join(`
`)}class pe{get(e){return localStorage.getItem(e)}set(e,n){localStorage.setItem(e,n)}remove(e){localStorage.removeItem(e)}clear(){localStorage.clear()}}const L=new pe,it="lifeStockUser",xt="disclaimerConfirmed",wt="privacyConsent";function A(t){L.set(it,JSON.stringify(t))}function ue(){const t=L.get(it);if(!t)return null;try{const e=JSON.parse(t),n=ht(e,e.version);return n.investments=(n.investments||[]).map(i=>({...i,date:new Date(i.date)})),n.setbacks&&(n.setbacks=n.setbacks.map(i=>({...i,date:new Date(i.date)}))),n}catch{return null}}function ve(){L.remove(it)}function ge(){return L.get(wt)==="1"}function me(){L.set(wt,"1")}function he(){L.clear()}function fe(){return L.get(xt)==="1"}function ye(){L.set(xt,"1")}function be(t){const e={...Wt(t),exportTime:new Date().toISOString()},n=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),i=URL.createObjectURL(n),o=document.createElement("a");o.href=i,o.download=`life-index-${t.age}岁-${new Date().toISOString().slice(0,10)}.json`,o.click(),URL.revokeObjectURL(i)}function xe(t){const e=JSON.parse(t);if(!e.age||!e.history)throw new Error("文件格式不正确");const n=ht(e,e.version);return n.investments=(n.investments||[]).map(i=>({...i,date:new Date(i.date)})),n.setbacks&&(n.setbacks=n.setbacks.map(i=>({...i,date:new Date(i.date)}))),n}function we(){a&&be(a)}function $e(t){const e=t.target.files?.[0];if(!e)return;const n=new FileReader;n.onload=i=>{try{a=xe(i.target.result),A(a),P(),S("✅ 数据已导入")}catch{S("❌ 导入失败：文件格式不正确")}},n.readAsText(e),t.target.value=""}let a=null,N=0,$t="education",w={};window.startOnboarding=Me;window.showAnchorModal=ze;window.showForecastModal=Re;window.showShareModal=Be;window.showSetbackModal=_e;window.showDetailModal=Oe;window.showParentModal=Ne;window.editProfile=Ge;window.resetAll=Fe;window.exportData=we;window.importData=$e;window.handleDeleteAllData=We;window.closeModal=R;const U=[{title:"第1步：你今年多大？",desc:"年龄帮我们找到你在人生曲线上的位置",field:"age",type:"number",placeholder:"请输入年龄（1-100）"},{title:"第2步：你来自哪里？",desc:"不同城市的成长成本不太一样",field:"region",type:"select",options:[{value:"tier1",label:"一线城市（北上广深）"},{value:"new_tier1",label:"新一线城市"},{value:"tier2",label:"二线城市"},{value:"tier3",label:"三线及以下"}]},{title:"第3步：家庭条件？",desc:"家庭支持也是成长资本的一部分",field:"income",type:"select",options:[{value:"low",label:"困难"},{value:"below_avg",label:"偏低"},{value:"avg",label:"一般"},{value:"above_avg",label:"较好"},{value:"high",label:"富裕"}]},{title:"第4步：你的学历？",desc:"学历是会跟你一辈子的资产",field:"education",type:"select",options:[{value:"primary",label:"小学"},{value:"junior",label:"初中"},{value:"senior",label:"高中"},{value:"college",label:"大专"},{value:"bachelor",label:"本科"},{value:"master",label:"硕士及以上"}]},{title:"第5步：你的年收入？",desc:"收入是成长力的一部分，填税前年薪就好",field:"annualIncome",type:"number",placeholder:"请输入税前年收入（元），如 120000"},{title:"第6步：收入增长趋势？",desc:"持续增长会让成长更有动力",field:"annualIncomeGrowth",type:"select",options:[{value:"0",label:"下降"},{value:"0.05",label:"稳定"},{value:"0.1",label:"稳步增长"},{value:"0.2",label:"快速增长"}]},{title:"第7步：每周学习时长？",desc:"学习是给自己最好的投资",field:"studyHours",type:"select",options:[{value:"0",label:"几乎不学习"},{value:"2",label:"约2小时"},{value:"5",label:"约5小时"},{value:"10",label:"10小时以上"}]},{title:"第8步：健康状况？",desc:"健康是一切的底座",field:"healthScore",type:"select",options:[{value:"40",label:"较差"},{value:"60",label:"一般"},{value:"75",label:"良好"},{value:"90",label:"优秀"}]},{title:"第9步：负债情况？",desc:"适度负债没关系，留意它的影响就好",field:"debtRatio",type:"select",options:[{value:"0",label:"无负债"},{value:"0.1",label:"少量负债"},{value:"0.3",label:"中等负债"},{value:"0.6",label:"高负债"}]},{title:"第10步：人生节点（可多选）",desc:"已达成的节点都是成长的里程碑",field:"milestones",type:"multi",options:[{value:"hasJob",label:"💼 有工作"},{value:"salaryRaised",label:"💰 涨过薪"},{value:"hasLicense",label:"🚗 有驾照"},{value:"marathon",label:"🏃 跑过马拉松"},{value:"married",label:"💍 已婚"},{value:"hasHouse",label:"🏠 有房"},{value:"hasChild",label:"👶 有孩子"}]}];function Me(){N=0,w={},document.getElementById("landing")?.classList.add("hidden"),Mt()}function Mt(){const t=U[N],e=M(t.title,t.desc);let n="";t.type==="number"?n=`<input type="number" id="onboardInput" class="form-input" placeholder="${t.placeholder}" style="width:100%;padding:12px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text-primary);font-size:16px;">`:t.type==="select"?n=`<select id="onboardInput" style="width:100%;padding:12px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text-primary);font-size:16px;">
      ${t.options.map(i=>`<option value="${i.value}">${i.label}</option>`).join("")}
    </select>`:t.type==="multi"&&(n=`<div id="multiOptions" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      ${t.options.map(i=>`<label style="display:flex;align-items:center;gap:8px;padding:10px;background:rgba(255,255,255,0.04);border-radius:10px;cursor:pointer;"><input type="checkbox" value="${i.value}"> ${i.label}</label>`).join("")}
    </div>`),n+=`<div class="form-actions"><button class="btn-primary" onclick="submitOnboarding()">${N===U.length-1?"生成我的人生走势图":"下一步"}</button></div>`,e.querySelector(".modal-body").innerHTML=n}window.submitOnboarding=ke;function ke(){const t=U[N];if(t.type==="multi")Array.from(document.querySelectorAll("#multiOptions input:checked")).map(n=>n.value).forEach(n=>{w[n]=!0});else{const e=document.getElementById("onboardInput").value;t.type==="number"?w[t.field]=Number(e):w[t.field]=e}N++,N>=U.length?Se():Mt()}function Se(){const t=w.age;a={age:t,region:w.region,area:"urban",income:w.income,education:w.education,birthYear:new Date().getFullYear()-t,annualIncome:w.annualIncome,annualIncomeGrowth:Number(w.annualIncomeGrowth),studyHours:Number(w.studyHours),healthScore:Number(w.healthScore),debtRatio:Number(w.debtRatio),hasJob:!!w.hasJob,salaryRaised:!!w.salaryRaised,hasLicense:!!w.hasLicense,marathon:!!w.marathon,married:!!w.married,hasHouse:!!w.hasHouse,hasChild:!!w.hasChild,totalInvest:0,history:Ft({age:t,region:w.region,area:"urban",income:w.income,education:w.education}),investments:[],familySupportCapital:0,subjectiveWeight:1,version:K},A(a),R(),P(),S("✅ 人生走势图已生成！")}function P(){if(!a)return;const t=a;document.getElementById("landing")?.classList.add("hidden"),document.getElementById("dashboard")?.classList.remove("hidden");const e=k(t);document.getElementById("dashPrice").textContent="¥"+e.price;const n=document.getElementById("dashChange");n.textContent=(e.change>=0?"+":"")+e.change+"%",n.style.color=e.change>=0?"var(--accent-green)":"var(--accent-red)",document.getElementById("dashBV").textContent=e.bv+"万",document.getElementById("dashEPS").textContent=String(e.eps),document.getElementById("dashROE").textContent=e.roe+"%",document.getElementById("dashPE").textContent=e.pe;const i=Ht(t),o=i.level==="high"?"var(--accent-green)":i.level==="medium"?"var(--accent-yellow)":"var(--accent-red)",s=Math.round(i.estimatedRatio*100),l=Math.round(i.potentialEstimatedRatio*100);document.getElementById("dashConfidence").innerHTML=`<span style="color:${o};font-weight:bold;">● ${i.label}</span> 本指数含 ${s}% 估算成分`+(i.level!=="high"?`，<a href="javascript:showAnchorModal()" style="color:var(--accent-blue);text-decoration:underline;">校准后可降至 ${l}%</a>`:"")+'<br><a href="javascript:showDetailModal()" style="color:var(--text-muted);text-decoration:underline;">查看数据来源 →</a>';const r=_(t);Te(r,t),De(t),Ce(t),kt(t),St(t)}window.selectInvestType=Ee;function Ee(t){$t=t,document.querySelectorAll(".invest-type").forEach(e=>{e.classList.toggle("selected",e.getAttribute("data-type")===t)})}window.addInvestment=Ie;function Ie(){if(!a)return;const t=document.getElementById("investAmount"),e=document.getElementById("investDesc"),n=Number(t.value);if(!n||n<=0){S("请输入有效金额");return}a.investments.push({type:$t,amount:n,desc:e.value||void 0,date:new Date}),a.totalInvest+=n,t.value="",e.value="",A(a),P(),S(`✅ 已记录投入 ¥${n.toLocaleString()}，指数已更新`)}function De(t){const e=j.filter(i=>i.condition(t));document.getElementById("milestoneCount").textContent=`(${e.length}/${j.length})`;const n=document.getElementById("milestoneList");n.innerHTML=j.map(i=>{const o=i.condition(t);return`<div class="milestone-item ${o?"done":""}" style="opacity:${o?1:.5};">
      <span class="m-icon">${i.icon}</span>
      <span class="m-name">${i.name} <span style="font-size:11px;color:var(--text-muted);">${i.desc}</span></span>
      <span class="m-bonus">${o?"✓ +"+i.bonus:"+"+i.bonus}</span>
    </div>`}).join("")}function Ce(t){const e=document.getElementById("investList");if(t.investments.length===0){e.innerHTML='<div style="text-align:center;color:var(--text-secondary);padding:30px;">还没有投入记录，记一笔试试吧</div>';return}const n={education:"🎓",skill:"📚",health:"💪",network:"🤝",entertainment:"🎮",other:"📦"};e.innerHTML=t.investments.slice().reverse().map(i=>`
    <div class="invest-item">
      <span class="i-type">${n[i.type]||"📦"}</span>
      <div class="i-info">
        <div>${i.desc||i.type} ${i.impact?'<span class="i-impact">⭐ 影响大</span>':""}</div>
        <div style="font-size:11px;color:var(--text-muted);">${new Date(i.date).toLocaleDateString("zh-CN")}</div>
      </div>
      <span class="i-amount">¥${i.amount.toLocaleString()}</span>
    </div>
  `).join("")}function Te(t,e){const n=document.getElementById("klineCanvas");if(!n||t.length<2)return;const i=n.getBoundingClientRect();n.width=i.width*2,n.height=i.height*2;const o=n.getContext("2d");o.scale(2,2);const s=i.width,l=i.height,r={l:50,r:55,t:20,b:40},p=s-r.l-r.r,d=50,c=l-r.t-r.b-d-10,u=r.t+c+10,g=t.map($=>$.price),v=Math.min(...g)*.95,h=Math.max(...g)*1.05,f=h-v||1,D=Math.max(...t.map($=>$.invest),1),b=mt(e),I=r.t+c*(1-(b-v)/f),E=t.map(($,x)=>{const C=Math.max(0,x-4);return t.slice(C,x+1).reduce((T,q)=>T+q.price,0)/(x-C+1)});o.clearRect(0,0,s,l),o.strokeStyle="rgba(255,255,255,0.06)";for(let $=0;$<=4;$++){const x=r.t+c/4*$;o.beginPath(),o.moveTo(r.l,x),o.lineTo(s-r.r,x),o.stroke(),o.fillStyle="rgba(160,163,192,0.6)",o.font="11px sans-serif",o.fillText(String(Math.round(h-f/4*$)),5,x+4)}const m=p/(t.length-1);I>=r.t&&I<=r.t+c&&(o.strokeStyle="rgba(251,191,36,0.5)",o.lineWidth=1.2,o.setLineDash([6,4]),o.beginPath(),o.moveTo(r.l,I),o.lineTo(s-r.r,I),o.stroke(),o.setLineDash([]),o.fillStyle="#fbbf24",o.font="bold 10px sans-serif",o.fillText("同龄人 ¥"+Math.round(b),s-r.r+3,I+3));const z=o.createLinearGradient(0,r.t,0,r.t+c);z.addColorStop(0,"rgba(94,111,255,0.3)"),z.addColorStop(1,"rgba(94,111,255,0)"),o.beginPath(),o.moveTo(r.l,r.t+c),t.forEach(($,x)=>{const C=r.l+m*x,T=r.t+c*(1-($.price-v)/f);o.lineTo(C,T)}),o.lineTo(r.l+p,r.t+c),o.closePath(),o.fillStyle=z,o.fill(),o.beginPath(),E.forEach(($,x)=>{const C=r.l+m*x,T=r.t+c*(1-($-v)/f);x===0?o.moveTo(C,T):o.lineTo(C,T)}),o.strokeStyle="rgba(168,85,247,0.7)",o.lineWidth=1.5,o.setLineDash([4,3]),o.stroke(),o.setLineDash([]),o.beginPath(),t.forEach(($,x)=>{const C=r.l+m*x,T=r.t+c*(1-($.price-v)/f);x===0?o.moveTo(C,T):o.lineTo(C,T)}),o.strokeStyle="#5e6fff",o.lineWidth=2.5,o.stroke();const It=[0,6,15,18,22,30];t.forEach(($,x)=>{if(It.includes($.age)){const C=r.l+m*x,T=r.t+c*(1-($.price-v)/f);o.beginPath(),o.arc(C,T,5,0,Math.PI*2),o.fillStyle="#4ade80",o.fill(),o.strokeStyle="#0a0e27",o.lineWidth=2,o.stroke()}});const H=t[t.length-1],st=r.t+c*(1-(H.price-v)/f);o.fillStyle=H.price>=b?"#22c55e":"#ef4444",o.fillRect(s-r.r,st-9,50,18),o.fillStyle="#fff",o.font="bold 11px sans-serif",o.textAlign="center",o.fillText("¥"+H.price,s-r.r+25,st+4),o.textAlign="left",t.forEach(($,x)=>{const C=r.l+m*x,T=$.invest/D*d,q=Math.max(1,m*.5);o.fillStyle=H.price>=g[0]?"rgba(34,197,94,0.5)":"rgba(239,68,68,0.5)",o.fillRect(C-q/2,u+d-T,q,T)});const Dt=Math.max(1,Math.floor(t.length/8));o.fillStyle="rgba(160,163,192,0.6)",o.font="11px sans-serif",t.forEach(($,x)=>{(x%Dt===0||x===t.length-1)&&o.fillText($.age+"岁",r.l+m*x-10,l-r.b+20)}),o.font="10px sans-serif",o.fillStyle="#5e6fff",o.fillRect(r.l+5,r.t+4,12,3),o.fillStyle="#c8cadf",o.fillText("指数",r.l+21,r.t+8),o.fillStyle="#a855f7",o.fillRect(r.l+50,r.t+4,12,3),o.fillStyle="#c8cadf",o.fillText("MA5",r.l+66,r.t+8),o.fillStyle="#fbbf24",o.fillRect(r.l+105,r.t+4,12,3),o.fillStyle="#c8cadf",o.fillText("同龄人",r.l+121,r.t+8),document.getElementById("klineAge").textContent=`（${H.age}岁，当前指数 ¥${H.price}）`}function M(t,e){const n=document.getElementById("modalContainer");return n.innerHTML=`<div class="modal-overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal" style="position:relative;">
      <button class="modal-close" onclick="closeModal()">×</button>
      <h2>${t}</h2>
      <p class="modal-desc">${e}</p>
      <div class="modal-body"></div>
    </div>
  </div>`,n.querySelector(".modal")}function R(){document.getElementById("modalContainer").innerHTML=""}function S(t){const e=document.createElement("div");e.className="toast",e.textContent=t,document.getElementById("toastContainer").appendChild(e),setTimeout(()=>e.remove(),2500)}function ze(){if(!a)return;const t=M("🎯 校准指数","用真实数据修正估算，提升指数置信度");t.querySelector(".modal-body").innerHTML=`
    <div style="display:grid;grid-template-columns:1fr;gap:16px;">
      <!-- B1-1：单笔投入反推校准 -->
      <div style="padding:12px;background:rgba(255,255,255,0.04);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">① 用一笔真实投入反推校准</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">输入你印象深刻的某年真实投入，系统按比例校准所有历史估算。</div>
        <div class="form-label">年龄</div>
        <input type="number" id="anchorAge" value="${a.age}" style="width:100%;padding:10px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text-primary);margin-bottom:10px;">
        <div class="form-label">该年真实投入（元）</div>
        <input type="number" id="anchorAmount" placeholder="如 30000" style="width:100%;padding:10px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text-primary);margin-bottom:10px;">
        <button class="btn-primary" onclick="applyAnchor()" style="width:100%;">应用校准</button>
      </div>

      <!-- B1-2：手动调整家庭支持资本 -->
      <div style="padding:12px;background:rgba(168,85,247,0.08);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">② 家庭支持资本（万元）</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">父母/家庭对你的累计投入，不折旧、不乘权重，直接计入累计成长资本。</div>
        <input type="number" id="familyCapital" value="${a.familySupportCapital||0}" step="1" style="width:100%;padding:10px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text-primary);margin-bottom:10px;">
        <button class="btn-primary" onclick="applyFamilyCapital()" style="width:100%;">保存家庭支持资本</button>
      </div>

      <!-- B1-3：标记"对我影响大"的投入 -->
      <div style="padding:12px;background:rgba(94,111,255,0.08);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">③ 标记"对我影响很大"的投入</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">已记录的自我投入中，标记后会在明细页高亮展示（不改变数值，仅反映主观感知）。</div>
        ${a.investments.length===0?'<div style="font-size:12px;color:var(--text-muted);">暂无手动记录的投入。先去「记一笔」添加吧。</div>':a.investments.map((e,n)=>`
            <label style="display:flex;align-items:center;gap:8px;padding:8px;background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:6px;cursor:pointer;">
              <input type="checkbox" id="impact_${n}" ${e.impact?"checked":""}>
              <span style="font-size:13px;">${e.desc||e.type} · ¥${e.amount.toLocaleString()}</span>
            </label>
          `).join("")}
        ${a.investments.length>0?'<button class="btn-primary" onclick="applyImpact()" style="width:100%;margin-top:8px;">保存标记</button>':""}
      </div>

      <!-- 主观感知权重 -->
      <div style="padding:12px;background:rgba(34,197,94,0.08);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">④ 主观感知权重（${a.subjectiveWeight||1}）</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">你觉得自己的成长值这个权重吗？1.0 为中性，0.5 偏低、1.5 偏高。这是你的主观判断，不影响客观累计成长资本。</div>
        <input type="range" id="subjectiveRange" min="0.5" max="1.5" step="0.05" value="${a.subjectiveWeight||1}" style="width:100%;" oninput="document.getElementById('subjVal').textContent=this.value">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);">
          <span>0.5（偏低）</span><span id="subjVal">${a.subjectiveWeight||1}</span><span>1.5（偏高）</span>
        </div>
        <button class="btn-primary" onclick="applySubjective()" style="width:100%;margin-top:10px;">保存主观权重</button>
      </div>
    </div>
  `}window.applySubjective=Ae;function Ae(){if(!a)return;const t=Number(document.getElementById("subjectiveRange").value);a.subjectiveWeight=_t(t),A(a),P(),S("✅ 主观权重已设为 "+a.subjectiveWeight),R()}window.applyFamilyCapital=Pe;function Pe(){if(!a)return;const t=Number(document.getElementById("familyCapital").value);a.familySupportCapital=Math.max(0,t),A(a),P(),S("✅ 家庭支持资本已更新"),R()}window.applyImpact=je;function je(){a&&(a.investments=a.investments.map((t,e)=>{const n=document.getElementById("impact_"+e);return{...t,impact:n?.checked||!1}}),A(a),S("✅ 标记已保存"),R())}window.applyAnchor=Le;function Le(){if(!a)return;const t=Number(document.getElementById("anchorAge").value),e=Number(document.getElementById("anchorAmount").value),n=a.history.findIndex(i=>i.age===t);if(n>=0){const i=e/a.history[n].invest;a.history=a.history.map(o=>({...o,invest:o.invest*i})),A(a),P(),S("✅ 校准成功！系数 "+i.toFixed(2))}R()}function Re(){if(!a)return;const e=k(a).price,n=Array.from({length:50},()=>{let o=e;for(let s=0;s<10;s++){const l=.12+(Math.random()-.5)*.3;o*=1+l}return o}).sort((o,s)=>o-s),i=M("🔮 未来预测","基于蒙特卡洛模拟，预测未来10年指数走势");i.querySelector(".modal-body").innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
      <div style="padding:12px;background:rgba(239,68,68,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">悲观 (P10)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-red);">¥${Math.round(n[5])}</div></div>
      <div style="padding:12px;background:rgba(94,111,255,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">中性 (P50)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-blue);">¥${Math.round(n[25])}</div></div>
      <div style="padding:12px;background:rgba(34,197,94,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">乐观 (P90)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-green);">¥${Math.round(n[45])}</div></div>
    </div>
    <p style="color:var(--text-muted);font-size:12px;">假设：年化成长12%，波动率15%，持续学习</p>
  `}function Be(){if(!a)return;const t=a,e=k(t),n=e.roe>=15?"优秀":e.roe>=8?"良好":e.roe>=3?"一般":"待提升",i=j.filter(d=>d.condition(t)).length,o=e.effectiveHealth,s=o>=80?"优秀":o>=60?"良好":o>=40?"一般":"需关注",l=t.studyHours,r=l>=8?"勤奋":l>=3?"稳定":l>=1?"一般":"较少",p=M("📤 分享","生成专属指数卡片");p.querySelector(".modal-body").innerHTML=`
    <div style="background:linear-gradient(135deg,#1a1f3a,#2a1f4a);padding:24px;border-radius:16px;text-align:center;">
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">LIFE AS INDEX · 人生即成长</div>
      <div style="font-size:42px;font-weight:bold;color:var(--accent-blue);">¥${e.price}</div>
      <div style="color:${e.change>=0?"var(--accent-green)":"var(--accent-red)"};margin-bottom:16px;">${e.change>=0?"+":""}${e.change}%</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div><div style="font-size:11px;color:var(--text-muted)">成长效率</div><div style="font-weight:bold">${n}</div></div>
        <div><div style="font-size:11px;color:var(--text-muted)">里程碑</div><div style="font-weight:bold">${i}/${j.length}</div></div>
        <div><div style="font-size:11px;color:var(--text-muted)">健康等级</div><div style="font-weight:bold">${s}</div></div>
        <div><div style="font-size:11px;color:var(--text-muted)">学习习惯</div><div style="font-weight:bold">${r}</div></div>
      </div>
      <div style="margin-top:16px;font-size:11px;color:var(--text-muted);">成长没有标准答案，每一步都算数</div>
      <div style="margin-top:8px;font-size:10px;color:rgba(255,255,255,0.3);">本数值基于模型估算，不代表真实资产</div>
    </div>
  `}function _e(){const t=M("💥 记录挫折","人生指数有涨有跌，记录挫折看到真实冲击");t.querySelector(".modal-body").innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
      ${[{t:"jobloss",i:"💼",n:"失业/降薪",d:"收入下降"},{t:"illness",i:"🏥",n:"重大疾病",d:"健康衰退"},{t:"loss",i:"📉",n:"投资回撤",d:"本金回撤"},{t:"stagnate",i:"😴",n:"躺平/断更",d:"停止成长"}].map(e=>`<div class="setback-type" data-type="${e.t}" onclick="selectSetback('${e.t}')" style="padding:12px;background:rgba(255,255,255,0.04);border-radius:10px;cursor:pointer;text-align:center;"><div style="font-size:24px">${e.i}</div><div style="font-weight:bold;margin-top:4px">${e.n}</div><div style="font-size:11px;color:var(--text-muted)">${e.d}</div></div>`).join("")}
    </div>
    <input type="range" id="setbackSeverity" min="1" max="10" value="5" style="width:100%;">
    <div style="text-align:center;color:var(--text-secondary);margin:8px 0;">严重度：<span id="severityVal">5</span></div>
    <div class="form-actions"><button class="btn-primary" style="background:linear-gradient(135deg,#ef4444,#dc2626);" onclick="applySetback()">确认记录</button></div>
  `,document.getElementById("setbackSeverity").oninput=e=>{document.getElementById("severityVal").textContent=e.target.value}}let O="";window.selectSetback=t=>{O=t};window.applySetback=He;function He(){if(!a||!O)return;const t=Number(document.getElementById("setbackSeverity").value)/10,e=k(a).price;if(O==="jobloss")a.annualIncome=Math.max(0,a.annualIncome*(1-.3*t)),a.annualIncomeGrowth=-.1;else if(O==="illness")a.healthScore=Math.max(20,a.healthScore-30*t),a.debtRatio=Math.min(.8,a.debtRatio+.2*t);else if(O==="loss"){const i=a.totalInvest*.15*t;a.totalInvest=Math.max(0,a.totalInvest-i),a.history=a.history.map(o=>({...o,invest:o.invest*(1-.15*t)}))}else O==="stagnate"&&(a.studyHours=Math.max(0,a.studyHours-2*t));A(a);const n=k(a).price;R(),S(`指数 ${e.toFixed(1)} → ${n.toFixed(1)}`),P()}function Oe(){if(!a)return;const t=a,e=k(t),n=Q(t.age),i=j.filter(d=>d.condition(t)),o={};t.history.forEach(d=>{const c=y.TYPE_WEIGHTS[d.type]||1,u=d.invest/1e4*c*J(1,Math.max(0,t.age-d.age),d.type);o[d.type]=(o[d.type]||0)+u});const s={education:"教育",skill:"技能",health:"健康",network:"人脉",entertainment:"娱乐",other:"其他"},l=Lt.education_cost,r=Object.keys(y.AGE_SPEND_RANGE),p=M("📋 计算明细","看清每一个数字的来龙去脉");p.querySelector(".modal-body").innerHTML=`
    <div style="font-family:monospace;font-size:13px;line-height:2;">
      <div style="padding:12px;background:rgba(94,111,255,0.1);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;color:var(--accent-blue);margin-bottom:8px;">📐 计算公式</div>
        <div style="color:var(--text-secondary)">人生指数 = (100 + BV × 阶段系数 + min(里程碑加成,200)) × 成长系数 × 质量系数 × (1 - 风险折扣)</div>
      </div>
      <div style="padding:12px;background:rgba(255,255,255,0.04);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;margin-bottom:8px;">② 累计成长资本 (BV) = ${e.bv.toFixed(2)} 万</div>
        ${Object.entries(o).map(([d,c])=>`<div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">${s[d]||d}</span><span>${c.toFixed(2)} 万</span></div>`).join("")}
        ${t.familySupportCapital?`<div style="display:flex;justify-content:space-between;color:var(--accent-purple);"><span>家庭支持资本（不折旧）</span><span>${t.familySupportCapital} 万</span></div>`:""}
        <div style="border-top:1px solid rgba(255,255,255,0.1);margin-top:6px;padding-top:6px;font-weight:bold;">BV × 阶段系数 = ${e.bv.toFixed(2)} × ${n.toFixed(2)} = ${(e.bv*n).toFixed(2)}</div>
      </div>

      <!-- A1：数据溯源卡片 -->
      <div style="padding:12px;background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.2);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;color:var(--accent-yellow);margin-bottom:8px;">🔍 历史投入估算 · 数据溯源</div>
        <div style="font-size:12px;color:var(--text-secondary);line-height:1.8;">
          <div><strong>数据来源：</strong>${l.name}（${l.year}）</div>
          <div><strong>原始口径：</strong>${l.caliber}</div>
          <div><strong>调整系数：</strong>地区 ${y.REGION_COEF[t.region]} × 城乡 ${y.AREA_COEF[t.area]} × 收入 ${y.INCOME_COEF[t.income]}</div>
        </div>
        <!-- A2：参考区间，替代"±4%精度" -->
        <div style="margin-top:10px;padding:10px;background:rgba(255,255,255,0.04);border-radius:8px;">
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">📊 各阶段年均教育投入参考区间（元）：</div>
          ${r.map(d=>{const c=y.AGE_SPEND_RANGE[d];return`<div style="display:flex;justify-content:space-between;font-size:12px;"><span style="color:var(--text-secondary)">${d}岁</span><span>${c.low.toLocaleString()} ~ ${c.mid.toLocaleString()} ~ ${c.high.toLocaleString()}</span></div>`}).join("")}
          <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">以上为统计估算区间，非精确值。点击「校准指数」可修正为你的真实投入。</div>
        </div>
      </div>

      <div style="padding:12px;background:rgba(255,255,255,0.04);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;margin-bottom:8px;">③ 里程碑加成 = ${e.milestoneBonus}（封顶 200）</div>
        ${i.map(d=>`<div style="font-size:12px;color:var(--text-secondary)">${d.icon} ${d.name} +${d.bonus}</div>`).join("")}
      </div>
      <div style="padding:12px;background:rgba(255,255,255,0.04);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;margin-bottom:8px;">④ 系数</div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">成长系数</span><span>${e.growthCoef}</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">质量系数（健康${e.effectiveHealth}）</span><span>${e.qualityCoef}</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">风险折扣（负债率${(t.debtRatio*100).toFixed(0)}%）</span><span>${e.riskDiscount}</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">主观感知权重</span><span>${e.subjectiveAdjust}</span></div>
      </div>

      <!-- 归因分析 -->
      <div style="padding:12px;background:rgba(94,111,255,0.06);border:1px solid rgba(94,111,255,0.2);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;color:var(--accent-blue);margin-bottom:8px;">📊 指数归因 · 每个因子贡献了多少</div>
        ${(()=>{const d=Yt(t,e),c=Ut(d);return d.map(u=>{const g=u.contribution===0;return`<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
              <span style="color:var(--text-secondary);font-size:12px;">${u.name}</span>
              <span style="font-size:12px;">${g?u.reason:`<strong>+${u.contribution}</strong> · ${u.reason}`}</span>
            </div>`}).join("")+(c?`<div style="margin-top:8px;padding:8px;background:rgba(34,197,94,0.08);border-radius:8px;font-size:12px;color:var(--accent-green);">⭐ 最大贡献：${c.name}（+${c.contribution}点）</div>`:"")})()}
      </div>

      <div style="padding:16px;background:linear-gradient(135deg,rgba(94,111,255,0.2),rgba(168,85,247,0.2));border-radius:12px;text-align:center;">
        <div style="color:var(--text-secondary);font-size:12px;">最终人生指数</div>
        <div style="font-size:32px;font-weight:bold;color:var(--accent-blue);">¥${e.price}</div>
      </div>
    </div>
    <div style="margin-top:16px;padding:12px;background:rgba(251,191,36,0.08);border-radius:10px;font-size:12px;color:var(--text-secondary);line-height:1.6;">
      ⚠️ 以上数值基于模型估算，仅供自我成长参考，不代表真实资产。<br>
      <strong>本指数不衡量</strong>幸福感、关系质量、心理健康、创造力、社会贡献，也不预测未来收入。
    </div>
  `}function Ne(){if(!a)return;const t=a.history.reduce((s,l)=>s+l.invest,0),e=a.investments.reduce((s,l)=>s+l.amount,0),n=t+e,i=k(a),o=M("👨‍👩‍👧 父母视角","父母的每一笔投入，都是你人生指数的基石");o.querySelector(".modal-body").innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
      <div style="padding:14px;background:rgba(168,85,247,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">父母投入</div><div style="font-size:20px;font-weight:bold;color:var(--accent-purple);">¥${t.toLocaleString()}</div></div>
      <div style="padding:14px;background:rgba(251,146,60,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">自我投入</div><div style="font-size:20px;font-weight:bold;color:#fb923c;">¥${e.toLocaleString()}</div></div>
    </div>
    <div style="height:20px;background:rgba(255,255,255,0.05);border-radius:10px;overflow:hidden;display:flex;">
      <div style="width:${t/n*100}%;background:var(--accent-purple);"></div>
      <div style="width:${e/n*100}%;background:#fb923c;"></div>
    </div>
    <div style="margin-top:16px;padding:14px;background:rgba(74,222,128,0.08);border-radius:12px;font-size:13px;color:var(--text-secondary);line-height:1.7;">
      💡 当前 ${a.age} 岁，人生指数已从基准 100 增长到 ¥${i.price}。<br>
      ${e===0?'⚠️ 还没有记录自我投入，试试"记一笔"吧！':"继续加油，每一笔自我投入都会让指数更上一层楼。"}
    </div>
  `}function Ge(){S("请重置后重新填写问卷（投资记录会保留）")}function Fe(){confirm("确定要重置所有数据吗？")&&(ve(),a=null,document.getElementById("dashboard")?.classList.add("hidden"),document.getElementById("landing")?.classList.remove("hidden"))}function qe(){if(!ge()){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`<div class="modal" style="max-width:480px;">
      <h2>🔒 隐私保护指引</h2>
      <div style="color:var(--text-secondary);line-height:1.8;margin:16px 0;text-align:left;font-size:14px;">
        <p><strong>我们收集什么：</strong>仅收集你主动填写的成长数据（年龄、收入、投入记录等）。</p>
        <p><strong>数据存哪里：</strong>默认仅保存在你的设备本地（浏览器 localStorage），<strong>不上传服务器</strong>。如需云同步，你可在设置中主动开启。</p>
        <p><strong>如何删除：</strong>设置页提供「删除全部数据」按钮，可一键清除所有本地数据。</p>
        <p style="margin-top:12px;padding:12px;background:var(--card-bg);border-radius:8px;">
          ⚠️ 本产品为个人成长量化工具，所有数值基于模型估算，<strong>不代表你的真实价值，也不构成任何投资或人生建议</strong>。<br>
          本指数<strong>不衡量</strong>幸福感、关系质量、心理健康、创造力、社会贡献，也不预测未来收入。
        </p>
      </div>
      <div class="form-actions"><button class="btn-primary" id="consentPrivacy">同意并继续</button></div>
    </div>`,document.body.appendChild(t),document.getElementById("consentPrivacy").onclick=()=>{me(),t.remove(),dt()};return}dt()}function dt(){if(fe())ct();else{const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`<div class="modal" style="max-width:480px;">
      <h2>⚠️ 温馨提示</h2>
      <p style="color:var(--text-secondary);line-height:1.8;margin:16px 0;">
        本产品为<strong>个人成长量化工具</strong>，所有数值基于模型估算，<strong style="color:var(--accent-yellow)">不代表真实资产或投资建议</strong>。<br><br>
        人生不是股票，成长没有标准答案。
      </p>
      <div class="form-actions"><button class="btn-primary" id="confirmDisclaimer">我知道了</button></div>
    </div>`,document.body.appendChild(t),document.getElementById("confirmDisclaimer").onclick=()=>{ye(),t.remove(),ct()}}}function ct(){const t=ue();t&&(a=t,P())}function We(){confirm("确定要删除全部数据吗？此操作不可恢复。")&&(he(),a=null,document.getElementById("dashboard")?.classList.add("hidden"),document.getElementById("landing")?.classList.remove("hidden"),S("✅ 全部数据已删除"))}let F;window.setJournalMood=Ye;function Ye(t){F=F===t?void 0:t,document.querySelectorAll(".mood-btn").forEach(e=>{e.classList.toggle("selected",e.getAttribute("data-mood")===F)})}window.addJournal=Ue;function Ue(){if(!a)return;const t=document.getElementById("journalInput"),e=t.value.trim();if(!e){S("请输入内容");return}const n=Jt(e,F);a=Xt(a,n),t.value="",F=void 0,document.querySelectorAll(".mood-btn").forEach(i=>i.classList.remove("selected")),A(a),kt(a),St(a),S("✅ 已记录")}function kt(t){const e=document.getElementById("recentJournals");if(!e)return;const n=Kt(t,8);if(n.length===0){e.innerHTML='<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:10px;">还没有记录，写下此刻的想法吧</div>';return}const i={great:"😄",good:"🙂",ok:"😐",low:"😔"};e.innerHTML=n.map(o=>`
    <div class="journal-item">
      <span class="j-mood">${o.mood?i[o.mood]:"📝"}</span>
      <div class="j-content">
        <div>${o.content}</div>
        <div class="j-date">${new Date(o.date).toLocaleString("zh-CN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
      </div>
    </div>
  `).join("")}function St(t){const e=et(t),n=document.getElementById("weeklyBadge"),i=document.getElementById("weeklyTip");n&&(n.textContent=e.streakWeeks>0?`🔥 连续 ${e.streakWeeks} 周`:""),i&&(i.textContent=e.message)}window.showDrawdownModal=Ve;function Ve(){if(!a)return;const t=k(a),e=_(a),n=Qt(e,t.price),i=Zt(a),o=M("📉 成长回撤复盘","复盘是为了觉察，不是自责");o.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">${n.inDrawdown?"📉":"📈"}</div>
        <div style="font-size:22px;font-weight:bold;margin-top:8px;">${n.inDrawdown?"阶段性回撤":"稳健成长"}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">历史峰值</div><div class="metric-value">${Math.round(n.peak)}</div></div>
        <div class="metric"><div class="metric-label">当前指数</div><div class="metric-value">${Math.round(n.current)}</div></div>
        <div class="metric"><div class="metric-label">回撤幅度</div><div class="metric-value" style="color:${n.inDrawdown?"var(--accent-orange)":"var(--accent-green)"}">${n.drawdownPct}%</div></div>
        <div class="metric"><div class="metric-label">距峰值</div><div class="metric-value">${n.peakDaysAgo} 天</div></div>
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;margin-bottom:20px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 复盘建议</div>
        ${n.suggestions.map(s=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${s}</div>`).join("")}
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">🤔 自问</div>
        ${i.map(s=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${s}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">回撤是成长的正常阶段，不必焦虑，重在觉察与调整</div>
  `}window.showGoalModal=Je;function Je(){if(!a)return;const t=k(a),e=M("🏁 目标反推","设定目标，反推所需投入");e.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">🏁</div>
        <div style="font-size:22px;font-weight:bold;margin-top:8px;">目标反推</div>
        <div style="font-size:13px;color:var(--text-muted);margin-top:4px;">当前指数 ${Math.round(t.price)}，设定目标看看需要多少投入</div>
      </div>
      <div style="margin-bottom:16px;">
        <label style="font-size:13px;color:var(--text-secondary);">目标人生指数</label>
        <input type="number" id="goalTarget" value="${Math.round(t.price*1.5)}" style="width:100%;padding:12px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text-primary);margin-top:6px;font-size:18px;">
      </div>
      <button class="btn-primary" onclick="calcGoal()" style="width:100%;padding:14px;font-size:16px;">反推所需投入</button>
      <div id="goalResult"></div>
  `}window.calcGoal=Xe;function Xe(){if(!a)return;const t=Number(document.getElementById("goalTarget").value);if(!t||t<=0){S("请输入有效目标");return}const e=te(a,t),n=document.getElementById("goalResult");n.innerHTML=`
    <div style="margin-top:20px;background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
        <div class="metric"><div class="metric-label">目标指数</div><div class="metric-value">${e.target}</div></div>
        <div class="metric"><div class="metric-label">当前指数</div><div class="metric-value">${e.current}</div></div>
        <div class="metric"><div class="metric-label">还差</div><div class="metric-value" style="color:var(--accent-blue);">${e.gap} 点</div></div>
        <div class="metric"><div class="metric-label">还需投入</div><div class="metric-value">约 ¥${e.additionalInvest}</div></div>
      </div>
      <div style="font-size:14px;color:var(--text-secondary);line-height:1.8;">
        ${e.suggestions.map(i=>`<div>• ${i}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">${e.confidence}</div>
    </div>
  `}window.showReportModal=Ke;function Ke(){if(!a)return;const t=_(a),e=yt(a,t),n=e.avgMood===null?"暂无":e.avgMood>=3.5?"😄 很好":e.avgMood>=2.5?"🙂 不错":e.avgMood>=1.5?"😐 一般":"😔 偏低",i=M("📊 月度成长报告",e.month+" 月报");i.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">📊</div>
        <div style="font-size:22px;font-weight:bold;margin-top:8px;">${e.month} 成长月报</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">月内变化</div><div class="metric-value" style="color:${e.changePoints>=0?"var(--accent-green)":"var(--accent-orange)"}">${e.changePoints>=0?"+":""}${e.changePoints}</div></div>
        <div class="metric"><div class="metric-label">投入笔数</div><div class="metric-value">${e.investCount}</div></div>
        <div class="metric"><div class="metric-label">记录天数</div><div class="metric-value">${e.journalDays}</div></div>
        <div class="metric"><div class="metric-label">投入金额</div><div class="metric-value">¥${e.investAmount}</div></div>
        <div class="metric"><div class="metric-label">月初指数</div><div class="metric-value">${e.startPrice}</div></div>
        <div class="metric"><div class="metric-label">月末指数</div><div class="metric-value">${e.endPrice}</div></div>
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;">⭐ 本月亮点</div>
        ${e.highlights.length>0?e.highlights.map(o=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${o}</div>`).join(""):'<div style="font-size:13px;color:var(--text-muted);">继续积累，下个月会更好</div>'}
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">📌 下月建议</div>
        ${e.suggestions.map(o=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${o}</div>`).join("")}
      </div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:16px;text-align:center;">平均情绪：${n} · 报告仅基于你的记录生成，不代表客观评价</div>
  `}window.showRadarModal=Qe;function Qe(){if(!a)return;const t=V(a),e={education:"#5e6fff",skill:"#9d6fff",health:"#4ade80",network:"#fbbf24",entertainment:"#f87171",other:"#94a3b8"},n='<canvas id="radarCanvas" width="300" height="300" style="display:block;margin:0 auto;"></canvas>',i=M("🎯 投入结构雷达","看看你的成长资本分布是否均衡");i.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:16px;">${n}</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:16px;">
        ${t.dimensions.map(o=>`<div style="font-size:12px;color:var(--text-secondary);"><span style="color:${e[o.type]}">●</span> ${o.label.split(" ")[1]}: ¥${o.amount.toLocaleString()}</div>`).join("")}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
        <div class="metric"><div class="metric-label">均衡度</div><div class="metric-value">${Math.round(t.balance*100)}%</div></div>
        <div class="metric"><div class="metric-label">最突出</div><div class="metric-value">${t.dimensions.find(o=>o.type===t.dominant)?.label.split(" ")[1]}</div></div>
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 结构建议</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">
          ${t.balance>=.6?"投入结构较均衡，继续保持多维发展。":`${t.dimensions.find(o=>o.type===t.weakest)?.label}维度投入较少，可适当增加。`}
          健康是一切成长的底座，建议保持健康维度的持续投入。
        </div>
      </div>
  `,setTimeout(()=>Ze(t),50)}function Ze(t,e){const n=document.getElementById("radarCanvas");if(!n)return;const i=n.getContext("2d"),o=150,s=150,l=110;i.clearRect(0,0,300,300);const r=t.dimensions,p=r.length;for(let d=1;d<=4;d++){i.beginPath();for(let c=0;c<p;c++){const u=Math.PI*2*c/p-Math.PI/2,g=l*d/4,v=o+g*Math.cos(u),h=s+g*Math.sin(u);c===0?i.moveTo(v,h):i.lineTo(v,h)}i.closePath(),i.strokeStyle="rgba(255,255,255,0.1)",i.stroke()}for(let d=0;d<p;d++){const c=Math.PI*2*d/p-Math.PI/2;i.beginPath(),i.moveTo(o,s),i.lineTo(o+l*Math.cos(c),s+l*Math.sin(c)),i.strokeStyle="rgba(255,255,255,0.15)",i.stroke()}i.beginPath();for(let d=0;d<p;d++){const c=Math.PI*2*d/p-Math.PI/2,u=r[d].value/100,g=o+l*u*Math.cos(c),v=s+l*u*Math.sin(c);d===0?i.moveTo(g,v):i.lineTo(g,v)}i.closePath(),i.fillStyle="rgba(94,111,255,0.3)",i.fill(),i.strokeStyle="#5e6fff",i.lineWidth=2,i.stroke(),i.fillStyle="rgba(255,255,255,0.7)",i.font="12px sans-serif",i.textAlign="center";for(let d=0;d<p;d++){const c=Math.PI*2*d/p-Math.PI/2,u=o+(l+20)*Math.cos(c),g=s+(l+20)*Math.sin(c);i.fillText(r[d].label.split(" ")[1],u,g+4)}}window.showDepreciationModal=tn;function tn(){if(!a)return;const t=k(a),e=Math.round(a.annualIncome*.1/12),n=ne(a,10,e),i=M("📉 折旧预测","看看你的成长资本随时间如何变化");i.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:16px;">
        <div style="font-size:14px;color:var(--text-muted);">假设每年新增投入约 ¥${e.toLocaleString()}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">当前 BV</div><div class="metric-value">${Math.round(t.bv)}</div></div>
        <div class="metric"><div class="metric-label">5 年后</div><div class="metric-value" style="color:${n.bv5y>=t.bv?"var(--accent-green)":"var(--accent-orange)"}">${n.bv5y}</div></div>
        <div class="metric"><div class="metric-label">10 年后</div><div class="metric-value" style="color:${n.bv10y>=t.bv?"var(--accent-green)":"var(--accent-orange)"}">${n.bv10y}</div></div>
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;">📈 10 年趋势</div>
        ${n.points.map(o=>`<div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary);line-height:1.8;"><span>${o.age} 岁</span><span>BV ${o.bv}（折旧 -${o.depreciation}，新增 +${o.newInvest}）</span></div>`).join("")}
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 建议</div>
        ${n.suggestions.map(o=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${o}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">年折旧率约 ${n.annualDecayRate*100}%，仅作趋势参考</div>
  `}window.showScenarioModal=en;function en(){if(!a)return;const t=oe(a),e=M("🎲 情景模拟","不同节奏下，你的指数会怎样");e.querySelector(".modal-body").innerHTML=`
      ${t.map(n=>`
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:12px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <span style="font-size:24px;">${n.icon}</span>
            <div>
              <div style="font-weight:600;">${n.label}</div>
              <div style="font-size:12px;color:var(--text-muted);">${n.desc}</div>
            </div>
            <div style="margin-left:auto;text-align:right;">
              <div style="font-size:22px;font-weight:bold;color:${n.changePct>=0?"var(--accent-green)":"var(--accent-orange)"}">${n.price}</div>
              <div style="font-size:12px;color:${n.changePct>=0?"var(--accent-green)":"var(--accent-orange)"}">${n.changePct>=0?"+":""}${n.changePct}%</div>
            </div>
          </div>
          <div style="font-size:12px;color:var(--text-muted);">学习 ${n.params.studyHours}h/周 · 健康 ${n.params.healthScore} · 收入增长 ${Math.round(n.params.incomeGrowth*100)}% · 负债 ${Math.round(n.params.debtRatio*100)}%</div>
        </div>
      `).join("")}
      <div style="font-size:11px;color:var(--text-muted);text-align:center;">情景为参数调整后的模拟结果，不代表预测承诺</div>
  `}window.showFamilyModal=nn;function nn(){if(!a)return;const t=ie(a),e=M("👨‍👩‍👧 家庭账本","记录家庭/父母的支持，看见成长背后的力量");e.querySelector(".modal-body").innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">累计家庭支持</div><div class="metric-value">¥${t.totalSupport.toLocaleString()}</div></div>
        <div class="metric"><div class="metric-label">占总资本比</div><div class="metric-value">${Math.round(t.supportRatio*100)}%</div></div>
      </div>
      <div style="margin-bottom:16px;">
        <label style="font-size:13px;color:var(--text-secondary);">家庭支持资本（万元）</label>
        <input type="number" id="familySupportInput" value="${t.totalSupport}" style="width:100%;padding:10px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text-primary);margin-top:6px;">
      </div>
      <button class="btn-primary" onclick="saveFamilySupport()" style="width:100%;padding:12px;">保存</button>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;margin-top:16px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 说明</div>
        ${t.suggestions.map(n=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${n}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">家庭支持资本不折旧、不乘权重，单独计入成长资本，不参与主观调整</div>
  `}window.saveFamilySupport=on;function on(){if(!a)return;const t=Number(document.getElementById("familySupportInput").value)||0;a.familySupportCapital=t,A(a),P(),S("✅ 家庭支持资本已更新"),R()}window.showAIWeeklyModal=an;function an(){if(!a)return;const t=ae(a),e=M("🤖 AI 周报","基于你的记录自动生成（本地运算，不上传数据）");e.querySelector(".modal-body").innerHTML=`
      <div style="background:linear-gradient(135deg,rgba(94,111,255,0.15),rgba(168,85,247,0.15));border-radius:12px;padding:16px;margin-bottom:16px;">
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">${t.week}</div>
        <div style="font-size:16px;font-weight:600;line-height:1.6;">${t.summary}</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:8px;">${t.moodNote}</div>
      </div>
      ${t.highlights.length>0?`<div style="background:rgba(74,222,128,0.08);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;color:var(--accent-green);">⭐ 本周亮点</div>
        ${t.highlights.map(n=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${n}</div>`).join("")}
      </div>`:""}
      ${t.improvements.length>0?`<div style="background:rgba(251,191,36,0.08);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;color:var(--accent-yellow);">🔍 待改进</div>
        ${t.improvements.map(n=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${n}</div>`).join("")}
      </div>`:""}
      <div style="background:rgba(94,111,255,0.08);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;color:var(--accent-blue);">🎯 下周行动</div>
        ${t.actions.map(n=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${n}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">周报由规则引擎在本地生成，不调用任何外部 AI 服务，不上传你的数据</div>
  `}window.showAnnualModal=sn;function sn(){if(!a)return;const t=_(a),e=se(a,t),n=e.avgMood===null?"暂无":e.avgMood>=3.5?"😄 很好":e.avgMood>=2.5?"🙂 不错":e.avgMood>=1.5?"😐 一般":"😔 偏低",i=M("🎊 年度报告",`${e.year} 年成长总结`);i.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">🎊</div>
        <div style="font-size:24px;font-weight:bold;margin-top:8px;">${e.year} 年报</div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:20px;">
        ${e.keywords.map(o=>`<span style="padding:6px 14px;border-radius:20px;background:rgba(94,111,255,0.15);font-size:13px;">${o}</span>`).join("")}
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:16px;text-align:center;">
        <div style="font-size:14px;color:var(--text-muted);">年度指数变化</div>
        <div style="font-size:32px;font-weight:bold;color:${e.changePoints>=0?"var(--accent-green)":"var(--accent-orange)"}">${e.changePoints>=0?"+":""}${e.changePoints}</div>
        <div style="font-size:13px;color:var(--text-muted);">${e.startPrice} → ${e.endPrice}（${e.changePct>=0?"+":""}${e.changePct}%）</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
        <div class="metric"><div class="metric-label">年度投入</div><div class="metric-value">¥${e.totalInvest.toLocaleString()}</div></div>
        <div class="metric"><div class="metric-label">投入笔数</div><div class="metric-value">${e.investCount}</div></div>
        <div class="metric"><div class="metric-label">里程碑</div><div class="metric-value">${e.milestoneCount}</div></div>
        <div class="metric"><div class="metric-label">记录天数</div><div class="metric-value">${e.journalDays}</div></div>
        <div class="metric"><div class="metric-label">平均情绪</div><div class="metric-value" style="font-size:16px;">${n}</div></div>
        <div class="metric"><div class="metric-label">均衡度</div><div class="metric-value">${e.milestoneCount>0?"良好":"—"}</div></div>
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;">📖 年度总结</div>
        <div style="font-size:14px;color:var(--text-secondary);line-height:1.8;">${e.summary}</div>
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">🌱 下年度方向</div>
        ${e.nextYearPlan.map(o=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${o}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">年报基于你的记录生成，是回顾也是鼓励，不是评价</div>
  `}window.showPeerModal=rn;function rn(){if(!a)return;const t=k(a),e=mt(a),n=t.bv,i=n-e,o=e>0?Math.round(i/e*100):0,s=M("👥 同路人","看看相似背景的成长者们大致在哪里（匿名统计锚点）");s.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">👥</div>
        <div style="font-size:18px;font-weight:600;margin-top:8px;">你不是一个人在成长</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">你的成长资本</div><div class="metric-value">${Math.round(n)}</div></div>
        <div class="metric"><div class="metric-label">同类锚点（估算）</div><div class="metric-value">${Math.round(e)}</div></div>
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:16px;text-align:center;">
        <div style="font-size:14px;color:var(--text-muted);">相对同类锚点</div>
        <div style="font-size:28px;font-weight:bold;color:${i>=0?"var(--accent-green)":"var(--accent-orange)"};margin-top:6px;">${i>=0?"+":""}${o}%</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:6px;">${i>=0?"你走在多数人前面，继续保持":"还有追赶空间，但成长没有终点"}</div>
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 关于对比</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">
          这个锚点是基于相似年龄、城市、学历的统计估算，仅作参考。每个人的成长节奏不同，<br>
          与昨天的自己比较，比与他人比较更有意义。
        </div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">锚点数据为估算值，不构成任何评价或排名</div>
  `}window.showChallengeModal=ln;function ln(){if(!a)return;const t=nt(a),e=re(a),n=M("🎯 成长挑战","完成挑战，见证坚持的力量");n.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">🎯</div>
        <div style="font-size:22px;font-weight:bold;margin-top:8px;">挑战完成度 ${e}%</div>
      </div>
      ${t.map(i=>`
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;margin-bottom:10px;${i.done?"border:1px solid var(--accent-green);":""}">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <span style="font-size:22px;">${i.icon}</span>
            <div style="flex:1;">
              <div style="font-weight:600;">${i.name} ${i.done?'<span style="color:var(--accent-green);">✓ 已完成</span>':""}</div>
              <div style="font-size:12px;color:var(--text-muted);">${i.desc}</div>
            </div>
            <div style="font-size:14px;font-weight:bold;color:${i.done?"var(--accent-green)":"var(--accent-blue)"};">${i.progress}/${i.target} ${i.unit}</div>
          </div>
          <div style="height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
            <div style="height:100%;width:${Math.round(i.progress/i.target*100)}%;background:${i.done?"var(--accent-green)":"linear-gradient(90deg,#5e6fff,#a855f7)"};border-radius:3px;transition:width 0.5s;"></div>
          </div>
        </div>
      `).join("")}
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">挑战数据基于你的本地记录，完成后自动更新</div>
  `}window.showMentorModal=dn;function dn(){if(!a)return;const t=le(a),e=M("🧙 虚拟导师",t.persona);e.querySelector(".modal-body").innerHTML=`
      <div style="background:linear-gradient(135deg,rgba(94,111,255,0.12),rgba(168,85,247,0.12));border-radius:12px;padding:16px;margin-bottom:16px;">
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:6px;">${t.greeting}</div>
      </div>
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;">👁️ 我观察到</div>
        ${t.observations.map(n=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${n}</div>`).join("")}
      </div>
      <div style="background:rgba(94,111,255,0.08);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;color:var(--accent-blue);">💡 我的建议</div>
        ${t.advices.map(n=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${n}</div>`).join("")}
      </div>
      <div style="background:rgba(74,222,128,0.08);border-radius:12px;padding:14px;text-align:center;">
        <div style="font-size:14px;color:var(--accent-green);font-style:italic;line-height:1.6;">${t.encouragement}</div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">导师建议由规则引擎生成，仅供参考，最终决定权在你手中</div>
  `}let W="terms";window.showMicroModal=Et;function Et(){if(!a)return;const e=M("📚 微课","学习成长术语，理解你的指数").querySelector(".modal-body"),n=()=>`
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${de.map(o=>`
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;cursor:pointer;" onclick="this.querySelector('.term-detail').style.display=this.querySelector('.term-detail').style.display==='none'?'block':'none'">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:22px;">${o.icon}</span>
            <div style="flex:1;">
              <div style="font-weight:600;">${o.term} <span style="font-size:11px;color:var(--text-muted);font-weight:normal;">[${o.category}]</span></div>
              <div style="font-size:12px;color:var(--text-muted);">${o.short}</div>
            </div>
            <span style="font-size:12px;color:var(--text-muted);">▼</span>
          </div>
          <div class="term-detail" style="display:none;margin-top:10px;font-size:13px;color:var(--text-secondary);line-height:1.7;border-top:1px solid var(--border);padding-top:10px;">${o.detail}</div>
        </div>
      `).join("")}
    </div>
  `,i=()=>`
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${ce.map(o=>`
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px;">
          <div style="font-weight:600;margin-bottom:4px;">${o.stage} <span style="font-size:12px;color:var(--text-muted);font-weight:normal;">${o.ageRange}</span></div>
          <div style="font-size:13px;color:var(--accent-blue);margin-bottom:8px;">重心：${o.focus}</div>
          ${o.tips.map(s=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.7;">• ${s}</div>`).join("")}
        </div>
      `).join("")}
    </div>
  `;e.innerHTML=`
    <div style="display:flex;gap:8px;margin-bottom:16px;">
      <button class="btn-primary" onclick="switchMicroTab('terms')" id="tab-terms" style="flex:1;${W==="terms"?"":"opacity:0.6;"}">📖 术语卡</button>
      <button class="btn-primary" onclick="switchMicroTab('stages')" id="tab-stages" style="flex:1;${W==="stages"?"":"opacity:0.6;"}">🧭 阶段指南</button>
    </div>
    <div id="microContent">${W==="terms"?n():i()}</div>
  `}window.switchMicroTab=cn;function cn(t){W=t,Et()}let B=0;window.showGratitudeModal=at;function at(){if(!a)return;const t=bt(a,B),e=Y(),n=M("💌 感恩卡片","亲子连接 · 表达感谢");n.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:16px;">
        <div style="font-size:48px;">💌</div>
      </div>
      <div style="background:linear-gradient(135deg,rgba(251,191,36,0.1),rgba(248,113,113,0.1));border-radius:16px;padding:24px;margin-bottom:16px;border:1px solid rgba(251,191,36,0.2);">
        <div style="font-size:18px;font-weight:bold;margin-bottom:16px;text-align:center;color:var(--accent-yellow);">${t.title}</div>
        <div style="font-size:15px;line-height:2;color:var(--text-secondary);text-align:center;">${t.content}</div>
        <div style="font-size:13px;color:var(--text-muted);text-align:right;margin-top:20px;">${t.signature}</div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:12px;">
        <button class="btn-primary" onclick="prevGratitude()" style="flex:1;opacity:0.8;">← 上一张</button>
        <button class="btn-primary" onclick="nextGratitude()" style="flex:1;opacity:0.8;">下一张 →</button>
      </div>
      <button class="btn-primary" onclick="copyGratitude()" style="width:100%;padding:12px;">📋 复制卡片内容</button>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">第 ${B+1}/${e} 张 · 卡片内容可自由编辑后发送给家人</div>
  `}window.nextGratitude=pn;function pn(){a&&(B=(B+1)%Y(),at())}window.prevGratitude=un;function un(){a&&(B=(B-1+Y())%Y(),at())}window.copyGratitude=vn;function vn(){if(!a)return;const t=bt(a,B),e=`${t.title}

${t.content}

${t.signature}`;navigator.clipboard.writeText(e).then(()=>{S("✅ 已复制，可粘贴发给家人")}).catch(()=>{S("复制失败，请手动选择文本")})}window.showExportReportModal=gn;function gn(){if(!a)return;const t=_(a),e=ot(a,t),n=M("📄 导出成长报告","生成纯文本报告，可保存或分享");n.querySelector(".modal-body").innerHTML=`
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:16px;max-height:400px;overflow-y:auto;">
        <pre style="font-family:monospace;font-size:12px;line-height:1.6;white-space:pre-wrap;color:var(--text-secondary);">${e}</pre>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn-primary" onclick="copyReport()" style="flex:1;padding:12px;">📋 复制文本</button>
        <button class="btn-primary" onclick="downloadReport()" style="flex:1;padding:12px;">⬇️ 下载 .txt</button>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">报告内容均来自你的本地数据，不包含任何个人身份信息</div>
  `}window.copyReport=mn;function mn(){if(!a)return;const t=_(a),e=ot(a,t);navigator.clipboard.writeText(e).then(()=>S("✅ 报告已复制")).catch(()=>S("复制失败"))}window.downloadReport=hn;function hn(){if(!a)return;const t=_(a),e=ot(a,t),n=new Blob([e],{type:"text/plain;charset=utf-8"}),i=URL.createObjectURL(n),o=document.createElement("a");o.href=i,o.download=`成长报告_${new Date().toISOString().slice(0,10)}.txt`,o.click(),URL.revokeObjectURL(i),S("✅ 报告已下载")}qe();
