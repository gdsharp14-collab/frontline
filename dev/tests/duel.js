// v2 in one seat against two v1 bots, rotating the seat; several map styles
const E=require('../engine-dev.js');
const configs=[['classic',null],['continents','direct'],['continents','island'],['archipelago','island'],['inlandsea',null]];
const N=+process.argv[2]||8;
let tot={w:0,g:0,elim:0,v2elim:0};
for(const [st,mode] of configs){
  if(mode)E.STYLES[st].long=mode;
  let w=0,g=0,el=0,v2el=0,land=0;const t=Date.now();
  for(let s=1;s<=N;s++){const M=E.genWorldAny(1000+s*31,st);if(!M)continue;
    for(let seat=0;seat<3;seat++){
      const G=E.newGame(M,{cpu:true});G.players.forEach((p,f)=>{p.ai=true;p.uid='ai';p.bot=f===seat?'v2':'v1'});
      E.advance(G);g++;if(G.winners.includes(seat))w+=1/G.winners.length;
      el+=G.players.filter(p=>!p.alive).length;if(!G.players[seat].alive)v2el++;land+=E.landCount(G,seat);
    }}
  console.log((st+' '+(mode||'')).padEnd(22),'v2 wins',(100*w/g).toFixed(0)+'% of',g,'games · v2 eliminated',v2el,'· v1 eliminated',el-v2el,'· v2 avg final land',(land/g).toFixed(0),'·',((Date.now()-t)/g).toFixed(0)+'ms/game');
  tot.w+=w;tot.g+=g;
}
console.log('OVERALL v2 win rate',(100*tot.w/tot.g).toFixed(0)+'% (33% = no better than v1)');
