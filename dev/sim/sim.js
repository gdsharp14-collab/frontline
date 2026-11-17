// plays GAMES computer-v2 games on each candidate map; worker k of W handles every W-th candidate
const E=require('../engine-dev.js'),fs=require('fs');
const [k,W,GAMES,PER]=process.argv.slice(2,6).map(Number);const ONLY=process.argv[6]?process.argv[6].split(','):null;
const CONFIGS=[['classic',null],['continents',null],['continents','direct'],['continents','island'],['archipelago',null],['archipelago','direct'],['archipelago','island'],['mixed',null],['mixed','island'],['inlandsea',null],['inlandsea','island'],['sym',null],['symisles',null]];
const cands=[];CONFIGS.forEach(([st,mode],ci)=>{if(ONLY&&!ONLY.includes(st))return;for(let i=0;i<PER;i++)cands.push({st,mode,seed:7000+ci*1000+i*37})});
const out=fs.openSync(`res-${k}.jsonl`,'a');
const done=new Set();for(const f of fs.readdirSync('.').filter(n=>/^res-\d+\.jsonl$/.test(n)))fs.readFileSync(f,'utf8').split('\n').filter(Boolean).forEach(l=>{const r=JSON.parse(l);if(r.st)done.add(r.st+'|'+r.mode+'|'+r.seed)});
for(let ci=k;ci<cands.length;ci+=W){
  const c=cands[ci];if(done.has(c.st+'|'+c.mode+'|'+c.seed))continue;if(E.STYLES[c.st])E.STYLES[c.st].long=c.mode;
  const M=E.genWorld(c.seed,c.st);if(!M){fs.writeSync(out,JSON.stringify({...c,fail:1})+'\n');continue}
  const r={...c,games:0,wins:[0,0,0],elim:[0,0,0],firstOut:[0,0,0],land10:[0,0,0],land25:[0,0,0],landEnd:[0,0,0],len:0,elims:0,land:M.cells.filter(x=>x.l).length,lanes:M.lanes.length,t0:Date.now()};
  for(let gi=0;gi<GAMES;gi++){
    const G=E.newGame(M,{cpu:true});G.players.forEach(p=>{p.ai=true;p.uid='ai';p.bot='v2'});
    G.players.forEach((p,f)=>G.place[f]=E.aiPlace2(G,f));E.startPlay(G);
    let first=-1;
    while(G.phase!=='over'){
      G.players.forEach((p,f)=>{if(!p.alive)return;G.orders[f]=E.aiOrders2(G,f);G.recruits[f]=E.aiRecruits2(G,f)});
      const T=G.turn;E.resolveTurn(G);
      if(first<0){const d=G.players.findIndex(p=>!p.alive);if(d>=0)first=d}
      if(T===10)for(let f=0;f<3;f++)r.land10[f]+=E.landCount(G,f);
      if(T===25)for(let f=0;f<3;f++)r.land25[f]+=E.landCount(G,f);
    }
    r.games++;G.winners.forEach(f=>r.wins[f]+=1/G.winners.length);
    G.players.forEach((p,f)=>{if(!p.alive){r.elim[f]++;r.elims++}});if(first>=0)r.firstOut[first]++;
    for(let f=0;f<3;f++)r.landEnd[f]+=E.landCount(G,f);r.len+=G.turn-1;
  }
  r.ms=Date.now()-r.t0;delete r.t0;
  fs.writeSync(out,JSON.stringify(r)+'\n');
}
fs.writeSync(out,JSON.stringify({done:k})+'\n');
