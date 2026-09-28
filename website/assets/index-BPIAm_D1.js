(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function n(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(o){if(o.ep)return;o.ep=!0;const i=n(o);fetch(o.href,i)}})();const Ce="1.3",At=200,Ct=.65,zt=1.5,Bt=.6,jt=1.3,Pt=.3,S={BASE_INDEX:100,TYPE_WEIGHTS:{education:1.5,skill:1.3,health:1.1,network:1,entertainment:.5,other:.5},TYPE_HALF_LIFE:{education:1/0,skill:5,health:4,network:3,entertainment:1,other:2},REGION_COEF:{tier1:1.8,new_tier1:1.4,tier2:1.1,tier3:.8},AREA_COEF:{urban:1,rural:.68},INCOME_COEF:{low:.35,below_avg:.65,avg:1,above_avg:1.55,high:2.9},STAGE_COEF:[{age:0,coef:.2},{age:6,coef:.3},{age:12,coef:.5},{age:18,coef:.9},{age:25,coef:1.1},{age:35,coef:1.5},{age:50,coef:1.3},{age:65,coef:1},{age:80,coef:.8}],AGE_SPEND:{"0-2":24538,"3-5":36538,"6-14":27007,"15-17":29007,"18-22":29135},AGE_SPEND_RANGE:{"0-2":{low:18e3,mid:24538,high:35e3},"3-5":{low:25e3,mid:36538,high:52e3},"6-14":{low:18e3,mid:27007,high:4e4},"15-17":{low:2e4,mid:29007,high:42e3},"18-22":{low:18e3,mid:29135,high:45e3}}},Lt={education_cost:{name:"育娲人口研究《中国生育成本报告》",year:"2022",caliber:"全国家庭 0-17 岁子女年均教育/养育投入"}},q=[{id:"birth",name:"出生",icon:"👶",desc:"人生起点",bonus:20,condition:e=>e.age>=0},{id:"school",name:"小学入学",icon:"🎒",desc:"基础教育开始",bonus:10,condition:e=>e.age>=6},{id:"middle",name:"初中毕业",icon:"📖",desc:"义务教育完成",bonus:15,condition:e=>e.age>=15},{id:"highschool",name:"高中毕业",icon:"🎓",desc:"成年预备",bonus:20,condition:e=>e.age>=18},{id:"college",name:"大学毕业",icon:"🎓",desc:"步入社会",bonus:30,condition:e=>e.age>=22},{id:"firstjob",name:"第一份工作",icon:"💼",desc:"独立起步",bonus:30,condition:e=>e.hasJob},{id:"firstraise",name:"第一次涨薪",icon:"💰",desc:"成长被认可",bonus:15,condition:e=>e.salaryRaised},{id:"license",name:"拿到驾照",icon:"🚗",desc:"技能+1",bonus:5,condition:e=>e.hasLicense},{id:"marathon",name:"跑完马拉松",icon:"🏃",desc:"健康资产",bonus:8,condition:e=>e.marathon},{id:"marriage",name:"结婚",icon:"💍",desc:"人生伙伴",bonus:20,condition:e=>e.married},{id:"home",name:"买房",icon:"🏠",desc:"安定居所",bonus:25,condition:e=>e.hasHouse},{id:"child",name:"为人父母",icon:"👶",desc:"新的责任",bonus:15,condition:e=>e.hasChild},{id:"30",name:"三十而立",icon:"🎯",desc:"人生分水岭",bonus:25,condition:e=>e.age>=30},{id:"100k",name:"十万投入",icon:"💎",desc:"累计投入超10万",bonus:15,condition:e=>e.totalInvest>=1e5},{id:"500k",name:"五十万投入",icon:"👑",desc:"累计投入超50万",bonus:30,condition:e=>e.totalInvest>=5e5}],Ze=.5,et=1.5,Ht=1;function tt(e,t,n){return Math.max(t,Math.min(n,e))}function Rt(e){return e.subjectiveWeight===void 0||e.subjectiveWeight===null?Ht:tt(e.subjectiveWeight,Ze,et)}function Nt(e){return tt(e,Ze,et)}function ae(e,t,n){return Math.max(t,Math.min(n,e))}function ke(e){const t=e.history?.length||0,n=(e.history||[]).filter(m=>m.source==="survey").length,a=e.investments?.length||0,o=t+a,i=t-n,r=n+a,s=o>0?i/o:1;let d;const c=o>0?r/o:0;c>=.5?d="high":c>=.2?d="medium":d="low";const u={high:"高置信",medium:"中置信",low:"低置信"},v=o>0?Math.max(0,i-16)/Math.max(1,o):.5;return{level:d,estimatedRatio:Math.round(s*100)/100,manualCount:a,surveyCount:n,estimatedCount:i,label:u[d],potentialEstimatedRatio:Math.round(v*100)/100}}function Se(e,t,n){if(n==="education")return e;const a=S.TYPE_HALF_LIFE[n]||5;return isFinite(a)?e*Math.exp(-.693*t/a):e}function ze(e){const t=S.STAGE_COEF;if(e<=t[0].age)return t[0].coef;for(let n=0;n<t.length-1;n++)if(e>=t[n].age&&e<=t[n+1].age){const a=(e-t[n].age)/(t[n+1].age-t[n].age);return t[n].coef+a*(t[n+1].coef-t[n].coef)}return t[t.length-1].coef}function _t(e){const t=ae((e.annualIncomeGrowth||0)*2,-.35,.35),n=ae(((e.studyHours||0)-5)/20,-.15,.15);return ae(1+t+n,Ct,zt)}function Ft(e){return ae(.6+e/100*.7,Bt,jt)}function Ot(e){return ae((e.debtRatio||0)*.3,0,Pt)}function nt(e,t=new Date){let n=0;return e.history.forEach(a=>{const o=e.age-a.age,i=S.TYPE_WEIGHTS[a.type]||1;n+=a.invest/1e4*i*Se(1,Math.max(0,o),a.type)}),e.investments.forEach(a=>{const o=(t.getTime()-a.date.getTime())/315576e5,i=S.TYPE_WEIGHTS[a.type]||1;n+=a.amount/1e4*i*Se(1,Math.max(0,o),a.type)}),e.familySupportCapital&&(n+=e.familySupportCapital),n}function A(e,t=new Date){const n=nt(e,t),a=ze(e.age),o=q.filter(k=>k.condition(e)).reduce((k,R)=>k+R.bonus,0),i=Math.min(At,o),r=(e.annualIncome||0)/1e4,s=n>0?Math.min(1e3,r/(n+1)*100):0,c=e.investments.filter(k=>(t.getTime()-k.date.getTime())/315576e5<2&&["education","skill","health"].includes(k.type)).length>0?1:Math.max(.65,1-(e.age-22)*.012);let u=e.healthScore||50;const v=e.investments.filter(k=>(t.getTime()-k.date.getTime())/315576e5<2&&k.type==="health");e.age>30&&v.length===0&&(u=Math.max(20,u-(e.age-30)*1.5));const p=_t(e)*c,g=Ft(u),f=Ot(e),h=Rt(e),b=(S.BASE_INDEX+n*a+i)*p*g*(1-f)*h,E=(b-S.BASE_INDEX)/S.BASE_INDEX*100,B=r>0?Math.round(b/r*10)/10+"倍":"—";return{price:Math.round(b*10)/10,change:Math.round(E*10)/10,bv:Math.round(n*10)/10,eps:Math.round(r*100)/100,roe:Math.round(s*10)/10,pe:B,milestoneBonus:i,growthCoef:Math.round(p*100)/100,qualityCoef:Math.round(g*100)/100,stagnationPenalty:Math.round(c*100)/100,effectiveHealth:Math.round(u),riskDiscount:Math.round(f*100)/100,subjectiveAdjust:Math.round(h*100)/100}}function qt(e){const t=S.REGION_COEF[e.region]*S.AREA_COEF[e.area]*S.INCOME_COEF[e.income],n=[];for(let a=0;a<=e.age;a++){let o;a<=2?o=S.AGE_SPEND["0-2"]:a<=5?o=S.AGE_SPEND["3-5"]:a<=14?o=S.AGE_SPEND["6-14"]:a<=17?o=S.AGE_SPEND["15-17"]:o=S.AGE_SPEND["18-22"],o=o*t*(.9+Math.random()*.2),n.push({age:a,invest:o,type:"education",source:"estimated"})}if(e.anchor){const a=e.anchor.age;n[a]&&(n[a].invest=e.anchor.amount)}return n}const Gt=[{name:"学前/幼儿园",startAge:3,endAge:5},{name:"小学",startAge:6,endAge:11},{name:"初中",startAge:12,endAge:14},{name:"高中/中职",startAge:15,endAge:17},{name:"大学/大专",startAge:18,endAge:21},{name:"研究生",startAge:22,endAge:24}],Yt={primary:1,junior:2,senior:3,college:4,bachelor:4,master:5};function ot(e){const t=Yt[e.education]??2;return Gt.map((n,a)=>{const o=Math.min(n.endAge,e.age);return{name:n.name,startAge:n.startAge,endAge:o,totalCost:0,enrolled:a<=t&&n.startAge<=e.age}}).filter(n=>n.startAge<=e.age)}function O(e,t,n){const a=Number(e);if(!(!isFinite(a)||Number.isNaN(a)))return Math.max(t,Math.min(n,a))}function at(e,t,n=new Date){const a=ke(e);let o=(e.history||[]).filter(p=>p.source!=="survey");const i=new Set,r=(t.eduStages||[]).filter(p=>p&&p.totalCost>0&&p.endAge>=p.startAge&&p.startAge>=0&&p.endAge<=e.age);for(const p of r){const g=p.endAge-p.startAge+1,f=Math.round(p.totalCost/g*100)/100;for(let h=p.startAge;h<=p.endAge;h++)i.add(h);for(let h=p.startAge;h<=p.endAge;h++)o.push({age:h,invest:f,type:"education",source:"survey",desc:p.name})}i.size>0&&(o=o.filter(p=>!(p.source==="estimated"&&p.type==="education"&&i.has(p.age))));for(const p of t.bigInvests||[]){if(!p||p.age<0||p.age>e.age)continue;const g=Math.max(0,Number(p.amount)||0);o.push({age:p.age,invest:g,type:p.type,source:"survey",desc:p.desc?.trim()||void 0})}o.sort((p,g)=>p.age-g.age||(p.type<g.type?-1:1));const s={...e,history:o},d=O(t.studyHours,0,40);d!==void 0&&(s.studyHours=d);const c=O(t.healthScore,0,100);c!==void 0&&(s.healthScore=c);const u=O(t.familySupportCapital,0,1e5);u!==void 0&&(s.familySupportCapital=u);const v=t.career;if(v){const p=O(v.workStartAge,0,e.age),g=O(v.startingSalary,0,1e8),f=O(v.avgRaisePct,-10,50),h=O(v.currentSalary,0,1e8);s.enhancedSurvey={...s.enhancedSurvey||{},completedAt:s.enhancedSurvey?.completedAt||n,career:{workStartAge:p??void 0,startingSalary:g??void 0,avgRaisePct:f??void 0,currentSalary:h??void 0}},f!==void 0&&(s.annualIncomeGrowth=Math.round(f*100)/1e4),h!==void 0&&h>0&&(s.annualIncome=h)}if(t.setbacks&&t.setbacks.length>0){const p=new Set((s.setbacks||[]).map(f=>`${f.date.getFullYear()-s.birthYear}:${f.type}`)),g=s.setbacks?[...s.setbacks]:[];for(const f of t.setbacks){const h=O(f.age,0,s.age);if(h===void 0)continue;const b=O(f.severity,1,10)??5,E=`${h}:${f.type}`;p.has(E)||(p.add(E),g.push({date:new Date(s.birthYear+h,5,1),type:f.type,severity:b}))}s.setbacks=g}const m=s.enhancedSurvey?.career;return s.enhancedSurvey={eduStages:r,bigInvests:(t.bigInvests||[]).filter(p=>p&&p.age>=0&&p.age<=e.age),career:m,studyHours:d??s.enhancedSurvey?.studyHours,healthScore:c??s.enhancedSurvey?.healthScore,familySupportCapital:u??s.enhancedSurvey?.familySupportCapital,setbacks:(t.setbacks||[]).filter(p=>p&&p.age>=0&&p.age<=e.age),completedAt:n},{user:s,before:a,after:ke(s),coverage:st(s)}}function it(e){const t=new Set;return(e.history||[]).forEach(n=>{n.source==="survey"&&t.add(n.age)}),(e.investments||[]).forEach(n=>{const a=n.date.getFullYear()-e.birthYear;a>=0&&a<=e.age&&t.add(a)}),t}function st(e){const t=e.age+1,n=it(e).size;return{verifiedYears:n,totalYears:t,ratio:t>0?Math.round(n/t*100)/100:0}}function Wt(e,t){const n=e.enhancedSurvey?.career;if(n&&n.workStartAge!=null&&(n.startingSalary??0)>0){if(t<n.workStartAge)return 0;const a=Math.max(-.1,Math.min(.5,(n.avgRaisePct??5)/100)),o=n.startingSalary*Math.pow(1+a,t-n.workStartAge),i=e.annualIncome>0?e.annualIncome*1.1:1/0;return Math.round(Math.min(o,i))}return e.annualIncome||0}function Vt(e,t){const n=e.enhancedSurvey?.career;return n&&n.workStartAge!=null&&t<n.workStartAge?0:e.annualIncomeGrowth||0}function Ut(e,t){let n=0;return(e.setbacks||[]).forEach(a=>{a.date.getFullYear()-e.birthYear===t&&(n=Math.max(n,a.severity))}),n}function Jt(e){const t=Math.sin(e*127.1+311.7)*43758.5453;return t-Math.floor(t)}function V(e){const t=[],n=it(e);let a=0;for(let o=0;o<=e.age;o++){let r=e.history.filter(b=>b.age===o).reduce((b,E)=>b+E.invest,0);const s=e.investments.filter(b=>Math.floor((b.date.getTime()-new Date(e.birthYear+o,0,1).getTime())/315576e5)===o);r+=s.reduce((b,E)=>b+E.amount,0),a+=r;const d={...e,age:o,annualIncome:Wt(e,o),annualIncomeGrowth:Vt(e,o),history:e.history.filter(b=>b.age<=o),investments:s},c=A(d),u=n.has(o),m=o===e.age?0:u?.035:.08,p=1+(Jt(o+1)-.5)*2*m,g=Ut(e,o),f=g>0?1-g/10*.15:1,h=c.price*p*f;t.push({age:o,price:Math.round(h*10)/10,invest:r,total:a,verified:u,setback:g>0})}return t}function rt(e){const t={primary:.5,junior:.8,senior:1,college:1.2,bachelor:1.3,master:1.5},n={age:e.age,region:e.region,area:e.area,income:"avg",education:e.education,birthYear:e.birthYear,annualIncome:8e4*(t[e.education]||1),annualIncomeGrowth:.05,studyHours:2,healthScore:65,debtRatio:.05,hasJob:e.age>=22,salaryRaised:e.age>=25,hasLicense:e.age>=20,marathon:!1,married:e.age>=28,hasHouse:e.age>=30,hasChild:e.age>=32,totalInvest:0,history:Kt(e),investments:[]};return A(n).price}function Kt(e){const t=S.REGION_COEF[e.region]*S.AREA_COEF[e.area]*S.INCOME_COEF.avg,n=[];for(let a=0;a<=e.age;a++){let o;a<=2?o=S.AGE_SPEND["0-2"]:a<=5?o=S.AGE_SPEND["3-5"]:a<=14?o=S.AGE_SPEND["6-14"]:a<=17?o=S.AGE_SPEND["15-17"]:o=S.AGE_SPEND["18-22"],o=o*t,n.push({age:a,invest:o,type:"education"})}return n}function lt(e,t){let n={...e};return(!t||t<"1.2")&&n.familySupportCapital===void 0&&(n.familySupportCapital=0),(!t||t<"1.3")&&(n.history=(n.history||[]).map(a=>a.source?a:{...a,source:"estimated"})),n.version=Ce,n}function Xt(e){return{...e,version:Ce,disclaimer:"本工具为个人成长记录与自我反思工具，所有数值为模型估算，仅供娱乐与自我观察，不构成理财、职业或心理咨询建议，也不预测收入。"}}function Qt(e,t){const n=ze(e.age),a=100,o=t.bv*n,i=t.milestoneBonus,r=[{key:"growth",name:"成长系数",value:t.growthCoef,reason:`收入增速与学习时长决定，含停滞衰减 ${t.stagnationPenalty}`},{key:"quality",name:"质量系数",value:t.qualityCoef,reason:`基于有效健康分 ${t.effectiveHealth}`},{key:"risk",name:"风险折扣",value:1-t.riskDiscount,reason:`负债率 ${(e.debtRatio||0)*100}%，折扣 ${(t.riskDiscount*100).toFixed(0)}%`},{key:"subjective",name:"主观感知",value:t.subjectiveAdjust,reason:`你设定的主观权重 ${t.subjectiveAdjust.toFixed(2)}（1.0 为中性）`}],s=r.reduce((u,v)=>u*v.value,1),d=t.price,c=[];return c.push({key:"base",name:"基准指数",contribution:Math.round(a*s*10)/10,ratio:d>0?a*s/d:0,reason:"所有人同一起点 100 分"}),c.push({key:"bv",name:"累计成长值",contribution:Math.round(o*s*10)/10,ratio:d>0?o*s/d:0,reason:`成长值 ${t.bv} 点 × 阶段系数 ${n.toFixed(2)}（${e.age}岁）`}),c.push({key:"milestone",name:"里程碑加成",contribution:Math.round(i*s*10)/10,ratio:d>0?i*s/d:0,reason:"已达成里程碑加分（封顶 200）"}),r.forEach(u=>{c.push({key:u.key,name:u.name,contribution:0,ratio:0,reason:u.reason+`（×${u.value.toFixed(2)}）`})}),c}function Zt(e){const t=e.filter(n=>n.contribution>0);return t.length===0?null:t.reduce((n,a)=>n.contribution>a.contribution?n:a)}const en={great:4,good:3,ok:2,low:1};function tn(e,t,n){return{id:`j_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,date:new Date,content:e.trim(),mood:t,category:n}}function nn(e,t){return{...e,journals:[...e.journals||[],t]}}function on(e,t=10){return[...e.journals||[]].sort((n,a)=>new Date(a.date).getTime()-new Date(n.date).getTime()).slice(0,t)}function Be(e,t){const n=Date.now()-t*24*60*60*1e3;return(e.journals||[]).filter(a=>new Date(a.date).getTime()>=n).length}function ct(e){const t=new Set((e.journals||[]).map(o=>new Date(o.date).toDateString()));let n=0;const a=new Date;for(;t.has(a.toDateString());)n++,a.setDate(a.getDate()-1);return n}function je(e,t=30){const n=Date.now()-t*24*60*60*1e3,a=(e.journals||[]).filter(i=>i.mood&&new Date(i.date).getTime()>=n);return a.length===0?null:a.reduce((i,r)=>i+en[r.mood],0)/a.length}function an(e,t){if(e.length===0)return{peak:t,current:t,drawdownPct:0,drawdownPoints:0,peakDaysAgo:0,inDrawdown:!1,suggestions:["开始记录你的第一笔成长投入吧"]};const n=Math.max(...e.map(c=>c.price),t),a=Math.max(0,n-t),o=n>0?a/n*100:0,i=e.reduce((c,u)=>u.price>c.price?u:c,e[0]),r=e[e.length-1].age,s=Math.round((r-i.age)*365),d=[];return o===0?d.push("当前处于历史高位，继续保持成长节奏"):o<5?(d.push("小幅波动属正常，不必过度焦虑"),d.push("检查近期投入是否连续，保持每周一笔")):o<15?(d.push("阶段性回落，可复盘近期是否有停滞期"),d.push("健康与学习时长对成长系数影响较大")):(d.push("回落幅度较大，建议认真复盘近期生活变化"),d.push("可在「记录挫折」中标记事件，帮助归因")),{peak:n,current:t,drawdownPct:Math.round(o*10)/10,drawdownPoints:Math.round(a),peakDaysAgo:Math.max(0,s),inDrawdown:o>.5,suggestions:d}}function sn(e){const t=["最近哪件事最影响你的状态？","这个阶段你的投入重心放在了哪里？","有什么是你想调整或继续的？"];return e.setbacks&&e.setbacks.length>0&&t.unshift("你记录的挫折事件，现在回看有什么新感悟？"),t}function rn(e,t){const n=A(e),a=n.price,o=Math.max(0,t-a),i=n.growthCoef*n.qualityCoef*(1-n.riskDiscount)*n.subjectiveAdjust,r=n.stageCoef||1,s=Math.max(0,(t/i-100-n.milestoneBonus)/r),d=n.bv,c=Math.max(0,s-d),u=c,v=e.annualIncome*.05/12,m=e.annualIncome*.15/12,p=m>0?Math.ceil(c/m):999,g=v>0?Math.ceil(c/v):999,f=[];return o<=0?f.push("已达到目标，可设定更高的成长目标"):(f.push(`距离目标还差 ${Math.round(o)} 点`),f.push(`按当前节奏约需 ${p}-${g} 个月（仅作参考）`),f.push("提升学习时长与健康评分，可加速成长系数"),f.push("达成更多里程碑可获得额外加成")),{target:t,current:Math.round(a),gap:Math.round(o),requiredBV:Math.round(s),additionalInvest:Math.round(u),monthsRange:[Math.min(p,999),Math.min(g,999)],suggestions:f,confidence:"估算基于当前系数与线性假设，实际成长受多因素影响，请理性参考"}}function dt(e,t){const n=new Date,a=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`,i=A(e).price,r=new Date(n.getFullYear(),n.getMonth(),1),s=n.getFullYear()-e.birthYear-(n.getMonth()<r.getMonth()?1:0);let d=i;if(t.length>0){const k=t.filter(R=>R.age<=s-.08);k.length>0?d=k[k.length-1].price:d=t[0].price}const c=i-d,u=d>0?c/d*100:0,v=new Date(n.getFullYear(),n.getMonth(),1).getTime(),m=(e.investments||[]).filter(k=>new Date(k.date).getTime()>=v),p=m.length,g=m.reduce((k,R)=>k+R.amount,0),f=Be(e,30),h=je(e,30),b=[];p>0&&b.push(`本月记录了 ${p} 笔自我投入`),c>0?b.push(`成长指数上升 ${Math.round(c)} 点`):c<0&&b.push("本月指数有所回落，可查看回落复盘");const E=e._milestones||[];E>0&&b.push(`达成 ${E} 个里程碑`);const B=[];return p===0&&B.push("建议每周至少记录一笔投入，保持成长节奏"),f<5&&B.push("增加一句话记录的频率，帮助觉察成长"),h!==null&&h<2.5&&B.push("近期情绪偏低，关注健康与休息"),B.length===0&&B.push("保持当前节奏，继续积累成长值"),{month:a,startPrice:Math.round(d),endPrice:Math.round(i),changePoints:Math.round(c),changePct:Math.round(u*10)/10,investCount:p,investAmount:g,journalDays:f,avgMood:h,highlights:b,suggestions:B}}function Ge(e){const t=e.getDay(),n=t===0?-6:1-t,a=new Date(e);return a.setDate(e.getDate()+n),a.setHours(0,0,0,0),a}function Pe(e){const t=new Date,n=Ge(t),a=new Date(n);a.setDate(n.getDate()+7);const i=(e.investments||[]).filter(v=>{const m=new Date(v.date).getTime();return m>=n.getTime()&&m<a.getTime()}).length,r=i>0;let s=0,d=new Date(t);for(;;){const v=Ge(d),m=new Date(v);if(m.setDate(v.getDate()+7),(e.investments||[]).some(g=>{const f=new Date(g.date).getTime();return f>=v.getTime()&&f<m.getTime()}))s++,d=new Date(v),d.setDate(v.getDate()-1);else{if(s===0&&d.getTime()===t.getTime()){d=new Date(v),d.setDate(v.getDate()-1);continue}break}if(s>520)break}const c=Math.max(0,7-(t.getDay()===0?7:t.getDay()-1));let u;return r?u=`本周已记录 ${i} 笔，继续保持！连续 ${s} 周`:c<=2?u=`本周还剩 ${c} 天，记一笔投入保持连续吧`:u=`本周还剩 ${c} 天，期待你的第一笔投入`,{investedThisWeek:r,countThisWeek:i,streakWeeks:s,daysLeftInWeek:c,message:u}}const ln={education:"🎓 教育",skill:"📚 技能",health:"💪 健康",network:"🤝 人脉",entertainment:"🎮 娱乐",other:"📦 其他"};function ye(e){const t={education:0,skill:0,health:0,network:0,entertainment:0,other:0};(e.history||[]).forEach(p=>{t[p.type]=(t[p.type]||0)+p.invest}),(e.investments||[]).forEach(p=>{t[p.type]=(t[p.type]||0)+p.amount});const n=Math.max(...Object.values(t),1),a=Object.keys(t).map(p=>({type:p,label:ln[p],value:Math.round(t[p]/n*100),amount:t[p]})),o=[...a].sort((p,g)=>g.amount-p.amount),i=o[0].type,r=o[o.length-1].type,s=a.map(p=>p.amount),d=s.reduce((p,g)=>p+g,0)/s.length;if(d===0)return{dimensions:a,dominant:i,weakest:r,balance:0};const c=s.reduce((p,g)=>p+(g-d)**2,0)/s.length,v=Math.sqrt(c)/d,m=Math.max(0,Math.min(1,1-v/2));return{dimensions:a,dominant:i,weakest:r,balance:Math.round(m*100)/100}}function cn(e,t=10,n=0){const a=e.age,o=[];let i=nt(e);const r=.06;for(let u=1;u<=t;u++){const v=a+u,m=Math.round(i*r),p=n;i=i-m+p,i=Math.max(0,i),o.push({age:v,bv:Math.round(i),depreciation:m,newInvest:p})}const s=o[4]?.bv||0,d=o[9]?.bv||0,c=[];return n===0&&c.push("未设定年度新增投入，成长值会随时间自然衰减"),d<i*.5&&(c.push("按当前节奏，10 年后成长积累可能缩水过半"),c.push("建议增加年度投入，或提升投入质量")),s>i&&c.push("按当前投入节奏，5 年后成长积累仍在增长"),c.push("健康与技能类投入折旧较慢，优先配置"),{points:o,bv5y:s,bv10y:d,annualDecayRate:r,suggestions:c}}function dn(e){const t=A(e).price;return[{scenario:"optimistic",label:"乐观",icon:"🚀",desc:"学习时长增加、健康改善、收入增长提速",mod:{studyHours:e.studyHours+5,healthScore:Math.min(100,e.healthScore+15),annualIncomeGrowth:e.annualIncomeGrowth+.05,debtRatio:Math.max(0,e.debtRatio-.1)}},{scenario:"neutral",label:"中性",icon:"➡️",desc:"保持当前节奏不变",mod:{}},{scenario:"pessimistic",label:"保守",icon:"🛡️",desc:"学习时长减少、健康下滑、收入停滞",mod:{studyHours:Math.max(0,e.studyHours-3),healthScore:Math.max(0,e.healthScore-15),annualIncomeGrowth:Math.max(0,e.annualIncomeGrowth-.05),debtRatio:Math.min(1,e.debtRatio+.1)}}].map(a=>{const o={...e,...a.mod},i=A(o);return{scenario:a.scenario,label:a.label,icon:a.icon,price:Math.round(i.price),changePct:t>0?Math.round((i.price-t)/t*1e3)/10:0,desc:a.desc,params:{studyHours:o.studyHours,healthScore:o.healthScore,incomeGrowth:o.annualIncomeGrowth,debtRatio:o.debtRatio}}})}function un(e){const t=e.familySupportCapital||0,n=e._familyEntries||[],a=(e.totalInvest||0)+t,o=a>0?t/a:0,i=[];return t===0&&i.push("可记录家庭/父母的累计投入，更全面地认识成长积累"),o>.5&&i.push("家庭支持占比较高，可逐步增加自我投入占比"),o>0&&o<=.5&&i.push("家庭支持与自我投入比例健康，继续保持"),n.length===0&&t>0&&i.push("可补充家庭投入的明细记录，便于感恩与回顾"),{totalSupport:t,entries:n,supportRatio:Math.round(o*100)/100,suggestions:i}}function pn(e){const t=new Date,n=new Date(t),a=n.getDay(),o=a===0?-6:1-a;n.setDate(t.getDate()+o);const i=`${n.getFullYear()}年${n.getMonth()+1}月第${Math.ceil(n.getDate()/7)}周`,r=A(e),s=Pe(e),d=Be(e,7);ct(e);const c=je(e,7),u=ye(e),v=[],m=[],p=[];s.investedThisWeek?v.push(`本周记录了 ${s.countThisWeek} 笔投入${s.streakWeeks>1?`，连续 ${s.streakWeeks} 周`:""}`):(m.push("本周还没有记录投入，下周至少记一笔"),p.push("周末前记录一笔自我投入")),d>=5?v.push(`本周记录了 ${d} 条成长感悟，觉察力在线`):d>=1?p.push("下周把记录频率提升到 3 次以上"):(m.push("本周没有成长记录，觉察是成长的第一步"),p.push("每天花 1 分钟写下一个想法"));let g="本周无情绪数据";if(c!==null&&(c>=3.5?(v.push("本周整体情绪很好，状态饱满"),g="😄 情绪很好，继续保持"):c>=2.5?g="🙂 情绪平稳":(m.push("本周情绪偏低，关注休息与健康"),g="😔 情绪偏低，多关注自己",p.push("安排一次放松或运动"))),u.balance>=.6)v.push("投入结构较均衡，多维发展");else{const h=u.dimensions.find(b=>b.type===u.weakest)?.label||"";m.push(`投入结构不均衡，${h}维度较弱`),p.push(`下周在${h}上增加一点投入`)}r.growthCoef>=1.2?v.push("成长动力强劲，保持当前节奏"):r.growthCoef<.9&&(m.push("成长动力偏弱，检查学习时长与健康"),p.push("增加每周学习时长，关注健康评分"));let f;return v.length>=2?f="本周成长势头良好，继续保持多维投入与觉察。":m.length>=2?f="本周有提升空间，从小行动开始调整节奏。":f="本周平稳，保持觉察，持续积累。",p.length===0&&p.push("保持当前节奏，下周复盘时看看有什么新变化"),{week:i,summary:f,highlights:v,improvements:m,actions:p,moodNote:g}}function vn(e,t){const n=new Date,a=n.getFullYear(),o=A(e),i=n.getFullYear()-e.birthYear-1;let r=o.price;const s=t.filter(k=>k.age<=i);s.length>0&&(r=s[s.length-1].price);const d=o.price-r,c=r>0?d/r*100:0,u=new Date(a,0,1).getTime(),v=(e.investments||[]).filter(k=>new Date(k.date).getTime()>=u),m=v.reduce((k,R)=>k+R.amount,0),p=v.length,g=Be(e,365),f=je(e,365),h=q.filter(k=>k.condition(e)).length,b=[];h>=5&&b.push("🏆 里程碑丰收"),p>=12&&b.push("💰 持续投入"),g>=100&&b.push("📝 勤于觉察"),e.healthScore>=75&&b.push("💪 健康在线"),o.growthCoef>=1.2&&b.push("🚀 高速成长"),b.length===0&&b.push("🌱 稳步积累");let E;d>0?E=`这一年，你的成长指数上升了 ${Math.round(d)} 点。每一笔投入、每一次觉察，都在累积成看得见的成长。`:d<0?E=`这一年有些起伏，指数回落了 ${Math.round(Math.abs(d))} 点。回落不是失败，是重新认识自己的机会。`:E="这一年平稳度过，成长在潜移默化中发生。";const B=[];return p<12&&B.push("每月至少记录一笔投入"),g<50&&B.push("每周记录 2-3 条成长感悟"),e.healthScore<70&&B.push("提升健康评分到 70 以上"),o.growthCoef<1&&B.push("增加学习时长，提升成长系数"),B.length===0&&B.push("保持当前节奏，设定更高的成长目标"),{year:a,startPrice:Math.round(r),endPrice:Math.round(o.price),changePoints:Math.round(d),changePct:Math.round(c*10)/10,totalInvest:m,investCount:p,journalDays:g,avgMood:f,milestoneCount:h,keywords:b,summary:E,nextYearPlan:B}}function Le(e){const t=ct(e),n=Pe(e),a=(e.investments||[]).length,o=(e.journals||[]).length,i=e._milestones||0;return[{id:"streak7",name:"七日觉察",icon:"🔥",desc:"连续 7 天记录成长感悟",progress:Math.min(t,7),target:7,done:t>=7,unit:"天"},{id:"streak30",name:"月度坚持",icon:"🌟",desc:"连续 30 天记录成长感悟",progress:Math.min(t,30),target:30,done:t>=30,unit:"天"},{id:"invest10",name:"十笔投入",icon:"💰",desc:"累计记录 10 笔自我投入",progress:Math.min(a,10),target:10,done:a>=10,unit:"笔"},{id:"weekly4",name:"周周不断",icon:"📅",desc:"连续 4 周每周至少一笔投入",progress:Math.min(n.streakWeeks,4),target:4,done:n.streakWeeks>=4,unit:"周"},{id:"journal50",name:"觉察达人",icon:"📝",desc:"累计记录 50 条成长感悟",progress:Math.min(o,50),target:50,done:o>=50,unit:"条"},{id:"milestone5",name:"里程碑收集者",icon:"🏆",desc:"达成 5 个成长里程碑",progress:Math.min(i,5),target:5,done:i>=5,unit:"个"}]}function mn(e){const t=Le(e),n=t.filter(a=>a.done).length;return Math.round(n/t.length*100)}const Ye=[{name:"成长教练",tone:"理性鼓励"},{name:"职场前辈",tone:"务实建议"},{name:"生活哲学家",tone:"温柔启发"}];function gn(e){const t=A(e),n=ye(e),a=Ye[new Date().getDate()%Ye.length],o=[],i=[];if(t.growthCoef>=1.2?o.push("你的成长动力很强，学习与投入节奏不错"):t.growthCoef<.9?o.push("近期成长动力偏弱，可能需要调整节奏"):o.push("成长节奏平稳，稳扎稳打"),e.healthScore>=80?o.push("健康状态良好，这是持续成长的底座"):e.healthScore<60&&o.push("健康评分偏低，身体是一切的基础"),n.balance>=.6)o.push("投入结构均衡，多维发展");else{const u=n.dimensions.find(v=>v.type===n.weakest)?.label.split(" ")[1]||"";o.push(`${u}维度投入相对较少`)}e.studyHours<5&&i.push("尝试每周增加 2-3 小时学习时间，成长系数会明显提升"),e.healthScore<70&&i.push("安排规律运动和睡眠，健康评分每提升 10 分，质量系数约提升 7%"),n.balance<.5&&i.push("在保持优势维度的同时，给薄弱维度一些投入，结构会更稳"),t.subjectiveAdjust<1&&i.push("你对自己的评价偏保守，不妨多看看已取得的进步"),i.length===0&&i.push("当前状态不错，给自己设定一个稍高的目标，然后稳步推进");const r=["成长不是百米冲刺，而是马拉松。你已经在路上了。","每一笔投入、每一次觉察，都在塑造未来的你。","不必和别人比，今天的你比昨天好一点，就是胜利。","低谷是蓄力，高峰是收获。享受这个过程。"],s=r[new Date().getDay()%r.length],d=new Date().getHours();let c;return d<6?c="夜深了，注意休息。":d<12?c="早上好，新的一天开始了。":d<18?c="下午好，今天过得怎么样？":c="晚上好，回顾一下今天的成长吧。",{persona:`${a.name}（${a.tone}）`,greeting:c,observations:o,advices:i,encouragement:s}}const fn=[{term:"成长积累",icon:"💎",short:"你累计投入自己的总和",detail:"包括教育、技能、健康、人脉等各维度的投入总和。它会随时间自然衰减，需要持续投入来保持与增长。",category:"基础"},{term:"成长指数",icon:"📈",short:"综合反映你当前成长状态的数值（单位：点）",detail:"基于成长积累、成长系数、质量系数、风险折扣、主观感知权重等综合计算。它不是分数，也不是金钱，而是一个帮助你觉察和调整的参考。",category:"基础"},{term:"成长系数",icon:"🚀",short:"反映你当前成长速度的倍率",detail:"受收入增长、学习时长、停滞惩罚等影响。学习时长每增加 5 小时/周，成长系数约提升 0.25。",category:"成长"},{term:"质量系数",icon:"✨",short:"反映生活质量对成长的放大作用",detail:"主要由健康评分决定。健康是 1，其他是 0。健康评分每提升 10 分，质量系数约提升 7%。",category:"成长"},{term:"主观感知权重",icon:"🎯",short:"你对自身成长价值的主观评估",detail:'范围 0.5-1.5，默认 1.0 中性。这是你对自己的主观评估，不影响客观成长积累，只影响你"感受到"的指数。',category:"心理"},{term:"折旧",icon:"📉",short:"成长积累随时间自然损耗",detail:"知识会遗忘，技能会生疏，健康会衰退。不同类型的投入折旧速度不同：健康最稳，教育折旧较快。持续投入是对抗折旧的唯一方式。",category:"方法"},{term:"回落",icon:"💧",short:"成长指数从阶段性高点回落的幅度",detail:"成长不是直线上升，回落是正常的。关键不是避免回落，而是在回落中复盘觉察，找到调整方向。",category:"心理"},{term:"里程碑",icon:"🏆",short:"成长路上的标志性节点",detail:"如获得第一份工作、升职加薪、考取证书等。里程碑会给指数带来额外加成，是对阶段性成长的肯定。",category:"成长"}],yn=[{stage:"学生期",ageRange:"18-22 岁",focus:"积累基础，探索方向",tips:["教育投入是核心，学好专业基础","多尝试不同领域，找到兴趣所在","开始建立健康习惯，受益终身","人脉投入从同学关系开始"]},{stage:"职场初期",ageRange:"23-28 岁",focus:"快速学习，建立能力",tips:["技能投入优先，快速提升职场竞争力","健康不能忽视，避免透支身体","人脉从同事和行业社群拓展","设定 3 年成长目标，定期复盘"]},{stage:"职场上升期",ageRange:"29-35 岁",focus:"深度积累，形成壁垒",tips:["在专业领域深耕，建立不可替代性","开始关注财务管理，控制负债",'健康管理从"被动"变"主动"'," mentoring 他人也是自我成长"]},{stage:"成熟期",ageRange:"36-45 岁",focus:"稳定输出，传承价值",tips:['从"学"转向"用"和"教"',"家庭与事业的平衡是关键","健康投入比重需提高","帮助年轻人成长，回馈社会"]}],Me=[{title:"致支持我的家人",content:"谢谢你们一直以来的支持和陪伴。我正在认真生活、持续成长，每一点进步都有你们的功劳。我会照顾好自己，也会努力成为更好的人。"},{title:"给爸爸妈妈的一封信",content:"这些年辛苦了。我知道成长不是一件容易的事，而你们的爱是我最坚实的后盾。我会好好珍惜自己，也会常回家看看。"},{title:"感恩有你",content:"感谢你在我成长路上的每一份付出。也许我不常说，但我都记得。我会带着这份爱，继续向前走。"},{title:"我在好好长大",content:"请放心，我在认真生活、努力成长。健康、学习、工作，我都在用心经营。谢谢你给我的一切，我会用成长来回报。"}];function ut(e,t){const n=t??new Date().getDate()%Me.length,a=Me[n];return{title:a.title,content:a.content,signature:`—— 一个正在成长的人（${e.age} 岁）`}}function me(){return Me.length}function He(e,t){const n=A(e),a=dt(e,t),o=ye(e),i=Le(e),r=[];return r.push("═══════════════════════════════════════"),r.push("         人 生 成 长 报 告"),r.push("═══════════════════════════════════════"),r.push(""),r.push(`生成时间：${new Date().toLocaleString("zh-CN")}`),r.push(""),r.push("【一、当前状态】"),r.push(`  成长指数：${Math.round(n.price)} 点`),r.push(`  累计成长值：${Math.round(n.bv)} 点`),r.push(`  成长系数：${n.growthCoef.toFixed(2)}`),r.push(`  质量系数：${n.qualityCoef.toFixed(2)}`),r.push(`  风险折扣：${Math.round(n.riskDiscount*100)}%`),r.push(`  主观感知权重：${n.subjectiveAdjust.toFixed(2)}`),r.push(""),r.push("【二、本月概览】"),r.push(`  月度变化：${a.changePoints>=0?"+":""}${a.changePoints} 点（${a.changePct>=0?"+":""}${a.changePct}%）`),r.push(`  投入笔数：${a.investCount} 笔，实际花费 ${a.investAmount.toLocaleString()} 元（仅为记录）`),r.push(`  记录天数：${a.journalDays} 天`),a.highlights.length>0&&(r.push("  本月亮点："),a.highlights.forEach(s=>r.push(`    - ${s}`))),r.push(""),r.push("【三、投入结构】"),o.dimensions.forEach(s=>{r.push(`  ${s.label}：${s.amount.toLocaleString()} 元`)}),r.push(`  均衡度：${Math.round(o.balance*100)}%`),r.push(""),r.push("【四、挑战进度】"),i.forEach(s=>{r.push(`  ${s.icon} ${s.name}：${s.progress}/${s.target} ${s.unit} ${s.done?"✓":""}`)}),r.push(""),r.push("【五、下月建议】"),a.suggestions.forEach(s=>r.push(`  • ${s}`)),r.push(""),r.push("═══════════════════════════════════════"),r.push("  本报告由「今日宜长进」在你的设备本地生成"),r.push("  数值为模型估算，仅供自我观察与反思，不构成理财、职业或心理建议"),r.push("═══════════════════════════════════════"),r.join(`
`)}function _(e){const t=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),a=String(e.getDate()).padStart(2,"0");return`${t}-${n}-${a}`}function N(e=new Date){return _(e)}function Y(e){const[t,n,a]=e.split("-").map(Number);return new Date(t,n-1,a)}let xe=0;function hn(e){return xe=(xe+1)%1e6,`${e}_${Date.now().toString(36)}_${xe}${Math.random().toString(36).slice(2,6)}`}function bn(e,t=new Date){const n=e.name.trim();if(!n)throw new Error("习惯名称不能为空");return{id:hn("h"),name:n,icon:e.icon||"⭐",color:e.color||"#ff8a4c",cadence:e.cadence,timesPerWeek:e.cadence==="weekly"?Math.min(7,Math.max(1,e.timesPerWeek||3)):1,linkedType:e.linkedType,investOnCheck:e.investOnCheck??!0,createdAt:t}}function xn(e,t){return new Set((e.habitChecks||[]).filter(n=>n.habitId===t).map(n=>n.date))}function wn(e,t,n){return e.findIndex(a=>a.habitId===t&&a.date===n)}function $n(e,t,n=N(),a=new Date){const o=[...e.habitChecks||[]],i=wn(o,t,n);let r,s=!1;return i>=0?(o.splice(i,1),r="unchecked"):(s=n<N(a),o.push({habitId:t,date:n,makeup:s||void 0}),r="checked"),{user:{...e,habitChecks:o},action:r,makeup:s}}function kn(e,t){return Math.round((Y(e).getTime()-Y(t).getTime())/864e5)}function Sn(e,t,n=new Date){if(t.cadence==="daily"){let d=0;const c=new Date(n.getFullYear(),n.getMonth(),n.getDate());for(;e.has(_(c));)d++,c.setDate(c.getDate()-1);return d}const a=new Date(n.getFullYear(),n.getMonth(),n.getDate()),o=(a.getDay()+6)%7,i=new Date(a);i.setDate(a.getDate()-o);let r=i;Ie(e,r,t.timesPerWeek)||(r=new Date(i),r.setDate(i.getDate()-7));let s=0;for(;Ie(e,r,t.timesPerWeek);)s++,r=new Date(r),r.setDate(r.getDate()-7);return s}function Ie(e,t,n,a=new Date){let o=0;for(let i=0;i<7;i++){const r=new Date(t);r.setDate(t.getDate()+i),!(r.getTime()>a.getTime())&&e.has(_(r))&&o++}return o>=n}function Mn(e,t,n=new Date){const a=Array.from(e).sort();if(a.length===0)return 0;if(t.cadence==="daily"){let v=1,m=1;for(let p=1;p<a.length;p++)kn(a[p],a[p-1])===1?(m++,v=Math.max(v,m)):m=1;return v}const o=Y(a[0]),i=(o.getDay()+6)%7,r=new Date(o);r.setDate(o.getDate()-i);const s=Y(a[a.length-1]);let d=0,c=0;const u=new Date(r);for(;u.getTime()<=s.getTime()+7*864e5;)Ie(e,u,t.timesPerWeek,n)?(c++,d=Math.max(d,c)):c=0,u.setDate(u.getDate()+7);return d}function G(e,t,n=new Date){const a=xn(e,t.id),o=new Date(n.getFullYear(),n.getMonth(),n.getDate()),i=(o.getDay()+6)%7,r=new Date(o);r.setDate(o.getDate()-i);const s=[];let d=0;for(let c=0;c<7;c++){const u=new Date(r);u.setDate(r.getDate()+c);const v=u.getTime()<=o.getTime()&&a.has(_(u));s.push(v),v&&d++}return{doneToday:a.has(_(o)),streak:Sn(a,t,n),bestStreak:Mn(a,t,n),weekCount:d,weekDots:s,weekTarget:t.cadence==="weekly"?t.timesPerWeek:7}}function In(e,t,n=12,a=new Date){const o=new Map;(e.habitChecks||[]).filter(v=>v.habitId===t.id).forEach(v=>o.set(v.date,v));const i=new Date(a.getFullYear(),a.getMonth(),a.getDate()),r=(i.getDay()+6)%7,s=new Date(i);s.setDate(i.getDate()-r);const d=new Date(s);d.setDate(s.getDate()-7*(n-1));const c=_(i),u=[];for(let v=0;v<n;v++){const m=[];for(let p=0;p<7;p++){const g=new Date(d);g.setDate(d.getDate()+v*7+p);const f=_(g),h=o.get(f);m.push({date:f,checked:!!h,makeup:!!h?.makeup,future:f>c})}u.push(m)}return u}let we=0;function Dn(){return we=(we+1)%1e6,`t_${Date.now().toString(36)}_${we}${Math.random().toString(36).slice(2,6)}`}function En(e,t=new Date){const n=e.title.trim();if(!n)throw new Error("待办标题不能为空");return{id:Dn(),title:n,note:e.note?.trim()||void 0,priority:e.priority??2,dueDate:e.dueDate||void 0,done:!1,createdAt:t}}function Tn(e,t=new Date){return e.done?{...e,done:!1,doneAt:void 0}:{...e,done:!0,doneAt:t}}function An(e,t){return!e.done&&!!e.dueDate&&e.dueDate<t}function Cn(e){return[...e].sort((t,n)=>{if(t.done!==n.done)return t.done?1:-1;if(!t.done&&!n.done){if(t.priority!==n.priority)return t.priority-n.priority;if(t.dueDate||n.dueDate){if(!t.dueDate)return 1;if(!n.dueDate)return-1;if(t.dueDate!==n.dueDate)return t.dueDate<n.dueDate?-1:1}return n.createdAt.getTime()-t.createdAt.getTime()}return(n.doneAt?.getTime()||0)-(t.doneAt?.getTime()||0)})}function We(e,t,n){let a=0,o=0;for(const i of e){const r=i.date instanceof Date?i.date:new Date(i.date);r.getFullYear()===t&&r.getMonth()===n&&(a+=i.amount||0,o++)}return{amount:a,count:o}}function zn(e,t){const n=t.now||new Date,a=n.getFullYear(),o=n.getMonth(),i=We(e.investments||[],a,o),r=new Date(a,o-1,1),s=We(e.investments||[],r.getFullYear(),r.getMonth()),d=t.sensitive&&(e.monthlyBudget??0)>0,c=!t.sensitive&&(e.monthlyCountBudget??0)>0,u=d?e.monthlyBudget:c?e.monthlyCountBudget:null,v=d?"amount":"count",m=v==="amount"?i.amount:i.count,p=v==="amount"?s.amount:s.count,g=n.getDate();return{mode:v,budget:u,spent:m,remaining:u===null?null:u-m,ratio:u===null?null:m/u,overrun:u!==null&&m>u,dailyAvg:g>0?m/g:0,lastMonth:p,deltaPct:p>0?(m-p)/p:null}}const P={education:{name:"教育",icon:"🎓",color:"#ff8a4c"},skill:{name:"技能",icon:"📚",color:"#f5a623"},health:{name:"健康",icon:"💪",color:"#3fa06a"},network:{name:"人脉",icon:"🤝",color:"#3e9b8f"},entertainment:{name:"娱乐",icon:"🎮",color:"#e0705b"},other:{name:"其他",icon:"📦",color:"#a79b8c"}};function Bn(e,t,n){const a=new Map((e.customTypes||[]).map(d=>[d.id,d])),o=new Map,i=(d,c)=>{const u=o.get(d)||{amount:0,count:0};u.amount+=c.amount||0,u.count+=1,o.set(d,u)};for(const d of e.investments||[]){const c=d.date instanceof Date?d.date:new Date(d.date);c.getFullYear()!==t||c.getMonth()!==n||(d.customType&&a.has(d.customType)?i(`custom:${d.customType}`,d):i(d.type,d))}const r=Array.from(o.values()).reduce((d,c)=>d+c.amount,0),s=[];for(const[d,c]of o)if(d.startsWith("custom:")){const u=a.get(d.slice(7));s.push({key:d,name:u.name,icon:u.icon,color:u.color,amount:c.amount,count:c.count,ratio:r>0?c.amount/r:0,custom:!0})}else{const u=P[d];s.push({key:d,name:u.name,icon:u.icon,color:u.color,amount:c.amount,count:c.count,ratio:r>0?c.amount/r:0,custom:!1})}return s.sort((d,c)=>c.amount-d.amount)}function jn(e,t=6,n=new Date){const a=[];for(let o=t-1;o>=0;o--){const i=new Date(n.getFullYear(),n.getMonth()-o,1),r=i.getFullYear(),s=i.getMonth();let d=0,c=0;for(const u of e.investments||[]){const v=u.date instanceof Date?u.date:new Date(u.date);v.getFullYear()===r&&v.getMonth()===s&&(d+=u.amount||0,c++)}a.push({key:`${r}-${s+1}`,label:`${s+1}月`,amount:d,count:c})}return a}let $e=0;function Pn(){return $e=($e+1)%1e6,`e_${Date.now().toString(36)}_${$e}${Math.random().toString(36).slice(2,6)}`}function pt(e,t){const n=t.title.trim();if(!n)throw new Error("事件标题不能为空");const a={id:Pn(),date:t.date||new Date,icon:t.icon||"🌟",title:n,desc:t.desc?.trim()||void 0,kind:"manual"};return{...e,lifeEvents:[...e.lifeEvents||[],a]}}function Ve(e,t){const a=[...pt(e,t).lifeEvents||[]];return a[a.length-1]={...a[a.length-1],kind:"streak"},{...e,lifeEvents:a}}function Ln(e,t){return{...e,lifeEvents:(e.lifeEvents||[]).filter(n=>!(n.id===t&&n.kind==="manual"))}}const Hn={jobloss:{icon:"💼",name:"工作变动"},illness:{icon:"🏥",name:"健康风波"},loss:{icon:"🌧️",name:"失去与告别"},stagnate:{icon:"🪫",name:"停滞期"}};function Rn(e){const t=P[e.type],n=t.icon,a=e.desc||`${t.name}投入`;return{icon:n,title:a}}function Nn(e){const t=[];(e.investments||[]).forEach((i,r)=>{const s=i.date instanceof Date?i.date:new Date(i.date),d=Rn(i);t.push({id:`inv_${r}_${s.getTime()}`,date:s,icon:d.icon,title:i.amount>0?`${d.title} · ${i.amount.toLocaleString()} 元`:d.title,deletable:!1,source:"invest"})}),(e.journals||[]).forEach((i,r)=>{const s=i.date instanceof Date?i.date:new Date(i.date);t.push({id:`jrn_${r}_${s.getTime()}`,date:s,icon:i.mood?{great:"😄",good:"🙂",ok:"😐",low:"😔"}[i.mood]:"✨",title:i.content,deletable:!1,source:"journal"})}),(e.setbacks||[]).forEach((i,r)=>{const s=i.date instanceof Date?i.date:new Date(i.date),d=Hn[i.type];t.push({id:`sb_${r}_${s.getTime()}`,date:s,icon:d.icon,title:`${d.name}（影响 ${i.severity}%）`,deletable:!1,source:"setback"})}),(e.lifeEvents||[]).forEach(i=>{const r=i.date instanceof Date?i.date:new Date(i.date);t.push({id:i.id,date:r,icon:i.icon,title:i.title,desc:i.desc,deletable:i.kind!=="streak",source:i.kind||"manual"})}),t.sort((i,r)=>r.date.getTime()-i.date.getTime());const n=new Map;for(const i of t){const r=`${i.date.getFullYear()}-${String(i.date.getMonth()+1).padStart(2,"0")}`;n.has(r)||n.set(r,[]),n.get(r).push(i)}const a=Array.from(n.entries()).sort((i,r)=>i[0]<r[0]?1:-1).map(([i,r])=>{const[s,d]=i.split("-");return{key:i,label:`${s} 年 ${Number(d)} 月`,items:r}}),o=q.filter(i=>i.condition(e)).map(i=>({icon:i.icon,name:i.name,desc:i.desc}));return{months:a,achievedMilestones:o}}function _n(e,t={}){const n={...t};let a=!1,o=!1;if(typeof n.target=="number"&&n.target>0){const i=e>=n.target;a=i&&!n.targetHit,n.targetHit=i}else n.targetHit=!1;if(typeof n.floor=="number"&&n.floor>0){const i=e<=n.floor;o=i&&!n.floorHit,n.floorHit=i}else n.floorHit=!1;return{alert:n,targetNew:a,floorNew:o}}class Fn{get(t){return localStorage.getItem(t)}set(t,n){localStorage.setItem(t,n)}remove(t){localStorage.removeItem(t)}clear(){localStorage.clear()}}const F=new Fn,Re="lifeStockUser",vt="disclaimerConfirmed",mt="privacyConsent",De="sensitiveConsent";function gt(e){return e.investments=(e.investments||[]).map(t=>({...t,date:new Date(t.date)})),e.setbacks&&(e.setbacks=e.setbacks.map(t=>({...t,date:new Date(t.date)}))),e.journals&&(e.journals=e.journals.map(t=>({...t,date:new Date(t.date)}))),e.habits&&(e.habits=e.habits.map(t=>({...t,createdAt:new Date(t.createdAt)}))),e.todos&&(e.todos=e.todos.map(t=>({...t,createdAt:new Date(t.createdAt),doneAt:t.doneAt?new Date(t.doneAt):void 0}))),e.lifeEvents&&(e.lifeEvents=e.lifeEvents.map(t=>({...t,date:new Date(t.date)}))),e.enhancedSurvey?.completedAt&&(e.enhancedSurvey={...e.enhancedSurvey,completedAt:new Date(e.enhancedSurvey.completedAt)}),e}function $(e){F.set(Re,JSON.stringify(e))}function On(){const e=F.get(Re);if(!e)return null;try{const t=JSON.parse(e);return gt(lt(t,t.version))}catch{return null}}function qn(){F.remove(Re)}function Gn(){return F.get(mt)==="1"}function Yn(){F.set(mt,"1")}function H(){return F.get(De)==="1"}function Wn(e){e?F.set(De,"1"):F.remove(De)}function Vn(){F.clear()}function Un(){return F.get(vt)==="1"}function Jn(){F.set(vt,"1")}function Kn(e){const t={...Xt(e),exportTime:new Date().toISOString()},n=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),a=URL.createObjectURL(n),o=document.createElement("a");o.href=a,o.download=`life-index-${e.age}岁-${new Date().toISOString().slice(0,10)}.json`,o.click(),URL.revokeObjectURL(a)}function Xn(e){const t=JSON.parse(e);if(!t.age||!t.history)throw new Error("文件格式不正确");return gt(lt(t,t.version))}function Qn(){l&&Kn(l)}function Zn(e){const t=e.target.files?.[0];if(!t)return;const n=new FileReader;n.onload=a=>{try{l=Xn(a.target.result),$(l),M(),y("✅ 数据已导入")}catch{y("❌ 导入失败：文件格式不正确")}},n.readAsText(t),e.target.value=""}let l=null,K=0,ue="education",T={};window.startOnboarding=eo;window.showAnchorModal=vo;window.showForecastModal=ho;window.showShareModal=bo;window.showSetbackModal=xo;window.showDetailModal=$o;window.showParentModal=ko;window.editProfile=So;window.resetAll=Mo;window.exportData=Qn;window.importData=Zn;window.handleDeleteAllData=To;window.closeModal=C;window.showLegalModal=Ae;const Ue=[{title:"第1步：你今年多大？",desc:"年龄帮我们找到你在人生曲线上的位置",field:"age",type:"number",placeholder:"请输入年龄（1-100）"},{title:"第2步：你来自哪里？",desc:"不同城市的成长成本不太一样",field:"region",type:"select",options:[{value:"tier1",label:"一线城市（北上广深）"},{value:"new_tier1",label:"新一线城市"},{value:"tier2",label:"二线城市"},{value:"tier3",label:"三线及以下"}]},{title:"第3步：家庭条件？",desc:"家庭支持也是成长积累的一部分",field:"income",type:"select",options:[{value:"low",label:"困难"},{value:"below_avg",label:"偏低"},{value:"avg",label:"一般"},{value:"above_avg",label:"较好"},{value:"high",label:"富裕"}]},{title:"第4步：你的学历？",desc:"学历是会跟你一辈子的资产",field:"education",type:"select",options:[{value:"primary",label:"小学"},{value:"junior",label:"初中"},{value:"senior",label:"高中"},{value:"college",label:"大专"},{value:"bachelor",label:"本科"},{value:"master",label:"硕士及以上"}]},{title:"第5步：你的年收入？",desc:"收入是成长力的一部分，填税前年薪就好",field:"annualIncome",type:"number",placeholder:"请输入税前年收入（元），如 120000"},{title:"第6步：收入增长趋势？",desc:"持续增长会让成长更有动力",field:"annualIncomeGrowth",type:"select",options:[{value:"0",label:"下降"},{value:"0.05",label:"稳定"},{value:"0.1",label:"稳步增长"},{value:"0.2",label:"快速增长"}]},{title:"第7步：每周学习时长？",desc:"学习是最值得的自我投入",field:"studyHours",type:"select",options:[{value:"0",label:"几乎不学习"},{value:"2",label:"约2小时"},{value:"5",label:"约5小时"},{value:"10",label:"10小时以上"}]},{title:"第8步：健康状况？",desc:"健康是一切的底座",field:"healthScore",type:"select",options:[{value:"40",label:"较差"},{value:"60",label:"一般"},{value:"75",label:"良好"},{value:"90",label:"优秀"}]},{title:"第9步：负债情况？",desc:"适度负债没关系，留意它的影响就好",field:"debtRatio",type:"select",options:[{value:"0",label:"无负债"},{value:"0.1",label:"少量负债"},{value:"0.3",label:"中等负债"},{value:"0.6",label:"高负债"}]},{title:"第10步：人生节点（可多选）",desc:"已达成的节点都是成长的里程碑",field:"milestones",type:"multi",options:[{value:"hasJob",label:"💼 有工作"},{value:"salaryRaised",label:"💰 涨过薪"},{value:"hasLicense",label:"🚗 有驾照"},{value:"marathon",label:"🏃 跑过马拉松"},{value:"married",label:"💍 已婚"},{value:"hasHouse",label:"🏠 有房"},{value:"hasChild",label:"👶 有孩子"}]}];function ge(){return H()?Ue:Ue.filter(e=>e.field!=="annualIncome"&&e.field!=="debtRatio")}function eo(){K=0,T={},document.getElementById("landing")?.classList.add("hidden"),ft()}function ft(){const t=ge()[K],n=w(t.title,t.desc);let a="";t.type==="number"?a=`<input type="number" id="onboardInput" class="form-input" placeholder="${t.placeholder}" style="width:100%;padding:12px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);font-size:16px;">`:t.type==="select"?a=`<select id="onboardInput" style="width:100%;padding:12px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);font-size:16px;">
      ${t.options.map(o=>`<option value="${o.value}">${o.label}</option>`).join("")}
    </select>`:t.type==="multi"&&(a=`<div id="multiOptions" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      ${t.options.map(o=>`<label style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--surface-softer);border-radius:10px;cursor:pointer;"><input type="checkbox" value="${o.value}"> ${o.label}</label>`).join("")}
    </div>`),a+=`<div class="form-actions"><button class="btn-primary" onclick="submitOnboarding()">${K===ge().length-1?"生成我的成长曲线":"下一步"}</button></div>`,n.querySelector(".modal-body").innerHTML=a}window.submitOnboarding=to;function to(){const e=ge()[K];if(e.type==="multi")Array.from(document.querySelectorAll("#multiOptions input:checked")).map(n=>n.value).forEach(n=>{T[n]=!0});else{const t=document.getElementById("onboardInput").value;e.type==="number"?T[e.field]=Number(t):T[e.field]=t}K++,K>=ge().length?no():ft()}function no(){const e=T.age;l={age:e,region:T.region,area:"urban",income:T.income,education:T.education,birthYear:new Date().getFullYear()-e,annualIncome:H()?T.annualIncome:1e5,annualIncomeGrowth:Number(T.annualIncomeGrowth??.05),studyHours:Number(T.studyHours),healthScore:Number(T.healthScore),debtRatio:H()?Number(T.debtRatio):0,hasJob:!!T.hasJob,salaryRaised:!!T.salaryRaised,hasLicense:!!T.hasLicense,marathon:!!T.marathon,married:!!T.married,hasHouse:!!T.hasHouse,hasChild:!!T.hasChild,totalInvest:0,history:qt({age:e,region:T.region,area:"urban",income:T.income,education:T.education}),investments:[],familySupportCapital:0,subjectiveWeight:1,version:Ce},$(l),C(),M(),y(H()?"✅ 成长曲线已生成！":"✅ 成长曲线已生成（敏感项使用估算值）"),setTimeout(()=>St(!0),400)}function M(){if(!l)return;const e=l;document.getElementById("landing")?.classList.add("hidden"),document.getElementById("dashboard")?.classList.remove("hidden");const t=A(e);document.getElementById("dashPrice").textContent=Math.round(t.price).toLocaleString()+" 点";const n=document.getElementById("dashChange");n.textContent=(t.change>=0?"+":"")+t.change+"%",n.style.color=t.change>=0?"var(--accent-green)":"var(--accent-red)",document.getElementById("dashBV").textContent=Math.round(t.bv).toLocaleString()+" 点",document.getElementById("dashEPS").textContent=String(t.eps),document.getElementById("dashROE").textContent=t.roe+"%",document.getElementById("dashPE").textContent=t.pe==="—"?"—":t.pe+"倍";const a=ke(e),o=a.level==="high"?"var(--accent-green)":a.level==="medium"?"var(--accent-yellow)":"var(--accent-red)",i=Math.round(a.estimatedRatio*100),r=Math.round(a.potentialEstimatedRatio*100);document.getElementById("dashConfidence").innerHTML=`<span style="color:${o};font-weight:bold;">● ${a.label}</span> 本指数含 ${i}% 估算成分`+(a.level!=="high"?`，<a href="javascript:showSurveyModal()" style="color:var(--accent);font-weight:600;text-decoration:underline;">📋 填强化调查表可降至 ${r}%</a>`:"，真实数据充足")+'<br><a href="javascript:showAnchorModal()" style="color:var(--text-muted);text-decoration:underline;">手动校准</a> · <a href="javascript:showDetailModal()" style="color:var(--text-muted);text-decoration:underline;">数据来源</a>';const s=document.getElementById("surveyBadge");if(s){const m=st(e);s.innerHTML=m.verifiedYears>0?`<a onclick="showSurveyModal()" style="font-size:12px;font-weight:600;color:var(--accent-green);cursor:pointer;">✓ 已精确化 ${m.verifiedYears}/${m.totalYears} 岁</a>`:'<a onclick="showSurveyModal()" style="font-size:12.5px;font-weight:normal;cursor:pointer;color:var(--accent);">📋 强化调查</a>'}const d=V(e);po(d,e);const c=_n(t.price,e.priceAlert||{});JSON.stringify(c.alert)!==JSON.stringify(e.priceAlert||{})&&(e.priceAlert=c.alert,$(e)),c.targetNew&&y("🎉 恭喜！成长指数突破目标位"),c.floorNew&&y("🟡 指数回到支撑位附近，正好打开「回落复盘」看看"),ga(e);const u=document.getElementById("investAmount");u&&(H()?(u.placeholder="这笔花了多少（元，仅存本机）",u.disabled=!1):(u.placeholder="未授权金额信息，可只写描述直接添加",u.disabled=!0,u.value=""));const v=document.getElementById("investDate");v&&!v.value&&(v.value=N()),ht(e),uo(e),Ne(e),bt(e),xt(e),fa(e,t),ca(e),pa(e),oa(e)}let ie=null,pe="all",Ee="";window.selectInvestKey=oo;function oo(e){l&&(e.startsWith("custom:")?ie=e.slice(7):(ue=e,ie=null),ht(l))}function yt(e){if(ie){const n=(e.customTypes||[]).find(a=>a.id===ie&&!a.archived);if(n)return{key:"custom:"+n.id,label:n.name,icon:n.icon,color:n.color,type:n.baseType,customId:n.id};ie=null}const t=P[ue];return{key:ue,label:t.name,icon:t.icon,color:t.color,type:ue}}function ht(e){const t=document.getElementById("investTypes");if(!t)return;const n=yt(e).key;t.innerHTML=Q(e).map(a=>`<div class="invest-type ${n===a.key?"selected":""}" data-key="${a.key}" onclick="selectInvestKey('${a.key}')">${a.icon} ${I(a.label)}</div>`).join("")+'<div class="invest-type invest-type-add" onclick="showCustomTypeManager()">＋ 分类</div>'}window.addInvestment=ao;function ao(){if(!l)return;const e=l,t=document.getElementById("investAmount"),n=document.getElementById("investDesc"),a=document.getElementById("investDate"),o=H(),i=o?Number(t.value):0;if(o&&t.value&&(!i||i<0)){y("请输入有效金额，或留空仅记录事件");return}const r=yt(e),s=a&&a.value?Y(a.value):new Date;e.investments.push({type:r.type,customType:r.customId,amount:i,desc:n.value.trim()||void 0,date:s}),e.totalInvest+=i,t.value="",n.value="",a&&(a.value=N()),$(e),M(),y(o&&i>0?`✅ 已记录这笔投入 ${i.toLocaleString()} 元，成长指数已更新`:"✅ 已记录这笔投入，成长指数已更新")}window.editInvest=io;window.deleteInvest=ro;function io(e){if(!l)return;const t=l,n=t.investments[e];if(!n)return;const a=H(),o=n.customType?"custom:"+n.customType:n.type,i=w("✏️ 编辑这笔投入","修改日期、分类、金额或描述，指数会按新内容重算");i.querySelector(".modal-body").innerHTML=`
    <label style="font-size:13px;font-weight:bold;">日期</label>
    <input type="date" id="editInvDate" value="${_(new Date(n.date))}" max="${N()}" style="width:100%;margin:6px 0 14px;">
    <label style="font-size:13px;font-weight:bold;">分类</label>
    <div id="editInvTypes" style="display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 14px;">
      ${Q(t).map(r=>`<div class="invest-type ${o===r.key?"selected":""}" onclick="document.querySelectorAll('#editInvTypes .invest-type').forEach(x=>x.classList.remove('selected'));this.classList.add('selected');this.parentNode.dataset.key='${r.key}';">${r.icon} ${I(r.label)}</div>`).join("")}
    </div>
    <label style="font-size:13px;font-weight:bold;">金额（元）${a?"":"· 未授权金额，已停用"}</label>
    <input type="number" id="editInvAmount" value="${n.amount||""}" ${a?"":"disabled"} placeholder="可留空，仅记录事件" style="width:100%;margin:6px 0 14px;">
    <label style="font-size:13px;font-weight:bold;">描述</label>
    <input type="text" id="editInvDesc" value="${I(n.desc||"")}" placeholder="可选" style="width:100%;margin:6px 0 14px;">
    <div class="form-actions" style="justify-content:space-between;">
      <button class="dash-btn danger" onclick="deleteInvest(${e})">🗑 删除这笔</button>
      <button class="btn-primary" onclick="saveInvestEdit(${e})">保存</button>
    </div>`,document.getElementById("editInvTypes").dataset.key=o}window.saveInvestEdit=so;function so(e){if(!l)return;const t=l,n=t.investments[e];if(!n)return;const a=document.getElementById("editInvTypes").dataset.key||n.type,o=Q(t).find(d=>d.key===a),i=document.getElementById("editInvDate").value,r=H()?Number(document.getElementById("editInvAmount").value)||0:n.amount,s=document.getElementById("editInvDesc").value.trim();n.date=i?Y(i):n.date,n.type=o?o.type:n.type,n.customType=o?.customId,n.amount=r,n.desc=s||void 0,t.totalInvest=t.investments.reduce((d,c)=>d+(c.amount||0),0),$(t),C(),M(),y("✅ 已保存修改")}function ro(e){if(!l)return;const t=l,n=t.investments[e];n&&confirm(`确定删除这笔「${n.desc||$t(t,n).name}」记录吗？`)&&(t.investments.splice(e,1),t.totalInvest=t.investments.reduce((a,o)=>a+(o.amount||0),0),$(t),C(),M(),y("已删除"))}window.setInvestFilter=lo;function lo(e){pe=e,l&&Ne(l)}window.setInvestKeyword=co;function co(e){Ee=e.trim(),l&&Ne(l)}function uo(e){const t=q.filter(a=>a.condition(e));document.getElementById("milestoneCount").textContent=`(${t.length}/${q.length})`;const n=document.getElementById("milestoneList");n.innerHTML=q.map(a=>{const o=a.condition(e);return`<div class="milestone-item ${o?"done":""}" style="opacity:${o?1:.5};">
      <span class="m-icon">${a.icon}</span>
      <span class="m-name">${a.name} <span style="font-size:11px;color:var(--text-muted);">${a.desc}</span></span>
      <span class="m-bonus">${o?"✓ +"+a.bonus:"+"+a.bonus}</span>
    </div>`}).join("")}function Ne(e){const t=document.getElementById("investFilterBar");if(t){const o=[{key:"all",label:"全部"},...Q(e)];t.innerHTML=o.map(i=>{const r=("label"in i,i.label),s=i.key;return`<span class="filter-chip ${pe===s?"active":""}" onclick="setInvestFilter('${s}')">${r}</span>`}).join("")}const n=document.getElementById("investList");if(e.investments.length===0){n.innerHTML='<div style="text-align:center;color:var(--text-secondary);padding:30px;">还没有投入记录，记一笔试试吧</div>';return}const a=e.investments.map((o,i)=>({inv:o,idx:i,disp:$t(e,o)})).filter(({inv:o,disp:i})=>!(pe!=="all"&&(o.customType?"custom:"+o.customType:o.type)!==pe||Ee&&!`${o.desc||""}${i.name}`.toLowerCase().includes(Ee.toLowerCase()))).reverse();if(a.length===0){n.innerHTML='<div style="text-align:center;color:var(--text-muted);padding:24px;">没有符合条件的记录</div>';return}n.innerHTML=a.map(({inv:o,idx:i,disp:r})=>`
    <div class="invest-item">
      <span class="i-type" style="${o.customType?`background:${r.color}22;`:""}">${r.icon}</span>
      <div class="i-info">
        <div>${I(o.desc||r.name)} <span style="font-size:10px;color:${r.color};font-weight:bold;">${I(r.name)}</span> ${o.impact?'<span class="i-impact">⭐ 影响大</span>':""}</div>
        <div style="font-size:11px;color:var(--text-muted);">${new Date(o.date).toLocaleDateString("zh-CN")}</div>
      </div>
      <span class="i-amount">${o.amount>0?o.amount.toLocaleString()+" 元":"事件"}</span>
      <span class="i-actions">
        <span class="i-edit" title="编辑" onclick="editInvest(${i})">✏️</span>
      </span>
    </div>
  `).join("")}function po(e,t){const n=document.getElementById("klineCanvas");if(!n||e.length<2)return;const a=n.getBoundingClientRect();n.width=a.width*2,n.height=a.height*2;const o=n.getContext("2d");o.scale(2,2);const i=a.width,r=a.height,s={l:50,r:55,t:20,b:40},d=i-s.l-s.r,c=50,u=r-s.t-s.b-c-10,v=s.t+u+10,m=e.map(x=>x.price),p=Math.min(...m)*.95,g=Math.max(...m)*1.05,f=g-p||1,h=Math.max(...e.map(x=>x.invest),1),b=rt(t),E=s.t+u*(1-(b-p)/f),B=e.map((x,D)=>{const j=Math.max(0,D-4);return e.slice(j,D+1).reduce((z,de)=>z+de.price,0)/(D-j+1)});o.clearRect(0,0,i,r),o.strokeStyle="rgba(120,95,60,0.12)";for(let x=0;x<=4;x++){const D=s.t+u/4*x;o.beginPath(),o.moveTo(s.l,D),o.lineTo(i-s.r,D),o.stroke(),o.fillStyle="rgba(163,150,132,0.95)",o.font="11px sans-serif",o.fillText(String(Math.round(g-f/4*x)),5,D+4)}const k=d/(e.length-1);E>=s.t&&E<=s.t+u&&(o.strokeStyle="rgba(224,153,47,0.55)",o.lineWidth=1.2,o.setLineDash([6,4]),o.beginPath(),o.moveTo(s.l,E),o.lineTo(i-s.r,E),o.stroke(),o.setLineDash([]),o.fillStyle="#c9871f",o.font="bold 10px sans-serif",o.fillText("同龄人 "+Math.round(b)+" 点",i-s.r+3,E+3));const R=t.priceAlert,Oe=(x,D,j)=>{if(!x||x<p||x>g)return;const z=s.t+u*(1-(x-p)/f);o.strokeStyle=D,o.lineWidth=1.4,o.setLineDash([8,4]),o.beginPath(),o.moveTo(s.l,z),o.lineTo(i-s.r,z),o.stroke(),o.setLineDash([]),o.fillStyle=D,o.font="bold 10px sans-serif",o.fillText(`${j} ${x} 点`,s.l+4,z-4)};Oe(R?.target,"#3fa06a","🎯 目标"),Oe(R?.floor,"#e05c4b","🟡 支撑");const he=o.createLinearGradient(0,s.t,0,s.t+u);he.addColorStop(0,"rgba(255,138,76,0.3)"),he.addColorStop(1,"rgba(255,138,76,0)"),o.beginPath(),o.moveTo(s.l,s.t+u),e.forEach((x,D)=>{const j=s.l+k*D,z=s.t+u*(1-(x.price-p)/f);o.lineTo(j,z)}),o.lineTo(s.l+d,s.t+u),o.closePath(),o.fillStyle=he,o.fill(),o.beginPath(),B.forEach((x,D)=>{const j=s.l+k*D,z=s.t+u*(1-(x-p)/f);D===0?o.moveTo(j,z):o.lineTo(j,z)}),o.strokeStyle="rgba(62,155,143,0.7)",o.lineWidth=1.5,o.setLineDash([4,3]),o.stroke(),o.setLineDash([]),o.beginPath(),e.forEach((x,D)=>{const j=s.l+k*D,z=s.t+u*(1-(x.price-p)/f);D===0?o.moveTo(j,z):o.lineTo(j,z)}),o.strokeStyle="#ff8a4c",o.lineWidth=2.5,o.stroke();const It=[0,6,15,18,22,30];e.forEach((x,D)=>{const j=s.l+k*D,z=s.t+u*(1-(x.price-p)/f);It.includes(x.age)?(o.beginPath(),o.arc(j,z,5,0,Math.PI*2),o.fillStyle="#3fa06a",o.fill(),o.strokeStyle="#ffffff",o.lineWidth=2,o.stroke()):x.verified&&(o.beginPath(),o.arc(j,z,3.5,0,Math.PI*2),o.fillStyle="rgba(62,155,143,0.25)",o.fill(),o.strokeStyle="#3e9b8f",o.lineWidth=1.5,o.stroke())});const U=e[e.length-1],qe=s.t+u*(1-(U.price-p)/f);o.fillStyle=U.price>=b?"#3fa06a":"#e05c4b",o.fillRect(i-s.r,qe-9,50,18),o.fillStyle="#fff",o.font="bold 11px sans-serif",o.textAlign="center",o.fillText(Math.round(U.price)+" 点",i-s.r+25,qe+4),o.textAlign="left",e.forEach((x,D)=>{const j=s.l+k*D,z=x.invest/h*c,de=Math.max(1,k*.5);if(o.fillStyle=x.verified?"rgba(62,155,143,0.9)":U.price>=m[0]?"rgba(63,160,106,0.4)":"rgba(224,92,75,0.4)",o.fillRect(j-de/2,v+c-z,de,z),x.setback&&D<e.length-1){const Tt=s.t+u*(1-(x.price-p)/f);o.fillStyle="#e05c4b",o.font="11px sans-serif",o.textAlign="center",o.fillText("▼",j,Tt+14),o.textAlign="left"}});const Dt=Math.max(1,Math.floor(e.length/8));o.fillStyle="rgba(163,150,132,0.95)",o.font="11px sans-serif",e.forEach((x,D)=>{(D%Dt===0||D===e.length-1)&&o.fillText(x.age+"岁",s.l+k*D-10,r-s.b+20)}),o.font="10px sans-serif",o.fillStyle="#ff8a4c",o.fillRect(s.l+5,s.t+4,12,3),o.fillStyle="#6f6558",o.fillText("指数",s.l+21,s.t+8),o.fillStyle="#3e9b8f",o.fillRect(s.l+50,s.t+4,12,3),o.fillStyle="#6f6558",o.fillText("MA5",s.l+66,s.t+8),o.fillStyle="#e0992f",o.fillRect(s.l+105,s.t+4,12,3),o.fillStyle="#6f6558",o.fillText("同龄人",s.l+121,s.t+8);const be=e.some(x=>x.verified),Et=e.some(x=>x.setback);be&&(o.fillStyle="#3e9b8f",o.fillRect(s.l+175,s.t+4,12,3),o.fillStyle="#6f6558",o.fillText("真实数据",s.l+191,s.t+8)),Et&&(o.fillStyle="#e05c4b",o.font="9px sans-serif",o.fillText("▼",s.l+(be?250:175),s.t+8),o.fillStyle="#6f6558",o.font="10px sans-serif",o.fillText("波折",s.l+(be?260:185),s.t+8)),document.getElementById("klineAge").textContent=`（${U.age}岁，当前 ${Math.round(U.price)} 点）`}function w(e,t){const n=document.getElementById("modalContainer");return n.innerHTML=`<div class="modal-overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal" style="position:relative;">
      <button class="modal-close" onclick="closeModal()">×</button>
      <h2>${e}</h2>
      <p class="modal-desc">${t}</p>
      <div class="modal-body"></div>
    </div>
  </div>`,n.querySelector(".modal")}function C(){document.getElementById("modalContainer").innerHTML=""}function y(e){const t=document.createElement("div");t.className="toast",t.textContent=e,document.getElementById("toastContainer").appendChild(t),setTimeout(()=>t.remove(),2500)}function vo(){if(!l)return;const e=w("🎯 校准指数","用真实数据修正估算，提升指数置信度");e.querySelector(".modal-body").innerHTML=`
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
        <input type="number" id="anchorAge" value="${l.age}" style="width:100%;padding:10px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);margin-bottom:10px;">
        <div class="form-label">该年真实投入（元）</div>
        <input type="number" id="anchorAmount" placeholder="如 30000" style="width:100%;padding:10px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);margin-bottom:10px;">
        <button class="btn-primary" onclick="applyAnchor()" style="width:100%;">应用校准</button>
      </div>

      <!-- B1-2：手动调整家庭支持 -->
      <div style="padding:12px;background:rgba(62,155,143,0.08);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">② 家庭支持（万元，选填）</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">父母/家庭对你的累计投入折算，不折旧、不乘权重，单独计入累计成长值。仅保存在本机。</div>
        <input type="number" id="familyCapital" value="${l.familySupportCapital||0}" step="1" style="width:100%;padding:10px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);margin-bottom:10px;">
        <button class="btn-primary" onclick="applyFamilyCapital()" style="width:100%;">保存家庭支持</button>
      </div>

      <!-- B1-3：标记"对我影响大"的投入 -->
      <div style="padding:12px;background:rgba(255,138,76,0.08);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">③ 标记"对我影响很大"的投入</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">已记录的自我投入中，标记后会在明细页高亮展示（不改变数值，仅反映主观感知）。</div>
        ${l.investments.length===0?'<div style="font-size:12px;color:var(--text-muted);">暂无手动记录的投入。先去「记一笔」添加吧。</div>':l.investments.map((t,n)=>`
            <label style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--surface-softer);border-radius:8px;margin-bottom:6px;cursor:pointer;">
              <input type="checkbox" id="impact_${n}" ${t.impact?"checked":""}>
              <span style="font-size:13px;">${t.desc||t.type} · ${t.amount.toLocaleString()} 元</span>
            </label>
          `).join("")}
        ${l.investments.length>0?'<button class="btn-primary" onclick="applyImpact()" style="width:100%;margin-top:8px;">保存标记</button>':""}
      </div>

      <!-- 主观感知权重 -->
      <div style="padding:12px;background:rgba(63,160,106,0.08);border-radius:10px;">
        <div style="font-weight:bold;margin-bottom:8px;">④ 主观感知权重（${l.subjectiveWeight||1}）</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">你觉得自己的成长值这个权重吗？1.0 为中性，0.5 偏低、1.5 偏高。这是你的主观判断，不影响客观累计成长值。</div>
        <input type="range" id="subjectiveRange" min="0.5" max="1.5" step="0.05" value="${l.subjectiveWeight||1}" style="width:100%;" oninput="document.getElementById('subjVal').textContent=this.value">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);">
          <span>0.5（偏低）</span><span id="subjVal">${l.subjectiveWeight||1}</span><span>1.5（偏高）</span>
        </div>
        <button class="btn-primary" onclick="applySubjective()" style="width:100%;margin-top:10px;">保存主观权重</button>
      </div>
    </div>
  `}window.applySubjective=mo;function mo(){if(!l)return;const e=Number(document.getElementById("subjectiveRange").value);l.subjectiveWeight=Nt(e),$(l),M(),y("✅ 主观权重已设为 "+l.subjectiveWeight),C()}window.applyFamilyCapital=go;function go(){if(!l)return;const e=Number(document.getElementById("familyCapital").value);l.familySupportCapital=Math.max(0,e),$(l),M(),y("✅ 家庭支持已更新"),C()}window.applyImpact=fo;function fo(){l&&(l.investments=l.investments.map((e,t)=>{const n=document.getElementById("impact_"+t);return{...e,impact:n?.checked||!1}}),$(l),y("✅ 标记已保存"),C())}window.applyAnchor=yo;function yo(){if(!l)return;const e=Number(document.getElementById("anchorAge").value),t=Number(document.getElementById("anchorAmount").value),n=l.history.findIndex(a=>a.age===e);if(n>=0){const a=t/l.history[n].invest;l.history=l.history.map(o=>({...o,invest:o.invest*a})),$(l),M(),y("✅ 校准成功！系数 "+a.toFixed(2))}C()}function ho(){if(!l)return;const t=A(l).price,n=Array.from({length:50},()=>{let o=t;for(let i=0;i<10;i++){const r=.12+(Math.random()-.5)*.3;o*=1+r}return o}).sort((o,i)=>o-i),a=w("🔮 未来展望","基于假设参数的模拟推演，非预测承诺");a.querySelector(".modal-body").innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
      <div style="padding:12px;background:rgba(224,92,75,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">保守 (P10)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-red);">${Math.round(n[5])} 点</div></div>
      <div style="padding:12px;background:rgba(255,138,76,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">中性 (P50)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-blue);">${Math.round(n[25])} 点</div></div>
      <div style="padding:12px;background:rgba(63,160,106,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">乐观 (P90)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-green);">${Math.round(n[45])} 点</div></div>
    </div>
    <p style="color:var(--text-muted);font-size:12px;">假设：年化成长12%，波动率15%，持续学习</p>
  `}function bo(){if(!l)return;const e=l,t=A(e),n=t.roe>=15?"优秀":t.roe>=8?"良好":t.roe>=3?"一般":"待提升",a=q.filter(c=>c.condition(e)).length,o=t.effectiveHealth,i=o>=80?"优秀":o>=60?"良好":o>=40?"一般":"需关注",r=e.studyHours,s=r>=8?"勤奋":r>=3?"稳定":r>=1?"一般":"较少",d=w("📤 分享","生成专属指数卡片");d.querySelector(".modal-body").innerHTML=`
    <div style="background:linear-gradient(135deg,#ffb36b,#ff8a4c 60%,#f2702e);padding:24px;border-radius:16px;text-align:center;color:#fff;box-shadow:0 12px 32px rgba(255,138,76,0.28);">
      <div style="font-size:26px;margin-bottom:4px;">${e.avatar||"🌱"}</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.95);font-weight:bold;margin-bottom:2px;">${e.nickname?I(e.nickname)+" 的":""}${e.indexName?I(e.indexName):"成长指数"}</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.75);margin-bottom:10px;letter-spacing:1px;">今日宜长进 · 成长指数手账${e.signature?" · "+I(e.signature):""}</div>
      <div style="font-size:42px;font-weight:bold;color:#fff;">${Math.round(t.price)} 点</div>
      <div style="color:rgba(255,255,255,0.92);margin-bottom:16px;">${t.change>=0?"+":""}${t.change}%</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div><div style="font-size:11px;color:rgba(255,255,255,0.75)">成长效率</div><div style="font-weight:bold;color:#fff">${n}</div></div>
        <div><div style="font-size:11px;color:rgba(255,255,255,0.75)">里程碑</div><div style="font-weight:bold;color:#fff">${a}/${q.length}</div></div>
        <div><div style="font-size:11px;color:rgba(255,255,255,0.75)">健康等级</div><div style="font-weight:bold;color:#fff">${i}</div></div>
        <div><div style="font-size:11px;color:rgba(255,255,255,0.75)">学习习惯</div><div style="font-weight:bold;color:#fff">${s}</div></div>
      </div>
      <div style="margin-top:16px;font-size:11px;color:rgba(255,255,255,0.85);">成长没有标准答案，每一步都算数</div>
      <div style="margin-top:8px;font-size:10px;color:rgba(255,255,255,0.55);">数值为模型估算，仅供自我观察，不构成任何建议</div>
    </div>
  `}function xo(){const e=w("💥 记录挫折","成长有快有慢，记下这段经历，回头看会更清楚");e.querySelector(".modal-body").innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
      ${[{t:"jobloss",i:"💼",n:"失业/降薪",d:"收入下降"},{t:"illness",i:"🏥",n:"重大疾病",d:"健康衰退"},{t:"loss",i:"📉",n:"投入回落",d:"积累暂时放缓"},{t:"stagnate",i:"😴",n:"躺平/断更",d:"停止成长"}].map(t=>`<div class="setback-type" data-type="${t.t}" onclick="selectSetback('${t.t}')" style="padding:12px;background:var(--surface-softer);border-radius:10px;cursor:pointer;text-align:center;"><div style="font-size:24px">${t.i}</div><div style="font-weight:bold;margin-top:4px">${t.n}</div><div style="font-size:11px;color:var(--text-muted)">${t.d}</div></div>`).join("")}
    </div>
    <input type="range" id="setbackSeverity" min="1" max="10" value="5" style="width:100%;">
    <div style="text-align:center;color:var(--text-secondary);margin:8px 0;">严重度：<span id="severityVal">5</span></div>
    <div class="form-actions"><button class="btn-primary" style="background:linear-gradient(135deg,#e05c4b,#c94736);" onclick="applySetback()">确认记录</button></div>
  `,document.getElementById("setbackSeverity").oninput=t=>{document.getElementById("severityVal").textContent=t.target.value}}let J="";window.selectSetback=e=>{J=e};window.applySetback=wo;function wo(){if(!l||!J)return;const e=Number(document.getElementById("setbackSeverity").value)/10,t=A(l).price;if(J==="jobloss")l.annualIncome=Math.max(0,l.annualIncome*(1-.3*e)),l.annualIncomeGrowth=-.1;else if(J==="illness")l.healthScore=Math.max(20,l.healthScore-30*e),l.debtRatio=Math.min(.8,l.debtRatio+.2*e);else if(J==="loss"){const a=l.totalInvest*.15*e;l.totalInvest=Math.max(0,l.totalInvest-a),l.history=l.history.map(o=>({...o,invest:o.invest*(1-.15*e)}))}else J==="stagnate"&&(l.studyHours=Math.max(0,l.studyHours-2*e));$(l);const n=A(l).price;C(),y(`指数 ${t.toFixed(1)} → ${n.toFixed(1)}`),M()}function $o(){if(!l)return;const e=l,t=A(e),n=ze(e.age),a=q.filter(c=>c.condition(e)),o={};e.history.forEach(c=>{const u=S.TYPE_WEIGHTS[c.type]||1,v=c.invest/1e4*u*Se(1,Math.max(0,e.age-c.age),c.type);o[c.type]=(o[c.type]||0)+v});const i={education:"教育",skill:"技能",health:"健康",network:"人脉",entertainment:"娱乐",other:"其他"},r=Lt.education_cost,s=Object.keys(S.AGE_SPEND_RANGE),d=w("📋 计算明细","看清每一个数字的来龙去脉");d.querySelector(".modal-body").innerHTML=`
    <div style="font-family:monospace;font-size:13px;line-height:2;">
      <div style="padding:12px;background:rgba(255,138,76,0.1);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;color:var(--accent-blue);margin-bottom:8px;">📐 计算公式</div>
        <div style="color:var(--text-secondary)">成长指数 = (100 + 累计成长值 × 阶段系数 + min(里程碑加成,200)) × 成长系数 × 质量系数 × (1 - 风险折扣) × 主观调整</div>
      </div>
      <div style="padding:12px;background:var(--surface-softer);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;margin-bottom:8px;">② 累计成长值 = ${t.bv.toFixed(2)}（单位：万元口径）</div>
        ${Object.entries(o).map(([c,u])=>`<div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">${i[c]||c}</span><span>${u.toFixed(2)}</span></div>`).join("")}
        ${e.familySupportCapital?`<div style="display:flex;justify-content:space-between;color:var(--accent-purple);"><span>家庭支持（不折旧）</span><span>${e.familySupportCapital}</span></div>`:""}
        <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px;font-weight:bold;">成长值 × 阶段系数 = ${t.bv.toFixed(2)} × ${n.toFixed(2)} = ${(t.bv*n).toFixed(2)}</div>
      </div>

      <!-- A1：数据溯源卡片 -->
      <div style="padding:12px;background:rgba(224,153,47,0.06);border:1px solid rgba(224,153,47,0.2);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;color:var(--accent-yellow);margin-bottom:8px;">🔍 历史投入估算 · 数据溯源</div>
        <div style="font-size:12px;color:var(--text-secondary);line-height:1.8;">
          <div><strong>数据来源：</strong>${r.name}（${r.year}）</div>
          <div><strong>原始口径：</strong>${r.caliber}</div>
          <div><strong>调整系数：</strong>地区 ${S.REGION_COEF[e.region]} × 城乡 ${S.AREA_COEF[e.area]} × 收入 ${S.INCOME_COEF[e.income]}</div>
        </div>
        <!-- A2：参考区间，替代"±4%精度" -->
        <div style="margin-top:10px;padding:10px;background:var(--surface-softer);border-radius:8px;">
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">📊 各阶段年均教育投入参考区间（元）：</div>
          ${s.map(c=>{const u=S.AGE_SPEND_RANGE[c];return`<div style="display:flex;justify-content:space-between;font-size:12px;"><span style="color:var(--text-secondary)">${c}岁</span><span>${u.low.toLocaleString()} ~ ${u.mid.toLocaleString()} ~ ${u.high.toLocaleString()}</span></div>`}).join("")}
          <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">以上为统计估算区间，非精确值。点击「校准指数」可修正为你的真实投入。</div>
        </div>
      </div>

      <div style="padding:12px;background:var(--surface-softer);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;margin-bottom:8px;">③ 里程碑加成 = ${t.milestoneBonus}（封顶 200）</div>
        ${a.map(c=>`<div style="font-size:12px;color:var(--text-secondary)">${c.icon} ${c.name} +${c.bonus}</div>`).join("")}
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
        ${(()=>{const c=Qt(e,t),u=Zt(c);return c.map(v=>{const m=v.contribution===0;return`<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid var(--surface-soft);">
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
  `}function ko(){if(!l)return;const e=l.history.reduce((i,r)=>i+r.invest,0),t=l.investments.reduce((i,r)=>i+r.amount,0),n=e+t,a=A(l),o=w("👨‍👩‍👧 家庭视角","家人的每一份支持，都是你成长的底气");o.querySelector(".modal-body").innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
      <div style="padding:14px;background:rgba(62,155,143,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">家庭支持</div><div style="font-size:20px;font-weight:bold;color:var(--accent-purple);">${e.toLocaleString()} 元</div></div>
      <div style="padding:14px;background:rgba(251,146,60,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">自我投入</div><div style="font-size:20px;font-weight:bold;color:#ff8a4c;">${t.toLocaleString()} 元</div></div>
    </div>
    <div style="height:20px;background:var(--surface-soft);border-radius:10px;overflow:hidden;display:flex;">
      <div style="width:${e/n*100}%;background:var(--accent-purple);"></div>
      <div style="width:${t/n*100}%;background:#ff8a4c;"></div>
    </div>
    <div style="margin-top:16px;padding:14px;background:rgba(63,160,106,0.1);border-radius:12px;font-size:13px;color:var(--text-secondary);line-height:1.7;">
      💡 当前 ${l.age} 岁，成长指数已从基准 100 走到 ${Math.round(a.price)} 点。<br>
      ${t===0?'⚠️ 还没有记录自我投入，试试"记一笔"吧！':"继续加油，每一笔自我投入都在为成长添砖加瓦。"}
    </div>
  `}function So(){y("请重置后重新填写问卷（投入记录会保留）")}function Mo(){confirm("确定要重置所有数据吗？")&&(qn(),l=null,document.getElementById("dashboard")?.classList.add("hidden"),document.getElementById("landing")?.classList.remove("hidden"))}const Te="2026-06-01",Io=`
  <div style="font-size:13px;color:var(--text-secondary);line-height:1.9;text-align:left;">
    <p style="color:var(--text-muted);">生效日期：${Te}。最近更新：${Te}。</p>
    <p><strong>一、我们是谁</strong><br>「今日宜长进」（成长指数手账）是一款个人成长记录与自我反思工具，本应用没有后端服务器。</p>
    <p><strong>二、我们收集的信息</strong><br>1. <strong>基础成长信息</strong>：年龄、所在地区、家庭条件区间、学历、学习时长、健康自评、人生节点等，用于生成成长曲线。<br>
    2. <strong>敏感信息（需你单独勾选同意）</strong>：年收入、收入增长、负债情况、家庭支持金额、每笔花费的具体金额。这些信息属于敏感个人信息，仅在你单独勾选「同意收集敏感信息」后才会被记录。</p>
    <p><strong>三、信息存储与使用</strong><br>所有信息默认仅保存在你当前设备的浏览器本地存储（localStorage）中，<strong>不会上传到任何服务器</strong>，本应用不提供账号体系与云端同步。信息仅用于在你本机计算成长指数、绘制成长曲线与生成本地周报。</p>
    <p><strong>四、拒绝授权的影响</strong><br>你可以拒绝提供敏感信息，应用仍可正常使用：收入、负债与金额类字段将使用通用估算值（估算占比会在页面如实标注），你也可以随时改主意并在重新进入时补充真实信息。</p>
    <p><strong>五、未成年人</strong><br>若你未满 14 周岁，请在监护人陪同与同意后使用本应用并填写信息。</p>
    <p><strong>六、如何删除信息</strong><br>你可在「设置」中使用「删除全部数据」一键清除本机所有数据；也可以直接清除浏览器站点数据。删除后数据无法恢复。</p>
    <p><strong>七、联系我们</strong><br>如对本政策有疑问，可通过应用仓库的 Issue 渠道反馈。</p>
  </div>`,Do=`
  <div style="font-size:13px;color:var(--text-secondary);line-height:1.9;text-align:left;">
    <p style="color:var(--text-muted);">生效日期：${Te}。</p>
    <p><strong>一、服务性质</strong><br>「今日宜长进」是个人成长记录与自我反思工具，<strong>不是</strong>金融理财、证券投资、职业咨询、医疗健康或心理咨询服务。成长指数（单位：点）为模型估算数值，仅供娱乐与自我观察。</p>
    <p><strong>二、不构成专业建议</strong><br>应用内的指数、曲线、周报、伙伴对话等内容均由本地规则/模板基于你填写的信息生成，不构成任何理财、证券、职业规划、医疗或心理建议，<strong>不得用于任何投资决策</strong>，也不预测你的未来收入。模型存在误差，页面会标注估算成分与置信度。</p>
    <p><strong>三、情绪与健康提示</strong><br>应用内容不能替代专业心理咨询或医疗诊断。如果你正经历严重的情绪困扰，请及时联系专业人士或拨打心理援助热线（如全国心理援助热线 12356）。</p>
    <p><strong>四、你的内容与数据</strong><br>你填写的所有内容均保存在你的设备本地，由你自行负责保管与备份。导出、分享或在公共设备使用后，请自行删除数据。</p>
    <p><strong>五、合理使用</strong><br>请勿利用本应用从事违法违规活动，或以本应用输出冒充专业意见对外传播。</p>
    <p><strong>六、免责与争议</strong><br>在法律允许的最大范围内，我们不对你因使用或无法使用本应用而产生的间接损失承担责任。与本协议相关的争议，双方应友好协商解决；协商不成的，适用中华人民共和国法律。</p>
  </div>`;function Ae(e){const t=e==="privacy",n=w(t?"🔒 隐私政策":"📜 用户协议",t?"请仔细阅读，重点内容已加粗":"使用本应用前请知悉");n.style.maxWidth="560px",n.querySelector(".modal-body").innerHTML=t?Io:Do;const a=n.parentElement;a&&(a.style.zIndex="10001")}function Eo(){if(!Gn()){const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`<div class="modal" style="max-width:500px;">
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
    </div>`,document.body.appendChild(e),e.querySelector("#linkPrivacy1").onclick=()=>Ae("privacy"),e.querySelector("#linkTerms1").onclick=()=>Ae("terms");const t=e.querySelector("#consentPrivacy");t.onclick=()=>{if(!e.querySelector("#consentBase").checked){y("请先勾选并同意《隐私政策》与《用户协议》");return}Yn(),Wn(e.querySelector("#consentSensitive").checked),e.remove(),Je()};return}Je()}function Je(){if(Un())Ke();else{const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`<div class="modal" style="max-width:480px;">
      <h2>⚠️ 温馨提示</h2>
      <p style="color:var(--text-secondary);line-height:1.9;margin:16px 0;">
        「今日宜长进」是一款<strong>个人成长记录与自我反思工具</strong>，所有数值均为模型估算，<strong style="color:var(--accent-yellow)">仅供娱乐与自我观察，不构成理财、职业或心理建议，也不预测收入</strong>。<br><br>
        今日宜长进，成长没有标准曲线。
      </p>
      <div class="form-actions"><button class="btn-primary" id="confirmDisclaimer">我知道了</button></div>
    </div>`,document.body.appendChild(e),document.getElementById("confirmDisclaimer").onclick=()=>{Jn(),e.remove(),Ke()}}}function Ke(){const e=On();e&&(l=e,M())}function To(){confirm("确定要删除全部数据吗？此操作不可恢复。")&&(Vn(),l=null,document.getElementById("dashboard")?.classList.add("hidden"),document.getElementById("landing")?.classList.remove("hidden"),y("✅ 全部数据已删除"))}let se;window.setJournalMood=Ao;function Ao(e){se=se===e?void 0:e,document.querySelectorAll(".mood-btn").forEach(t=>{t.classList.toggle("selected",t.getAttribute("data-mood")===se)})}window.addJournal=Co;function Co(){if(!l)return;const e=document.getElementById("journalInput"),t=e.value.trim();if(!t){y("请输入内容");return}const n=tn(t,se);l=nn(l,n),e.value="",se=void 0,document.querySelectorAll(".mood-btn").forEach(a=>a.classList.remove("selected")),$(l),bt(l),xt(l),y("✅ 已记录")}function bt(e){const t=document.getElementById("recentJournals");if(!t)return;const n=on(e,8);if(n.length===0){t.innerHTML='<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:10px;">还没有记录，写下此刻的想法吧</div>';return}const a={great:"😄",good:"🙂",ok:"😐",low:"😔"};t.innerHTML=n.map(o=>`
    <div class="journal-item">
      <span class="j-mood">${o.mood?a[o.mood]:"📝"}</span>
      <div class="j-content">
        <div>${o.content}</div>
        <div class="j-date">${new Date(o.date).toLocaleString("zh-CN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
      </div>
    </div>
  `).join("")}function xt(e){const t=Pe(e),n=document.getElementById("weeklyBadge"),a=document.getElementById("weeklyTip");n&&(n.textContent=t.streakWeeks>0?`🔥 连续 ${t.streakWeeks} 周`:""),a&&(a.textContent=t.message)}window.showDrawdownModal=zo;function zo(){if(!l)return;const e=A(l),t=V(l),n=an(t,e.price),a=sn(l),o=w("📉 成长回落复盘","复盘是为了觉察，不是自责");o.querySelector(".modal-body").innerHTML=`
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
        ${a.map(i=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${i}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">回落是成长的正常阶段，不必焦虑，重在觉察与调整</div>
  `}window.showGoalModal=Bo;function Bo(){if(!l)return;const e=A(l),t=w("🏁 目标反推","设定目标，反推所需投入");t.querySelector(".modal-body").innerHTML=`
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
  `}window.calcGoal=jo;function jo(){if(!l)return;const e=Number(document.getElementById("goalTarget").value);if(!e||e<=0){y("请输入有效目标");return}const t=rn(l,e),n=document.getElementById("goalResult");n.innerHTML=`
    <div style="margin-top:20px;background:var(--surface-soft);border-radius:12px;padding:16px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
        <div class="metric"><div class="metric-label">目标成长指数</div><div class="metric-value">${t.target} 点</div></div>
        <div class="metric"><div class="metric-label">此刻成长指数</div><div class="metric-value">${t.current} 点</div></div>
        <div class="metric"><div class="metric-label">还差</div><div class="metric-value" style="color:var(--accent-blue);">${t.gap} 点</div></div>
        <div class="metric"><div class="metric-label">还需成长值（粗估）</div><div class="metric-value">约 ${t.additionalInvest} 点</div></div>
      </div>
      <div style="font-size:14px;color:var(--text-secondary);line-height:1.8;">
        ${t.suggestions.map(a=>`<div>• ${a}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">${t.confidence}</div>
    </div>
  `}window.showReportModal=Po;function Po(){if(!l)return;const e=V(l),t=dt(l,e),n=t.avgMood===null?"暂无":t.avgMood>=3.5?"😄 很好":t.avgMood>=2.5?"🙂 不错":t.avgMood>=1.5?"😐 一般":"😔 偏低",a=w("📊 月度成长报告",t.month+" 月报");a.querySelector(".modal-body").innerHTML=`
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
        ${t.highlights.length>0?t.highlights.map(o=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${o}</div>`).join(""):'<div style="font-size:13px;color:var(--text-muted);">继续积累，下个月会更好</div>'}
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">📌 下月建议</div>
        ${t.suggestions.map(o=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${o}</div>`).join("")}
      </div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:16px;text-align:center;">平均情绪：${n} · 报告仅基于你的记录生成，不代表客观评价</div>
  `}window.showRadarModal=Lo;function Lo(){if(!l)return;const e=ye(l),t={education:"#ff8a4c",skill:"#f5a623",health:"#3fa06a",network:"#3e9b8f",entertainment:"#e0705b",other:"#a79b8c"},n='<canvas id="radarCanvas" width="300" height="300" style="display:block;margin:0 auto;"></canvas>',a=w("🎯 投入结构雷达","看看你的成长积累分布是否均衡");a.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:16px;">${n}</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:16px;">
        ${e.dimensions.map(o=>`<div style="font-size:12px;color:var(--text-secondary);"><span style="color:${t[o.type]}">●</span> ${o.label.split(" ")[1]}: ${o.amount.toLocaleString()} 元</div>`).join("")}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
        <div class="metric"><div class="metric-label">均衡度</div><div class="metric-value">${Math.round(e.balance*100)}%</div></div>
        <div class="metric"><div class="metric-label">最突出</div><div class="metric-value">${e.dimensions.find(o=>o.type===e.dominant)?.label.split(" ")[1]}</div></div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 结构建议</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">
          ${e.balance>=.6?"投入结构较均衡，继续保持多维发展。":`${e.dimensions.find(o=>o.type===e.weakest)?.label}维度投入较少，可适当增加。`}
          健康是一切成长的底座，建议保持健康维度的持续投入。
        </div>
      </div>
  `,setTimeout(()=>Ho(e),50)}function Ho(e,t){const n=document.getElementById("radarCanvas");if(!n)return;const a=n.getContext("2d"),o=150,i=150,r=110;a.clearRect(0,0,300,300);const s=e.dimensions,d=s.length;for(let c=1;c<=4;c++){a.beginPath();for(let u=0;u<d;u++){const v=Math.PI*2*u/d-Math.PI/2,m=r*c/4,p=o+m*Math.cos(v),g=i+m*Math.sin(v);u===0?a.moveTo(p,g):a.lineTo(p,g)}a.closePath(),a.strokeStyle="rgba(120,95,60,0.16)",a.stroke()}for(let c=0;c<d;c++){const u=Math.PI*2*c/d-Math.PI/2;a.beginPath(),a.moveTo(o,i),a.lineTo(o+r*Math.cos(u),i+r*Math.sin(u)),a.strokeStyle="rgba(120,95,60,0.2)",a.stroke()}a.beginPath();for(let c=0;c<d;c++){const u=Math.PI*2*c/d-Math.PI/2,v=s[c].value/100,m=o+r*v*Math.cos(u),p=i+r*v*Math.sin(u);c===0?a.moveTo(m,p):a.lineTo(m,p)}a.closePath(),a.fillStyle="rgba(255,138,76,0.3)",a.fill(),a.strokeStyle="#ff8a4c",a.lineWidth=2,a.stroke(),a.fillStyle="#5c5246",a.font="12px sans-serif",a.textAlign="center";for(let c=0;c<d;c++){const u=Math.PI*2*c/d-Math.PI/2,v=o+(r+20)*Math.cos(u),m=i+(r+20)*Math.sin(u);a.fillText(s[c].label.split(" ")[1],v,m+4)}}window.showDepreciationModal=Ro;function Ro(){if(!l)return;const e=A(l),t=Math.round(l.annualIncome*.1/12),n=cn(l,10,t),a=w("📉 折旧推演","看看你的成长积累随时间如何变化");a.querySelector(".modal-body").innerHTML=`
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
        ${n.points.map(o=>`<div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary);line-height:1.8;"><span>${o.age} 岁</span><span>成长值 ${o.bv}（自然衰减 -${o.depreciation}，新增 +${o.newInvest}）</span></div>`).join("")}
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 建议</div>
        ${n.suggestions.map(o=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${o}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">年折旧率约 ${n.annualDecayRate*100}%，仅作趋势参考</div>
  `}window.showScenarioModal=No;function No(){if(!l)return;const e=dn(l),t=w("🎲 情景模拟","不同节奏下，你的指数会怎样");t.querySelector(".modal-body").innerHTML=`
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
  `}window.showFamilyModal=_o;function _o(){if(!l)return;const e=un(l),t=w("👨‍👩‍👧 家庭账本","记录家庭/父母的支持，看见成长背后的力量");t.querySelector(".modal-body").innerHTML=`
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
  `}window.saveFamilySupport=Fo;function Fo(){if(!l)return;const e=Number(document.getElementById("familySupportInput").value)||0;l.familySupportCapital=e,$(l),M(),y("✅ 家庭支持已更新"),C()}window.showAIWeeklyModal=Oo;function Oo(){if(!l)return;const e=pn(l),t=w("📝 本周周报","基于你的记录由模板在本地生成，不上传数据");t.querySelector(".modal-body").innerHTML=`
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
  `}window.showAnnualModal=qo;function qo(){if(!l)return;const e=V(l),t=vn(l,e),n=t.avgMood===null?"暂无":t.avgMood>=3.5?"😄 很好":t.avgMood>=2.5?"🙂 不错":t.avgMood>=1.5?"😐 一般":"😔 偏低",a=w("🎊 年度报告",`${t.year} 年成长总结`);a.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">🎊</div>
        <div style="font-size:24px;font-weight:bold;margin-top:8px;">${t.year} 年报</div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:20px;">
        ${t.keywords.map(o=>`<span style="padding:6px 14px;border-radius:20px;background:rgba(255,138,76,0.15);font-size:13px;">${o}</span>`).join("")}
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
        ${t.nextYearPlan.map(o=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${o}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">年报基于你的记录生成，是回顾也是鼓励，不是评价</div>
  `}window.showPeerModal=Go;function Go(){if(!l)return;const e=A(l),t=rt(l),n=e.bv,a=n-t,o=t>0?Math.round(a/t*100):0,i=w("👥 同路人","看看相似背景的成长者们大致在哪里（匿名统计锚点）");i.querySelector(".modal-body").innerHTML=`
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
        <div style="font-size:28px;font-weight:bold;color:${a>=0?"var(--accent-green)":"var(--accent-orange)"};margin-top:6px;">${a>=0?"+":""}${o}%</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:6px;">${a>=0?"你走在多数人前面，继续保持":"还有追赶空间，但成长没有终点"}</div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 关于对比</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">
          这个锚点是基于相似年龄、城市、学历的统计估算，仅作参考。每个人的成长节奏不同，<br>
          与昨天的自己比较，比与他人比较更有意义。
        </div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">锚点数据为估算值，不构成任何评价或排名</div>
  `}window.showChallengeModal=Yo;function Yo(){if(!l)return;const e=Le(l),t=mn(l),n=w("🎯 成长挑战","完成挑战，见证坚持的力量");n.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">🎯</div>
        <div style="font-size:22px;font-weight:bold;margin-top:8px;">挑战完成度 ${t}%</div>
      </div>
      ${e.map(a=>`
        <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-bottom:10px;${a.done?"border:1px solid var(--accent-green);":""}">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <span style="font-size:22px;">${a.icon}</span>
            <div style="flex:1;">
              <div style="font-weight:600;">${a.name} ${a.done?'<span style="color:var(--accent-green);">✓ 已完成</span>':""}</div>
              <div style="font-size:12px;color:var(--text-muted);">${a.desc}</div>
            </div>
            <div style="font-size:14px;font-weight:bold;color:${a.done?"var(--accent-green)":"var(--accent-blue)"};">${a.progress}/${a.target} ${a.unit}</div>
          </div>
          <div style="height:6px;background:var(--surface-strong);border-radius:3px;overflow:hidden;">
            <div style="height:100%;width:${Math.round(a.progress/a.target*100)}%;background:${a.done?"var(--accent-green)":"linear-gradient(90deg,#ffb36b,#ff8a4c)"};border-radius:3px;transition:width 0.5s;"></div>
          </div>
        </div>
      `).join("")}
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">挑战数据基于你的本地记录，完成后自动更新</div>
  `}window.showMentorModal=Wo;function Wo(){if(!l)return;const e=gn(l),t=w("🌱 成长伙伴",e.persona);t.querySelector(".modal-body").innerHTML=`
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
  `}let ve="terms";window.showMicroModal=wt;function wt(){if(!l)return;const t=w("📚 微课","学习成长术语，理解你的指数").querySelector(".modal-body"),n=()=>`
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${fn.map(o=>`
        <div style="background:var(--surface-soft);border-radius:12px;padding:14px;cursor:pointer;" onclick="this.querySelector('.term-detail').style.display=this.querySelector('.term-detail').style.display==='none'?'block':'none'">
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
  `,a=()=>`
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${yn.map(o=>`
        <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
          <div style="font-weight:600;margin-bottom:4px;">${o.stage} <span style="font-size:12px;color:var(--text-muted);font-weight:normal;">${o.ageRange}</span></div>
          <div style="font-size:13px;color:var(--accent-blue);margin-bottom:8px;">重心：${o.focus}</div>
          ${o.tips.map(i=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.7;">• ${i}</div>`).join("")}
        </div>
      `).join("")}
    </div>
  `;t.innerHTML=`
    <div style="display:flex;gap:8px;margin-bottom:16px;">
      <button class="btn-primary" onclick="switchMicroTab('terms')" id="tab-terms" style="flex:1;${ve==="terms"?"":"opacity:0.6;"}">📖 术语卡</button>
      <button class="btn-primary" onclick="switchMicroTab('stages')" id="tab-stages" style="flex:1;${ve==="stages"?"":"opacity:0.6;"}">🧭 阶段指南</button>
    </div>
    <div id="microContent">${ve==="terms"?n():a()}</div>
  `}window.switchMicroTab=Vo;function Vo(e){ve=e,wt()}let W=0;window.showGratitudeModal=_e;function _e(){if(!l)return;const e=ut(l,W),t=me(),n=w("💌 感恩卡片","亲子连接 · 表达感谢");n.querySelector(".modal-body").innerHTML=`
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
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">第 ${W+1}/${t} 张 · 卡片内容可自由编辑后发送给家人</div>
  `}window.nextGratitude=Uo;function Uo(){l&&(W=(W+1)%me(),_e())}window.prevGratitude=Jo;function Jo(){l&&(W=(W-1+me())%me(),_e())}window.copyGratitude=Ko;function Ko(){if(!l)return;const e=ut(l,W),t=`${e.title}

${e.content}

${e.signature}`;navigator.clipboard.writeText(t).then(()=>{y("✅ 已复制，可粘贴发给家人")}).catch(()=>{y("复制失败，请手动选择文本")})}window.showExportReportModal=Xo;function Xo(){if(!l)return;const e=V(l),t=He(l,e),n=w("📄 导出成长报告","生成纯文本报告，可保存或分享");n.querySelector(".modal-body").innerHTML=`
      <div style="background:var(--surface-soft);border-radius:12px;padding:16px;margin-bottom:16px;max-height:400px;overflow-y:auto;">
        <pre style="font-family:monospace;font-size:12px;line-height:1.6;white-space:pre-wrap;color:var(--text-secondary);">${t}</pre>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn-primary" onclick="copyReport()" style="flex:1;padding:12px;">📋 复制文本</button>
        <button class="btn-primary" onclick="downloadReport()" style="flex:1;padding:12px;">⬇️ 下载 .txt</button>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">报告内容均来自你的本地数据，不包含任何个人身份信息</div>
  `}window.copyReport=Qo;function Qo(){if(!l)return;const e=V(l),t=He(l,e);navigator.clipboard.writeText(t).then(()=>y("✅ 报告已复制")).catch(()=>y("复制失败"))}window.downloadReport=Zo;function Zo(){if(!l)return;const e=V(l),t=He(l,e),n=new Blob([t],{type:"text/plain;charset=utf-8"}),a=URL.createObjectURL(n),o=document.createElement("a");o.href=a,o.download=`成长报告_${new Date().toISOString().slice(0,10)}.txt`,o.click(),URL.revokeObjectURL(a),y("✅ 报告已下载")}function I(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function ea(e){return(e.customTypes||[]).filter(t=>!t.archived)}function Q(e){const t=Object.keys(P).map(a=>({key:a,label:P[a].name,icon:P[a].icon,color:P[a].color,type:a})),n=ea(e).map(a=>({key:"custom:"+a.id,label:a.name,icon:a.icon,color:a.color,type:a.baseType,customId:a.id}));return[...t,...n]}function $t(e,t){if(t.customType){const a=(e.customTypes||[]).find(o=>o.id===t.customType);if(a)return{icon:a.icon,name:a.name,color:a.color}}const n=P[t.type]||P.other;return{icon:n.icon,name:n.name,color:n.color}}window.selectChip=function(e,t,n){const a=document.getElementById(e);a.querySelectorAll(".picker-chip").forEach(o=>o.classList.remove("selected")),t.classList.add("selected"),a.dataset.value=n};function X(e,t,n,a){return`<div id="${e}" class="${a}-picker picker-row" data-value="${I(n)}">
    ${t.map(o=>{const i=o===n,r=a==="color"?`<span class="color-dot" style="background:${o}"></span>`:o;return`<span class="picker-chip ${i?"selected":""}" onclick="selectChip('${e}',this,'${o}')">${r}</span>`}).join("")}
  </div>`}const ta=["📦","📖","🎨","🎸","💻","🌱","🧠","🙏","☕","🚶","🧩","🗼"],kt=["#ff8a4c","#f5a623","#3fa06a","#3e9b8f","#e0705b","#7d8cf6","#b06fd0","#a79b8c"];window.showCustomTypeManager=le;function le(e){if(!l)return;const t=l,n=e?(t.customTypes||[]).find(i=>i.id===e):null,a=Object.keys(P).map(i=>`<option value="${i}" ${n?.baseType===i?"selected":""}>${P[i].icon} ${P[i].name}（计入${P[i].name}维度）</option>`).join(""),o=w("🏷️ 自定义分类","新增你自己的投入分类；它会归入一个内置维度参与指数计算");o.querySelector(".modal-body").innerHTML=`
    <div id="ctList" style="display:flex;flex-direction:column;gap:8px;margin-bottom:18px;">
      ${(t.customTypes||[]).length===0?'<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:8px;">还没有自定义分类</div>':""}
      ${(t.customTypes||[]).map(i=>`
        <div class="ct-row ${i.archived?"archived":""}">
          <span class="ct-icon" style="background:${i.color}22;color:${i.color}">${i.icon}</span>
          <span class="ct-name">${I(i.name)} <small>→ ${P[i.baseType].name}</small></span>
          <span class="ct-ops">
            ${i.archived?`<a onclick="ctRestore('${i.id}')">恢复</a> <a class="danger-link" onclick="ctDelete('${i.id}')">彻底删除</a>`:`<a onclick="showCustomTypeManager('${i.id}')">编辑</a> <a onclick="ctArchive('${i.id}')">归档</a>`}
          </span>
        </div>`).join("")}
    </div>
    <div class="sub-form" id="ctForm">
      <div style="font-weight:bold;margin-bottom:10px;">${n?"编辑分类":"新建分类"}</div>
      <input type="text" id="ctName" placeholder="分类名称，如：日语课 / 考研 / 马拉松" value="${I(n?.name||"")}" style="width:100%;margin-bottom:10px;">
      <label class="field-label">图标</label>
      ${X("ctIcon",ta,n?.icon||"📦","emoji")}
      <label class="field-label">颜色</label>
      ${X("ctColor",kt,n?.color||"#ff8a4c","color")}
      <label class="field-label">归入维度（影响权重与折旧）</label>
      <select id="ctBase" style="width:100%;margin:6px 0 14px;">${a}</select>
      <div class="form-actions">
        ${n?'<button class="dash-btn" onclick="showCustomTypeManager()">取消</button>':""}
        <button class="btn-primary" onclick="ctSave('${n?.id||""}')">${n?"保存修改":"＋ 添加分类"}</button>
      </div>
    </div>`}window.ctSave=function(e){if(!l)return;const t=document.getElementById("ctName").value.trim();if(!t){y("请填写分类名称");return}const n=document.getElementById("ctIcon").dataset.value||"📦",a=document.getElementById("ctColor").dataset.value||"#ff8a4c",o=document.getElementById("ctBase").value,i=l.customTypes||(l.customTypes=[]);if(e){const r=i.find(s=>s.id===e);r&&Object.assign(r,{name:t,icon:n,color:a,baseType:o})}else{if(i.some(r=>r.name===t&&!r.archived)){y("已有同名分类");return}i.push({id:"ct_"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:t,icon:n,color:a,baseType:o})}$(l),le(),M(),y("✅ 分类已保存")};window.ctArchive=function(e){if(!l)return;const t=l.customTypes.find(n=>n.id===e);t&&(t.archived=!0),$(l),le(),M()};window.ctRestore=function(e){if(!l)return;const t=l.customTypes.find(n=>n.id===e);t&&(t.archived=!1),$(l),le(),M()};window.ctDelete=function(e){l&&confirm("彻底删除后，相关记录会回到它归入的内置分类下，确定吗？")&&(l.customTypes=(l.customTypes||[]).filter(t=>t.id!==e),l.investments.forEach(t=>{t.customType===e&&(t.customType=void 0)}),$(l),le(),M())};const na=["🌱","☀️","🌙","⭐","🔥","🍀","🌻","🍊","🐱","🐰","🦊","🐻","🐼","🐨","🦁","🐯","🐸","🐵","🦉","🐳","🎈","💎","🚀","🏔️"];window.showProfileModal=St;function St(e=!1){if(!l)return;const t=l,n=w(e?"👋 打造你的专属名片":"👤 个性化名片",e?'给自己起个名字、选个头像，让这只"成长指数"真正属于你（可跳过）':"昵称、头像与指数名称会出现在仪表盘和分享卡上");n.querySelector(".modal-body").innerHTML=`
    <label class="field-label">头像</label>
    ${X("pAvatar",na,t.avatar||"🌱","emoji")}
    <label class="field-label">昵称</label>
    <input type="text" id="pNickname" maxlength="12" placeholder="怎么称呼你？" value="${I(t.nickname||"")}" style="width:100%;margin:6px 0 14px;">
    <label class="field-label">我的指数名称</label>
    <input type="text" id="pIndexName" maxlength="14" placeholder="如：阿长进指数 / 小树苗成长指数" value="${I(t.indexName||"")}" style="width:100%;margin:6px 0 14px;">
    <label class="field-label">一句话签名</label>
    <input type="text" id="pSignature" maxlength="30" placeholder="如：日拱一卒，功不唐捐" value="${I(t.signature||"")}" style="width:100%;margin:6px 0 14px;">
    <div class="form-actions" style="justify-content:space-between;">
      ${e?'<button class="dash-btn" onclick="closeModal()">稍后再说</button>':'<button class="dash-btn" onclick="showCustomTypeManager()">🏷️ 管理分类</button>'}
      <button class="btn-primary" onclick="profileSave(${e})">保存名片</button>
    </div>`}window.profileSave=function(e){l&&(l.avatar=document.getElementById("pAvatar").dataset.value||"🌱",l.nickname=document.getElementById("pNickname").value.trim()||void 0,l.indexName=document.getElementById("pIndexName").value.trim()||void 0,l.signature=document.getElementById("pSignature").value.trim()||void 0,$(l),C(),M(),y("✅ 名片已保存"))};function oa(e){const t=document.getElementById("budgetBody");if(!t)return;const n=H(),a=zn(e,{sensitive:n}),o=a.mode==="amount"?"元":"笔";if(a.budget===null){t.innerHTML=`
      <div style="font-size:12.5px;color:var(--text-secondary);line-height:1.7;margin-bottom:12px;">
        给本月的成长投入定个小目标${n?"（金额）":"（笔数）"}，让投入像记账一样有节奏。
      </div>
      <button class="btn-primary" style="width:100%;" onclick="showBudgetModal()">🎯 设置本月预算</button>`;return}const i=Math.min(100,Math.round((a.ratio||0)*100)),r=a.overrun?"var(--accent-red)":i>=80?"var(--accent-yellow)":"var(--accent-green)",s=a.deltaPct===null?"上月无记录":`${a.deltaPct>=0?"↑":"↓"} 比上月${Math.abs(Math.round(a.deltaPct*100))}%`;t.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
      <span style="font-size:22px;font-weight:bold;color:${a.overrun?"var(--accent-red)":"var(--text-primary)"}">${Math.round(a.spent).toLocaleString()} <span style="font-size:12px;font-weight:normal;">/ ${a.budget.toLocaleString()} ${o}</span></span>
      <a style="font-size:12px;cursor:pointer;" onclick="showBudgetModal()">⚙️ 调整</a>
    </div>
    <div class="budget-bar"><div class="budget-fill" style="width:${i}%;background:${r};"></div></div>
    <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--text-muted);margin-top:8px;">
      <span>${a.overrun?`已超 ${Math.round(-a.remaining).toLocaleString()} ${o}`:`还可投入 ${Math.round(a.remaining).toLocaleString()} ${o}`}</span>
      <span>日均 ${a.dailyAvg.toFixed(1)} ${o} · ${s}</span>
    </div>`}window.showBudgetModal=aa;function aa(){if(!l)return;const e=H(),t=e?l.monthlyBudget||"":l.monthlyCountBudget||"",n=w("🎯 月度预算",e?"设定每月愿意为自己投入的金额上限，仅存本机":"你尚未授权金额信息，可按每月投入笔数设定节奏");n.querySelector(".modal-body").innerHTML=`
    <input type="number" id="budgetInput" value="${t}" placeholder="${e?"如 2000（元/月）":"如 8（笔/月）"}" style="width:100%;margin-bottom:14px;">
    <div class="form-actions" style="justify-content:space-between;">
      <button class="dash-btn" onclick="budgetClear()">取消预算</button>
      <button class="btn-primary" onclick="budgetSave()">保存</button>
    </div>`}window.budgetSave=function(){if(!l)return;const e=Number(document.getElementById("budgetInput").value);if(!e||e<=0){y("请输入大于 0 的数字");return}H()?l.monthlyBudget=e:l.monthlyCountBudget=e,$(l),C(),M(),y("✅ 预算已设置")};window.budgetClear=function(){l&&(l.monthlyBudget=void 0,l.monthlyCountBudget=void 0,$(l),C(),M())};let te=new Date().getFullYear(),ne=new Date().getMonth();window.showAnalyticsModal=ia;function ia(e=0){if(!l)return;const t=l;if(e!==0){const c=new Date(te,ne+e,1);te=c.getFullYear(),ne=c.getMonth()}const n=H(),a=Bn(t,te,ne),o=jn(t,6),i=Math.max(1,...o.map(c=>c.amount)),r=a.reduce((c,u)=>c+u.amount,0),s=a.reduce((c,u)=>c+u.count,0),d=w("📈 投入分析","看看你的成长投入都花在了哪些地方");d.querySelector(".modal-body").innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <button class="dash-btn" onclick="showAnalyticsModal(-1)">‹</button>
      <strong>${te} 年 ${ne+1} 月</strong>
      <button class="dash-btn" onclick="showAnalyticsModal(1)">›</button>
    </div>
    <div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap;">
      <canvas id="donutCanvas" width="170" height="170" style="width:170px;height:170px;"></canvas>
      <div style="flex:1;min-width:180px;display:flex;flex-direction:column;gap:7px;">
        ${a.length===0?'<div style="color:var(--text-muted);font-size:13px;">本月还没有投入记录</div>':a.map(c=>`
          <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;">
            <span style="width:10px;height:10px;border-radius:3px;background:${c.color};display:inline-block;"></span>
            <span style="flex:1;">${c.icon} ${I(c.name)}</span>
            <span style="color:var(--text-muted);">${c.count}笔 · ${Math.round(c.ratio*100)}%</span>
            <span style="font-weight:bold;min-width:64px;text-align:right;">${n?c.amount.toLocaleString()+" 元":"—"}</span>
          </div>`).join("")}
      </div>
    </div>
    <div style="margin:18px 0 8px;font-size:13px;font-weight:bold;">近 6 个月趋势 ${n?"":"（金额需授权后显示）"}</div>
    <div style="display:flex;gap:10px;align-items:flex-end;height:110px;padding:0 4px;border-bottom:1px solid var(--hairline);">
      ${o.map(c=>{const u=te===new Date().getFullYear()&&ne===new Date().getMonth()&&c.label===`${new Date().getMonth()+1}月`,v=Math.max(3,Math.round(c.amount/i*90));return`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;">
          <span style="font-size:9.5px;color:var(--text-muted);">${n&&c.amount>0?c.amount>=1e4?(c.amount/1e4).toFixed(1)+"万":c.amount:c.count>0?c.count+"笔":""}</span>
          <div style="width:100%;max-width:26px;height:${v}px;border-radius:5px 5px 0 0;background:${u?"linear-gradient(180deg,#ffb36b,#ff8a4c)":"var(--surface-strong)"};"></div>
          <span style="font-size:10px;color:var(--text-muted);">${c.label}</span>
        </div>`}).join("")}
    </div>
    <div style="font-size:11.5px;color:var(--text-muted);margin-top:10px;">本月合计 ${s} 笔${n?` · ${r.toLocaleString()} 元`:""}（按记录日期统计）</div>`,requestAnimationFrame(()=>sa(a,n?"amount":"count",n?r:s))}function sa(e,t,n){const a=document.getElementById("donutCanvas");if(!a)return;const o=a.getContext("2d"),i=2;a.width=170*i,a.height=170*i,o.scale(i,i);const r=85,s=85,d=70,c=46;if(o.clearRect(0,0,170,170),e.length===0||n<=0){o.fillStyle="#f2e9db",o.beginPath(),o.arc(r,s,d,0,Math.PI*2),o.fill(),o.fillStyle="#a39684",o.font="12px sans-serif",o.textAlign="center",o.fillText("暂无数据",r,s+4),o.textAlign="left";return}let u=-Math.PI/2;for(const v of e){const p=(t==="amount"?v.amount:v.count)/n*Math.PI*2;o.beginPath(),o.moveTo(r,s),o.arc(r,s,d,u,u+p),o.closePath(),o.fillStyle=v.color,o.fill(),u+=p}o.beginPath(),o.arc(r,s,c,0,Math.PI*2),o.fillStyle="#ffffff",o.fill(),o.fillStyle="#3b332b",o.font="bold 18px sans-serif",o.textAlign="center",o.fillText(t==="amount"?`${Math.round(n).toLocaleString()}`:`${n} 笔`,r,s+2),o.font="10px sans-serif",o.fillStyle="#a39684",o.fillText(t==="amount"?"本月投入（元）":"本月投入",r,s+18),o.textAlign="left"}const ra=["⭐","📖","💪","🏃","🧘","🎯","💧","🌙","☀️","✍️","🎨","🎸","💻","🌱","🧠","🙏"],la=kt;function ca(e){const t=document.getElementById("habitBody");if(!t)return;const n=(e.habits||[]).filter(o=>!o.archived);if(n.length===0){t.innerHTML=`<div style="font-size:12.5px;color:var(--text-secondary);line-height:1.7;margin-bottom:10px;">像 Todo 软件一样，给自己定几个每日小习惯，打卡会自动记入成长轨迹。</div>
      <button class="btn-primary" style="width:100%;" onclick="showHabitForm()">＋ 新建第一个习惯</button>`;return}const a=N();t.innerHTML=n.map(o=>{const i=G(e,o),r=i.weekDots.map((s,d)=>{const c=new Date,u=(c.getDay()+6)%7,v=new Date(c.getFullYear(),c.getMonth(),c.getDate()-u);v.setDate(v.getDate()+d);const m=_(v)>a;return`<span class="week-dot ${s?"hit":""} ${m?"future":""}" style="${s?`background:${o.color};border-color:${o.color};`:""}" title="${_(v)}"></span>`}).join("");return`<div class="habit-row">
      <span class="habit-icon" style="background:${o.color}22;color:${o.color}">${o.icon}</span>
      <div class="habit-main">
        <div class="habit-name">${I(o.name)} <span class="habit-streak">🔥 ${i.streak}</span></div>
        <div class="habit-sub">
          <span class="week-dots">${r}</span>
          ${o.cadence==="weekly"?`<span class="habit-target">${i.weekCount}/${o.timesPerWeek} 次</span>`:`<a onclick="showHabitDetail('${o.id}')">最佳 ${i.bestStreak} 天</a>`}
        </div>
      </div>
      <button class="habit-check ${i.doneToday?"done":""}" style="${i.doneToday?`background:${o.color};border-color:${o.color};`:`color:${o.color};border-color:${o.color};`}" onclick="toggleHabit('${o.id}')">${i.doneToday?"✓":"打卡"}</button>
    </div>`}).join("")+`<div style="display:flex;gap:8px;margin-top:10px;">
      <button class="dash-btn" style="flex:1;" onclick="showHabitForm()">＋ 新习惯</button>
      <button class="dash-btn" style="flex:1;" onclick="showHabitManager()">管理</button>
    </div>`}window.toggleHabit=da;function da(e,t=N()){if(!l)return;const n=l,a=(n.habits||[]).find(d=>d.id===e);if(!a)return;const o=G(n,a).streak,i=$n(n,e,t);let r=i.user;if(i.action==="checked"){if(t===N()&&a.investOnCheck){const c=Q(n),u=a.linkedType?c.find(v=>v.key===a.linkedType):void 0;r.investments.push({date:new Date,amount:0,type:u?.type||"other",customType:u?.customId,desc:`「${a.name}」打卡`})}const d=G(r,a);o<7&&d.streak>=7?r=Ve(r,{icon:"🔥",title:`「${a.name}」连续打卡 7 天`,date:new Date}):o<30&&d.streak>=30&&(r=Ve(r,{icon:"🌟",title:`「${a.name}」连续打卡 30 天`,date:new Date}))}l=r,$(l);const s=document.querySelector("#modalContainer .modal");M(),s&&Mt(e),y(i.action==="checked"?`✅ 打卡成功！🔥 连续 ${G(l,a).streak} 天`:"已取消今日打卡")}window.showHabitForm=ua;function ua(e){if(!l)return;const t=l,n=e?(t.habits||[]).find(i=>i.id===e):null,a=Q(t).map(i=>`<option value="${i.key}" ${n?.linkedType===i.key?"selected":""}>${i.icon} ${i.label}</option>`).join(""),o=w(n?"✏️ 编辑习惯":"＋ 新建习惯","小而稳定的习惯，是最靠谱的成长杠杆");o.querySelector(".modal-body").innerHTML=`
    <input type="text" id="hName" maxlength="16" placeholder="习惯名称，如：每天阅读 20 分钟" value="${I(n?.name||"")}" style="width:100%;margin-bottom:12px;">
    <label class="field-label">图标</label>
    ${X("hIcon",ra,n?.icon||"⭐","emoji")}
    <label class="field-label">颜色</label>
    ${X("hColor",la,n?.color||"#ff8a4c","color")}
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
      <option value="">不关联投入分类（默认）</option>${a}
    </select>
    <label style="display:flex;align-items:center;gap:8px;font-size:13px;margin-bottom:16px;cursor:pointer;">
      <input type="checkbox" id="hInvest" ${n?.investOnCheck===!1?"":"checked"}> 打卡时自动记一笔 0 元投入（让指数看到你的坚持）
    </label>
    <div class="form-actions">
      ${n?`<button class="dash-btn danger" onclick="habitDelete('`+n.id+`')">删除习惯</button>`:""}
      <button class="btn-primary" onclick="habitSave('${n?.id||""}')">${n?"保存":"创建习惯"}</button>
    </div>`}window.habitSave=function(e){if(!l)return;const t=l,n=document.getElementById("hName").value.trim();if(!n){y("请填写习惯名称");return}const a={name:n,icon:document.getElementById("hIcon").dataset.value||"⭐",color:document.getElementById("hColor").dataset.value||"#ff8a4c",cadence:document.getElementById("hCadence").value,timesPerWeek:Math.min(7,Math.max(1,Number(document.getElementById("hTimes").value)||3)),linkedType:document.getElementById("hLinked").value||void 0,investOnCheck:document.getElementById("hInvest").checked};if(e){const o=(t.habits||[]).find(i=>i.id===e);o&&Object.assign(o,a)}else{const o=bn(a);t.habits=[...t.habits||[],o]}$(t),C(),ce(),M(),y("✅ 习惯已保存")};window.showHabitManager=ce;function ce(){if(!l)return;const e=l,t=w("🗂️ 习惯管理","归档后习惯不再出现在今日列表，记录保留"),n=(e.habits||[]).map(a=>{const o=G(e,a);return`<div class="ct-row ${a.archived?"archived":""}">
      <span class="ct-icon" style="background:${a.color}22;color:${a.color}">${a.icon}</span>
      <span class="ct-name">${I(a.name)} <small>${a.cadence==="daily"?"每天":`每周${a.timesPerWeek}次`} · 🔥${o.streak} · 最佳${o.bestStreak}</small></span>
      <span class="ct-ops">
        <a onclick="showHabitDetail('${a.id}')">热力图</a>
        <a onclick="showHabitForm('${a.id}')">编辑</a>
        ${a.archived?`<a onclick="habitRestore('${a.id}')">恢复</a>`:`<a onclick="habitArchive('${a.id}')">归档</a>`}
      </span>
    </div>`}).join("")||'<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:8px;">还没有习惯</div>';t.querySelector(".modal-body").innerHTML=`
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">${n}</div>
    <button class="btn-primary" style="width:100%;" onclick="showHabitForm()">＋ 新建习惯</button>`}window.habitArchive=function(e){if(!l)return;const t=l.habits.find(n=>n.id===e);t&&(t.archived=!0),$(l),ce(),M()};window.habitRestore=function(e){if(!l)return;const t=l.habits.find(n=>n.id===e);t&&(t.archived=!1),$(l),ce(),M()};window.habitDelete=function(e){l&&confirm("删除习惯会同时删除它的全部打卡记录，确定吗？")&&(l.habits=(l.habits||[]).filter(t=>t.id!==e),l.habitChecks=(l.habitChecks||[]).filter(t=>t.habitId!==e),$(l),C(),ce(),M())};window.showHabitDetail=Mt;function Mt(e){if(!l)return;const t=l,n=(t.habits||[]).find(d=>d.id===e);if(!n)return;const a=G(t,n),o=In(t,n,12),i=["一","二","三","四","五","六","日"],r=[];for(let d=0;d<7;d++)for(let c=0;c<12;c++){const u=o[c][d],v=u.checked?"checked":u.future?"future":"empty",m=u.checked?`background:${n.color};`:"",p=u.future?"":`onclick="toggleHabit('${n.id}','${u.date}')"`;r.push(`<span class="heat-cell ${v}" title="${u.date}${u.makeup?"（补卡）":""}" ${p} style="${m}">${u.makeup?"·":""}</span>`)}const s=w(`${n.icon} ${I(n.name)} · 打卡详情`,"点击空格可以补卡，补卡会正常计入连续天数");s.querySelector(".modal-body").innerHTML=`
    <div style="display:flex;gap:14px;margin-bottom:16px;flex-wrap:wrap;">
      <div class="habit-stat"><span>🔥</span><div><strong>${a.streak}</strong><small>当前连续</small></div></div>
      <div class="habit-stat"><span>🏅</span><div><strong>${a.bestStreak}</strong><small>最佳连续（天）</small></div></div>
      <div class="habit-stat"><span>📅</span><div><strong>${a.weekCount}${n.cadence==="weekly"?"/"+n.timesPerWeek:""}</strong><small>本周次数</small></div></div>
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
    </div>`}function pa(e){const t=document.getElementById("todoBody");if(!t)return;const n=Cn(e.todos||[]).slice(0,20),a=N(),o={1:{label:"高优先",color:"#e05c4b"},2:{label:"中",color:"#f5a623"},3:{label:"低",color:"#a39684"}};t.innerHTML=(n.length===0?'<div style="color:var(--text-muted);font-size:13px;margin-bottom:10px;">还没有待办，写下一件想推进的小事吧</div>':"")+n.map(i=>{const r=An(i,a),s=o[i.priority];return`<div class="todo-row ${i.done?"done":""}" style="border-left-color:${s.color}">
        <span class="todo-check" onclick="todoToggle('${i.id}')">${i.done?"✓":""}</span>
        <div class="todo-main" onclick="todoToggle('${i.id}')">
          <div class="todo-title">${I(i.title)}</div>
          <div class="todo-meta">
            <span class="todo-pri" style="color:${s.color}">${s.label}</span>
            ${i.dueDate?`<span class="todo-due ${r?"overdue":""}">${r?"已逾期 · ":""}${i.dueDate.slice(5)} 截止</span>`:""}
            ${i.done?`<a onclick="event.stopPropagation();todoConvertInvest('${i.id}')">→ 记投入</a> <a onclick="event.stopPropagation();todoConvertJournal('${i.id}')">→ 写感悟</a>`:""}
          </div>
        </div>
        <span class="i-edit" onclick="editTodo('${i.id}')">✏️</span>
      </div>`}).join("")}window.todoAdd=function(){if(!l)return;const e=document.getElementById("todoInput").value.trim();if(!e){y("先写点什么吧");return}const t=Number(document.getElementById("todoPriority").value),n=document.getElementById("todoDue").value||void 0;l.todos=[...l.todos||[],En({title:e,priority:t,dueDate:n})],$(l),document.getElementById("todoInput").value="",document.getElementById("todoDue").value="",M(),y("✅ 已添加")};window.todoToggle=function(e){if(!l)return;const t=(l.todos||[]).find(a=>a.id===e);if(!t)return;const n=t.done;Object.assign(t,Tn(t)),$(l),M(),n||y("🎉 完成一件！可以把它转成投入或感悟")};window.editTodo=function(e){if(!l)return;const t=(l.todos||[]).find(a=>a.id===e);if(!t)return;const n=w("✏️ 编辑待办","");n.querySelector(".modal-body").innerHTML=`
    <input type="text" id="tTitle" value="${I(t.title)}" maxlength="60" style="width:100%;margin-bottom:12px;">
    <textarea id="tNote" rows="2" placeholder="备注（可选）" style="width:100%;margin-bottom:12px;">${I(t.note||"")}</textarea>
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
    </div>`};window.todoSave=function(e){if(!l)return;const t=(l.todos||[]).find(a=>a.id===e);if(!t)return;const n=document.getElementById("tTitle").value.trim();if(!n){y("标题不能为空");return}t.title=n,t.note=document.getElementById("tNote").value.trim()||void 0,t.priority=Number(document.getElementById("tPriority").value),t.dueDate=document.getElementById("tDue").value||void 0,$(l),C(),M(),y("✅ 已保存")};window.todoDelete=function(e){l&&confirm("删除这条待办？")&&(l.todos=(l.todos||[]).filter(t=>t.id!==e),$(l),C(),M())};window.todoConvertInvest=function(e){if(!l)return;const t=(l.todos||[]).find(a=>a.id===e);if(!t)return;const n=document.getElementById("investDesc");n.value=`完成：${t.title}`,C(),document.getElementById("investAmount")?.scrollIntoView({behavior:"smooth",block:"center"}),document.getElementById("investAmount")?.focus({preventScroll:!0}),y("已填入投入描述，补个金额或直接添加")};window.todoConvertJournal=function(e){if(!l)return;const t=(l.todos||[]).find(a=>a.id===e);if(!t)return;const n=document.getElementById("journalInput");n.value=`今天完成了「${t.title}」`,C(),n.scrollIntoView({behavior:"smooth",block:"center"}),n.focus()};const va=["🌟","🎉","🎓","💼","💍","🏠","🏆","🚀","🌈","🧭"];window.showTimelineModal=Fe;function Fe(){if(!l)return;const t=Nn(l),n=w("📅 成长大事记","你的每一笔投入、感悟与重要时刻，都会沉淀在这里");n.querySelector(".modal-body").innerHTML=`
    <div class="sub-form" style="margin-bottom:18px;">
      <div style="font-weight:bold;margin-bottom:8px;">记录一个大事件</div>
      ${X("eIcon",va,"🌟","emoji")}
      <input type="text" id="eTitle" placeholder="事件标题，如：拿到心仪 offer" style="width:100%;margin:10px 0;">
      <div style="display:flex;gap:10px;">
        <input type="date" id="eDate" value="${N()}" max="${N()}" style="flex:1;">
        <button class="btn-primary" onclick="timelineAdd()">添加</button>
      </div>
      <input type="text" id="eDesc" placeholder="备注（可选）" style="width:100%;margin-top:10px;">
    </div>
    ${t.achievedMilestones.length?`<div style="margin-bottom:16px;"><div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">🏅 已达成的里程碑</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">${t.achievedMilestones.map(a=>`<span class="milestone-chip">${a.icon} ${I(a.name)}</span>`).join("")}</div></div>`:""}
    <div class="timeline">
      ${t.months.length===0?'<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:16px;">还没有大事记，去记一笔投入或写句话吧</div>':""}
      ${t.months.map(a=>`
        <div class="tl-month">
          <div class="tl-month-label">${a.label}</div>
          <div class="tl-items">
            ${a.items.map(o=>`<div class="tl-item">
              <span class="tl-dot">${o.icon}</span>
              <div class="tl-content">
                <div class="tl-title">${I(o.title)}</div>
                <div class="tl-desc">${o.date.toLocaleDateString("zh-CN")}${o.desc?" · "+I(o.desc):""}</div>
              </div>
              ${o.deletable?`<span class="i-edit" onclick="timelineDelete('${o.id}')">🗑</span>`:""}
            </div>`).join("")}
          </div>
        </div>`).join("")}
    </div>`}window.timelineAdd=function(){if(!l)return;const e=document.getElementById("eTitle").value.trim();if(!e){y("写个标题吧");return}const t=document.getElementById("eIcon").dataset.value||"🌟",n=document.getElementById("eDate").value,a=document.getElementById("eDesc").value.trim()||void 0;l=pt(l,{title:e,icon:t,desc:a,date:n?Y(n):new Date}),$(l),Fe(),y("✅ 已加入大事记")};window.timelineDelete=function(e){l&&(l=Ln(l,e),$(l),Fe())};window.showAlertModal=ma;function ma(){if(!l)return;const e=l,t=Math.round(A(e).price),n=e.priceAlert||{},a=w("⚑ 指数预警线","本地计算：成长指数触及目标位或回落至支撑位时，给你一个提示");a.querySelector(".modal-body").innerHTML=`
    <div style="padding:10px 14px;background:var(--surface-softer);border-radius:10px;font-size:13px;margin-bottom:14px;">当前指数：<strong>${t} 点</strong></div>
    <label class="field-label">🎯 目标位（点）</label>
    <input type="number" id="alertTarget" value="${n.target??""}" placeholder="如 ${t+30}，留空不设" style="width:100%;margin:6px 0 14px;">
    <label class="field-label">🟡 支撑位（点）</label>
    <input type="number" id="alertFloor" value="${n.floor??""}" placeholder="如 ${Math.max(50,t-20)}，留空不设" style="width:100%;margin:6px 0 14px;">
    <div class="form-actions" style="justify-content:space-between;">
      <button class="dash-btn" onclick="alertClear()">清除预警</button>
      <button class="btn-primary" onclick="alertSave()">保存</button>
    </div>`}window.alertSave=function(){if(!l)return;const e=Number(document.getElementById("alertTarget").value),t=Number(document.getElementById("alertFloor").value),n=l.priceAlert||{};l.priceAlert={target:e>0?e:void 0,floor:t>0?t:void 0,targetHit:e>0&&e===n.target?!!n.targetHit:!1,floorHit:t>0&&t===n.floor?!!n.floorHit:!1},$(l),C(),M(),y("✅ 预警线已保存")};window.alertClear=function(){l&&(l.priceAlert=void 0,$(l),C(),M())};function ga(e){const t=document.getElementById("alertBadge");if(!t)return;const n=e.priceAlert;if(!n){t.innerHTML="";return}const a=[];n.targetHit&&a.push(`<span class="alert-chip hit">🎉 已突破 ${n.target} 点</span>`),n.floorHit&&a.push(`<span class="alert-chip warn">🟡 在支撑位 ${n.floor} 附近</span>`),t.innerHTML=a.join(" ")}function fa(e,t){const n=document.getElementById("todayStrip");if(!n)return;const a=new Date,o=a.getHours(),i=o<6?"夜深了":o<11?"早上好":o<14?"中午好":o<18?"下午好":"晚上好",r="周"+["日","一","二","三","四","五","六"][a.getDay()],s=(e.habits||[]).filter(p=>!p.archived),d=s.filter(p=>G(e,p).doneToday).length,c=N(),u=(e.journals||[]).some(p=>_(new Date(p.date))===c),v=s.reduce((p,g)=>Math.max(p,G(e,g).streak),0);let m;s.length>0&&d<s.length?m=`<button class="strip-cta" onclick="document.getElementById('habitCard').scrollIntoView({behavior:'smooth',block:'center'})">去打卡 →</button>`:u?m='<span class="strip-done">✨ 今天也在长进</span>':m=`<button class="strip-cta" onclick="document.getElementById('journalInput').scrollIntoView({behavior:'smooth',block:'center'});document.getElementById('journalInput').focus();">写一句 →</button>`,n.innerHTML=`
    <div class="strip-left">
      <span class="strip-avatar">${e.avatar||"🌱"}</span>
      <div>
        <div class="strip-greet">${i}，${I(e.nickname||"朋友")}</div>
        <div class="strip-sub">${a.getMonth()+1}月${a.getDate()}日 ${r}${e.indexName?` · ${I(e.indexName)}`:""}${e.signature?` · ${I(e.signature)}`:""}</div>
      </div>
    </div>
    <div class="strip-right">
      <span class="strip-chip ${s.length>0&&d===s.length?"ok":""}">✅ 习惯 ${d}/${s.length}</span>
      <span class="strip-chip ${u?"ok":""}">${u?"📝 已记录":"📝 未记录"}</span>
      ${v>0?`<span class="strip-chip fire">🔥 ${v} 天</span>`:""}
      <span class="strip-price" style="color:${t.change>=0?"var(--accent-green)":"var(--accent-red)"}">${Math.round(t.price)} 点 · ${t.change>=0?"+":""}${t.change}%</span>
      ${m}
    </div>`}const Xe=["① 教育经历","② 职业与收入","③ 大额投入","④ 当前状态","⑤ 家庭与波折","⑥ 确认应用"],ya=["填真实的学费与培训花费，曲线会用真实数字替换对应年龄的统计估算；记不清就留空","有了工作轨迹，学生时代不再虚增收入贡献，工作后的成长曲线按你的真实涨薪节奏走","回忆几笔影响很大的真实投入（考研、留学、私教、证书…），记不清金额可填 0 只记事件","用现在的真实状态校准成长系数与质量系数","家庭支持单独计入累计成长值；波折会在对应年龄形成一次可解释的回撤","确认后，K 线将以真实数据为主、统计估算只补空白年份"],ha=[{t:"jobloss",n:"💼 工作变动"},{t:"illness",n:"🏥 健康风波"},{t:"loss",n:"🌧️ 失去与告别"},{t:"stagnate",n:"🪫 长期停滞"}];let re=0,L=null,fe=[];function ba(e){return e==="master"?25:e==="bachelor"||e==="college"?22:e==="senior"?18:16}function xa(e){return e<=2?"0-2":e<=5?"3-5":e<=14?"6-14":e<=17?"15-17":"18-22"}function wa(e){const t=e.enhancedSurvey,n=ot(e);return fe=t?.eduStages?.length?n.map(a=>t.eduStages.some(o=>o.name===a.name)):n.map(a=>a.enrolled),{eduStages:t?.eduStages?.length?t.eduStages.map(a=>({...a})):n.map(a=>({name:a.name,startAge:a.startAge,endAge:a.endAge,totalCost:0})),bigInvests:t?.bigInvests?t.bigInvests.map(a=>({...a})):[],career:{workStartAge:t?.career?.workStartAge??ba(e.education),startingSalary:t?.career?.startingSalary,avgRaisePct:t?.career?.avgRaisePct??5,currentSalary:t?.career?.currentSalary??e.annualIncome},studyHours:t?.studyHours??e.studyHours,healthScore:t?.healthScore??e.healthScore,familySupportCapital:(t?.familySupportCapital??e.familySupportCapital)||0,setbacks:t?.setbacks?t.setbacks.map(a=>({...a})):[]}}window.showSurveyModal=function(e=0){l&&(re=e,L=wa(l),Z())};function oe(){return H()?"":"disabled"}function Z(){if(!l||!L)return;const e=l,t=L,n=H(),a=re,o=w("📋 强化调查 · "+Xe[a],ya[a]);let r=`<div class="sv-dots">${Xe.map((s,d)=>`<span class="sv-dot ${d===a?"active":""} ${d<a?"done":""}">${d<a?"✓":d+1}</span>`).join("")}</div>`;if(a===0)r+=`<div class="sv-tip">以下年龄为常规学制参考，可自行修改；勾选并填写总花费的阶段才会替换估算${n?"":"（未授权金额信息，金额框已停用，仅年龄/学历仍可确认）"}</div>`,r+=(t.eduStages||[]).map((s,d)=>{const c=fe[d],u=Math.max(1,s.endAge-s.startAge+1),v=S.AGE_SPEND_RANGE[xa(s.startAge)]?.mid||3e4;return`<div class="sv-edu-row ${c?"":"off"}">
        <label style="display:flex;align-items:center;gap:6px;min-width:110px;font-weight:600;font-size:13px;cursor:pointer;">
          <input type="checkbox" ${c?"checked":""} onchange="this.closest('.sv-edu-row').classList.toggle('off',!this.checked)"> ${s.name}
        </label>
        <span style="display:flex;align-items:center;gap:4px;font-size:12.5px;color:var(--text-secondary);">
          <input type="number" class="sv-edu-start" value="${s.startAge}" min="0" max="${e.age}" style="width:52px;padding:6px;">
          ~<input type="number" class="sv-edu-end" value="${s.endAge}" min="0" max="${e.age}" style="width:52px;padding:6px;">岁
        </span>
        <input type="number" class="sv-edu-cost" value="${s.totalCost||""}" placeholder="总花费（参考约 ${Math.round(v*u/1e4)} 万）" ${oe()} style="flex:1;min-width:150px;padding:8px 10px;font-size:13px;">
      </div>`}).join("");else if(a===1)r+=`<div class="sv-field"><label>参加工作年龄</label>
      <input type="number" id="svWorkStart" value="${t.career?.workStartAge??""}" min="0" max="${e.age}" style="width:100%;padding:9px 12px;"></div>`,r+=`<div class="sv-field"><label>第一份工作年薪（元）${n?"":"· 未授权金额，已停用"}</label>
      <input type="number" id="svStartSalary" value="${t.career?.startingSalary??""}" placeholder="如 80000" ${oe()} style="width:100%;padding:9px 12px;"></div>`,r+=`<div class="sv-field"><label>年均加薪幅度（%，可为负）</label>
      <input type="number" id="svRaise" value="${t.career?.avgRaisePct??5}" step="0.5" style="width:100%;padding:9px 12px;"></div>`,r+=`<div class="sv-field"><label>当前年薪确认（元）${n?"":"· 未授权金额，已停用"}</label>
      <input type="number" id="svCurrentSalary" value="${t.career?.currentSalary??""}" ${oe()} style="width:100%;padding:9px 12px;"></div>`,n||(r+='<div class="sv-tip">在隐私设置中授权金额信息后，可填写精确薪资；不填则沿用模型估算。</div>');else if(a===2)r+='<div class="sv-tip">这些投入会以真实类型计入对应年龄（技能会折旧、健康影响质量系数），让曲线拐点有真实依据。</div>',r+=(t.bigInvests||[]).map((s,d)=>`
      <div class="sv-subrow">
        <select class="sv-bi-age" style="width:78px;">${Qe(e.age,s.age)}</select>
        <select class="sv-bi-type" style="flex:1;min-width:96px;">${$a(s.type)}</select>
        <input type="number" class="sv-bi-amount" value="${s.amount||""}" placeholder="金额，可空" ${oe()} style="width:110px;padding:7px;font-size:12.5px;">
        <input type="text" class="sv-bi-desc" value="${I(s.desc||"")}" placeholder="描述（可选）" style="flex:2;min-width:120px;padding:7px;font-size:12.5px;">
        <button class="sv-del" onclick="svDelBigInvest(${d})">✕</button>
      </div>`).join(""),r+='<button class="dash-btn" style="width:100%;margin-top:8px;" onclick="svAddBigInvest()">＋ 添加一笔真实投入</button>';else if(a===3){const s=t.studyHours??5,d=t.healthScore??70;r+=`<div class="sv-field"><label>现在平均每周学习 / 自我提升时长（小时）</label>
      <input type="number" id="svHours" value="${s}" min="0" max="40" step="0.5" style="width:100%;padding:9px 12px;"></div>`,r+=`<div class="sv-field"><label>当前健康状态自评：<b id="svHealthVal" style="color:var(--accent);">${d}</b> / 100</label>
      <input type="range" id="svHealth" min="0" max="100" value="${d}" style="width:100%;" oninput="document.getElementById('svHealthVal').textContent=this.value"></div>
      <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--text-muted);"><span>0 很糟</span><span>50 一般</span><span>100 很好</span></div>`}else if(a===4)r+=`<div class="sv-field"><label>家庭累计支持（万元，选填）${n?"":"· 未授权金额，已停用"}</label>
      <input type="number" id="svFamily" value="${t.familySupportCapital||0}" min="0" step="1" ${oe()} style="width:100%;padding:9px 12px;">
      <div style="font-size:11.5px;color:var(--text-muted);margin-top:4px;">父母/家庭对你的累计投入折算，不折旧、不乘权重，单独计入累计成长值。</div></div>`,r+='<div class="field-label">经历过的重大波折（选填，用于解释曲线上的回撤）</div>',r+=(t.setbacks||[]).map((s,d)=>`
      <div class="sv-subrow">
        <select class="sv-sb-age" style="width:78px;">${Qe(e.age,s.age)}</select>
        <select class="sv-sb-type" style="flex:1;min-width:110px;">${ha.map(c=>`<option value="${c.t}" ${s.type===c.t?"selected":""}>${c.n}</option>`).join("")}</select>
        <select class="sv-sb-sev" style="width:96px;">${[1,2,3,4,5,6,7,8,9,10].map(c=>`<option value="${c}" ${s.severity===c?"selected":""}>影响 ${c}/10</option>`).join("")}</select>
        <button class="sv-del" onclick="svDelSetback(${d})">✕</button>
      </div>`).join(""),r+='<button class="dash-btn" style="width:100%;margin-top:8px;" onclick="svAddSetback()">＋ 添加一段波折</button>';else{const s=at(e,t),d=Math.round(s.before.estimatedRatio*100),c=Math.round(s.after.estimatedRatio*100),u=s.coverage,v=(t.eduStages||[]).filter(m=>m.totalCost>0).length;r+=`<div class="sv-result">
      <div class="sv-result-main">
        <div><span class="sv-big">${d}%</span><span class="sv-arrow">→</span><span class="sv-big" style="color:var(--accent-green);">${c}%</span><div class="sv-cap">估算成分占比</div></div>
        <div><span class="sv-big" style="font-size:18px;">${s.before.label}</span><span class="sv-arrow">→</span><span class="sv-big" style="font-size:18px;color:var(--accent-green);">${s.after.label}</span><div class="sv-cap">置信度</div></div>
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
    ${a>0?'<button class="dash-btn" onclick="svGo(-1)">上一步</button>':"<span></span>"}
    ${a<5?'<button class="btn-primary" onclick="svGo(1)">下一步 →</button>':'<button class="btn-primary" onclick="svApplySurvey()">✅ 应用到我的 K 线</button>'}
  </div>`,o.querySelector(".modal-body").innerHTML=r}function Qe(e,t){return Array.from({length:e+1},(n,a)=>`<option value="${a}" ${t===a?"selected":""}>${a} 岁</option>`).join("")}function $a(e){return Object.keys(P).map(t=>`<option value="${t}" ${e===t?"selected":""}>${P[t].icon} ${P[t].name}</option>`).join("")}function ee(){if(!l||!L)return;const e=L,t=re,n=a=>{const o=document.getElementById(a);if(!o||o.disabled)return;const i=Number(o.value);return o.value===""||isNaN(i)?void 0:i};if(t===0){const a=document.querySelectorAll(".sv-edu-row");fe=[],e.eduStages=[],a.forEach((o,i)=>{const r=o.querySelector("input[type=checkbox]").checked;if(fe.push(r),!r)return;const s=Number(o.querySelector(".sv-edu-start").value),d=Number(o.querySelector(".sv-edu-end").value),c=o.querySelector(".sv-edu-cost"),u=c.disabled||c.value===""?0:Math.max(0,Number(c.value)||0),v=ot(l)[i]?.name||`阶段${i+1}`;isFinite(s)&&isFinite(d)&&d>=s&&s>=0&&d<=l.age&&e.eduStages.push({name:v,startAge:s,endAge:d,totalCost:u})})}else if(t===1)e.career={workStartAge:n("svWorkStart"),startingSalary:n("svStartSalary"),avgRaisePct:n("svRaise"),currentSalary:n("svCurrentSalary")};else if(t===2)e.bigInvests=[...document.querySelectorAll(".sv-subrow")].filter(a=>a.querySelector(".sv-bi-age")).map(a=>({age:Number(a.querySelector(".sv-bi-age").value),type:a.querySelector(".sv-bi-type").value,amount:Math.max(0,Number(a.querySelector(".sv-bi-amount").value)||0),desc:(a.querySelector(".sv-bi-desc").value||"").trim()||void 0}));else if(t===3)e.studyHours=n("svHours"),e.healthScore=n("svHealth");else if(t===4){const a=n("svFamily");a!==void 0&&(e.familySupportCapital=a),e.setbacks=[...document.querySelectorAll(".sv-subrow")].filter(o=>o.querySelector(".sv-sb-age")).map(o=>({age:Number(o.querySelector(".sv-sb-age").value),type:o.querySelector(".sv-sb-type").value,severity:Number(o.querySelector(".sv-sb-sev").value)}))}}window.svGo=function(e){ee(),re=Math.max(0,Math.min(5,re+e)),Z()};window.svAddBigInvest=function(){ee(),L.bigInvests=[...L.bigInvests||[],{age:l.age,amount:0,type:"skill",desc:void 0}],Z()};window.svDelBigInvest=function(e){ee(),L.bigInvests=(L.bigInvests||[]).filter((t,n)=>n!==e),Z()};window.svAddSetback=function(){ee(),L.setbacks=[...L.setbacks||[],{age:l.age-1,type:"stagnate",severity:5}],Z()};window.svDelSetback=function(e){ee(),L.setbacks=(L.setbacks||[]).filter((t,n)=>n!==e),Z()};window.svApplySurvey=function(){if(!l||!L)return;ee();const e=at(l,L);l=e.user,$(l),C(),M(),y(`✅ 已用真实数据重建 K 线（估算成分 ${Math.round(e.before.estimatedRatio*100)}% → ${Math.round(e.after.estimatedRatio*100)}%）`)};Eo();
