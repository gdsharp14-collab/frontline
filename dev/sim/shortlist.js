// pick the most balanced maps, keeping variety: best 2 per map family, then rank
const rows=require('./analyze.js'),fs=require('fs');
const fam=r=>r.st;
const by={};rows.forEach(r=>(by[fam(r)]=by[fam(r)]||[]).push(r));
const picks=[];
for(const rs of Object.values(by)){rs.sort((a,b)=>a.score-b.score);picks.push(...rs.slice(0,2))}
picks.sort((a,b)=>a.score-b.score);
const out=picks.map((r,i)=>({n:i+1,cfg:r.cfg,st:r.st,mode:r.mode,seed:r.seed,wins:r.w.map(x=>Math.round(100*x)),gap:Math.round(100*r.maxDev),land25:r.l25.map(x=>Math.round(100*x)),elims:+r.epg.toFixed(2),len:+r.avgLen.toFixed(1),land:r.land,lanes:r.lanes}));
fs.writeFileSync(__dirname+'/shortlist/shortlist.json',JSON.stringify(out,null,1));
out.forEach(o=>console.log(String(o.n).padStart(2),o.cfg.padEnd(32),'wins',o.wins.join('/').padEnd(9),'gap',(o.gap+'%').padEnd(4),'land@25',o.land25.join('/'),'elims/game',o.elims,'seed',o.seed));
// overall family summary
console.log('\nper family (median worst-seat gap):');
for(const [k,rs] of Object.entries(by)){const g=rs.map(r=>r.maxDev).sort((a,b)=>a-b);console.log('  ',rs[0].cfg.split(' +')[0].padEnd(16),'maps',rs.length,'median',Math.round(100*g[Math.floor(g.length/2)])+'%','best',Math.round(100*g[0])+'%','· maps within 8%:',g.filter(x=>x<=0.08).length)}
