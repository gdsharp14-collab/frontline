const L=require('../engine-dev.js');const [st,mode]=process.argv.slice(2);if(mode!=='-')L.STYLES[st].long=mode;
const out=[];for(let s=1;s<=60&&out.length<2;s++){const M=L.genWorld(s,st);if(!M)continue;
 const long=M.lanes.filter(p=>p.length-2>=8).length,mid=M.lanes.filter(p=>p.length-2>=3).length,isl=M.countries.length-15;
 if(mode==='direct'&&long>=1&&mid>=3)out.push(s);else if(mode==='island'&&isl>=1&&mid>=3)out.push(s);else if(mode==='-')out.push(s)}
console.log(out.join(' '));
