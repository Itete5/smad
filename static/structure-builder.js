const ELEMENTS=[
  {s:'H',Z:1,r:53,c:'#eeeeee',cat:'nonmetal',row:1,col:1},{s:'He',Z:2,r:31,c:'#d9ffff',cat:'noble',row:1,col:18},
  {s:'Li',Z:3,r:167,c:'#cc80ff',cat:'alkali',row:2,col:1},{s:'Be',Z:4,r:112,c:'#c2ff00',cat:'alkaline',row:2,col:2},{s:'B',Z:5,r:87,c:'#ffb5b5',cat:'metalloid',row:2,col:13},{s:'C',Z:6,r:67,c:'#909090',cat:'nonmetal',row:2,col:14},{s:'N',Z:7,r:56,c:'#3050f8',cat:'nonmetal',row:2,col:15},{s:'O',Z:8,r:48,c:'#ff0d0d',cat:'nonmetal',row:2,col:16},{s:'F',Z:9,r:42,c:'#90e050',cat:'halogen',row:2,col:17},{s:'Ne',Z:10,r:38,c:'#b3e3f5',cat:'noble',row:2,col:18},
  {s:'Na',Z:11,r:190,c:'#ab5cf2',cat:'alkali',row:3,col:1},{s:'Mg',Z:12,r:145,c:'#8aff00',cat:'alkaline',row:3,col:2},{s:'Al',Z:13,r:118,c:'#bfa6a6',cat:'post',row:3,col:13},{s:'Si',Z:14,r:111,c:'#f0c8a0',cat:'metalloid',row:3,col:14},{s:'P',Z:15,r:98,c:'#ff8000',cat:'nonmetal',row:3,col:15},{s:'S',Z:16,r:88,c:'#ffff30',cat:'nonmetal',row:3,col:16},{s:'Cl',Z:17,r:79,c:'#1ff01f',cat:'halogen',row:3,col:17},{s:'Ar',Z:18,r:71,c:'#80d1e3',cat:'noble',row:3,col:18},
  {s:'K',Z:19,r:243,c:'#8f40d4',cat:'alkali',row:4,col:1},{s:'Ca',Z:20,r:194,c:'#3dff00',cat:'alkaline',row:4,col:2},{s:'Sc',Z:21,r:184,c:'#e6e6e6',cat:'transition',row:4,col:3},{s:'Ti',Z:22,r:176,c:'#bfc2c7',cat:'transition',row:4,col:4},{s:'V',Z:23,r:171,c:'#a6a6ab',cat:'transition',row:4,col:5},{s:'Cr',Z:24,r:166,c:'#8a99c7',cat:'transition',row:4,col:6},{s:'Mn',Z:25,r:161,c:'#9c7ac7',cat:'transition',row:4,col:7},{s:'Fe',Z:26,r:156,c:'#e06633',cat:'transition',row:4,col:8},{s:'Co',Z:27,r:152,c:'#f090a0',cat:'transition',row:4,col:9},{s:'Ni',Z:28,r:149,c:'#50d050',cat:'transition',row:4,col:10},{s:'Cu',Z:29,r:145,c:'#c88033',cat:'transition',row:4,col:11},{s:'Zn',Z:30,r:142,c:'#7d80b0',cat:'transition',row:4,col:12},{s:'Ga',Z:31,r:136,c:'#c28f8f',cat:'post',row:4,col:13},{s:'Ge',Z:32,r:125,c:'#668f8f',cat:'metalloid',row:4,col:14},{s:'As',Z:33,r:114,c:'#bd80e3',cat:'metalloid',row:4,col:15},{s:'Se',Z:34,r:103,c:'#ffa100',cat:'nonmetal',row:4,col:16},{s:'Br',Z:35,r:94,c:'#a62929',cat:'halogen',row:4,col:17},{s:'Kr',Z:36,r:88,c:'#5cb8d1',cat:'noble',row:4,col:18},
  {s:'Rb',Z:37,r:265,c:'#702eb0',cat:'alkali',row:5,col:1},{s:'Sr',Z:38,r:219,c:'#00ff00',cat:'alkaline',row:5,col:2},{s:'Y',Z:39,r:212,c:'#94ffff',cat:'transition',row:5,col:3},{s:'Zr',Z:40,r:206,c:'#94e0e0',cat:'transition',row:5,col:4},{s:'Nb',Z:41,r:198,c:'#73c2c9',cat:'transition',row:5,col:5},{s:'Mo',Z:42,r:190,c:'#54b5b5',cat:'transition',row:5,col:6},{s:'Tc',Z:43,r:183,c:'#3b9e9e',cat:'transition',row:5,col:7},{s:'Ru',Z:44,r:178,c:'#248f8f',cat:'transition',row:5,col:8},{s:'Rh',Z:45,r:173,c:'#0a7d8c',cat:'transition',row:5,col:9},{s:'Pd',Z:46,r:169,c:'#006985',cat:'transition',row:5,col:10},{s:'Ag',Z:47,r:165,c:'#c0c0c0',cat:'transition',row:5,col:11},{s:'Cd',Z:48,r:161,c:'#ffd98f',cat:'transition',row:5,col:12},{s:'In',Z:49,r:156,c:'#a67573',cat:'post',row:5,col:13},{s:'Sn',Z:50,r:145,c:'#668080',cat:'post',row:5,col:14},{s:'Sb',Z:51,r:133,c:'#9e63b5',cat:'metalloid',row:5,col:15},{s:'Te',Z:52,r:123,c:'#d47a00',cat:'metalloid',row:5,col:16},{s:'I',Z:53,r:115,c:'#940094',cat:'halogen',row:5,col:17},{s:'Xe',Z:54,r:108,c:'#429eb0',cat:'noble',row:5,col:18},
  {s:'Cs',Z:55,r:298,c:'#57178f',cat:'alkali',row:6,col:1},{s:'Ba',Z:56,r:253,c:'#00c900',cat:'alkaline',row:6,col:2},
  {s:'La',Z:57,r:249,c:'#70d4ff',cat:'lanthanide',row:6,col:3,lan:true},{s:'Ce',Z:58,r:245,c:'#ffffc7',cat:'lanthanide',row:6,col:3,lan:true},{s:'Pr',Z:59,r:239,c:'#d9ffc7',cat:'lanthanide',row:6,col:3,lan:true},{s:'Nd',Z:60,r:229,c:'#c7ffc7',cat:'lanthanide',row:6,col:3,lan:true},{s:'Pm',Z:61,r:236,c:'#a3ffc7',cat:'lanthanide',row:6,col:3,lan:true},{s:'Sm',Z:62,r:229,c:'#8fffc7',cat:'lanthanide',row:6,col:3,lan:true},{s:'Eu',Z:63,r:233,c:'#61ffc7',cat:'lanthanide',row:6,col:3,lan:true},{s:'Gd',Z:64,r:218,c:'#45ffc7',cat:'lanthanide',row:6,col:3,lan:true},{s:'Tb',Z:65,r:211,c:'#30ffc7',cat:'lanthanide',row:6,col:3,lan:true},{s:'Dy',Z:66,r:209,c:'#1fffc7',cat:'lanthanide',row:6,col:3,lan:true},{s:'Ho',Z:67,r:209,c:'#00ff9c',cat:'lanthanide',row:6,col:3,lan:true},{s:'Er',Z:68,r:208,c:'#00e675',cat:'lanthanide',row:6,col:3,lan:true},{s:'Tm',Z:69,r:208,c:'#00d452',cat:'lanthanide',row:6,col:3,lan:true},{s:'Yb',Z:70,r:208,c:'#00bf38',cat:'lanthanide',row:6,col:3,lan:true},{s:'Lu',Z:71,r:200,c:'#00ab24',cat:'lanthanide',row:6,col:3,lan:true},
  {s:'Hf',Z:72,r:206,c:'#4dc2ff',cat:'transition',row:6,col:4},{s:'Ta',Z:73,r:203,c:'#4da6ff',cat:'transition',row:6,col:5},{s:'W',Z:74,r:201,c:'#2194d6',cat:'transition',row:6,col:6},{s:'Re',Z:75,r:199,c:'#267dab',cat:'transition',row:6,col:7},{s:'Os',Z:76,r:197,c:'#266696',cat:'transition',row:6,col:8},{s:'Ir',Z:77,r:195,c:'#175487',cat:'transition',row:6,col:9},{s:'Pt',Z:78,r:195,c:'#d0d0e0',cat:'transition',row:6,col:10},{s:'Au',Z:79,r:194,c:'#ffd123',cat:'transition',row:6,col:11},{s:'Hg',Z:80,r:202,c:'#b8b8d0',cat:'transition',row:6,col:12},{s:'Tl',Z:81,r:204,c:'#a6544d',cat:'post',row:6,col:13},{s:'Pb',Z:82,r:202,c:'#575961',cat:'post',row:6,col:14},{s:'Bi',Z:83,r:207,c:'#9e4fb5',cat:'post',row:6,col:15},{s:'Po',Z:84,r:197,c:'#ab5c00',cat:'post',row:6,col:16},{s:'At',Z:85,r:202,c:'#754f45',cat:'halogen',row:6,col:17},{s:'Rn',Z:86,r:220,c:'#428296',cat:'noble',row:6,col:18},
  {s:'Fr',Z:87,r:348,c:'#420066',cat:'alkali',row:7,col:1},{s:'Ra',Z:88,r:283,c:'#007d00',cat:'alkaline',row:7,col:2},
  {s:'Ac',Z:89,r:260,c:'#70abfa',cat:'actinide',row:7,col:3,act:true},{s:'Th',Z:90,r:237,c:'#00baff',cat:'actinide',row:7,col:3,act:true},{s:'Pa',Z:91,r:243,c:'#00a1ff',cat:'actinide',row:7,col:3,act:true},{s:'U',Z:92,r:240,c:'#008fff',cat:'actinide',row:7,col:3,act:true},{s:'Np',Z:93,r:221,c:'#0080ff',cat:'actinide',row:7,col:3,act:true},{s:'Pu',Z:94,r:243,c:'#006bff',cat:'actinide',row:7,col:3,act:true},{s:'Am',Z:95,r:244,c:'#545cf2',cat:'actinide',row:7,col:3,act:true},{s:'Cm',Z:96,r:245,c:'#785ce3',cat:'actinide',row:7,col:3,act:true},{s:'Bk',Z:97,r:244,c:'#8a4fe3',cat:'actinide',row:7,col:3,act:true},{s:'Cf',Z:98,r:245,c:'#a136d4',cat:'actinide',row:7,col:3,act:true},{s:'Es',Z:99,r:245,c:'#b31fd4',cat:'actinide',row:7,col:3,act:true},{s:'Fm',Z:100,r:245,c:'#b31fba',cat:'actinide',row:7,col:3,act:true},{s:'Md',Z:101,r:246,c:'#b30da6',cat:'actinide',row:7,col:3,act:true},{s:'No',Z:102,r:246,c:'#bd0d87',cat:'actinide',row:7,col:3,act:true},{s:'Lr',Z:103,r:246,c:'#c70066',cat:'actinide',row:7,col:3,act:true}
];
const EL_MAP={}; ELEMENTS.forEach(e=>{EL_MAP[e.s]=e;});

const CAT_CLASS={alkali:'ec-alkali',alkaline:'ec-alkaline',transition:'ec-transition',post:'ec-post',metalloid:'ec-metalloid',nonmetal:'ec-nonmetal',halogen:'ec-halogen',noble:'ec-noble',lanthanide:'ec-lanthanide',actinide:'ec-actinide'};

const STRUCTURES={
  fcc:{name:'FCC',lattice:'cubic',sg:'Fm3m',sgN:225,a:3.52,alpha:90,sites:[{x:0,y:0,z:0,role:'A'},{x:0.5,y:0.5,z:0,role:'A'},{x:0.5,y:0,z:0.5,role:'A'},{x:0,y:0.5,z:0.5,role:'A'}],roles:['A']},
  bcc:{name:'BCC',lattice:'cubic',sg:'Im3m',sgN:229,a:2.87,alpha:90,sites:[{x:0,y:0,z:0,role:'A'},{x:0.5,y:0.5,z:0.5,role:'A'}],roles:['A']},
  sc:{name:'Simple cubic',lattice:'cubic',sg:'Pm3m',sgN:221,a:2.0,alpha:90,sites:[{x:0,y:0,z:0,role:'A'}],roles:['A']},
  hcp:{name:'HCP',lattice:'hexagonal',sg:'P63/mmc',sgN:194,a:2.5,alpha:90,c:4.1,sites:[{x:0,y:0,z:0,role:'A'},{x:1/3,y:2/3,z:0.5,role:'A'}],roles:['A']},
  diamond:{name:'Diamond',lattice:'cubic',sg:'Fd3m',sgN:227,a:3.57,alpha:90,sites:[{x:0,y:0,z:0,role:'A'},{x:0.5,y:0.5,z:0,role:'A'},{x:0.5,y:0,z:0.5,role:'A'},{x:0,y:0.5,z:0.5,role:'A'},{x:0.25,y:0.25,z:0.25,role:'A'},{x:0.75,y:0.75,z:0.25,role:'A'},{x:0.75,y:0.25,z:0.75,role:'A'},{x:0.25,y:0.75,z:0.75,role:'A'}],roles:['A']},
  nacl:{name:'NaCl',lattice:'cubic',sg:'Fm3m',sgN:225,a:5.64,alpha:90,sites:[{x:0,y:0,z:0,role:'A'},{x:0.5,y:0.5,z:0,role:'A'},{x:0.5,y:0,z:0.5,role:'A'},{x:0,y:0.5,z:0.5,role:'A'},{x:0.5,y:0,z:0,role:'B'},{x:0,y:0.5,z:0,role:'B'},{x:0,y:0,z:0.5,role:'B'},{x:0.5,y:0.5,z:0.5,role:'B'}],roles:['A','B']},
  zincblende:{name:'Zinc blende',lattice:'cubic',sg:'F43m',sgN:216,a:5.65,alpha:90,sites:[{x:0,y:0,z:0,role:'A'},{x:0.5,y:0.5,z:0,role:'A'},{x:0.5,y:0,z:0.5,role:'A'},{x:0,y:0.5,z:0.5,role:'A'},{x:0.25,y:0.25,z:0.25,role:'B'},{x:0.75,y:0.75,z:0.25,role:'B'},{x:0.75,y:0.25,z:0.75,role:'B'},{x:0.25,y:0.75,z:0.75,role:'B'}],roles:['A','B']},
  perovskite:{name:'Perovskite ABO3',lattice:'cubic',sg:'Pm3m',sgN:221,a:4.0,alpha:90,sites:[{x:0.5,y:0.5,z:0.5,role:'A'},{x:0,y:0,z:0,role:'B'},{x:0.5,y:0,z:0,role:'O'},{x:0,y:0.5,z:0,role:'O'},{x:0,y:0,z:0.5,role:'O'}],roles:['A','B','O']}
};

const CP={blue:{lo:[15,25,80],hi:[160,210,255]},red:{lo:[230,51,51],hi:[255,153,153]},green:{lo:[51,179,77],hi:[128,242,153]},purple:{lo:[153,51,204],hi:[217,153,242]}};
const BP={orange:{lo:[255,128,0],hi:[255,204,102]},teal:{lo:[0,179,179],hi:[102,230,230]},pink:{lo:[255,102,153],hi:[255,191,217]},gold:{lo:[217,166,33],hi:[255,217,128]}};

function lerp3(lo,hi,t){return[lo[0]+(hi[0]-lo[0])*t,lo[1]+(hi[1]-lo[1])*t,lo[2]+(hi[2]-lo[2])*t];}
function rgb(a){return'rgb('+Math.round(a[0])+','+Math.round(a[1])+','+Math.round(a[2])+')';}
function getCPal(){const name=document.getElementById('sel-cp')&&document.getElementById('sel-cp').value||'blue';const p=CP[name]||CP.blue;return t=>rgb(lerp3(p.lo,p.hi,t));}
function getBPal(){const name=document.getElementById('sel-bp')&&document.getElementById('sel-bp').value||'orange';const p=BP[name]||BP.orange;return t=>rgb(lerp3(p.lo,p.hi,t));}
function chargeToColor(c,all){const pal=getCPal();const vs=all||currentAtoms.map(a=>a.q);const mn=Math.min(...vs,0),mx=Math.max(...vs,0);const t=mx===mn?0.5:(c-mn)/(mx-mn);return pal(Math.max(0,Math.min(1,t)));}
function bondLenColor(l,mn,mx){const pal=getBPal();const t=(mn===mx)?0.5:(l-mn)/(mx-mn);return pal(Math.max(0,Math.min(1,t)));}

let elAssign={A:'Ni',B:'Cl',O:'O'},selectedEl=null,mode='unitcell';
let flags={showBonds:true,showLabels:true,showCharges:true,showBondLens:true,showUCBox:true,showAxes:true};
let spinning=true,rotX=0.4,rotY=0.6,dragging=false;
let currentAtoms=[],currentBonds=[],ucVecs=null,hoveredAtom=null,lastBuildResult=null;

const canvas=document.getElementById('mol-canvas');
const ctx=canvas?canvas.getContext('2d'):null;

function tog(flag,btnId){flags[flag]=!flags[flag];const b=document.getElementById(btnId);if(b)b.classList.toggle('active',flags[flag]);render();}
function switchTab(tab){['pt','formula','import','export'].forEach(t=>{const el=document.getElementById('tab-'+t);const btn=document.getElementById('tab-'+t+'-btn');if(el)el.style.display=t===tab?'flex':'none';if(btn)btn.classList.toggle('active',t===tab);});if(tab==='formula'){updateFormulaBadge();const inp=document.getElementById('formula-inp');if(inp)inp.focus();}}

function getElSym(role){return elAssign[role]||(role==='O'?'O':role==='B'?'Cl':'Ni');}
function getElColor(role){const sym=getElSym(role);const e=EL_MAP[sym];return e?e.c:'#666';}
function getElR(role){const sym=getElSym(role);const e=EL_MAP[sym];return e?(e.r/200):0.5;}

function buildPT(){
  const grid=document.getElementById('pt-grid');if(!grid)return;grid.innerHTML='';
  const main=ELEMENTS.filter(e=>!e.lan&&!e.act);
  const byCell={};
  main.forEach(e=>{const k=e.row+','+e.col;if(!byCell[k])byCell[k]=[];byCell[k].push(e);});
  for(let row=1;row<=7;row++){for(let col=1;col<=18;col++){
    const k=row+','+col;const list=byCell[k];const cell=document.createElement('div');
    if(list&&list.length){const e=list[0];cell.className='el-cell '+(CAT_CLASS[e.cat]||'');cell.textContent=e.s;cell.onclick=()=>selectEl(e.s);}
    else{cell.className='el-cell empty';cell.textContent='';}
    grid.appendChild(cell);
  }}
  const ptLan=document.getElementById('pt-lan');if(ptLan){ptLan.innerHTML='';ELEMENTS.filter(e=>e.lan).forEach(e=>{const cell=document.createElement('div');cell.className='el-cell '+(CAT_CLASS[e.cat]||'');cell.textContent=e.s;cell.onclick=()=>selectEl(e.s);ptLan.appendChild(cell);});}
  const ptAct=document.getElementById('pt-act');if(ptAct){ptAct.innerHTML='';ELEMENTS.filter(e=>e.act).forEach(e=>{const cell=document.createElement('div');cell.className='el-cell '+(CAT_CLASS[e.cat]||'');cell.textContent=e.s;cell.onclick=()=>selectEl(e.s);ptAct.appendChild(cell);});}
}
function selectEl(sym){selectedEl=sym;document.querySelectorAll('.el-cell.selected').forEach(c=>c.classList.remove('selected'));document.querySelectorAll('.el-cell').forEach(c=>{if(c.textContent===sym)c.classList.add('selected');});const badge=document.getElementById('sel-badge');if(badge)badge.textContent=sym||'—';const inp=document.getElementById('el-input');if(inp)inp.value=sym||'';}
function onElInput(v){const s=(v||'').trim().replace(/^[a-z]/,x=>x.toUpperCase());if(EL_MAP[s]){selectEl(s);}}
function setRole(role){if(selectedEl)elAssign[role]=selectedEl;updateAssignDisplay();rebuild();}
function updateAssignDisplay(){
  const out=document.getElementById('el-assign-display');if(!out)return;out.innerHTML='';
  const structId=document.getElementById('sel-struct')?document.getElementById('sel-struct').value:'fcc';
  const sp=STRUCTURES[structId];if(!sp)return;
  sp.roles.forEach(r=>{const sym=elAssign[r]||'—';const span=document.createElement('span');span.className='role-badge';span.style.background=getElColor(r);span.style.color='#fff';span.textContent=r+'='+sym;out.appendChild(span);});
}

function getLatt(structId){const s=STRUCTURES[structId];if(!s)return{a:3,b:3,c:3,al:90,be:90,ga:90};const a=s.a||3,b=s.b||a,c=s.c||(s.lattice==='hexagonal'?s.c:a);return{a,b,c,al:s.alpha||90,be:s.alpha||90,ga:s.lattice==='hexagonal'?120:90};}
function getLatOverride(){const gaInp=document.getElementById('lat-ga');const gaVal=(gaInp&&gaInp.value)?parseFloat(gaInp.value):90;return{a:document.getElementById('lat-a')&&document.getElementById('lat-a').value,b:document.getElementById('lat-b')&&document.getElementById('lat-b').value,c:document.getElementById('lat-c')&&document.getElementById('lat-c').value,al:document.getElementById('lat-al')&&document.getElementById('lat-al').value,be:document.getElementById('lat-be')&&document.getElementById('lat-be').value,ga:gaVal};}

function buildUC(sp,sc){
  const struct=typeof sp==='string'?STRUCTURES[sp]:sp;
  if(!struct||!struct.sites)return{atoms:[],vecs:null};
  const lat=typeof sc==='object'&&sc?sc:getLatt(typeof sp==='string'?sp:null);
  const a=parseFloat(lat.a)||3,b=parseFloat(lat.b)||lat.a,c=parseFloat(lat.c)||lat.a;
  const al=(lat.al||90)*Math.PI/180,be=(lat.be||90)*Math.PI/180,ga=(lat.ga||90)*Math.PI/180;
  const ax=a,ay=0,az=0;const bx=b*Math.cos(ga),by=b*Math.sin(ga),bz=0;
  const cx=c*Math.cos(be),cy=c*(Math.cos(al)-Math.cos(be)*Math.cos(ga))/Math.sin(ga),cz=c*Math.sqrt(Math.max(0,1-Math.cos(be)**2-(cy/c)**2));
  const vecs=[[ax,ay,az],[bx,by,bz],[cx,cy,cz]];
  const sites=struct.sites||[];
  const atoms=sites.map((st,i)=>({id:i,x:st.x,y:st.y,z:st.z,role:st.role,q:st.q!=null?st.q:0}));
  return{atoms,vecs};
}

function buildSlab(sp,layers,surfStr){
  const structId=document.getElementById('sel-struct')?document.getElementById('sel-struct').value:'fcc';
  const sp_=typeof sp==='string'?STRUCTURES[sp]:sp;
  const lat=getLatt(structId);const over=getLatOverride();const a=over.a?parseFloat(over.a):lat.a,b=over.b?parseFloat(over.b):lat.b,c=over.c?parseFloat(over.c):lat.c;
  const al=(lat.al||90)*Math.PI/180,be=(lat.be||90)*Math.PI/180,ga=(lat.ga||90)*Math.PI/180;
  const ax=a,ay=0,az=0;const bx=b*Math.cos(ga*Math.PI/180),by=b*Math.sin(ga*Math.PI/180),bz=0;
  const cx=c*Math.cos(be*Math.PI/180),cy=c*(Math.cos(al*Math.PI/180)-Math.cos(be*Math.PI/180)*Math.cos(ga*Math.PI/180))/Math.sin(ga*Math.PI/180),cz=c*Math.sqrt(Math.max(0,1-Math.cos(be*Math.PI/180)**2-(cy/c)**2));
  const vecs=[[ax,ay,az],[bx,by,bz],[cx,cy,cz]];
  const {atoms:ucAtoms}=buildUC(sp_,{a,b,c,al:lat.al,be:lat.be,ga:lat.ga});
  if(!ucAtoms.length||!vecs)return[];
  const [va,vb,vc]=vecs;
  const rep=(surfStr==='100')?[1,0,0]:(surfStr==='110')?[1,1,0]:(surfStr==='111')?[1,1,1]:[2,1,1];
  const thickness=layers*0.5,norm=Math.sqrt(rep[0]**2+rep[1]**2+rep[2]**2);
  const all=[];const nx=2,ny=2,nz=2;
  for(let i=-1;i<=nx;i++)for(let j=-1;j<=ny;j++)for(let k=-1;k<=nz;k++){ucAtoms.forEach(a=>{
    const x=a.x+i,y=a.y+j,z=a.z+k;
    const cart=[x*va[0]+y*vb[0]+z*vc[0],x*va[1]+y*vb[1]+z*vc[1],x*va[2]+y*vb[2]+z*vc[2]];
    const h=rep[0]*cart[0]+rep[1]*cart[1]+rep[2]*cart[2];
    if(h>=0&&h<=thickness*norm*2)all.push({...a,x,y,z,cart,role:a.role,q:a.q,id:all.length});
  });}
  return all;
}

function computeBonds(atoms){
  const bonds=[];const dmax=3.5;
  if(!atoms.length)return bonds;
  for(let i=0;i<atoms.length;i++)for(let j=i+1;j<atoms.length;j++){
    const ci=atoms[i].cart,cj=atoms[j].cart;
    if(!ci||!cj)continue;
    const dx=cj[0]-ci[0],dy=cj[1]-ci[1],dz=cj[2]-ci[2];
    const d=Math.sqrt(dx*dx+dy*dy+dz*dz);
    if(d>0.1&&d<dmax)bonds.push({a:i,b:j,len:d});
  }
  return bonds;
}

function getStrParams(){
  const sel=document.getElementById('sel-struct');const structId=sel?sel.value:'fcc';
  const lat=getLatt(structId);const over=getLatOverride();
  const a=over.a?parseFloat(over.a):lat.a,b=over.b?parseFloat(over.b):lat.b,c=over.c?parseFloat(over.c):lat.c;
  const al=over.al?parseFloat(over.al):lat.al,be=over.be?parseFloat(over.be):lat.be,ga=over.ga?parseFloat(over.ga):lat.ga;
  return{structId,nx:parseInt(document.getElementById('inp-nx')&&document.getElementById('inp-nx').value,10)||2,ny:parseInt(document.getElementById('inp-ny')&&document.getElementById('inp-ny').value,10)||2,nz:parseInt(document.getElementById('inp-nz')&&document.getElementById('inp-nz').value,10)||2,surf:document.getElementById('sel-surf')&&document.getElementById('sel-surf').value||'100',layers:parseInt(document.getElementById('inp-layers')&&document.getElementById('inp-layers').value,10)||4,a,b,c,al,be,ga};
}

function rebuild(){
  const {structId,nx,ny,nz,surf,layers,a,b,c,al,be,ga}=getStrParams();
  const lat={a,b,c,al,be,ga};
  const sp=STRUCTURES[structId];
  let {atoms,vecs}=buildUC(sp,lat);
  ucVecs=vecs;
  const [va,vb,vc]=vecs||[[1,0,0],[0,1,0],[0,0,1]];
  if(mode==='super'){
    currentAtoms=[];let id=0;
    for(let i=0;i<nx;i++)for(let j=0;j<ny;j++)for(let k=0;k<nz;k++)atoms.forEach(a=>{currentAtoms.push({...a,x:a.x+i,y:a.y+j,z:a.z+k,role:a.role,q:a.q,id:id++});});
  }else if(mode==='slab'){currentAtoms=buildSlab(sp,layers,surf);}
  else{currentAtoms=atoms.map((a,i)=>({...a,id:i}));}
  currentAtoms.forEach(a=>{a.cart=[a.x*va[0]+a.y*vb[0]+a.z*vc[0],a.x*va[1]+a.y*vb[1]+a.z*vc[1],a.x*va[2]+a.y*vb[2]+a.z*vc[2]];});
  currentBonds=computeBonds(currentAtoms);
  lastBuildResult={structId,lat,vecs,sp};
  render();updateInfoPanel();
}

function setMode(m){mode=m;const btnUc=document.getElementById('btn-uc');const btnSs=document.getElementById('btn-ss');const btnSlab=document.getElementById('btn-slab');if(btnUc)btnUc.classList.toggle('active',m==='unitcell');if(btnSs)btnSs.classList.toggle('active',m==='super');if(btnSlab)btnSlab.classList.toggle('active',m==='slab');rebuild();}
function onStructChange(){rebuild();updateInfoPanel();updateAssignDisplay();}

function updateInfoPanel(){
  const {structId,a,b,c}=getStrParams();const s=STRUCTURES[structId];
  const nameEl=document.getElementById('info-name');if(nameEl)nameEl.textContent=(s?s.name:structId)+' — '+(mode==='unitcell'?'Unit cell':mode==='super'?'Supercell':'Slab');
  const lattEl=document.getElementById('info-latt');if(lattEl)lattEl.textContent=s?s.lattice:'—';
  const aEl=document.getElementById('info-a');if(aEl)aEl.textContent=a;
  const sgEl=document.getElementById('info-sg');if(sgEl)sgEl.textContent=s?s.sg:'—';
  const atomsEl=document.getElementById('info-atoms');if(atomsEl)atomsEl.textContent=currentAtoms.length;
  const formula=[];const cnt={};currentAtoms.forEach(a=>{const sym=a.sym||getElSym(a.role);cnt[sym]=(cnt[sym]||0)+1;});Object.keys(cnt).filter(s=>s!='—').sort().forEach(s=>formula.push(cnt[s]>1?s+cnt[s]:s));
  const formulaEl=document.getElementById('info-formula');if(formulaEl)formulaEl.textContent=formula.length?formula.join(' '):'—';
  const elsEl=document.getElementById('info-els');if(elsEl)elsEl.textContent=getElSym('A')+'/'+getElSym('B')+'/'+getElSym('O');
  updateHov();
}

function updateFormulaBadge(){const inp=document.getElementById('formula-inp');const out=document.getElementById('formula-preview');if(!out)return;const parsed=parseFormula(inp?inp.value:'');if(parsed&&parsed.length){out.textContent=parsed.map(([s,n])=>n>1?s+n:s).join(' ');}else out.textContent='';const roleOut=document.getElementById('formula-role-out');if(roleOut)roleOut.textContent='A/B/X assigned from formula order.';}
function parseFormula(str){
  const s=str.trim().replace(/\s+/g,'');const re=/([A-Z][a-z]?)(\d*)/g;const out=[];let m;
  while((m=re.exec(s))!==null){const sym=m[1],n=parseInt(m[2],10)||1;if(EL_MAP[sym])out.push([sym,n]);}
  return out.length?out:null;
}
function onFormulaInput(v){updateFormulaBadge();}
function applyFormula(){
  const inp=document.getElementById('formula-inp');const parsed=parseFormula(inp?inp.value:'');
  if(parsed){const structId=document.getElementById('sel-struct')?document.getElementById('sel-struct').value:'fcc';const roles=STRUCTURES[structId]?STRUCTURES[structId].roles:['A'];
    parsed.forEach(([sym],i)=>{if(roles[i]==='A')elAssign.A=sym;else if(roles[i]==='B')elAssign.B=sym;else if(roles[i]==='O')elAssign.O=sym;});updateAssignDisplay();rebuild();showToast('Formula applied');}
  else showToast('Could not parse formula');
}
function quickFormula(f){const inp=document.getElementById('formula-inp');if(inp)inp.value=f;applyFormula();}

function parseXYZ(text){const lines=text.trim().split('\n');const n=parseInt(lines[0],10);if(isNaN(n))return null;const atoms=[];for(let i=2;i<2+n&&i<lines.length;i++){const p=lines[i].split(/\s+/).filter(Boolean);const sym=(p[0]||'X').replace(/^\d+$/,'X');const x=parseFloat(p[1])||0,y=parseFloat(p[2])||0,z=parseFloat(p[3])||0;atoms.push({sym:EL_MAP[sym]?sym:'H',x,y,z,q:0,cart:[x,y,z]});}return atoms;}
function parsePOSCAR(text){const lines=text.trim().split('\n').filter(l=>l);if(lines.length<8)return null;const scale=parseFloat(lines[1]);const va=lines[2].split(/\s+/).filter(Boolean).map(Number).map(x=>x*scale);const vb=lines[3].split(/\s+/).filter(Boolean).map(Number).map(x=>x*scale);const vc=lines[4].split(/\s+/).filter(Boolean).map(Number).map(x=>x*scale);const vecs=[va,vb,vc];const syms=lines[5].split(/\s+/).filter(Boolean);const counts=lines[6].split(/\s+/).filter(Boolean).map(Number);let idx=7;const isDirect=lines[7].toLowerCase().includes('direct');if(!isDirect)idx=8;const atoms=[];syms.forEach((s,i)=>{const sym=EL_MAP[s]?s:'H';for(let k=0;k<(counts[i]||0);k++){const l=lines[idx++];if(!l)return;const p=l.split(/\s+/).filter(Boolean);const x=parseFloat(p[0])||0,y=parseFloat(p[1])||0,z=parseFloat(p[2])||0;atoms.push({sym,x,y,z,q:0,cart:isDirect?[x*va[0]+y*vb[0]+z*vc[0],x*va[1]+y*vb[1]+z*vc[1],x*va[2]+y*vb[2]+z*vc[2]]:[x,y,z]});}});return{atoms,vecs};}
function parseCIF(text){const atoms=[];let a=10,b=10,c=10,al=90,be=90,ga=90;const va=[a,0,0],vb=[b*Math.cos(ga*Math.PI/180),b*Math.sin(ga*Math.PI/180),0],cx=c*Math.cos(be*Math.PI/180),cy=c*(Math.cos(al*Math.PI/180)-Math.cos(be*Math.PI/180)*Math.cos(ga*Math.PI/180))/Math.sin(ga*Math.PI/180);const vc=[cx,cy,Math.sqrt(c*c-cx*cx-cy*cy)];text.replace(/_atom_site_fract_x\s+([\s\S]*?)(?=loop_|$)/gi,(_,block)=>{block.split('\n').forEach(l=>{const p=l.trim().split(/\s+/);if(p.length>=4&&!isNaN(parseFloat(p[1]))){const sym=EL_MAP[p[0]]?p[0]:'H',x=parseFloat(p[1]),y=parseFloat(p[2]),z=parseFloat(p[3]);atoms.push({sym,x,y,z,q:0,cart:[x*va[0]+y*vb[0]+z*vc[0],x*va[1]+y*vb[1]+z*vc[1],x*va[2]+y*vb[2]+z*vc[2]]});}});});if(!atoms.length)return null;return{atoms,vecs:[va,vb,vc]};}
function parsePDB(text){const atoms=[];text.split('\n').forEach(l=>{if(l.startsWith('ATOM ')||l.startsWith('HETATM ')){const sym=(l.substring(12,14)||'X').trim();const x=parseFloat(l.substring(30,38)),y=parseFloat(l.substring(38,46)),z=parseFloat(l.substring(46,54));atoms.push({sym:EL_MAP[sym]?sym:'H',x,y,z,q:0,cart:[x,y,z]});}});return atoms.length?{atoms,vecs:[[1,0,0],[0,1,0],[0,0,1]]}:null;}

function parseFromText(text){if(!text||!text.trim()){showToast('Paste structure first');return;}
  let data=null;if(text.includes('_atom_site')||text.includes('data_'))data=parseCIF(text);else if(text.includes('Direct')||text.includes('Cartesian')||/^\s*[\d.]+\s*$/.test(text.split('\n')[1]))data=parsePOSCAR(text);else if(/^\s*\d+\s*$/.test(text.trim().split('\n')[0]))data={atoms:parseXYZ(text),vecs:[[1,0,0],[0,1,0],[0,0,1]]};else data=parsePDB(text);
  if(data&&data.atoms&&data.atoms.length){loadImportedAtoms(data);showToast('Loaded '+data.atoms.length+' atoms');}else showToast('Could not parse structure');}

function loadImportedAtoms(result){
  const atoms=result.atoms||[];const vecs=result.vecs||[[1,0,0],[0,1,0],[0,0,1]];
  ucVecs=vecs;const [va,vb,vc]=ucVecs;
  currentAtoms=atoms.map((a,i)=>({id:i,sym:a.sym,role:'A',x:a.x,y:a.y,z:a.z,q:a.q||0,cart:a.cart||[a.x*va[0]+a.y*vb[0]+a.z*vc[0],a.x*va[1]+a.y*vb[1]+a.z*vc[1],a.x*va[2]+a.y*vb[2]+a.z*vc[2]]}));
  currentBonds=computeBonds(currentAtoms);render();updateInfoPanel();
}

function onFileDrop(e){e.preventDefault();e.target.classList.remove('over');const f=e.dataTransfer.files[0];if(f)readFile(f);}
function onFileInput(input){const f=input.files[0];if(f)readFile(f);input.value='';}
function readFile(file){const r=new FileReader();r.onload=()=>{const text=r.result;parseFromText(text);const status=document.getElementById('import-status');if(status)status.textContent='Loaded: '+file.name;};r.readAsText(file);}

function getExportData(){
  const {a,b,c,al,be,ga}=getStrParams();const vecs=ucVecs||[[a,0,0],[0,b,0],[0,0,c]];
  const syms=currentAtoms.map(a=>a.sym?a.sym:getElSym(a.role));
  const uniqueSyms=[...new Set(syms)];
  return{atoms:currentAtoms,vecs,a,b,c,al,be,ga,syms,uniqueSyms,name:lastBuildResult&&lastBuildResult.sp?lastBuildResult.sp.name:'Export'};
}

const MASS={H:1.008,He:4.003,Li:6.94,Be:9.012,C:12.01,N:14.01,O:16,F:19,Ne:20.18,Na:22.99,Mg:24.31,Al:26.98,Si:28.09,P:30.97,S:32.07,Cl:35.45,Ar:39.95,K:39.1,Ca:40.08,Sc:44.96,Ti:47.87,V:50.94,Cr:52,Mn:54.94,Fe:55.85,Co:58.93,Ni:58.69,Cu:63.55,Zn:65.38,Ga:69.72,Ge:72.63,As:74.92,Se:78.97,Br:79.9,Kr:83.8,Rb:85.47,Sr:87.62,Y:88.91,Zr:91.22,Nb:92.91,Mo:95.95,Tc:98,Ru:101.1,Rh:102.9,Pd:106.4,Ag:107.9,Cd:112.4,In:114.8,Sn:118.7,Sb:121.8,Te:127.6,I:126.9,Xe:131.3,Cs:132.9,Ba:137.3,La:138.9,Ce:140.1,Pr:140.9,Nd:144.2,Pm:145,Sm:150.4,Eu:152,Gd:157.3,Tb:158.9,Dy:162.5,Ho:164.9,Er:167.3,Tm:168.9,Yb:173,Lu:175,Hf:178.5,Ta:180.9,W:183.8,Re:186.2,Os:190.2,Ir:192.2,Pt:195.1,Au:197,Hg:200.6,Tl:204.4,Pb:207.2,Bi:209,Po:209,At:210,Rn:222,Fr:223,Ra:226,Ac:227,Th:232,U:238};

function genCIF(d){const name=d.name||'export';let s='data_'+name+'\n_cell_length_a '+d.a+'\n_cell_length_b '+d.b+'\n_cell_length_c '+d.c+'\n_cell_angle_alpha '+d.al+'\n_cell_angle_beta '+d.be+'\n_cell_angle_gamma '+d.ga+'\nloop_ _atom_site_label _atom_site_fract_x _atom_site_fract_y _atom_site_fract_z\n';const [va,vb,vc]=d.vecs;d.atoms.forEach((a,i)=>{const sym=a.sym||getElSym(a.role);s+=sym+' '+(a.x!=null?a.x:0)+' '+(a.y!=null?a.y:0)+' '+(a.z!=null?a.z:0)+'\n';});return s;}
function genPOSCAR(d){const name=d.name||'SMAD export';let s=name+'\n1.0\n';const [va,vb,vc]=d.vecs;s+=va.join(' ')+'\n'+vb.join(' ')+'\n'+vc.join(' ')+'\n';const syms=d.uniqueSyms||[];const counts={};syms.forEach(s=>{counts[s]=d.atoms.filter(a=>(a.sym||getElSym(a.role))===s).length;});s+=syms.join(' ')+'\n'+syms.map(s=>counts[s]).join(' ')+'\nDirect\n';syms.forEach(sym=>{d.atoms.filter(a=>(a.sym||getElSym(a.role))===sym).forEach(a=>{s+=(a.x!=null?a.x:0)+' '+(a.y!=null?a.y:0)+' '+(a.z!=null?a.z:0)+'\n';});});return s;}
function genXYZ(d){let s=d.atoms.length+'\n'+ (d.name||'Exported') +'\n';d.atoms.forEach(a=>{const sym=a.sym||getElSym(a.role);s+=sym+' '+(a.cart?(a.cart[0]+' '+a.cart[1]+' '+a.cart[2]):(a.x+' '+a.y+' '+a.z))+'\n';});return s;}
function genLAMMPS(d){let s='# LAMMPS data\n\n'+d.atoms.length+' atoms\n\n1 atom types\n\n0 '+d.a+' xlo xhi\n0 '+d.b+' ylo yhi\n0 '+d.c+' zlo zhi\n\nAtoms # fractional\n\n';d.atoms.forEach((a,i)=>{s+=(i+1)+' 1 '+(a.x!=null?a.x:0)+' '+(a.y!=null?a.y:0)+' '+(a.z!=null?a.z:0)+'\n';});return s;}
function genPDB(d){let s='';d.atoms.forEach((a,i)=>{const sym=a.sym||getElSym(a.role);const x=a.cart?a.cart[0]:a.x,y=a.cart?a.cart[1]:a.y,z=a.cart?a.cart[2]:a.z;s+='ATOM  '+(i+1).toString().padStart(5)+'  '+sym.padEnd(2)+'   UNK     1    '+x.toFixed(3).padStart(8)+y.toFixed(3).padStart(8)+z.toFixed(3).padStart(8)+'  1.00  0.00\n';});return s;}
function genGJF(d){let s='# opt\n\n'+(d.name||'Exported')+'\n\n0 1\n';d.atoms.forEach(a=>{const sym=a.sym||getElSym(a.role);const x=a.cart?a.cart[0]:a.x,y=a.cart?a.cart[1]:a.y,z=a.cart?a.cart[2]:a.z;s+=sym+' '+x+' '+y+' '+z+'\n';});s+='\n';return s;}
const FORMAT_FNS={cif:genCIF,poscar:genPOSCAR,xyz:genXYZ,lammps:genLAMMPS,pdb:genPDB,gjf:genGJF};
const FORMAT_EXT={cif:'.cif',poscar:'.vasp',xyz:'.xyz',lammps:'.lammps',pdb:'.pdb',gjf:'.gjf'};
function exportFile(fmt){const d=getExportData();const fn=FORMAT_FNS[fmt];if(!fn){showToast('Unknown format');return;}const blob=new Blob([fn(d)],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='structure'+FORMAT_EXT[fmt];a.click();URL.revokeObjectURL(a.href);showToast('Exported '+fmt);}
function copyFormat(fmt){const d=getExportData();const fn=FORMAT_FNS[fmt];if(!fn){showToast('Unknown format');return;}navigator.clipboard.writeText(fn(d)).then(()=>showToast('Copied to clipboard')).catch(()=>showToast('Copy failed'));}
function showToast(msg){const el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.style.display='block';clearTimeout(showToast._t);showToast._t=setTimeout(()=>{el.style.display='none';},2500);}

function rotP(p,rotX,rotY){let [x,y,z]=p;let c=Math.cos(rotY),s=Math.sin(rotY);let x2=x*c-z*s,z2=x*s+z*c;x=x2;z=z2;c=Math.cos(rotX);s=Math.sin(rotX);let y2=y*c-z*s;z2=y*s+z*c;y=y2;z=z2;return[x,y,z];}
function drawSphere(x,y,r,col,pz,hov){ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();if(ctx.roundRect){ctx.strokeStyle=hov?'rgba(255,255,255,0.6)':'rgba(255,255,255,0.2)';ctx.lineWidth=hov?1.5:0.5;ctx.stroke();}}

function render(){
  if(!canvas||!ctx)return;
  const w=canvas.width=canvas.clientWidth,h=canvas.height=canvas.clientHeight;
  ctx.fillStyle='#0a0c14';ctx.beginPath();if(ctx.roundRect){ctx.roundRect(0,0,w,h,0);ctx.fill();}else{ctx.fillRect(0,0,w,h);}
  const cx=w/2,cy=h/2;const scale=Math.min(w,h)/Math.max(8,currentAtoms.length*0.5);
  const vecs=ucVecs||[[1,0,0],[0,1,0],[0,0,1]];const [va,vb,vc]=vecs;
  const proj=at=>{const c=at.cart||[at.x*va[0]+at.y*vb[0]+at.z*vc[0],at.x*va[1]+at.y*vb[1]+at.z*vc[1],at.x*va[2]+at.y*vb[2]+at.z*vc[2]];const p=rotP(c,rotX,rotY);return[cx+p[0]*scale,cy-p[1]*scale,p[2]];};
  const qmin=Math.min(...currentAtoms.map(a=>a.q),0),qmax=Math.max(...currentAtoms.map(a=>a.q),0);
  const lens=currentBonds.map(b=>b.len);const lmin=lens.length?Math.min(...lens):0.1,lmax=lens.length?Math.max(...lens):3;
  currentBonds.forEach(b=>{if(!flags.showBonds)return;const ai=currentAtoms[b.a],aj=currentAtoms[b.b];if(!ai||!aj)return;const [x1,y1,z1]=proj(ai),[x2,y2,z2]=proj(aj);ctx.strokeStyle=bondLenColor(b.len,lmin,lmax);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();if(flags.showBondLens){ctx.fillStyle='#c0c8e0';ctx.font='9px monospace';ctx.fillText(b.len.toFixed(2),(x1+x2)/2,(y1+y2)/2);}});
  const order=currentAtoms.map((a,i)=>[i,proj(a)[2]]).sort((a,b)=>b[1]-a[1]);
  order.forEach(([i,z])=>{const a=currentAtoms[i];const [sx,sy]=proj(a);const r=Math.max(4,getElR(a.role)*scale*0.5);const col=getElColor(a.role);const hov=hoveredAtom&&hoveredAtom.atom&&hoveredAtom.atom.id===a.id;drawSphere(sx,sy,r,col,z,hov);if(flags.showLabels){ctx.fillStyle='#fff';ctx.font='10px monospace';if(ctx.roundRect){const sym=a.sym||getElSym(a.role);const tw=ctx.measureText(sym).width;ctx.fillStyle='rgba(0,0,0,0.5)';ctx.beginPath();ctx.roundRect(sx+r+2,sy-2,tw+4,14,2);ctx.fill();ctx.fillStyle='#fff';ctx.fillText(sym,sx+r+4,sy+8);}else ctx.fillText(a.sym||getElSym(a.role),sx+r+2,sy+4);}if(flags.showCharges&&a.q!==0){ctx.fillStyle=chargeToColor(a.q);ctx.font='9px monospace';ctx.fillText(a.q.toFixed(1),sx-r-2,sy);}});
  if(flags.showUCBox&&ucVecs){}
  if(flags.showAxes){ctx.font='11px monospace';const o=rotP([0,0,0],rotX,rotY);ctx.fillStyle='#f00';ctx.fillText('X',cx+scale*1.2+o[0],cy-o[1]);ctx.fillStyle='#0f0';ctx.fillText('Y',cx+o[0],cy-scale*1.2-o[1]);ctx.fillStyle='#08f';ctx.fillText('Z',cx+o[0],cy+scale*0.8+o[1]);}
  const chargeScale=document.getElementById('charge-scale');if(chargeScale)chargeScale.style.display=flags.showCharges?'block':'none';const bondScale=document.getElementById('bond-scale');if(bondScale)bondScale.style.display=flags.showBondLens?'block':'none';
}

function findHov(x,y){
  const w=canvas.width,h=canvas.height,cx=w/2,cy=h/2,scale=Math.min(w,h)/8;
  const vecs=ucVecs||[[1,0,0],[0,1,0],[0,0,1]];const [va,vb,vc]=vecs;
  const proj=at=>{const c=at.cart||[at.x*va[0]+at.y*vb[0]+at.z*vc[0],at.x*va[1]+at.y*vb[1]+at.z*vc[1],at.x*va[2]+at.y*vb[2]+at.z*vc[2]];const p=rotP(c,rotX,rotY);return[cx+p[0]*scale,cy-p[1]*scale];};
  let best=null,bestD=30;
  currentAtoms.forEach((a,i)=>{const [sx,sy]=proj(a);const r=Math.max(8,getElR(a.role)*scale);const d=Math.hypot(x-sx,y-sy);if(d<=r&&d<bestD){bestD=d;best={atom:a,index:i};}});
  return best;
}
function updateHov(a){const el=document.getElementById('info-hov');const hc=document.getElementById('info-hc');const hb=document.getElementById('info-hb');const hl=document.getElementById('info-hl');if(!hoveredAtom){if(el)el.textContent='—';if(hc)hc.textContent='—';if(hb)hb.textContent='—';if(hl)hl.textContent='—';return;}const at=hoveredAtom.atom;if(el)el.textContent=at.sym||getElSym(at.role);if(hc)hc.textContent=at.q!=null?at.q:'—';const bonds=currentBonds.filter(b=>b.a===hoveredAtom.index||b.b===hoveredAtom.index);if(hb)hb.textContent=bonds.length;if(hl)hl.textContent=bonds.length?bonds.map(b=>b.len.toFixed(2)).join(', '):'—';}

if(canvas){
  canvas.addEventListener('mousedown',e=>{dragging=true;});
  canvas.addEventListener('mouseup',()=>{dragging=false;});
  canvas.addEventListener('mouseleave',()=>{dragging=false;hoveredAtom=null;updateHov();render();});
  canvas.addEventListener('mousemove',e=>{
    const rect=canvas.getBoundingClientRect();const x=e.clientX-rect.left,y=e.clientY-rect.top;
    if(dragging){rotY+=(e.movementX||0)*0.01;rotX+=(e.movementY||0)*0.01;render();}else{hoveredAtom=findHov(x,y);updateHov();render();}
  });
}
function toggleSpin(){spinning=!spinning;const b=document.getElementById('btn-spin');if(b)b.classList.toggle('active',spinning);}
function spinLoop(){function tick(){if(spinning){rotY+=0.005;render();}requestAnimationFrame(tick);}requestAnimationFrame(tick);}

buildPT();rebuild();updateInfoPanel();updateAssignDisplay();spinLoop();
