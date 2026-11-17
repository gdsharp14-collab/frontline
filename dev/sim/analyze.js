const fs=require('fs');
const rows=[];for(const f of ['results/results-part1.jsonl','results/results-part2.jsonl'].map(f=>__dirname+'/'+f))if(fs.existsSync(f))fs.readFileSync(f,'utf8').split('\n').filter(Boolean).map(JSON.parse).forEach(r=>{if(r.games)rows.push(r)});
const NAME={classic:'Classic',continents:'Continents',archipelago:'Archipelago',mixed:'Mixed',inlandsea:'Inland Sea',sym:'Symmetric',symisles:'Symmetric Isles'};
const MODE={direct:'+ long lanes',island:'+ islands halfway'};
rows.forEach(r=>{r.w=r.wins.map(x=>x/r.games);r.maxDev=Math.max(...r.w.map(x=>Math.abs(x-1/3)));
  const tot=r.land25.reduce((a,b)=>a+b,0)||1;r.l25=r.land25.map(x=>x/tot);r.l25dev=Math.max(...r.l25.map(x=>Math.abs(x-1/3)));
  r.score=r.maxDev+0.5*r.l25dev;r.cfg=NAME[r.st]+(r.mode?' '+MODE[r.mode]:'');r.epg=r.elims/r.games;r.avgLen=r.len/r.games});
module.exports=rows;
if(require.main===module){
  console.log('maps analysed',rows.length);
  const by={};rows.forEach(r=>(by[r.cfg]=by[r.cfg]||[]).push(r));
  for(const [cfg,rs] of Object.entries(by)){rs.sort((a,b)=>a.score-b.score);const b=rs[0];
    console.log(cfg.padEnd(34),'maps',rs.length,'· best: wins',b.w.map(x=>Math.round(100*x)+'%').join('/'),'· median worst-seat gap',Math.round(100*rs[Math.floor(rs.length/2)].maxDev)+'%','· elims/game',(rs.reduce((s,r)=>s+r.epg,0)/rs.length).toFixed(2))}
}
