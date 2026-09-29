(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function n(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(a){if(a.ep)return;a.ep=!0;const i=n(a);fetch(a.href,i)}})();const Pe="1.3",Ut=200,Jt=.65,Xt=1.5,Qt=.6,Zt=1.3,en=.3,M={BASE_INDEX:100,TYPE_WEIGHTS:{education:1.5,skill:1.3,health:1.1,network:1,entertainment:.5,other:.5},TYPE_HALF_LIFE:{education:1/0,skill:5,health:4,network:3,entertainment:1,other:2},REGION_COEF:{tier1:1.8,new_tier1:1.4,tier2:1.1,tier3:.8},AREA_COEF:{urban:1,rural:.68},INCOME_COEF:{low:.35,below_avg:.65,avg:1,above_avg:1.55,high:2.9},STAGE_COEF:[{age:0,coef:.2},{age:6,coef:.3},{age:12,coef:.5},{age:18,coef:.9},{age:25,coef:1.1},{age:35,coef:1.5},{age:50,coef:1.3},{age:65,coef:1},{age:80,coef:.8}],AGE_SPEND:{"0-2":24538,"3-5":36538,"6-14":27007,"15-17":29007,"18-22":29135},AGE_SPEND_RANGE:{"0-2":{low:18e3,mid:24538,high:35e3},"3-5":{low:25e3,mid:36538,high:52e3},"6-14":{low:18e3,mid:27007,high:4e4},"15-17":{low:2e4,mid:29007,high:42e3},"18-22":{low:18e3,mid:29135,high:45e3}}},tn={education_cost:{name:"育娲人口研究《中国生育成本报告》",year:"2022",caliber:"全国家庭 0-17 岁子女年均教育/养育投入"}},q=[{id:"birth",name:"出生",icon:"👶",desc:"人生起点",bonus:20,condition:e=>e.age>=0},{id:"school",name:"小学入学",icon:"🎒",desc:"基础教育开始",bonus:10,condition:e=>e.age>=6},{id:"middle",name:"初中毕业",icon:"📖",desc:"义务教育完成",bonus:15,condition:e=>e.age>=15},{id:"highschool",name:"高中毕业",icon:"🎓",desc:"成年预备",bonus:20,condition:e=>e.age>=18},{id:"college",name:"大学毕业",icon:"🎓",desc:"步入社会",bonus:30,condition:e=>e.age>=22},{id:"firstjob",name:"第一份工作",icon:"💼",desc:"独立起步",bonus:30,condition:e=>e.hasJob},{id:"firstraise",name:"第一次涨薪",icon:"💰",desc:"成长被认可",bonus:15,condition:e=>e.salaryRaised},{id:"license",name:"拿到驾照",icon:"🚗",desc:"技能+1",bonus:5,condition:e=>e.hasLicense},{id:"marathon",name:"跑完马拉松",icon:"🏃",desc:"健康资产",bonus:8,condition:e=>e.marathon},{id:"marriage",name:"结婚",icon:"💍",desc:"人生伙伴",bonus:20,condition:e=>e.married},{id:"home",name:"买房",icon:"🏠",desc:"安定居所",bonus:25,condition:e=>e.hasHouse},{id:"child",name:"为人父母",icon:"👶",desc:"新的责任",bonus:15,condition:e=>e.hasChild},{id:"30",name:"三十而立",icon:"🎯",desc:"人生分水岭",bonus:25,condition:e=>e.age>=30},{id:"100k",name:"十万投入",icon:"💎",desc:"累计投入超10万",bonus:15,condition:e=>e.totalInvest>=1e5},{id:"500k",name:"五十万投入",icon:"👑",desc:"累计投入超50万",bonus:30,condition:e=>e.totalInvest>=5e5}],pt=.5,vt=1.5,nn=1;function mt(e,t,n){return Math.max(t,Math.min(n,e))}function on(e){return e.subjectiveWeight===void 0||e.subjectiveWeight===null?nn:mt(e.subjectiveWeight,pt,vt)}function an(e){return mt(e,pt,vt)}function re(e,t,n){return Math.max(t,Math.min(n,e))}function De(e){const t=e.history?.length||0,n=(e.history||[]).filter(m=>m.source==="survey").length,o=e.investments?.length||0,a=t+o,i=t-n,r=n+o,l=a>0?i/a:1;let d;const c=a>0?r/a:0;c>=.5?d="high":c>=.2?d="medium":d="low";const u={high:"高置信",medium:"中置信",low:"低置信"},v=a>0?Math.max(0,i-16)/Math.max(1,a):.5;return{level:d,estimatedRatio:Math.round(l*100)/100,manualCount:o,surveyCount:n,estimatedCount:i,label:u[d],potentialEstimatedRatio:Math.round(v*100)/100}}function Ie(e,t,n){if(n==="education")return e;const o=M.TYPE_HALF_LIFE[n]||5;return isFinite(o)?e*Math.exp(-.693*t/o):e}function Le(e){const t=M.STAGE_COEF;if(e<=t[0].age)return t[0].coef;for(let n=0;n<t.length-1;n++)if(e>=t[n].age&&e<=t[n+1].age){const o=(e-t[n].age)/(t[n+1].age-t[n].age);return t[n].coef+o*(t[n+1].coef-t[n].coef)}return t[t.length-1].coef}function sn(e){const t=re((e.annualIncomeGrowth||0)*2,-.35,.35),n=re(((e.studyHours||0)-5)/20,-.15,.15);return re(1+t+n,Jt,Xt)}function rn(e){return re(.6+e/100*.7,Qt,Zt)}function ln(e){return re((e.debtRatio||0)*.3,0,en)}function gt(e,t=new Date){let n=0;return e.history.forEach(o=>{const a=e.age-o.age,i=M.TYPE_WEIGHTS[o.type]||1;n+=o.invest/1e4*i*Ie(1,Math.max(0,a),o.type)}),e.investments.forEach(o=>{const a=(t.getTime()-o.date.getTime())/315576e5,i=M.TYPE_WEIGHTS[o.type]||1;n+=o.amount/1e4*i*Ie(1,Math.max(0,a),o.type)}),e.familySupportCapital&&(n+=e.familySupportCapital),n}function T(e,t=new Date){const n=gt(e,t),o=Le(e.age),a=q.filter(k=>k.condition(e)).reduce((k,H)=>k+H.bonus,0),i=Math.min(Ut,a),r=(e.annualIncome||0)/1e4,l=n>0?Math.min(1e3,r/(n+1)*100):0,c=e.investments.filter(k=>(t.getTime()-k.date.getTime())/315576e5<2&&["education","skill","health"].includes(k.type)).length>0?1:Math.max(.65,1-(e.age-22)*.012);let u=e.healthScore||50;const v=e.investments.filter(k=>(t.getTime()-k.date.getTime())/315576e5<2&&k.type==="health");e.age>30&&v.length===0&&(u=Math.max(20,u-(e.age-30)*1.5));const p=sn(e)*c,f=rn(u),g=ln(e),y=on(e),b=(M.BASE_INDEX+n*o+i)*p*f*(1-g)*y,I=(b-M.BASE_INDEX)/M.BASE_INDEX*100,A=r>0?Math.round(b/r*10)/10+"倍":"—";return{price:Math.round(b*10)/10,change:Math.round(I*10)/10,bv:Math.round(n*10)/10,eps:Math.round(r*100)/100,roe:Math.round(l*10)/10,pe:A,milestoneBonus:i,growthCoef:Math.round(p*100)/100,qualityCoef:Math.round(f*100)/100,stagnationPenalty:Math.round(c*100)/100,effectiveHealth:Math.round(u),riskDiscount:Math.round(g*100)/100,subjectiveAdjust:Math.round(y*100)/100}}function cn(e){const t=M.REGION_COEF[e.region]*M.AREA_COEF[e.area]*M.INCOME_COEF[e.income],n=[];for(let o=0;o<=e.age;o++){let a;o<=2?a=M.AGE_SPEND["0-2"]:o<=5?a=M.AGE_SPEND["3-5"]:o<=14?a=M.AGE_SPEND["6-14"]:o<=17?a=M.AGE_SPEND["15-17"]:a=M.AGE_SPEND["18-22"],a=a*t*(.9+Math.random()*.2),n.push({age:o,invest:a,type:"education",source:"estimated"})}if(e.anchor){const o=e.anchor.age;n[o]&&(n[o].invest=e.anchor.amount)}return n}const dn=[{name:"学前/幼儿园",startAge:3,endAge:5},{name:"小学",startAge:6,endAge:11},{name:"初中",startAge:12,endAge:14},{name:"高中/中职",startAge:15,endAge:17},{name:"大学/大专",startAge:18,endAge:21},{name:"研究生",startAge:22,endAge:24}],un={primary:1,junior:2,senior:3,college:4,bachelor:4,master:5};function ft(e){const t=un[e.education]??2;return dn.map((n,o)=>{const a=Math.min(n.endAge,e.age);return{name:n.name,startAge:n.startAge,endAge:a,totalCost:0,enrolled:o<=t&&n.startAge<=e.age}}).filter(n=>n.startAge<=e.age)}function O(e,t,n){const o=Number(e);if(!(!isFinite(o)||Number.isNaN(o)))return Math.max(t,Math.min(n,o))}function yt(e,t,n=new Date){const o=De(e);let a=(e.history||[]).filter(p=>p.source!=="survey");const i=new Set,r=(t.eduStages||[]).filter(p=>p&&p.totalCost>0&&p.endAge>=p.startAge&&p.startAge>=0&&p.endAge<=e.age);for(const p of r){const f=p.endAge-p.startAge+1,g=Math.round(p.totalCost/f*100)/100;for(let y=p.startAge;y<=p.endAge;y++)i.add(y);for(let y=p.startAge;y<=p.endAge;y++)a.push({age:y,invest:g,type:"education",source:"survey",desc:p.name})}i.size>0&&(a=a.filter(p=>!(p.source==="estimated"&&p.type==="education"&&i.has(p.age))));for(const p of t.bigInvests||[]){if(!p||p.age<0||p.age>e.age)continue;const f=Math.max(0,Number(p.amount)||0);a.push({age:p.age,invest:f,type:p.type,source:"survey",desc:p.desc?.trim()||void 0})}a.sort((p,f)=>p.age-f.age||(p.type<f.type?-1:1));const l={...e,history:a},d=O(t.studyHours,0,40);d!==void 0&&(l.studyHours=d);const c=O(t.healthScore,0,100);c!==void 0&&(l.healthScore=c);const u=O(t.familySupportCapital,0,1e5);u!==void 0&&(l.familySupportCapital=u);const v=t.career;if(v){const p=O(v.workStartAge,0,e.age),f=O(v.startingSalary,0,1e8),g=O(v.avgRaisePct,-10,50),y=O(v.currentSalary,0,1e8);l.enhancedSurvey={...l.enhancedSurvey||{},completedAt:l.enhancedSurvey?.completedAt||n,career:{workStartAge:p??void 0,startingSalary:f??void 0,avgRaisePct:g??void 0,currentSalary:y??void 0}},g!==void 0&&(l.annualIncomeGrowth=Math.round(g*100)/1e4),y!==void 0&&y>0&&(l.annualIncome=y)}if(t.setbacks&&t.setbacks.length>0){const p=new Set((l.setbacks||[]).map(g=>`${g.date.getFullYear()-l.birthYear}:${g.type}`)),f=l.setbacks?[...l.setbacks]:[];for(const g of t.setbacks){const y=O(g.age,0,l.age);if(y===void 0)continue;const b=O(g.severity,1,10)??5,I=`${y}:${g.type}`;p.has(I)||(p.add(I),f.push({date:new Date(l.birthYear+y,5,1),type:g.type,severity:b}))}l.setbacks=f}const m=l.enhancedSurvey?.career;return l.enhancedSurvey={eduStages:r,bigInvests:(t.bigInvests||[]).filter(p=>p&&p.age>=0&&p.age<=e.age),career:m,studyHours:d??l.enhancedSurvey?.studyHours,healthScore:c??l.enhancedSurvey?.healthScore,familySupportCapital:u??l.enhancedSurvey?.familySupportCapital,setbacks:(t.setbacks||[]).filter(p=>p&&p.age>=0&&p.age<=e.age),completedAt:n},{user:l,before:o,after:De(l),coverage:bt(l)}}function ht(e){const t=new Set;return(e.history||[]).forEach(n=>{n.source==="survey"&&t.add(n.age)}),(e.investments||[]).forEach(n=>{const o=n.date.getFullYear()-e.birthYear;o>=0&&o<=e.age&&t.add(o)}),t}function bt(e){const t=e.age+1,n=ht(e).size;return{verifiedYears:n,totalYears:t,ratio:t>0?Math.round(n/t*100)/100:0}}function pn(e,t){const n=e.enhancedSurvey?.career;if(n&&n.workStartAge!=null&&(n.startingSalary??0)>0){if(t<n.workStartAge)return 0;const o=Math.max(-.1,Math.min(.5,(n.avgRaisePct??5)/100)),a=n.startingSalary*Math.pow(1+o,t-n.workStartAge),i=e.annualIncome>0?e.annualIncome*1.1:1/0;return Math.round(Math.min(a,i))}return e.annualIncome||0}function vn(e,t){const n=e.enhancedSurvey?.career;return n&&n.workStartAge!=null&&t<n.workStartAge?0:e.annualIncomeGrowth||0}function mn(e,t){let n=0;return(e.setbacks||[]).forEach(o=>{o.date.getFullYear()-e.birthYear===t&&(n=Math.max(n,o.severity))}),n}function gn(e){const t=Math.sin(e*127.1+311.7)*43758.5453;return t-Math.floor(t)}function J(e){const t=[],n=ht(e);let o=0;for(let a=0;a<=e.age;a++){let r=e.history.filter(b=>b.age===a).reduce((b,I)=>b+I.invest,0);const l=e.investments.filter(b=>Math.floor((b.date.getTime()-new Date(e.birthYear+a,0,1).getTime())/315576e5)===a);r+=l.reduce((b,I)=>b+I.amount,0),o+=r;const d={...e,age:a,annualIncome:pn(e,a),annualIncomeGrowth:vn(e,a),history:e.history.filter(b=>b.age<=a),investments:l},c=T(d),u=n.has(a),m=a===e.age?0:u?.035:.08,p=1+(gn(a+1)-.5)*2*m,f=mn(e,a),g=f>0?1-f/10*.15:1,y=c.price*p*g;t.push({age:a,price:Math.round(y*10)/10,invest:r,total:o,verified:u,setback:f>0})}return t}function xt(e){const t={primary:.5,junior:.8,senior:1,college:1.2,bachelor:1.3,master:1.5},n={age:e.age,region:e.region,area:e.area,income:"avg",education:e.education,birthYear:e.birthYear,annualIncome:8e4*(t[e.education]||1),annualIncomeGrowth:.05,studyHours:2,healthScore:65,debtRatio:.05,hasJob:e.age>=22,salaryRaised:e.age>=25,hasLicense:e.age>=20,marathon:!1,married:e.age>=28,hasHouse:e.age>=30,hasChild:e.age>=32,totalInvest:0,history:fn(e),investments:[]};return T(n).price}function fn(e){const t=M.REGION_COEF[e.region]*M.AREA_COEF[e.area]*M.INCOME_COEF.avg,n=[];for(let o=0;o<=e.age;o++){let a;o<=2?a=M.AGE_SPEND["0-2"]:o<=5?a=M.AGE_SPEND["3-5"]:o<=14?a=M.AGE_SPEND["6-14"]:o<=17?a=M.AGE_SPEND["15-17"]:a=M.AGE_SPEND["18-22"],a=a*t,n.push({age:o,invest:a,type:"education"})}return n}function wt(e,t){let n={...e};return(!t||t<"1.2")&&n.familySupportCapital===void 0&&(n.familySupportCapital=0),(!t||t<"1.3")&&(n.history=(n.history||[]).map(o=>o.source?o:{...o,source:"estimated"})),n.version=Pe,n}function yn(e){return{...e,version:Pe,disclaimer:"本工具为个人成长记录与自我反思工具，所有数值为模型估算，仅供娱乐与自我观察，不构成理财、职业或心理咨询建议，也不预测收入。"}}function hn(e,t){const n=Le(e.age),o=100,a=t.bv*n,i=t.milestoneBonus,r=[{key:"growth",name:"成长系数",value:t.growthCoef,reason:`收入增速与学习时长决定，含停滞衰减 ${t.stagnationPenalty}`},{key:"quality",name:"质量系数",value:t.qualityCoef,reason:`基于有效健康分 ${t.effectiveHealth}`},{key:"risk",name:"风险折扣",value:1-t.riskDiscount,reason:`负债率 ${(e.debtRatio||0)*100}%，折扣 ${(t.riskDiscount*100).toFixed(0)}%`},{key:"subjective",name:"主观感知",value:t.subjectiveAdjust,reason:`你设定的主观权重 ${t.subjectiveAdjust.toFixed(2)}（1.0 为中性）`}],l=r.reduce((u,v)=>u*v.value,1),d=t.price,c=[];return c.push({key:"base",name:"基准指数",contribution:Math.round(o*l*10)/10,ratio:d>0?o*l/d:0,reason:"所有人同一起点 100 分"}),c.push({key:"bv",name:"累计成长值",contribution:Math.round(a*l*10)/10,ratio:d>0?a*l/d:0,reason:`成长值 ${t.bv} 点 × 阶段系数 ${n.toFixed(2)}（${e.age}岁）`}),c.push({key:"milestone",name:"里程碑加成",contribution:Math.round(i*l*10)/10,ratio:d>0?i*l/d:0,reason:"已达成里程碑加分（封顶 200）"}),r.forEach(u=>{c.push({key:u.key,name:u.name,contribution:0,ratio:0,reason:u.reason+`（×${u.value.toFixed(2)}）`})}),c}function bn(e){const t=e.filter(n=>n.contribution>0);return t.length===0?null:t.reduce((n,o)=>n.contribution>o.contribution?n:o)}const xn={great:4,good:3,ok:2,low:1};function wn(e,t,n){return{id:`j_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,date:new Date,content:e.trim(),mood:t,category:n}}function $n(e,t){return{...e,journals:[...e.journals||[],t]}}function kn(e,t=10){return[...e.journals||[]].sort((n,o)=>new Date(o.date).getTime()-new Date(n.date).getTime()).slice(0,t)}function je(e,t){const n=Date.now()-t*24*60*60*1e3;return(e.journals||[]).filter(o=>new Date(o.date).getTime()>=n).length}function $t(e){const t=new Set((e.journals||[]).map(a=>new Date(a.date).toDateString()));let n=0;const o=new Date;for(;t.has(o.toDateString());)n++,o.setDate(o.getDate()-1);return n}function Re(e,t=30){const n=Date.now()-t*24*60*60*1e3,o=(e.journals||[]).filter(i=>i.mood&&new Date(i.date).getTime()>=n);return o.length===0?null:o.reduce((i,r)=>i+xn[r.mood],0)/o.length}function Sn(e,t){if(e.length===0)return{peak:t,current:t,drawdownPct:0,drawdownPoints:0,peakDaysAgo:0,inDrawdown:!1,suggestions:["开始记录你的第一笔成长投入吧"]};const n=Math.max(...e.map(c=>c.price),t),o=Math.max(0,n-t),a=n>0?o/n*100:0,i=e.reduce((c,u)=>u.price>c.price?u:c,e[0]),r=e[e.length-1].age,l=Math.round((r-i.age)*365),d=[];return a===0?d.push("当前处于历史高位，继续保持成长节奏"):a<5?(d.push("小幅波动属正常，不必过度焦虑"),d.push("检查近期投入是否连续，保持每周一笔")):a<15?(d.push("阶段性回落，可复盘近期是否有停滞期"),d.push("健康与学习时长对成长系数影响较大")):(d.push("回落幅度较大，建议认真复盘近期生活变化"),d.push("可在「记录挫折」中标记事件，帮助归因")),{peak:n,current:t,drawdownPct:Math.round(a*10)/10,drawdownPoints:Math.round(o),peakDaysAgo:Math.max(0,l),inDrawdown:a>.5,suggestions:d}}function Mn(e){const t=["最近哪件事最影响你的状态？","这个阶段你的投入重心放在了哪里？","有什么是你想调整或继续的？"];return e.setbacks&&e.setbacks.length>0&&t.unshift("你记录的挫折事件，现在回看有什么新感悟？"),t}function Dn(e,t){const n=T(e),o=n.price,a=Math.max(0,t-o),i=n.growthCoef*n.qualityCoef*(1-n.riskDiscount)*n.subjectiveAdjust,r=n.stageCoef||1,l=Math.max(0,(t/i-100-n.milestoneBonus)/r),d=n.bv,c=Math.max(0,l-d),u=c,v=e.annualIncome*.05/12,m=e.annualIncome*.15/12,p=m>0?Math.ceil(c/m):999,f=v>0?Math.ceil(c/v):999,g=[];return a<=0?g.push("已达到目标，可设定更高的成长目标"):(g.push(`距离目标还差 ${Math.round(a)} 点`),g.push(`按当前节奏约需 ${p}-${f} 个月（仅作参考）`),g.push("提升学习时长与健康评分，可加速成长系数"),g.push("达成更多里程碑可获得额外加成")),{target:t,current:Math.round(o),gap:Math.round(a),requiredBV:Math.round(l),additionalInvest:Math.round(u),monthsRange:[Math.min(p,999),Math.min(f,999)],suggestions:g,confidence:"估算基于当前系数与线性假设，实际成长受多因素影响，请理性参考"}}function kt(e,t){const n=new Date,o=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`,i=T(e).price,r=new Date(n.getFullYear(),n.getMonth(),1),l=n.getFullYear()-e.birthYear-(n.getMonth()<r.getMonth()?1:0);let d=i;if(t.length>0){const k=t.filter(H=>H.age<=l-.08);k.length>0?d=k[k.length-1].price:d=t[0].price}const c=i-d,u=d>0?c/d*100:0,v=new Date(n.getFullYear(),n.getMonth(),1).getTime(),m=(e.investments||[]).filter(k=>new Date(k.date).getTime()>=v),p=m.length,f=m.reduce((k,H)=>k+H.amount,0),g=je(e,30),y=Re(e,30),b=[];p>0&&b.push(`本月记录了 ${p} 笔自我投入`),c>0?b.push(`成长指数上升 ${Math.round(c)} 点`):c<0&&b.push("本月指数有所回落，可查看回落复盘");const I=e._milestones||[];I>0&&b.push(`达成 ${I} 个里程碑`);const A=[];return p===0&&A.push("建议每周至少记录一笔投入，保持成长节奏"),g<5&&A.push("增加一句话记录的频率，帮助觉察成长"),y!==null&&y<2.5&&A.push("近期情绪偏低，关注健康与休息"),A.length===0&&A.push("保持当前节奏，继续积累成长值"),{month:o,startPrice:Math.round(d),endPrice:Math.round(i),changePoints:Math.round(c),changePct:Math.round(u*10)/10,investCount:p,investAmount:f,journalDays:g,avgMood:y,highlights:b,suggestions:A}}function et(e){const t=e.getDay(),n=t===0?-6:1-t,o=new Date(e);return o.setDate(e.getDate()+n),o.setHours(0,0,0,0),o}function He(e){const t=new Date,n=et(t),o=new Date(n);o.setDate(n.getDate()+7);const i=(e.investments||[]).filter(v=>{const m=new Date(v.date).getTime();return m>=n.getTime()&&m<o.getTime()}).length,r=i>0;let l=0,d=new Date(t);for(;;){const v=et(d),m=new Date(v);if(m.setDate(v.getDate()+7),(e.investments||[]).some(f=>{const g=new Date(f.date).getTime();return g>=v.getTime()&&g<m.getTime()}))l++,d=new Date(v),d.setDate(v.getDate()-1);else{if(l===0&&d.getTime()===t.getTime()){d=new Date(v),d.setDate(v.getDate()-1);continue}break}if(l>520)break}const c=Math.max(0,7-(t.getDay()===0?7:t.getDay()-1));let u;return r?u=`本周已记录 ${i} 笔，继续保持！连续 ${l} 周`:c<=2?u=`本周还剩 ${c} 天，记一笔投入保持连续吧`:u=`本周还剩 ${c} 天，期待你的第一笔投入`,{investedThisWeek:r,countThisWeek:i,streakWeeks:l,daysLeftInWeek:c,message:u}}const In={education:"🎓 教育",skill:"📚 技能",health:"💪 健康",network:"🤝 人脉",entertainment:"🎮 娱乐",other:"📦 其他"};function be(e){const t={education:0,skill:0,health:0,network:0,entertainment:0,other:0};(e.history||[]).forEach(p=>{t[p.type]=(t[p.type]||0)+p.invest}),(e.investments||[]).forEach(p=>{t[p.type]=(t[p.type]||0)+p.amount});const n=Math.max(...Object.values(t),1),o=Object.keys(t).map(p=>({type:p,label:In[p],value:Math.round(t[p]/n*100),amount:t[p]})),a=[...o].sort((p,f)=>f.amount-p.amount),i=a[0].type,r=a[a.length-1].type,l=o.map(p=>p.amount),d=l.reduce((p,f)=>p+f,0)/l.length;if(d===0)return{dimensions:o,dominant:i,weakest:r,balance:0};const c=l.reduce((p,f)=>p+(f-d)**2,0)/l.length,v=Math.sqrt(c)/d,m=Math.max(0,Math.min(1,1-v/2));return{dimensions:o,dominant:i,weakest:r,balance:Math.round(m*100)/100}}function En(e,t=10,n=0){const o=e.age,a=[];let i=gt(e);const r=.06;for(let u=1;u<=t;u++){const v=o+u,m=Math.round(i*r),p=n;i=i-m+p,i=Math.max(0,i),a.push({age:v,bv:Math.round(i),depreciation:m,newInvest:p})}const l=a[4]?.bv||0,d=a[9]?.bv||0,c=[];return n===0&&c.push("未设定年度新增投入，成长值会随时间自然衰减"),d<i*.5&&(c.push("按当前节奏，10 年后成长积累可能缩水过半"),c.push("建议增加年度投入，或提升投入质量")),l>i&&c.push("按当前投入节奏，5 年后成长积累仍在增长"),c.push("健康与技能类投入折旧较慢，优先配置"),{points:a,bv5y:l,bv10y:d,annualDecayRate:r,suggestions:c}}function Tn(e){const t=T(e).price;return[{scenario:"optimistic",label:"乐观",icon:"🚀",desc:"学习时长增加、健康改善、收入增长提速",mod:{studyHours:e.studyHours+5,healthScore:Math.min(100,e.healthScore+15),annualIncomeGrowth:e.annualIncomeGrowth+.05,debtRatio:Math.max(0,e.debtRatio-.1)}},{scenario:"neutral",label:"中性",icon:"➡️",desc:"保持当前节奏不变",mod:{}},{scenario:"pessimistic",label:"保守",icon:"🛡️",desc:"学习时长减少、健康下滑、收入停滞",mod:{studyHours:Math.max(0,e.studyHours-3),healthScore:Math.max(0,e.healthScore-15),annualIncomeGrowth:Math.max(0,e.annualIncomeGrowth-.05),debtRatio:Math.min(1,e.debtRatio+.1)}}].map(o=>{const a={...e,...o.mod},i=T(a);return{scenario:o.scenario,label:o.label,icon:o.icon,price:Math.round(i.price),changePct:t>0?Math.round((i.price-t)/t*1e3)/10:0,desc:o.desc,params:{studyHours:a.studyHours,healthScore:a.healthScore,incomeGrowth:a.annualIncomeGrowth,debtRatio:a.debtRatio}}})}function An(e){const t=e.familySupportCapital||0,n=e._familyEntries||[],o=(e.totalInvest||0)+t,a=o>0?t/o:0,i=[];return t===0&&i.push("可记录家庭/父母的累计投入，更全面地认识成长积累"),a>.5&&i.push("家庭支持占比较高，可逐步增加自我投入占比"),a>0&&a<=.5&&i.push("家庭支持与自我投入比例健康，继续保持"),n.length===0&&t>0&&i.push("可补充家庭投入的明细记录，便于感恩与回顾"),{totalSupport:t,entries:n,supportRatio:Math.round(a*100)/100,suggestions:i}}function Cn(e){const t=new Date,n=new Date(t),o=n.getDay(),a=o===0?-6:1-o;n.setDate(t.getDate()+a);const i=`${n.getFullYear()}年${n.getMonth()+1}月第${Math.ceil(n.getDate()/7)}周`,r=T(e),l=He(e),d=je(e,7);$t(e);const c=Re(e,7),u=be(e),v=[],m=[],p=[];l.investedThisWeek?v.push(`本周记录了 ${l.countThisWeek} 笔投入${l.streakWeeks>1?`，连续 ${l.streakWeeks} 周`:""}`):(m.push("本周还没有记录投入，下周至少记一笔"),p.push("周末前记录一笔自我投入")),d>=5?v.push(`本周记录了 ${d} 条成长感悟，觉察力在线`):d>=1?p.push("下周把记录频率提升到 3 次以上"):(m.push("本周没有成长记录，觉察是成长的第一步"),p.push("每天花 1 分钟写下一个想法"));let f="本周无情绪数据";if(c!==null&&(c>=3.5?(v.push("本周整体情绪很好，状态饱满"),f="😄 情绪很好，继续保持"):c>=2.5?f="🙂 情绪平稳":(m.push("本周情绪偏低，关注休息与健康"),f="😔 情绪偏低，多关注自己",p.push("安排一次放松或运动"))),u.balance>=.6)v.push("投入结构较均衡，多维发展");else{const y=u.dimensions.find(b=>b.type===u.weakest)?.label||"";m.push(`投入结构不均衡，${y}维度较弱`),p.push(`下周在${y}上增加一点投入`)}r.growthCoef>=1.2?v.push("成长动力强劲，保持当前节奏"):r.growthCoef<.9&&(m.push("成长动力偏弱，检查学习时长与健康"),p.push("增加每周学习时长，关注健康评分"));let g;return v.length>=2?g="本周成长势头良好，继续保持多维投入与觉察。":m.length>=2?g="本周有提升空间，从小行动开始调整节奏。":g="本周平稳，保持觉察，持续积累。",p.length===0&&p.push("保持当前节奏，下周复盘时看看有什么新变化"),{week:i,summary:g,highlights:v,improvements:m,actions:p,moodNote:f}}function zn(e,t){const n=new Date,o=n.getFullYear(),a=T(e),i=n.getFullYear()-e.birthYear-1;let r=a.price;const l=t.filter(k=>k.age<=i);l.length>0&&(r=l[l.length-1].price);const d=a.price-r,c=r>0?d/r*100:0,u=new Date(o,0,1).getTime(),v=(e.investments||[]).filter(k=>new Date(k.date).getTime()>=u),m=v.reduce((k,H)=>k+H.amount,0),p=v.length,f=je(e,365),g=Re(e,365),y=q.filter(k=>k.condition(e)).length,b=[];y>=5&&b.push("🏆 里程碑丰收"),p>=12&&b.push("💰 持续投入"),f>=100&&b.push("📝 勤于觉察"),e.healthScore>=75&&b.push("💪 健康在线"),a.growthCoef>=1.2&&b.push("🚀 高速成长"),b.length===0&&b.push("🌱 稳步积累");let I;d>0?I=`这一年，你的成长指数上升了 ${Math.round(d)} 点。每一笔投入、每一次觉察，都在累积成看得见的成长。`:d<0?I=`这一年有些起伏，指数回落了 ${Math.round(Math.abs(d))} 点。回落不是失败，是重新认识自己的机会。`:I="这一年平稳度过，成长在潜移默化中发生。";const A=[];return p<12&&A.push("每月至少记录一笔投入"),f<50&&A.push("每周记录 2-3 条成长感悟"),e.healthScore<70&&A.push("提升健康评分到 70 以上"),a.growthCoef<1&&A.push("增加学习时长，提升成长系数"),A.length===0&&A.push("保持当前节奏，设定更高的成长目标"),{year:o,startPrice:Math.round(r),endPrice:Math.round(a.price),changePoints:Math.round(d),changePct:Math.round(c*10)/10,totalInvest:m,investCount:p,journalDays:f,avgMood:g,milestoneCount:y,keywords:b,summary:I,nextYearPlan:A}}function Ne(e){const t=$t(e),n=He(e),o=(e.investments||[]).length,a=(e.journals||[]).length,i=e._milestones||0;return[{id:"streak7",name:"七日觉察",icon:"🔥",desc:"连续 7 天记录成长感悟",progress:Math.min(t,7),target:7,done:t>=7,unit:"天"},{id:"streak30",name:"月度坚持",icon:"🌟",desc:"连续 30 天记录成长感悟",progress:Math.min(t,30),target:30,done:t>=30,unit:"天"},{id:"invest10",name:"十笔投入",icon:"💰",desc:"累计记录 10 笔自我投入",progress:Math.min(o,10),target:10,done:o>=10,unit:"笔"},{id:"weekly4",name:"周周不断",icon:"📅",desc:"连续 4 周每周至少一笔投入",progress:Math.min(n.streakWeeks,4),target:4,done:n.streakWeeks>=4,unit:"周"},{id:"journal50",name:"觉察达人",icon:"📝",desc:"累计记录 50 条成长感悟",progress:Math.min(a,50),target:50,done:a>=50,unit:"条"},{id:"milestone5",name:"里程碑收集者",icon:"🏆",desc:"达成 5 个成长里程碑",progress:Math.min(i,5),target:5,done:i>=5,unit:"个"}]}function Bn(e){const t=Ne(e),n=t.filter(o=>o.done).length;return Math.round(n/t.length*100)}const tt=[{name:"成长教练",tone:"理性鼓励"},{name:"职场前辈",tone:"务实建议"},{name:"生活哲学家",tone:"温柔启发"}];function Pn(e){const t=T(e),n=be(e),o=tt[new Date().getDate()%tt.length],a=[],i=[];if(t.growthCoef>=1.2?a.push("你的成长动力很强，学习与投入节奏不错"):t.growthCoef<.9?a.push("近期成长动力偏弱，可能需要调整节奏"):a.push("成长节奏平稳，稳扎稳打"),e.healthScore>=80?a.push("健康状态良好，这是持续成长的底座"):e.healthScore<60&&a.push("健康评分偏低，身体是一切的基础"),n.balance>=.6)a.push("投入结构均衡，多维发展");else{const u=n.dimensions.find(v=>v.type===n.weakest)?.label.split(" ")[1]||"";a.push(`${u}维度投入相对较少`)}e.studyHours<5&&i.push("尝试每周增加 2-3 小时学习时间，成长系数会明显提升"),e.healthScore<70&&i.push("安排规律运动和睡眠，健康评分每提升 10 分，质量系数约提升 7%"),n.balance<.5&&i.push("在保持优势维度的同时，给薄弱维度一些投入，结构会更稳"),t.subjectiveAdjust<1&&i.push("你对自己的评价偏保守，不妨多看看已取得的进步"),i.length===0&&i.push("当前状态不错，给自己设定一个稍高的目标，然后稳步推进");const r=["成长不是百米冲刺，而是马拉松。你已经在路上了。","每一笔投入、每一次觉察，都在塑造未来的你。","不必和别人比，今天的你比昨天好一点，就是胜利。","低谷是蓄力，高峰是收获。享受这个过程。"],l=r[new Date().getDay()%r.length],d=new Date().getHours();let c;return d<6?c="夜深了，注意休息。":d<12?c="早上好，新的一天开始了。":d<18?c="下午好，今天过得怎么样？":c="晚上好，回顾一下今天的成长吧。",{persona:`${o.name}（${o.tone}）`,greeting:c,observations:a,advices:i,encouragement:l}}const Ln=[{term:"成长积累",icon:"💎",short:"你累计投入自己的总和",detail:"包括教育、技能、健康、人脉等各维度的投入总和。它会随时间自然衰减，需要持续投入来保持与增长。",category:"基础"},{term:"成长指数",icon:"📈",short:"综合反映你当前成长状态的数值（单位：点）",detail:"基于成长积累、成长系数、质量系数、风险折扣、主观感知权重等综合计算。它不是分数，也不是金钱，而是一个帮助你觉察和调整的参考。",category:"基础"},{term:"成长系数",icon:"🚀",short:"反映你当前成长速度的倍率",detail:"受收入增长、学习时长、停滞惩罚等影响。学习时长每增加 5 小时/周，成长系数约提升 0.25。",category:"成长"},{term:"质量系数",icon:"✨",short:"反映生活质量对成长的放大作用",detail:"主要由健康评分决定。健康是 1，其他是 0。健康评分每提升 10 分，质量系数约提升 7%。",category:"成长"},{term:"主观感知权重",icon:"🎯",short:"你对自身成长价值的主观评估",detail:'范围 0.5-1.5，默认 1.0 中性。这是你对自己的主观评估，不影响客观成长积累，只影响你"感受到"的指数。',category:"心理"},{term:"折旧",icon:"📉",short:"成长积累随时间自然损耗",detail:"知识会遗忘，技能会生疏，健康会衰退。不同类型的投入折旧速度不同：健康最稳，教育折旧较快。持续投入是对抗折旧的唯一方式。",category:"方法"},{term:"回落",icon:"💧",short:"成长指数从阶段性高点回落的幅度",detail:"成长不是直线上升，回落是正常的。关键不是避免回落，而是在回落中复盘觉察，找到调整方向。",category:"心理"},{term:"里程碑",icon:"🏆",short:"成长路上的标志性节点",detail:"如获得第一份工作、升职加薪、考取证书等。里程碑会给指数带来额外加成，是对阶段性成长的肯定。",category:"成长"}],jn=[{stage:"学生期",ageRange:"18-22 岁",focus:"积累基础，探索方向",tips:["教育投入是核心，学好专业基础","多尝试不同领域，找到兴趣所在","开始建立健康习惯，受益终身","人脉投入从同学关系开始"]},{stage:"职场初期",ageRange:"23-28 岁",focus:"快速学习，建立能力",tips:["技能投入优先，快速提升职场竞争力","健康不能忽视，避免透支身体","人脉从同事和行业社群拓展","设定 3 年成长目标，定期复盘"]},{stage:"职场上升期",ageRange:"29-35 岁",focus:"深度积累，形成壁垒",tips:["在专业领域深耕，建立不可替代性","开始关注财务管理，控制负债",'健康管理从"被动"变"主动"'," mentoring 他人也是自我成长"]},{stage:"成熟期",ageRange:"36-45 岁",focus:"稳定输出，传承价值",tips:['从"学"转向"用"和"教"',"家庭与事业的平衡是关键","健康投入比重需提高","帮助年轻人成长，回馈社会"]}],Ee=[{title:"致支持我的家人",content:"谢谢你们一直以来的支持和陪伴。我正在认真生活、持续成长，每一点进步都有你们的功劳。我会照顾好自己，也会努力成为更好的人。"},{title:"给爸爸妈妈的一封信",content:"这些年辛苦了。我知道成长不是一件容易的事，而你们的爱是我最坚实的后盾。我会好好珍惜自己，也会常回家看看。"},{title:"感恩有你",content:"感谢你在我成长路上的每一份付出。也许我不常说，但我都记得。我会带着这份爱，继续向前走。"},{title:"我在好好长大",content:"请放心，我在认真生活、努力成长。健康、学习、工作，我都在用心经营。谢谢你给我的一切，我会用成长来回报。"}];function St(e,t){const n=t??new Date().getDate()%Ee.length,o=Ee[n];return{title:o.title,content:o.content,signature:`—— 一个正在成长的人（${e.age} 岁）`}}function fe(){return Ee.length}function Fe(e,t){const n=T(e),o=kt(e,t),a=be(e),i=Ne(e),r=[];return r.push("═══════════════════════════════════════"),r.push("         人 生 成 长 报 告"),r.push("═══════════════════════════════════════"),r.push(""),r.push(`生成时间：${new Date().toLocaleString("zh-CN")}`),r.push(""),r.push("【一、当前状态】"),r.push(`  成长指数：${Math.round(n.price)} 点`),r.push(`  累计成长值：${Math.round(n.bv)} 点`),r.push(`  成长系数：${n.growthCoef.toFixed(2)}`),r.push(`  质量系数：${n.qualityCoef.toFixed(2)}`),r.push(`  风险折扣：${Math.round(n.riskDiscount*100)}%`),r.push(`  主观感知权重：${n.subjectiveAdjust.toFixed(2)}`),r.push(""),r.push("【二、本月概览】"),r.push(`  月度变化：${o.changePoints>=0?"+":""}${o.changePoints} 点（${o.changePct>=0?"+":""}${o.changePct}%）`),r.push(`  投入笔数：${o.investCount} 笔，实际花费 ${o.investAmount.toLocaleString()} 元（仅为记录）`),r.push(`  记录天数：${o.journalDays} 天`),o.highlights.length>0&&(r.push("  本月亮点："),o.highlights.forEach(l=>r.push(`    - ${l}`))),r.push(""),r.push("【三、投入结构】"),a.dimensions.forEach(l=>{r.push(`  ${l.label}：${l.amount.toLocaleString()} 元`)}),r.push(`  均衡度：${Math.round(a.balance*100)}%`),r.push(""),r.push("【四、挑战进度】"),i.forEach(l=>{r.push(`  ${l.icon} ${l.name}：${l.progress}/${l.target} ${l.unit} ${l.done?"✓":""}`)}),r.push(""),r.push("【五、下月建议】"),o.suggestions.forEach(l=>r.push(`  • ${l}`)),r.push(""),r.push("═══════════════════════════════════════"),r.push("  本报告由「今日宜长进」在你的设备本地生成"),r.push("  数值为模型估算，仅供自我观察与反思，不构成理财、职业或心理建议"),r.push("═══════════════════════════════════════"),r.join(`
`)}function P(e){const t=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),o=String(e.getDate()).padStart(2,"0");return`${t}-${n}-${o}`}function F(e=new Date){return P(e)}function K(e){const[t,n,o]=e.split("-").map(Number);return new Date(t,n-1,o)}let ke=0;function Rn(e){return ke=(ke+1)%1e6,`${e}_${Date.now().toString(36)}_${ke}${Math.random().toString(36).slice(2,6)}`}function Hn(e,t=new Date){const n=e.name.trim();if(!n)throw new Error("习惯名称不能为空");return{id:Rn("h"),name:n,icon:e.icon||"⭐",color:e.color||"#ff8a4c",cadence:e.cadence,timesPerWeek:e.cadence==="weekly"?Math.min(7,Math.max(1,e.timesPerWeek||3)):1,linkedType:e.linkedType,investOnCheck:e.investOnCheck??!0,createdAt:t}}function Nn(e,t){return new Set((e.habitChecks||[]).filter(n=>n.habitId===t).map(n=>n.date))}function Fn(e,t,n){return e.findIndex(o=>o.habitId===t&&o.date===n)}function _n(e,t,n=F(),o=new Date){const a=[...e.habitChecks||[]],i=Fn(a,t,n);let r,l=!1;return i>=0?(a.splice(i,1),r="unchecked"):(l=n<F(o),a.push({habitId:t,date:n,makeup:l||void 0}),r="checked"),{user:{...e,habitChecks:a},action:r,makeup:l}}function On(e,t){return Math.round((K(e).getTime()-K(t).getTime())/864e5)}function qn(e,t,n=new Date){if(t.cadence==="daily"){let d=0;const c=new Date(n.getFullYear(),n.getMonth(),n.getDate());for(;e.has(P(c));)d++,c.setDate(c.getDate()-1);return d}const o=new Date(n.getFullYear(),n.getMonth(),n.getDate()),a=(o.getDay()+6)%7,i=new Date(o);i.setDate(o.getDate()-a);let r=i;Te(e,r,t.timesPerWeek)||(r=new Date(i),r.setDate(i.getDate()-7));let l=0;for(;Te(e,r,t.timesPerWeek);)l++,r=new Date(r),r.setDate(r.getDate()-7);return l}function Te(e,t,n,o=new Date){let a=0;for(let i=0;i<7;i++){const r=new Date(t);r.setDate(t.getDate()+i),!(r.getTime()>o.getTime())&&e.has(P(r))&&a++}return a>=n}function Gn(e,t,n=new Date){const o=Array.from(e).sort();if(o.length===0)return 0;if(t.cadence==="daily"){let v=1,m=1;for(let p=1;p<o.length;p++)On(o[p],o[p-1])===1?(m++,v=Math.max(v,m)):m=1;return v}const a=K(o[0]),i=(a.getDay()+6)%7,r=new Date(a);r.setDate(a.getDate()-i);const l=K(o[o.length-1]);let d=0,c=0;const u=new Date(r);for(;u.getTime()<=l.getTime()+7*864e5;)Te(e,u,t.timesPerWeek,n)?(c++,d=Math.max(d,c)):c=0,u.setDate(u.getDate()+7);return d}function G(e,t,n=new Date){const o=Nn(e,t.id),a=new Date(n.getFullYear(),n.getMonth(),n.getDate()),i=(a.getDay()+6)%7,r=new Date(a);r.setDate(a.getDate()-i);const l=[];let d=0;for(let c=0;c<7;c++){const u=new Date(r);u.setDate(r.getDate()+c);const v=u.getTime()<=a.getTime()&&o.has(P(u));l.push(v),v&&d++}return{doneToday:o.has(P(a)),streak:qn(o,t,n),bestStreak:Gn(o,t,n),weekCount:d,weekDots:l,weekTarget:t.cadence==="weekly"?t.timesPerWeek:7}}function Yn(e,t,n=12,o=new Date){const a=new Map;(e.habitChecks||[]).filter(v=>v.habitId===t.id).forEach(v=>a.set(v.date,v));const i=new Date(o.getFullYear(),o.getMonth(),o.getDate()),r=(i.getDay()+6)%7,l=new Date(i);l.setDate(i.getDate()-r);const d=new Date(l);d.setDate(l.getDate()-7*(n-1));const c=P(i),u=[];for(let v=0;v<n;v++){const m=[];for(let p=0;p<7;p++){const f=new Date(d);f.setDate(d.getDate()+v*7+p);const g=P(f),y=a.get(g);m.push({date:g,checked:!!y,makeup:!!y?.makeup,future:g>c})}u.push(m)}return u}let Se=0;function Wn(){return Se=(Se+1)%1e6,`t_${Date.now().toString(36)}_${Se}${Math.random().toString(36).slice(2,6)}`}function Vn(e,t=new Date){const n=e.title.trim();if(!n)throw new Error("待办标题不能为空");return{id:Wn(),title:n,note:e.note?.trim()||void 0,priority:e.priority??2,dueDate:e.dueDate||void 0,done:!1,createdAt:t}}function Kn(e,t=new Date){return e.done?{...e,done:!1,doneAt:void 0}:{...e,done:!0,doneAt:t}}function Un(e,t){return!e.done&&!!e.dueDate&&e.dueDate<t}function Jn(e){return[...e].sort((t,n)=>{if(t.done!==n.done)return t.done?1:-1;if(!t.done&&!n.done){if(t.priority!==n.priority)return t.priority-n.priority;if(t.dueDate||n.dueDate){if(!t.dueDate)return 1;if(!n.dueDate)return-1;if(t.dueDate!==n.dueDate)return t.dueDate<n.dueDate?-1:1}return n.createdAt.getTime()-t.createdAt.getTime()}return(n.doneAt?.getTime()||0)-(t.doneAt?.getTime()||0)})}function nt(e,t,n){let o=0,a=0;for(const i of e){const r=i.date instanceof Date?i.date:new Date(i.date);r.getFullYear()===t&&r.getMonth()===n&&(o+=i.amount||0,a++)}return{amount:o,count:a}}function Xn(e,t){const n=t.now||new Date,o=n.getFullYear(),a=n.getMonth(),i=nt(e.investments||[],o,a),r=new Date(o,a-1,1),l=nt(e.investments||[],r.getFullYear(),r.getMonth()),d=t.sensitive&&(e.monthlyBudget??0)>0,c=!t.sensitive&&(e.monthlyCountBudget??0)>0,u=d?e.monthlyBudget:c?e.monthlyCountBudget:null,v=d?"amount":"count",m=v==="amount"?i.amount:i.count,p=v==="amount"?l.amount:l.count,f=n.getDate();return{mode:v,budget:u,spent:m,remaining:u===null?null:u-m,ratio:u===null?null:m/u,overrun:u!==null&&m>u,dailyAvg:f>0?m/f:0,lastMonth:p,deltaPct:p>0?(m-p)/p:null}}const j={education:{name:"教育",icon:"🎓",color:"#ff8a4c"},skill:{name:"技能",icon:"📚",color:"#f5a623"},health:{name:"健康",icon:"💪",color:"#3fa06a"},network:{name:"人脉",icon:"🤝",color:"#3e9b8f"},entertainment:{name:"娱乐",icon:"🎮",color:"#e0705b"},other:{name:"其他",icon:"📦",color:"#a79b8c"}};function Qn(e,t,n){const o=new Map((e.customTypes||[]).map(d=>[d.id,d])),a=new Map,i=(d,c)=>{const u=a.get(d)||{amount:0,count:0};u.amount+=c.amount||0,u.count+=1,a.set(d,u)};for(const d of e.investments||[]){const c=d.date instanceof Date?d.date:new Date(d.date);c.getFullYear()!==t||c.getMonth()!==n||(d.customType&&o.has(d.customType)?i(`custom:${d.customType}`,d):i(d.type,d))}const r=Array.from(a.values()).reduce((d,c)=>d+c.amount,0),l=[];for(const[d,c]of a)if(d.startsWith("custom:")){const u=o.get(d.slice(7));l.push({key:d,name:u.name,icon:u.icon,color:u.color,amount:c.amount,count:c.count,ratio:r>0?c.amount/r:0,custom:!0})}else{const u=j[d];l.push({key:d,name:u.name,icon:u.icon,color:u.color,amount:c.amount,count:c.count,ratio:r>0?c.amount/r:0,custom:!1})}return l.sort((d,c)=>c.amount-d.amount)}function Zn(e,t=6,n=new Date){const o=[];for(let a=t-1;a>=0;a--){const i=new Date(n.getFullYear(),n.getMonth()-a,1),r=i.getFullYear(),l=i.getMonth();let d=0,c=0;for(const u of e.investments||[]){const v=u.date instanceof Date?u.date:new Date(u.date);v.getFullYear()===r&&v.getMonth()===l&&(d+=u.amount||0,c++)}o.push({key:`${r}-${l+1}`,label:`${l+1}月`,amount:d,count:c})}return o}let Me=0;function eo(){return Me=(Me+1)%1e6,`e_${Date.now().toString(36)}_${Me}${Math.random().toString(36).slice(2,6)}`}function Mt(e,t){const n=t.title.trim();if(!n)throw new Error("事件标题不能为空");const o={id:eo(),date:t.date||new Date,icon:t.icon||"🌟",title:n,desc:t.desc?.trim()||void 0,kind:"manual"};return{...e,lifeEvents:[...e.lifeEvents||[],o]}}function ot(e,t){const o=[...Mt(e,t).lifeEvents||[]];return o[o.length-1]={...o[o.length-1],kind:"streak"},{...e,lifeEvents:o}}function to(e,t){return{...e,lifeEvents:(e.lifeEvents||[]).filter(n=>!(n.id===t&&n.kind==="manual"))}}const no={jobloss:{icon:"💼",name:"工作变动"},illness:{icon:"🏥",name:"健康风波"},loss:{icon:"🌧️",name:"失去与告别"},stagnate:{icon:"🪫",name:"停滞期"}};function oo(e){const t=j[e.type],n=t.icon,o=e.desc||`${t.name}投入`;return{icon:n,title:o}}function ao(e){const t=[];(e.investments||[]).forEach((i,r)=>{const l=i.date instanceof Date?i.date:new Date(i.date),d=oo(i);t.push({id:`inv_${r}_${l.getTime()}`,date:l,icon:d.icon,title:i.amount>0?`${d.title} · ${i.amount.toLocaleString()} 元`:d.title,deletable:!1,source:"invest"})}),(e.journals||[]).forEach((i,r)=>{const l=i.date instanceof Date?i.date:new Date(i.date);t.push({id:`jrn_${r}_${l.getTime()}`,date:l,icon:i.mood?{great:"😄",good:"🙂",ok:"😐",low:"😔"}[i.mood]:"✨",title:i.content,deletable:!1,source:"journal"})}),(e.setbacks||[]).forEach((i,r)=>{const l=i.date instanceof Date?i.date:new Date(i.date),d=no[i.type];t.push({id:`sb_${r}_${l.getTime()}`,date:l,icon:d.icon,title:`${d.name}（影响 ${i.severity}%）`,deletable:!1,source:"setback"})}),(e.lifeEvents||[]).forEach(i=>{const r=i.date instanceof Date?i.date:new Date(i.date);t.push({id:i.id,date:r,icon:i.icon,title:i.title,desc:i.desc,deletable:i.kind!=="streak",source:i.kind||"manual"})}),t.sort((i,r)=>r.date.getTime()-i.date.getTime());const n=new Map;for(const i of t){const r=`${i.date.getFullYear()}-${String(i.date.getMonth()+1).padStart(2,"0")}`;n.has(r)||n.set(r,[]),n.get(r).push(i)}const o=Array.from(n.entries()).sort((i,r)=>i[0]<r[0]?1:-1).map(([i,r])=>{const[l,d]=i.split("-");return{key:i,label:`${l} 年 ${Number(d)} 月`,items:r}}),a=q.filter(i=>i.condition(e)).map(i=>({icon:i.icon,name:i.name,desc:i.desc}));return{months:o,achievedMilestones:a}}function io(e,t={}){const n={...t};let o=!1,a=!1;if(typeof n.target=="number"&&n.target>0){const i=e>=n.target;o=i&&!n.targetHit,n.targetHit=i}else n.targetHit=!1;if(typeof n.floor=="number"&&n.floor>0){const i=e<=n.floor;a=i&&!n.floorHit,n.floorHit=i}else n.floorHit=!1;return{alert:n,targetNew:o,floorNew:a}}const Dt={jobloss:{empathy:"工作的变动不是你的价值下跌，只是曲线绕了个弯。先稳住节奏，再慢慢找回方向。",instant:"打开备忘录，写下：现在最担心的 3 件事，和你手里已有的 3 个资源（一项技能、一个朋友、一笔存款都算）。",instantCheer:"写下来了，就没那么吓人了——你手里的牌比想象中多。",completeCheer:"这一周你没有被变动定义，而是在主动布局下一段路。曲线回暖，你值得这个反弹。",tasks:[{day:1,text:"更新一页简历，只写最近做成的 3 件事"},{day:2,text:"联系 3 位旧同事或朋友，简单聊聊近况"},{day:3,text:"投出 2 个认真匹配的岗位（不求多，求准）"},{day:4,text:"学 1 节与目标岗位相关的技能小课"},{day:5,text:"出门运动 30 分钟，让身体先恢复状态"},{day:6,text:"复盘这次变动：它帮你排除了什么不想要的？"},{day:7,text:"给自己做一顿好饭，认真感谢撑过来的自己"}]},illness:{empathy:"健康亮红灯的时候，指数退一小步是身体在提醒你慢一点。照顾好自己，就是最重要的成长投入。",instant:"放下手机，做 10 次缓慢的深呼吸：吸气 4 秒，停 2 秒，呼气 6 秒。",instantCheer:"感觉到了吗？这 10 次呼吸，就是你今天为恢复做的第一件事。",completeCheer:"一周的好好吃饭、好好睡觉，都被身体记住了。健康分会一点点回来，你也是。",tasks:[{day:1,text:"整理就医资料/预约一次该做的检查"},{day:1,text:"今晚比平时早睡 30 分钟"},{day:2,text:"出门散步 20 分钟，晒晒太阳"},{day:3,text:"吃一顿热乎、营养均衡的饭"},{day:4,text:"跟一个信任的人说说近况，不用硬撑"},{day:5,text:"记一笔健康投入（一杯牛奶、一次散步都算）"},{day:6,text:"写下今天身体的一个好变化（哪怕只是睡得好些）"}]},loss:{empathy:"积累暂时放缓不等于清零，你过去走过的路、学过的东西，都还在你身上。",instant:"倒一杯温水，写下：这次失去教会我的一件事。",instantCheer:"能从回落里看出经验，这一笔就没有白白发生。",completeCheer:"你没有假装什么都没发生，而是认真收拾了行装。下一段上坡路，你走得更稳。",tasks:[{day:1,text:"盘点：列出 5 样仍然属于你的积累与资源"},{day:2,text:"写下 3 条具体的止损行动，今天做掉 1 条"},{day:3,text:"重新核对本月预算，找出可以松一口气的空间"},{day:4,text:"在回落复盘里写下原因和下次的预警信号"},{day:5,text:"做一笔小额学习投入（一本书、一节课都行）"},{day:6,text:"运动 30 分钟，用身体的确定感对冲焦虑"},{day:7,text:"和朋友聊聊天，接收一点来自关系的支持"}]},stagnate:{empathy:"躺平的日子不是浪费，是成长在蓄力。不用一下子振作，先从一件 5 分钟的小事重新启动。",instant:"现在选一件 5 分钟内能完成的小事立刻做：叠被子、洗个杯子，或者出门走 5 分钟。",instantCheer:"看，动起来没有那么难。这 5 分钟，就是曲线重新抬头的起点。",completeCheer:"连续 7 天的小动作之后，你已经不在原地了。允许自己慢慢来，但你确实在前进。",tasks:[{day:1,text:"记一笔 0 元投入：今天认真做的任何一件小事"},{day:2,text:"恢复一个以前坚持过的旧习惯，只做最小版本"},{day:3,text:"定一个本周最小目标，小到不可能失败"},{day:4,text:"出门晒太阳 30 分钟，顺便走走"},{day:5,text:"写一句话记录：今天有哪个瞬间还不错？"},{day:6,text:"今晚提前 30 分钟放下手机睡觉"},{day:7,text:"奖励自己一顿好饭，庆祝重新启动的一周"}]}};function at(e){return`${e}_${Date.now().toString(36)}_${Math.floor(Math.random()*1e4).toString(36)}`}function so(e,t,n,o=new Date){const a=Dt[e];return{id:at("rp"),setbackType:e,severity:Math.min(10,Math.max(1,t)),createdAt:o.toISOString(),indexBefore:n,instantText:a.instant,instantDone:!1,tasks:a.tasks.map(i=>({id:at("rt"),text:i.text,day:i.day,done:!1}))}}function ro(e,t=new Date){const n=!e.instantDone,o={...e,instantDone:n,instantDoneAt:n?t.toISOString():void 0};return It(o,t)}function lo(e,t,n=new Date){const o={...e,tasks:e.tasks.map(a=>a.id===t?{...a,done:!a.done,doneAt:a.done?void 0:n.toISOString()}:a)};return It(o,n)}function It(e,t){const n=e.instantDone&&e.tasks.every(o=>o.done);return n&&!e.completedAt?{...e,completedAt:t.toISOString()}:!n&&e.completedAt?{...e,completedAt:void 0}:e}function Et(e){const t=e.tasks.length+1,n=e.tasks.filter(o=>o.done).length+(e.instantDone?1:0);return{done:n,total:t,pct:Math.round(n/t*100),finished:n===t}}function Tt(e){const t=e.recoveryPlans||[];for(let n=t.length-1;n>=0;n--)if(!t[n].completedAt)return t[n];return null}function _e(e,t){const n=[...e.recoveryPlans||[]],o=n.findIndex(a=>a.id===t.id);return o>=0?n[o]=t:n.push(t),{...e,recoveryPlans:n}}function co(e){return Dt[e]}const uo=[{type:"health",words:["健身","私教","体检","医院","看病","挂号","药","跑鞋","跑步鞋","跑步","跑了","公里","散步","快走","骑行","单车","运动","瑜伽","游泳","打球","篮球","羽毛球","足球","健身房","维生素","蛋白","牙医","推拿","按摩","理疗","心理咨询","疫苗","中医"]},{type:"education",words:["书","教材","学费","培训","考研","考公","考编","网课","课程","报名","考试","雅思","托福","学位","补习","辅导","文献","论文","字典","习题","入学","函授","自考"]},{type:"skill",words:["编程","代码","设计","英语","日语","韩语","外语","证书","考证","ppt","PPT","excel","Excel","剪辑","摄影","乐器","吉他","钢琴","驾照","讲座","沙龙","工作坊","训练营","python","Python","java","Java"]},{type:"network",words:["请客","送礼","礼物","红包","随礼","社交","聚会","团建","朋友吃饭","请人","人情"]},{type:"entertainment",words:["电影","游戏","演唱会","旅游","旅行","门票","会员","剧本杀","密室","酒吧","ktv","KTV","奶茶","零食","综艺","视频网站","周边","手办"]}];function po(e){let t=e.match(/(\d+(?:\.\d+)?)\s*(?:万|[wW])(?![A-Za-z0-9.])/);if(t)return Math.round(Number(t[1])*1e4);if(t=e.match(/(\d+(?:\.\d+)?)\s*(?:千|[kK])(?![A-Za-z0-9.])/),t)return Math.round(Number(t[1])*1e3);if(t=e.match(/(\d+(?:\.\d+)?)\s*百/),t)return Math.round(Number(t[1])*100);if(t=e.match(/(\d+(?:\.\d+)?)\s*(?:元|块钱|块|圆|RMB|rmb|¥|￥)/),t)return Math.round(Number(t[1])*100)/100;if(t=e.replace(/\d{1,2}\s*月\s*\d{1,2}\s*[日号]?/g," ").replace(/(?<![\d月])\d{1,2}\s*[日号](?!\d)/g," ").match(/(?<![\d.])(\d+(?:\.\d+)?)(?![\d.])/),t){const o=Number(t[1]);if(o>0)return Math.round(o*100)/100}return null}function vo(e,t=new Date){const n=new Date(t.getFullYear(),t.getMonth(),t.getDate());if(/前天/.test(e))return n.setDate(n.getDate()-2),n;if(/(昨天|昨日|昨晚)/.test(e))return n.setDate(n.getDate()-1),n;if(/(今天|今日|刚刚|刚才|现在)/.test(e))return n;let o=e.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*[日号]?/);if(o){const a=Number(o[1]),i=Number(o[2]);if(a>=1&&a<=12&&i>=1&&i<=31){const r=new Date(n.getFullYear(),a-1,i);return(r.getTime()-n.getTime())/864e5>7&&r.setFullYear(n.getFullYear()-1),r}}if(o=e.match(/(?<![\d月])(\d{1,2})\s*[日号](?!\d)/),o){const a=Number(o[1]);if(a>=1&&a<=31){const i=new Date(n.getFullYear(),n.getMonth(),a);return(i.getTime()-n.getTime())/864e5>7&&i.setMonth(n.getMonth()-1),i}}return null}function mo(e){let t=null;for(const{type:n,words:o}of uo){let a=0;for(const i of o)e.includes(i)&&(a+=i.length>=2?2:1);a>0&&(!t||a>t.score)&&(t={type:n,score:a})}return t?t.type:null}function At(e,t=new Date){const n=(e||"").trim(),o=po(n),a=mo(n),i=vo(n,t);return{amount:o,type:a,date:i,desc:n.length>40?n.slice(0,40):n,matched:{amount:o!==null,type:a!==null,date:i!==null}}}class go{get(t){return localStorage.getItem(t)}set(t,n){localStorage.setItem(t,n)}remove(t){localStorage.removeItem(t)}clear(){localStorage.clear()}}const _=new go,Oe="lifeStockUser",Ct="disclaimerConfirmed",zt="privacyConsent",Ae="sensitiveConsent";function Bt(e){return e.investments=(e.investments||[]).map(t=>({...t,date:new Date(t.date)})),e.setbacks&&(e.setbacks=e.setbacks.map(t=>({...t,date:new Date(t.date)}))),e.journals&&(e.journals=e.journals.map(t=>({...t,date:new Date(t.date)}))),e.habits&&(e.habits=e.habits.map(t=>({...t,createdAt:new Date(t.createdAt)}))),e.todos&&(e.todos=e.todos.map(t=>({...t,createdAt:new Date(t.createdAt),doneAt:t.doneAt?new Date(t.doneAt):void 0}))),e.lifeEvents&&(e.lifeEvents=e.lifeEvents.map(t=>({...t,date:new Date(t.date)}))),e.enhancedSurvey?.completedAt&&(e.enhancedSurvey={...e.enhancedSurvey,completedAt:new Date(e.enhancedSurvey.completedAt)}),e}function x(e){_.set(Oe,JSON.stringify(e))}function fo(){const e=_.get(Oe);if(!e)return null;try{const t=JSON.parse(e);return Bt(wt(t,t.version))}catch{return null}}function yo(){_.remove(Oe)}function ho(){return _.get(zt)==="1"}function bo(){_.set(zt,"1")}function L(){return _.get(Ae)==="1"}function xo(e){e?_.set(Ae,"1"):_.remove(Ae)}function wo(){_.clear()}function $o(){return _.get(Ct)==="1"}function ko(){_.set(Ct,"1")}function So(e){const t={...yn(e),exportTime:new Date().toISOString()},n=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),o=URL.createObjectURL(n),a=document.createElement("a");a.href=o,a.download=`life-index-${e.age}岁-${new Date().toISOString().slice(0,10)}.json`,a.click(),URL.revokeObjectURL(o)}function Mo(e){const t=JSON.parse(e);if(!t.age||!t.history)throw new Error("文件格式不正确");return Bt(wt(t,t.version))}function Do(){s&&So(s)}function Io(e){const t=e.target.files?.[0];if(!t)return;const n=new FileReader;n.onload=o=>{try{s=Mo(o.target.result),x(s),S(),h("✅ 数据已导入")}catch{h("❌ 导入失败：文件格式不正确")}},n.readAsText(t),e.target.value=""}let s=null,Y=0,Q="education",N={},W="quick",ye=[];window.startOnboarding=Ao;window.resumeOnboarding=Co;window.showAnchorModal=Wo;window.showForecastModal=Xo;window.showShareModal=Qo;window.showSetbackModal=Zo;window.showDetailModal=aa;window.showParentModal=ia;window.editProfile=sa;window.resetAll=ra;window.exportData=Do;window.importData=Io;window.handleDeleteAllData=ua;window.closeModal=C;window.showLegalModal=Be;const ce=[{title:"第1步：你今年多大？",desc:"年龄帮我们找到你在人生曲线上的位置",field:"age",type:"number",placeholder:"请输入年龄（1-100）"},{title:"第2步：你来自哪里？",desc:"不同城市的成长成本不太一样",field:"region",type:"select",options:[{value:"tier1",label:"一线城市（北上广深）"},{value:"new_tier1",label:"新一线城市"},{value:"tier2",label:"二线城市"},{value:"tier3",label:"三线及以下"}]},{title:"第3步：家庭条件？",desc:"家庭支持也是成长积累的一部分",field:"income",type:"select",options:[{value:"low",label:"困难"},{value:"below_avg",label:"偏低"},{value:"avg",label:"一般"},{value:"above_avg",label:"较好"},{value:"high",label:"富裕"}]},{title:"第4步：你的学历？",desc:"学历是会跟你一辈子的资产",field:"education",type:"select",options:[{value:"primary",label:"小学"},{value:"junior",label:"初中"},{value:"senior",label:"高中"},{value:"college",label:"大专"},{value:"bachelor",label:"本科"},{value:"master",label:"硕士及以上"}]},{title:"第5步：你的年收入？",desc:"收入是成长力的一部分，填税前年薪就好",field:"annualIncome",type:"number",placeholder:"请输入税前年收入（元），如 120000"},{title:"第6步：收入增长趋势？",desc:"持续增长会让成长更有动力",field:"annualIncomeGrowth",type:"select",options:[{value:"0",label:"下降"},{value:"0.05",label:"稳定"},{value:"0.1",label:"稳步增长"},{value:"0.2",label:"快速增长"}]},{title:"第7步：每周学习时长？",desc:"学习是最值得的自我投入",field:"studyHours",type:"select",options:[{value:"0",label:"几乎不学习"},{value:"2",label:"约2小时"},{value:"5",label:"约5小时"},{value:"10",label:"10小时以上"}]},{title:"第8步：健康状况？",desc:"健康是一切的底座",field:"healthScore",type:"select",options:[{value:"40",label:"较差"},{value:"60",label:"一般"},{value:"75",label:"良好"},{value:"90",label:"优秀"}]},{title:"第9步：负债情况？",desc:"适度负债没关系，留意它的影响就好",field:"debtRatio",type:"select",options:[{value:"0",label:"无负债"},{value:"0.1",label:"少量负债"},{value:"0.3",label:"中等负债"},{value:"0.6",label:"高负债"}]},{title:"第10步：人生节点（可多选）",desc:"已达成的节点都是成长的里程碑",field:"milestones",type:"multi",options:[{value:"hasJob",label:"💼 有工作"},{value:"salaryRaised",label:"💰 涨过薪"},{value:"hasLicense",label:"🚗 有驾照"},{value:"marathon",label:"🏃 跑过马拉松"},{value:"married",label:"💍 已婚"},{value:"hasHouse",label:"🏠 有房"},{value:"hasChild",label:"👶 有孩子"}]}];function Eo(){return L()?ce:ce.filter(e=>e.field!=="annualIncome"&&e.field!=="debtRatio")}function To(){const e=L()?["age","education","region","annualIncome"]:["age","education","region","income"];return ce.filter(t=>e.includes(t.field))}function Pt(){return W==="quick"?To():W==="resume"?ce.filter(e=>ye.includes(e.field)):Eo()}function Ao(e="quick"){Y=0,N={},W=e,ye=[],document.getElementById("landing")?.classList.add("hidden"),qe()}function Co(){if(!s)return;const e=new Set(["age","education","region","area"]);if(s.annualIncome&&s.annualIncome!==1e5&&e.add("annualIncome"),s.income&&s.income!=="avg"&&e.add("income"),ye=ce.map(t=>t.field).filter(t=>!e.has(t)).filter(t=>L()||t!=="annualIncome"&&t!=="debtRatio"),ye.length===0){h("画像已经很完整啦 🌱");return}Y=0,N={},W="resume",qe()}function qe(){const e=Pt(),t=e[Y],n=Y===e.length-1,o=`第 ${Y+1} / ${e.length} 步`,a=t.title.replace(/^第\d+步：/,""),i=$(`${o}：${a}`,t.desc);let r="";t.type==="number"?r=`<input type="number" id="onboardInput" class="form-input" placeholder="${t.placeholder}" style="width:100%;padding:12px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);font-size:16px;">`:t.type==="select"?r=`<select id="onboardInput" style="width:100%;padding:12px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);font-size:16px;">
      ${t.options.map(d=>`<option value="${d.value}">${d.label}</option>`).join("")}
    </select>`:t.type==="multi"&&(r=`<div id="multiOptions" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      ${t.options.map(d=>`<label style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--surface-softer);border-radius:10px;cursor:pointer;"><input type="checkbox" value="${d.value}"> ${d.label}</label>`).join("")}
    </div>`),r+=`<div class="form-actions"><button class="btn-primary" onclick="submitOnboarding()">${n?W==="resume"?"保存并更新曲线":"生成我的成长曲线":"下一步"}</button></div>`,W==="quick"&&!n&&(r+='<div style="text-align:center;margin-top:8px;"><a href="javascript:void(0)" onclick="skipOnboarding()" style="color:var(--text-muted);font-size:13px;text-decoration:underline;">先跳过，用默认值看看</a></div>'),i.querySelector(".modal-body").innerHTML=r}window.submitOnboarding=zo;window.skipOnboarding=Bo;function zo(){const e=Pt(),t=e[Y];if(t.type==="multi")Array.from(document.querySelectorAll("#multiOptions input:checked")).map(o=>o.value).forEach(o=>{N[o]=!0});else{const n=document.getElementById("onboardInput").value;t.type==="number"?N[t.field]=Number(n):N[t.field]=n}Y++,Y>=e.length?Lt():qe()}function Bo(){Lt()}function it(e){return{income:e.income||"avg",annualIncome:L()&&e.annualIncome||1e5,annualIncomeGrowth:Number(e.annualIncomeGrowth??.05),studyHours:Number(e.studyHours??5),healthScore:Number(e.healthScore??75),debtRatio:L()?Number(e.debtRatio??0):0,hasJob:!!e.hasJob,salaryRaised:!!e.salaryRaised,hasLicense:!!e.hasLicense,marathon:!!e.marathon,married:!!e.married,hasHouse:!!e.hasHouse,hasChild:!!e.hasChild}}function Lt(){if(W==="resume"&&s){const n=it(N);Object.assign(s,n),s.quickOnboarded=!1,x(s),C(),S(),h("✅ 画像已更新，曲线更准啦");return}const e=it(N),t=Number(N.age);s={age:t,region:N.region||"tier2",area:"urban",income:e.income,education:N.education||"bachelor",birthYear:new Date().getFullYear()-t,annualIncome:e.annualIncome,annualIncomeGrowth:e.annualIncomeGrowth,studyHours:e.studyHours,healthScore:e.healthScore,debtRatio:e.debtRatio,hasJob:e.hasJob,salaryRaised:e.salaryRaised,hasLicense:e.hasLicense,marathon:e.marathon,married:e.married,hasHouse:e.hasHouse,hasChild:e.hasChild,totalInvest:0,history:cn({age:t,region:N.region||"tier2",area:"urban",income:e.income,education:N.education||"bachelor"}),investments:[],familySupportCapital:0,subjectiveWeight:1,quickOnboarded:W==="quick",version:Pe},x(s),C(),S(),h(L()?"✅ 成长曲线已生成！":"✅ 成长曲线已生成（敏感项使用估算值）"),setTimeout(()=>qt(!0),400)}function S(){if(!s)return;const e=s;document.getElementById("landing")?.classList.add("hidden"),document.getElementById("dashboard")?.classList.remove("hidden");const t=T(e);document.getElementById("dashPrice").textContent=Math.round(t.price).toLocaleString()+" 点";const n=document.getElementById("dashChange");n.textContent=(t.change>=0?"+":"")+t.change+"%",n.style.color=t.change>=0?"var(--accent-green)":"var(--accent-red)",document.getElementById("dashBV").textContent=Math.round(t.bv).toLocaleString()+" 点",document.getElementById("dashEPS").textContent=String(t.eps),document.getElementById("dashROE").textContent=t.roe+"%",document.getElementById("dashPE").textContent=t.pe==="—"?"—":t.pe+"倍";const o=De(e),a=o.level==="high"?"var(--accent-green)":o.level==="medium"?"var(--accent-yellow)":"var(--accent-red)",i=Math.round(o.estimatedRatio*100),r=Math.round(o.potentialEstimatedRatio*100);document.getElementById("dashConfidence").innerHTML=`<span style="color:${a};font-weight:bold;">● ${o.label}</span> 本指数含 ${i}% 估算成分`+(o.level!=="high"?`，<a href="javascript:showSurveyModal()" style="color:var(--accent);font-weight:600;text-decoration:underline;">📋 填强化调查表可降至 ${r}%</a>`:"，真实数据充足")+'<br><a href="javascript:showAnchorModal()" style="color:var(--text-muted);text-decoration:underline;">手动校准</a> · <a href="javascript:showDetailModal()" style="color:var(--text-muted);text-decoration:underline;">数据来源</a>';const l=document.getElementById("surveyBadge");if(l){const m=bt(e);l.innerHTML=m.verifiedYears>0?`<a onclick="showSurveyModal()" style="font-size:12px;font-weight:600;color:var(--accent-green);cursor:pointer;">✓ 已精确化 ${m.verifiedYears}/${m.totalYears} 岁</a>`:'<a onclick="showSurveyModal()" style="font-size:12.5px;font-weight:normal;cursor:pointer;color:var(--accent);">📋 强化调查</a>'}const d=J(e);Yo(d,e);const c=io(t.price,e.priceAlert||{});JSON.stringify(c.alert)!==JSON.stringify(e.priceAlert||{})&&(e.priceAlert=c.alert,x(e)),c.targetNew&&h("🎉 恭喜！成长指数突破目标位"),c.floorNew&&h("🟡 指数回到支撑位附近，正好打开「回落复盘」看看"),ti(e);const u=document.getElementById("investAmount");u&&(L()?(u.placeholder="这笔花了多少（元，仅存本机）",u.disabled=!1):(u.placeholder="未授权金额信息，可只写描述直接添加",u.disabled=!0,u.value=""));const v=document.getElementById("investDate");v&&!v.value&&(v.value=F()),Ye(e),Go(e),We(e),Ht(e),Nt(e),ni(e,t),Ua(e),Qa(e),Na(e),Ke(e),_a(e),qa(e)}let Z=null,me="all",Ce="";window.selectInvestKey=Po;function Po(e){s&&(e.startsWith("custom:")?Z=e.slice(7):(Q=e,Z=null),Ye(s))}function Ge(e){if(Z){const n=(e.customTypes||[]).find(o=>o.id===Z&&!o.archived);if(n)return{key:"custom:"+n.id,label:n.name,icon:n.icon,color:n.color,type:n.baseType,customId:n.id};Z=null}const t=j[Q];return{key:Q,label:t.name,icon:t.icon,color:t.color,type:Q}}function Ye(e){const t=document.getElementById("investTypes");if(!t)return;const n=Ge(e).key;t.innerHTML=te(e).map(o=>`<div class="invest-type ${n===o.key?"selected":""}" data-key="${o.key}" onclick="selectInvestKey('${o.key}')">${o.icon} ${D(o.label)}</div>`).join("")+'<div class="invest-type invest-type-add" onclick="showCustomTypeManager()">＋ 分类</div>'}window.addInvestment=Lo;function Lo(){if(!s)return;const e=s,t=document.getElementById("investAmount"),n=document.getElementById("investDesc"),o=document.getElementById("investDate"),a=L(),i=a?Number(t.value):0;if(a&&t.value&&(!i||i<0)){h("请输入有效金额，或留空仅记录事件");return}const r=Ge(e),l=o&&o.value?K(o.value):new Date;jt({type:r.type,customId:r.customId,amount:i,desc:n.value.trim()||void 0,date:l}),t.value="",n.value="",o&&(o.value=F())}const st={education:"今天学到的，都会在未来替你说话 📚",skill:"又给未来的自己存了一项本事 ✨",health:"好好照顾自己，是最稳的成长投资 💪",network:"关系里的温度，也是成长的养分 🤝",entertainment:"会休息的人，才走得远 🎮",other:"这一笔小努力，被认真记下了 🌱"};function jt(e){if(!s)return;const t=s,n=T(t).price;t.investments.push({type:e.type,customType:e.customId,amount:e.amount,desc:e.desc,date:e.date}),t.totalInvest+=e.amount,x(t);const o=T(t).price;S();const a=o-n,i=st[e.customId?(t.customTypes||[]).find(r=>r.id===e.customId)?.baseType||"other":e.type]||st.other;h(a!==0?`🌱 成长指数 ${n.toFixed(0)} → ${o.toFixed(0)}（${a>0?"+":""}${a.toFixed(0)}）${i}`:`✅ 已记下这笔投入 · ${i}`)}const jo={education:"🎓 教育",skill:"📚 技能",health:"💪 健康",network:"🤝 人脉",entertainment:"🎮 娱乐",other:"📦 其他"};window.smartInvest=Ho;window.previewSmartInvest=Ro;function Ro(){if(!s)return;const e=document.getElementById("smartInvestInput"),t=document.getElementById("smartPreview");if(!t)return;const n=e.value.trim();if(!n){t.innerHTML="";return}const o=At(n),a=L(),i=o.type?jo[o.type]:"🏷️ 用当前分类",r=o.matched.amount?a?`${o.amount.toLocaleString()} 元`:"金额已忽略（未授权）":"只记事件",l=o.date?`${o.date.getMonth()+1}月${o.date.getDate()}日`:"今天";t.innerHTML=`识别为：<b style="color:var(--text-primary);">${i} · ${r} · ${l}</b>，按「记入」保存，不对可在下方表单修改`}function Ho(){if(!s)return;const e=s,t=document.getElementById("smartInvestInput"),n=t.value.trim();if(!n){h("先写一句话，比如：昨天健身课花了 200");return}const o=At(n),a=L();let i=o.type||Q,r;if(o.type)Q=o.type,Z=null,Ye(e);else{const d=Ge(e);i=d.type,r=d.customId}const l=a?o.amount??0:0;jt({type:i,customId:r,amount:l,desc:o.desc||void 0,date:o.date||new Date}),t.value="",document.getElementById("smartPreview").innerHTML=""}window.editInvest=No;window.deleteInvest=_o;function No(e){if(!s)return;const t=s,n=t.investments[e];if(!n)return;const o=L(),a=n.customType?"custom:"+n.customType:n.type,i=$("✏️ 编辑这笔投入","修改日期、分类、金额或描述，指数会按新内容重算");i.querySelector(".modal-body").innerHTML=`
    <label style="font-size:13px;font-weight:bold;">日期</label>
    <input type="date" id="editInvDate" value="${P(new Date(n.date))}" max="${F()}" style="width:100%;margin:6px 0 14px;">
    <label style="font-size:13px;font-weight:bold;">分类</label>
    <div id="editInvTypes" style="display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 14px;">
      ${te(t).map(r=>`<div class="invest-type ${a===r.key?"selected":""}" onclick="document.querySelectorAll('#editInvTypes .invest-type').forEach(x=>x.classList.remove('selected'));this.classList.add('selected');this.parentNode.dataset.key='${r.key}';">${r.icon} ${D(r.label)}</div>`).join("")}
    </div>
    <label style="font-size:13px;font-weight:bold;">金额（元）${o?"":"· 未授权金额，已停用"}</label>
    <input type="number" id="editInvAmount" value="${n.amount||""}" ${o?"":"disabled"} placeholder="可留空，仅记录事件" style="width:100%;margin:6px 0 14px;">
    <label style="font-size:13px;font-weight:bold;">描述</label>
    <input type="text" id="editInvDesc" value="${D(n.desc||"")}" placeholder="可选" style="width:100%;margin:6px 0 14px;">
    <div class="form-actions" style="justify-content:space-between;">
      <button class="dash-btn danger" onclick="deleteInvest(${e})">🗑 删除这笔</button>
      <button class="btn-primary" onclick="saveInvestEdit(${e})">保存</button>
    </div>`,document.getElementById("editInvTypes").dataset.key=a}window.saveInvestEdit=Fo;function Fo(e){if(!s)return;const t=s,n=t.investments[e];if(!n)return;const o=document.getElementById("editInvTypes").dataset.key||n.type,a=te(t).find(d=>d.key===o),i=document.getElementById("editInvDate").value,r=L()?Number(document.getElementById("editInvAmount").value)||0:n.amount,l=document.getElementById("editInvDesc").value.trim();n.date=i?K(i):n.date,n.type=a?a.type:n.type,n.customType=a?.customId,n.amount=r,n.desc=l||void 0,t.totalInvest=t.investments.reduce((d,c)=>d+(c.amount||0),0),x(t),C(),S(),h("✅ 已保存修改")}function _o(e){if(!s)return;const t=s,n=t.investments[e];n&&confirm(`确定删除这笔「${n.desc||_t(t,n).name}」记录吗？`)&&(t.investments.splice(e,1),t.totalInvest=t.investments.reduce((o,a)=>o+(a.amount||0),0),x(t),C(),S(),h("已删除"))}window.setInvestFilter=Oo;function Oo(e){me=e,s&&We(s)}window.setInvestKeyword=qo;function qo(e){Ce=e.trim(),s&&We(s)}function Go(e){const t=q.filter(o=>o.condition(e));document.getElementById("milestoneCount").textContent=`(${t.length}/${q.length})`;const n=document.getElementById("milestoneList");n.innerHTML=q.map(o=>{const a=o.condition(e);return`<div class="milestone-item ${a?"done":""}" style="opacity:${a?1:.5};">
      <span class="m-icon">${o.icon}</span>
      <span class="m-name">${o.name} <span style="font-size:11px;color:var(--text-muted);">${o.desc}</span></span>
      <span class="m-bonus">${a?"✓ +"+o.bonus:"+"+o.bonus}</span>
    </div>`}).join("")}function We(e){const t=document.getElementById("investFilterBar");if(t){const a=[{key:"all",label:"全部"},...te(e)];t.innerHTML=a.map(i=>{const r=("label"in i,i.label),l=i.key;return`<span class="filter-chip ${me===l?"active":""}" onclick="setInvestFilter('${l}')">${r}</span>`}).join("")}const n=document.getElementById("investList");if(e.investments.length===0){n.innerHTML='<div style="text-align:center;color:var(--text-secondary);padding:30px;">还没有投入记录，记一笔试试吧</div>';return}const o=e.investments.map((a,i)=>({inv:a,idx:i,disp:_t(e,a)})).filter(({inv:a,disp:i})=>!(me!=="all"&&(a.customType?"custom:"+a.customType:a.type)!==me||Ce&&!`${a.desc||""}${i.name}`.toLowerCase().includes(Ce.toLowerCase()))).reverse();if(o.length===0){n.innerHTML='<div style="text-align:center;color:var(--text-muted);padding:24px;">没有符合条件的记录</div>';return}n.innerHTML=o.map(({inv:a,idx:i,disp:r})=>`
    <div class="invest-item">
      <span class="i-type" style="${a.customType?`background:${r.color}22;`:""}">${r.icon}</span>
      <div class="i-info">
        <div>${D(a.desc||r.name)} <span style="font-size:10px;color:${r.color};font-weight:bold;">${D(r.name)}</span> ${a.impact?'<span class="i-impact">⭐ 影响大</span>':""}</div>
        <div style="font-size:11px;color:var(--text-muted);">${new Date(a.date).toLocaleDateString("zh-CN")}</div>
      </div>
      <span class="i-amount">${a.amount>0?a.amount.toLocaleString()+" 元":"事件"}</span>
      <span class="i-actions">
        <span class="i-edit" title="编辑" onclick="editInvest(${i})">✏️</span>
      </span>
    </div>
  `).join("")}function Yo(e,t){const n=document.getElementById("klineCanvas");if(!n||e.length<2)return;const o=n.getBoundingClientRect();n.width=o.width*2,n.height=o.height*2;const a=n.getContext("2d");a.scale(2,2);const i=o.width,r=o.height,l={l:50,r:55,t:20,b:40},d=i-l.l-l.r,c=50,u=r-l.t-l.b-c-10,v=l.t+u+10,m=e.map(w=>w.price),p=Math.min(...m)*.95,f=Math.max(...m)*1.05,g=f-p||1,y=Math.max(...e.map(w=>w.invest),1),b=xt(t),I=l.t+u*(1-(b-p)/g),A=e.map((w,E)=>{const B=Math.max(0,E-4);return e.slice(B,E+1).reduce((z,ve)=>z+ve.price,0)/(E-B+1)});a.clearRect(0,0,i,r),a.strokeStyle="rgba(120,95,60,0.12)";for(let w=0;w<=4;w++){const E=l.t+u/4*w;a.beginPath(),a.moveTo(l.l,E),a.lineTo(i-l.r,E),a.stroke(),a.fillStyle="rgba(163,150,132,0.95)",a.font="11px sans-serif",a.fillText(String(Math.round(f-g/4*w)),5,E+4)}const k=d/(e.length-1);I>=l.t&&I<=l.t+u&&(a.strokeStyle="rgba(224,153,47,0.55)",a.lineWidth=1.2,a.setLineDash([6,4]),a.beginPath(),a.moveTo(l.l,I),a.lineTo(i-l.r,I),a.stroke(),a.setLineDash([]),a.fillStyle="#c9871f",a.font="bold 10px sans-serif",a.fillText("同龄人 "+Math.round(b)+" 点",i-l.r+3,I+3));const H=t.priceAlert,Qe=(w,E,B)=>{if(!w||w<p||w>f)return;const z=l.t+u*(1-(w-p)/g);a.strokeStyle=E,a.lineWidth=1.4,a.setLineDash([8,4]),a.beginPath(),a.moveTo(l.l,z),a.lineTo(i-l.r,z),a.stroke(),a.setLineDash([]),a.fillStyle=E,a.font="bold 10px sans-serif",a.fillText(`${B} ${w} 点`,l.l+4,z-4)};Qe(H?.target,"#3fa06a","🎯 目标"),Qe(H?.floor,"#e05c4b","🟡 支撑");const we=a.createLinearGradient(0,l.t,0,l.t+u);we.addColorStop(0,"rgba(255,138,76,0.3)"),we.addColorStop(1,"rgba(255,138,76,0)"),a.beginPath(),a.moveTo(l.l,l.t+u),e.forEach((w,E)=>{const B=l.l+k*E,z=l.t+u*(1-(w.price-p)/g);a.lineTo(B,z)}),a.lineTo(l.l+d,l.t+u),a.closePath(),a.fillStyle=we,a.fill(),a.beginPath(),A.forEach((w,E)=>{const B=l.l+k*E,z=l.t+u*(1-(w-p)/g);E===0?a.moveTo(B,z):a.lineTo(B,z)}),a.strokeStyle="rgba(62,155,143,0.7)",a.lineWidth=1.5,a.setLineDash([4,3]),a.stroke(),a.setLineDash([]),a.beginPath(),e.forEach((w,E)=>{const B=l.l+k*E,z=l.t+u*(1-(w.price-p)/g);E===0?a.moveTo(B,z):a.lineTo(B,z)}),a.strokeStyle="#ff8a4c",a.lineWidth=2.5,a.stroke();const Yt=[0,6,15,18,22,30];e.forEach((w,E)=>{const B=l.l+k*E,z=l.t+u*(1-(w.price-p)/g);Yt.includes(w.age)?(a.beginPath(),a.arc(B,z,5,0,Math.PI*2),a.fillStyle="#3fa06a",a.fill(),a.strokeStyle="#ffffff",a.lineWidth=2,a.stroke()):w.verified&&(a.beginPath(),a.arc(B,z,3.5,0,Math.PI*2),a.fillStyle="rgba(62,155,143,0.25)",a.fill(),a.strokeStyle="#3e9b8f",a.lineWidth=1.5,a.stroke())});const X=e[e.length-1],Ze=l.t+u*(1-(X.price-p)/g);a.fillStyle=X.price>=b?"#3fa06a":"#e05c4b",a.fillRect(i-l.r,Ze-9,50,18),a.fillStyle="#fff",a.font="bold 11px sans-serif",a.textAlign="center",a.fillText(Math.round(X.price)+" 点",i-l.r+25,Ze+4),a.textAlign="left",e.forEach((w,E)=>{const B=l.l+k*E,z=w.invest/y*c,ve=Math.max(1,k*.5);if(a.fillStyle=w.verified?"rgba(62,155,143,0.9)":X.price>=m[0]?"rgba(63,160,106,0.4)":"rgba(224,92,75,0.4)",a.fillRect(B-ve/2,v+c-z,ve,z),w.setback&&E<e.length-1){const Kt=l.t+u*(1-(w.price-p)/g);a.fillStyle="#e05c4b",a.font="11px sans-serif",a.textAlign="center",a.fillText("▼",B,Kt+14),a.textAlign="left"}});const Wt=Math.max(1,Math.floor(e.length/8));a.fillStyle="rgba(163,150,132,0.95)",a.font="11px sans-serif",e.forEach((w,E)=>{(E%Wt===0||E===e.length-1)&&a.fillText(w.age+"岁",l.l+k*E-10,r-l.b+20)}),a.font="10px sans-serif",a.fillStyle="#ff8a4c",a.fillRect(l.l+5,l.t+4,12,3),a.fillStyle="#6f6558",a.fillText("指数",l.l+21,l.t+8),a.fillStyle="#3e9b8f",a.fillRect(l.l+50,l.t+4,12,3),a.fillStyle="#6f6558",a.fillText("MA5",l.l+66,l.t+8),a.fillStyle="#e0992f",a.fillRect(l.l+105,l.t+4,12,3),a.fillStyle="#6f6558",a.fillText("同龄人",l.l+121,l.t+8);const $e=e.some(w=>w.verified),Vt=e.some(w=>w.setback);$e&&(a.fillStyle="#3e9b8f",a.fillRect(l.l+175,l.t+4,12,3),a.fillStyle="#6f6558",a.fillText("真实数据",l.l+191,l.t+8)),Vt&&(a.fillStyle="#e05c4b",a.font="9px sans-serif",a.fillText("▼",l.l+($e?250:175),l.t+8),a.fillStyle="#6f6558",a.font="10px sans-serif",a.fillText("波折",l.l+($e?260:185),l.t+8)),document.getElementById("klineAge").textContent=`（${X.age}岁，当前 ${Math.round(X.price)} 点）`}function $(e,t){const n=document.getElementById("modalContainer");return n.innerHTML=`<div class="modal-overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal" style="position:relative;">
      <button class="modal-close" onclick="closeModal()">×</button>
      <h2>${e}</h2>
      <p class="modal-desc">${t}</p>
      <div class="modal-body"></div>
    </div>
  </div>`,n.querySelector(".modal")}function C(){document.getElementById("modalContainer").innerHTML=""}function h(e){const t=document.createElement("div");t.className="toast",t.textContent=e,document.getElementById("toastContainer").appendChild(t),setTimeout(()=>t.remove(),2500)}function Wo(){if(!s)return;const e=$("🎯 校准指数","用真实数据修正估算，提升指数置信度");e.querySelector(".modal-body").innerHTML=`
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
        <input type="number" id="anchorAge" value="${s.age}" style="width:100%;padding:10px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);margin-bottom:10px;">
        <div class="form-label">该年真实投入（元）</div>
        <input type="number" id="anchorAmount" placeholder="如 30000" style="width:100%;padding:10px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);margin-bottom:10px;">
        <button class="btn-primary" onclick="applyAnchor()" style="width:100%;">应用校准</button>
      </div>

      <!-- B1-2：手动调整家庭支持 -->
      <div style="padding:12px;background:rgba(62,155,143,0.08);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">② 家庭支持（万元，选填）</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">父母/家庭对你的累计投入折算，不折旧、不乘权重，单独计入累计成长值。仅保存在本机。</div>
        <input type="number" id="familyCapital" value="${s.familySupportCapital||0}" step="1" style="width:100%;padding:10px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);margin-bottom:10px;">
        <button class="btn-primary" onclick="applyFamilyCapital()" style="width:100%;">保存家庭支持</button>
      </div>

      <!-- B1-3：标记"对我影响大"的投入 -->
      <div style="padding:12px;background:rgba(255,138,76,0.08);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">③ 标记"对我影响很大"的投入</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">已记录的自我投入中，标记后会在明细页高亮展示（不改变数值，仅反映主观感知）。</div>
        ${s.investments.length===0?'<div style="font-size:12px;color:var(--text-muted);">暂无手动记录的投入。先去「记一笔」添加吧。</div>':s.investments.map((t,n)=>`
            <label style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--surface-softer);border-radius:8px;margin-bottom:6px;cursor:pointer;">
              <input type="checkbox" id="impact_${n}" ${t.impact?"checked":""}>
              <span style="font-size:13px;">${t.desc||t.type} · ${t.amount.toLocaleString()} 元</span>
            </label>
          `).join("")}
        ${s.investments.length>0?'<button class="btn-primary" onclick="applyImpact()" style="width:100%;margin-top:8px;">保存标记</button>':""}
      </div>

      <!-- 主观感知权重 -->
      <div style="padding:12px;background:rgba(63,160,106,0.08);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">④ 主观感知权重（${s.subjectiveWeight||1}）</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">你觉得自己的成长值这个权重吗？1.0 为中性，0.5 偏低、1.5 偏高。这是你的主观判断，不影响客观累计成长值。</div>
        <input type="range" id="subjectiveRange" min="0.5" max="1.5" step="0.05" value="${s.subjectiveWeight||1}" style="width:100%;" oninput="document.getElementById('subjVal').textContent=this.value">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);">
          <span>0.5（偏低）</span><span id="subjVal">${s.subjectiveWeight||1}</span><span>1.5（偏高）</span>
        </div>
        <button class="btn-primary" onclick="applySubjective()" style="width:100%;margin-top:10px;">保存主观权重</button>
      </div>
    </div>
  `}window.applySubjective=Vo;function Vo(){if(!s)return;const e=Number(document.getElementById("subjectiveRange").value);s.subjectiveWeight=an(e),x(s),S(),h("✅ 主观权重已设为 "+s.subjectiveWeight),C()}window.applyFamilyCapital=Ko;function Ko(){if(!s)return;const e=Number(document.getElementById("familyCapital").value);s.familySupportCapital=Math.max(0,e),x(s),S(),h("✅ 家庭支持已更新"),C()}window.applyImpact=Uo;function Uo(){s&&(s.investments=s.investments.map((e,t)=>{const n=document.getElementById("impact_"+t);return{...e,impact:n?.checked||!1}}),x(s),h("✅ 标记已保存"),C())}window.applyAnchor=Jo;function Jo(){if(!s)return;const e=Number(document.getElementById("anchorAge").value),t=Number(document.getElementById("anchorAmount").value),n=s.history.findIndex(o=>o.age===e);if(n>=0){const o=t/s.history[n].invest;s.history=s.history.map(a=>({...a,invest:a.invest*o})),x(s),S(),h("✅ 校准成功！系数 "+o.toFixed(2))}C()}function Xo(){if(!s)return;const t=T(s).price,n=Array.from({length:50},()=>{let a=t;for(let i=0;i<10;i++){const r=.12+(Math.random()-.5)*.3;a*=1+r}return a}).sort((a,i)=>a-i),o=$("🔮 未来展望","基于假设参数的模拟推演，非预测承诺");o.querySelector(".modal-body").innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
      <div style="padding:12px;background:rgba(224,92,75,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">保守 (P10)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-red);">${Math.round(n[5])} 点</div></div>
      <div style="padding:12px;background:rgba(255,138,76,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">中性 (P50)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-blue);">${Math.round(n[25])} 点</div></div>
      <div style="padding:12px;background:rgba(63,160,106,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">乐观 (P90)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-green);">${Math.round(n[45])} 点</div></div>
    </div>
    <p style="color:var(--text-muted);font-size:12px;">假设：年化成长12%，波动率15%，持续学习</p>
  `}function Qo(){if(!s)return;const e=s,t=T(e),n=e.age<18?"萌芽期":e.age<23?"学生期":e.age<29?"职场初期":e.age<36?"职场上升期":e.age<46?"成熟期":"从容期",o=q.filter(c=>c.condition(e)),a=o.filter(c=>!["birth","school","middle","highschool","30"].includes(c.id)),i=(a.length>0?a:o).slice(-1)[0],r=(()=>{const c=new Set;(e.journals||[]).forEach(m=>c.add(P(new Date(m.date)))),(e.investments||[]).forEach(m=>c.add(P(new Date(m.date))));let u=0;const v=new Date;for(;c.has(P(v));)u++,v.setDate(v.getDate()-1);return u})();let l;i&&r===0?l=`今日宜庆祝 · ${i.icon} ${i.name}`:r>=7?l=`今日宜坚持 · 已连续 ${r} 天`:r>=1?l=`今日宜投入 · 已连续 ${r} 天`:t.change<0?l="今日宜休整 · 退一步是为了喘口气":l="今日宜动笔 · 哪怕只写一句话";const d=$("📤 分享","生成一张不暴露数字的成长卡片");d.querySelector(".modal-body").innerHTML=`
    <div style="background:linear-gradient(160deg,#FFE8D6 0%,#FFD9BE 40%,#FFC9A8 100%);padding:28px 24px;border-radius:20px;text-align:center;color:#4A3B2A;box-shadow:0 16px 40px rgba(255,138,76,0.28);max-width:360px;margin:0 auto;aspect-ratio: 9/16;display:flex;flex-direction:column;justify-content:space-between;">
      <div>
        <div style="font-size:13px;color:#A8734D;letter-spacing:3px;font-weight:600;">今日宜长进</div>
        <div style="font-size:11px;color:#C9936A;margin-top:4px;letter-spacing:1px;">成长指数手账</div>
      </div>

      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:18px;">
        <div style="font-size:56px;line-height:1;">${e.avatar||"🌱"}</div>
        <div>
          <div style="font-size:12px;color:#A8734D;margin-bottom:6px;">我的成长阶段</div>
          <div style="font-size:30px;font-weight:bold;color:#4A3B2A;letter-spacing:2px;">${n}</div>
        </div>
        <div style="background:rgba(255,255,255,0.5);border-radius:14px;padding:14px 16px;margin:0 10px;">
          <div style="font-size:12px;color:#A8734D;margin-bottom:6px;">已达成的长进</div>
          <div style="font-size:18px;font-weight:600;color:#4A3B2A;">
            ${i?`${i.icon} ${i.name}`:"正在路上"}
          </div>
          ${o.length>1?`<div style="font-size:11px;color:#A8734D;margin-top:6px;">还有 ${o.length-1} 个里程碑静静发光</div>`:""}
        </div>
        <div style="background:rgba(91,154,111,0.12);border-radius:12px;padding:12px 16px;margin:0 10px;border:1px dashed rgba(91,154,111,0.4);">
          <div style="font-size:15px;font-weight:600;color:#5B9A6F;">${l}</div>
        </div>
      </div>

      <div>
        <div style="font-size:11px;color:#A8734D;line-height:1.7;">成长没有标准答案<br>每一步都算数</div>
        <div style="font-size:9px;color:#C9936A;margin-top:8px;">本卡片不包含任何个人数值 · 仅供自我观察</div>
      </div>
    </div>
    <div style="text-align:center;margin-top:14px;font-size:12px;color:var(--text-muted);">长按或截图即可保存分享</div>
  `}function Zo(){const e=$("💥 记录一段波折","成长有快有慢。记下它，我们会陪你制定一份恢复期行动清单");e.querySelector(".modal-body").innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
      ${[{t:"jobloss",i:"💼",n:"工作变动",d:"降薪/失业"},{t:"illness",i:"🏥",n:"健康风波",d:"身体亮红灯"},{t:"loss",i:"🌧️",n:"失去与回落",d:"积累暂时放缓"},{t:"stagnate",i:"🪫",n:"躺平/断更",d:"暂时停了下来"}].map(t=>`<div class="setback-type" data-type="${t.t}" onclick="selectSetback('${t.t}')" style="padding:12px;background:var(--surface-softer);border-radius:10px;cursor:pointer;text-align:center;"><div style="font-size:24px">${t.i}</div><div style="font-weight:bold;margin-top:4px">${t.n}</div><div style="font-size:11px;color:var(--text-muted)">${t.d}</div></div>`).join("")}
    </div>
    <input type="range" id="setbackSeverity" min="1" max="10" value="5" style="width:100%;accent-color:#C9936A;">
    <div style="text-align:center;color:var(--text-secondary);margin:8px 0;">影响程度：<span id="severityVal">5</span> / 10</div>
    <div style="font-size:12px;color:var(--text-muted);background:var(--surface-softer);border-radius:10px;padding:10px;margin-bottom:14px;line-height:1.7;">记录后不会只看到数字回落——你会立即得到 <b>1 个 60 秒能做的小行动</b> 和一份 <b>7 天恢复期清单</b>，勾选完成即可看到回暖。</div>
    <div class="form-actions"><button class="btn-primary" style="background:linear-gradient(135deg,#C9936A,#A8734D);" onclick="applySetback()">记录并生成恢复计划</button></div>
  `,document.getElementById("setbackSeverity").oninput=t=>{document.getElementById("severityVal").textContent=t.target.value}}let V="";window.selectSetback=e=>{V=e,document.querySelectorAll(".setback-type").forEach(t=>{t.style.outline=t.dataset.type===e?"2px solid #C9936A":"none"})};window.applySetback=ea;function ea(){if(!s||!V){h("先选一个最接近的类型吧");return}const e=Number(document.getElementById("setbackSeverity").value)/10,t=T(s).price;if(V==="jobloss")s.annualIncome=Math.max(0,s.annualIncome*(1-.3*e)),s.annualIncomeGrowth=-.1;else if(V==="illness")s.healthScore=Math.max(20,s.healthScore-30*e),s.debtRatio=Math.min(.8,s.debtRatio+.2*e);else if(V==="loss"){const o=s.totalInvest*.15*e;s.totalInvest=Math.max(0,s.totalInvest-o),s.history=s.history.map(a=>({...a,invest:a.invest*(1-.15*e)}))}else V==="stagnate"&&(s.studyHours=Math.max(0,s.studyHours-2*e));const n=so(V,Math.round(e*10),t);s=_e(s,n),x(s),xe(n.id,t),S()}const ta={jobloss:"💼 工作变动恢复期",illness:"🏥 健康恢复期",loss:"🌧️ 回落调整期",stagnate:"🪫 重新启动期"};window.showRecoveryPlanModal=e=>{s&&xe(e)};window.toggleRecoveryInstant=e=>{s&&na(e)};window.toggleRecoveryTaskItem=(e,t)=>{s&&oa(e,t)};function xe(e,t){if(!s)return;const n=s,o=(n.recoveryPlans||[]).slice().reverse().find(c=>c.id===e)||Tt(n)||(n.recoveryPlans||[])[n.recoveryPlans.length-1];if(!o)return;const a=co(o.setbackType),i=T(n).price,r=Et(o),l=$(ta[o.setbackType]||"🌱 恢复期",a.empathy),d=i-o.indexBefore;l.querySelector(".modal-body").innerHTML=`
    <div style="display:flex;gap:10px;align-items:center;padding:12px 14px;background:var(--surface-softer);border-radius:12px;margin-bottom:14px;">
      <div style="font-size:22px">${d>=0?"🌤️":"🌧️"}</div>
      <div style="flex:1;">
        <div style="font-size:12px;color:var(--text-muted);">记录时成长指数</div>
        <div style="font-weight:bold;font-size:15px;">${o.indexBefore.toFixed(0)} 点 <span style="color:var(--text-muted);font-weight:normal;font-size:12px;">→ 此刻 ${i.toFixed(0)} 点</span></div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:12px;color:var(--text-muted);">恢复进度</div>
        <div style="font-weight:bold;color:#C9936A;">${r.done}/${r.total}</div>
      </div>
    </div>
    <div style="height:8px;background:var(--surface-softer);border-radius:99px;overflow:hidden;margin-bottom:16px;">
      <div style="height:100%;width:${r.pct}%;background:linear-gradient(90deg,#E8B88A,#5B9A6F);border-radius:99px;transition:width .4s;"></div>
    </div>

    <div style="font-size:13px;font-weight:bold;margin-bottom:8px;">⏱️ 现在就做（60 秒）</div>
    <div onclick="toggleRecoveryInstant('${o.id}')" style="display:flex;gap:10px;align-items:flex-start;padding:14px;border-radius:12px;margin-bottom:16px;cursor:pointer;border:1.5px solid ${o.instantDone?"#5B9A6F":"rgba(201,147,106,0.45)"};background:${o.instantDone?"rgba(91,154,111,0.10)":"rgba(255,138,76,0.06)"};">
      <div style="width:22px;height:22px;border-radius:50%;border:2px solid ${o.instantDone?"#5B9A6F":"#C9936A"};flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#5B9A6F;font-size:13px;font-weight:bold;">${o.instantDone?"✓":""}</div>
      <div style="flex:1;">
        <div style="font-size:13.5px;line-height:1.7;${o.instantDone?"text-decoration:line-through;color:var(--text-muted);":""}">${D(o.instantText)}</div>
        ${o.instantDone?`<div style="font-size:12px;color:#5B9A6F;margin-top:6px;">${D(a.instantCheer)}</div>`:'<div style="font-size:11px;color:var(--text-muted);margin-top:6px;">点一下这个卡片，做完就打勾</div>'}
      </div>
    </div>

    <div style="font-size:13px;font-weight:bold;margin-bottom:8px;">🌱 接下来的恢复期（按自己的节奏来）</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
      ${o.tasks.map(c=>`
        <div onclick="toggleRecoveryTaskItem('${o.id}','${c.id}')" style="display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border-radius:10px;cursor:pointer;background:var(--surface-softer);">
          <div style="width:20px;height:20px;border-radius:6px;border:2px solid ${c.done?"#5B9A6F":"#D9C7A8"};flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;background:${c.done?"#5B9A6F":"transparent"};">${c.done?"✓":""}</div>
          <div style="flex:1;font-size:13px;line-height:1.6;${c.done?"text-decoration:line-through;color:var(--text-muted);":""}">${D(c.text)}</div>
          <div style="font-size:11px;color:var(--text-muted);flex-shrink:0;">D${c.day}</div>
        </div>`).join("")}
    </div>

    ${r.finished?`<div style="padding:14px;border-radius:12px;background:linear-gradient(135deg,rgba(91,154,111,0.14),rgba(255,138,76,0.10));font-size:13.5px;line-height:1.8;margin-bottom:14px;">🎉 ${D(a.completeCheer)}</div>`:""}
    <div class="form-actions">
      <button class="dash-btn" onclick="closeModal()">今天先到这里</button>
      <button class="btn-primary" onclick="closeModal()">我会慢慢做完</button>
    </div>
  `,t!==void 0&&d<0&&h(`成长指数 ${t.toFixed(0)} → ${i.toFixed(0)}，退一步是为了喘口气`)}function na(e){if(!s)return;const n=(s.recoveryPlans||[]).find(i=>i.id===e);if(!n)return;const o=ro(n);s=_e(s,o),x(s);const a=!!o.completedAt;xe(e),Ke(s),o.instantDone&&h("🌱 这一步做完，恢复就开始了"),a&&Rt()}function oa(e,t){if(!s)return;const o=(s.recoveryPlans||[]).find(r=>r.id===e);if(!o)return;const a=!!o.completedAt,i=lo(o,t);s=_e(s,i),x(s),xe(e),Ke(s),!a&&i.completedAt&&Rt()}function Rt(){s&&h("🎉 恢复期任务全部完成，欢迎回到上坡路")}function aa(){if(!s)return;const e=s,t=T(e),n=Le(e.age),o=q.filter(c=>c.condition(e)),a={};e.history.forEach(c=>{const u=M.TYPE_WEIGHTS[c.type]||1,v=c.invest/1e4*u*Ie(1,Math.max(0,e.age-c.age),c.type);a[c.type]=(a[c.type]||0)+v});const i={education:"教育",skill:"技能",health:"健康",network:"人脉",entertainment:"娱乐",other:"其他"},r=tn.education_cost,l=Object.keys(M.AGE_SPEND_RANGE),d=$("📋 计算明细","看清每一个数字的来龙去脉");d.querySelector(".modal-body").innerHTML=`
    <div style="font-family:monospace;font-size:13px;line-height:2;">
      <div style="padding:12px;background:rgba(255,138,76,0.1);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;color:var(--accent-blue);margin-bottom:8px;">📐 计算公式</div>
        <div style="color:var(--text-secondary)">成长指数 = (100 + 累计成长值 × 阶段系数 + min(里程碑加成,200)) × 成长系数 × 质量系数 × (1 - 风险折扣) × 主观调整</div>
      </div>
      <div style="padding:12px;background:var(--surface-softer);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;margin-bottom:8px;">② 累计成长值 = ${t.bv.toFixed(2)}（单位：万元口径）</div>
        ${Object.entries(a).map(([c,u])=>`<div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">${i[c]||c}</span><span>${u.toFixed(2)}</span></div>`).join("")}
        ${e.familySupportCapital?`<div style="display:flex;justify-content:space-between;color:var(--accent-purple);"><span>家庭支持（不折旧）</span><span>${e.familySupportCapital}</span></div>`:""}
        <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px;font-weight:bold;">成长值 × 阶段系数 = ${t.bv.toFixed(2)} × ${n.toFixed(2)} = ${(t.bv*n).toFixed(2)}</div>
      </div>

      <!-- A1：数据溯源卡片 -->
      <div style="padding:12px;background:rgba(224,153,47,0.06);border:1px solid rgba(224,153,47,0.2);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;color:var(--accent-yellow);margin-bottom:8px;">🔍 历史投入估算 · 数据溯源</div>
        <div style="font-size:12px;color:var(--text-secondary);line-height:1.8;">
          <div><strong>数据来源：</strong>${r.name}（${r.year}）</div>
          <div><strong>原始口径：</strong>${r.caliber}</div>
          <div><strong>调整系数：</strong>地区 ${M.REGION_COEF[e.region]} × 城乡 ${M.AREA_COEF[e.area]} × 收入 ${M.INCOME_COEF[e.income]}</div>
        </div>
        <!-- A2：参考区间，替代"±4%精度" -->
        <div style="margin-top:10px;padding:10px;background:var(--surface-softer);border-radius:8px;">
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">📊 各阶段年均教育投入参考区间（元）：</div>
          ${l.map(c=>{const u=M.AGE_SPEND_RANGE[c];return`<div style="display:flex;justify-content:space-between;font-size:12px;"><span style="color:var(--text-secondary)">${c}岁</span><span>${u.low.toLocaleString()} ~ ${u.mid.toLocaleString()} ~ ${u.high.toLocaleString()}</span></div>`}).join("")}
          <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">以上为统计估算区间，非精确值。点击「校准指数」可修正为你的真实投入。</div>
        </div>
      </div>

      <div style="padding:12px;background:var(--surface-softer);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;margin-bottom:8px;">③ 里程碑加成 = ${t.milestoneBonus}（封顶 200）</div>
        ${o.map(c=>`<div style="font-size:12px;color:var(--text-secondary)">${c.icon} ${c.name} +${c.bonus}</div>`).join("")}
      </div>
      <div style="padding:12px;background:var(--surface-softer);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;margin-bottom:8px;">④ 系数</div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">成长系数</span><span>${t.growthCoef}</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">质量系数（健康${t.effectiveHealth}）</span><span>${t.qualityCoef}</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">风险折扣（负债率${(e.debtRatio*100).toFixed(0)}%）</span><span>${t.riskDiscount}</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">主观感知权重</span><span>${t.subjectiveAdjust}</span></div>
      </div>

      <!-- 归因分析 -->
      <div style="padding:12px;background:rgba(255,138,76,0.06);border:1px solid rgba(255,138,76,0.2);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;color:var(--accent-blue);margin-bottom:8px;">📊 指数归因 · 每个因子贡献了多少</div>
        ${(()=>{const c=hn(e,t),u=bn(c);return c.map(v=>{const m=v.contribution===0;return`<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid var(--surface-soft);">
              <span style="color:var(--text-secondary);font-size:12px;">${v.name}</span>
              <span style="font-size:12px;">${m?v.reason:`<strong>+${v.contribution}</strong> · ${v.reason}`}</span>
            </div>`}).join("")+(u?`<div style="margin-top:8px;padding:8px;background:rgba(63,160,106,0.08);border-radius:8px;font-size:12px;color:var(--accent-green);">⭐ 最大贡献：${u.name}（+${u.contribution}点）</div>`:"")})()}
      </div>

      <div style="padding:16px;background:linear-gradient(135deg,rgba(255,138,76,0.2),rgba(62,155,143,0.2));border-radius:12px;text-align:center;">
        <div style="color:var(--text-secondary);font-size:12px;">此刻的成长指数</div>
        <div style="font-size:32px;font-weight:bold;color:var(--accent-blue);">${Math.round(t.price)} 点</div>
      </div>
    </div>
    <div style="margin-top:16px;padding:12px;background:rgba(224,153,47,0.08);border-radius:10px;font-size:12px;color:var(--text-secondary);line-height:1.6;">
      温馨提示：以上数值基于模型估算，仅供自我观察与娱乐参考，不构成理财、职业或心理建议，也不预测未来收入。<br>
      本指数<strong>不衡量</strong>幸福感、关系质量、心理健康、创造力与社会贡献——成长没有标准曲线。
    </div>
  `}function ia(){if(!s)return;const e=s.history.reduce((i,r)=>i+r.invest,0),t=s.investments.reduce((i,r)=>i+r.amount,0),n=e+t,o=T(s),a=$("👨‍👩‍👧 家庭视角","家人的每一份支持，都是你成长的底气");a.querySelector(".modal-body").innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
      <div style="padding:14px;background:rgba(62,155,143,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">家庭支持</div><div style="font-size:20px;font-weight:bold;color:var(--accent-purple);">${e.toLocaleString()} 元</div></div>
      <div style="padding:14px;background:rgba(251,146,60,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">自我投入</div><div style="font-size:20px;font-weight:bold;color:#ff8a4c;">${t.toLocaleString()} 元</div></div>
    </div>
    <div style="height:20px;background:var(--surface-soft);border-radius:10px;overflow:hidden;display:flex;">
      <div style="width:${e/n*100}%;background:var(--accent-purple);"></div>
      <div style="width:${t/n*100}%;background:#ff8a4c;"></div>
    </div>
    <div style="margin-top:16px;padding:14px;background:rgba(63,160,106,0.1);border-radius:12px;font-size:13px;color:var(--text-secondary);line-height:1.7;">
      💡 当前 ${s.age} 岁，成长指数已从基准 100 走到 ${Math.round(o.price)} 点。<br>
      ${t===0?'⚠️ 还没有记录自我投入，试试"记一笔"吧！':"继续加油，每一笔自我投入都在为成长添砖加瓦。"}
    </div>
  `}function sa(){h("请重置后重新填写问卷（投入记录会保留）")}function ra(){confirm("确定要重置所有数据吗？")&&(yo(),s=null,Ue=!1,Je=!1,document.getElementById("dashboard")?.classList.add("hidden"),document.getElementById("landing")?.classList.remove("hidden"))}const ze="2026-06-01",la=`
  <div style="font-size:13px;color:var(--text-secondary);line-height:1.9;text-align:left;">
    <p style="color:var(--text-muted);">生效日期：${ze}。最近更新：${ze}。</p>
    <p><strong>一、我们是谁</strong><br>「今日宜长进」（成长指数手账）是一款个人成长记录与自我反思工具，本应用没有后端服务器。</p>
    <p><strong>二、我们收集的信息</strong><br>1. <strong>基础成长信息</strong>：年龄、所在地区、家庭条件区间、学历、学习时长、健康自评、人生节点等，用于生成成长曲线。<br>
    2. <strong>敏感信息（需你单独勾选同意）</strong>：年收入、收入增长、负债情况、家庭支持金额、每笔花费的具体金额。这些信息属于敏感个人信息，仅在你单独勾选「同意收集敏感信息」后才会被记录。</p>
    <p><strong>三、信息存储与使用</strong><br>所有信息默认仅保存在你当前设备的浏览器本地存储（localStorage）中，<strong>不会上传到任何服务器</strong>，本应用不提供账号体系与云端同步。信息仅用于在你本机计算成长指数、绘制成长曲线与生成本地周报。</p>
    <p><strong>四、拒绝授权的影响</strong><br>你可以拒绝提供敏感信息，应用仍可正常使用：收入、负债与金额类字段将使用通用估算值（估算占比会在页面如实标注），你也可以随时改主意并在重新进入时补充真实信息。</p>
    <p><strong>五、未成年人</strong><br>若你未满 14 周岁，请在监护人陪同与同意后使用本应用并填写信息。</p>
    <p><strong>六、如何删除信息</strong><br>你可在「设置」中使用「删除全部数据」一键清除本机所有数据；也可以直接清除浏览器站点数据。删除后数据无法恢复。</p>
    <p><strong>七、联系我们</strong><br>如对本政策有疑问，可通过应用仓库的 Issue 渠道反馈。</p>
  </div>`,ca=`
  <div style="font-size:13px;color:var(--text-secondary);line-height:1.9;text-align:left;">
    <p style="color:var(--text-muted);">生效日期：${ze}。</p>
    <p><strong>一、服务性质</strong><br>「今日宜长进」是个人成长记录与自我反思工具，<strong>不是</strong>金融理财、证券投资、职业咨询、医疗健康或心理咨询服务。成长指数（单位：点）为模型估算数值，仅供娱乐与自我观察。</p>
    <p><strong>二、不构成专业建议</strong><br>应用内的指数、曲线、周报、伙伴对话等内容均由本地规则/模板基于你填写的信息生成，不构成任何理财、证券、职业规划、医疗或心理建议，<strong>不得用于任何投资决策</strong>，也不预测你的未来收入。模型存在误差，页面会标注估算成分与置信度。</p>
    <p><strong>三、情绪与健康提示</strong><br>应用内容不能替代专业心理咨询或医疗诊断。如果你正经历严重的情绪困扰，请及时联系专业人士或拨打心理援助热线（如全国心理援助热线 12356）。</p>
    <p><strong>四、你的内容与数据</strong><br>你填写的所有内容均保存在你的设备本地，由你自行负责保管与备份。导出、分享或在公共设备使用后，请自行删除数据。</p>
    <p><strong>五、合理使用</strong><br>请勿利用本应用从事违法违规活动，或以本应用输出冒充专业意见对外传播。</p>
    <p><strong>六、免责与争议</strong><br>在法律允许的最大范围内，我们不对你因使用或无法使用本应用而产生的间接损失承担责任。与本协议相关的争议，双方应友好协商解决；协商不成的，适用中华人民共和国法律。</p>
  </div>`;function Be(e){const t=e==="privacy",n=$(t?"🔒 隐私政策":"📜 用户协议",t?"请仔细阅读，重点内容已加粗":"使用本应用前请知悉");n.style.maxWidth="560px",n.querySelector(".modal-body").innerHTML=t?la:ca;const o=n.parentElement;o&&(o.style.zIndex="10001")}function da(){if(!ho()){const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`<div class="modal" style="max-width:500px;">
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
    </div>`,document.body.appendChild(e),e.querySelector("#linkPrivacy1").onclick=()=>Be("privacy"),e.querySelector("#linkTerms1").onclick=()=>Be("terms");const t=e.querySelector("#consentPrivacy");t.onclick=()=>{if(!e.querySelector("#consentBase").checked){h("请先勾选并同意《隐私政策》与《用户协议》");return}bo(),xo(e.querySelector("#consentSensitive").checked),e.remove(),rt()};return}rt()}function rt(){if($o())lt();else{const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`<div class="modal" style="max-width:480px;">
      <h2>⚠️ 温馨提示</h2>
      <p style="color:var(--text-secondary);line-height:1.9;margin:16px 0;">
        「今日宜长进」是一款<strong>个人成长记录与自我反思工具</strong>，所有数值均为模型估算，<strong style="color:var(--accent-yellow)">仅供娱乐与自我观察，不构成理财、职业或心理建议，也不预测收入</strong>。<br><br>
        今日宜长进，成长没有标准曲线。
      </p>
      <div class="form-actions"><button class="btn-primary" id="confirmDisclaimer">我知道了</button></div>
    </div>`,document.body.appendChild(e),document.getElementById("confirmDisclaimer").onclick=()=>{ko(),e.remove(),lt()}}}function lt(){const e=fo();e&&(s=e,S())}function ua(){confirm("确定要删除全部数据吗？此操作不可恢复。")&&(wo(),s=null,document.getElementById("dashboard")?.classList.add("hidden"),document.getElementById("landing")?.classList.remove("hidden"),h("✅ 全部数据已删除"))}let le;window.setJournalMood=pa;function pa(e){le=le===e?void 0:e,document.querySelectorAll(".mood-btn").forEach(t=>{t.classList.toggle("selected",t.getAttribute("data-mood")===le)})}window.addJournal=va;function va(){if(!s)return;const e=document.getElementById("journalInput"),t=e.value.trim();if(!t){h("请输入内容");return}const n=wn(t,le);s=$n(s,n),e.value="",le=void 0,document.querySelectorAll(".mood-btn").forEach(o=>o.classList.remove("selected")),x(s),Ht(s),Nt(s),h("✅ 已记录")}function Ht(e){const t=document.getElementById("recentJournals");if(!t)return;const n=kn(e,8);if(n.length===0){t.innerHTML='<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:10px;">还没有记录，写下此刻的想法吧</div>';return}const o={great:"😄",good:"🙂",ok:"😐",low:"😔"};t.innerHTML=n.map(a=>`
    <div class="journal-item">
      <span class="j-mood">${a.mood?o[a.mood]:"📝"}</span>
      <div class="j-content">
        <div>${a.content}</div>
        <div class="j-date">${new Date(a.date).toLocaleString("zh-CN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
      </div>
    </div>
  `).join("")}function Nt(e){const t=He(e),n=document.getElementById("weeklyBadge"),o=document.getElementById("weeklyTip");n&&(n.textContent=t.streakWeeks>0?`🔥 连续 ${t.streakWeeks} 周`:""),o&&(o.textContent=t.message);const a=document.getElementById("weeklyFeedback");if(a){const i=(()=>{const p=new Date,f=p.getDay(),g=f===0?-6:1-f;return p.setDate(p.getDate()+g),p.setHours(0,0,0,0),p})(),r=new Date(i);r.setDate(i.getDate()-7);const l=(p,f,g)=>{const y=new Date(p).getTime();return y>=f.getTime()&&y<g.getTime()},d=(p,f)=>{let g=0;return(e.journals||[]).forEach(y=>{l(new Date(y.date),p,f)&&g++}),(e.investments||[]).forEach(y=>{l(new Date(y.date),p,f)&&g++}),g},c=d(i,new Date(i.getTime()+7*864e5)),u=d(r,i);let v,m;u===0&&c>0?(v=`🌱 这周已经动笔 ${c} 次，比上周更在状态了`,m="var(--accent-green)"):c>u?(v=`📈 本周 ${c} 次记录，比上周多 ${c-u} 次，稳稳向上`,m="var(--accent-green)"):c===u&&c>0?(v=`🌤️ 本周 ${c} 次记录，和上周一样稳，保持也是一种前进`,m="var(--accent-yellow)"):c===0&&u>0?(v=`☕ 这周还没动笔，上周有 ${u} 次——今天写一句就好`,m="var(--accent-orange)"):(v="✍️ 写下第一句，本周的成长山坡就开始了",m="var(--accent-orange)"),a.textContent=v,a.style.color=m}}window.showDrawdownModal=ma;function ma(){if(!s)return;const e=T(s),t=J(s),n=Sn(t,e.price),o=Mn(s),a=$("📉 成长回落复盘","复盘是为了觉察，不是自责");a.querySelector(".modal-body").innerHTML=`
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
        ${n.suggestions.map(i=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${i}</div>`).join("")}
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">🤔 自问</div>
        ${o.map(i=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${i}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">回落是成长的正常阶段，不必焦虑，重在觉察与调整</div>
  `}window.showGoalModal=ga;function ga(){if(!s)return;const e=T(s),t=$("🏁 目标反推","设定目标，反推所需投入");t.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">🏁</div>
        <div style="font-size:22px;font-weight:bold;margin-top:8px;">目标反推</div>
        <div style="font-size:13px;color:var(--text-muted);margin-top:4px;">当前指数 ${Math.round(e.price)}，设定目标看看需要多少投入</div>
      </div>
      <div style="margin-bottom:16px;">
        <label style="font-size:13px;color:var(--text-secondary);">目标成长指数（点）</label>
        <input type="number" id="goalTarget" value="${Math.round(e.price*1.5)}" style="width:100%;padding:12px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);margin-top:6px;font-size:18px;">
      </div>
      <button class="btn-primary" onclick="calcGoal()" style="width:100%;padding:14px;font-size:16px;">反推所需投入</button>
      <div id="goalResult"></div>
  `}window.calcGoal=fa;function fa(){if(!s)return;const e=Number(document.getElementById("goalTarget").value);if(!e||e<=0){h("请输入有效目标");return}const t=Dn(s,e),n=document.getElementById("goalResult");n.innerHTML=`
    <div style="margin-top:20px;background:var(--surface-soft);border-radius:12px;padding:16px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
        <div class="metric"><div class="metric-label">目标成长指数</div><div class="metric-value">${t.target} 点</div></div>
        <div class="metric"><div class="metric-label">此刻成长指数</div><div class="metric-value">${t.current} 点</div></div>
        <div class="metric"><div class="metric-label">还差</div><div class="metric-value" style="color:var(--accent-blue);">${t.gap} 点</div></div>
        <div class="metric"><div class="metric-label">还需成长值（粗估）</div><div class="metric-value">约 ${t.additionalInvest} 点</div></div>
      </div>
      <div style="font-size:14px;color:var(--text-secondary);line-height:1.8;">
        ${t.suggestions.map(o=>`<div>• ${o}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">${t.confidence}</div>
    </div>
  `}window.showReportModal=ya;function ya(){if(!s)return;const e=J(s),t=kt(s,e),n=t.avgMood===null?"暂无":t.avgMood>=3.5?"😄 很好":t.avgMood>=2.5?"🙂 不错":t.avgMood>=1.5?"😐 一般":"😔 偏低",o=$("📊 月度成长报告",t.month+" 月报");o.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">📊</div>
        <div style="font-size:22px;font-weight:bold;margin-top:8px;">${t.month} 成长月报</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">月内变化</div><div class="metric-value" style="color:${t.changePoints>=0?"var(--accent-green)":"var(--accent-orange)"}">${t.changePoints>=0?"+":""}${t.changePoints}</div></div>
        <div class="metric"><div class="metric-label">投入笔数</div><div class="metric-value">${t.investCount}</div></div>
        <div class="metric"><div class="metric-label">记录天数</div><div class="metric-value">${t.journalDays}</div></div>
        <div class="metric"><div class="metric-label">实际花费（仅记录）</div><div class="metric-value">${t.investAmount.toLocaleString()} 元</div></div>
        <div class="metric"><div class="metric-label">月初指数</div><div class="metric-value">${t.startPrice}</div></div>
        <div class="metric"><div class="metric-label">月末指数</div><div class="metric-value">${t.endPrice}</div></div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;">⭐ 本月亮点</div>
        ${t.highlights.length>0?t.highlights.map(a=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${a}</div>`).join(""):'<div style="font-size:13px;color:var(--text-muted);">继续积累，下个月会更好</div>'}
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">📌 下月建议</div>
        ${t.suggestions.map(a=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${a}</div>`).join("")}
      </div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:16px;text-align:center;">平均情绪：${n} · 报告仅基于你的记录生成，不代表客观评价</div>
  `}window.showRadarModal=ha;function ha(){if(!s)return;const e=be(s),t={education:"#ff8a4c",skill:"#f5a623",health:"#3fa06a",network:"#3e9b8f",entertainment:"#e0705b",other:"#a79b8c"},n='<canvas id="radarCanvas" width="300" height="300" style="display:block;margin:0 auto;"></canvas>',o=$("🎯 投入结构雷达","看看你的成长积累分布是否均衡");o.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:16px;">${n}</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:16px;">
        ${e.dimensions.map(a=>`<div style="font-size:12px;color:var(--text-secondary);"><span style="color:${t[a.type]}">●</span> ${a.label.split(" ")[1]}: ${a.amount.toLocaleString()} 元</div>`).join("")}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
        <div class="metric"><div class="metric-label">均衡度</div><div class="metric-value">${Math.round(e.balance*100)}%</div></div>
        <div class="metric"><div class="metric-label">最突出</div><div class="metric-value">${e.dimensions.find(a=>a.type===e.dominant)?.label.split(" ")[1]}</div></div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 结构建议</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">
          ${e.balance>=.6?"投入结构较均衡，继续保持多维发展。":`${e.dimensions.find(a=>a.type===e.weakest)?.label}维度投入较少，可适当增加。`}
          健康是一切成长的底座，建议保持健康维度的持续投入。
        </div>
      </div>
  `,setTimeout(()=>ba(e),50)}function ba(e,t){const n=document.getElementById("radarCanvas");if(!n)return;const o=n.getContext("2d"),a=150,i=150,r=110;o.clearRect(0,0,300,300);const l=e.dimensions,d=l.length;for(let c=1;c<=4;c++){o.beginPath();for(let u=0;u<d;u++){const v=Math.PI*2*u/d-Math.PI/2,m=r*c/4,p=a+m*Math.cos(v),f=i+m*Math.sin(v);u===0?o.moveTo(p,f):o.lineTo(p,f)}o.closePath(),o.strokeStyle="rgba(120,95,60,0.16)",o.stroke()}for(let c=0;c<d;c++){const u=Math.PI*2*c/d-Math.PI/2;o.beginPath(),o.moveTo(a,i),o.lineTo(a+r*Math.cos(u),i+r*Math.sin(u)),o.strokeStyle="rgba(120,95,60,0.2)",o.stroke()}o.beginPath();for(let c=0;c<d;c++){const u=Math.PI*2*c/d-Math.PI/2,v=l[c].value/100,m=a+r*v*Math.cos(u),p=i+r*v*Math.sin(u);c===0?o.moveTo(m,p):o.lineTo(m,p)}o.closePath(),o.fillStyle="rgba(255,138,76,0.3)",o.fill(),o.strokeStyle="#ff8a4c",o.lineWidth=2,o.stroke(),o.fillStyle="#5c5246",o.font="12px sans-serif",o.textAlign="center";for(let c=0;c<d;c++){const u=Math.PI*2*c/d-Math.PI/2,v=a+(r+20)*Math.cos(u),m=i+(r+20)*Math.sin(u);o.fillText(l[c].label.split(" ")[1],v,m+4)}}window.showDepreciationModal=xa;function xa(){if(!s)return;const e=T(s),t=Math.round(s.annualIncome*.1/12),n=En(s,10,t),o=$("📉 折旧推演","看看你的成长积累随时间如何变化");o.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:16px;">
        <div style="font-size:14px;color:var(--text-muted);">假设每年新增自我花费约 ${t.toLocaleString()} 元（估算口径）</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">当前成长值</div><div class="metric-value">${Math.round(e.bv)}</div></div>
        <div class="metric"><div class="metric-label">5 年后</div><div class="metric-value" style="color:${n.bv5y>=e.bv?"var(--accent-green)":"var(--accent-orange)"}">${n.bv5y}</div></div>
        <div class="metric"><div class="metric-label">10 年后</div><div class="metric-value" style="color:${n.bv10y>=e.bv?"var(--accent-green)":"var(--accent-orange)"}">${n.bv10y}</div></div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;">📈 10 年趋势</div>
        ${n.points.map(a=>`<div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary);line-height:1.8;"><span>${a.age} 岁</span><span>成长值 ${a.bv}（自然衰减 -${a.depreciation}，新增 +${a.newInvest}）</span></div>`).join("")}
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 建议</div>
        ${n.suggestions.map(a=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${a}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">年折旧率约 ${n.annualDecayRate*100}%，仅作趋势参考</div>
  `}window.showScenarioModal=wa;function wa(){if(!s)return;const e=Tn(s),t=$("🎲 情景模拟","不同节奏下，你的指数会怎样");t.querySelector(".modal-body").innerHTML=`
      ${e.map(n=>`
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
  `}window.showFamilyModal=$a;function $a(){if(!s)return;const e=An(s),t=$("👨‍👩‍👧 家庭账本","记录家庭/父母的支持，看见成长背后的力量");t.querySelector(".modal-body").innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">累计家庭支持</div><div class="metric-value">${e.totalSupport} 万</div></div>
        <div class="metric"><div class="metric-label">占总积累比</div><div class="metric-value">${Math.round(e.supportRatio*100)}%</div></div>
      </div>
      <div style="margin-bottom:16px;">
        <label style="font-size:13px;color:var(--text-secondary);">家庭支持（万元，选填，仅存本机）</label>
        <input type="number" id="familySupportInput" value="${e.totalSupport}" style="width:100%;padding:10px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);margin-top:6px;">
      </div>
      <button class="btn-primary" onclick="saveFamilySupport()" style="width:100%;padding:12px;">保存</button>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-top:16px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 说明</div>
        ${e.suggestions.map(n=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${n}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">家庭支持不折旧、不乘权重，单独计入成长值，不参与主观调整</div>
  `}window.saveFamilySupport=ka;function ka(){if(!s)return;const e=Number(document.getElementById("familySupportInput").value)||0;s.familySupportCapital=e,x(s),S(),h("✅ 家庭支持已更新"),C()}window.showAIWeeklyModal=Sa;function Sa(){if(!s)return;const e=Cn(s),t=$("📝 本周周报","基于你的记录由模板在本地生成，不上传数据");t.querySelector(".modal-body").innerHTML=`
      <div style="background:linear-gradient(135deg,rgba(255,138,76,0.15),rgba(62,155,143,0.15));border-radius:12px;padding:16px;margin-bottom:16px;">
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">${e.week}</div>
        <div style="font-size:16px;font-weight:600;line-height:1.6;">${e.summary}</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:8px;">${e.moodNote}</div>
      </div>
      ${e.highlights.length>0?`<div style="background:rgba(63,160,106,0.1);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;color:var(--accent-green);">⭐ 本周亮点</div>
        ${e.highlights.map(n=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${n}</div>`).join("")}
      </div>`:""}
      ${e.improvements.length>0?`<div style="background:rgba(224,153,47,0.08);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;color:var(--accent-yellow);">🔍 待改进</div>
        ${e.improvements.map(n=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${n}</div>`).join("")}
      </div>`:""}
      <div style="background:rgba(255,138,76,0.08);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;color:var(--accent-blue);">🎯 下周行动</div>
        ${e.actions.map(n=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${n}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">周报由规则引擎在本地生成，不调用任何外部 AI 服务，不上传你的数据</div>
  `}window.showAnnualModal=Ma;function Ma(){if(!s)return;const e=J(s),t=zn(s,e),n=t.avgMood===null?"暂无":t.avgMood>=3.5?"😄 很好":t.avgMood>=2.5?"🙂 不错":t.avgMood>=1.5?"😐 一般":"😔 偏低",o=$("🎊 年度报告",`${t.year} 年成长总结`);o.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">🎊</div>
        <div style="font-size:24px;font-weight:bold;margin-top:8px;">${t.year} 年报</div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:20px;">
        ${t.keywords.map(a=>`<span style="padding:6px 14px;border-radius:20px;background:rgba(255,138,76,0.15);font-size:13px;">${a}</span>`).join("")}
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:16px;margin-bottom:16px;text-align:center;">
        <div style="font-size:14px;color:var(--text-muted);">年度指数变化</div>
        <div style="font-size:32px;font-weight:bold;color:${t.changePoints>=0?"var(--accent-green)":"var(--accent-orange)"}">${t.changePoints>=0?"+":""}${t.changePoints}</div>
        <div style="font-size:13px;color:var(--text-muted);">${t.startPrice} → ${t.endPrice}（${t.changePct>=0?"+":""}${t.changePct}%）</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
        <div class="metric"><div class="metric-label">年度实际花费</div><div class="metric-value">${t.totalInvest.toLocaleString()} 元</div></div>
        <div class="metric"><div class="metric-label">投入笔数</div><div class="metric-value">${t.investCount}</div></div>
        <div class="metric"><div class="metric-label">里程碑</div><div class="metric-value">${t.milestoneCount}</div></div>
        <div class="metric"><div class="metric-label">记录天数</div><div class="metric-value">${t.journalDays}</div></div>
        <div class="metric"><div class="metric-label">平均情绪</div><div class="metric-value" style="font-size:16px;">${n}</div></div>
        <div class="metric"><div class="metric-label">均衡度</div><div class="metric-value">${t.milestoneCount>0?"良好":"—"}</div></div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;">📖 年度总结</div>
        <div style="font-size:14px;color:var(--text-secondary);line-height:1.8;">${t.summary}</div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">🌱 下年度方向</div>
        ${t.nextYearPlan.map(a=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${a}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">年报基于你的记录生成，是回顾也是鼓励，不是评价</div>
  `}window.showPeerModal=Da;function Da(){if(!s)return;const e=T(s),t=xt(s),n=e.bv,o=n-t,a=t>0?Math.round(o/t*100):0,i=$("👥 同路人","看看相似背景的成长者们大致在哪里（匿名统计锚点）");i.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">👥</div>
        <div style="font-size:18px;font-weight:600;margin-top:8px;">你不是一个人在成长</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
        <div class="metric"><div class="metric-label">你的成长积累</div><div class="metric-value">${Math.round(n)}</div></div>
        <div class="metric"><div class="metric-label">同类锚点（估算）</div><div class="metric-value">${Math.round(t)}</div></div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:16px;margin-bottom:16px;text-align:center;">
        <div style="font-size:14px;color:var(--text-muted);">相对同类锚点</div>
        <div style="font-size:28px;font-weight:bold;color:${o>=0?"var(--accent-green)":"var(--accent-orange)"};margin-top:6px;">${o>=0?"+":""}${a}%</div>
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
  `}window.showChallengeModal=Ia;function Ia(){if(!s)return;const e=Ne(s),t=Bn(s),n=$("🎯 成长挑战","完成挑战，见证坚持的力量");n.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">🎯</div>
        <div style="font-size:22px;font-weight:bold;margin-top:8px;">挑战完成度 ${t}%</div>
      </div>
      ${e.map(o=>`
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
  `}window.showMentorModal=Ea;function Ea(){if(!s)return;const e=Pn(s),t=$("🌱 成长伙伴",e.persona);t.querySelector(".modal-body").innerHTML=`
      <div style="background:linear-gradient(135deg,rgba(255,138,76,0.12),rgba(62,155,143,0.12));border-radius:12px;padding:16px;margin-bottom:16px;">
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:6px;">${e.greeting}</div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;">👁️ 我观察到</div>
        ${e.observations.map(n=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${n}</div>`).join("")}
      </div>
      <div style="background:rgba(255,138,76,0.08);border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="font-weight:600;margin-bottom:8px;color:var(--accent-blue);">💡 我的建议</div>
        ${e.advices.map(n=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${n}</div>`).join("")}
      </div>
      <div style="background:rgba(63,160,106,0.1);border-radius:12px;padding:14px;text-align:center;">
        <div style="font-size:14px;color:var(--accent-green);font-style:italic;line-height:1.6;">${e.encouragement}</div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">伙伴建议由规则模板生成，仅作自我反思参考，不是专业心理咨询；如遇严重情绪困扰，请拨打心理援助热线 12356。<br>最终决定权，始终在你手中。</div>
  `}let ge="terms";window.showMicroModal=Ft;function Ft(){if(!s)return;const t=$("📚 微课","学习成长术语，理解你的指数").querySelector(".modal-body"),n=()=>`
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${Ln.map(a=>`
        <div style="background:var(--surface-soft);border-radius:12px;padding:14px;cursor:pointer;" onclick="this.querySelector('.term-detail').style.display=this.querySelector('.term-detail').style.display==='none'?'block':'none'">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:22px;">${a.icon}</span>
            <div style="flex:1;">
              <div style="font-weight:600;">${a.term} <span style="font-size:11px;color:var(--text-muted);font-weight:normal;">[${a.category}]</span></div>
              <div style="font-size:12px;color:var(--text-muted);">${a.short}</div>
            </div>
            <span style="font-size:12px;color:var(--text-muted);">▼</span>
          </div>
          <div class="term-detail" style="display:none;margin-top:10px;font-size:13px;color:var(--text-secondary);line-height:1.7;border-top:1px solid var(--border);padding-top:10px;">${a.detail}</div>
        </div>
      `).join("")}
    </div>
  `,o=()=>`
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${jn.map(a=>`
        <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
          <div style="font-weight:600;margin-bottom:4px;">${a.stage} <span style="font-size:12px;color:var(--text-muted);font-weight:normal;">${a.ageRange}</span></div>
          <div style="font-size:13px;color:var(--accent-blue);margin-bottom:8px;">重心：${a.focus}</div>
          ${a.tips.map(i=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.7;">• ${i}</div>`).join("")}
        </div>
      `).join("")}
    </div>
  `;t.innerHTML=`
    <div style="display:flex;gap:8px;margin-bottom:16px;">
      <button class="btn-primary" onclick="switchMicroTab('terms')" id="tab-terms" style="flex:1;${ge==="terms"?"":"opacity:0.6;"}">📖 术语卡</button>
      <button class="btn-primary" onclick="switchMicroTab('stages')" id="tab-stages" style="flex:1;${ge==="stages"?"":"opacity:0.6;"}">🧭 阶段指南</button>
    </div>
    <div id="microContent">${ge==="terms"?n():o()}</div>
  `}window.switchMicroTab=Ta;function Ta(e){ge=e,Ft()}let U=0;window.showGratitudeModal=Ve;function Ve(){if(!s)return;const e=St(s,U),t=fe(),n=$("💌 感恩卡片","亲子连接 · 表达感谢");n.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:16px;">
        <div style="font-size:48px;">💌</div>
      </div>
      <div style="background:linear-gradient(135deg,rgba(224,153,47,0.1),rgba(224,92,75,0.1));border-radius:16px;padding:24px;margin-bottom:16px;border:1px solid rgba(224,153,47,0.2);">
        <div style="font-size:18px;font-weight:bold;margin-bottom:16px;text-align:center;color:var(--accent-yellow);">${e.title}</div>
        <div style="font-size:15px;line-height:2;color:var(--text-secondary);text-align:center;">${e.content}</div>
        <div style="font-size:13px;color:var(--text-muted);text-align:right;margin-top:20px;">${e.signature}</div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:12px;">
        <button class="btn-primary" onclick="prevGratitude()" style="flex:1;opacity:0.8;">← 上一张</button>
        <button class="btn-primary" onclick="nextGratitude()" style="flex:1;opacity:0.8;">下一张 →</button>
      </div>
      <button class="btn-primary" onclick="copyGratitude()" style="width:100%;padding:12px;">📋 复制卡片内容</button>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">第 ${U+1}/${t} 张 · 卡片内容可自由编辑后发送给家人</div>
  `}window.nextGratitude=Aa;function Aa(){s&&(U=(U+1)%fe(),Ve())}window.prevGratitude=Ca;function Ca(){s&&(U=(U-1+fe())%fe(),Ve())}window.copyGratitude=za;function za(){if(!s)return;const e=St(s,U),t=`${e.title}

${e.content}

${e.signature}`;navigator.clipboard.writeText(t).then(()=>{h("✅ 已复制，可粘贴发给家人")}).catch(()=>{h("复制失败，请手动选择文本")})}window.showExportReportModal=Ba;function Ba(){if(!s)return;const e=J(s),t=Fe(s,e),n=$("📄 导出成长报告","生成纯文本报告，可保存或分享");n.querySelector(".modal-body").innerHTML=`
      <div style="background:var(--surface-soft);border-radius:12px;padding:16px;margin-bottom:16px;max-height:400px;overflow-y:auto;">
        <pre style="font-family:monospace;font-size:12px;line-height:1.6;white-space:pre-wrap;color:var(--text-secondary);">${t}</pre>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn-primary" onclick="copyReport()" style="flex:1;padding:12px;">📋 复制文本</button>
        <button class="btn-primary" onclick="downloadReport()" style="flex:1;padding:12px;">⬇️ 下载 .txt</button>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">报告内容均来自你的本地数据，不包含任何个人身份信息</div>
  `}window.copyReport=Pa;function Pa(){if(!s)return;const e=J(s),t=Fe(s,e);navigator.clipboard.writeText(t).then(()=>h("✅ 报告已复制")).catch(()=>h("复制失败"))}window.downloadReport=La;function La(){if(!s)return;const e=J(s),t=Fe(s,e),n=new Blob([t],{type:"text/plain;charset=utf-8"}),o=URL.createObjectURL(n),a=document.createElement("a");a.href=o,a.download=`成长报告_${new Date().toISOString().slice(0,10)}.txt`,a.click(),URL.revokeObjectURL(o),h("✅ 报告已下载")}function D(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function ja(e){return(e.customTypes||[]).filter(t=>!t.archived)}function te(e){const t=Object.keys(j).map(o=>({key:o,label:j[o].name,icon:j[o].icon,color:j[o].color,type:o})),n=ja(e).map(o=>({key:"custom:"+o.id,label:o.name,icon:o.icon,color:o.color,type:o.baseType,customId:o.id}));return[...t,...n]}function _t(e,t){if(t.customType){const o=(e.customTypes||[]).find(a=>a.id===t.customType);if(o)return{icon:o.icon,name:o.name,color:o.color}}const n=j[t.type]||j.other;return{icon:n.icon,name:n.name,color:n.color}}window.selectChip=function(e,t,n){const o=document.getElementById(e);o.querySelectorAll(".picker-chip").forEach(a=>a.classList.remove("selected")),t.classList.add("selected"),o.dataset.value=n};function ee(e,t,n,o){return`<div id="${e}" class="${o}-picker picker-row" data-value="${D(n)}">
    ${t.map(a=>{const i=a===n,r=o==="color"?`<span class="color-dot" style="background:${a}"></span>`:a;return`<span class="picker-chip ${i?"selected":""}" onclick="selectChip('${e}',this,'${a}')">${r}</span>`}).join("")}
  </div>`}const Ra=["📦","📖","🎨","🎸","💻","🌱","🧠","🙏","☕","🚶","🧩","🗼"],Ot=["#ff8a4c","#f5a623","#3fa06a","#3e9b8f","#e0705b","#7d8cf6","#b06fd0","#a79b8c"];window.showCustomTypeManager=ue;function ue(e){if(!s)return;const t=s,n=e?(t.customTypes||[]).find(i=>i.id===e):null,o=Object.keys(j).map(i=>`<option value="${i}" ${n?.baseType===i?"selected":""}>${j[i].icon} ${j[i].name}（计入${j[i].name}维度）</option>`).join(""),a=$("🏷️ 自定义分类","新增你自己的投入分类；它会归入一个内置维度参与指数计算");a.querySelector(".modal-body").innerHTML=`
    <div id="ctList" style="display:flex;flex-direction:column;gap:8px;margin-bottom:18px;">
      ${(t.customTypes||[]).length===0?'<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:8px;">还没有自定义分类</div>':""}
      ${(t.customTypes||[]).map(i=>`
        <div class="ct-row ${i.archived?"archived":""}">
          <span class="ct-icon" style="background:${i.color}22;color:${i.color}">${i.icon}</span>
          <span class="ct-name">${D(i.name)} <small>→ ${j[i.baseType].name}</small></span>
          <span class="ct-ops">
            ${i.archived?`<a onclick="ctRestore('${i.id}')">恢复</a> <a class="danger-link" onclick="ctDelete('${i.id}')">彻底删除</a>`:`<a onclick="showCustomTypeManager('${i.id}')">编辑</a> <a onclick="ctArchive('${i.id}')">归档</a>`}
          </span>
        </div>`).join("")}
    </div>
    <div class="sub-form" id="ctForm">
      <div style="font-weight:bold;margin-bottom:10px;">${n?"编辑分类":"新建分类"}</div>
      <input type="text" id="ctName" placeholder="分类名称，如：日语课 / 考研 / 马拉松" value="${D(n?.name||"")}" style="width:100%;margin-bottom:10px;">
      <label class="field-label">图标</label>
      ${ee("ctIcon",Ra,n?.icon||"📦","emoji")}
      <label class="field-label">颜色</label>
      ${ee("ctColor",Ot,n?.color||"#ff8a4c","color")}
      <label class="field-label">归入维度（影响权重与折旧）</label>
      <select id="ctBase" style="width:100%;margin:6px 0 14px;">${o}</select>
      <div class="form-actions">
        ${n?'<button class="dash-btn" onclick="showCustomTypeManager()">取消</button>':""}
        <button class="btn-primary" onclick="ctSave('${n?.id||""}')">${n?"保存修改":"＋ 添加分类"}</button>
      </div>
    </div>`}window.ctSave=function(e){if(!s)return;const t=document.getElementById("ctName").value.trim();if(!t){h("请填写分类名称");return}const n=document.getElementById("ctIcon").dataset.value||"📦",o=document.getElementById("ctColor").dataset.value||"#ff8a4c",a=document.getElementById("ctBase").value,i=s.customTypes||(s.customTypes=[]);if(e){const r=i.find(l=>l.id===e);r&&Object.assign(r,{name:t,icon:n,color:o,baseType:a})}else{if(i.some(r=>r.name===t&&!r.archived)){h("已有同名分类");return}i.push({id:"ct_"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:t,icon:n,color:o,baseType:a})}x(s),ue(),S(),h("✅ 分类已保存")};window.ctArchive=function(e){if(!s)return;const t=s.customTypes.find(n=>n.id===e);t&&(t.archived=!0),x(s),ue(),S()};window.ctRestore=function(e){if(!s)return;const t=s.customTypes.find(n=>n.id===e);t&&(t.archived=!1),x(s),ue(),S()};window.ctDelete=function(e){s&&confirm("彻底删除后，相关记录会回到它归入的内置分类下，确定吗？")&&(s.customTypes=(s.customTypes||[]).filter(t=>t.id!==e),s.investments.forEach(t=>{t.customType===e&&(t.customType=void 0)}),x(s),ue(),S())};const Ha=["🌱","☀️","🌙","⭐","🔥","🍀","🌻","🍊","🐱","🐰","🦊","🐻","🐼","🐨","🦁","🐯","🐸","🐵","🦉","🐳","🎈","💎","🚀","🏔️"];window.showProfileModal=qt;function qt(e=!1){if(!s)return;const t=s,n=$(e?"👋 打造你的专属名片":"👤 个性化名片",e?'给自己起个名字、选个头像，让这只"成长指数"真正属于你（可跳过）':"昵称、头像与指数名称会出现在仪表盘和分享卡上");n.querySelector(".modal-body").innerHTML=`
    <label class="field-label">头像</label>
    ${ee("pAvatar",Ha,t.avatar||"🌱","emoji")}
    <label class="field-label">昵称</label>
    <input type="text" id="pNickname" maxlength="12" placeholder="怎么称呼你？" value="${D(t.nickname||"")}" style="width:100%;margin:6px 0 14px;">
    <label class="field-label">我的指数名称</label>
    <input type="text" id="pIndexName" maxlength="14" placeholder="如：阿长进指数 / 小树苗成长指数" value="${D(t.indexName||"")}" style="width:100%;margin:6px 0 14px;">
    <label class="field-label">一句话签名</label>
    <input type="text" id="pSignature" maxlength="30" placeholder="如：日拱一卒，功不唐捐" value="${D(t.signature||"")}" style="width:100%;margin:6px 0 14px;">
    <div class="form-actions" style="justify-content:space-between;">
      ${e?'<button class="dash-btn" onclick="closeModal()">稍后再说</button>':'<button class="dash-btn" onclick="showCustomTypeManager()">🏷️ 管理分类</button>'}
      <button class="btn-primary" onclick="profileSave(${e})">保存名片</button>
    </div>`}window.profileSave=function(e){s&&(s.avatar=document.getElementById("pAvatar").dataset.value||"🌱",s.nickname=document.getElementById("pNickname").value.trim()||void 0,s.indexName=document.getElementById("pIndexName").value.trim()||void 0,s.signature=document.getElementById("pSignature").value.trim()||void 0,x(s),C(),S(),h("✅ 名片已保存"))};function Na(e){const t=document.getElementById("budgetBody");if(!t)return;const n=L(),o=Xn(e,{sensitive:n}),a=o.mode==="amount"?"元":"笔";if(o.budget===null){t.innerHTML=`
      <div style="font-size:12.5px;color:var(--text-secondary);line-height:1.7;margin-bottom:12px;">
        给本月的成长投入定个小目标${n?"（金额）":"（笔数）"}，让投入像记账一样有节奏。
      </div>
      <button class="btn-primary" style="width:100%;" onclick="showBudgetModal()">🎯 设置本月预算</button>`;return}const i=Math.min(100,Math.round((o.ratio||0)*100)),r=o.overrun?"var(--accent-red)":i>=80?"var(--accent-yellow)":"var(--accent-green)",l=o.deltaPct===null?"上月无记录":`${o.deltaPct>=0?"↑":"↓"} 比上月${Math.abs(Math.round(o.deltaPct*100))}%`;t.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
      <span style="font-size:22px;font-weight:bold;color:${o.overrun?"var(--accent-red)":"var(--text-primary)"}">${Math.round(o.spent).toLocaleString()} <span style="font-size:12px;font-weight:normal;">/ ${o.budget.toLocaleString()} ${a}</span></span>
      <a style="font-size:12px;cursor:pointer;" onclick="showBudgetModal()">⚙️ 调整</a>
    </div>
    <div class="budget-bar"><div class="budget-fill" style="width:${i}%;background:${r};"></div></div>
    <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--text-muted);margin-top:8px;">
      <span>${o.overrun?`已超 ${Math.round(-o.remaining).toLocaleString()} ${a}`:`还可投入 ${Math.round(o.remaining).toLocaleString()} ${a}`}</span>
      <span>日均 ${o.dailyAvg.toFixed(1)} ${a} · ${l}</span>
    </div>`}const Fa={jobloss:{icon:"💼",name:"工作变动"},illness:{icon:"🏥",name:"健康风波"},loss:{icon:"🌧️",name:"回落调整"},stagnate:{icon:"🪫",name:"重新启动"}};function Ke(e){const t=document.getElementById("recoveryBannerWrap");if(!t)return;const n=Tt(e);if(!n){t.style.display="none",t.innerHTML="";return}const o=Et(n),a=Fa[n.setbackType]||{icon:"🌱",name:"恢复期"};t.style.display="block",t.innerHTML=`
    <div class="dash-card" onclick="showRecoveryPlanModal('${n.id}')" style="padding:14px 20px;cursor:pointer;border-left:4px solid #C9936A;">
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="font-size:26px;">${a.icon}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:bold;font-size:14.5px;margin-bottom:3px;">${a.name}恢复期 · 已完成 ${o.done}/${o.total} 个小行动</div>
          <div style="height:6px;background:var(--surface-softer);border-radius:99px;overflow:hidden;">
            <div style="height:100%;width:${o.pct}%;background:linear-gradient(90deg,#E8B88A,#5B9A6F);border-radius:99px;"></div>
          </div>
        </div>
        <a style="font-size:13px;color:#C9936A;font-weight:bold;white-space:nowrap;cursor:pointer;">继续 →</a>
      </div>
    </div>`}let Ue=!1;function _a(e){const t=document.getElementById("quickOnboardNudge");if(t){if(!e.quickOnboarded||Ue){t.style.display="none",t.innerHTML="";return}t.style.display="block",t.innerHTML=`
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
    </div>`}}window.dismissQuickNudge=function(){Ue=!0;const e=document.getElementById("quickOnboardNudge");e&&(e.style.display="none",e.innerHTML="")};function Oa(e){const t=[];if((e.journals||[]).forEach(a=>t.push(new Date(a.date))),(e.investments||[]).forEach(a=>t.push(new Date(a.date))),t.length===0)return 1/0;const n=new Date(Math.max(...t.map(a=>a.getTime()))),o=(Date.now()-n.getTime())/(24*60*60*1e3);return Math.floor(o)}let Je=!1;const ct=["哪怕只写一句话，今天也没有白过 🌱","记录不是任务，是和自己的一次对话","退一步是为了喘口气，但别忘带上自己","今天的一小步，也是成长山坡上的一步","你已经走了这么远，今天也轻推自己一下吧"];function qa(e){const t=document.getElementById("recallBannerWrap");if(!t)return;const n=Oa(e);if(n<3||Je){t.style.display="none",t.innerHTML="";return}const o=ct[Math.floor(Math.random()*ct.length)],a=n===1/0?"还没有写下第一笔":`已经 ${n} 天没动笔了`;t.style.display="block",t.innerHTML=`
    <div class="dash-card" style="padding:14px 20px;border-left:4px solid #FF8A4C;background:linear-gradient(135deg,rgba(255,138,76,0.10),rgba(255,179,107,0.06));">
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="font-size:24px;">🖋️</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:bold;font-size:14px;margin-bottom:2px;">今日宜动笔 · ${a}</div>
          <div style="font-size:12.5px;color:var(--text-secondary);">${o}</div>
        </div>
        <button onclick="document.getElementById('smartInvestInput')?.focus();document.getElementById('smartInvestInput')?.scrollIntoView({behavior:'smooth',block:'center'});" class="btn-primary" style="padding:8px 16px;font-size:13px;white-space:nowrap;">记一笔</button>
        <a onclick="dismissRecall()" style="font-size:18px;color:var(--text-muted);cursor:pointer;padding:0 6px;line-height:1;" title="今天先不">×</a>
      </div>
    </div>`}window.dismissRecall=function(){Je=!0;const e=document.getElementById("recallBannerWrap");e&&(e.style.display="none",e.innerHTML="")};window.showBudgetModal=Ga;function Ga(){if(!s)return;const e=L(),t=e?s.monthlyBudget||"":s.monthlyCountBudget||"",n=$("🎯 月度预算",e?"设定每月愿意为自己投入的金额上限，仅存本机":"你尚未授权金额信息，可按每月投入笔数设定节奏");n.querySelector(".modal-body").innerHTML=`
    <input type="number" id="budgetInput" value="${t}" placeholder="${e?"如 2000（元/月）":"如 8（笔/月）"}" style="width:100%;margin-bottom:14px;">
    <div class="form-actions" style="justify-content:space-between;">
      <button class="dash-btn" onclick="budgetClear()">取消预算</button>
      <button class="btn-primary" onclick="budgetSave()">保存</button>
    </div>`}window.budgetSave=function(){if(!s)return;const e=Number(document.getElementById("budgetInput").value);if(!e||e<=0){h("请输入大于 0 的数字");return}L()?s.monthlyBudget=e:s.monthlyCountBudget=e,x(s),C(),S(),h("✅ 预算已设置")};window.budgetClear=function(){s&&(s.monthlyBudget=void 0,s.monthlyCountBudget=void 0,x(s),C(),S())};let ae=new Date().getFullYear(),ie=new Date().getMonth();window.showAnalyticsModal=Ya;function Ya(e=0){if(!s)return;const t=s;if(e!==0){const c=new Date(ae,ie+e,1);ae=c.getFullYear(),ie=c.getMonth()}const n=L(),o=Qn(t,ae,ie),a=Zn(t,6),i=Math.max(1,...a.map(c=>c.amount)),r=o.reduce((c,u)=>c+u.amount,0),l=o.reduce((c,u)=>c+u.count,0),d=$("📈 投入分析","看看你的成长投入都花在了哪些地方");d.querySelector(".modal-body").innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <button class="dash-btn" onclick="showAnalyticsModal(-1)">‹</button>
      <strong>${ae} 年 ${ie+1} 月</strong>
      <button class="dash-btn" onclick="showAnalyticsModal(1)">›</button>
    </div>
    <div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap;">
      <canvas id="donutCanvas" width="170" height="170" style="width:170px;height:170px;"></canvas>
      <div style="flex:1;min-width:180px;display:flex;flex-direction:column;gap:7px;">
        ${o.length===0?'<div style="color:var(--text-muted);font-size:13px;">本月还没有投入记录</div>':o.map(c=>`
          <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;">
            <span style="width:10px;height:10px;border-radius:3px;background:${c.color};display:inline-block;"></span>
            <span style="flex:1;">${c.icon} ${D(c.name)}</span>
            <span style="color:var(--text-muted);">${c.count}笔 · ${Math.round(c.ratio*100)}%</span>
            <span style="font-weight:bold;min-width:64px;text-align:right;">${n?c.amount.toLocaleString()+" 元":"—"}</span>
          </div>`).join("")}
      </div>
    </div>
    <div style="margin:18px 0 8px;font-size:13px;font-weight:bold;">近 6 个月趋势 ${n?"":"（金额需授权后显示）"}</div>
    <div style="display:flex;gap:10px;align-items:flex-end;height:110px;padding:0 4px;border-bottom:1px solid var(--hairline);">
      ${a.map(c=>{const u=ae===new Date().getFullYear()&&ie===new Date().getMonth()&&c.label===`${new Date().getMonth()+1}月`,v=Math.max(3,Math.round(c.amount/i*90));return`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;">
          <span style="font-size:9.5px;color:var(--text-muted);">${n&&c.amount>0?c.amount>=1e4?(c.amount/1e4).toFixed(1)+"万":c.amount:c.count>0?c.count+"笔":""}</span>
          <div style="width:100%;max-width:26px;height:${v}px;border-radius:5px 5px 0 0;background:${u?"linear-gradient(180deg,#ffb36b,#ff8a4c)":"var(--surface-strong)"};"></div>
          <span style="font-size:10px;color:var(--text-muted);">${c.label}</span>
        </div>`}).join("")}
    </div>
    <div style="font-size:11.5px;color:var(--text-muted);margin-top:10px;">本月合计 ${l} 笔${n?` · ${r.toLocaleString()} 元`:""}（按记录日期统计）</div>`,requestAnimationFrame(()=>Wa(o,n?"amount":"count",n?r:l))}function Wa(e,t,n){const o=document.getElementById("donutCanvas");if(!o)return;const a=o.getContext("2d"),i=2;o.width=170*i,o.height=170*i,a.scale(i,i);const r=85,l=85,d=70,c=46;if(a.clearRect(0,0,170,170),e.length===0||n<=0){a.fillStyle="#f2e9db",a.beginPath(),a.arc(r,l,d,0,Math.PI*2),a.fill(),a.fillStyle="#a39684",a.font="12px sans-serif",a.textAlign="center",a.fillText("暂无数据",r,l+4),a.textAlign="left";return}let u=-Math.PI/2;for(const v of e){const p=(t==="amount"?v.amount:v.count)/n*Math.PI*2;a.beginPath(),a.moveTo(r,l),a.arc(r,l,d,u,u+p),a.closePath(),a.fillStyle=v.color,a.fill(),u+=p}a.beginPath(),a.arc(r,l,c,0,Math.PI*2),a.fillStyle="#ffffff",a.fill(),a.fillStyle="#3b332b",a.font="bold 18px sans-serif",a.textAlign="center",a.fillText(t==="amount"?`${Math.round(n).toLocaleString()}`:`${n} 笔`,r,l+2),a.font="10px sans-serif",a.fillStyle="#a39684",a.fillText(t==="amount"?"本月投入（元）":"本月投入",r,l+18),a.textAlign="left"}const Va=["⭐","📖","💪","🏃","🧘","🎯","💧","🌙","☀️","✍️","🎨","🎸","💻","🌱","🧠","🙏"],Ka=Ot;function Ua(e){const t=document.getElementById("habitBody");if(!t)return;const n=(e.habits||[]).filter(a=>!a.archived);if(n.length===0){t.innerHTML=`<div style="font-size:12.5px;color:var(--text-secondary);line-height:1.7;margin-bottom:10px;">像 Todo 软件一样，给自己定几个每日小习惯，打卡会自动记入成长轨迹。</div>
      <button class="btn-primary" style="width:100%;" onclick="showHabitForm()">＋ 新建第一个习惯</button>`;return}const o=F();t.innerHTML=n.map(a=>{const i=G(e,a),r=i.weekDots.map((l,d)=>{const c=new Date,u=(c.getDay()+6)%7,v=new Date(c.getFullYear(),c.getMonth(),c.getDate()-u);v.setDate(v.getDate()+d);const m=P(v)>o;return`<span class="week-dot ${l?"hit":""} ${m?"future":""}" style="${l?`background:${a.color};border-color:${a.color};`:""}" title="${P(v)}"></span>`}).join("");return`<div class="habit-row">
      <span class="habit-icon" style="background:${a.color}22;color:${a.color}">${a.icon}</span>
      <div class="habit-main">
        <div class="habit-name">${D(a.name)} <span class="habit-streak">🔥 ${i.streak}</span></div>
        <div class="habit-sub">
          <span class="week-dots">${r}</span>
          ${a.cadence==="weekly"?`<span class="habit-target">${i.weekCount}/${a.timesPerWeek} 次</span>`:`<a onclick="showHabitDetail('${a.id}')">最佳 ${i.bestStreak} 天</a>`}
        </div>
      </div>
      <button class="habit-check ${i.doneToday?"done":""}" style="${i.doneToday?`background:${a.color};border-color:${a.color};`:`color:${a.color};border-color:${a.color};`}" onclick="toggleHabit('${a.id}')">${i.doneToday?"✓":"打卡"}</button>
    </div>`}).join("")+`<div style="display:flex;gap:8px;margin-top:10px;">
      <button class="dash-btn" style="flex:1;" onclick="showHabitForm()">＋ 新习惯</button>
      <button class="dash-btn" style="flex:1;" onclick="showHabitManager()">管理</button>
    </div>`}window.toggleHabit=Ja;function Ja(e,t=F()){if(!s)return;const n=s,o=(n.habits||[]).find(d=>d.id===e);if(!o)return;const a=G(n,o).streak,i=_n(n,e,t);let r=i.user;if(i.action==="checked"){if(t===F()&&o.investOnCheck){const c=te(n),u=o.linkedType?c.find(v=>v.key===o.linkedType):void 0;r.investments.push({date:new Date,amount:0,type:u?.type||"other",customType:u?.customId,desc:`「${o.name}」打卡`})}const d=G(r,o);a<7&&d.streak>=7?r=ot(r,{icon:"🔥",title:`「${o.name}」连续打卡 7 天`,date:new Date}):a<30&&d.streak>=30&&(r=ot(r,{icon:"🌟",title:`「${o.name}」连续打卡 30 天`,date:new Date}))}s=r,x(s);const l=document.querySelector("#modalContainer .modal");S(),l&&Gt(e),h(i.action==="checked"?`✅ 打卡成功！🔥 连续 ${G(s,o).streak} 天`:"已取消今日打卡")}window.showHabitForm=Xa;function Xa(e){if(!s)return;const t=s,n=e?(t.habits||[]).find(i=>i.id===e):null,o=te(t).map(i=>`<option value="${i.key}" ${n?.linkedType===i.key?"selected":""}>${i.icon} ${i.label}</option>`).join(""),a=$(n?"✏️ 编辑习惯":"＋ 新建习惯","小而稳定的习惯，是最靠谱的成长杠杆");a.querySelector(".modal-body").innerHTML=`
    <input type="text" id="hName" maxlength="16" placeholder="习惯名称，如：每天阅读 20 分钟" value="${D(n?.name||"")}" style="width:100%;margin-bottom:12px;">
    <label class="field-label">图标</label>
    ${ee("hIcon",Va,n?.icon||"⭐","emoji")}
    <label class="field-label">颜色</label>
    ${ee("hColor",Ka,n?.color||"#ff8a4c","color")}
    <label class="field-label">频率</label>
    <select id="hCadence" style="width:100%;margin:6px 0 10px;" onchange="document.getElementById('hTimesRow').style.display=this.value==='weekly'?'flex':'none';">
      <option value="daily" ${n?.cadence==="daily"?"selected":""}>每天</option>
      <option value="weekly" ${n?.cadence==="weekly"?"selected":""}>每周 N 次</option>
    </select>
    <div id="hTimesRow" style="align-items:center;gap:8px;margin-bottom:12px;display:${n?.cadence==="weekly"?"flex":"none"};">
      每周完成 <input type="number" id="hTimes" min="1" max="7" value="${n?.timesPerWeek||3}" style="width:70px;"> 次
    </div>
    <label class="field-label">打卡联动（可选）</label>
    <select id="hLinked" style="width:100%;margin:6px 0 10px;">
      <option value="">不关联投入分类（默认）</option>${o}
    </select>
    <label style="display:flex;align-items:center;gap:8px;font-size:13px;margin-bottom:16px;cursor:pointer;">
      <input type="checkbox" id="hInvest" ${n?.investOnCheck===!1?"":"checked"}> 打卡时自动记一笔 0 元投入（让指数看到你的坚持）
    </label>
    <div class="form-actions">
      ${n?`<button class="dash-btn danger" onclick="habitDelete('`+n.id+`')">删除习惯</button>`:""}
      <button class="btn-primary" onclick="habitSave('${n?.id||""}')">${n?"保存":"创建习惯"}</button>
    </div>`}window.habitSave=function(e){if(!s)return;const t=s,n=document.getElementById("hName").value.trim();if(!n){h("请填写习惯名称");return}const o={name:n,icon:document.getElementById("hIcon").dataset.value||"⭐",color:document.getElementById("hColor").dataset.value||"#ff8a4c",cadence:document.getElementById("hCadence").value,timesPerWeek:Math.min(7,Math.max(1,Number(document.getElementById("hTimes").value)||3)),linkedType:document.getElementById("hLinked").value||void 0,investOnCheck:document.getElementById("hInvest").checked};if(e){const a=(t.habits||[]).find(i=>i.id===e);a&&Object.assign(a,o)}else{const a=Hn(o);t.habits=[...t.habits||[],a]}x(t),C(),pe(),S(),h("✅ 习惯已保存")};window.showHabitManager=pe;function pe(){if(!s)return;const e=s,t=$("🗂️ 习惯管理","归档后习惯不再出现在今日列表，记录保留"),n=(e.habits||[]).map(o=>{const a=G(e,o);return`<div class="ct-row ${o.archived?"archived":""}">
      <span class="ct-icon" style="background:${o.color}22;color:${o.color}">${o.icon}</span>
      <span class="ct-name">${D(o.name)} <small>${o.cadence==="daily"?"每天":`每周${o.timesPerWeek}次`} · 🔥${a.streak} · 最佳${a.bestStreak}</small></span>
      <span class="ct-ops">
        <a onclick="showHabitDetail('${o.id}')">热力图</a>
        <a onclick="showHabitForm('${o.id}')">编辑</a>
        ${o.archived?`<a onclick="habitRestore('${o.id}')">恢复</a>`:`<a onclick="habitArchive('${o.id}')">归档</a>`}
      </span>
    </div>`}).join("")||'<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:8px;">还没有习惯</div>';t.querySelector(".modal-body").innerHTML=`
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">${n}</div>
    <button class="btn-primary" style="width:100%;" onclick="showHabitForm()">＋ 新建习惯</button>`}window.habitArchive=function(e){if(!s)return;const t=s.habits.find(n=>n.id===e);t&&(t.archived=!0),x(s),pe(),S()};window.habitRestore=function(e){if(!s)return;const t=s.habits.find(n=>n.id===e);t&&(t.archived=!1),x(s),pe(),S()};window.habitDelete=function(e){s&&confirm("删除习惯会同时删除它的全部打卡记录，确定吗？")&&(s.habits=(s.habits||[]).filter(t=>t.id!==e),s.habitChecks=(s.habitChecks||[]).filter(t=>t.habitId!==e),x(s),C(),pe(),S())};window.showHabitDetail=Gt;function Gt(e){if(!s)return;const t=s,n=(t.habits||[]).find(d=>d.id===e);if(!n)return;const o=G(t,n),a=Yn(t,n,12),i=["一","二","三","四","五","六","日"],r=[];for(let d=0;d<7;d++)for(let c=0;c<12;c++){const u=a[c][d],v=u.checked?"checked":u.future?"future":"empty",m=u.checked?`background:${n.color};`:"",p=u.future?"":`onclick="toggleHabit('${n.id}','${u.date}')"`;r.push(`<span class="heat-cell ${v}" title="${u.date}${u.makeup?"（补卡）":""}" ${p} style="${m}">${u.makeup?"·":""}</span>`)}const l=$(`${n.icon} ${D(n.name)} · 打卡详情`,"点击空格可以补卡，补卡会正常计入连续天数");l.querySelector(".modal-body").innerHTML=`
    <div style="display:flex;gap:14px;margin-bottom:16px;flex-wrap:wrap;">
      <div class="habit-stat"><span>🔥</span><div><strong>${o.streak}</strong><small>当前连续</small></div></div>
      <div class="habit-stat"><span>🏅</span><div><strong>${o.bestStreak}</strong><small>最佳连续（天）</small></div></div>
      <div class="habit-stat"><span>📅</span><div><strong>${o.weekCount}${n.cadence==="weekly"?"/"+n.timesPerWeek:""}</strong><small>本周次数</small></div></div>
    </div>
    <div style="display:flex;gap:6px;align:flex-start;">
      <div style="display:flex;flex-direction:column;gap:3px;padding-top:2px;">
        ${i.map(d=>`<span style="height:22px;font-size:10px;line-height:18px;color:var(--text-muted);">${d}</span>`).join("")}
      </div>
      <div class="heatmap">${r.join("")}</div>
    </div>
    <div style="font-size:11px;color:var(--text-muted);margin-top:10px;">近 12 周 · 颜色越深代表已打卡 · 「·」为补卡</div>
    <div class="form-actions" style="margin-top:14px;">
      <button class="dash-btn" onclick="showHabitForm('${n.id}')">编辑习惯</button>
      <button class="btn-primary" onclick="closeModal()">完成</button>
    </div>`}function Qa(e){const t=document.getElementById("todoBody");if(!t)return;const n=Jn(e.todos||[]).slice(0,20),o=F(),a={1:{label:"高优先",color:"#e05c4b"},2:{label:"中",color:"#f5a623"},3:{label:"低",color:"#a39684"}};t.innerHTML=(n.length===0?'<div style="color:var(--text-muted);font-size:13px;margin-bottom:10px;">还没有待办，写下一件想推进的小事吧</div>':"")+n.map(i=>{const r=Un(i,o),l=a[i.priority];return`<div class="todo-row ${i.done?"done":""}" style="border-left-color:${l.color}">
        <span class="todo-check" onclick="todoToggle('${i.id}')">${i.done?"✓":""}</span>
        <div class="todo-main" onclick="todoToggle('${i.id}')">
          <div class="todo-title">${D(i.title)}</div>
          <div class="todo-meta">
            <span class="todo-pri" style="color:${l.color}">${l.label}</span>
            ${i.dueDate?`<span class="todo-due ${r?"overdue":""}">${r?"已逾期 · ":""}${i.dueDate.slice(5)} 截止</span>`:""}
            ${i.done?`<a onclick="event.stopPropagation();todoConvertInvest('${i.id}')">→ 记投入</a> <a onclick="event.stopPropagation();todoConvertJournal('${i.id}')">→ 写感悟</a>`:""}
          </div>
        </div>
        <span class="i-edit" onclick="editTodo('${i.id}')">✏️</span>
      </div>`}).join("")}window.todoAdd=function(){if(!s)return;const e=document.getElementById("todoInput").value.trim();if(!e){h("先写点什么吧");return}const t=Number(document.getElementById("todoPriority").value),n=document.getElementById("todoDue").value||void 0;s.todos=[...s.todos||[],Vn({title:e,priority:t,dueDate:n})],x(s),document.getElementById("todoInput").value="",document.getElementById("todoDue").value="",S(),h("✅ 已添加")};window.todoToggle=function(e){if(!s)return;const t=(s.todos||[]).find(o=>o.id===e);if(!t)return;const n=t.done;Object.assign(t,Kn(t)),x(s),S(),n||h("🎉 完成一件！可以把它转成投入或感悟")};window.editTodo=function(e){if(!s)return;const t=(s.todos||[]).find(o=>o.id===e);if(!t)return;const n=$("✏️ 编辑待办","");n.querySelector(".modal-body").innerHTML=`
    <input type="text" id="tTitle" value="${D(t.title)}" maxlength="60" style="width:100%;margin-bottom:12px;">
    <textarea id="tNote" rows="2" placeholder="备注（可选）" style="width:100%;margin-bottom:12px;">${D(t.note||"")}</textarea>
    <div style="display:flex;gap:10px;margin-bottom:12px;">
      <select id="tPriority" style="flex:1;">
        <option value="1" ${t.priority===1?"selected":""}>高优先</option>
        <option value="2" ${t.priority===2?"selected":""}>中优先</option>
        <option value="3" ${t.priority===3?"selected":""}>低优先</option>
      </select>
      <input type="date" id="tDue" value="${t.dueDate||""}" style="flex:1;">
    </div>
    <div class="form-actions" style="justify-content:space-between;">
      <button class="dash-btn danger" onclick="todoDelete('${t.id}')">删除</button>
      <button class="btn-primary" onclick="todoSave('${t.id}')">保存</button>
    </div>`};window.todoSave=function(e){if(!s)return;const t=(s.todos||[]).find(o=>o.id===e);if(!t)return;const n=document.getElementById("tTitle").value.trim();if(!n){h("标题不能为空");return}t.title=n,t.note=document.getElementById("tNote").value.trim()||void 0,t.priority=Number(document.getElementById("tPriority").value),t.dueDate=document.getElementById("tDue").value||void 0,x(s),C(),S(),h("✅ 已保存")};window.todoDelete=function(e){s&&confirm("删除这条待办？")&&(s.todos=(s.todos||[]).filter(t=>t.id!==e),x(s),C(),S())};window.todoConvertInvest=function(e){if(!s)return;const t=(s.todos||[]).find(o=>o.id===e);if(!t)return;const n=document.getElementById("investDesc");n.value=`完成：${t.title}`,C(),document.getElementById("investAmount")?.scrollIntoView({behavior:"smooth",block:"center"}),document.getElementById("investAmount")?.focus({preventScroll:!0}),h("已填入投入描述，补个金额或直接添加")};window.todoConvertJournal=function(e){if(!s)return;const t=(s.todos||[]).find(o=>o.id===e);if(!t)return;const n=document.getElementById("journalInput");n.value=`今天完成了「${t.title}」`,C(),n.scrollIntoView({behavior:"smooth",block:"center"}),n.focus()};const Za=["🌟","🎉","🎓","💼","💍","🏠","🏆","🚀","🌈","🧭"];window.showTimelineModal=Xe;function Xe(){if(!s)return;const t=ao(s),n=$("📅 成长大事记","你的每一笔投入、感悟与重要时刻，都会沉淀在这里");n.querySelector(".modal-body").innerHTML=`
    <div class="sub-form" style="margin-bottom:18px;">
      <div style="font-weight:bold;margin-bottom:8px;">记录一个大事件</div>
      ${ee("eIcon",Za,"🌟","emoji")}
      <input type="text" id="eTitle" placeholder="事件标题，如：拿到心仪 offer" style="width:100%;margin:10px 0;">
      <div style="display:flex;gap:10px;">
        <input type="date" id="eDate" value="${F()}" max="${F()}" style="flex:1;">
        <button class="btn-primary" onclick="timelineAdd()">添加</button>
      </div>
      <input type="text" id="eDesc" placeholder="备注（可选）" style="width:100%;margin-top:10px;">
    </div>
    ${t.achievedMilestones.length?`<div style="margin-bottom:16px;"><div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">🏅 已达成的里程碑</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">${t.achievedMilestones.map(o=>`<span class="milestone-chip">${o.icon} ${D(o.name)}</span>`).join("")}</div></div>`:""}
    <div class="timeline">
      ${t.months.length===0?'<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:16px;">还没有大事记，去记一笔投入或写句话吧</div>':""}
      ${t.months.map(o=>`
        <div class="tl-month">
          <div class="tl-month-label">${o.label}</div>
          <div class="tl-items">
            ${o.items.map(a=>`<div class="tl-item">
              <span class="tl-dot">${a.icon}</span>
              <div class="tl-content">
                <div class="tl-title">${D(a.title)}</div>
                <div class="tl-desc">${a.date.toLocaleDateString("zh-CN")}${a.desc?" · "+D(a.desc):""}</div>
              </div>
              ${a.deletable?`<span class="i-edit" onclick="timelineDelete('${a.id}')">🗑</span>`:""}
            </div>`).join("")}
          </div>
        </div>`).join("")}
    </div>`}window.timelineAdd=function(){if(!s)return;const e=document.getElementById("eTitle").value.trim();if(!e){h("写个标题吧");return}const t=document.getElementById("eIcon").dataset.value||"🌟",n=document.getElementById("eDate").value,o=document.getElementById("eDesc").value.trim()||void 0;s=Mt(s,{title:e,icon:t,desc:o,date:n?K(n):new Date}),x(s),Xe(),h("✅ 已加入大事记")};window.timelineDelete=function(e){s&&(s=to(s,e),x(s),Xe())};window.showAlertModal=ei;function ei(){if(!s)return;const e=s,t=Math.round(T(e).price),n=e.priceAlert||{},o=$("⚑ 指数预警线","本地计算：成长指数触及目标位或回落至支撑位时，给你一个提示");o.querySelector(".modal-body").innerHTML=`
    <div style="padding:10px 14px;background:var(--surface-softer);border-radius:10px;font-size:13px;margin-bottom:14px;">当前指数：<strong>${t} 点</strong></div>
    <label class="field-label">🎯 目标位（点）</label>
    <input type="number" id="alertTarget" value="${n.target??""}" placeholder="如 ${t+30}，留空不设" style="width:100%;margin:6px 0 14px;">
    <label class="field-label">🟡 支撑位（点）</label>
    <input type="number" id="alertFloor" value="${n.floor??""}" placeholder="如 ${Math.max(50,t-20)}，留空不设" style="width:100%;margin:6px 0 14px;">
    <div class="form-actions" style="justify-content:space-between;">
      <button class="dash-btn" onclick="alertClear()">清除预警</button>
      <button class="btn-primary" onclick="alertSave()">保存</button>
    </div>`}window.alertSave=function(){if(!s)return;const e=Number(document.getElementById("alertTarget").value),t=Number(document.getElementById("alertFloor").value),n=s.priceAlert||{};s.priceAlert={target:e>0?e:void 0,floor:t>0?t:void 0,targetHit:e>0&&e===n.target?!!n.targetHit:!1,floorHit:t>0&&t===n.floor?!!n.floorHit:!1},x(s),C(),S(),h("✅ 预警线已保存")};window.alertClear=function(){s&&(s.priceAlert=void 0,x(s),C(),S())};function ti(e){const t=document.getElementById("alertBadge");if(!t)return;const n=e.priceAlert;if(!n){t.innerHTML="";return}const o=[];n.targetHit&&o.push(`<span class="alert-chip hit">🎉 已突破 ${n.target} 点</span>`),n.floorHit&&o.push(`<span class="alert-chip warn">🟡 在支撑位 ${n.floor} 附近</span>`),t.innerHTML=o.join(" ")}function ni(e,t){const n=document.getElementById("todayStrip");if(!n)return;const o=new Date,a=o.getHours(),i=a<6?"夜深了":a<11?"早上好":a<14?"中午好":a<18?"下午好":"晚上好",r="周"+["日","一","二","三","四","五","六"][o.getDay()],l=(e.habits||[]).filter(y=>!y.archived),d=l.filter(y=>G(e,y).doneToday).length,c=F(),u=(e.journals||[]).some(y=>P(new Date(y.date))===c),v=(e.investments||[]).some(y=>P(new Date(y.date))===c),m=u||v,p=l.reduce((y,b)=>Math.max(y,G(e,b).streak),0),f=(()=>{const y=new Set;(e.journals||[]).forEach(A=>y.add(P(new Date(A.date)))),(e.investments||[]).forEach(A=>y.add(P(new Date(A.date))));let b=0;const I=new Date;for(;y.has(P(I));)b++,I.setDate(I.getDate()-1);return b})();let g;l.length>0&&d<l.length?g=`<button class="strip-cta" onclick="document.getElementById('habitCard').scrollIntoView({behavior:'smooth',block:'center'})">去打卡 →</button>`:m?g='<span class="strip-done">✨ 今天也在长进</span>':g=`<button class="strip-cta" onclick="document.getElementById('journalInput').scrollIntoView({behavior:'smooth',block:'center'});document.getElementById('journalInput').focus();">写一句 →</button>`,n.innerHTML=`
    <div class="strip-left">
      <span class="strip-avatar">${e.avatar||"🌱"}</span>
      <div>
        <div class="strip-greet">${i}，${D(e.nickname||"朋友")}</div>
        <div class="strip-sub">${o.getMonth()+1}月${o.getDate()}日 ${r}${e.indexName?` · ${D(e.indexName)}`:""}${e.signature?` · ${D(e.signature)}`:""}</div>
      </div>
    </div>
    <div class="strip-right">
      <span class="strip-chip ${l.length>0&&d===l.length?"ok":""}">✅ 习惯 ${d}/${l.length}</span>
      <span class="strip-chip ${m?"ok":""}">${m?"📝 已记录":"📝 未记录"}</span>
      ${f>0?`<span class="strip-chip fire">🔥 连续 ${f} 天</span>`:""}
      ${p>0?`<span class="strip-chip fire">🔥 ${p} 天</span>`:""}
      <span class="strip-price" style="color:${t.change>=0?"var(--accent-green)":"var(--accent-red)"}">${Math.round(t.price)} 点 · ${t.change>=0?"+":""}${t.change}%</span>
      ${g}
    </div>`}const dt=["① 教育经历","② 职业与收入","③ 大额投入","④ 当前状态","⑤ 家庭与波折","⑥ 确认应用"],oi=["填真实的学费与培训花费，曲线会用真实数字替换对应年龄的统计估算；记不清就留空","有了工作轨迹，学生时代不再虚增收入贡献，工作后的成长曲线按你的真实涨薪节奏走","回忆几笔影响很大的真实投入（考研、留学、私教、证书…），记不清金额可填 0 只记事件","用现在的真实状态校准成长系数与质量系数","家庭支持单独计入累计成长值；波折会在对应年龄形成一次可解释的回撤","确认后，K 线将以真实数据为主、统计估算只补空白年份"],ai=[{t:"jobloss",n:"💼 工作变动"},{t:"illness",n:"🏥 健康风波"},{t:"loss",n:"🌧️ 失去与告别"},{t:"stagnate",n:"🪫 长期停滞"}];let de=0,R=null,he=[];function ii(e){return e==="master"?25:e==="bachelor"||e==="college"?22:e==="senior"?18:16}function si(e){return e<=2?"0-2":e<=5?"3-5":e<=14?"6-14":e<=17?"15-17":"18-22"}function ri(e){const t=e.enhancedSurvey,n=ft(e);return he=t?.eduStages?.length?n.map(o=>t.eduStages.some(a=>a.name===o.name)):n.map(o=>o.enrolled),{eduStages:t?.eduStages?.length?t.eduStages.map(o=>({...o})):n.map(o=>({name:o.name,startAge:o.startAge,endAge:o.endAge,totalCost:0})),bigInvests:t?.bigInvests?t.bigInvests.map(o=>({...o})):[],career:{workStartAge:t?.career?.workStartAge??ii(e.education),startingSalary:t?.career?.startingSalary,avgRaisePct:t?.career?.avgRaisePct??5,currentSalary:t?.career?.currentSalary??e.annualIncome},studyHours:t?.studyHours??e.studyHours,healthScore:t?.healthScore??e.healthScore,familySupportCapital:(t?.familySupportCapital??e.familySupportCapital)||0,setbacks:t?.setbacks?t.setbacks.map(o=>({...o})):[]}}window.showSurveyModal=function(e=0){s&&(de=e,R=ri(s),ne())};function se(){return L()?"":"disabled"}function ne(){if(!s||!R)return;const e=s,t=R,n=L(),o=de,a=$("📋 强化调查 · "+dt[o],oi[o]);let r=`<div class="sv-dots">${dt.map((l,d)=>`<span class="sv-dot ${d===o?"active":""} ${d<o?"done":""}">${d<o?"✓":d+1}</span>`).join("")}</div>`;if(o===0)r+=`<div class="sv-tip">以下年龄为常规学制参考，可自行修改；勾选并填写总花费的阶段才会替换估算${n?"":"（未授权金额信息，金额框已停用，仅年龄/学历仍可确认）"}</div>`,r+=(t.eduStages||[]).map((l,d)=>{const c=he[d],u=Math.max(1,l.endAge-l.startAge+1),v=M.AGE_SPEND_RANGE[si(l.startAge)]?.mid||3e4;return`<div class="sv-edu-row ${c?"":"off"}">
        <label style="display:flex;align-items:center;gap:6px;min-width:110px;font-weight:600;font-size:13px;cursor:pointer;">
          <input type="checkbox" ${c?"checked":""} onchange="this.closest('.sv-edu-row').classList.toggle('off',!this.checked)"> ${l.name}
        </label>
        <span style="display:flex;align-items:center;gap:4px;font-size:12.5px;color:var(--text-secondary);">
          <input type="number" class="sv-edu-start" value="${l.startAge}" min="0" max="${e.age}" style="width:52px;padding:6px;">
          ~<input type="number" class="sv-edu-end" value="${l.endAge}" min="0" max="${e.age}" style="width:52px;padding:6px;">岁
        </span>
        <input type="number" class="sv-edu-cost" value="${l.totalCost||""}" placeholder="总花费（参考约 ${Math.round(v*u/1e4)} 万）" ${se()} style="flex:1;min-width:150px;padding:8px 10px;font-size:13px;">
      </div>`}).join("");else if(o===1)r+=`<div class="sv-field"><label>参加工作年龄</label>
      <input type="number" id="svWorkStart" value="${t.career?.workStartAge??""}" min="0" max="${e.age}" style="width:100%;padding:9px 12px;"></div>`,r+=`<div class="sv-field"><label>第一份工作年薪（元）${n?"":"· 未授权金额，已停用"}</label>
      <input type="number" id="svStartSalary" value="${t.career?.startingSalary??""}" placeholder="如 80000" ${se()} style="width:100%;padding:9px 12px;"></div>`,r+=`<div class="sv-field"><label>年均加薪幅度（%，可为负）</label>
      <input type="number" id="svRaise" value="${t.career?.avgRaisePct??5}" step="0.5" style="width:100%;padding:9px 12px;"></div>`,r+=`<div class="sv-field"><label>当前年薪确认（元）${n?"":"· 未授权金额，已停用"}</label>
      <input type="number" id="svCurrentSalary" value="${t.career?.currentSalary??""}" ${se()} style="width:100%;padding:9px 12px;"></div>`,n||(r+='<div class="sv-tip">在隐私设置中授权金额信息后，可填写精确薪资；不填则沿用模型估算。</div>');else if(o===2)r+='<div class="sv-tip">这些投入会以真实类型计入对应年龄（技能会折旧、健康影响质量系数），让曲线拐点有真实依据。</div>',r+=(t.bigInvests||[]).map((l,d)=>`
      <div class="sv-subrow">
        <select class="sv-bi-age" style="width:78px;">${ut(e.age,l.age)}</select>
        <select class="sv-bi-type" style="flex:1;min-width:96px;">${li(l.type)}</select>
        <input type="number" class="sv-bi-amount" value="${l.amount||""}" placeholder="金额，可空" ${se()} style="width:110px;padding:7px;font-size:12.5px;">
        <input type="text" class="sv-bi-desc" value="${D(l.desc||"")}" placeholder="描述（可选）" style="flex:2;min-width:120px;padding:7px;font-size:12.5px;">
        <button class="sv-del" onclick="svDelBigInvest(${d})">✕</button>
      </div>`).join(""),r+='<button class="dash-btn" style="width:100%;margin-top:8px;" onclick="svAddBigInvest()">＋ 添加一笔真实投入</button>';else if(o===3){const l=t.studyHours??5,d=t.healthScore??70;r+=`<div class="sv-field"><label>现在平均每周学习 / 自我提升时长（小时）</label>
      <input type="number" id="svHours" value="${l}" min="0" max="40" step="0.5" style="width:100%;padding:9px 12px;"></div>`,r+=`<div class="sv-field"><label>当前健康状态自评：<b id="svHealthVal" style="color:var(--accent);">${d}</b> / 100</label>
      <input type="range" id="svHealth" min="0" max="100" value="${d}" style="width:100%;" oninput="document.getElementById('svHealthVal').textContent=this.value"></div>
      <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--text-muted);"><span>0 很糟</span><span>50 一般</span><span>100 很好</span></div>`}else if(o===4)r+=`<div class="sv-field"><label>家庭累计支持（万元，选填）${n?"":"· 未授权金额，已停用"}</label>
      <input type="number" id="svFamily" value="${t.familySupportCapital||0}" min="0" step="1" ${se()} style="width:100%;padding:9px 12px;">
      <div style="font-size:11.5px;color:var(--text-muted);margin-top:4px;">父母/家庭对你的累计投入折算，不折旧、不乘权重，单独计入累计成长值。</div></div>`,r+='<div class="field-label">经历过的重大波折（选填，用于解释曲线上的回撤）</div>',r+=(t.setbacks||[]).map((l,d)=>`
      <div class="sv-subrow">
        <select class="sv-sb-age" style="width:78px;">${ut(e.age,l.age)}</select>
        <select class="sv-sb-type" style="flex:1;min-width:110px;">${ai.map(c=>`<option value="${c.t}" ${l.type===c.t?"selected":""}>${c.n}</option>`).join("")}</select>
        <select class="sv-sb-sev" style="width:96px;">${[1,2,3,4,5,6,7,8,9,10].map(c=>`<option value="${c}" ${l.severity===c?"selected":""}>影响 ${c}/10</option>`).join("")}</select>
        <button class="sv-del" onclick="svDelSetback(${d})">✕</button>
      </div>`).join(""),r+='<button class="dash-btn" style="width:100%;margin-top:8px;" onclick="svAddSetback()">＋ 添加一段波折</button>';else{const l=yt(e,t),d=Math.round(l.before.estimatedRatio*100),c=Math.round(l.after.estimatedRatio*100),u=l.coverage,v=(t.eduStages||[]).filter(m=>m.totalCost>0).length;r+=`<div class="sv-result">
      <div class="sv-result-main">
        <div><span class="sv-big">${d}%</span><span class="sv-arrow">→</span><span class="sv-big" style="color:var(--accent-green);">${c}%</span><div class="sv-cap">估算成分占比</div></div>
        <div><span class="sv-big" style="font-size:18px;">${l.before.label}</span><span class="sv-arrow">→</span><span class="sv-big" style="font-size:18px;color:var(--accent-green);">${l.after.label}</span><div class="sv-cap">置信度</div></div>
        <div><span class="sv-big" style="font-size:18px;">${u.verifiedYears}<small style="font-size:12px;">/${u.totalYears} 岁</small></span><div class="sv-cap">真实数据覆盖</div></div>
      </div>
      <ul class="sv-summary">
        <li>📚 ${v} 个教育阶段将用真实花费替换统计估算</li>
        <li>💡 ${(t.bigInvests||[]).length} 笔大额投入按真实年龄与类型计入</li>
        <li>💼 职业轨迹：${t.career?.workStartAge??"?"} 岁参加工作${t.career?.avgRaisePct!=null?`，年均加薪 ${t.career.avgRaisePct}%`:""}</li>
        <li>💥 ${(t.setbacks||[]).length} 段波折会在对应年龄形成可解释的回撤</li>
        <li>📉 真实年份曲线波动收窄，当前点位与实时指数一致</li>
      </ul>
      <div class="sv-tip">数据只保存在本机，随时可重新填写；留空的年份继续使用统计区间估算。</div>
    </div>`}r+=`<div class="form-actions" style="margin-top:18px;">
    ${o>0?'<button class="dash-btn" onclick="svGo(-1)">上一步</button>':"<span></span>"}
    ${o<5?'<button class="btn-primary" onclick="svGo(1)">下一步 →</button>':'<button class="btn-primary" onclick="svApplySurvey()">✅ 应用到我的 K 线</button>'}
  </div>`,a.querySelector(".modal-body").innerHTML=r}function ut(e,t){return Array.from({length:e+1},(n,o)=>`<option value="${o}" ${t===o?"selected":""}>${o} 岁</option>`).join("")}function li(e){return Object.keys(j).map(t=>`<option value="${t}" ${e===t?"selected":""}>${j[t].icon} ${j[t].name}</option>`).join("")}function oe(){if(!s||!R)return;const e=R,t=de,n=o=>{const a=document.getElementById(o);if(!a||a.disabled)return;const i=Number(a.value);return a.value===""||isNaN(i)?void 0:i};if(t===0){const o=document.querySelectorAll(".sv-edu-row");he=[],e.eduStages=[],o.forEach((a,i)=>{const r=a.querySelector("input[type=checkbox]").checked;if(he.push(r),!r)return;const l=Number(a.querySelector(".sv-edu-start").value),d=Number(a.querySelector(".sv-edu-end").value),c=a.querySelector(".sv-edu-cost"),u=c.disabled||c.value===""?0:Math.max(0,Number(c.value)||0),v=ft(s)[i]?.name||`阶段${i+1}`;isFinite(l)&&isFinite(d)&&d>=l&&l>=0&&d<=s.age&&e.eduStages.push({name:v,startAge:l,endAge:d,totalCost:u})})}else if(t===1)e.career={workStartAge:n("svWorkStart"),startingSalary:n("svStartSalary"),avgRaisePct:n("svRaise"),currentSalary:n("svCurrentSalary")};else if(t===2)e.bigInvests=[...document.querySelectorAll(".sv-subrow")].filter(o=>o.querySelector(".sv-bi-age")).map(o=>({age:Number(o.querySelector(".sv-bi-age").value),type:o.querySelector(".sv-bi-type").value,amount:Math.max(0,Number(o.querySelector(".sv-bi-amount").value)||0),desc:(o.querySelector(".sv-bi-desc").value||"").trim()||void 0}));else if(t===3)e.studyHours=n("svHours"),e.healthScore=n("svHealth");else if(t===4){const o=n("svFamily");o!==void 0&&(e.familySupportCapital=o),e.setbacks=[...document.querySelectorAll(".sv-subrow")].filter(a=>a.querySelector(".sv-sb-age")).map(a=>({age:Number(a.querySelector(".sv-sb-age").value),type:a.querySelector(".sv-sb-type").value,severity:Number(a.querySelector(".sv-sb-sev").value)}))}}window.svGo=function(e){oe(),de=Math.max(0,Math.min(5,de+e)),ne()};window.svAddBigInvest=function(){oe(),R.bigInvests=[...R.bigInvests||[],{age:s.age,amount:0,type:"skill",desc:void 0}],ne()};window.svDelBigInvest=function(e){oe(),R.bigInvests=(R.bigInvests||[]).filter((t,n)=>n!==e),ne()};window.svAddSetback=function(){oe(),R.setbacks=[...R.setbacks||[],{age:s.age-1,type:"stagnate",severity:5}],ne()};window.svDelSetback=function(e){oe(),R.setbacks=(R.setbacks||[]).filter((t,n)=>n!==e),ne()};window.svApplySurvey=function(){if(!s||!R)return;oe();const e=yt(s,R);s=e.user,x(s),C(),S(),h(`✅ 已用真实数据重建 K 线（估算成分 ${Math.round(e.before.estimatedRatio*100)}% → ${Math.round(e.after.estimatedRatio*100)}%）`)};da();
