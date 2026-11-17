const L=require('../engine-dev.js');
for(const [st,mode] of [['inlandsea',null],['continents','direct'],['continents','island'],['archipelago','direct'],['archipelago','island']]){
  if(mode)L.STYLES[st].long=mode;
  const t=Date.now();let ok=0,lanes=0,lens=[],isl=0;
  for(let s=1;s<=30;s++){const M=L.genWorld(s,st);if(!M)continue;ok++;lanes+=M.lanes.length;M.lanes.forEach(p=>lens.push(p.length-2));isl+=M.countries.length-15}
  const h={};lens.forEach(x=>h[x]=(h[x]||0)+1);
  console.log((st+' '+(mode||'')).padEnd(20),'maps',ok+'/30','lanes/map',(lanes/Math.max(ok,1)).toFixed(1),'lengths',JSON.stringify(h),'islands/map',(isl/Math.max(ok,1)).toFixed(1),'ms/seed',((Date.now()-t)/30).toFixed(0))}
