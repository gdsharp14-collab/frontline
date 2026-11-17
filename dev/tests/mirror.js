const E=require('../engine-dev.js');
const configs=[['classic',null],['continents',null],['continents','direct'],['continents','island'],['archipelago',null],['archipelago','direct'],['archipelago','island'],['inlandsea',null]];
const N=+process.argv[2]||20;
for(const [st,mode] of configs){
  E.STYLES[st].long=mode;
  const wins=[0,0,0];let g=0,el=0,firstEl=[],t=Date.now(),spread=0;
  for(let s=1;s<=N;s++){const M=E.genWorldAny(5000+s*17,st);if(!M)continue;
    const G=E.newGame(M,{cpu:true});G.players.forEach(p=>{p.ai=true;p.uid='ai';p.bot='v2'});E.advance(G);g++;
    G.winners.forEach(f=>wins[f]+=1/G.winners.length);el+=G.players.filter(p=>!p.alive).length;
    const e=G.log.find(l=>/eliminated/.test(l.m));if(e)firstEl.push(e.t);
    const L=[0,1,2].map(f=>E.landCount(G,f)).sort((a,b)=>b-a);spread+=L[0]/(L[0]+L[1]+L[2]);}
  firstEl.sort((a,b)=>a-b);
  console.log((st+' '+(mode||'')).padEnd(22),'wins by seat',wins.map(w=>Math.round(100*w/g)+'%').join('/'),'· eliminations',el,'in',g,'games · median first elimination turn',firstEl.length?firstEl[Math.floor(firstEl.length/2)]:'-','· winner holds',Math.round(100*spread/g)+'% of land ·',((Date.now()-t)/g).toFixed(0)+'ms/game');
}
