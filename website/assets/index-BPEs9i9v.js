(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function n(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(o){if(o.ep)return;o.ep=!0;const a=n(o);fetch(o.href,a)}})();const $t="1.2",me=200,ve=.65,ge=1.5,fe=.6,he=1.3,ye=.3,w={BASE_INDEX:100,TYPE_WEIGHTS:{education:1.5,skill:1.3,health:1.1,network:1,entertainment:.5,other:.5},TYPE_HALF_LIFE:{education:1/0,skill:5,health:4,network:3,entertainment:1,other:2},REGION_COEF:{tier1:1.8,new_tier1:1.4,tier2:1.1,tier3:.8},AREA_COEF:{urban:1,rural:.68},INCOME_COEF:{low:.35,below_avg:.65,avg:1,above_avg:1.55,high:2.9},STAGE_COEF:[{age:0,coef:.2},{age:6,coef:.3},{age:12,coef:.5},{age:18,coef:.9},{age:25,coef:1.1},{age:35,coef:1.5},{age:50,coef:1.3},{age:65,coef:1},{age:80,coef:.8}],AGE_SPEND:{"0-2":24538,"3-5":36538,"6-14":27007,"15-17":29007,"18-22":29135},AGE_SPEND_RANGE:{"0-2":{low:18e3,mid:24538,high:35e3},"3-5":{low:25e3,mid:36538,high:52e3},"6-14":{low:18e3,mid:27007,high:4e4},"15-17":{low:2e4,mid:29007,high:42e3},"18-22":{low:18e3,mid:29135,high:45e3}}},be={education_cost:{name:"育娲人口研究《中国生育成本报告》",year:"2022",caliber:"全国家庭 0-17 岁子女年均教育/养育投入"}},F=[{id:"birth",name:"出生",icon:"👶",desc:"人生起点",bonus:20,condition:t=>t.age>=0},{id:"school",name:"小学入学",icon:"🎒",desc:"基础教育开始",bonus:10,condition:t=>t.age>=6},{id:"middle",name:"初中毕业",icon:"📖",desc:"义务教育完成",bonus:15,condition:t=>t.age>=15},{id:"highschool",name:"高中毕业",icon:"🎓",desc:"成年预备",bonus:20,condition:t=>t.age>=18},{id:"college",name:"大学毕业",icon:"🎓",desc:"步入社会",bonus:30,condition:t=>t.age>=22},{id:"firstjob",name:"第一份工作",icon:"💼",desc:"独立起步",bonus:30,condition:t=>t.hasJob},{id:"firstraise",name:"第一次涨薪",icon:"💰",desc:"成长被认可",bonus:15,condition:t=>t.salaryRaised},{id:"license",name:"拿到驾照",icon:"🚗",desc:"技能+1",bonus:5,condition:t=>t.hasLicense},{id:"marathon",name:"跑完马拉松",icon:"🏃",desc:"健康资产",bonus:8,condition:t=>t.marathon},{id:"marriage",name:"结婚",icon:"💍",desc:"人生伙伴",bonus:20,condition:t=>t.married},{id:"home",name:"买房",icon:"🏠",desc:"安定居所",bonus:25,condition:t=>t.hasHouse},{id:"child",name:"为人父母",icon:"👶",desc:"新的责任",bonus:15,condition:t=>t.hasChild},{id:"30",name:"三十而立",icon:"🎯",desc:"人生分水岭",bonus:25,condition:t=>t.age>=30},{id:"100k",name:"十万投入",icon:"💎",desc:"累计投入超10万",bonus:15,condition:t=>t.totalInvest>=1e5},{id:"500k",name:"五十万投入",icon:"👑",desc:"累计投入超50万",bonus:30,condition:t=>t.totalInvest>=5e5}],Ot=.5,Gt=1.5,xe=1;function qt(t,e,n){return Math.max(e,Math.min(n,t))}function we(t){return t.subjectiveWeight===void 0||t.subjectiveWeight===null?xe:qt(t.subjectiveWeight,Ot,Gt)}function $e(t){return qt(t,Ot,Gt)}function Z(t,e,n){return Math.max(e,Math.min(n,t))}function ke(t){const e=t.history?.length||0,n=t.investments?.length||0,i=e+n,o=e,a=i>0?o/i:1;let r;const l=i>0?n/i:0;l>=.5?r="high":l>=.2?r="medium":r="low";const d={high:"高置信",medium:"中置信",low:"低置信"},c=i>0?o/(i+1):.5;return{level:r,estimatedRatio:Math.round(a*100)/100,manualCount:n,estimatedCount:o,label:d[r],potentialEstimatedRatio:Math.round(c*100)/100}}function gt(t,e,n){if(n==="education")return t;const i=w.TYPE_HALF_LIFE[n]||5;return isFinite(i)?t*Math.exp(-.693*e/i):t}function kt(t){const e=w.STAGE_COEF;if(t<=e[0].age)return e[0].coef;for(let n=0;n<e.length-1;n++)if(t>=e[n].age&&t<=e[n+1].age){const i=(t-e[n].age)/(e[n+1].age-e[n].age);return e[n].coef+i*(e[n+1].coef-e[n].coef)}return e[e.length-1].coef}function Me(t){const e=Z((t.annualIncomeGrowth||0)*2,-.35,.35),n=Z(((t.studyHours||0)-5)/20,-.15,.15);return Z(1+e+n,ve,ge)}function Se(t){return Z(.6+t/100*.7,fe,he)}function De(t){return Z((t.debtRatio||0)*.3,0,ye)}function Wt(t,e=new Date){let n=0;return t.history.forEach(i=>{const o=t.age-i.age,a=w.TYPE_WEIGHTS[i.type]||1;n+=i.invest/1e4*a*gt(1,Math.max(0,o),i.type)}),t.investments.forEach(i=>{const o=(e.getTime()-i.date.getTime())/315576e5,a=w.TYPE_WEIGHTS[i.type]||1;n+=i.amount/1e4*a*gt(1,Math.max(0,o),i.type)}),t.familySupportCapital&&(n+=t.familySupportCapital),n}function E(t,e=new Date){const n=Wt(t,e),i=kt(t.age),o=F.filter(b=>b.condition(t)).reduce((b,P)=>b+P.bonus,0),a=Math.min(me,o),r=(t.annualIncome||0)/1e4,l=n>0?Math.min(1e3,r/(n+1)*100):0,c=t.investments.filter(b=>(e.getTime()-b.date.getTime())/315576e5<2&&["education","skill","health"].includes(b.type)).length>0?1:Math.max(.65,1-(t.age-22)*.012);let u=t.healthScore||50;const p=t.investments.filter(b=>(e.getTime()-b.date.getTime())/315576e5<2&&b.type==="health");t.age>30&&p.length===0&&(u=Math.max(20,u-(t.age-30)*1.5));const m=Me(t)*c,f=Se(u),h=De(t),z=we(t),D=(w.BASE_INDEX+n*i+a)*m*f*(1-h)*z,B=(D-w.BASE_INDEX)/w.BASE_INDEX*100,C=r>0?Math.round(D/r*10)/10+"倍":"—";return{price:Math.round(D*10)/10,change:Math.round(B*10)/10,bv:Math.round(n*10)/10,eps:Math.round(r*100)/100,roe:Math.round(l*10)/10,pe:C,milestoneBonus:a,growthCoef:Math.round(m*100)/100,qualityCoef:Math.round(f*100)/100,stagnationPenalty:Math.round(c*100)/100,effectiveHealth:Math.round(u),riskDiscount:Math.round(h*100)/100,subjectiveAdjust:Math.round(z*100)/100}}function Ie(t){const e=w.REGION_COEF[t.region]*w.AREA_COEF[t.area]*w.INCOME_COEF[t.income],n=[];for(let i=0;i<=t.age;i++){let o;i<=2?o=w.AGE_SPEND["0-2"]:i<=5?o=w.AGE_SPEND["3-5"]:i<=14?o=w.AGE_SPEND["6-14"]:i<=17?o=w.AGE_SPEND["15-17"]:o=w.AGE_SPEND["18-22"],o=o*e*(.9+Math.random()*.2),n.push({age:i,invest:o,type:"education"})}if(t.anchor){const i=t.anchor.age;n[i]&&(n[i].invest=t.anchor.amount)}return n}function W(t){const e=[];let n=0;for(let i=0;i<=t.age;i++){let a=t.history.filter(p=>p.age===i).reduce((p,v)=>p+v.invest,0);const r=t.investments.filter(p=>Math.floor((p.date.getTime()-new Date(t.birthYear+i,0,1).getTime())/315576e5)===i);a+=r.reduce((p,v)=>p+v.amount,0),n+=a;const l={...t,age:i,history:t.history.filter(p=>p.age<=i),investments:r},d=E(l),c=1+(Math.random()-.5)*.16,u=d.price*c;e.push({age:i,price:Math.round(u*10)/10,invest:a,total:n})}return e}function Yt(t){const e={primary:.5,junior:.8,senior:1,college:1.2,bachelor:1.3,master:1.5},n={age:t.age,region:t.region,area:t.area,income:"avg",education:t.education,birthYear:t.birthYear,annualIncome:8e4*(e[t.education]||1),annualIncomeGrowth:.05,studyHours:2,healthScore:65,debtRatio:.05,hasJob:t.age>=22,salaryRaised:t.age>=25,hasLicense:t.age>=20,marathon:!1,married:t.age>=28,hasHouse:t.age>=30,hasChild:t.age>=32,totalInvest:0,history:Ee(t),investments:[]};return E(n).price}function Ee(t){const e=w.REGION_COEF[t.region]*w.AREA_COEF[t.area]*w.INCOME_COEF.avg,n=[];for(let i=0;i<=t.age;i++){let o;i<=2?o=w.AGE_SPEND["0-2"]:i<=5?o=w.AGE_SPEND["3-5"]:i<=14?o=w.AGE_SPEND["6-14"]:i<=17?o=w.AGE_SPEND["15-17"]:o=w.AGE_SPEND["18-22"],o=o*e,n.push({age:i,invest:o,type:"education"})}return n}function Vt(t,e){let n={...t};return(!e||e<"1.2")&&n.familySupportCapital===void 0&&(n.familySupportCapital=0),n.version=$t,n}function Te(t){return{...t,version:$t,disclaimer:"本工具为个人成长记录与自我反思工具，所有数值为模型估算，仅供娱乐与自我观察，不构成理财、职业或心理咨询建议，也不预测收入。"}}function Ce(t,e){const n=kt(t.age),i=100,o=e.bv*n,a=e.milestoneBonus,r=[{key:"growth",name:"成长系数",value:e.growthCoef,reason:`收入增速与学习时长决定，含停滞衰减 ${e.stagnationPenalty}`},{key:"quality",name:"质量系数",value:e.qualityCoef,reason:`基于有效健康分 ${e.effectiveHealth}`},{key:"risk",name:"风险折扣",value:1-e.riskDiscount,reason:`负债率 ${(t.debtRatio||0)*100}%，折扣 ${(e.riskDiscount*100).toFixed(0)}%`},{key:"subjective",name:"主观感知",value:e.subjectiveAdjust,reason:`你设定的主观权重 ${e.subjectiveAdjust.toFixed(2)}（1.0 为中性）`}],l=r.reduce((u,p)=>u*p.value,1),d=e.price,c=[];return c.push({key:"base",name:"基准指数",contribution:Math.round(i*l*10)/10,ratio:d>0?i*l/d:0,reason:"所有人同一起点 100 分"}),c.push({key:"bv",name:"累计成长值",contribution:Math.round(o*l*10)/10,ratio:d>0?o*l/d:0,reason:`成长值 ${e.bv} 点 × 阶段系数 ${n.toFixed(2)}（${t.age}岁）`}),c.push({key:"milestone",name:"里程碑加成",contribution:Math.round(a*l*10)/10,ratio:d>0?a*l/d:0,reason:"已达成里程碑加分（封顶 200）"}),r.forEach(u=>{c.push({key:u.key,name:u.name,contribution:0,ratio:0,reason:u.reason+`（×${u.value.toFixed(2)}）`})}),c}function Ae(t){const e=t.filter(n=>n.contribution>0);return e.length===0?null:e.reduce((n,i)=>n.contribution>i.contribution?n:i)}const ze={great:4,good:3,ok:2,low:1};function Le(t,e,n){return{id:`j_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,date:new Date,content:t.trim(),mood:e,category:n}}function Be(t,e){return{...t,journals:[...t.journals||[],e]}}function je(t,e=10){return[...t.journals||[]].sort((n,i)=>new Date(i.date).getTime()-new Date(n.date).getTime()).slice(0,e)}function Mt(t,e){const n=Date.now()-e*24*60*60*1e3;return(t.journals||[]).filter(i=>new Date(i.date).getTime()>=n).length}function Jt(t){const e=new Set((t.journals||[]).map(o=>new Date(o.date).toDateString()));let n=0;const i=new Date;for(;e.has(i.toDateString());)n++,i.setDate(i.getDate()-1);return n}function St(t,e=30){const n=Date.now()-e*24*60*60*1e3,i=(t.journals||[]).filter(a=>a.mood&&new Date(a.date).getTime()>=n);return i.length===0?null:i.reduce((a,r)=>a+ze[r.mood],0)/i.length}function Pe(t,e){if(t.length===0)return{peak:e,current:e,drawdownPct:0,drawdownPoints:0,peakDaysAgo:0,inDrawdown:!1,suggestions:["开始记录你的第一笔成长投入吧"]};const n=Math.max(...t.map(c=>c.price),e),i=Math.max(0,n-e),o=n>0?i/n*100:0,a=t.reduce((c,u)=>u.price>c.price?u:c,t[0]),r=t[t.length-1].age,l=Math.round((r-a.age)*365),d=[];return o===0?d.push("当前处于历史高位，继续保持成长节奏"):o<5?(d.push("小幅波动属正常，不必过度焦虑"),d.push("检查近期投入是否连续，保持每周一笔")):o<15?(d.push("阶段性回落，可复盘近期是否有停滞期"),d.push("健康与学习时长对成长系数影响较大")):(d.push("回落幅度较大，建议认真复盘近期生活变化"),d.push("可在「记录挫折」中标记事件，帮助归因")),{peak:n,current:e,drawdownPct:Math.round(o*10)/10,drawdownPoints:Math.round(i),peakDaysAgo:Math.max(0,l),inDrawdown:o>.5,suggestions:d}}function He(t){const e=["最近哪件事最影响你的状态？","这个阶段你的投入重心放在了哪里？","有什么是你想调整或继续的？"];return t.setbacks&&t.setbacks.length>0&&e.unshift("你记录的挫折事件，现在回看有什么新感悟？"),e}function Re(t,e){const n=E(t),i=n.price,o=Math.max(0,e-i),a=n.growthCoef*n.qualityCoef*(1-n.riskDiscount)*n.subjectiveAdjust,r=n.stageCoef||1,l=Math.max(0,(e/a-100-n.milestoneBonus)/r),d=n.bv,c=Math.max(0,l-d),u=c,p=t.annualIncome*.05/12,v=t.annualIncome*.15/12,m=v>0?Math.ceil(c/v):999,f=p>0?Math.ceil(c/p):999,h=[];return o<=0?h.push("已达到目标，可设定更高的成长目标"):(h.push(`距离目标还差 ${Math.round(o)} 点`),h.push(`按当前节奏约需 ${m}-${f} 个月（仅作参考）`),h.push("提升学习时长与健康评分，可加速成长系数"),h.push("达成更多里程碑可获得额外加成")),{target:e,current:Math.round(i),gap:Math.round(o),requiredBV:Math.round(l),additionalInvest:Math.round(u),monthsRange:[Math.min(m,999),Math.min(f,999)],suggestions:h,confidence:"估算基于当前系数与线性假设，实际成长受多因素影响，请理性参考"}}function Ut(t,e){const n=new Date,i=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`,a=E(t).price,r=new Date(n.getFullYear(),n.getMonth(),1),l=n.getFullYear()-t.birthYear-(n.getMonth()<r.getMonth()?1:0);let d=a;if(e.length>0){const b=e.filter(P=>P.age<=l-.08);b.length>0?d=b[b.length-1].price:d=e[0].price}const c=a-d,u=d>0?c/d*100:0,p=new Date(n.getFullYear(),n.getMonth(),1).getTime(),v=(t.investments||[]).filter(b=>new Date(b.date).getTime()>=p),m=v.length,f=v.reduce((b,P)=>b+P.amount,0),h=Mt(t,30),z=St(t,30),D=[];m>0&&D.push(`本月记录了 ${m} 笔自我投入`),c>0?D.push(`成长指数上升 ${Math.round(c)} 点`):c<0&&D.push("本月指数有所回落，可查看回落复盘");const B=t._milestones||[];B>0&&D.push(`达成 ${B} 个里程碑`);const C=[];return m===0&&C.push("建议每周至少记录一笔投入，保持成长节奏"),h<5&&C.push("增加一句话记录的频率，帮助觉察成长"),z!==null&&z<2.5&&C.push("近期情绪偏低，关注健康与休息"),C.length===0&&C.push("保持当前节奏，继续积累成长值"),{month:i,startPrice:Math.round(d),endPrice:Math.round(a),changePoints:Math.round(c),changePct:Math.round(u*10)/10,investCount:m,investAmount:f,journalDays:h,avgMood:z,highlights:D,suggestions:C}}function jt(t){const e=t.getDay(),n=e===0?-6:1-e,i=new Date(t);return i.setDate(t.getDate()+n),i.setHours(0,0,0,0),i}function Dt(t){const e=new Date,n=jt(e),i=new Date(n);i.setDate(n.getDate()+7);const a=(t.investments||[]).filter(p=>{const v=new Date(p.date).getTime();return v>=n.getTime()&&v<i.getTime()}).length,r=a>0;let l=0,d=new Date(e);for(;;){const p=jt(d),v=new Date(p);if(v.setDate(p.getDate()+7),(t.investments||[]).some(f=>{const h=new Date(f.date).getTime();return h>=p.getTime()&&h<v.getTime()}))l++,d=new Date(p),d.setDate(p.getDate()-1);else{if(l===0&&d.getTime()===e.getTime()){d=new Date(p),d.setDate(p.getDate()-1);continue}break}if(l>520)break}const c=Math.max(0,7-(e.getDay()===0?7:e.getDay()-1));let u;return r?u=`本周已记录 ${a} 笔，继续保持！连续 ${l} 周`:c<=2?u=`本周还剩 ${c} 天，记一笔投入保持连续吧`:u=`本周还剩 ${c} 天，期待你的第一笔投入`,{investedThisWeek:r,countThisWeek:a,streakWeeks:l,daysLeftInWeek:c,message:u}}const _e={education:"🎓 教育",skill:"📚 技能",health:"💪 健康",network:"🤝 人脉",entertainment:"🎮 娱乐",other:"📦 其他"};function dt(t){const e={education:0,skill:0,health:0,network:0,entertainment:0,other:0};(t.history||[]).forEach(m=>{e[m.type]=(e[m.type]||0)+m.invest}),(t.investments||[]).forEach(m=>{e[m.type]=(e[m.type]||0)+m.amount});const n=Math.max(...Object.values(e),1),i=Object.keys(e).map(m=>({type:m,label:_e[m],value:Math.round(e[m]/n*100),amount:e[m]})),o=[...i].sort((m,f)=>f.amount-m.amount),a=o[0].type,r=o[o.length-1].type,l=i.map(m=>m.amount),d=l.reduce((m,f)=>m+f,0)/l.length;if(d===0)return{dimensions:i,dominant:a,weakest:r,balance:0};const c=l.reduce((m,f)=>m+(f-d)**2,0)/l.length,p=Math.sqrt(c)/d,v=Math.max(0,Math.min(1,1-p/2));return{dimensions:i,dominant:a,weakest:r,balance:Math.round(v*100)/100}}function Ne(t,e=10,n=0){const i=t.age,o=[];let a=Wt(t);const r=.06;for(let u=1;u<=e;u++){const p=i+u,v=Math.round(a*r),m=n;a=a-v+m,a=Math.max(0,a),o.push({age:p,bv:Math.round(a),depreciation:v,newInvest:m})}const l=o[4]?.bv||0,d=o[9]?.bv||0,c=[];return n===0&&c.push("未设定年度新增投入，成长值会随时间自然衰减"),d<a*.5&&(c.push("按当前节奏，10 年后成长积累可能缩水过半"),c.push("建议增加年度投入，或提升投入质量")),l>a&&c.push("按当前投入节奏，5 年后成长积累仍在增长"),c.push("健康与技能类投入折旧较慢，优先配置"),{points:o,bv5y:l,bv10y:d,annualDecayRate:r,suggestions:c}}function Fe(t){const e=E(t).price;return[{scenario:"optimistic",label:"乐观",icon:"🚀",desc:"学习时长增加、健康改善、收入增长提速",mod:{studyHours:t.studyHours+5,healthScore:Math.min(100,t.healthScore+15),annualIncomeGrowth:t.annualIncomeGrowth+.05,debtRatio:Math.max(0,t.debtRatio-.1)}},{scenario:"neutral",label:"中性",icon:"➡️",desc:"保持当前节奏不变",mod:{}},{scenario:"pessimistic",label:"保守",icon:"🛡️",desc:"学习时长减少、健康下滑、收入停滞",mod:{studyHours:Math.max(0,t.studyHours-3),healthScore:Math.max(0,t.healthScore-15),annualIncomeGrowth:Math.max(0,t.annualIncomeGrowth-.05),debtRatio:Math.min(1,t.debtRatio+.1)}}].map(i=>{const o={...t,...i.mod},a=E(o);return{scenario:i.scenario,label:i.label,icon:i.icon,price:Math.round(a.price),changePct:e>0?Math.round((a.price-e)/e*1e3)/10:0,desc:i.desc,params:{studyHours:o.studyHours,healthScore:o.healthScore,incomeGrowth:o.annualIncomeGrowth,debtRatio:o.debtRatio}}})}function Oe(t){const e=t.familySupportCapital||0,n=t._familyEntries||[],i=(t.totalInvest||0)+e,o=i>0?e/i:0,a=[];return e===0&&a.push("可记录家庭/父母的累计投入，更全面地认识成长积累"),o>.5&&a.push("家庭支持占比较高，可逐步增加自我投入占比"),o>0&&o<=.5&&a.push("家庭支持与自我投入比例健康，继续保持"),n.length===0&&e>0&&a.push("可补充家庭投入的明细记录，便于感恩与回顾"),{totalSupport:e,entries:n,supportRatio:Math.round(o*100)/100,suggestions:a}}function Ge(t){const e=new Date,n=new Date(e),i=n.getDay(),o=i===0?-6:1-i;n.setDate(e.getDate()+o);const a=`${n.getFullYear()}年${n.getMonth()+1}月第${Math.ceil(n.getDate()/7)}周`,r=E(t),l=Dt(t),d=Mt(t,7);Jt(t);const c=St(t,7),u=dt(t),p=[],v=[],m=[];l.investedThisWeek?p.push(`本周记录了 ${l.countThisWeek} 笔投入${l.streakWeeks>1?`，连续 ${l.streakWeeks} 周`:""}`):(v.push("本周还没有记录投入，下周至少记一笔"),m.push("周末前记录一笔自我投入")),d>=5?p.push(`本周记录了 ${d} 条成长感悟，觉察力在线`):d>=1?m.push("下周把记录频率提升到 3 次以上"):(v.push("本周没有成长记录，觉察是成长的第一步"),m.push("每天花 1 分钟写下一个想法"));let f="本周无情绪数据";if(c!==null&&(c>=3.5?(p.push("本周整体情绪很好，状态饱满"),f="😄 情绪很好，继续保持"):c>=2.5?f="🙂 情绪平稳":(v.push("本周情绪偏低，关注休息与健康"),f="😔 情绪偏低，多关注自己",m.push("安排一次放松或运动"))),u.balance>=.6)p.push("投入结构较均衡，多维发展");else{const z=u.dimensions.find(D=>D.type===u.weakest)?.label||"";v.push(`投入结构不均衡，${z}维度较弱`),m.push(`下周在${z}上增加一点投入`)}r.growthCoef>=1.2?p.push("成长动力强劲，保持当前节奏"):r.growthCoef<.9&&(v.push("成长动力偏弱，检查学习时长与健康"),m.push("增加每周学习时长，关注健康评分"));let h;return p.length>=2?h="本周成长势头良好，继续保持多维投入与觉察。":v.length>=2?h="本周有提升空间，从小行动开始调整节奏。":h="本周平稳，保持觉察，持续积累。",m.length===0&&m.push("保持当前节奏，下周复盘时看看有什么新变化"),{week:a,summary:h,highlights:p,improvements:v,actions:m,moodNote:f}}function qe(t,e){const n=new Date,i=n.getFullYear(),o=E(t),a=n.getFullYear()-t.birthYear-1;let r=o.price;const l=e.filter(b=>b.age<=a);l.length>0&&(r=l[l.length-1].price);const d=o.price-r,c=r>0?d/r*100:0,u=new Date(i,0,1).getTime(),p=(t.investments||[]).filter(b=>new Date(b.date).getTime()>=u),v=p.reduce((b,P)=>b+P.amount,0),m=p.length,f=Mt(t,365),h=St(t,365),z=F.filter(b=>b.condition(t)).length,D=[];z>=5&&D.push("🏆 里程碑丰收"),m>=12&&D.push("💰 持续投入"),f>=100&&D.push("📝 勤于觉察"),t.healthScore>=75&&D.push("💪 健康在线"),o.growthCoef>=1.2&&D.push("🚀 高速成长"),D.length===0&&D.push("🌱 稳步积累");let B;d>0?B=`这一年，你的成长指数上升了 ${Math.round(d)} 点。每一笔投入、每一次觉察，都在累积成看得见的成长。`:d<0?B=`这一年有些起伏，指数回落了 ${Math.round(Math.abs(d))} 点。回落不是失败，是重新认识自己的机会。`:B="这一年平稳度过，成长在潜移默化中发生。";const C=[];return m<12&&C.push("每月至少记录一笔投入"),f<50&&C.push("每周记录 2-3 条成长感悟"),t.healthScore<70&&C.push("提升健康评分到 70 以上"),o.growthCoef<1&&C.push("增加学习时长，提升成长系数"),C.length===0&&C.push("保持当前节奏，设定更高的成长目标"),{year:i,startPrice:Math.round(r),endPrice:Math.round(o.price),changePoints:Math.round(d),changePct:Math.round(c*10)/10,totalInvest:v,investCount:m,journalDays:f,avgMood:h,milestoneCount:z,keywords:D,summary:B,nextYearPlan:C}}function It(t){const e=Jt(t),n=Dt(t),i=(t.investments||[]).length,o=(t.journals||[]).length,a=t._milestones||0;return[{id:"streak7",name:"七日觉察",icon:"🔥",desc:"连续 7 天记录成长感悟",progress:Math.min(e,7),target:7,done:e>=7,unit:"天"},{id:"streak30",name:"月度坚持",icon:"🌟",desc:"连续 30 天记录成长感悟",progress:Math.min(e,30),target:30,done:e>=30,unit:"天"},{id:"invest10",name:"十笔投入",icon:"💰",desc:"累计记录 10 笔自我投入",progress:Math.min(i,10),target:10,done:i>=10,unit:"笔"},{id:"weekly4",name:"周周不断",icon:"📅",desc:"连续 4 周每周至少一笔投入",progress:Math.min(n.streakWeeks,4),target:4,done:n.streakWeeks>=4,unit:"周"},{id:"journal50",name:"觉察达人",icon:"📝",desc:"累计记录 50 条成长感悟",progress:Math.min(o,50),target:50,done:o>=50,unit:"条"},{id:"milestone5",name:"里程碑收集者",icon:"🏆",desc:"达成 5 个成长里程碑",progress:Math.min(a,5),target:5,done:a>=5,unit:"个"}]}function We(t){const e=It(t),n=e.filter(i=>i.done).length;return Math.round(n/e.length*100)}const Pt=[{name:"成长教练",tone:"理性鼓励"},{name:"职场前辈",tone:"务实建议"},{name:"生活哲学家",tone:"温柔启发"}];function Ye(t){const e=E(t),n=dt(t),i=Pt[new Date().getDate()%Pt.length],o=[],a=[];if(e.growthCoef>=1.2?o.push("你的成长动力很强，学习与投入节奏不错"):e.growthCoef<.9?o.push("近期成长动力偏弱，可能需要调整节奏"):o.push("成长节奏平稳，稳扎稳打"),t.healthScore>=80?o.push("健康状态良好，这是持续成长的底座"):t.healthScore<60&&o.push("健康评分偏低，身体是一切的基础"),n.balance>=.6)o.push("投入结构均衡，多维发展");else{const u=n.dimensions.find(p=>p.type===n.weakest)?.label.split(" ")[1]||"";o.push(`${u}维度投入相对较少`)}t.studyHours<5&&a.push("尝试每周增加 2-3 小时学习时间，成长系数会明显提升"),t.healthScore<70&&a.push("安排规律运动和睡眠，健康评分每提升 10 分，质量系数约提升 7%"),n.balance<.5&&a.push("在保持优势维度的同时，给薄弱维度一些投入，结构会更稳"),e.subjectiveAdjust<1&&a.push("你对自己的评价偏保守，不妨多看看已取得的进步"),a.length===0&&a.push("当前状态不错，给自己设定一个稍高的目标，然后稳步推进");const r=["成长不是百米冲刺，而是马拉松。你已经在路上了。","每一笔投入、每一次觉察，都在塑造未来的你。","不必和别人比，今天的你比昨天好一点，就是胜利。","低谷是蓄力，高峰是收获。享受这个过程。"],l=r[new Date().getDay()%r.length],d=new Date().getHours();let c;return d<6?c="夜深了，注意休息。":d<12?c="早上好，新的一天开始了。":d<18?c="下午好，今天过得怎么样？":c="晚上好，回顾一下今天的成长吧。",{persona:`${i.name}（${i.tone}）`,greeting:c,observations:o,advices:a,encouragement:l}}const Ve=[{term:"成长积累",icon:"💎",short:"你累计投入自己的总和",detail:"包括教育、技能、健康、人脉等各维度的投入总和。它会随时间自然衰减，需要持续投入来保持与增长。",category:"基础"},{term:"成长指数",icon:"📈",short:"综合反映你当前成长状态的数值（单位：点）",detail:"基于成长积累、成长系数、质量系数、风险折扣、主观感知权重等综合计算。它不是分数，也不是金钱，而是一个帮助你觉察和调整的参考。",category:"基础"},{term:"成长系数",icon:"🚀",short:"反映你当前成长速度的倍率",detail:"受收入增长、学习时长、停滞惩罚等影响。学习时长每增加 5 小时/周，成长系数约提升 0.25。",category:"成长"},{term:"质量系数",icon:"✨",short:"反映生活质量对成长的放大作用",detail:"主要由健康评分决定。健康是 1，其他是 0。健康评分每提升 10 分，质量系数约提升 7%。",category:"成长"},{term:"主观感知权重",icon:"🎯",short:"你对自身成长价值的主观评估",detail:'范围 0.5-1.5，默认 1.0 中性。这是你对自己的主观评估，不影响客观成长积累，只影响你"感受到"的指数。',category:"心理"},{term:"折旧",icon:"📉",short:"成长积累随时间自然损耗",detail:"知识会遗忘，技能会生疏，健康会衰退。不同类型的投入折旧速度不同：健康最稳，教育折旧较快。持续投入是对抗折旧的唯一方式。",category:"方法"},{term:"回落",icon:"💧",short:"成长指数从阶段性高点回落的幅度",detail:"成长不是直线上升，回落是正常的。关键不是避免回落，而是在回落中复盘觉察，找到调整方向。",category:"心理"},{term:"里程碑",icon:"🏆",short:"成长路上的标志性节点",detail:"如获得第一份工作、升职加薪、考取证书等。里程碑会给指数带来额外加成，是对阶段性成长的肯定。",category:"成长"}],Je=[{stage:"学生期",ageRange:"18-22 岁",focus:"积累基础，探索方向",tips:["教育投入是核心，学好专业基础","多尝试不同领域，找到兴趣所在","开始建立健康习惯，受益终身","人脉投入从同学关系开始"]},{stage:"职场初期",ageRange:"23-28 岁",focus:"快速学习，建立能力",tips:["技能投入优先，快速提升职场竞争力","健康不能忽视，避免透支身体","人脉从同事和行业社群拓展","设定 3 年成长目标，定期复盘"]},{stage:"职场上升期",ageRange:"29-35 岁",focus:"深度积累，形成壁垒",tips:["在专业领域深耕，建立不可替代性","开始关注财务管理，控制负债",'健康管理从"被动"变"主动"'," mentoring 他人也是自我成长"]},{stage:"成熟期",ageRange:"36-45 岁",focus:"稳定输出，传承价值",tips:['从"学"转向"用"和"教"',"家庭与事业的平衡是关键","健康投入比重需提高","帮助年轻人成长，回馈社会"]}],ft=[{title:"致支持我的家人",content:"谢谢你们一直以来的支持和陪伴。我正在认真生活、持续成长，每一点进步都有你们的功劳。我会照顾好自己，也会努力成为更好的人。"},{title:"给爸爸妈妈的一封信",content:"这些年辛苦了。我知道成长不是一件容易的事，而你们的爱是我最坚实的后盾。我会好好珍惜自己，也会常回家看看。"},{title:"感恩有你",content:"感谢你在我成长路上的每一份付出。也许我不常说，但我都记得。我会带着这份爱，继续向前走。"},{title:"我在好好长大",content:"请放心，我在认真生活、努力成长。健康、学习、工作，我都在用心经营。谢谢你给我的一切，我会用成长来回报。"}];function Kt(t,e){const n=e??new Date().getDate()%ft.length,i=ft[n];return{title:i.title,content:i.content,signature:`—— 一个正在成长的人（${t.age} 岁）`}}function lt(){return ft.length}function Et(t,e){const n=E(t),i=Ut(t,e),o=dt(t),a=It(t),r=[];return r.push("═══════════════════════════════════════"),r.push("         人 生 成 长 报 告"),r.push("═══════════════════════════════════════"),r.push(""),r.push(`生成时间：${new Date().toLocaleString("zh-CN")}`),r.push(""),r.push("【一、当前状态】"),r.push(`  成长指数：${Math.round(n.price)} 点`),r.push(`  累计成长值：${Math.round(n.bv)} 点`),r.push(`  成长系数：${n.growthCoef.toFixed(2)}`),r.push(`  质量系数：${n.qualityCoef.toFixed(2)}`),r.push(`  风险折扣：${Math.round(n.riskDiscount*100)}%`),r.push(`  主观感知权重：${n.subjectiveAdjust.toFixed(2)}`),r.push(""),r.push("【二、本月概览】"),r.push(`  月度变化：${i.changePoints>=0?"+":""}${i.changePoints} 点（${i.changePct>=0?"+":""}${i.changePct}%）`),r.push(`  投入笔数：${i.investCount} 笔，实际花费 ${i.investAmount.toLocaleString()} 元（仅为记录）`),r.push(`  记录天数：${i.journalDays} 天`),i.highlights.length>0&&(r.push("  本月亮点："),i.highlights.forEach(l=>r.push(`    - ${l}`))),r.push(""),r.push("【三、投入结构】"),o.dimensions.forEach(l=>{r.push(`  ${l.label}：${l.amount.toLocaleString()} 元`)}),r.push(`  均衡度：${Math.round(o.balance*100)}%`),r.push(""),r.push("【四、挑战进度】"),a.forEach(l=>{r.push(`  ${l.icon} ${l.name}：${l.progress}/${l.target} ${l.unit} ${l.done?"✓":""}`)}),r.push(""),r.push("【五、下月建议】"),i.suggestions.forEach(l=>r.push(`  • ${l}`)),r.push(""),r.push("═══════════════════════════════════════"),r.push("  本报告由「今日宜长进」在你的设备本地生成"),r.push("  数值为模型估算，仅供自我观察与反思，不构成理财、职业或心理建议"),r.push("═══════════════════════════════════════"),r.join(`
`)}function _(t){const e=t.getFullYear(),n=String(t.getMonth()+1).padStart(2,"0"),i=String(t.getDate()).padStart(2,"0");return`${e}-${n}-${i}`}function R(t=new Date){return _(t)}function G(t){const[e,n,i]=t.split("-").map(Number);return new Date(e,n-1,i)}let pt=0;function Ue(t){return pt=(pt+1)%1e6,`${t}_${Date.now().toString(36)}_${pt}${Math.random().toString(36).slice(2,6)}`}function Ke(t,e=new Date){const n=t.name.trim();if(!n)throw new Error("习惯名称不能为空");return{id:Ue("h"),name:n,icon:t.icon||"⭐",color:t.color||"#ff8a4c",cadence:t.cadence,timesPerWeek:t.cadence==="weekly"?Math.min(7,Math.max(1,t.timesPerWeek||3)):1,linkedType:t.linkedType,investOnCheck:t.investOnCheck??!0,createdAt:e}}function Xe(t,e){return new Set((t.habitChecks||[]).filter(n=>n.habitId===e).map(n=>n.date))}function Qe(t,e,n){return t.findIndex(i=>i.habitId===e&&i.date===n)}function Ze(t,e,n=R(),i=new Date){const o=[...t.habitChecks||[]],a=Qe(o,e,n);let r,l=!1;return a>=0?(o.splice(a,1),r="unchecked"):(l=n<R(i),o.push({habitId:e,date:n,makeup:l||void 0}),r="checked"),{user:{...t,habitChecks:o},action:r,makeup:l}}function tn(t,e){return Math.round((G(t).getTime()-G(e).getTime())/864e5)}function en(t,e,n=new Date){if(e.cadence==="daily"){let d=0;const c=new Date(n.getFullYear(),n.getMonth(),n.getDate());for(;t.has(_(c));)d++,c.setDate(c.getDate()-1);return d}const i=new Date(n.getFullYear(),n.getMonth(),n.getDate()),o=(i.getDay()+6)%7,a=new Date(i);a.setDate(i.getDate()-o);let r=a;ht(t,r,e.timesPerWeek)||(r=new Date(a),r.setDate(a.getDate()-7));let l=0;for(;ht(t,r,e.timesPerWeek);)l++,r=new Date(r),r.setDate(r.getDate()-7);return l}function ht(t,e,n,i=new Date){let o=0;for(let a=0;a<7;a++){const r=new Date(e);r.setDate(e.getDate()+a),!(r.getTime()>i.getTime())&&t.has(_(r))&&o++}return o>=n}function nn(t,e,n=new Date){const i=Array.from(t).sort();if(i.length===0)return 0;if(e.cadence==="daily"){let p=1,v=1;for(let m=1;m<i.length;m++)tn(i[m],i[m-1])===1?(v++,p=Math.max(p,v)):v=1;return p}const o=G(i[0]),a=(o.getDay()+6)%7,r=new Date(o);r.setDate(o.getDate()-a);const l=G(i[i.length-1]);let d=0,c=0;const u=new Date(r);for(;u.getTime()<=l.getTime()+7*864e5;)ht(t,u,e.timesPerWeek,n)?(c++,d=Math.max(d,c)):c=0,u.setDate(u.getDate()+7);return d}function O(t,e,n=new Date){const i=Xe(t,e.id),o=new Date(n.getFullYear(),n.getMonth(),n.getDate()),a=(o.getDay()+6)%7,r=new Date(o);r.setDate(o.getDate()-a);const l=[];let d=0;for(let c=0;c<7;c++){const u=new Date(r);u.setDate(r.getDate()+c);const p=u.getTime()<=o.getTime()&&i.has(_(u));l.push(p),p&&d++}return{doneToday:i.has(_(o)),streak:en(i,e,n),bestStreak:nn(i,e,n),weekCount:d,weekDots:l,weekTarget:e.cadence==="weekly"?e.timesPerWeek:7}}function on(t,e,n=12,i=new Date){const o=new Map;(t.habitChecks||[]).filter(p=>p.habitId===e.id).forEach(p=>o.set(p.date,p));const a=new Date(i.getFullYear(),i.getMonth(),i.getDate()),r=(a.getDay()+6)%7,l=new Date(a);l.setDate(a.getDate()-r);const d=new Date(l);d.setDate(l.getDate()-7*(n-1));const c=_(a),u=[];for(let p=0;p<n;p++){const v=[];for(let m=0;m<7;m++){const f=new Date(d);f.setDate(d.getDate()+p*7+m);const h=_(f),z=o.get(h);v.push({date:h,checked:!!z,makeup:!!z?.makeup,future:h>c})}u.push(v)}return u}let mt=0;function an(){return mt=(mt+1)%1e6,`t_${Date.now().toString(36)}_${mt}${Math.random().toString(36).slice(2,6)}`}function sn(t,e=new Date){const n=t.title.trim();if(!n)throw new Error("待办标题不能为空");return{id:an(),title:n,note:t.note?.trim()||void 0,priority:t.priority??2,dueDate:t.dueDate||void 0,done:!1,createdAt:e}}function rn(t,e=new Date){return t.done?{...t,done:!1,doneAt:void 0}:{...t,done:!0,doneAt:e}}function ln(t,e){return!t.done&&!!t.dueDate&&t.dueDate<e}function cn(t){return[...t].sort((e,n)=>{if(e.done!==n.done)return e.done?1:-1;if(!e.done&&!n.done){if(e.priority!==n.priority)return e.priority-n.priority;if(e.dueDate||n.dueDate){if(!e.dueDate)return 1;if(!n.dueDate)return-1;if(e.dueDate!==n.dueDate)return e.dueDate<n.dueDate?-1:1}return n.createdAt.getTime()-e.createdAt.getTime()}return(n.doneAt?.getTime()||0)-(e.doneAt?.getTime()||0)})}function Ht(t,e,n){let i=0,o=0;for(const a of t){const r=a.date instanceof Date?a.date:new Date(a.date);r.getFullYear()===e&&r.getMonth()===n&&(i+=a.amount||0,o++)}return{amount:i,count:o}}function dn(t,e){const n=e.now||new Date,i=n.getFullYear(),o=n.getMonth(),a=Ht(t.investments||[],i,o),r=new Date(i,o-1,1),l=Ht(t.investments||[],r.getFullYear(),r.getMonth()),d=e.sensitive&&(t.monthlyBudget??0)>0,c=!e.sensitive&&(t.monthlyCountBudget??0)>0,u=d?t.monthlyBudget:c?t.monthlyCountBudget:null,p=d?"amount":"count",v=p==="amount"?a.amount:a.count,m=p==="amount"?l.amount:l.count,f=n.getDate();return{mode:p,budget:u,spent:v,remaining:u===null?null:u-v,ratio:u===null?null:v/u,overrun:u!==null&&v>u,dailyAvg:f>0?v/f:0,lastMonth:m,deltaPct:m>0?(v-m)/m:null}}const j={education:{name:"教育",icon:"🎓",color:"#ff8a4c"},skill:{name:"技能",icon:"📚",color:"#f5a623"},health:{name:"健康",icon:"💪",color:"#3fa06a"},network:{name:"人脉",icon:"🤝",color:"#3e9b8f"},entertainment:{name:"娱乐",icon:"🎮",color:"#e0705b"},other:{name:"其他",icon:"📦",color:"#a79b8c"}};function un(t,e,n){const i=new Map((t.customTypes||[]).map(d=>[d.id,d])),o=new Map,a=(d,c)=>{const u=o.get(d)||{amount:0,count:0};u.amount+=c.amount||0,u.count+=1,o.set(d,u)};for(const d of t.investments||[]){const c=d.date instanceof Date?d.date:new Date(d.date);c.getFullYear()!==e||c.getMonth()!==n||(d.customType&&i.has(d.customType)?a(`custom:${d.customType}`,d):a(d.type,d))}const r=Array.from(o.values()).reduce((d,c)=>d+c.amount,0),l=[];for(const[d,c]of o)if(d.startsWith("custom:")){const u=i.get(d.slice(7));l.push({key:d,name:u.name,icon:u.icon,color:u.color,amount:c.amount,count:c.count,ratio:r>0?c.amount/r:0,custom:!0})}else{const u=j[d];l.push({key:d,name:u.name,icon:u.icon,color:u.color,amount:c.amount,count:c.count,ratio:r>0?c.amount/r:0,custom:!1})}return l.sort((d,c)=>c.amount-d.amount)}function pn(t,e=6,n=new Date){const i=[];for(let o=e-1;o>=0;o--){const a=new Date(n.getFullYear(),n.getMonth()-o,1),r=a.getFullYear(),l=a.getMonth();let d=0,c=0;for(const u of t.investments||[]){const p=u.date instanceof Date?u.date:new Date(u.date);p.getFullYear()===r&&p.getMonth()===l&&(d+=u.amount||0,c++)}i.push({key:`${r}-${l+1}`,label:`${l+1}月`,amount:d,count:c})}return i}let vt=0;function mn(){return vt=(vt+1)%1e6,`e_${Date.now().toString(36)}_${vt}${Math.random().toString(36).slice(2,6)}`}function Xt(t,e){const n=e.title.trim();if(!n)throw new Error("事件标题不能为空");const i={id:mn(),date:e.date||new Date,icon:e.icon||"🌟",title:n,desc:e.desc?.trim()||void 0,kind:"manual"};return{...t,lifeEvents:[...t.lifeEvents||[],i]}}function Rt(t,e){const i=[...Xt(t,e).lifeEvents||[]];return i[i.length-1]={...i[i.length-1],kind:"streak"},{...t,lifeEvents:i}}function vn(t,e){return{...t,lifeEvents:(t.lifeEvents||[]).filter(n=>!(n.id===e&&n.kind==="manual"))}}const gn={jobloss:{icon:"💼",name:"工作变动"},illness:{icon:"🏥",name:"健康风波"},loss:{icon:"🌧️",name:"失去与告别"},stagnate:{icon:"🪫",name:"停滞期"}};function fn(t){const e=j[t.type],n=e.icon,i=t.desc||`${e.name}投入`;return{icon:n,title:i}}function hn(t){const e=[];(t.investments||[]).forEach((a,r)=>{const l=a.date instanceof Date?a.date:new Date(a.date),d=fn(a);e.push({id:`inv_${r}_${l.getTime()}`,date:l,icon:d.icon,title:a.amount>0?`${d.title} · ${a.amount.toLocaleString()} 元`:d.title,deletable:!1,source:"invest"})}),(t.journals||[]).forEach((a,r)=>{const l=a.date instanceof Date?a.date:new Date(a.date);e.push({id:`jrn_${r}_${l.getTime()}`,date:l,icon:a.mood?{great:"😄",good:"🙂",ok:"😐",low:"😔"}[a.mood]:"✨",title:a.content,deletable:!1,source:"journal"})}),(t.setbacks||[]).forEach((a,r)=>{const l=a.date instanceof Date?a.date:new Date(a.date),d=gn[a.type];e.push({id:`sb_${r}_${l.getTime()}`,date:l,icon:d.icon,title:`${d.name}（影响 ${a.severity}%）`,deletable:!1,source:"setback"})}),(t.lifeEvents||[]).forEach(a=>{const r=a.date instanceof Date?a.date:new Date(a.date);e.push({id:a.id,date:r,icon:a.icon,title:a.title,desc:a.desc,deletable:a.kind!=="streak",source:a.kind||"manual"})}),e.sort((a,r)=>r.date.getTime()-a.date.getTime());const n=new Map;for(const a of e){const r=`${a.date.getFullYear()}-${String(a.date.getMonth()+1).padStart(2,"0")}`;n.has(r)||n.set(r,[]),n.get(r).push(a)}const i=Array.from(n.entries()).sort((a,r)=>a[0]<r[0]?1:-1).map(([a,r])=>{const[l,d]=a.split("-");return{key:a,label:`${l} 年 ${Number(d)} 月`,items:r}}),o=F.filter(a=>a.condition(t)).map(a=>({icon:a.icon,name:a.name,desc:a.desc}));return{months:i,achievedMilestones:o}}function yn(t,e={}){const n={...e};let i=!1,o=!1;if(typeof n.target=="number"&&n.target>0){const a=t>=n.target;i=a&&!n.targetHit,n.targetHit=a}else n.targetHit=!1;if(typeof n.floor=="number"&&n.floor>0){const a=t<=n.floor;o=a&&!n.floorHit,n.floorHit=a}else n.floorHit=!1;return{alert:n,targetNew:i,floorNew:o}}class bn{get(e){return localStorage.getItem(e)}set(e,n){localStorage.setItem(e,n)}remove(e){localStorage.removeItem(e)}clear(){localStorage.clear()}}const N=new bn,Tt="lifeStockUser",Qt="disclaimerConfirmed",Zt="privacyConsent",yt="sensitiveConsent";function te(t){return t.investments=(t.investments||[]).map(e=>({...e,date:new Date(e.date)})),t.setbacks&&(t.setbacks=t.setbacks.map(e=>({...e,date:new Date(e.date)}))),t.journals&&(t.journals=t.journals.map(e=>({...e,date:new Date(e.date)}))),t.habits&&(t.habits=t.habits.map(e=>({...e,createdAt:new Date(e.createdAt)}))),t.todos&&(t.todos=t.todos.map(e=>({...e,createdAt:new Date(e.createdAt),doneAt:e.doneAt?new Date(e.doneAt):void 0}))),t.lifeEvents&&(t.lifeEvents=t.lifeEvents.map(e=>({...e,date:new Date(e.date)}))),t}function x(t){N.set(Tt,JSON.stringify(t))}function xn(){const t=N.get(Tt);if(!t)return null;try{const e=JSON.parse(t);return te(Vt(e,e.version))}catch{return null}}function wn(){N.remove(Tt)}function $n(){return N.get(Zt)==="1"}function kn(){N.set(Zt,"1")}function H(){return N.get(yt)==="1"}function Mn(t){t?N.set(yt,"1"):N.remove(yt)}function Sn(){N.clear()}function Dn(){return N.get(Qt)==="1"}function In(){N.set(Qt,"1")}function En(t){const e={...Te(t),exportTime:new Date().toISOString()},n=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),i=URL.createObjectURL(n),o=document.createElement("a");o.href=i,o.download=`life-index-${t.age}岁-${new Date().toISOString().slice(0,10)}.json`,o.click(),URL.revokeObjectURL(i)}function Tn(t){const e=JSON.parse(t);if(!e.age||!e.history)throw new Error("文件格式不正确");return te(Vt(e,e.version))}function Cn(){s&&En(s)}function An(t){const e=t.target.files?.[0];if(!e)return;const n=new FileReader;n.onload=i=>{try{s=Tn(i.target.result),x(s),$(),g("✅ 数据已导入")}catch{g("❌ 导入失败：文件格式不正确")}},n.readAsText(e),t.target.value=""}let s=null,J=0,at="education",I={};window.startOnboarding=zn;window.showAnchorModal=qn;window.showForecastModal=Un;window.showShareModal=Kn;window.showSetbackModal=Xn;window.showDetailModal=Zn;window.showParentModal=to;window.editProfile=eo;window.resetAll=no;window.exportData=Cn;window.importData=An;window.handleDeleteAllData=so;window.closeModal=T;window.showLegalModal=wt;const _t=[{title:"第1步：你今年多大？",desc:"年龄帮我们找到你在人生曲线上的位置",field:"age",type:"number",placeholder:"请输入年龄（1-100）"},{title:"第2步：你来自哪里？",desc:"不同城市的成长成本不太一样",field:"region",type:"select",options:[{value:"tier1",label:"一线城市（北上广深）"},{value:"new_tier1",label:"新一线城市"},{value:"tier2",label:"二线城市"},{value:"tier3",label:"三线及以下"}]},{title:"第3步：家庭条件？",desc:"家庭支持也是成长积累的一部分",field:"income",type:"select",options:[{value:"low",label:"困难"},{value:"below_avg",label:"偏低"},{value:"avg",label:"一般"},{value:"above_avg",label:"较好"},{value:"high",label:"富裕"}]},{title:"第4步：你的学历？",desc:"学历是会跟你一辈子的资产",field:"education",type:"select",options:[{value:"primary",label:"小学"},{value:"junior",label:"初中"},{value:"senior",label:"高中"},{value:"college",label:"大专"},{value:"bachelor",label:"本科"},{value:"master",label:"硕士及以上"}]},{title:"第5步：你的年收入？",desc:"收入是成长力的一部分，填税前年薪就好",field:"annualIncome",type:"number",placeholder:"请输入税前年收入（元），如 120000"},{title:"第6步：收入增长趋势？",desc:"持续增长会让成长更有动力",field:"annualIncomeGrowth",type:"select",options:[{value:"0",label:"下降"},{value:"0.05",label:"稳定"},{value:"0.1",label:"稳步增长"},{value:"0.2",label:"快速增长"}]},{title:"第7步：每周学习时长？",desc:"学习是最值得的自我投入",field:"studyHours",type:"select",options:[{value:"0",label:"几乎不学习"},{value:"2",label:"约2小时"},{value:"5",label:"约5小时"},{value:"10",label:"10小时以上"}]},{title:"第8步：健康状况？",desc:"健康是一切的底座",field:"healthScore",type:"select",options:[{value:"40",label:"较差"},{value:"60",label:"一般"},{value:"75",label:"良好"},{value:"90",label:"优秀"}]},{title:"第9步：负债情况？",desc:"适度负债没关系，留意它的影响就好",field:"debtRatio",type:"select",options:[{value:"0",label:"无负债"},{value:"0.1",label:"少量负债"},{value:"0.3",label:"中等负债"},{value:"0.6",label:"高负债"}]},{title:"第10步：人生节点（可多选）",desc:"已达成的节点都是成长的里程碑",field:"milestones",type:"multi",options:[{value:"hasJob",label:"💼 有工作"},{value:"salaryRaised",label:"💰 涨过薪"},{value:"hasLicense",label:"🚗 有驾照"},{value:"marathon",label:"🏃 跑过马拉松"},{value:"married",label:"💍 已婚"},{value:"hasHouse",label:"🏠 有房"},{value:"hasChild",label:"👶 有孩子"}]}];function ct(){return H()?_t:_t.filter(t=>t.field!=="annualIncome"&&t.field!=="debtRatio")}function zn(){J=0,I={},document.getElementById("landing")?.classList.add("hidden"),ee()}function ee(){const e=ct()[J],n=y(e.title,e.desc);let i="";e.type==="number"?i=`<input type="number" id="onboardInput" class="form-input" placeholder="${e.placeholder}" style="width:100%;padding:12px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);font-size:16px;">`:e.type==="select"?i=`<select id="onboardInput" style="width:100%;padding:12px;border-radius:10px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-primary);font-size:16px;">
      ${e.options.map(o=>`<option value="${o.value}">${o.label}</option>`).join("")}
    </select>`:e.type==="multi"&&(i=`<div id="multiOptions" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      ${e.options.map(o=>`<label style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--surface-softer);border-radius:10px;cursor:pointer;"><input type="checkbox" value="${o.value}"> ${o.label}</label>`).join("")}
    </div>`),i+=`<div class="form-actions"><button class="btn-primary" onclick="submitOnboarding()">${J===ct().length-1?"生成我的成长曲线":"下一步"}</button></div>`,n.querySelector(".modal-body").innerHTML=i}window.submitOnboarding=Ln;function Ln(){const t=ct()[J];if(t.type==="multi")Array.from(document.querySelectorAll("#multiOptions input:checked")).map(n=>n.value).forEach(n=>{I[n]=!0});else{const e=document.getElementById("onboardInput").value;t.type==="number"?I[t.field]=Number(e):I[t.field]=e}J++,J>=ct().length?Bn():ee()}function Bn(){const t=I.age;s={age:t,region:I.region,area:"urban",income:I.income,education:I.education,birthYear:new Date().getFullYear()-t,annualIncome:H()?I.annualIncome:1e5,annualIncomeGrowth:Number(I.annualIncomeGrowth??.05),studyHours:Number(I.studyHours),healthScore:Number(I.healthScore),debtRatio:H()?Number(I.debtRatio):0,hasJob:!!I.hasJob,salaryRaised:!!I.salaryRaised,hasLicense:!!I.hasLicense,marathon:!!I.marathon,married:!!I.married,hasHouse:!!I.hasHouse,hasChild:!!I.hasChild,totalInvest:0,history:Ie({age:t,region:I.region,area:"urban",income:I.income,education:I.education}),investments:[],familySupportCapital:0,subjectiveWeight:1,version:$t},x(s),T(),$(),g(H()?"✅ 成长曲线已生成！":"✅ 成长曲线已生成（敏感项使用估算值）"),setTimeout(()=>ce(!0),400)}function $(){if(!s)return;const t=s;document.getElementById("landing")?.classList.add("hidden"),document.getElementById("dashboard")?.classList.remove("hidden");const e=E(t);document.getElementById("dashPrice").textContent=Math.round(e.price).toLocaleString()+" 点";const n=document.getElementById("dashChange");n.textContent=(e.change>=0?"+":"")+e.change+"%",n.style.color=e.change>=0?"var(--accent-green)":"var(--accent-red)",document.getElementById("dashBV").textContent=Math.round(e.bv).toLocaleString()+" 点",document.getElementById("dashEPS").textContent=String(e.eps),document.getElementById("dashROE").textContent=e.roe+"%",document.getElementById("dashPE").textContent=e.pe==="—"?"—":e.pe+"倍";const i=ke(t),o=i.level==="high"?"var(--accent-green)":i.level==="medium"?"var(--accent-yellow)":"var(--accent-red)",a=Math.round(i.estimatedRatio*100),r=Math.round(i.potentialEstimatedRatio*100);document.getElementById("dashConfidence").innerHTML=`<span style="color:${o};font-weight:bold;">● ${i.label}</span> 本指数含 ${a}% 估算成分`+(i.level!=="high"?`，<a href="javascript:showAnchorModal()" style="color:var(--accent-blue);text-decoration:underline;">校准后可降至 ${r}%</a>`:"")+'<br><a href="javascript:showDetailModal()" style="color:var(--text-muted);text-decoration:underline;">查看数据来源 →</a>';const l=W(t);Gn(l,t);const d=yn(e.price,t.priceAlert||{});JSON.stringify(d.alert)!==JSON.stringify(t.priceAlert||{})&&(t.priceAlert=d.alert,x(t)),d.targetNew&&g("🎉 恭喜！成长指数突破目标位"),d.floorNew&&g("🟡 指数回到支撑位附近，正好打开「回落复盘」看看"),Vo(t);const c=document.getElementById("investAmount");c&&(H()?(c.placeholder="这笔花了多少（元，仅存本机）",c.disabled=!1):(c.placeholder="未授权金额信息，可只写描述直接添加",c.disabled=!0,c.value=""));const u=document.getElementById("investDate");u&&!u.value&&(u.value=R()),oe(t),On(t),Ct(t),ie(t),ae(t),Jo(t,e),Fo(t),qo(t),jo(t)}let tt=null,st="all",bt="";window.selectInvestKey=jn;function jn(t){s&&(t.startsWith("custom:")?tt=t.slice(7):(at=t,tt=null),oe(s))}function ne(t){if(tt){const n=(t.customTypes||[]).find(i=>i.id===tt&&!i.archived);if(n)return{key:"custom:"+n.id,label:n.name,icon:n.icon,color:n.color,type:n.baseType,customId:n.id};tt=null}const e=j[at];return{key:at,label:e.name,icon:e.icon,color:e.color,type:at}}function oe(t){const e=document.getElementById("investTypes");if(!e)return;const n=ne(t).key;e.innerHTML=K(t).map(i=>`<div class="invest-type ${n===i.key?"selected":""}" data-key="${i.key}" onclick="selectInvestKey('${i.key}')">${i.icon} ${M(i.label)}</div>`).join("")+'<div class="invest-type invest-type-add" onclick="showCustomTypeManager()">＋ 分类</div>'}window.addInvestment=Pn;function Pn(){if(!s)return;const t=s,e=document.getElementById("investAmount"),n=document.getElementById("investDesc"),i=document.getElementById("investDate"),o=H(),a=o?Number(e.value):0;if(o&&e.value&&(!a||a<0)){g("请输入有效金额，或留空仅记录事件");return}const r=ne(t),l=i&&i.value?G(i.value):new Date;t.investments.push({type:r.type,customType:r.customId,amount:a,desc:n.value.trim()||void 0,date:l}),t.totalInvest+=a,e.value="",n.value="",i&&(i.value=R()),x(t),$(),g(o&&a>0?`✅ 已记录这笔投入 ${a.toLocaleString()} 元，成长指数已更新`:"✅ 已记录这笔投入，成长指数已更新")}window.editInvest=Hn;window.deleteInvest=_n;function Hn(t){if(!s)return;const e=s,n=e.investments[t];if(!n)return;const i=H(),o=n.customType?"custom:"+n.customType:n.type,a=y("✏️ 编辑这笔投入","修改日期、分类、金额或描述，指数会按新内容重算");a.querySelector(".modal-body").innerHTML=`
    <label style="font-size:13px;font-weight:bold;">日期</label>
    <input type="date" id="editInvDate" value="${_(new Date(n.date))}" max="${R()}" style="width:100%;margin:6px 0 14px;">
    <label style="font-size:13px;font-weight:bold;">分类</label>
    <div id="editInvTypes" style="display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 14px;">
      ${K(e).map(r=>`<div class="invest-type ${o===r.key?"selected":""}" onclick="document.querySelectorAll('#editInvTypes .invest-type').forEach(x=>x.classList.remove('selected'));this.classList.add('selected');this.parentNode.dataset.key='${r.key}';">${r.icon} ${M(r.label)}</div>`).join("")}
    </div>
    <label style="font-size:13px;font-weight:bold;">金额（元）${i?"":"· 未授权金额，已停用"}</label>
    <input type="number" id="editInvAmount" value="${n.amount||""}" ${i?"":"disabled"} placeholder="可留空，仅记录事件" style="width:100%;margin:6px 0 14px;">
    <label style="font-size:13px;font-weight:bold;">描述</label>
    <input type="text" id="editInvDesc" value="${M(n.desc||"")}" placeholder="可选" style="width:100%;margin:6px 0 14px;">
    <div class="form-actions" style="justify-content:space-between;">
      <button class="dash-btn danger" onclick="deleteInvest(${t})">🗑 删除这笔</button>
      <button class="btn-primary" onclick="saveInvestEdit(${t})">保存</button>
    </div>`,document.getElementById("editInvTypes").dataset.key=o}window.saveInvestEdit=Rn;function Rn(t){if(!s)return;const e=s,n=e.investments[t];if(!n)return;const i=document.getElementById("editInvTypes").dataset.key||n.type,o=K(e).find(d=>d.key===i),a=document.getElementById("editInvDate").value,r=H()?Number(document.getElementById("editInvAmount").value)||0:n.amount,l=document.getElementById("editInvDesc").value.trim();n.date=a?G(a):n.date,n.type=o?o.type:n.type,n.customType=o?.customId,n.amount=r,n.desc=l||void 0,e.totalInvest=e.investments.reduce((d,c)=>d+(c.amount||0),0),x(e),T(),$(),g("✅ 已保存修改")}function _n(t){if(!s)return;const e=s,n=e.investments[t];n&&confirm(`确定删除这笔「${n.desc||re(e,n).name}」记录吗？`)&&(e.investments.splice(t,1),e.totalInvest=e.investments.reduce((i,o)=>i+(o.amount||0),0),x(e),T(),$(),g("已删除"))}window.setInvestFilter=Nn;function Nn(t){st=t,s&&Ct(s)}window.setInvestKeyword=Fn;function Fn(t){bt=t.trim(),s&&Ct(s)}function On(t){const e=F.filter(i=>i.condition(t));document.getElementById("milestoneCount").textContent=`(${e.length}/${F.length})`;const n=document.getElementById("milestoneList");n.innerHTML=F.map(i=>{const o=i.condition(t);return`<div class="milestone-item ${o?"done":""}" style="opacity:${o?1:.5};">
      <span class="m-icon">${i.icon}</span>
      <span class="m-name">${i.name} <span style="font-size:11px;color:var(--text-muted);">${i.desc}</span></span>
      <span class="m-bonus">${o?"✓ +"+i.bonus:"+"+i.bonus}</span>
    </div>`}).join("")}function Ct(t){const e=document.getElementById("investFilterBar");if(e){const o=[{key:"all",label:"全部"},...K(t)];e.innerHTML=o.map(a=>{const r=("label"in a,a.label),l=a.key;return`<span class="filter-chip ${st===l?"active":""}" onclick="setInvestFilter('${l}')">${r}</span>`}).join("")}const n=document.getElementById("investList");if(t.investments.length===0){n.innerHTML='<div style="text-align:center;color:var(--text-secondary);padding:30px;">还没有投入记录，记一笔试试吧</div>';return}const i=t.investments.map((o,a)=>({inv:o,idx:a,disp:re(t,o)})).filter(({inv:o,disp:a})=>!(st!=="all"&&(o.customType?"custom:"+o.customType:o.type)!==st||bt&&!`${o.desc||""}${a.name}`.toLowerCase().includes(bt.toLowerCase()))).reverse();if(i.length===0){n.innerHTML='<div style="text-align:center;color:var(--text-muted);padding:24px;">没有符合条件的记录</div>';return}n.innerHTML=i.map(({inv:o,idx:a,disp:r})=>`
    <div class="invest-item">
      <span class="i-type" style="${o.customType?`background:${r.color}22;`:""}">${r.icon}</span>
      <div class="i-info">
        <div>${M(o.desc||r.name)} <span style="font-size:10px;color:${r.color};font-weight:bold;">${M(r.name)}</span> ${o.impact?'<span class="i-impact">⭐ 影响大</span>':""}</div>
        <div style="font-size:11px;color:var(--text-muted);">${new Date(o.date).toLocaleDateString("zh-CN")}</div>
      </div>
      <span class="i-amount">${o.amount>0?o.amount.toLocaleString()+" 元":"事件"}</span>
      <span class="i-actions">
        <span class="i-edit" title="编辑" onclick="editInvest(${a})">✏️</span>
      </span>
    </div>
  `).join("")}function Gn(t,e){const n=document.getElementById("klineCanvas");if(!n||t.length<2)return;const i=n.getBoundingClientRect();n.width=i.width*2,n.height=i.height*2;const o=n.getContext("2d");o.scale(2,2);const a=i.width,r=i.height,l={l:50,r:55,t:20,b:40},d=a-l.l-l.r,c=50,u=r-l.t-l.b-c-10,p=l.t+u+10,v=t.map(k=>k.price),m=Math.min(...v)*.95,f=Math.max(...v)*1.05,h=f-m||1,z=Math.max(...t.map(k=>k.invest),1),D=Yt(e),B=l.t+u*(1-(D-m)/h),C=t.map((k,S)=>{const L=Math.max(0,S-4);return t.slice(L,S+1).reduce((A,it)=>A+it.price,0)/(S-L+1)});o.clearRect(0,0,a,r),o.strokeStyle="rgba(120,95,60,0.12)";for(let k=0;k<=4;k++){const S=l.t+u/4*k;o.beginPath(),o.moveTo(l.l,S),o.lineTo(a-l.r,S),o.stroke(),o.fillStyle="rgba(163,150,132,0.95)",o.font="11px sans-serif",o.fillText(String(Math.round(f-h/4*k)),5,S+4)}const b=d/(t.length-1);B>=l.t&&B<=l.t+u&&(o.strokeStyle="rgba(224,153,47,0.55)",o.lineWidth=1.2,o.setLineDash([6,4]),o.beginPath(),o.moveTo(l.l,B),o.lineTo(a-l.r,B),o.stroke(),o.setLineDash([]),o.fillStyle="#c9871f",o.font="bold 10px sans-serif",o.fillText("同龄人 "+Math.round(D)+" 点",a-l.r+3,B+3));const P=e.priceAlert,Lt=(k,S,L)=>{if(!k||k<m||k>f)return;const A=l.t+u*(1-(k-m)/h);o.strokeStyle=S,o.lineWidth=1.4,o.setLineDash([8,4]),o.beginPath(),o.moveTo(l.l,A),o.lineTo(a-l.r,A),o.stroke(),o.setLineDash([]),o.fillStyle=S,o.font="bold 10px sans-serif",o.fillText(`${L} ${k} 点`,l.l+4,A-4)};Lt(P?.target,"#3fa06a","🎯 目标"),Lt(P?.floor,"#e05c4b","🟡 支撑");const ut=o.createLinearGradient(0,l.t,0,l.t+u);ut.addColorStop(0,"rgba(255,138,76,0.3)"),ut.addColorStop(1,"rgba(255,138,76,0)"),o.beginPath(),o.moveTo(l.l,l.t+u),t.forEach((k,S)=>{const L=l.l+b*S,A=l.t+u*(1-(k.price-m)/h);o.lineTo(L,A)}),o.lineTo(l.l+d,l.t+u),o.closePath(),o.fillStyle=ut,o.fill(),o.beginPath(),C.forEach((k,S)=>{const L=l.l+b*S,A=l.t+u*(1-(k-m)/h);S===0?o.moveTo(L,A):o.lineTo(L,A)}),o.strokeStyle="rgba(62,155,143,0.7)",o.lineWidth=1.5,o.setLineDash([4,3]),o.stroke(),o.setLineDash([]),o.beginPath(),t.forEach((k,S)=>{const L=l.l+b*S,A=l.t+u*(1-(k.price-m)/h);S===0?o.moveTo(L,A):o.lineTo(L,A)}),o.strokeStyle="#ff8a4c",o.lineWidth=2.5,o.stroke();const ue=[0,6,15,18,22,30];t.forEach((k,S)=>{if(ue.includes(k.age)){const L=l.l+b*S,A=l.t+u*(1-(k.price-m)/h);o.beginPath(),o.arc(L,A,5,0,Math.PI*2),o.fillStyle="#3fa06a",o.fill(),o.strokeStyle="#ffffff",o.lineWidth=2,o.stroke()}});const Y=t[t.length-1],Bt=l.t+u*(1-(Y.price-m)/h);o.fillStyle=Y.price>=D?"#3fa06a":"#e05c4b",o.fillRect(a-l.r,Bt-9,50,18),o.fillStyle="#fff",o.font="bold 11px sans-serif",o.textAlign="center",o.fillText(Math.round(Y.price)+" 点",a-l.r+25,Bt+4),o.textAlign="left",t.forEach((k,S)=>{const L=l.l+b*S,A=k.invest/z*c,it=Math.max(1,b*.5);o.fillStyle=Y.price>=v[0]?"rgba(63,160,106,0.5)":"rgba(224,92,75,0.5)",o.fillRect(L-it/2,p+c-A,it,A)});const pe=Math.max(1,Math.floor(t.length/8));o.fillStyle="rgba(163,150,132,0.95)",o.font="11px sans-serif",t.forEach((k,S)=>{(S%pe===0||S===t.length-1)&&o.fillText(k.age+"岁",l.l+b*S-10,r-l.b+20)}),o.font="10px sans-serif",o.fillStyle="#ff8a4c",o.fillRect(l.l+5,l.t+4,12,3),o.fillStyle="#6f6558",o.fillText("指数",l.l+21,l.t+8),o.fillStyle="#3e9b8f",o.fillRect(l.l+50,l.t+4,12,3),o.fillStyle="#6f6558",o.fillText("MA5",l.l+66,l.t+8),o.fillStyle="#e0992f",o.fillRect(l.l+105,l.t+4,12,3),o.fillStyle="#6f6558",o.fillText("同龄人",l.l+121,l.t+8),document.getElementById("klineAge").textContent=`（${Y.age}岁，当前 ${Math.round(Y.price)} 点）`}function y(t,e){const n=document.getElementById("modalContainer");return n.innerHTML=`<div class="modal-overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal" style="position:relative;">
      <button class="modal-close" onclick="closeModal()">×</button>
      <h2>${t}</h2>
      <p class="modal-desc">${e}</p>
      <div class="modal-body"></div>
    </div>
  </div>`,n.querySelector(".modal")}function T(){document.getElementById("modalContainer").innerHTML=""}function g(t){const e=document.createElement("div");e.className="toast",e.textContent=t,document.getElementById("toastContainer").appendChild(e),setTimeout(()=>e.remove(),2500)}function qn(){if(!s)return;const t=y("🎯 校准指数","用真实数据修正估算，提升指数置信度");t.querySelector(".modal-body").innerHTML=`
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
        ${s.investments.length===0?'<div style="font-size:12px;color:var(--text-muted);">暂无手动记录的投入。先去「记一笔」添加吧。</div>':s.investments.map((e,n)=>`
            <label style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--surface-softer);border-radius:8px;margin-bottom:6px;cursor:pointer;">
              <input type="checkbox" id="impact_${n}" ${e.impact?"checked":""}>
              <span style="font-size:13px;">${e.desc||e.type} · ${e.amount.toLocaleString()} 元</span>
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
  `}window.applySubjective=Wn;function Wn(){if(!s)return;const t=Number(document.getElementById("subjectiveRange").value);s.subjectiveWeight=$e(t),x(s),$(),g("✅ 主观权重已设为 "+s.subjectiveWeight),T()}window.applyFamilyCapital=Yn;function Yn(){if(!s)return;const t=Number(document.getElementById("familyCapital").value);s.familySupportCapital=Math.max(0,t),x(s),$(),g("✅ 家庭支持已更新"),T()}window.applyImpact=Vn;function Vn(){s&&(s.investments=s.investments.map((t,e)=>{const n=document.getElementById("impact_"+e);return{...t,impact:n?.checked||!1}}),x(s),g("✅ 标记已保存"),T())}window.applyAnchor=Jn;function Jn(){if(!s)return;const t=Number(document.getElementById("anchorAge").value),e=Number(document.getElementById("anchorAmount").value),n=s.history.findIndex(i=>i.age===t);if(n>=0){const i=e/s.history[n].invest;s.history=s.history.map(o=>({...o,invest:o.invest*i})),x(s),$(),g("✅ 校准成功！系数 "+i.toFixed(2))}T()}function Un(){if(!s)return;const e=E(s).price,n=Array.from({length:50},()=>{let o=e;for(let a=0;a<10;a++){const r=.12+(Math.random()-.5)*.3;o*=1+r}return o}).sort((o,a)=>o-a),i=y("🔮 未来展望","基于假设参数的模拟推演，非预测承诺");i.querySelector(".modal-body").innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
      <div style="padding:12px;background:rgba(224,92,75,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">保守 (P10)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-red);">${Math.round(n[5])} 点</div></div>
      <div style="padding:12px;background:rgba(255,138,76,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">中性 (P50)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-blue);">${Math.round(n[25])} 点</div></div>
      <div style="padding:12px;background:rgba(63,160,106,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">乐观 (P90)</div><div style="font-size:20px;font-weight:bold;color:var(--accent-green);">${Math.round(n[45])} 点</div></div>
    </div>
    <p style="color:var(--text-muted);font-size:12px;">假设：年化成长12%，波动率15%，持续学习</p>
  `}function Kn(){if(!s)return;const t=s,e=E(t),n=e.roe>=15?"优秀":e.roe>=8?"良好":e.roe>=3?"一般":"待提升",i=F.filter(c=>c.condition(t)).length,o=e.effectiveHealth,a=o>=80?"优秀":o>=60?"良好":o>=40?"一般":"需关注",r=t.studyHours,l=r>=8?"勤奋":r>=3?"稳定":r>=1?"一般":"较少",d=y("📤 分享","生成专属指数卡片");d.querySelector(".modal-body").innerHTML=`
    <div style="background:linear-gradient(135deg,#ffb36b,#ff8a4c 60%,#f2702e);padding:24px;border-radius:16px;text-align:center;color:#fff;box-shadow:0 12px 32px rgba(255,138,76,0.28);">
      <div style="font-size:26px;margin-bottom:4px;">${t.avatar||"🌱"}</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.95);font-weight:bold;margin-bottom:2px;">${t.nickname?M(t.nickname)+" 的":""}${t.indexName?M(t.indexName):"成长指数"}</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.75);margin-bottom:10px;letter-spacing:1px;">今日宜长进 · 成长指数手账${t.signature?" · "+M(t.signature):""}</div>
      <div style="font-size:42px;font-weight:bold;color:#fff;">${Math.round(e.price)} 点</div>
      <div style="color:rgba(255,255,255,0.92);margin-bottom:16px;">${e.change>=0?"+":""}${e.change}%</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div><div style="font-size:11px;color:rgba(255,255,255,0.75)">成长效率</div><div style="font-weight:bold;color:#fff">${n}</div></div>
        <div><div style="font-size:11px;color:rgba(255,255,255,0.75)">里程碑</div><div style="font-weight:bold;color:#fff">${i}/${F.length}</div></div>
        <div><div style="font-size:11px;color:rgba(255,255,255,0.75)">健康等级</div><div style="font-weight:bold;color:#fff">${a}</div></div>
        <div><div style="font-size:11px;color:rgba(255,255,255,0.75)">学习习惯</div><div style="font-weight:bold;color:#fff">${l}</div></div>
      </div>
      <div style="margin-top:16px;font-size:11px;color:rgba(255,255,255,0.85);">成长没有标准答案，每一步都算数</div>
      <div style="margin-top:8px;font-size:10px;color:rgba(255,255,255,0.55);">数值为模型估算，仅供自我观察，不构成任何建议</div>
    </div>
  `}function Xn(){const t=y("💥 记录挫折","成长有快有慢，记下这段经历，回头看会更清楚");t.querySelector(".modal-body").innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
      ${[{t:"jobloss",i:"💼",n:"失业/降薪",d:"收入下降"},{t:"illness",i:"🏥",n:"重大疾病",d:"健康衰退"},{t:"loss",i:"📉",n:"投入回落",d:"积累暂时放缓"},{t:"stagnate",i:"😴",n:"躺平/断更",d:"停止成长"}].map(e=>`<div class="setback-type" data-type="${e.t}" onclick="selectSetback('${e.t}')" style="padding:12px;background:var(--surface-softer);border-radius:10px;cursor:pointer;text-align:center;"><div style="font-size:24px">${e.i}</div><div style="font-weight:bold;margin-top:4px">${e.n}</div><div style="font-size:11px;color:var(--text-muted)">${e.d}</div></div>`).join("")}
    </div>
    <input type="range" id="setbackSeverity" min="1" max="10" value="5" style="width:100%;">
    <div style="text-align:center;color:var(--text-secondary);margin:8px 0;">严重度：<span id="severityVal">5</span></div>
    <div class="form-actions"><button class="btn-primary" style="background:linear-gradient(135deg,#e05c4b,#c94736);" onclick="applySetback()">确认记录</button></div>
  `,document.getElementById("setbackSeverity").oninput=e=>{document.getElementById("severityVal").textContent=e.target.value}}let V="";window.selectSetback=t=>{V=t};window.applySetback=Qn;function Qn(){if(!s||!V)return;const t=Number(document.getElementById("setbackSeverity").value)/10,e=E(s).price;if(V==="jobloss")s.annualIncome=Math.max(0,s.annualIncome*(1-.3*t)),s.annualIncomeGrowth=-.1;else if(V==="illness")s.healthScore=Math.max(20,s.healthScore-30*t),s.debtRatio=Math.min(.8,s.debtRatio+.2*t);else if(V==="loss"){const i=s.totalInvest*.15*t;s.totalInvest=Math.max(0,s.totalInvest-i),s.history=s.history.map(o=>({...o,invest:o.invest*(1-.15*t)}))}else V==="stagnate"&&(s.studyHours=Math.max(0,s.studyHours-2*t));x(s);const n=E(s).price;T(),g(`指数 ${e.toFixed(1)} → ${n.toFixed(1)}`),$()}function Zn(){if(!s)return;const t=s,e=E(t),n=kt(t.age),i=F.filter(c=>c.condition(t)),o={};t.history.forEach(c=>{const u=w.TYPE_WEIGHTS[c.type]||1,p=c.invest/1e4*u*gt(1,Math.max(0,t.age-c.age),c.type);o[c.type]=(o[c.type]||0)+p});const a={education:"教育",skill:"技能",health:"健康",network:"人脉",entertainment:"娱乐",other:"其他"},r=be.education_cost,l=Object.keys(w.AGE_SPEND_RANGE),d=y("📋 计算明细","看清每一个数字的来龙去脉");d.querySelector(".modal-body").innerHTML=`
    <div style="font-family:monospace;font-size:13px;line-height:2;">
      <div style="padding:12px;background:rgba(255,138,76,0.1);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;color:var(--accent-blue);margin-bottom:8px;">📐 计算公式</div>
        <div style="color:var(--text-secondary)">成长指数 = (100 + 累计成长值 × 阶段系数 + min(里程碑加成,200)) × 成长系数 × 质量系数 × (1 - 风险折扣) × 主观调整</div>
      </div>
      <div style="padding:12px;background:var(--surface-softer);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;margin-bottom:8px;">② 累计成长值 = ${e.bv.toFixed(2)}（单位：万元口径）</div>
        ${Object.entries(o).map(([c,u])=>`<div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary)">${a[c]||c}</span><span>${u.toFixed(2)}</span></div>`).join("")}
        ${t.familySupportCapital?`<div style="display:flex;justify-content:space-between;color:var(--accent-purple);"><span>家庭支持（不折旧）</span><span>${t.familySupportCapital}</span></div>`:""}
        <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px;font-weight:bold;">成长值 × 阶段系数 = ${e.bv.toFixed(2)} × ${n.toFixed(2)} = ${(e.bv*n).toFixed(2)}</div>
      </div>

      <!-- A1：数据溯源卡片 -->
      <div style="padding:12px;background:rgba(224,153,47,0.06);border:1px solid rgba(224,153,47,0.2);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;color:var(--accent-yellow);margin-bottom:8px;">🔍 历史投入估算 · 数据溯源</div>
        <div style="font-size:12px;color:var(--text-secondary);line-height:1.8;">
          <div><strong>数据来源：</strong>${r.name}（${r.year}）</div>
          <div><strong>原始口径：</strong>${r.caliber}</div>
          <div><strong>调整系数：</strong>地区 ${w.REGION_COEF[t.region]} × 城乡 ${w.AREA_COEF[t.area]} × 收入 ${w.INCOME_COEF[t.income]}</div>
        </div>
        <!-- A2：参考区间，替代"±4%精度" -->
        <div style="margin-top:10px;padding:10px;background:var(--surface-softer);border-radius:8px;">
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">📊 各阶段年均教育投入参考区间（元）：</div>
          ${l.map(c=>{const u=w.AGE_SPEND_RANGE[c];return`<div style="display:flex;justify-content:space-between;font-size:12px;"><span style="color:var(--text-secondary)">${c}岁</span><span>${u.low.toLocaleString()} ~ ${u.mid.toLocaleString()} ~ ${u.high.toLocaleString()}</span></div>`}).join("")}
          <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">以上为统计估算区间，非精确值。点击「校准指数」可修正为你的真实投入。</div>
        </div>
      </div>

      <div style="padding:12px;background:var(--surface-softer);border-radius:10px;margin-bottom:12px;">
        <div style="font-weight:bold;margin-bottom:8px;">③ 里程碑加成 = ${e.milestoneBonus}（封顶 200）</div>
        ${i.map(c=>`<div style="font-size:12px;color:var(--text-secondary)">${c.icon} ${c.name} +${c.bonus}</div>`).join("")}
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
        ${(()=>{const c=Ce(t,e),u=Ae(c);return c.map(p=>{const v=p.contribution===0;return`<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid var(--surface-soft);">
              <span style="color:var(--text-secondary);font-size:12px;">${p.name}</span>
              <span style="font-size:12px;">${v?p.reason:`<strong>+${p.contribution}</strong> · ${p.reason}`}</span>
            </div>`}).join("")+(u?`<div style="margin-top:8px;padding:8px;background:rgba(63,160,106,0.08);border-radius:8px;font-size:12px;color:var(--accent-green);">⭐ 最大贡献：${u.name}（+${u.contribution}点）</div>`:"")})()}
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
  `}function to(){if(!s)return;const t=s.history.reduce((a,r)=>a+r.invest,0),e=s.investments.reduce((a,r)=>a+r.amount,0),n=t+e,i=E(s),o=y("👨‍👩‍👧 家庭视角","家人的每一份支持，都是你成长的底气");o.querySelector(".modal-body").innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
      <div style="padding:14px;background:rgba(62,155,143,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">家庭支持</div><div style="font-size:20px;font-weight:bold;color:var(--accent-purple);">${t.toLocaleString()} 元</div></div>
      <div style="padding:14px;background:rgba(251,146,60,0.1);border-radius:10px;text-align:center;"><div style="font-size:12px;color:var(--text-muted)">自我投入</div><div style="font-size:20px;font-weight:bold;color:#ff8a4c;">${e.toLocaleString()} 元</div></div>
    </div>
    <div style="height:20px;background:var(--surface-soft);border-radius:10px;overflow:hidden;display:flex;">
      <div style="width:${t/n*100}%;background:var(--accent-purple);"></div>
      <div style="width:${e/n*100}%;background:#ff8a4c;"></div>
    </div>
    <div style="margin-top:16px;padding:14px;background:rgba(63,160,106,0.1);border-radius:12px;font-size:13px;color:var(--text-secondary);line-height:1.7;">
      💡 当前 ${s.age} 岁，成长指数已从基准 100 走到 ${Math.round(i.price)} 点。<br>
      ${e===0?'⚠️ 还没有记录自我投入，试试"记一笔"吧！':"继续加油，每一笔自我投入都在为成长添砖加瓦。"}
    </div>
  `}function eo(){g("请重置后重新填写问卷（投入记录会保留）")}function no(){confirm("确定要重置所有数据吗？")&&(wn(),s=null,document.getElementById("dashboard")?.classList.add("hidden"),document.getElementById("landing")?.classList.remove("hidden"))}const xt="2026-06-01",oo=`
  <div style="font-size:13px;color:var(--text-secondary);line-height:1.9;text-align:left;">
    <p style="color:var(--text-muted);">生效日期：${xt}。最近更新：${xt}。</p>
    <p><strong>一、我们是谁</strong><br>「今日宜长进」（成长指数手账）是一款个人成长记录与自我反思工具，本应用没有后端服务器。</p>
    <p><strong>二、我们收集的信息</strong><br>1. <strong>基础成长信息</strong>：年龄、所在地区、家庭条件区间、学历、学习时长、健康自评、人生节点等，用于生成成长曲线。<br>
    2. <strong>敏感信息（需你单独勾选同意）</strong>：年收入、收入增长、负债情况、家庭支持金额、每笔花费的具体金额。这些信息属于敏感个人信息，仅在你单独勾选「同意收集敏感信息」后才会被记录。</p>
    <p><strong>三、信息存储与使用</strong><br>所有信息默认仅保存在你当前设备的浏览器本地存储（localStorage）中，<strong>不会上传到任何服务器</strong>，本应用不提供账号体系与云端同步。信息仅用于在你本机计算成长指数、绘制成长曲线与生成本地周报。</p>
    <p><strong>四、拒绝授权的影响</strong><br>你可以拒绝提供敏感信息，应用仍可正常使用：收入、负债与金额类字段将使用通用估算值（估算占比会在页面如实标注），你也可以随时改主意并在重新进入时补充真实信息。</p>
    <p><strong>五、未成年人</strong><br>若你未满 14 周岁，请在监护人陪同与同意后使用本应用并填写信息。</p>
    <p><strong>六、如何删除信息</strong><br>你可在「设置」中使用「删除全部数据」一键清除本机所有数据；也可以直接清除浏览器站点数据。删除后数据无法恢复。</p>
    <p><strong>七、联系我们</strong><br>如对本政策有疑问，可通过应用仓库的 Issue 渠道反馈。</p>
  </div>`,io=`
  <div style="font-size:13px;color:var(--text-secondary);line-height:1.9;text-align:left;">
    <p style="color:var(--text-muted);">生效日期：${xt}。</p>
    <p><strong>一、服务性质</strong><br>「今日宜长进」是个人成长记录与自我反思工具，<strong>不是</strong>金融理财、证券投资、职业咨询、医疗健康或心理咨询服务。成长指数（单位：点）为模型估算数值，仅供娱乐与自我观察。</p>
    <p><strong>二、不构成专业建议</strong><br>应用内的指数、曲线、周报、伙伴对话等内容均由本地规则/模板基于你填写的信息生成，不构成任何理财、证券、职业规划、医疗或心理建议，<strong>不得用于任何投资决策</strong>，也不预测你的未来收入。模型存在误差，页面会标注估算成分与置信度。</p>
    <p><strong>三、情绪与健康提示</strong><br>应用内容不能替代专业心理咨询或医疗诊断。如果你正经历严重的情绪困扰，请及时联系专业人士或拨打心理援助热线（如全国心理援助热线 12356）。</p>
    <p><strong>四、你的内容与数据</strong><br>你填写的所有内容均保存在你的设备本地，由你自行负责保管与备份。导出、分享或在公共设备使用后，请自行删除数据。</p>
    <p><strong>五、合理使用</strong><br>请勿利用本应用从事违法违规活动，或以本应用输出冒充专业意见对外传播。</p>
    <p><strong>六、免责与争议</strong><br>在法律允许的最大范围内，我们不对你因使用或无法使用本应用而产生的间接损失承担责任。与本协议相关的争议，双方应友好协商解决；协商不成的，适用中华人民共和国法律。</p>
  </div>`;function wt(t){const e=t==="privacy",n=y(e?"🔒 隐私政策":"📜 用户协议",e?"请仔细阅读，重点内容已加粗":"使用本应用前请知悉");n.style.maxWidth="560px",n.querySelector(".modal-body").innerHTML=e?oo:io;const i=n.parentElement;i&&(i.style.zIndex="10001")}function ao(){if(!$n()){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`<div class="modal" style="max-width:500px;">
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
    </div>`,document.body.appendChild(t),t.querySelector("#linkPrivacy1").onclick=()=>wt("privacy"),t.querySelector("#linkTerms1").onclick=()=>wt("terms");const e=t.querySelector("#consentPrivacy");e.onclick=()=>{if(!t.querySelector("#consentBase").checked){g("请先勾选并同意《隐私政策》与《用户协议》");return}kn(),Mn(t.querySelector("#consentSensitive").checked),t.remove(),Nt()};return}Nt()}function Nt(){if(Dn())Ft();else{const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`<div class="modal" style="max-width:480px;">
      <h2>⚠️ 温馨提示</h2>
      <p style="color:var(--text-secondary);line-height:1.9;margin:16px 0;">
        「今日宜长进」是一款<strong>个人成长记录与自我反思工具</strong>，所有数值均为模型估算，<strong style="color:var(--accent-yellow)">仅供娱乐与自我观察，不构成理财、职业或心理建议，也不预测收入</strong>。<br><br>
        今日宜长进，成长没有标准曲线。
      </p>
      <div class="form-actions"><button class="btn-primary" id="confirmDisclaimer">我知道了</button></div>
    </div>`,document.body.appendChild(t),document.getElementById("confirmDisclaimer").onclick=()=>{In(),t.remove(),Ft()}}}function Ft(){const t=xn();t&&(s=t,$())}function so(){confirm("确定要删除全部数据吗？此操作不可恢复。")&&(Sn(),s=null,document.getElementById("dashboard")?.classList.add("hidden"),document.getElementById("landing")?.classList.remove("hidden"),g("✅ 全部数据已删除"))}let et;window.setJournalMood=ro;function ro(t){et=et===t?void 0:t,document.querySelectorAll(".mood-btn").forEach(e=>{e.classList.toggle("selected",e.getAttribute("data-mood")===et)})}window.addJournal=lo;function lo(){if(!s)return;const t=document.getElementById("journalInput"),e=t.value.trim();if(!e){g("请输入内容");return}const n=Le(e,et);s=Be(s,n),t.value="",et=void 0,document.querySelectorAll(".mood-btn").forEach(i=>i.classList.remove("selected")),x(s),ie(s),ae(s),g("✅ 已记录")}function ie(t){const e=document.getElementById("recentJournals");if(!e)return;const n=je(t,8);if(n.length===0){e.innerHTML='<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:10px;">还没有记录，写下此刻的想法吧</div>';return}const i={great:"😄",good:"🙂",ok:"😐",low:"😔"};e.innerHTML=n.map(o=>`
    <div class="journal-item">
      <span class="j-mood">${o.mood?i[o.mood]:"📝"}</span>
      <div class="j-content">
        <div>${o.content}</div>
        <div class="j-date">${new Date(o.date).toLocaleString("zh-CN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
      </div>
    </div>
  `).join("")}function ae(t){const e=Dt(t),n=document.getElementById("weeklyBadge"),i=document.getElementById("weeklyTip");n&&(n.textContent=e.streakWeeks>0?`🔥 连续 ${e.streakWeeks} 周`:""),i&&(i.textContent=e.message)}window.showDrawdownModal=co;function co(){if(!s)return;const t=E(s),e=W(s),n=Pe(e,t.price),i=He(s),o=y("📉 成长回落复盘","复盘是为了觉察，不是自责");o.querySelector(".modal-body").innerHTML=`
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
        ${n.suggestions.map(a=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${a}</div>`).join("")}
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">🤔 自问</div>
        ${i.map(a=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${a}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">回落是成长的正常阶段，不必焦虑，重在觉察与调整</div>
  `}window.showGoalModal=uo;function uo(){if(!s)return;const t=E(s),e=y("🏁 目标反推","设定目标，反推所需投入");e.querySelector(".modal-body").innerHTML=`
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
  `}window.calcGoal=po;function po(){if(!s)return;const t=Number(document.getElementById("goalTarget").value);if(!t||t<=0){g("请输入有效目标");return}const e=Re(s,t),n=document.getElementById("goalResult");n.innerHTML=`
    <div style="margin-top:20px;background:var(--surface-soft);border-radius:12px;padding:16px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
        <div class="metric"><div class="metric-label">目标成长指数</div><div class="metric-value">${e.target} 点</div></div>
        <div class="metric"><div class="metric-label">此刻成长指数</div><div class="metric-value">${e.current} 点</div></div>
        <div class="metric"><div class="metric-label">还差</div><div class="metric-value" style="color:var(--accent-blue);">${e.gap} 点</div></div>
        <div class="metric"><div class="metric-label">还需成长值（粗估）</div><div class="metric-value">约 ${e.additionalInvest} 点</div></div>
      </div>
      <div style="font-size:14px;color:var(--text-secondary);line-height:1.8;">
        ${e.suggestions.map(i=>`<div>• ${i}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">${e.confidence}</div>
    </div>
  `}window.showReportModal=mo;function mo(){if(!s)return;const t=W(s),e=Ut(s,t),n=e.avgMood===null?"暂无":e.avgMood>=3.5?"😄 很好":e.avgMood>=2.5?"🙂 不错":e.avgMood>=1.5?"😐 一般":"😔 偏低",i=y("📊 月度成长报告",e.month+" 月报");i.querySelector(".modal-body").innerHTML=`
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
        ${e.highlights.length>0?e.highlights.map(o=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${o}</div>`).join(""):'<div style="font-size:13px;color:var(--text-muted);">继续积累，下个月会更好</div>'}
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">📌 下月建议</div>
        ${e.suggestions.map(o=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${o}</div>`).join("")}
      </div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:16px;text-align:center;">平均情绪：${n} · 报告仅基于你的记录生成，不代表客观评价</div>
  `}window.showRadarModal=vo;function vo(){if(!s)return;const t=dt(s),e={education:"#ff8a4c",skill:"#f5a623",health:"#3fa06a",network:"#3e9b8f",entertainment:"#e0705b",other:"#a79b8c"},n='<canvas id="radarCanvas" width="300" height="300" style="display:block;margin:0 auto;"></canvas>',i=y("🎯 投入结构雷达","看看你的成长积累分布是否均衡");i.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:16px;">${n}</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:16px;">
        ${t.dimensions.map(o=>`<div style="font-size:12px;color:var(--text-secondary);"><span style="color:${e[o.type]}">●</span> ${o.label.split(" ")[1]}: ${o.amount.toLocaleString()} 元</div>`).join("")}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
        <div class="metric"><div class="metric-label">均衡度</div><div class="metric-value">${Math.round(t.balance*100)}%</div></div>
        <div class="metric"><div class="metric-label">最突出</div><div class="metric-value">${t.dimensions.find(o=>o.type===t.dominant)?.label.split(" ")[1]}</div></div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 结构建议</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">
          ${t.balance>=.6?"投入结构较均衡，继续保持多维发展。":`${t.dimensions.find(o=>o.type===t.weakest)?.label}维度投入较少，可适当增加。`}
          健康是一切成长的底座，建议保持健康维度的持续投入。
        </div>
      </div>
  `,setTimeout(()=>go(t),50)}function go(t,e){const n=document.getElementById("radarCanvas");if(!n)return;const i=n.getContext("2d"),o=150,a=150,r=110;i.clearRect(0,0,300,300);const l=t.dimensions,d=l.length;for(let c=1;c<=4;c++){i.beginPath();for(let u=0;u<d;u++){const p=Math.PI*2*u/d-Math.PI/2,v=r*c/4,m=o+v*Math.cos(p),f=a+v*Math.sin(p);u===0?i.moveTo(m,f):i.lineTo(m,f)}i.closePath(),i.strokeStyle="rgba(120,95,60,0.16)",i.stroke()}for(let c=0;c<d;c++){const u=Math.PI*2*c/d-Math.PI/2;i.beginPath(),i.moveTo(o,a),i.lineTo(o+r*Math.cos(u),a+r*Math.sin(u)),i.strokeStyle="rgba(120,95,60,0.2)",i.stroke()}i.beginPath();for(let c=0;c<d;c++){const u=Math.PI*2*c/d-Math.PI/2,p=l[c].value/100,v=o+r*p*Math.cos(u),m=a+r*p*Math.sin(u);c===0?i.moveTo(v,m):i.lineTo(v,m)}i.closePath(),i.fillStyle="rgba(255,138,76,0.3)",i.fill(),i.strokeStyle="#ff8a4c",i.lineWidth=2,i.stroke(),i.fillStyle="#5c5246",i.font="12px sans-serif",i.textAlign="center";for(let c=0;c<d;c++){const u=Math.PI*2*c/d-Math.PI/2,p=o+(r+20)*Math.cos(u),v=a+(r+20)*Math.sin(u);i.fillText(l[c].label.split(" ")[1],p,v+4)}}window.showDepreciationModal=fo;function fo(){if(!s)return;const t=E(s),e=Math.round(s.annualIncome*.1/12),n=Ne(s,10,e),i=y("📉 折旧推演","看看你的成长积累随时间如何变化");i.querySelector(".modal-body").innerHTML=`
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
        ${n.points.map(o=>`<div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary);line-height:1.8;"><span>${o.age} 岁</span><span>成长值 ${o.bv}（自然衰减 -${o.depreciation}，新增 +${o.newInvest}）</span></div>`).join("")}
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 建议</div>
        ${n.suggestions.map(o=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${o}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">年折旧率约 ${n.annualDecayRate*100}%，仅作趋势参考</div>
  `}window.showScenarioModal=ho;function ho(){if(!s)return;const t=Fe(s),e=y("🎲 情景模拟","不同节奏下，你的指数会怎样");e.querySelector(".modal-body").innerHTML=`
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
  `}window.showFamilyModal=yo;function yo(){if(!s)return;const t=Oe(s),e=y("👨‍👩‍👧 家庭账本","记录家庭/父母的支持，看见成长背后的力量");e.querySelector(".modal-body").innerHTML=`
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
  `}window.saveFamilySupport=bo;function bo(){if(!s)return;const t=Number(document.getElementById("familySupportInput").value)||0;s.familySupportCapital=t,x(s),$(),g("✅ 家庭支持已更新"),T()}window.showAIWeeklyModal=xo;function xo(){if(!s)return;const t=Ge(s),e=y("📝 本周周报","基于你的记录由模板在本地生成，不上传数据");e.querySelector(".modal-body").innerHTML=`
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
  `}window.showAnnualModal=wo;function wo(){if(!s)return;const t=W(s),e=qe(s,t),n=e.avgMood===null?"暂无":e.avgMood>=3.5?"😄 很好":e.avgMood>=2.5?"🙂 不错":e.avgMood>=1.5?"😐 一般":"😔 偏低",i=y("🎊 年度报告",`${e.year} 年成长总结`);i.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">🎊</div>
        <div style="font-size:24px;font-weight:bold;margin-top:8px;">${e.year} 年报</div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:20px;">
        ${e.keywords.map(o=>`<span style="padding:6px 14px;border-radius:20px;background:rgba(255,138,76,0.15);font-size:13px;">${o}</span>`).join("")}
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
        ${e.nextYearPlan.map(o=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">• ${o}</div>`).join("")}
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">年报基于你的记录生成，是回顾也是鼓励，不是评价</div>
  `}window.showPeerModal=$o;function $o(){if(!s)return;const t=E(s),e=Yt(s),n=t.bv,i=n-e,o=e>0?Math.round(i/e*100):0,a=y("👥 同路人","看看相似背景的成长者们大致在哪里（匿名统计锚点）");a.querySelector(".modal-body").innerHTML=`
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
        <div style="font-size:28px;font-weight:bold;color:${i>=0?"var(--accent-green)":"var(--accent-orange)"};margin-top:6px;">${i>=0?"+":""}${o}%</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:6px;">${i>=0?"你走在多数人前面，继续保持":"还有追赶空间，但成长没有终点"}</div>
      </div>
      <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
        <div style="font-weight:600;margin-bottom:8px;">💡 关于对比</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">
          这个锚点是基于相似年龄、城市、学历的统计估算，仅作参考。每个人的成长节奏不同，<br>
          与昨天的自己比较，比与他人比较更有意义。
        </div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">锚点数据为估算值，不构成任何评价或排名</div>
  `}window.showChallengeModal=ko;function ko(){if(!s)return;const t=It(s),e=We(s),n=y("🎯 成长挑战","完成挑战，见证坚持的力量");n.querySelector(".modal-body").innerHTML=`
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:48px;">🎯</div>
        <div style="font-size:22px;font-weight:bold;margin-top:8px;">挑战完成度 ${e}%</div>
      </div>
      ${t.map(i=>`
        <div style="background:var(--surface-soft);border-radius:12px;padding:14px;margin-bottom:10px;${i.done?"border:1px solid var(--accent-green);":""}">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <span style="font-size:22px;">${i.icon}</span>
            <div style="flex:1;">
              <div style="font-weight:600;">${i.name} ${i.done?'<span style="color:var(--accent-green);">✓ 已完成</span>':""}</div>
              <div style="font-size:12px;color:var(--text-muted);">${i.desc}</div>
            </div>
            <div style="font-size:14px;font-weight:bold;color:${i.done?"var(--accent-green)":"var(--accent-blue)"};">${i.progress}/${i.target} ${i.unit}</div>
          </div>
          <div style="height:6px;background:var(--surface-strong);border-radius:3px;overflow:hidden;">
            <div style="height:100%;width:${Math.round(i.progress/i.target*100)}%;background:${i.done?"var(--accent-green)":"linear-gradient(90deg,#ffb36b,#ff8a4c)"};border-radius:3px;transition:width 0.5s;"></div>
          </div>
        </div>
      `).join("")}
      <div style="font-size:11px;color:var(--text-muted);margin-top:16px;text-align:center;">挑战数据基于你的本地记录，完成后自动更新</div>
  `}window.showMentorModal=Mo;function Mo(){if(!s)return;const t=Ye(s),e=y("🌱 成长伙伴",t.persona);e.querySelector(".modal-body").innerHTML=`
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
  `}let rt="terms";window.showMicroModal=se;function se(){if(!s)return;const e=y("📚 微课","学习成长术语，理解你的指数").querySelector(".modal-body"),n=()=>`
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${Ve.map(o=>`
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
  `,i=()=>`
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${Je.map(o=>`
        <div style="background:var(--surface-soft);border-radius:12px;padding:14px;">
          <div style="font-weight:600;margin-bottom:4px;">${o.stage} <span style="font-size:12px;color:var(--text-muted);font-weight:normal;">${o.ageRange}</span></div>
          <div style="font-size:13px;color:var(--accent-blue);margin-bottom:8px;">重心：${o.focus}</div>
          ${o.tips.map(a=>`<div style="font-size:13px;color:var(--text-secondary);line-height:1.7;">• ${a}</div>`).join("")}
        </div>
      `).join("")}
    </div>
  `;e.innerHTML=`
    <div style="display:flex;gap:8px;margin-bottom:16px;">
      <button class="btn-primary" onclick="switchMicroTab('terms')" id="tab-terms" style="flex:1;${rt==="terms"?"":"opacity:0.6;"}">📖 术语卡</button>
      <button class="btn-primary" onclick="switchMicroTab('stages')" id="tab-stages" style="flex:1;${rt==="stages"?"":"opacity:0.6;"}">🧭 阶段指南</button>
    </div>
    <div id="microContent">${rt==="terms"?n():i()}</div>
  `}window.switchMicroTab=So;function So(t){rt=t,se()}let q=0;window.showGratitudeModal=At;function At(){if(!s)return;const t=Kt(s,q),e=lt(),n=y("💌 感恩卡片","亲子连接 · 表达感谢");n.querySelector(".modal-body").innerHTML=`
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
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">第 ${q+1}/${e} 张 · 卡片内容可自由编辑后发送给家人</div>
  `}window.nextGratitude=Do;function Do(){s&&(q=(q+1)%lt(),At())}window.prevGratitude=Io;function Io(){s&&(q=(q-1+lt())%lt(),At())}window.copyGratitude=Eo;function Eo(){if(!s)return;const t=Kt(s,q),e=`${t.title}

${t.content}

${t.signature}`;navigator.clipboard.writeText(e).then(()=>{g("✅ 已复制，可粘贴发给家人")}).catch(()=>{g("复制失败，请手动选择文本")})}window.showExportReportModal=To;function To(){if(!s)return;const t=W(s),e=Et(s,t),n=y("📄 导出成长报告","生成纯文本报告，可保存或分享");n.querySelector(".modal-body").innerHTML=`
      <div style="background:var(--surface-soft);border-radius:12px;padding:16px;margin-bottom:16px;max-height:400px;overflow-y:auto;">
        <pre style="font-family:monospace;font-size:12px;line-height:1.6;white-space:pre-wrap;color:var(--text-secondary);">${e}</pre>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn-primary" onclick="copyReport()" style="flex:1;padding:12px;">📋 复制文本</button>
        <button class="btn-primary" onclick="downloadReport()" style="flex:1;padding:12px;">⬇️ 下载 .txt</button>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:12px;text-align:center;">报告内容均来自你的本地数据，不包含任何个人身份信息</div>
  `}window.copyReport=Co;function Co(){if(!s)return;const t=W(s),e=Et(s,t);navigator.clipboard.writeText(e).then(()=>g("✅ 报告已复制")).catch(()=>g("复制失败"))}window.downloadReport=Ao;function Ao(){if(!s)return;const t=W(s),e=Et(s,t),n=new Blob([e],{type:"text/plain;charset=utf-8"}),i=URL.createObjectURL(n),o=document.createElement("a");o.href=i,o.download=`成长报告_${new Date().toISOString().slice(0,10)}.txt`,o.click(),URL.revokeObjectURL(i),g("✅ 报告已下载")}function M(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function zo(t){return(t.customTypes||[]).filter(e=>!e.archived)}function K(t){const e=Object.keys(j).map(i=>({key:i,label:j[i].name,icon:j[i].icon,color:j[i].color,type:i})),n=zo(t).map(i=>({key:"custom:"+i.id,label:i.name,icon:i.icon,color:i.color,type:i.baseType,customId:i.id}));return[...e,...n]}function re(t,e){if(e.customType){const i=(t.customTypes||[]).find(o=>o.id===e.customType);if(i)return{icon:i.icon,name:i.name,color:i.color}}const n=j[e.type]||j.other;return{icon:n.icon,name:n.name,color:n.color}}window.selectChip=function(t,e,n){const i=document.getElementById(t);i.querySelectorAll(".picker-chip").forEach(o=>o.classList.remove("selected")),e.classList.add("selected"),i.dataset.value=n};function U(t,e,n,i){return`<div id="${t}" class="${i}-picker picker-row" data-value="${M(n)}">
    ${e.map(o=>{const a=o===n,r=i==="color"?`<span class="color-dot" style="background:${o}"></span>`:o;return`<span class="picker-chip ${a?"selected":""}" onclick="selectChip('${t}',this,'${o}')">${r}</span>`}).join("")}
  </div>`}const Lo=["📦","📖","🎨","🎸","💻","🌱","🧠","🙏","☕","🚶","🧩","🗼"],le=["#ff8a4c","#f5a623","#3fa06a","#3e9b8f","#e0705b","#7d8cf6","#b06fd0","#a79b8c"];window.showCustomTypeManager=nt;function nt(t){if(!s)return;const e=s,n=t?(e.customTypes||[]).find(a=>a.id===t):null,i=Object.keys(j).map(a=>`<option value="${a}" ${n?.baseType===a?"selected":""}>${j[a].icon} ${j[a].name}（计入${j[a].name}维度）</option>`).join(""),o=y("🏷️ 自定义分类","新增你自己的投入分类；它会归入一个内置维度参与指数计算");o.querySelector(".modal-body").innerHTML=`
    <div id="ctList" style="display:flex;flex-direction:column;gap:8px;margin-bottom:18px;">
      ${(e.customTypes||[]).length===0?'<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:8px;">还没有自定义分类</div>':""}
      ${(e.customTypes||[]).map(a=>`
        <div class="ct-row ${a.archived?"archived":""}">
          <span class="ct-icon" style="background:${a.color}22;color:${a.color}">${a.icon}</span>
          <span class="ct-name">${M(a.name)} <small>→ ${j[a.baseType].name}</small></span>
          <span class="ct-ops">
            ${a.archived?`<a onclick="ctRestore('${a.id}')">恢复</a> <a class="danger-link" onclick="ctDelete('${a.id}')">彻底删除</a>`:`<a onclick="showCustomTypeManager('${a.id}')">编辑</a> <a onclick="ctArchive('${a.id}')">归档</a>`}
          </span>
        </div>`).join("")}
    </div>
    <div class="sub-form" id="ctForm">
      <div style="font-weight:bold;margin-bottom:10px;">${n?"编辑分类":"新建分类"}</div>
      <input type="text" id="ctName" placeholder="分类名称，如：日语课 / 考研 / 马拉松" value="${M(n?.name||"")}" style="width:100%;margin-bottom:10px;">
      <label class="field-label">图标</label>
      ${U("ctIcon",Lo,n?.icon||"📦","emoji")}
      <label class="field-label">颜色</label>
      ${U("ctColor",le,n?.color||"#ff8a4c","color")}
      <label class="field-label">归入维度（影响权重与折旧）</label>
      <select id="ctBase" style="width:100%;margin:6px 0 14px;">${i}</select>
      <div class="form-actions">
        ${n?'<button class="dash-btn" onclick="showCustomTypeManager()">取消</button>':""}
        <button class="btn-primary" onclick="ctSave('${n?.id||""}')">${n?"保存修改":"＋ 添加分类"}</button>
      </div>
    </div>`}window.ctSave=function(t){if(!s)return;const e=document.getElementById("ctName").value.trim();if(!e){g("请填写分类名称");return}const n=document.getElementById("ctIcon").dataset.value||"📦",i=document.getElementById("ctColor").dataset.value||"#ff8a4c",o=document.getElementById("ctBase").value,a=s.customTypes||(s.customTypes=[]);if(t){const r=a.find(l=>l.id===t);r&&Object.assign(r,{name:e,icon:n,color:i,baseType:o})}else{if(a.some(r=>r.name===e&&!r.archived)){g("已有同名分类");return}a.push({id:"ct_"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:e,icon:n,color:i,baseType:o})}x(s),nt(),$(),g("✅ 分类已保存")};window.ctArchive=function(t){if(!s)return;const e=s.customTypes.find(n=>n.id===t);e&&(e.archived=!0),x(s),nt(),$()};window.ctRestore=function(t){if(!s)return;const e=s.customTypes.find(n=>n.id===t);e&&(e.archived=!1),x(s),nt(),$()};window.ctDelete=function(t){s&&confirm("彻底删除后，相关记录会回到它归入的内置分类下，确定吗？")&&(s.customTypes=(s.customTypes||[]).filter(e=>e.id!==t),s.investments.forEach(e=>{e.customType===t&&(e.customType=void 0)}),x(s),nt(),$())};const Bo=["🌱","☀️","🌙","⭐","🔥","🍀","🌻","🍊","🐱","🐰","🦊","🐻","🐼","🐨","🦁","🐯","🐸","🐵","🦉","🐳","🎈","💎","🚀","🏔️"];window.showProfileModal=ce;function ce(t=!1){if(!s)return;const e=s,n=y(t?"👋 打造你的专属名片":"👤 个性化名片",t?'给自己起个名字、选个头像，让这只"成长指数"真正属于你（可跳过）':"昵称、头像与指数名称会出现在仪表盘和分享卡上");n.querySelector(".modal-body").innerHTML=`
    <label class="field-label">头像</label>
    ${U("pAvatar",Bo,e.avatar||"🌱","emoji")}
    <label class="field-label">昵称</label>
    <input type="text" id="pNickname" maxlength="12" placeholder="怎么称呼你？" value="${M(e.nickname||"")}" style="width:100%;margin:6px 0 14px;">
    <label class="field-label">我的指数名称</label>
    <input type="text" id="pIndexName" maxlength="14" placeholder="如：阿长进指数 / 小树苗成长指数" value="${M(e.indexName||"")}" style="width:100%;margin:6px 0 14px;">
    <label class="field-label">一句话签名</label>
    <input type="text" id="pSignature" maxlength="30" placeholder="如：日拱一卒，功不唐捐" value="${M(e.signature||"")}" style="width:100%;margin:6px 0 14px;">
    <div class="form-actions" style="justify-content:space-between;">
      ${t?'<button class="dash-btn" onclick="closeModal()">稍后再说</button>':'<button class="dash-btn" onclick="showCustomTypeManager()">🏷️ 管理分类</button>'}
      <button class="btn-primary" onclick="profileSave(${t})">保存名片</button>
    </div>`}window.profileSave=function(t){s&&(s.avatar=document.getElementById("pAvatar").dataset.value||"🌱",s.nickname=document.getElementById("pNickname").value.trim()||void 0,s.indexName=document.getElementById("pIndexName").value.trim()||void 0,s.signature=document.getElementById("pSignature").value.trim()||void 0,x(s),T(),$(),g("✅ 名片已保存"))};function jo(t){const e=document.getElementById("budgetBody");if(!e)return;const n=H(),i=dn(t,{sensitive:n}),o=i.mode==="amount"?"元":"笔";if(i.budget===null){e.innerHTML=`
      <div style="font-size:12.5px;color:var(--text-secondary);line-height:1.7;margin-bottom:12px;">
        给本月的成长投入定个小目标${n?"（金额）":"（笔数）"}，让投入像记账一样有节奏。
      </div>
      <button class="btn-primary" style="width:100%;" onclick="showBudgetModal()">🎯 设置本月预算</button>`;return}const a=Math.min(100,Math.round((i.ratio||0)*100)),r=i.overrun?"var(--accent-red)":a>=80?"var(--accent-yellow)":"var(--accent-green)",l=i.deltaPct===null?"上月无记录":`${i.deltaPct>=0?"↑":"↓"} 比上月${Math.abs(Math.round(i.deltaPct*100))}%`;e.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
      <span style="font-size:22px;font-weight:bold;color:${i.overrun?"var(--accent-red)":"var(--text-primary)"}">${Math.round(i.spent).toLocaleString()} <span style="font-size:12px;font-weight:normal;">/ ${i.budget.toLocaleString()} ${o}</span></span>
      <a style="font-size:12px;cursor:pointer;" onclick="showBudgetModal()">⚙️ 调整</a>
    </div>
    <div class="budget-bar"><div class="budget-fill" style="width:${a}%;background:${r};"></div></div>
    <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--text-muted);margin-top:8px;">
      <span>${i.overrun?`已超 ${Math.round(-i.remaining).toLocaleString()} ${o}`:`还可投入 ${Math.round(i.remaining).toLocaleString()} ${o}`}</span>
      <span>日均 ${i.dailyAvg.toFixed(1)} ${o} · ${l}</span>
    </div>`}window.showBudgetModal=Po;function Po(){if(!s)return;const t=H(),e=t?s.monthlyBudget||"":s.monthlyCountBudget||"",n=y("🎯 月度预算",t?"设定每月愿意为自己投入的金额上限，仅存本机":"你尚未授权金额信息，可按每月投入笔数设定节奏");n.querySelector(".modal-body").innerHTML=`
    <input type="number" id="budgetInput" value="${e}" placeholder="${t?"如 2000（元/月）":"如 8（笔/月）"}" style="width:100%;margin-bottom:14px;">
    <div class="form-actions" style="justify-content:space-between;">
      <button class="dash-btn" onclick="budgetClear()">取消预算</button>
      <button class="btn-primary" onclick="budgetSave()">保存</button>
    </div>`}window.budgetSave=function(){if(!s)return;const t=Number(document.getElementById("budgetInput").value);if(!t||t<=0){g("请输入大于 0 的数字");return}H()?s.monthlyBudget=t:s.monthlyCountBudget=t,x(s),T(),$(),g("✅ 预算已设置")};window.budgetClear=function(){s&&(s.monthlyBudget=void 0,s.monthlyCountBudget=void 0,x(s),T(),$())};let X=new Date().getFullYear(),Q=new Date().getMonth();window.showAnalyticsModal=Ho;function Ho(t=0){if(!s)return;const e=s;if(t!==0){const c=new Date(X,Q+t,1);X=c.getFullYear(),Q=c.getMonth()}const n=H(),i=un(e,X,Q),o=pn(e,6),a=Math.max(1,...o.map(c=>c.amount)),r=i.reduce((c,u)=>c+u.amount,0),l=i.reduce((c,u)=>c+u.count,0),d=y("📈 投入分析","看看你的成长投入都花在了哪些地方");d.querySelector(".modal-body").innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <button class="dash-btn" onclick="showAnalyticsModal(-1)">‹</button>
      <strong>${X} 年 ${Q+1} 月</strong>
      <button class="dash-btn" onclick="showAnalyticsModal(1)">›</button>
    </div>
    <div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap;">
      <canvas id="donutCanvas" width="170" height="170" style="width:170px;height:170px;"></canvas>
      <div style="flex:1;min-width:180px;display:flex;flex-direction:column;gap:7px;">
        ${i.length===0?'<div style="color:var(--text-muted);font-size:13px;">本月还没有投入记录</div>':i.map(c=>`
          <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;">
            <span style="width:10px;height:10px;border-radius:3px;background:${c.color};display:inline-block;"></span>
            <span style="flex:1;">${c.icon} ${M(c.name)}</span>
            <span style="color:var(--text-muted);">${c.count}笔 · ${Math.round(c.ratio*100)}%</span>
            <span style="font-weight:bold;min-width:64px;text-align:right;">${n?c.amount.toLocaleString()+" 元":"—"}</span>
          </div>`).join("")}
      </div>
    </div>
    <div style="margin:18px 0 8px;font-size:13px;font-weight:bold;">近 6 个月趋势 ${n?"":"（金额需授权后显示）"}</div>
    <div style="display:flex;gap:10px;align-items:flex-end;height:110px;padding:0 4px;border-bottom:1px solid var(--hairline);">
      ${o.map(c=>{const u=X===new Date().getFullYear()&&Q===new Date().getMonth()&&c.label===`${new Date().getMonth()+1}月`,p=Math.max(3,Math.round(c.amount/a*90));return`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;">
          <span style="font-size:9.5px;color:var(--text-muted);">${n&&c.amount>0?c.amount>=1e4?(c.amount/1e4).toFixed(1)+"万":c.amount:c.count>0?c.count+"笔":""}</span>
          <div style="width:100%;max-width:26px;height:${p}px;border-radius:5px 5px 0 0;background:${u?"linear-gradient(180deg,#ffb36b,#ff8a4c)":"var(--surface-strong)"};"></div>
          <span style="font-size:10px;color:var(--text-muted);">${c.label}</span>
        </div>`}).join("")}
    </div>
    <div style="font-size:11.5px;color:var(--text-muted);margin-top:10px;">本月合计 ${l} 笔${n?` · ${r.toLocaleString()} 元`:""}（按记录日期统计）</div>`,requestAnimationFrame(()=>Ro(i,n?"amount":"count",n?r:l))}function Ro(t,e,n){const i=document.getElementById("donutCanvas");if(!i)return;const o=i.getContext("2d"),a=2;i.width=170*a,i.height=170*a,o.scale(a,a);const r=85,l=85,d=70,c=46;if(o.clearRect(0,0,170,170),t.length===0||n<=0){o.fillStyle="#f2e9db",o.beginPath(),o.arc(r,l,d,0,Math.PI*2),o.fill(),o.fillStyle="#a39684",o.font="12px sans-serif",o.textAlign="center",o.fillText("暂无数据",r,l+4),o.textAlign="left";return}let u=-Math.PI/2;for(const p of t){const m=(e==="amount"?p.amount:p.count)/n*Math.PI*2;o.beginPath(),o.moveTo(r,l),o.arc(r,l,d,u,u+m),o.closePath(),o.fillStyle=p.color,o.fill(),u+=m}o.beginPath(),o.arc(r,l,c,0,Math.PI*2),o.fillStyle="#ffffff",o.fill(),o.fillStyle="#3b332b",o.font="bold 18px sans-serif",o.textAlign="center",o.fillText(e==="amount"?`${Math.round(n).toLocaleString()}`:`${n} 笔`,r,l+2),o.font="10px sans-serif",o.fillStyle="#a39684",o.fillText(e==="amount"?"本月投入（元）":"本月投入",r,l+18),o.textAlign="left"}const _o=["⭐","📖","💪","🏃","🧘","🎯","💧","🌙","☀️","✍️","🎨","🎸","💻","🌱","🧠","🙏"],No=le;function Fo(t){const e=document.getElementById("habitBody");if(!e)return;const n=(t.habits||[]).filter(o=>!o.archived);if(n.length===0){e.innerHTML=`<div style="font-size:12.5px;color:var(--text-secondary);line-height:1.7;margin-bottom:10px;">像 Todo 软件一样，给自己定几个每日小习惯，打卡会自动记入成长轨迹。</div>
      <button class="btn-primary" style="width:100%;" onclick="showHabitForm()">＋ 新建第一个习惯</button>`;return}const i=R();e.innerHTML=n.map(o=>{const a=O(t,o),r=a.weekDots.map((l,d)=>{const c=new Date,u=(c.getDay()+6)%7,p=new Date(c.getFullYear(),c.getMonth(),c.getDate()-u);p.setDate(p.getDate()+d);const v=_(p)>i;return`<span class="week-dot ${l?"hit":""} ${v?"future":""}" style="${l?`background:${o.color};border-color:${o.color};`:""}" title="${_(p)}"></span>`}).join("");return`<div class="habit-row">
      <span class="habit-icon" style="background:${o.color}22;color:${o.color}">${o.icon}</span>
      <div class="habit-main">
        <div class="habit-name">${M(o.name)} <span class="habit-streak">🔥 ${a.streak}</span></div>
        <div class="habit-sub">
          <span class="week-dots">${r}</span>
          ${o.cadence==="weekly"?`<span class="habit-target">${a.weekCount}/${o.timesPerWeek} 次</span>`:`<a onclick="showHabitDetail('${o.id}')">最佳 ${a.bestStreak} 天</a>`}
        </div>
      </div>
      <button class="habit-check ${a.doneToday?"done":""}" style="${a.doneToday?`background:${o.color};border-color:${o.color};`:`color:${o.color};border-color:${o.color};`}" onclick="toggleHabit('${o.id}')">${a.doneToday?"✓":"打卡"}</button>
    </div>`}).join("")+`<div style="display:flex;gap:8px;margin-top:10px;">
      <button class="dash-btn" style="flex:1;" onclick="showHabitForm()">＋ 新习惯</button>
      <button class="dash-btn" style="flex:1;" onclick="showHabitManager()">管理</button>
    </div>`}window.toggleHabit=Oo;function Oo(t,e=R()){if(!s)return;const n=s,i=(n.habits||[]).find(d=>d.id===t);if(!i)return;const o=O(n,i).streak,a=Ze(n,t,e);let r=a.user;if(a.action==="checked"){if(e===R()&&i.investOnCheck){const c=K(n),u=i.linkedType?c.find(p=>p.key===i.linkedType):void 0;r.investments.push({date:new Date,amount:0,type:u?.type||"other",customType:u?.customId,desc:`「${i.name}」打卡`})}const d=O(r,i);o<7&&d.streak>=7?r=Rt(r,{icon:"🔥",title:`「${i.name}」连续打卡 7 天`,date:new Date}):o<30&&d.streak>=30&&(r=Rt(r,{icon:"🌟",title:`「${i.name}」连续打卡 30 天`,date:new Date}))}s=r,x(s);const l=document.querySelector("#modalContainer .modal");$(),l&&de(t),g(a.action==="checked"?`✅ 打卡成功！🔥 连续 ${O(s,i).streak} 天`:"已取消今日打卡")}window.showHabitForm=Go;function Go(t){if(!s)return;const e=s,n=t?(e.habits||[]).find(a=>a.id===t):null,i=K(e).map(a=>`<option value="${a.key}" ${n?.linkedType===a.key?"selected":""}>${a.icon} ${a.label}</option>`).join(""),o=y(n?"✏️ 编辑习惯":"＋ 新建习惯","小而稳定的习惯，是最靠谱的成长杠杆");o.querySelector(".modal-body").innerHTML=`
    <input type="text" id="hName" maxlength="16" placeholder="习惯名称，如：每天阅读 20 分钟" value="${M(n?.name||"")}" style="width:100%;margin-bottom:12px;">
    <label class="field-label">图标</label>
    ${U("hIcon",_o,n?.icon||"⭐","emoji")}
    <label class="field-label">颜色</label>
    ${U("hColor",No,n?.color||"#ff8a4c","color")}
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
      <option value="">不关联投入分类（默认）</option>${i}
    </select>
    <label style="display:flex;align-items:center;gap:8px;font-size:13px;margin-bottom:16px;cursor:pointer;">
      <input type="checkbox" id="hInvest" ${n?.investOnCheck===!1?"":"checked"}> 打卡时自动记一笔 0 元投入（让指数看到你的坚持）
    </label>
    <div class="form-actions">
      ${n?`<button class="dash-btn danger" onclick="habitDelete('`+n.id+`')">删除习惯</button>`:""}
      <button class="btn-primary" onclick="habitSave('${n?.id||""}')">${n?"保存":"创建习惯"}</button>
    </div>`}window.habitSave=function(t){if(!s)return;const e=s,n=document.getElementById("hName").value.trim();if(!n){g("请填写习惯名称");return}const i={name:n,icon:document.getElementById("hIcon").dataset.value||"⭐",color:document.getElementById("hColor").dataset.value||"#ff8a4c",cadence:document.getElementById("hCadence").value,timesPerWeek:Math.min(7,Math.max(1,Number(document.getElementById("hTimes").value)||3)),linkedType:document.getElementById("hLinked").value||void 0,investOnCheck:document.getElementById("hInvest").checked};if(t){const o=(e.habits||[]).find(a=>a.id===t);o&&Object.assign(o,i)}else{const o=Ke(i);e.habits=[...e.habits||[],o]}x(e),T(),ot(),$(),g("✅ 习惯已保存")};window.showHabitManager=ot;function ot(){if(!s)return;const t=s,e=y("🗂️ 习惯管理","归档后习惯不再出现在今日列表，记录保留"),n=(t.habits||[]).map(i=>{const o=O(t,i);return`<div class="ct-row ${i.archived?"archived":""}">
      <span class="ct-icon" style="background:${i.color}22;color:${i.color}">${i.icon}</span>
      <span class="ct-name">${M(i.name)} <small>${i.cadence==="daily"?"每天":`每周${i.timesPerWeek}次`} · 🔥${o.streak} · 最佳${o.bestStreak}</small></span>
      <span class="ct-ops">
        <a onclick="showHabitDetail('${i.id}')">热力图</a>
        <a onclick="showHabitForm('${i.id}')">编辑</a>
        ${i.archived?`<a onclick="habitRestore('${i.id}')">恢复</a>`:`<a onclick="habitArchive('${i.id}')">归档</a>`}
      </span>
    </div>`}).join("")||'<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:8px;">还没有习惯</div>';e.querySelector(".modal-body").innerHTML=`
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">${n}</div>
    <button class="btn-primary" style="width:100%;" onclick="showHabitForm()">＋ 新建习惯</button>`}window.habitArchive=function(t){if(!s)return;const e=s.habits.find(n=>n.id===t);e&&(e.archived=!0),x(s),ot(),$()};window.habitRestore=function(t){if(!s)return;const e=s.habits.find(n=>n.id===t);e&&(e.archived=!1),x(s),ot(),$()};window.habitDelete=function(t){s&&confirm("删除习惯会同时删除它的全部打卡记录，确定吗？")&&(s.habits=(s.habits||[]).filter(e=>e.id!==t),s.habitChecks=(s.habitChecks||[]).filter(e=>e.habitId!==t),x(s),T(),ot(),$())};window.showHabitDetail=de;function de(t){if(!s)return;const e=s,n=(e.habits||[]).find(d=>d.id===t);if(!n)return;const i=O(e,n),o=on(e,n,12),a=["一","二","三","四","五","六","日"],r=[];for(let d=0;d<7;d++)for(let c=0;c<12;c++){const u=o[c][d],p=u.checked?"checked":u.future?"future":"empty",v=u.checked?`background:${n.color};`:"",m=u.future?"":`onclick="toggleHabit('${n.id}','${u.date}')"`;r.push(`<span class="heat-cell ${p}" title="${u.date}${u.makeup?"（补卡）":""}" ${m} style="${v}">${u.makeup?"·":""}</span>`)}const l=y(`${n.icon} ${M(n.name)} · 打卡详情`,"点击空格可以补卡，补卡会正常计入连续天数");l.querySelector(".modal-body").innerHTML=`
    <div style="display:flex;gap:14px;margin-bottom:16px;flex-wrap:wrap;">
      <div class="habit-stat"><span>🔥</span><div><strong>${i.streak}</strong><small>当前连续</small></div></div>
      <div class="habit-stat"><span>🏅</span><div><strong>${i.bestStreak}</strong><small>最佳连续（天）</small></div></div>
      <div class="habit-stat"><span>📅</span><div><strong>${i.weekCount}${n.cadence==="weekly"?"/"+n.timesPerWeek:""}</strong><small>本周次数</small></div></div>
    </div>
    <div style="display:flex;gap:6px;align:flex-start;">
      <div style="display:flex;flex-direction:column;gap:3px;padding-top:2px;">
        ${a.map(d=>`<span style="height:22px;font-size:10px;line-height:18px;color:var(--text-muted);">${d}</span>`).join("")}
      </div>
      <div class="heatmap">${r.join("")}</div>
    </div>
    <div style="font-size:11px;color:var(--text-muted);margin-top:10px;">近 12 周 · 颜色越深代表已打卡 · 「·」为补卡</div>
    <div class="form-actions" style="margin-top:14px;">
      <button class="dash-btn" onclick="showHabitForm('${n.id}')">编辑习惯</button>
      <button class="btn-primary" onclick="closeModal()">完成</button>
    </div>`}function qo(t){const e=document.getElementById("todoBody");if(!e)return;const n=cn(t.todos||[]).slice(0,20),i=R(),o={1:{label:"高优先",color:"#e05c4b"},2:{label:"中",color:"#f5a623"},3:{label:"低",color:"#a39684"}};e.innerHTML=(n.length===0?'<div style="color:var(--text-muted);font-size:13px;margin-bottom:10px;">还没有待办，写下一件想推进的小事吧</div>':"")+n.map(a=>{const r=ln(a,i),l=o[a.priority];return`<div class="todo-row ${a.done?"done":""}" style="border-left-color:${l.color}">
        <span class="todo-check" onclick="todoToggle('${a.id}')">${a.done?"✓":""}</span>
        <div class="todo-main" onclick="todoToggle('${a.id}')">
          <div class="todo-title">${M(a.title)}</div>
          <div class="todo-meta">
            <span class="todo-pri" style="color:${l.color}">${l.label}</span>
            ${a.dueDate?`<span class="todo-due ${r?"overdue":""}">${r?"已逾期 · ":""}${a.dueDate.slice(5)} 截止</span>`:""}
            ${a.done?`<a onclick="event.stopPropagation();todoConvertInvest('${a.id}')">→ 记投入</a> <a onclick="event.stopPropagation();todoConvertJournal('${a.id}')">→ 写感悟</a>`:""}
          </div>
        </div>
        <span class="i-edit" onclick="editTodo('${a.id}')">✏️</span>
      </div>`}).join("")}window.todoAdd=function(){if(!s)return;const t=document.getElementById("todoInput").value.trim();if(!t){g("先写点什么吧");return}const e=Number(document.getElementById("todoPriority").value),n=document.getElementById("todoDue").value||void 0;s.todos=[...s.todos||[],sn({title:t,priority:e,dueDate:n})],x(s),document.getElementById("todoInput").value="",document.getElementById("todoDue").value="",$(),g("✅ 已添加")};window.todoToggle=function(t){if(!s)return;const e=(s.todos||[]).find(i=>i.id===t);if(!e)return;const n=e.done;Object.assign(e,rn(e)),x(s),$(),n||g("🎉 完成一件！可以把它转成投入或感悟")};window.editTodo=function(t){if(!s)return;const e=(s.todos||[]).find(i=>i.id===t);if(!e)return;const n=y("✏️ 编辑待办","");n.querySelector(".modal-body").innerHTML=`
    <input type="text" id="tTitle" value="${M(e.title)}" maxlength="60" style="width:100%;margin-bottom:12px;">
    <textarea id="tNote" rows="2" placeholder="备注（可选）" style="width:100%;margin-bottom:12px;">${M(e.note||"")}</textarea>
    <div style="display:flex;gap:10px;margin-bottom:12px;">
      <select id="tPriority" style="flex:1;">
        <option value="1" ${e.priority===1?"selected":""}>高优先</option>
        <option value="2" ${e.priority===2?"selected":""}>中优先</option>
        <option value="3" ${e.priority===3?"selected":""}>低优先</option>
      </select>
      <input type="date" id="tDue" value="${e.dueDate||""}" style="flex:1;">
    </div>
    <div class="form-actions" style="justify-content:space-between;">
      <button class="dash-btn danger" onclick="todoDelete('${e.id}')">删除</button>
      <button class="btn-primary" onclick="todoSave('${e.id}')">保存</button>
    </div>`};window.todoSave=function(t){if(!s)return;const e=(s.todos||[]).find(i=>i.id===t);if(!e)return;const n=document.getElementById("tTitle").value.trim();if(!n){g("标题不能为空");return}e.title=n,e.note=document.getElementById("tNote").value.trim()||void 0,e.priority=Number(document.getElementById("tPriority").value),e.dueDate=document.getElementById("tDue").value||void 0,x(s),T(),$(),g("✅ 已保存")};window.todoDelete=function(t){s&&confirm("删除这条待办？")&&(s.todos=(s.todos||[]).filter(e=>e.id!==t),x(s),T(),$())};window.todoConvertInvest=function(t){if(!s)return;const e=(s.todos||[]).find(i=>i.id===t);if(!e)return;const n=document.getElementById("investDesc");n.value=`完成：${e.title}`,T(),document.getElementById("investAmount")?.scrollIntoView({behavior:"smooth",block:"center"}),document.getElementById("investAmount")?.focus({preventScroll:!0}),g("已填入投入描述，补个金额或直接添加")};window.todoConvertJournal=function(t){if(!s)return;const e=(s.todos||[]).find(i=>i.id===t);if(!e)return;const n=document.getElementById("journalInput");n.value=`今天完成了「${e.title}」`,T(),n.scrollIntoView({behavior:"smooth",block:"center"}),n.focus()};const Wo=["🌟","🎉","🎓","💼","💍","🏠","🏆","🚀","🌈","🧭"];window.showTimelineModal=zt;function zt(){if(!s)return;const e=hn(s),n=y("📅 成长大事记","你的每一笔投入、感悟与重要时刻，都会沉淀在这里");n.querySelector(".modal-body").innerHTML=`
    <div class="sub-form" style="margin-bottom:18px;">
      <div style="font-weight:bold;margin-bottom:8px;">记录一个大事件</div>
      ${U("eIcon",Wo,"🌟","emoji")}
      <input type="text" id="eTitle" placeholder="事件标题，如：拿到心仪 offer" style="width:100%;margin:10px 0;">
      <div style="display:flex;gap:10px;">
        <input type="date" id="eDate" value="${R()}" max="${R()}" style="flex:1;">
        <button class="btn-primary" onclick="timelineAdd()">添加</button>
      </div>
      <input type="text" id="eDesc" placeholder="备注（可选）" style="width:100%;margin-top:10px;">
    </div>
    ${e.achievedMilestones.length?`<div style="margin-bottom:16px;"><div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">🏅 已达成的里程碑</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">${e.achievedMilestones.map(i=>`<span class="milestone-chip">${i.icon} ${M(i.name)}</span>`).join("")}</div></div>`:""}
    <div class="timeline">
      ${e.months.length===0?'<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:16px;">还没有大事记，去记一笔投入或写句话吧</div>':""}
      ${e.months.map(i=>`
        <div class="tl-month">
          <div class="tl-month-label">${i.label}</div>
          <div class="tl-items">
            ${i.items.map(o=>`<div class="tl-item">
              <span class="tl-dot">${o.icon}</span>
              <div class="tl-content">
                <div class="tl-title">${M(o.title)}</div>
                <div class="tl-desc">${o.date.toLocaleDateString("zh-CN")}${o.desc?" · "+M(o.desc):""}</div>
              </div>
              ${o.deletable?`<span class="i-edit" onclick="timelineDelete('${o.id}')">🗑</span>`:""}
            </div>`).join("")}
          </div>
        </div>`).join("")}
    </div>`}window.timelineAdd=function(){if(!s)return;const t=document.getElementById("eTitle").value.trim();if(!t){g("写个标题吧");return}const e=document.getElementById("eIcon").dataset.value||"🌟",n=document.getElementById("eDate").value,i=document.getElementById("eDesc").value.trim()||void 0;s=Xt(s,{title:t,icon:e,desc:i,date:n?G(n):new Date}),x(s),zt(),g("✅ 已加入大事记")};window.timelineDelete=function(t){s&&(s=vn(s,t),x(s),zt())};window.showAlertModal=Yo;function Yo(){if(!s)return;const t=s,e=Math.round(E(t).price),n=t.priceAlert||{},i=y("⚑ 指数预警线","本地计算：成长指数触及目标位或回落至支撑位时，给你一个提示");i.querySelector(".modal-body").innerHTML=`
    <div style="padding:10px 14px;background:var(--surface-softer);border-radius:10px;font-size:13px;margin-bottom:14px;">当前指数：<strong>${e} 点</strong></div>
    <label class="field-label">🎯 目标位（点）</label>
    <input type="number" id="alertTarget" value="${n.target??""}" placeholder="如 ${e+30}，留空不设" style="width:100%;margin:6px 0 14px;">
    <label class="field-label">🟡 支撑位（点）</label>
    <input type="number" id="alertFloor" value="${n.floor??""}" placeholder="如 ${Math.max(50,e-20)}，留空不设" style="width:100%;margin:6px 0 14px;">
    <div class="form-actions" style="justify-content:space-between;">
      <button class="dash-btn" onclick="alertClear()">清除预警</button>
      <button class="btn-primary" onclick="alertSave()">保存</button>
    </div>`}window.alertSave=function(){if(!s)return;const t=Number(document.getElementById("alertTarget").value),e=Number(document.getElementById("alertFloor").value),n=s.priceAlert||{};s.priceAlert={target:t>0?t:void 0,floor:e>0?e:void 0,targetHit:t>0&&t===n.target?!!n.targetHit:!1,floorHit:e>0&&e===n.floor?!!n.floorHit:!1},x(s),T(),$(),g("✅ 预警线已保存")};window.alertClear=function(){s&&(s.priceAlert=void 0,x(s),T(),$())};function Vo(t){const e=document.getElementById("alertBadge");if(!e)return;const n=t.priceAlert;if(!n){e.innerHTML="";return}const i=[];n.targetHit&&i.push(`<span class="alert-chip hit">🎉 已突破 ${n.target} 点</span>`),n.floorHit&&i.push(`<span class="alert-chip warn">🟡 在支撑位 ${n.floor} 附近</span>`),e.innerHTML=i.join(" ")}function Jo(t,e){const n=document.getElementById("todayStrip");if(!n)return;const i=new Date,o=i.getHours(),a=o<6?"夜深了":o<11?"早上好":o<14?"中午好":o<18?"下午好":"晚上好",r="周"+["日","一","二","三","四","五","六"][i.getDay()],l=(t.habits||[]).filter(m=>!m.archived),d=l.filter(m=>O(t,m).doneToday).length,c=R(),u=(t.journals||[]).some(m=>_(new Date(m.date))===c),p=l.reduce((m,f)=>Math.max(m,O(t,f).streak),0);let v;l.length>0&&d<l.length?v=`<button class="strip-cta" onclick="document.getElementById('habitCard').scrollIntoView({behavior:'smooth',block:'center'})">去打卡 →</button>`:u?v='<span class="strip-done">✨ 今天也在长进</span>':v=`<button class="strip-cta" onclick="document.getElementById('journalInput').scrollIntoView({behavior:'smooth',block:'center'});document.getElementById('journalInput').focus();">写一句 →</button>`,n.innerHTML=`
    <div class="strip-left">
      <span class="strip-avatar">${t.avatar||"🌱"}</span>
      <div>
        <div class="strip-greet">${a}，${M(t.nickname||"朋友")}</div>
        <div class="strip-sub">${i.getMonth()+1}月${i.getDate()}日 ${r}${t.indexName?` · ${M(t.indexName)}`:""}${t.signature?` · ${M(t.signature)}`:""}</div>
      </div>
    </div>
    <div class="strip-right">
      <span class="strip-chip ${l.length>0&&d===l.length?"ok":""}">✅ 习惯 ${d}/${l.length}</span>
      <span class="strip-chip ${u?"ok":""}">${u?"📝 已记录":"📝 未记录"}</span>
      ${p>0?`<span class="strip-chip fire">🔥 ${p} 天</span>`:""}
      <span class="strip-price" style="color:${e.change>=0?"var(--accent-green)":"var(--accent-red)"}">${Math.round(e.price)} 点 · ${e.change>=0?"+":""}${e.change}%</span>
      ${v}
    </div>`}ao();
