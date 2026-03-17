const ELEMENTS=[
  {s:'H',Z:1,r:53,c:'#eeeeee',cat:'nonmetal',row:1,col:1},{s:'He',Z:2,r:31,c:'#a090cc',cat:'noble',row:1,col:18},
  {s:'Li',Z:3,r:167,c:'#ff6655',cat:'alkali',row:2,col:1},{s:'Be',Z:4,r:112,c:'#e08040',cat:'alkaline',row:2,col:2},
  {s:'B',Z:5,r:87,c:'#44aa66',cat:'metalloid',row:2,col:13},{s:'C',Z:6,r:67,c:'#888888',cat:'nonmetal',row:2,col:14},
  {s:'N',Z:7,r:56,c:'#4488cc',cat:'nonmetal',row:2,col:15},{s:'O',Z:8,r:48,c:'#ff4444',cat:'nonmetal',row:2,col:16},
  {s:'F',Z:9,r:42,c:'#99cc44',cat:'halogen',row:2,col:17},{s:'Ne',Z:10,r:38,c:'#8877bb',cat:'noble',row:2,col:18},
  {s:'Na',Z:11,r:190,c:'#ff6655',cat:'alkali',row:3,col:1},{s:'Mg',Z:12,r:145,c:'#e08040',cat:'alkaline',row:3,col:2},
  {s:'Al',Z:13,r:118,c:'#6688aa',cat:'post',row:3,col:13},{s:'Si',Z:14,r:111,c:'#44aa66',cat:'metalloid',row:3,col:14},
  {s:'P',Z:15,r:98,c:'#ff8844',cat:'nonmetal',row:3,col:15},{s:'S',Z:16,r:88,c:'#ddcc22',cat:'nonmetal',row:3,col:16},
  {s:'Cl',Z:17,r:79,c:'#99cc44',cat:'halogen',row:3,col:17},{s:'Ar',Z:18,r:71,c:'#8877bb',cat:'noble',row:3,col:18},
  {s:'K',Z:19,r:243,c:'#ff6655',cat:'alkali',row:4,col:1},{s:'Ca',Z:20,r:194,c:'#e08040',cat:'alkaline',row:4,col:2},
  {s:'Sc',Z:21,r:184,c:'#5588aa',cat:'transition',row:4,col:3},{s:'Ti',Z:22,r:176,c:'#5588aa',cat:'transition',row:4,col:4},
  {s:'V',Z:23,r:171,c:'#5588aa',cat:'transition',row:4,col:5},{s:'Cr',Z:24,r:166,c:'#5588aa',cat:'transition',row:4,col:6},
  {s:'Mn',Z:25,r:161,c:'#5588aa',cat:'transition',row:4,col:7},{s:'Fe',Z:26,r:156,c:'#cc6644',cat:'transition',row:4,col:8},
  {s:'Co',Z:27,r:152,c:'#5588aa',cat:'transition',row:4,col:9},{s:'Ni',Z:28,r:149,c:'#88aacc',cat:'transition',row:4,col:10},
  {s:'Cu',Z:29,r:145,c:'#cc8844',cat:'transition',row:4,col:11},{s:'Zn',Z:30,r:142,c:'#6699aa',cat:'transition',row:4,col:12},
  {s:'Ga',Z:31,r:136,c:'#6688aa',cat:'post',row:4,col:13},{s:'Ge',Z:32,r:125,c:'#44aa66',cat:'metalloid',row:4,col:14},
  {s:'As',Z:33,r:114,c:'#44aa66',cat:'metalloid',row:4,col:15},{s:'Se',Z:34,r:103,c:'#ddcc22',cat:'nonmetal',row:4,col:16},
  {s:'Br',Z:35,r:94,c:'#aa5544',cat:'halogen',row:4,col:17},{s:'Kr',Z:36,r:88,c:'#8877bb',cat:'noble',row:4,col:18},
  {s:'Rb',Z:37,r:265,c:'#ff6655',cat:'alkali',row:5,col:1},{s:'Sr',Z:38,r:219,c:'#e08040',cat:'alkaline',row:5,col:2},
  {s:'Y',Z:39,r:212,c:'#5588aa',cat:'transition',row:5,col:3},{s:'Zr',Z:40,r:206,c:'#5588aa',cat:'transition',row:5,col:4},
  {s:'Nb',Z:41,r:198,c:'#5588aa',cat:'transition',row:5,col:5},{s:'Mo',Z:42,r:190,c:'#5588aa',cat:'transition',row:5,col:6},
  {s:'Tc',Z:43,r:183,c:'#5588aa',cat:'transition',row:5,col:7},{s:'Ru',Z:44,r:178,c:'#5588aa',cat:'transition',row:5,col:8},
  {s:'Rh',Z:45,r:173,c:'#aabbcc',cat:'transition',row:5,col:9},{s:'Pd',Z:46,r:169,c:'#aabbcc',cat:'transition',row:5,col:10},
  {s:'Ag',Z:47,r:165,c:'#d0d0d0',cat:'transition',row:5,col:11},{s:'Cd',Z:48,r:161,c:'#6699aa',cat:'transition',row:5,col:12},
  {s:'In',Z:49,r:156,c:'#6688aa',cat:'post',row:5,col:13},{s:'Sn',Z:50,r:145,c:'#6688aa',cat:'post',row:5,col:14},
  {s:'Sb',Z:51,r:133,c:'#44aa66',cat:'metalloid',row:5,col:15},{s:'Te',Z:52,r:123,c:'#44aa66',cat:'metalloid',row:5,col:16},
  {s:'I',Z:53,r:115,c:'#8855aa',cat:'halogen',row:5,col:17},{s:'Xe',Z:54,r:108,c:'#8877bb',cat:'noble',row:5,col:18},
  {s:'Cs',Z:55,r:298,c:'#ff6655',cat:'alkali',row:6,col:1},{s:'Ba',Z:56,r:253,c:'#e08040',cat:'alkaline',row:6,col:2},
  {s:'Hf',Z:72,r:208,c:'#5588aa',cat:'transition',row:6,col:4},{s:'Ta',Z:73,r:200,c:'#5588aa',cat:'transition',row:6,col:5},
  {s:'W',Z:74,r:193,c:'#5588aa',cat:'transition',row:6,col:6},{s:'Re',Z:75,r:188,c:'#5588aa',cat:'transition',row:6,col:7},
  {s:'Os',Z:76,r:185,c:'#5588aa',cat:'transition',row:6,col:8},{s:'Ir',Z:77,r:180,c:'#aabbcc',cat:'transition',row:6,col:9},
  {s:'Pt',Z:78,r:177,c:'#d0d0e0',cat:'transition',row:6,col:10},{s:'Au',Z:79,r:174,c:'#ffcc44',cat:'transition',row:6,col:11},
  {s:'Hg',Z:80,r:171,c:'#6699aa',cat:'transition',row:6,col:12},{s:'Tl',Z:81,r:156,c:'#6688aa',cat:'post',row:6,col:13},
  {s:'Pb',Z:82,r:154,c:'#6688aa',cat:'post',row:6,col:14},{s:'Bi',Z:83,r:143,c:'#997766',cat:'post',row:6,col:15},
  {s:'Po',Z:84,r:135,c:'#997766',cat:'post',row:6,col:16},{s:'At',Z:85,r:127,c:'#52304a',cat:'halogen',row:6,col:17},
  {s:'Rn',Z:86,r:120,c:'#8877bb',cat:'noble',row:6,col:18},
  {s:'Fr',Z:87,r:348,c:'#ff6655',cat:'alkali',row:7,col:1},{s:'Ra',Z:88,r:283,c:'#e08040',cat:'alkaline',row:7,col:2},
  {s:'Rf',Z:104,r:150,c:'#5588aa',cat:'transition',row:7,col:4},{s:'Db',Z:105,r:150,c:'#5588aa',cat:'transition',row:7,col:5},
  {s:'Sg',Z:106,r:150,c:'#5588aa',cat:'transition',row:7,col:6},{s:'Bh',Z:107,r:150,c:'#5588aa',cat:'transition',row:7,col:7},
  {s:'Hs',Z:108,r:150,c:'#5588aa',cat:'transition',row:7,col:8},{s:'Mt',Z:109,r:150,c:'#aabbcc',cat:'transition',row:7,col:9},
  {s:'Ds',Z:110,r:150,c:'#aabbcc',cat:'transition',row:7,col:10},{s:'Rg',Z:111,r:150,c:'#aabbcc',cat:'transition',row:7,col:11},
  {s:'Cn',Z:112,r:150,c:'#6699aa',cat:'transition',row:7,col:12},{s:'Nh',Z:113,r:150,c:'#6688aa',cat:'post',row:7,col:13},
  {s:'Fl',Z:114,r:150,c:'#6688aa',cat:'post',row:7,col:14},{s:'Mc',Z:115,r:150,c:'#6688aa',cat:'post',row:7,col:15},
  {s:'Lv',Z:116,r:150,c:'#6688aa',cat:'post',row:7,col:16},{s:'Ts',Z:117,r:150,c:'#52304a',cat:'halogen',row:7,col:17},
  {s:'Og',Z:118,r:150,c:'#8877bb',cat:'noble',row:7,col:18},
  {s:'La',Z:57,r:250,c:'#a09040',cat:'lanthanide',lan:1},{s:'Ce',Z:58,r:185,c:'#a09040',cat:'lanthanide',lan:2},
  {s:'Pr',Z:59,r:185,c:'#a09040',cat:'lanthanide',lan:3},{s:'Nd',Z:60,r:185,c:'#a09040',cat:'lanthanide',lan:4},
  {s:'Pm',Z:61,r:185,c:'#a09040',cat:'lanthanide',lan:5},{s:'Sm',Z:62,r:185,c:'#a09040',cat:'lanthanide',lan:6},
  {s:'Eu',Z:63,r:185,c:'#a09040',cat:'lanthanide',lan:7},{s:'Gd',Z:64,r:180,c:'#a09040',cat:'lanthanide',lan:8},
  {s:'Tb',Z:65,r:175,c:'#a09040',cat:'lanthanide',lan:9},{s:'Dy',Z:66,r:175,c:'#a09040',cat:'lanthanide',lan:10},
  {s:'Ho',Z:67,r:175,c:'#a09040',cat:'lanthanide',lan:11},{s:'Er',Z:68,r:175,c:'#a09040',cat:'lanthanide',lan:12},
  {s:'Tm',Z:69,r:175,c:'#a09040',cat:'lanthanide',lan:13},{s:'Yb',Z:70,r:175,c:'#a09040',cat:'lanthanide',lan:14},
  {s:'Lu',Z:71,r:175,c:'#a09040',cat:'lanthanide',lan:15},
  {s:'Ac',Z:89,r:260,c:'#887030',cat:'actinide',lan:1},{s:'Th',Z:90,r:237,c:'#887030',cat:'actinide',lan:2},
  {s:'Pa',Z:91,r:200,c:'#887030',cat:'actinide',lan:3},{s:'U',Z:92,r:196,c:'#887030',cat:'actinide',lan:4},
  {s:'Np',Z:93,r:190,c:'#887030',cat:'actinide',lan:5},{s:'Pu',Z:94,r:187,c:'#887030',cat:'actinide',lan:6},
  {s:'Am',Z:95,r:180,c:'#887030',cat:'actinide',lan:7},{s:'Cm',Z:96,r:169,c:'#887030',cat:'actinide',lan:8},
  {s:'Bk',Z:97,r:168,c:'#887030',cat:'actinide',lan:9},{s:'Cf',Z:98,r:168,c:'#887030',cat:'actinide',lan:10},
  {s:'Es',Z:99,r:165,c:'#887030',cat:'actinide',lan:11},{s:'Fm',Z:100,r:167,c:'#887030',cat:'actinide',lan:12},
  {s:'Md',Z:101,r:173,c:'#887030',cat:'actinide',lan:13},{s:'No',Z:102,r:176,c:'#887030',cat:'actinide',lan:14},
  {s:'Lr',Z:103,r:161,c:'#887030',cat:'actinide',lan:15},
];
const EL_MAP={};ELEMENTS.forEach(e=>{EL_MAP[e.s]=e;});
const CAT_CLASS={alkali:'ec-alkali',alkaline:'ec-alkaline',transition:'ec-transition',post:'ec-post',metalloid:'ec-metalloid',nonmetal:'ec-nonmetal',halogen:'ec-halogen',noble:'ec-noble',lanthanide:'ec-lanthanide',actinide:'ec-actinide'};

const STRUCTURES={
  fcc:{name:'FCC',lattice:'cubic',sg:'Fm-3m',sgN:225,a:3.52,alpha:90,sites:[{x:0,y:0,z:0,role:'A'},{x:.5,y:.5,z:0,role:'A'},{x:.5,y:0,z:.5,role:'A'},{x:0,y:.5,z:.5,role:'A'}],roles:['A']},
  bcc:{name:'BCC',lattice:'cubic',sg:'Im-3m',sgN:229,a:2.87,alpha:90,sites:[{x:0,y:0,z:0,role:'A'},{x:.5,y:.5,z:.5,role:'A'}],roles:['A']},
  sc:{name:'Simple cubic',lattice:'cubic',sg:'Pm-3m',sgN:221,a:3.0,alpha:90,sites:[{x:0,y:0,z:0,role:'A'}],roles:['A']},
  hcp:{name:'HCP',lattice:'hexagonal',sg:'P6_3/mmc',sgN:194,a:2.51,c:4.07,alpha:90,gamma:120,sites:[{x:0,y:0,z:0,role:'A'},{x:1/3,y:2/3,z:.5,role:'A'}],roles:['A']},
  diamond:{name:'Diamond',lattice:'cubic',sg:'Fd-3m',sgN:227,a:5.43,alpha:90,sites:[{x:0,y:0,z:0,role:'A'},{x:.5,y:.5,z:0,role:'A'},{x:.5,y:0,z:.5,role:'A'},{x:0,y:.5,z:.5,role:'A'},{x:.25,y:.25,z:.25,role:'A'},{x:.75,y:.75,z:.25,role:'A'},{x:.75,y:.25,z:.75,role:'A'},{x:.25,y:.75,z:.75,role:'A'}],roles:['A']},
  nacl:{name:'NaCl',lattice:'cubic',sg:'Fm-3m',sgN:225,a:5.64,alpha:90,sites:[{x:0,y:0,z:0,role:'A'},{x:.5,y:.5,z:0,role:'A'},{x:.5,y:0,z:.5,role:'A'},{x:0,y:.5,z:.5,role:'A'},{x:.5,y:0,z:0,role:'B'},{x:0,y:.5,z:0,role:'B'},{x:0,y:0,z:.5,role:'B'},{x:.5,y:.5,z:.5,role:'B'}],roles:['A','B']},
  zincblende:{name:'Zinc blende',lattice:'cubic',sg:'F-43m',sgN:216,a:5.41,alpha:90,sites:[{x:0,y:0,z:0,role:'A'},{x:.5,y:.5,z:0,role:'A'},{x:.5,y:0,z:.5,role:'A'},{x:0,y:.5,z:.5,role:'A'},{x:.25,y:.25,z:.25,role:'B'},{x:.75,y:.75,z:.25,role:'B'},{x:.75,y:.25,z:.75,role:'B'},{x:.25,y:.75,z:.75,role:'B'}],roles:['A','B']},
  perovskite:{name:'Perovskite',lattice:'cubic',sg:'Pm-3m',sgN:221,a:3.91,alpha:90,sites:[{x:0,y:0,z:0,role:'A'},{x:.5,y:.5,z:.5,role:'B'},{x:.5,y:.5,z:0,role:'O'},{x:.5,y:0,z:.5,role:'O'},{x:0,y:.5,z:.5,role:'O'}],roles:['A','B','O']},
  spinel:{name:'Spinel',lattice:'cubic',sg:'Fd-3m',sgN:227,a:8.08,alpha:90,sites:[{x:0,y:0,z:0,role:'A'},{x:.5,y:.5,z:0,role:'A'},{x:.5,y:0,z:.5,role:'A'},{x:0,y:.5,z:.5,role:'A'},{x:.25,y:.25,z:.25,role:'B'},{x:.75,y:.75,z:.25,role:'B'},{x:.75,y:.25,z:.75,role:'B'},{x:.25,y:.75,z:.75,role:'B'},{x:.375,y:.375,z:.375,role:'O'},{x:.875,y:.875,z:.375,role:'O'},{x:.875,y:.375,z:.875,role:'O'},{x:.375,y:.875,z:.875,role:'O'},{x:.125,y:.125,z:.125,role:'O'},{x:.625,y:.625,z:.125,role:'O'},{x:.625,y:.125,z:.625,role:'O'},{x:.125,y:.625,z:.625,role:'O'}],roles:['A','B','O']}
};

const CP={blue:{lo:[15,25,80],hi:[160,210,255]},red:{lo:[60,10,10],hi:[255,160,140]},green:{lo:[10,40,20],hi:[130,255,160]},purple:{lo:[30,10,60],hi:[200,150,255]}};
const BP={orange:{lo:[30,12,2],hi:[255,170,50]},teal:{lo:[3,25,30],hi:[50,220,205]},pink:{lo:[45,8,28],hi:[255,140,195]},gold:{lo:[30,24,3],hi:[235,205,70]}};
function lerp3(lo,hi,t){return lo.map((v,i)=>Math.round(v+(hi[i]-v)*t));}
function rgb(a){return'rgb('+a[0]+','+a[1]+','+a[2]+')';}
function getCPal(){return CP[document.getElementById('sel-cp').value];}
function getBPal(){return BP[document.getElementById('sel-bp').value];}
function chargeToColor(c,all){var mx=Math.max.apply(null,all.map(Math.abs));mx=Math.max(mx,0.001);var t=Math.max(0,Math.min(1,(c/mx+1)/2));return rgb(lerp3(getCPal().lo,getCPal().hi,t));}
function bondLenColor(l,mn,mx){var t=mx>mn?(l-mn)/(mx-mn):0.5;return rgb(lerp3(getBPal().lo,getBPal().hi,t));}

var elAssign={A:'Ni',B:'Cl',O:'O'};
var selectedEl=null,mode='unitcell';
var flags={showBonds:true,showLabels:true,showCharges:true,showBondLens:true,showUCBox:true,showAxes:true};
var spinning=true,rotX=0.35,rotY=0.45,dragging=false,lastMX=0,lastMY=0,spinRAF=null;
var currentAtoms=[],currentBonds=[],ucVecs=[[1,0,0],[0,1,0],[0,0,1]],hoveredAtom=null;
var lastBuildResult=null;

var canvas=document.getElementById('mol-canvas');
var ctx=canvas?canvas.getContext('2d'):null;

function tog(flag,btnId){flags[flag]=!flags[flag];document.getElementById(btnId).classList.toggle('active',flags[flag]);render();}
function switchTab(t){
  ['pt','export','import','formula','search'].forEach(function(id){
    var el=document.getElementById('tab-'+id);
    el.style.display=id===t?'flex':'none';
    if(id===t)el.style.flexDirection='column';
    document.getElementById('tab-'+id+'-btn').classList.toggle('active',id===t);
  });
}

function buildPT(){
  var grid=document.getElementById('pt-grid');grid.innerHTML='';
  var cells=new Array(7*18).fill(null);
  ELEMENTS.filter(function(e){return e.row&&!e.lan;}).forEach(function(e){cells[(e.row-1)*18+(e.col-1)]=e;});
  cells.forEach(function(el){
    var d=document.createElement('div');
    d.className='el-cell '+(el?(CAT_CLASS[el.cat]||'ec-transition'):'empty');
    if(el){d.textContent=el.s;d.title=el.s+' Z='+el.Z;d.dataset.sym=el.s;d.onclick=function(){selectEl(el.s);};}
    grid.appendChild(d);
  });
  ['pt-lan','pt-act'].forEach(function(id,ri){
    var container=document.getElementById(id);container.innerHTML='';
    ELEMENTS.filter(function(e){return ri===0?e.cat==='lanthanide':e.cat==='actinide';}).sort(function(a,b){return a.lan-b.lan;}).forEach(function(el){
      var d=document.createElement('div');d.className='el-cell '+(ri===0?'ec-lanthanide':'ec-actinide');
      d.textContent=el.s;d.title=el.s+' Z='+el.Z;d.dataset.sym=el.s;d.onclick=function(){selectEl(el.s);};container.appendChild(d);
    });
  });
}

function selectEl(sym){
  var e=EL_MAP[sym];if(!e)return;
  selectedEl=sym;
  document.querySelectorAll('.el-cell').forEach(function(c){c.classList.remove('selected');});
  document.querySelectorAll('[data-sym="'+sym+'"]').forEach(function(c){c.classList.add('selected');});
  document.getElementById('sel-badge').textContent=sym+' Z='+e.Z;
}
function onElInput(v){
  var sym=v.charAt(0).toUpperCase()+v.slice(1).toLowerCase();
  if(EL_MAP[sym])selectEl(sym);
}
function setRole(role){
  if(!selectedEl){
    var sb=document.getElementById('sel-badge');var orig=sb.textContent;
    sb.textContent='pick element first';sb.style.color='#ff8888';
    setTimeout(function(){sb.textContent=orig;sb.style.color='#adc8ff';},1200);return;
  }
  elAssign[role]=selectedEl;
  updateAssignDisplay();updateInfoPanel();rebuild();
}
function updateAssignDisplay(){
  var sp=getStrParams();var display=document.getElementById('el-assign-display');display.innerHTML='';
  var roleColors={A:'#5580ff',B:'#ff8040',O:'#40cc80'};
  sp.roles.forEach(function(role){
    var sym=getElSym(role);
    var b=document.createElement('span');b.className='role-badge';
    b.style.background=roleColors[role]+'33';b.style.border='0.5px solid '+roleColors[role]+'88';b.style.color=roleColors[role];
    b.textContent=role+'='+sym;display.appendChild(b);
  });
}
function getElSym(role){return elAssign[role]||{A:'Ni',B:'Cl',O:'O'}[role];}
function getElColor(role){var e=EL_MAP[getElSym(role)];return e?e.c:'#aaaaaa';}
function getElR(role){var e=EL_MAP[getElSym(role)];return e?Math.max(9,(e.r/140)*17):13;}
function toRgb(hex){if(!hex||hex.indexOf('rgb')===0)return hex||'rgb(128,128,128)';return'rgb('+parseInt(hex.slice(1,3),16)+','+parseInt(hex.slice(3,5),16)+','+parseInt(hex.slice(5,7),16)+')';}
function blendW(col,t){var m=toRgb(col).match(/\d+/g);return'rgb('+Math.round(+m[0]+(255-+m[0])*t)+','+Math.round(+m[1]+(255-+m[1])*t)+','+Math.round(+m[2]+(255-+m[2])*t)+')';}
function dkn(col,t){var m=toRgb(col).match(/\d+/g);return'rgb('+Math.round(+m[0]*(1-t))+','+Math.round(+m[1]*(1-t))+','+Math.round(+m[2]*(1-t))+')';}

function getLatt(sp,lo){
  var a=(lo&&lo.a)||sp.a,b=(lo&&lo.b)||a,c=(lo&&lo.c)||(sp.c||a);
  var ga=(lo&&lo.gamma)||(sp.gamma||90);
  if(sp.lattice==='hexagonal'||ga===120)
    return{a:a,b:a,c:c,alpha:90,beta:90,gamma:120,vecs:[[a,0,0],[-a/2,a*Math.sqrt(3)/2,0],[0,0,c]]};
  return{a:a,b:b,c:c,alpha:90,beta:90,gamma:90,vecs:[[a,0,0],[0,b,0],[0,0,c]]};
}
function getLatOverride(){
  function v(id){var val=parseFloat(document.getElementById(id).value);return isNaN(val)?null:val;}
  return{a:v('lat-a'),b:v('lat-b'),c:v('lat-c'),alpha:v('lat-al'),beta:v('lat-be'),gamma:v('lat-ga')};
}

function buildUC(sp,sc){
  var lo=getLatOverride(),lat=getLatt(sp,lo),latt=lat.vecs;
  var nx=sc[0],ny=sc[1],nz=sc[2],atoms=[],seen=new Set();
  for(var ix=0;ix<nx;ix++)for(var iy=0;iy<ny;iy++)for(var iz=0;iz<nz;iz++){
    sp.sites.forEach(function(site){
      var fx=site.x+ix,fy=site.y+iy,fz=site.z+iz;
      if(fx>nx-1e-6||fy>ny-1e-6||fz>nz-1e-6)return;
      var key=fx.toFixed(4)+','+fy.toFixed(4)+','+fz.toFixed(4)+','+site.role;
      if(seen.has(key))return;seen.add(key);
      atoms.push({x:fx*latt[0][0]+fy*latt[1][0]+fz*latt[2][0],y:fx*latt[0][1]+fy*latt[1][1]+fz*latt[2][1],z:fx*latt[0][2]+fy*latt[1][2]+fz*latt[2][2],role:site.role,id:atoms.length});
    });
  }
  var ucV=[[nx*latt[0][0],nx*latt[0][1],nx*latt[0][2]],[ny*latt[1][0],ny*latt[1][1],ny*latt[1][2]],[nz*latt[2][0],nz*latt[2][1],nz*latt[2][2]]];
  return{atoms:atoms,ucV:ucV,lat:Object.assign({},lat,{a:lat.a*nx,b:lat.b*ny,c:lat.c*nz})};
}
function buildSlab(sp,layers,surfStr){
  var lo=getLatOverride(),lat=getLatt(sp,lo),latt=lat.vecs;
  var h=parseInt(surfStr[0])||1,k=parseInt(surfStr[1])||0,l=parseInt(surfStr[2])||0;
  var atoms=[],seen=new Set(),rng=Math.max(layers+2,5);
  for(var ix=-rng;ix<=rng;ix++)for(var iy=-rng;iy<=rng;iy++)for(var iz=-rng;iz<=rng;iz++){
    sp.sites.forEach(function(site){
      var fx=site.x+ix,fy=site.y+iy,fz=site.z+iz;
      var proj=fx*h+fy*k+fz*l;if(proj<-0.5||proj>layers+0.5)return;
      var cx=fx*latt[0][0]+fy*latt[1][0]+fz*latt[2][0],cy_=fx*latt[0][1]+fy*latt[1][1]+fz*latt[2][1],cz_=fx*latt[0][2]+fy*latt[1][2]+fz*latt[2][2];
      var key=cx.toFixed(3)+','+cy_.toFixed(3)+','+cz_.toFixed(3);if(seen.has(key))return;seen.add(key);
      atoms.push({x:cx,y:cy_,z:cz_,role:site.role,id:atoms.length});
    });
  }
  var a=lat.a;
  return{atoms:atoms,ucV:[[3*a,0,0],[0,3*a,0],[0,0,layers*a/Math.sqrt(h*h+k*k+l*l)]],lat:lat};
}
function assignCharges(atoms,sp){
  var map={A:0.417,B:-0.417,O:-0.834};
  atoms.forEach(function(a){a.charge=sp.roles.length>1?(map[a.role]||0):0;});
}
function computeBonds(atoms,sp){
  var cutoff=sp.a*0.86,bonds=[],n=Math.min(atoms.length,500);
  for(var i=0;i<n;i++)for(var j=i+1;j<n;j++){
    var dx=atoms[i].x-atoms[j].x,dy=atoms[i].y-atoms[j].y,dz=atoms[i].z-atoms[j].z;
    var d=Math.sqrt(dx*dx+dy*dy+dz*dz);
    if(d<cutoff)bonds.push({a:i,b:j,len:parseFloat(d.toFixed(4))});
  }
  return bonds;
}
function clamp(v,lo,hi){return Math.max(lo,Math.min(hi,v));}
function getStrParams(){return STRUCTURES[document.getElementById('sel-struct').value];}

function rebuild(){
  var sp=getStrParams();
  var nx=clamp(parseInt(document.getElementById('inp-nx').value)||2,1,5);
  var ny=clamp(parseInt(document.getElementById('inp-ny').value)||2,1,5);
  var nz=clamp(parseInt(document.getElementById('inp-nz').value)||2,1,5);
  var layers=clamp(parseInt(document.getElementById('inp-layers').value)||4,2,8);
  var surf=document.getElementById('sel-surf').value;
  var r=mode==='slab'?buildSlab(sp,layers,surf):buildUC(sp,mode==='super'?[nx,ny,nz]:[1,1,1]);
  currentAtoms=r.atoms;ucVecs=r.ucV;lastBuildResult=r;
  assignCharges(currentAtoms,sp);currentBonds=computeBonds(currentAtoms,sp);
  document.getElementById('info-atoms').textContent=currentAtoms.length;
  updateFormulaBadge();render();
  if(typeof window.smadStructureUpdate==='function')window.smadStructureUpdate(currentAtoms,ucVecs);
}
function setMode(m){
  mode=m;
  ['btn-uc','btn-ss','btn-slab'].forEach(function(id){document.getElementById(id).classList.remove('active');});
  document.getElementById({unitcell:'btn-uc',super:'btn-ss',slab:'btn-slab'}[m]).classList.add('active');
  updateInfoPanel();rebuild();
}
function onStructChange(){rebuild();updateInfoPanel();updateAssignDisplay();}
function updateInfoPanel(){
  var sp=getStrParams();var mstr={unitcell:'Unit cell',super:'Supercell',slab:'Slab'}[mode];
  document.getElementById('info-name').textContent=sp.name+' \u2014 '+mstr;
  document.getElementById('info-latt').textContent=sp.lattice;
  document.getElementById('info-a').textContent=sp.a.toFixed(3);
  document.getElementById('info-sg').textContent=sp.sg;
  var r=sp.roles;
  document.getElementById('info-els').textContent=getElSym('A')+(r.indexOf('B')>=0?'/'+getElSym('B'):'')+(r.indexOf('O')>=0?'/'+getElSym('O'):'');
}
function updateFormulaBadge(){
  var counts={};
  currentAtoms.forEach(function(a){var s=getElSym(a.role);counts[s]=(counts[s]||0)+1;});
  var formula=Object.entries(counts).map(function(e){return e[0]+(e[1]>1?e[1]:'');}).join('');
  document.getElementById('info-formula').textContent=formula||'\u2014';
}

function parseFormula(f){
  var results=[],re=/([A-Z][a-z]?)(\d*)/g,m;
  while((m=re.exec(f))!==null){if(m[1]&&EL_MAP[m[1]])results.push({sym:m[1],count:parseInt(m[2])||1});}
  return results;
}
function onFormulaInput(v){
  var parts=parseFormula(v);
  var prev=document.getElementById('formula-preview');
  var roleOut=document.getElementById('formula-role-out');
  if(!parts.length){prev.textContent='';roleOut.textContent='';return;}
  prev.textContent='Parsed: '+parts.map(function(p){return p.sym+(p.count>1?p.count:'');}).join('');
  var roles=['A','B','O'],assignment=[];
  parts.slice(0,3).forEach(function(p,i){assignment.push(roles[i]+'='+p.sym);});
  roleOut.textContent=assignment.join('  ');
}
function applyFormula(){
  var v=document.getElementById('formula-inp').value;
  var parts=parseFormula(v);if(!parts.length)return;
  var roles=['A','B','O'];
  parts.slice(0,3).forEach(function(p,i){elAssign[roles[i]]=p.sym;});
  var n=parts.length;
  var structMap={1:'fcc',2:'zincblende',3:'perovskite'};
  var targetStruct=structMap[Math.min(n,3)]||'fcc';
  if(n===2&&(parts[0].count!==1||parts[1].count!==1))targetStruct='nacl';
  document.getElementById('sel-struct').value=targetStruct;
  updateAssignDisplay();updateInfoPanel();rebuild();
  showToast('Applied: '+parts.map(function(p){return p.sym;}).join(''));
}
function quickFormula(f){document.getElementById('formula-inp').value=f;onFormulaInput(f);applyFormula();}

function parseXYZ(text){
  var lines=text.trim().split('\n'),n=parseInt(lines[0]);if(!n)return null;
  var atoms=[];
  for(var i=2;i<2+n&&i<lines.length;i++){
    var parts=lines[i].trim().split(/\s+/);
    if(parts.length<4)continue;var sym=parts[0];if(!EL_MAP[sym])continue;
    atoms.push({sym:sym,x:parseFloat(parts[1]),y:parseFloat(parts[2]),z:parseFloat(parts[3])});
  }
  return atoms.length?{atoms:atoms,type:'xyz'}:null;
}
function parsePOSCAR(text){
  var lines=text.trim().split('\n');if(lines.length<8)return null;
  try{
    var scale=parseFloat(lines[1]);
    var a1=lines[2].trim().split(/\s+/).map(Number).map(function(v){return v*scale;});
    var a2=lines[3].trim().split(/\s+/).map(Number).map(function(v){return v*scale;});
    var a3=lines[4].trim().split(/\s+/).map(Number).map(function(v){return v*scale;});
    var syms=lines[5].trim().split(/\s+/);
    var counts=lines[6].trim().split(/\s+/).map(Number);
    var posLine=7,isDirect=lines[7].trim().toLowerCase().charAt(0)==='d';
    if(lines[7].trim().toLowerCase().charAt(0)==='s'){posLine=9;isDirect=lines[9].trim().toLowerCase().charAt(0)==='d';}
    var atoms=[],si=0;
    counts.forEach(function(cnt,ci){
      for(var i=0;i<cnt;i++){
        var parts=lines[posLine+si].trim().split(/\s+/).map(Number);si++;
        var x,y,z;
        if(isDirect){x=parts[0]*a1[0]+parts[1]*a2[0]+parts[2]*a3[0];y=parts[0]*a1[1]+parts[1]*a2[1]+parts[2]*a3[1];z=parts[0]*a1[2]+parts[1]*a2[2]+parts[2]*a3[2];}
        else{x=parts[0];y=parts[1];z=parts[2];}
        atoms.push({sym:syms[ci]||'X',x:x,y:y,z:z});
      }
    });
    return{atoms:atoms,type:'poscar'};
  }catch(e){return null;}
}
function parseCIF(text){
  var atoms=[];
  var aM=text.match(/_cell_length_a\s+([\d.]+)/),bM=text.match(/_cell_length_b\s+([\d.]+)/),cM=text.match(/_cell_length_c\s+([\d.]+)/);
  var a=aM?parseFloat(aM[1]):5,b=bM?parseFloat(bM[1]):a,c=cM?parseFloat(cM[1]):a;
  var re=/_atom_site_fract_x[\s\S]*?(?=loop_|$)/;var block=text.match(re);if(!block)return null;
  var rows=block[0].trim().split('\n').filter(function(l){return!/^_/.test(l.trim())&&l.trim()&&l.trim().charAt(0)!=='#';});
  rows.forEach(function(row){
    var p=row.trim().split(/\s+/);
    if(p.length>=5){var sym=p[1].replace(/[^A-Za-z]/g,'');if(EL_MAP[sym])atoms.push({sym:sym,x:parseFloat(p[2])*a,y:parseFloat(p[3])*b,z:parseFloat(p[4])*c});}
  });
  return atoms.length?{atoms:atoms,type:'cif',a:a,b:b,c:c}:null;
}
function parsePDB(text){
  var atoms=[];
  text.split('\n').forEach(function(line){
    if(line.indexOf('ATOM')===0||line.indexOf('HETATM')===0){
      var sym=(line.slice(76,78).trim()||line.slice(12,14).trim()).replace(/[^A-Za-z]/g,'');
      if(!EL_MAP[sym])return;
      var x=parseFloat(line.slice(30,38)),y=parseFloat(line.slice(38,46)),z=parseFloat(line.slice(46,54));
      if(!isNaN(x))atoms.push({sym:sym,x:x,y:y,z:z});
    }
  });
  return atoms.length?{atoms:atoms,type:'pdb'}:null;
}
function parseFromText(text){
  if(!text.trim()){showToast('Paste text first','error');return;}
  var result=null;
  if(text.indexOf('_atom_site')>=0)result=parseCIF(text);
  else if(text.indexOf('ATOM')===0||text.indexOf('CRYST1')>=0)result=parsePDB(text);
  else if(/^\d+\s*$/.test(text.split('\n')[0].trim()))result=parseXYZ(text);
  else result=parsePOSCAR(text);
  if(result)loadImportedAtoms(result);
  else showToast('Could not parse format','error');
}
function loadImportedAtoms(result){
  var syms=[...new Set(result.atoms.map(function(a){return a.sym;}))];
  var roles=['A','B','O'];syms.slice(0,3).forEach(function(s,i){elAssign[roles[i]]=s;});
  var fakeAtoms=result.atoms.map(function(a,i){var roleIdx=syms.indexOf(a.sym);return{x:a.x,y:a.y,z:a.z,role:roles[Math.min(roleIdx,2)],id:i,charge:0};});
  var xs=fakeAtoms.map(function(a){return a.x;}),ys=fakeAtoms.map(function(a){return a.y;}),zs=fakeAtoms.map(function(a){return a.z;});
  var cx=(Math.max.apply(null,xs)+Math.min.apply(null,xs))/2,cy=(Math.max.apply(null,ys)+Math.min.apply(null,ys))/2,cz=(Math.max.apply(null,zs)+Math.min.apply(null,zs))/2;
  fakeAtoms.forEach(function(a){a.x-=cx;a.y-=cy;a.z-=cz;});
  var sp={a:Math.max.apply(null,xs)-Math.min.apply(null,xs)||5,roles:roles.slice(0,syms.length)};
  currentAtoms=fakeAtoms;currentBonds=computeBonds(currentAtoms,sp);
  var span=sp.a;ucVecs=[[span,0,0],[0,span,0],[0,0,span]];
  document.getElementById('info-atoms').textContent=fakeAtoms.length;
  document.getElementById('info-name').textContent='Imported \u2014 '+result.type.toUpperCase();
  updateAssignDisplay();updateFormulaBadge();render();
  showToast('Loaded '+fakeAtoms.length+' atoms ('+result.type.toUpperCase()+')');
}
function onFileDrop(e){e.preventDefault();document.getElementById('drop-zone').classList.remove('over');var f=e.dataTransfer.files[0];if(f)readFile(f);}
function onFileInput(inp){if(inp.files[0])readFile(inp.files[0]);}
function readFile(f){
  var status=document.getElementById('import-status');status.textContent='Reading '+f.name+'...';
  var reader=new FileReader();
  reader.onload=function(ev){parseFromText(ev.target.result);status.textContent='Loaded: '+f.name;};
  reader.onerror=function(){status.textContent='Error reading file';};
  reader.readAsText(f);
}

function getExportData(){
  var sp=getStrParams();var lat=lastBuildResult?lastBuildResult.lat:getLatt(sp,getLatOverride());
  var syms=currentAtoms.map(function(a){return getElSym(a.role);});
  var uniqueSyms=[...new Set(syms)];
  return{sp:sp,lat:lat,atoms:currentAtoms,syms:syms,uniqueSyms:uniqueSyms};
}
var MASS={H:1.008,He:4.003,Li:6.941,Be:9.012,B:10.811,C:12.011,N:14.007,O:15.999,F:18.998,Ne:20.18,Na:22.99,Mg:24.305,Al:26.982,Si:28.086,P:30.974,S:32.065,Cl:35.453,Ar:39.948,K:39.098,Ca:40.078,Sc:44.956,Ti:47.867,V:50.942,Cr:51.996,Mn:54.938,Fe:55.845,Co:58.933,Ni:58.693,Cu:63.546,Zn:65.38,Ga:69.723,Ge:72.63,As:74.922,Se:78.96,Br:79.904,Kr:83.798,Rb:85.468,Sr:87.62,Y:88.906,Zr:91.224,Nb:92.906,Mo:95.96,Ru:101.07,Rh:102.906,Pd:106.42,Ag:107.868,Cd:112.411,Sn:118.71,I:126.904,Cs:132.905,Ba:137.327,La:138.905,Hf:178.49,Ta:180.948,W:183.84,Re:186.207,Os:190.23,Ir:192.217,Pt:195.084,Au:196.967,Pb:207.2,Bi:208.98,U:238.029};

function genCIF(){
  var d=getExportData(),sp=d.sp,lat=d.lat,atoms=d.atoms,syms=d.syms;
  var a=lat.a.toFixed(6),b=(lat.b||lat.a).toFixed(6),c=(lat.c||lat.a).toFixed(6);
  var al=(lat.alpha||90).toFixed(4),be=(lat.beta||90).toFixed(4),ga=(lat.gamma||90).toFixed(4);
  var s='data_'+sp.name.replace(/\s/g,'_')+'\n_cell_length_a '+a+'\n_cell_length_b '+b+'\n_cell_length_c '+c+'\n_cell_angle_alpha '+al+'\n_cell_angle_beta '+be+'\n_cell_angle_gamma '+ga+'\n_symmetry_space_group_name_H-M \''+sp.sg+'\'\nloop_\n_atom_site_label\n_atom_site_type_symbol\n_atom_site_fract_x\n_atom_site_fract_y\n_atom_site_fract_z\n';
  var lv=lat.vecs||[[lat.a,0,0],[0,lat.b||lat.a,0],[0,0,lat.c||lat.a]];
  var det=lv[0][0]*(lv[1][1]*lv[2][2]-lv[1][2]*lv[2][1])-lv[0][1]*(lv[1][0]*lv[2][2]-lv[1][2]*lv[2][0])+lv[0][2]*(lv[1][0]*lv[2][1]-lv[1][1]*lv[2][0]);
  var inv=[[lv[1][1]*lv[2][2]-lv[1][2]*lv[2][1],lv[0][2]*lv[2][1]-lv[0][1]*lv[2][2],lv[0][1]*lv[1][2]-lv[0][2]*lv[1][1]],[lv[1][2]*lv[2][0]-lv[1][0]*lv[2][2],lv[0][0]*lv[2][2]-lv[0][2]*lv[2][0],lv[0][2]*lv[1][0]-lv[0][0]*lv[1][2]],[lv[1][0]*lv[2][1]-lv[1][1]*lv[2][0],lv[0][1]*lv[2][0]-lv[0][0]*lv[2][1],lv[0][0]*lv[1][1]-lv[0][1]*lv[1][0]]].map(function(r){return r.map(function(v){return v/det;});});
  var counts={};
  atoms.forEach(function(a,i){var sym=syms[i];counts[sym]=(counts[sym]||0)+1;var lbl=sym+counts[sym];var fx=((inv[0][0]*a.x+inv[0][1]*a.y+inv[0][2]*a.z)%1+1)%1;var fy=((inv[1][0]*a.x+inv[1][1]*a.y+inv[1][2]*a.z)%1+1)%1;var fz=((inv[2][0]*a.x+inv[2][1]*a.y+inv[2][2]*a.z)%1+1)%1;s+=lbl.padEnd(8)+' '+sym.padEnd(4)+' '+fx.toFixed(6)+'  '+fy.toFixed(6)+'  '+fz.toFixed(6)+'\n';});
  return s;
}
function genPOSCAR(){
  var d=getExportData(),sp=d.sp,lat=d.lat,atoms=d.atoms,syms=d.syms,uniqueSyms=d.uniqueSyms;
  var lv=lat.vecs||[[lat.a,0,0],[0,lat.b||lat.a,0],[0,0,lat.c||lat.a]];
  var s=sp.name+' '+uniqueSyms.join(' ')+'\n1.0\n';
  s+=lv.map(function(v){return v.map(function(x){return x.toFixed(9).padStart(14);}).join('')+'\n';}).join('');
  s+=uniqueSyms.join('  ')+'\n'+uniqueSyms.map(function(sym){return atoms.filter(function(_,i){return syms[i]===sym;}).length;}).join('  ')+'\nCartesian\n';
  uniqueSyms.forEach(function(sym){atoms.forEach(function(a,i){if(syms[i]===sym)s+=a.x.toFixed(9).padStart(14)+a.y.toFixed(9).padStart(14)+a.z.toFixed(9).padStart(14)+'\n';});});
  return s;
}
function genXYZ(){
  var d=getExportData(),sp=d.sp,atoms=d.atoms,syms=d.syms;
  var s=atoms.length+'\n'+sp.name+'\n';
  atoms.forEach(function(a,i){s+=syms[i].padEnd(4)+' '+a.x.toFixed(6).padStart(12)+' '+a.y.toFixed(6).padStart(12)+' '+a.z.toFixed(6).padStart(12)+'\n';});
  return s;
}
function genLAMMPS(){
  var d=getExportData(),sp=d.sp,lat=d.lat,atoms=d.atoms,syms=d.syms,uniqueSyms=d.uniqueSyms;
  var xs=atoms.map(function(a){return a.x;}),ys=atoms.map(function(a){return a.y;}),zs=atoms.map(function(a){return a.z;});
  var pad=0.5;
  var s='# LAMMPS data file - '+sp.name+'\n'+atoms.length+' atoms\n'+uniqueSyms.length+' atom types\n'+(Math.min.apply(null,xs)-pad).toFixed(6)+' '+(Math.max.apply(null,xs)+pad).toFixed(6)+' xlo xhi\n'+(Math.min.apply(null,ys)-pad).toFixed(6)+' '+(Math.max.apply(null,ys)+pad).toFixed(6)+' ylo yhi\n'+(Math.min.apply(null,zs)-pad).toFixed(6)+' '+(Math.max.apply(null,zs)+pad).toFixed(6)+' zlo zhi\n\nMasses\n\n';
  uniqueSyms.forEach(function(sym,i){s+=(i+1)+' '+(MASS[sym]||100).toFixed(3)+'  # '+sym+'\n';});
  s+='\nAtoms # atomic\n\n';
  atoms.forEach(function(a,i){s+=(i+1)+' '+(uniqueSyms.indexOf(syms[i])+1)+' '+a.x.toFixed(6)+' '+a.y.toFixed(6)+' '+a.z.toFixed(6)+'\n';});
  return s;
}
function genPDB(){
  var d=getExportData(),sp=d.sp,lat=d.lat,atoms=d.atoms,syms=d.syms;
  var a=lat.a.toFixed(3),b=(lat.b||lat.a).toFixed(3),c=(lat.c||lat.a).toFixed(3);
  var al=(lat.alpha||90).toFixed(2),be=(lat.beta||90).toFixed(2),ga=(lat.gamma||90).toFixed(2);
  var s='REMARK Generated by Crystal Structure Builder\nCRYST1'+a.padStart(9)+b.padStart(9)+c.padStart(9)+al.padStart(7)+be.padStart(7)+ga.padStart(7)+' '+sp.sg.padEnd(12)+String(sp.sgN||1).padStart(4)+'\n';
  atoms.forEach(function(a,i){var sym=syms[i];var idx=String(i+1).padStart(5);s+='ATOM  '+idx+'  '+sym.padEnd(4)+'UNK A'+idx+'    '+a.x.toFixed(3).padStart(8)+a.y.toFixed(3).padStart(8)+a.z.toFixed(3).padStart(8)+'  1.00  0.00          '+sym.padStart(2)+'\n';});
  s+='END\n';return s;
}
function genGJF(){
  var d=getExportData(),sp=d.sp,atoms=d.atoms,syms=d.syms;
  var s='%chk='+sp.name+'.chk\n#p B3LYP/6-31G* Opt\n\n'+sp.name+'\n\n0 1\n';
  atoms.forEach(function(a,i){s+=syms[i].padEnd(4)+' '+a.x.toFixed(6).padStart(12)+' '+a.y.toFixed(6).padStart(12)+' '+a.z.toFixed(6).padStart(12)+'\n';});
  s+='\n';return s;
}
var FORMAT_FNS={cif:genCIF,poscar:genPOSCAR,xyz:genXYZ,lammps:genLAMMPS,pdb:genPDB,gjf:genGJF};
var FORMAT_EXT={cif:'cif',poscar:'POSCAR',xyz:'xyz',lammps:'lammps',pdb:'pdb',gjf:'gjf'};
function exportFile(fmt){
  var sp=getStrParams(),content=FORMAT_FNS[fmt]();
  var fname=fmt==='poscar'?'POSCAR':sp.name.replace(/\s/g,'_')+'.'+FORMAT_EXT[fmt];
  var blob=new Blob([content],{type:'text/plain'});var url=URL.createObjectURL(blob);
  var a=document.createElement('a');a.href=url;a.download=fname;a.click();URL.revokeObjectURL(url);
  showToast('Downloaded '+fname);
}
function copyFormat(fmt){var content=FORMAT_FNS[fmt]();navigator.clipboard.writeText(content).catch(function(){});showToast('Copied '+fmt.toUpperCase());}
function showToast(msg,type){var t=document.getElementById('toast');t.textContent=msg;t.style.background=type==='error'?'rgba(200,50,50,0.92)':'rgba(40,180,90,0.92)';t.style.display='block';setTimeout(function(){t.style.display='none';},2000);}

function rotP(x,y,z){var cy=Math.cos(rotY),sy=Math.sin(rotY);var x1=cy*x+sy*z,z1=-sy*x+cy*z;var cx2=Math.cos(rotX),sx2=Math.sin(rotX);return{x:x1,y:cx2*y-sx2*z1,z:sx2*y+cx2*z1};}

function drawSphere(x,y,r,col,pz,hov){
  var br=0.55+0.45*Math.max(0,pz/4);
  var g=ctx.createRadialGradient(x-r*.3,y-r*.3,r*.07,x,y,r*1.1);
  g.addColorStop(0,blendW(col,0.65));g.addColorStop(0.35,blendW(col,0.1+br*0.12));g.addColorStop(1,dkn(col,0.6));
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
  if(hov){ctx.beginPath();ctx.arc(x,y,r+3,0,Math.PI*2);ctx.strokeStyle='rgba(220,240,255,0.85)';ctx.lineWidth=2;ctx.stroke();}
  ctx.beginPath();ctx.arc(x-r*.27,y-r*.27,r*.25,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.22)';ctx.fill();
}
function drawScaleBars(){
  var allC=currentAtoms.map(function(a){return a.charge;});
  var allL=currentBonds.map(function(b){return b.len;});
  document.getElementById('charge-scale').style.display=flags.showCharges&&currentAtoms.length?'block':'none';
  document.getElementById('bond-scale').style.display=flags.showBonds&&flags.showBondLens&&currentBonds.length?'block':'none';
  if(currentAtoms.length){
    var mx=Math.max.apply(null,allC.map(Math.abs));mx=Math.max(mx,0.001);
    var cp=getCPal();var sc=document.getElementById('sc-c').getContext('2d');
    var g=sc.createLinearGradient(0,0,110,0);g.addColorStop(0,rgb(cp.lo));g.addColorStop(1,rgb(cp.hi));
    sc.fillStyle=g;sc.fillRect(0,0,110,9);
    document.getElementById('sc-cmin').textContent=(-mx).toFixed(2)+'e';
    document.getElementById('sc-cmax').textContent='+'+mx.toFixed(2)+'e';
  }
  if(allL.length){
    var bp=getBPal();var mn=Math.min.apply(null,allL),mxL=Math.max.apply(null,allL);
    var sb=document.getElementById('sc-b').getContext('2d');
    var g2=sb.createLinearGradient(0,0,110,0);g2.addColorStop(0,rgb(bp.lo));g2.addColorStop(1,rgb(bp.hi));
    sb.fillStyle=g2;sb.fillRect(0,0,110,9);
    document.getElementById('sc-bmin').textContent=mn.toFixed(3)+' A';
    document.getElementById('sc-bmax').textContent=mxL.toFixed(3)+' A';
  }
}

function render(){
  if(!canvas||!ctx)return;
  var W=canvas.offsetWidth||800,H=canvas.offsetHeight||600;
  canvas.width=W;canvas.height=H;
  ctx.fillStyle='#0a0c14';ctx.fillRect(0,0,W,H);
  for(var i=0;i<60;i++){ctx.beginPath();ctx.arc(Math.sin(i*137.5)*W*.48+W*.5,Math.cos(i*97.3)*220+H*.5,.6+.4*(i%2),0,Math.PI*2);ctx.fillStyle='rgba(200,210,255,'+(0.05+(i%5)*.018)+')';ctx.fill();}
  if(!currentAtoms.length){drawScaleBars();return;}
  var xs=currentAtoms.map(function(a){return a.x;}),ys=currentAtoms.map(function(a){return a.y;}),zs=currentAtoms.map(function(a){return a.z;});
  var cxc=(Math.max.apply(null,xs)+Math.min.apply(null,xs))/2,cyc=(Math.max.apply(null,ys)+Math.min.apply(null,ys))/2,czc=(Math.max.apply(null,zs)+Math.min.apply(null,zs))/2;
  var span=Math.max(Math.max.apply(null,xs)-Math.min.apply(null,xs),Math.max.apply(null,ys)-Math.min.apply(null,ys),Math.max.apply(null,zs)-Math.min.apply(null,zs),1);
  var scale=Math.min(W,H)*0.34/span;
  var proj=currentAtoms.map(function(a){var p=rotP(a.x-cxc,a.y-cyc,a.z-czc);return Object.assign({},a,{px:W/2+p.x*scale,py:H/2-p.y*scale,pz:p.z});});

  if(flags.showUCBox){
    var c8=[[0,0,0],[1,0,0],[0,1,0],[0,0,1],[1,1,0],[1,0,1],[0,1,1],[1,1,1]];
    var cp=c8.map(function(v){var i=v[0],j=v[1],k=v[2];var p=rotP(i*ucVecs[0][0]+j*ucVecs[1][0]+k*ucVecs[2][0]-cxc,i*ucVecs[0][1]+j*ucVecs[1][1]+k*ucVecs[2][1]-cyc,i*ucVecs[0][2]+j*ucVecs[1][2]+k*ucVecs[2][2]-czc);return{px:W/2+p.x*scale,py:H/2-p.y*scale};});
    ctx.strokeStyle='rgba(100,160,255,0.3)';ctx.lineWidth=0.8;ctx.setLineDash([4,4]);
    [[0,1],[0,2],[0,3],[1,4],[1,5],[2,4],[2,6],[3,5],[3,6],[4,7],[5,7],[6,7]].forEach(function(e){ctx.beginPath();ctx.moveTo(cp[e[0]].px,cp[e[0]].py);ctx.lineTo(cp[e[1]].px,cp[e[1]].py);ctx.stroke();});
    ctx.setLineDash([]);
  }

  var allC=currentAtoms.map(function(a){return a.charge;});
  var allL=currentBonds.map(function(b){return b.len;});
  var mnL=allL.length?Math.min.apply(null,allL):0,mxL=allL.length?Math.max.apply(null,allL):1;
  proj.sort(function(a,b){return a.pz-b.pz;});

  if(flags.showBonds){
    currentBonds.forEach(function(bond){
      var a=proj[bond.a],b=proj[bond.b];if(!a||!b)return;
      var bondCol=bondLenColor(bond.len,mnL,mxL);
      var ca=flags.showCharges?chargeToColor(a.charge,allC):toRgb(getElColor(a.role));
      var cb=flags.showCharges?chargeToColor(b.charge,allC):toRgb(getElColor(b.role));
      var mx2=(a.px+b.px)/2,my2=(a.py+b.py)/2;
      var gA=ctx.createLinearGradient(a.px,a.py,mx2,my2);gA.addColorStop(0,blendW(ca,.15));gA.addColorStop(1,blendW(bondCol,.08));
      ctx.strokeStyle=gA;ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a.px,a.py);ctx.lineTo(mx2,my2);ctx.stroke();
      var gB=ctx.createLinearGradient(mx2,my2,b.px,b.py);gB.addColorStop(0,blendW(bondCol,.08));gB.addColorStop(1,blendW(cb,.15));
      ctx.strokeStyle=gB;ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(mx2,my2);ctx.lineTo(b.px,b.py);ctx.stroke();
      ctx.strokeStyle='rgba(255,255,255,0.07)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(a.px,a.py);ctx.lineTo(b.px,b.py);ctx.stroke();
      if(flags.showBondLens){
        var txt=bond.len.toFixed(3)+' A';ctx.font='bold 9px monospace';ctx.textAlign='center';
        var tw=ctx.measureText(txt).width;ctx.fillStyle='rgba(5,8,22,0.85)';
        ctx.beginPath();if(ctx.roundRect)ctx.roundRect(mx2-tw/2-3,my2-15,tw+6,12,2);else ctx.rect(mx2-tw/2-3,my2-15,tw+6,12);ctx.fill();
        ctx.fillStyle=bondCol;ctx.fillText(txt,mx2,my2-5);
      }
    });
  }

  proj.forEach(function(a){
    var r=getElR(a.role)*(1+a.pz/span*0.12);
    var col=flags.showCharges?chargeToColor(a.charge,allC):toRgb(getElColor(a.role));
    drawSphere(a.px,a.py,r,col,a.pz,hoveredAtom===a.id);
    if(flags.showLabels&&r>7){ctx.font='bold '+Math.max(8,Math.round(r*.65))+'px monospace';ctx.textAlign='center';ctx.fillStyle='rgba(255,255,255,0.92)';ctx.shadowColor='rgba(0,0,0,0.95)';ctx.shadowBlur=4;ctx.fillText(getElSym(a.role),a.px,a.py+r*.28);ctx.shadowBlur=0;}
    if(flags.showCharges){
      var sign=a.charge>0?'+':'';var txt=sign+a.charge.toFixed(3)+'e';var cc=chargeToColor(a.charge,allC);
      ctx.font='bold 8px monospace';ctx.textAlign='center';var tw=ctx.measureText(txt).width;
      ctx.fillStyle='rgba(5,8,22,0.85)';ctx.beginPath();if(ctx.roundRect)ctx.roundRect(a.px-tw/2-3,a.py+r+1,tw+6,12,2);else ctx.rect(a.px-tw/2-3,a.py+r+1,tw+6,12);ctx.fill();
      ctx.fillStyle=cc;ctx.shadowColor='rgba(0,0,0,0.8)';ctx.shadowBlur=3;ctx.fillText(txt,a.px,a.py+r+10);ctx.shadowBlur=0;
    }
  });

  if(flags.showAxes){
    var axLen=Math.min(W,H)*0.12;var originX=40+axLen,originY=H-40-axLen;
    var axDefs=[{v:[1,0,0],c:'#ff5555',l:'X'},{v:[0,1,0],c:'#55ee88',l:'Y'},{v:[0,0,1],c:'#5599ff',l:'Z'}];
    axDefs.forEach(function(ax){
      var p=rotP(ax.v[0]*axLen,ax.v[1]*axLen,ax.v[2]*axLen);
      ctx.strokeStyle=ax.c;ctx.lineWidth=2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(originX,originY);ctx.lineTo(originX+p.x,originY-p.y);ctx.stroke();
      ctx.fillStyle=ax.c;ctx.font='bold 11px monospace';ctx.textAlign='center';
      ctx.shadowColor='rgba(0,0,0,0.9)';ctx.shadowBlur=4;
      ctx.fillText(ax.l,originX+p.x+(p.x>=0?9:-9),originY-p.y+(p.y<=0?9:-9));ctx.shadowBlur=0;
    });
  }
  if(mode==='slab'){var surf=document.getElementById('sel-surf').value;ctx.fillStyle='rgba(120,190,255,0.6)';ctx.font='bold 10px monospace';ctx.textAlign='left';ctx.fillText('Surface ('+surf.split('').join(' ')+')',10,16);}
  drawScaleBars();
}

function findHov(mx,my){
  if(!currentAtoms.length)return null;
  var W=canvas.offsetWidth||800,H=canvas.offsetHeight||600;
  var xs=currentAtoms.map(function(a){return a.x;}),ys=currentAtoms.map(function(a){return a.y;}),zs=currentAtoms.map(function(a){return a.z;});
  var cxc=(Math.max.apply(null,xs)+Math.min.apply(null,xs))/2,cyc=(Math.max.apply(null,ys)+Math.min.apply(null,ys))/2,czc=(Math.max.apply(null,zs)+Math.min.apply(null,zs))/2;
  var span=Math.max(Math.max.apply(null,xs)-Math.min.apply(null,xs),Math.max.apply(null,ys)-Math.min.apply(null,ys),Math.max.apply(null,zs)-Math.min.apply(null,zs),1);
  var scale=Math.min(W,H)*0.34/span;
  var proj=currentAtoms.map(function(a){var p=rotP(a.x-cxc,a.y-cyc,a.z-czc);return Object.assign({},a,{px:W/2+p.x*scale,py:H/2-p.y*scale,pz:p.z});});
  proj.sort(function(a,b){return b.pz-a.pz;});
  for(var i=0;i<proj.length;i++){var a=proj[i];var r=getElR(a.role)*(1+a.pz/span*0.12);if((mx-a.px)*(mx-a.px)+(my-a.py)*(my-a.py)<=r*r)return a;}return null;
}
function updateHov(a){
  if(!a){['info-hov','info-hc','info-hb'].forEach(function(id){document.getElementById(id).textContent='\u2014';});document.getElementById('info-hc').style.color='';document.getElementById('info-hl').innerHTML='\u2014';return;}
  var allC=currentAtoms.map(function(x){return x.charge;});var allL=currentBonds.map(function(b){return b.len;});
  var mn=Math.min.apply(null,allL.concat([0])),mx2=Math.max.apply(null,allL.concat([1]));
  document.getElementById('info-hov').textContent=getElSym(a.role)+' ('+a.role+')';
  var cc=chargeToColor(a.charge,allC);var ce=document.getElementById('info-hc');ce.style.color=cc;ce.textContent=(a.charge>0?'+':'')+a.charge.toFixed(3)+' e';
  var bonds=currentBonds.filter(function(b){return b.a===a.id||b.b===a.id;});
  document.getElementById('info-hb').textContent=bonds.length;
  document.getElementById('info-hl').innerHTML=bonds.slice(0,5).map(function(b){var bc=bondLenColor(b.len,mn,mx2);return'<span style="color:'+bc+';font-weight:600">'+b.len.toFixed(3)+'</span>';}).join(' ')||'\u2014';
}

canvas.addEventListener('mousedown',function(e){dragging=true;lastMX=e.clientX;lastMY=e.clientY;});
canvas.addEventListener('mousemove',function(e){
  var rect=canvas.getBoundingClientRect();
  var mx=(e.clientX-rect.left)*(canvas.width/rect.width),my=(e.clientY-rect.top)*(canvas.height/rect.height);
  if(dragging){rotY+=(e.clientX-lastMX)*0.012;rotX+=(e.clientY-lastMY)*0.012;lastMX=e.clientX;lastMY=e.clientY;render();}
  else{var a=findHov(mx,my);var nid=a?a.id:null;if(nid!==hoveredAtom){hoveredAtom=nid;updateHov(a);render();}}
});
canvas.addEventListener('mouseup',function(){dragging=false;});
canvas.addEventListener('mouseleave',function(){dragging=false;hoveredAtom=null;updateHov(null);render();});
canvas.addEventListener('touchstart',function(e){var t=e.touches[0];dragging=true;lastMX=t.clientX;lastMY=t.clientY;e.preventDefault();},{passive:false});
canvas.addEventListener('touchmove',function(e){var t=e.touches[0];rotY+=(t.clientX-lastMX)*0.012;rotX+=(t.clientY-lastMY)*0.012;lastMX=t.clientX;lastMY=t.clientY;render();e.preventDefault();},{passive:false});
canvas.addEventListener('touchend',function(){dragging=false;});
window.addEventListener('resize',function(){render();});

function toggleSpin(){spinning=!spinning;document.getElementById('btn-spin').classList.toggle('active',spinning);if(spinning)spinLoop();}
function spinLoop(){if(!spinning)return;rotY+=0.01;render();spinRAF=requestAnimationFrame(spinLoop);}

function runRandomStructure(){
  var formulaEl=document.getElementById('search-formula');
  var formula=(formulaEl&&formulaEl.value)?formulaEl.value.trim():'C4 O2';
  var parts=[],re=/([A-Z][a-z]?)(\d*)/g,m;
  while((m=re.exec(formula))!==null){if(m[1]&&EL_MAP[m[1]])parts.push({sym:m[1],count:parseInt(m[2],10)||1});}
  if(!parts.length)parts=[{sym:'C',count:4},{sym:'O',count:2}];
  var mindist=parseFloat(document.getElementById('search-mindist').value)||1.5;
  if(typeof StructureGenerator==='undefined'){showToast('Structure generator not loaded','error');return;}
  var result=StructureGenerator.generateRandomStructure({composition:parts,latticeParams:{a:6,b:6,c:6},latticeSystem:'cubic',minDistance:mindist});
  if(!result||!result.atoms)return;
  currentAtoms=result.atoms.map(function(a,i){return {x:a.x,y:a.y,z:a.z,role:a.role||a.sym,id:i};});
  ucVecs=result.vecs||[[6,0,0],[0,6,0],[0,0,6]];
  currentBonds=typeof AnalysisTools!=='undefined'?AnalysisTools.computeBonds(currentAtoms,ucVecs,3.5):[];
  document.getElementById('info-atoms').textContent=currentAtoms.length;
  updateFormulaBadge();render();
  if(typeof window.smadStructureUpdate==='function')window.smadStructureUpdate(currentAtoms,ucVecs);
  var plat=typeof window.smadPlatform==='function'?window.smadPlatform():null;
  if(plat&&plat.setAtoms)plat.setAtoms(ucVecs,currentAtoms.map(function(a,i){return {x:a.x,y:a.y,z:a.z,role:a.role,sym:getElSym(a.role),id:i};}));
  showToast('Generated '+currentAtoms.length+' atoms');
}
function runOptimization(){
  var plat=typeof window.smadPlatform==='function'?window.smadPlatform():null;
  if(!plat||!plat.getAtoms||!plat.getAtoms().length){showToast('Load a structure first (e.g. Generate random)','error');return;}
  var atoms=plat.getAtoms(),vecs=plat.getVecs();
  if(!atoms.length||!vecs){showToast('No structure to optimize','error');return;}
  if(typeof CrystalEngine==='undefined'){showToast('Crystal engine not loaded','error');return;}
  var fracSites=atoms.map(function(a){var f=CrystalEngine.cartToFrac([a.x,a.y,a.z],vecs);return {x:f[0],y:f[1],z:f[2],role:a.role||a.sym};});
  var gens=parseInt(document.getElementById('opt-gens').value,10)||30,pop=parseInt(document.getElementById('opt-pop').value,10)||16;
  plat.runOptimization({initialSites:fracSites,vecs:vecs,generations:gens,populationSize:pop,potential:'lj'},null,function(){showToast('Optimization finished');});
}
function stopOptimization(){var plat=typeof window.smadPlatform==='function'?window.smadPlatform():null;if(plat&&plat.stopOptimization)plat.stopOptimization();}
window.runRandomStructure=runRandomStructure;window.runOptimization=runOptimization;window.stopOptimization=stopOptimization;

buildPT();rebuild();updateInfoPanel();updateAssignDisplay();spinLoop();
