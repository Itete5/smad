const ELEMENTS=[
  ["H","Hydrogen",1,0.31,"nonmetal"],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],
  ["Li","Lithium",3,1.28,"alkali"],["Be","Beryllium",4,0.96,"alkaline"],["B","Boron",5,0.84,"metalloid"],["C","Carbon",6,0.76,"nonmetal"],["N","Nitrogen",7,0.71,"nonmetal"],["O","Oxygen",8,0.66,"nonmetal"],["F","Fluorine",9,0.57,"halogen"],["Ne","Neon",10,0.58,"noble"],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],
  ["Na","Sodium",11,1.66,"alkali"],["Mg","Magnesium",12,1.41,"alkaline"],["Al","Aluminium",13,1.21,"post"],["Si","Silicon",14,1.11,"metalloid"],["P","Phosphorus",15,1.07,"nonmetal"],["S","Sulfur",16,1.05,"nonmetal"],["Cl","Chlorine",17,1.02,"halogen"],["Ar","Argon",18,1.06,"noble"],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],[null,null,0,0,""],
  ["K","Potassium",19,2.03,"alkali"],["Ca","Calcium",20,1.76,"alkaline"],["Sc","Scandium",21,1.7,"transition"],["Ti","Titanium",22,1.6,"transition"],["V","Vanadium",23,1.53,"transition"],["Cr","Chromium",24,1.39,"transition"],["Mn","Manganese",25,1.39,"transition"],["Fe","Iron",26,1.32,"transition"],["Co","Cobalt",27,1.26,"transition"],["Ni","Nickel",28,1.24,"transition"],["Cu","Copper",29,1.32,"transition"],["Zn","Zinc",30,1.22,"transition"],["Ga","Gallium",31,1.22,"post"],["Ge","Germanium",32,1.2,"metalloid"],["As","Arsenic",33,1.19,"metalloid"],["Se","Selenium",34,1.2,"nonmetal"],["Br","Bromine",35,1.2,"halogen"],["Kr","Krypton",36,1.16,"noble"],
  ["Rb","Rubidium",37,2.2,"alkali"],["Sr","Strontium",38,1.95,"alkaline"],["Y","Yttrium",39,1.9,"transition"],["Zr","Zirconium",40,1.75,"transition"],["Nb","Niobium",41,1.64,"transition"],["Mo","Molybdenum",42,1.54,"transition"],["Tc","Technetium",43,1.47,"transition"],["Ru","Ruthenium",44,1.46,"transition"],["Rh","Rhodium",45,1.42,"transition"],["Pd","Palladium",46,1.39,"transition"],["Ag","Silver",47,1.45,"transition"],["Cd","Cadmium",48,1.44,"transition"],["In","Indium",49,1.42,"post"],["Sn","Tin",50,1.39,"post"],["Sb","Antimony",51,1.39,"metalloid"],["Te","Tellurium",52,1.38,"metalloid"],["I","Iodine",53,1.39,"halogen"],["Xe","Xenon",54,1.4,"noble"],
  ["Cs","Caesium",55,2.44,"alkali"],["Ba","Barium",56,2.15,"alkaline"],["La","Lanthanum",57,2.07,"lanthanide"],["Ce","Cerium",58,2.04,"lanthanide"],["Pr","Praseodymium",59,2.03,"lanthanide"],["Nd","Neodymium",60,2.01,"lanthanide"],["Pm","Promethium",61,1.99,"lanthanide"],["Sm","Samarium",62,1.98,"lanthanide"],["Eu","Europium",63,1.98,"lanthanide"],["Gd","Gadolinium",64,1.96,"lanthanide"],["Tb","Terbium",65,1.94,"lanthanide"],["Dy","Dysprosium",66,1.92,"lanthanide"],["Ho","Holmium",67,1.92,"lanthanide"],["Er","Erbium",68,1.89,"lanthanide"],["Tm","Thulium",69,1.9,"lanthanide"],["Yb","Ytterbium",70,1.87,"lanthanide"],["Lu","Lutetium",71,1.87,"lanthanide"],["Hf","Hafnium",72,1.75,"transition"],["Ta","Tantalum",73,1.7,"transition"],["W","Tungsten",74,1.62,"transition"],["Re","Rhenium",75,1.51,"transition"],["Os","Osmium",76,1.44,"transition"],["Ir","Iridium",77,1.41,"transition"],["Pt","Platinum",78,1.36,"transition"],["Au","Gold",79,1.36,"transition"],["Hg","Mercury",80,1.32,"transition"],["Tl","Thallium",81,1.45,"post"],["Pb","Lead",82,1.46,"post"],["Bi","Bismuth",83,1.46,"post"],["Po","Polonium",84,1.4,"post"],["At","Astatine",85,1.5,"halogen"],["Rn","Radon",86,1.5,"noble"],
  ["Fr","Francium",87,2.6,"alkali"],["Ra","Radium",88,2.21,"alkaline"],["Ac","Actinium",89,2.15,"actinide"],["Th","Thorium",90,2.06,"actinide"],["Pa","Protactinium",91,2.0,"actinide"],["U","Uranium",92,1.96,"actinide"],["Np","Neptunium",93,1.9,"actinide"],["Pu","Plutonium",94,1.87,"actinide"],["Am","Americium",95,1.8,"actinide"],["Cm","Curium",96,1.69,"actinide"],["Bk","Berkelium",97,1.66,"actinide"],["Cf","Californium",98,1.68,"actinide"],["Es","Einsteinium",99,1.65,"actinide"],["Fm","Fermium",100,1.67,"actinide"],["Md","Mendelevium",101,1.73,"actinide"],["No","Nobelium",102,1.76,"actinide"],["Lr","Lawrencium",103,1.61,"actinide"]
];
const EL_MAP={}; ELEMENTS.forEach((e,i)=>{if(e[0])EL_MAP[e[0]]=i;});
const CAT_CLASS={alkali:"ec-alkali",alkaline:"ec-alkaline",transition:"ec-transition",post:"ec-post",metalloid:"ec-metalloid",nonmetal:"ec-nonmetal",halogen:"ec-halogen",noble:"ec-noble",lanthanide:"ec-lanthanide",actinide:"ec-actinide"};
const STRUCTURES={fcc:{latt:"cubic",a:3.52,sg:"Fm3m",roles:["A"]},bcc:{latt:"cubic",a:2.87,sg:"Im3m",roles:["A"]},sc:{latt:"cubic",a:2.0,sg:"Pm3m",roles:["A"]},hcp:{latt:"hexagonal",a:2.5,c:4.1,sg:"P63/mmc",roles:["A"]},diamond:{latt:"cubic",a:3.57,sg:"Fd3m",roles:["A"]},nacl:{latt:"cubic",a:5.64,sg:"Fm3m",roles:["A","B"]},zincblende:{latt:"cubic",a:5.65,sg:"F43m",roles:["A","B"]},perovskite:{latt:"cubic",a:4.0,sg:"Pm3m",roles:["A","B","O"]}};
const CP={blue:[[0.2,0.4,0.9],[0.5,0.7,1]],red:[[0.9,0.2,0.2],[1,0.6,0.6]],green:[[0.2,0.7,0.3],[0.5,0.95,0.6]],purple:[[0.6,0.2,0.8],[0.85,0.6,0.95]]};
const BP={orange:[[1,0.5,0],[1,0.8,0.4]],teal:[[0,0.7,0.7],[0.4,0.9,0.9]],pink:[[1,0.4,0.6],[1,0.75,0.85]],gold:[[0.85,0.65,0.13],[1,0.85,0.5]]};

function lerp3(a,b,t){return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];}
function rgb(r,g,b){return"rgb("+Math.round(r*255)+","+Math.round(g*255)+","+Math.round(b*255)+")";}
function getCPal(name){const p=CP[name]||CP.blue;return t=>rgb(...lerp3(p[0],p[1],t));}
function getBPal(name){const p=BP[name]||BP.orange;return t=>rgb(...lerp3(p[0],p[1],t));}
function chargeToColor(q,qmin,qmax){const pal=getCPal(document.getElementById("sel-cp").value);const t=qmin===qmax?0.5:(q-qmin)/(qmax-qmin);return pal(Math.max(0,Math.min(1,t)));}
function bondLenColor(len,lmin,lmax){const pal=getBPal(document.getElementById("sel-bp").value);const t=lmin===lmax?0.5:(len-lmin)/(lmax-lmin);return pal(Math.max(0,Math.min(1,t)));}

let elAssign={A:27,B:0,O:7},selectedEl=27,mode="unitcell",flags={showBonds:true,showLabels:true,showCharges:true,showBondLens:true,showUCBox:true,showAxes:true};
let spinning=true,rotX=0.4,rotY=0.6,dragging=false;
let currentAtoms=[],currentBonds=[],ucVecs=null,hoveredAtom=null,lastBuildResult=null;

const canvas=document.getElementById("mol-canvas");
const ctx=canvas.getContext("2d");

function tog(flag,btnId){flags[flag]=!flags[flag];const b=document.getElementById(btnId);if(b)b.classList.toggle("active",flags[flag]);render();}
function switchTab(tab){["pt","formula","import","export"].forEach(t=>{const el=document.getElementById("tab-"+t);const btn=document.getElementById("tab-"+t+"-btn");if(el)el.style.display=t===tab?"flex":"none";if(btn)btn.classList.toggle("active",t===tab);});if(tab==="formula"){updateFormulaBadge();document.getElementById("formula-inp").focus();}}
function buildPT(){
  const main=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,19,20,21,22,23,24,25,0,0,0,0,0,0,0,0,0,0,36,37,38,39,40,41,42,43,0,0,0,0,0,0,0,0,0,0,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107];
  const lan=[92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107];
  const act=[125,126,127,128,129,130,131,132,133,134,135,136,137,138,139];
  const grid=document.getElementById("pt-grid");if(!grid)return;grid.innerHTML="";
  main.forEach((idx,i)=>{const cell=document.createElement("div");cell.className="el-cell"+(idx?(" "+CAT_CLASS[ELEMENTS[idx][4]]||""):" empty");if(idx){cell.textContent=ELEMENTS[idx][0];cell.onclick=()=>selectEl(idx);}else cell.textContent="";grid.appendChild(cell);});
  const ptLan=document.getElementById("pt-lan");if(ptLan){ptLan.innerHTML="";lan.forEach(idx=>{const cell=document.createElement("div");cell.className="el-cell "+(CAT_CLASS[ELEMENTS[idx][4]]||"");cell.textContent=ELEMENTS[idx][0];cell.onclick=()=>selectEl(idx);ptLan.appendChild(cell);});}
  const ptAct=document.getElementById("pt-act");if(ptAct){ptAct.innerHTML="";act.forEach(idx=>{const cell=document.createElement("div");cell.className="el-cell "+(CAT_CLASS[ELEMENTS[idx][4]]||"");cell.textContent=ELEMENTS[idx][0];cell.onclick=()=>selectEl(idx);ptAct.appendChild(cell);});}
}
function selectEl(idx){selectedEl=idx;document.querySelectorAll(".el-cell.selected").forEach(c=>c.classList.remove("selected"));document.querySelectorAll(".el-cell").forEach((c,i)=>{if(c.textContent===ELEMENTS[idx][0])c.classList.add("selected");});const badge=document.getElementById("sel-badge");if(badge)badge.textContent=ELEMENTS[idx][0];const inp=document.getElementById("el-input");if(inp)inp.value=ELEMENTS[idx][0];}
function onElInput(v){const s=(v||"").trim().replace(/^[a-z]/,x=>x.toUpperCase());const idx=EL_MAP[s];if(idx!==undefined){selectEl(idx);}}
function setRole(role){if(selectedEl!=null)elAssign[role]=selectedEl;updateAssignDisplay();rebuild();}
function updateAssignDisplay(){const out=document.getElementById("el-assign-display");if(!out)return;out.innerHTML="";["A","B","O"].forEach(r=>{if(!STRUCTURES[document.getElementById("sel-struct").value].roles.includes(r))return;const idx=elAssign[r];const span=document.createElement("span");span.className="role-badge";span.style.background=getElColor(idx);span.style.color="#fff";span.textContent=r+"="+(ELEMENTS[idx]?ELEMENTS[idx][0]:"—");out.appendChild(span);});}
function getElSym(idx){return ELEMENTS[idx]&&ELEMENTS[idx][0]?ELEMENTS[idx][0]:"—";}
function getElColor(idx){if(!ELEMENTS[idx]||!ELEMENTS[idx][0])return"#666";const c=ELEMENTS[idx];const r=c[3]||1;const h=(c[2]*37)%360;return"hsl("+h+",50%,"+(40+Math.min(40,r*15))+"%)";}
function getElR(idx){return ELEMENTS[idx]?ELEMENTS[idx][3]||1:0.5;}
function toRgb(hex){const m=hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);return m?[parseInt(m[1],16)/255,parseInt(m[2],16)/255,parseInt(m[3],16)/255]:[0.5,0.5,0.5];}
function blendW(c1,c2,w){const a=toRgb(c1),b=toRgb(c2);return rgb(a[0]+(b[0]-a[0])*w,a[1]+(b[1]-a[1])*w,a[2]+(b[2]-a[2])*w);}
function dkn(c,f){const [r,g,b]=toRgb(c);return rgb(r*f,g*f,b*f);}

function getLatt(structId){
  const s=STRUCTURES[structId];if(!s)return{a:3,b:3,c:3,al:90,be:90,ga:90};
  const a=s.a||3;const b=s.b||a;const c=s.c||(s.latt==="hexagonal"?s.c:a);return{a,b,c,al:s.al||90,be:s.be||90,ga:s.ga||(s.latt==="hexagonal"?120:90)};
}
function getLatOverride(){
  const gaInp=document.getElementById("lat-ga");const gaVal=(gaInp&&gaInp.value)?parseFloat(gaInp.value):90;
  return{a:document.getElementById("lat-a").value,b:document.getElementById("lat-b").value,c:document.getElementById("lat-c").value,al:document.getElementById("lat-al").value,be:document.getElementById("lat-be").value,ga:gaVal};
}
function buildUC(structId,lat){
  const s=STRUCTURES[structId];if(!s)return{atoms:[],vecs:null};
  const a=lat.a,b=lat.b,c=lat.c,al=lat.al*Math.PI/180,be=lat.be*Math.PI/180,ga=lat.ga*Math.PI/180;
  const ax=a,ay=0,az=0;const bx=b*Math.cos(ga),by=b*Math.sin(ga),bz=0;
  const cx=c*Math.cos(be),cy=c*(Math.cos(al)-Math.cos(be)*Math.cos(ga))/Math.sin(ga),cz=c*Math.sqrt(1-Math.cos(be)**2-(cy/c)**2);
  const vecs=[[ax,ay,az],[bx,by,bz],[cx,cy,cz]];
  let atoms=[];
  const A=elAssign.A,B=elAssign.B,O=elAssign.O;
  if(structId==="fcc"){atoms=[{x:0,y:0,z:0,el:A,q:0},{x:0.5,y:0.5,z:0,el:A,q:0},{x:0.5,y:0,z:0.5,el:A,q:0},{x:0,y:0.5,z:0.5,el:A,q:0}];}
  else if(structId==="bcc"){atoms=[{x:0,y:0,z:0,el:A,q:0},{x:0.5,y:0.5,z:0.5,el:A,q:0}];}
  else if(structId==="sc"){atoms=[{x:0,y:0,z:0,el:A,q:0}];}
  else if(structId==="hcp"){const cByA=(lat.c||4.1)/(lat.a||2.5);atoms=[{x:0,y:0,z:0,el:A,q:0},{x:1/3,y:2/3,z:0.5,el:A,q:0}];vecs[2][2]=vecs[0][0]*cByA;}
  else if(structId==="diamond"){atoms=[{x:0,y:0,z:0,el:A,q:0},{x:0.5,y:0.5,z:0,el:A,q:0},{x:0.5,y:0,z:0.5,el:A,q:0},{x:0,y:0.5,z:0.5,el:A,q:0},{x:0.25,y:0.25,z:0.25,el:A,q:0},{x:0.75,y:0.75,z:0.25,el:A,q:0},{x:0.75,y:0.25,z:0.75,el:A,q:0},{x:0.25,y:0.75,z:0.75,el:A,q:0}];}
  else if(structId==="nacl"){atoms=[{x:0,y:0,z:0,el:A,q:1},{x:0.5,y:0.5,z:0,el:A,q:1},{x:0.5,y:0,z:0.5,el:A,q:1},{x:0,y:0.5,z:0.5,el:A,q:1},{x:0.5,y:0,z:0,el:B,q:-1},{x:0,y:0.5,z:0,el:B,q:-1},{x:0,y:0,z:0.5,el:B,q:-1},{x:0.5,y:0.5,z:0.5,el:B,q:-1}];}
  else if(structId==="zincblende"){atoms=[{x:0,y:0,z:0,el:A,q:0},{x:0.5,y:0.5,z:0,el:A,q:0},{x:0.5,y:0,z:0.5,el:A,q:0},{x:0,y:0.5,z:0.5,el:A,q:0},{x:0.25,y:0.25,z:0.25,el:B,q:0},{x:0.75,y:0.75,z:0.25,el:B,q:0},{x:0.75,y:0.25,z:0.75,el:B,q:0},{x:0.25,y:0.75,z:0.75,el:B,q:0}];}
  else if(structId==="perovskite"){atoms=[{x:0.5,y:0.5,z:0.5,el:A,q:2},{x:0,y:0,z:0,el:B,q:4},{x:0.5,y:0,z:0,el:O,q:-2},{x:0,y:0.5,z:0,el:O,q:-2},{x:0,y:0,z:0.5,el:O,q:-2}];}
  return{atoms,vecs};
}
function buildSlab(atoms,vecs,nx,ny,nz,surf,layers){
  if(!atoms.length||!vecs)return [];
  const [va,vb,vc]=vecs;const all=[];
  const rep=(surf==="100")?[1,0,0]:((surf==="110")?[1,1,0]:((surf==="111")?[1,1,1]:[2,1,1]));
  const thickness=layers*0.5;
  for(let i=-1;i<=nx;i++)for(let j=-1;j<=ny;j++)for(let k=-1;k<=nz;k++){
    atoms.forEach(a=>{
      const x=a.x+i,y=a.y+j,z=a.z+k;
      const cart=[x*va[0]+y*vb[0]+z*vc[0],x*va[1]+y*vb[1]+z*vc[1],x*va[2]+y*vb[2]+z*vc[2]];
      const h=rep[0]*cart[0]+rep[1]*cart[1]+rep[2]*cart[2];
      const norm=Math.sqrt(rep[0]**2+rep[1]**2+rep[2]**2);
      if(h>=0&&h<=thickness*norm*2)all.push({...a,x,y,z,cart,el:a.el,q:a.q});
    });
  }
  return all;
}
function assignCharges(atoms,structId){return atoms;}
function computeBonds(atoms){
  const bonds=[];const dmax=3.5;
  if(!atoms.length)return bonds;
  for(let i=0;i<atoms.length;i++)for(let j=i+1;j<atoms.length;j++){
    const ci=atoms[i].cart,cj=atoms[j].cart;
    if(!ci||!cj)continue;
    const dx=cj[0]-ci[0],dy=cj[1]-ci[1],dz=cj[2]-ci[2];
    const d=Math.sqrt(dx*dx+dy*dy+dz*dz);
    if(d>0.1&&d<dmax)bonds.push({i,j,len:d});
  }
  return bonds;
}
function clamp(v,lo,hi){return Math.max(lo,Math.min(hi,v));}
function getStrParams(){const sel=document.getElementById("sel-struct");const structId=sel?sel.value:"fcc";const lat=getLatt(structId);const over=getLatOverride();const a=over.a?parseFloat(over.a):lat.a;const b=over.b?parseFloat(over.b):lat.b;const c=over.c?parseFloat(over.c):lat.c;const al=over.al?parseFloat(over.al):lat.al;const be=over.be?parseFloat(over.be):lat.be;const ga=over.ga?parseFloat(over.ga):lat.ga;return{structId,nx:parseInt(document.getElementById("inp-nx").value)||2,ny:parseInt(document.getElementById("inp-ny").value)||2,nz:parseInt(document.getElementById("inp-nz").value)||2,surf:document.getElementById("sel-surf").value,layers:parseInt(document.getElementById("inp-layers").value)||4,a,b,c,al,be,ga};}
function rebuild(){
  const {structId,nx,ny,nz,surf,layers,a,b,c,al,be,ga}=getStrParams();
  const lat={a,b,c,al,be,ga};
  let {atoms,vecs}=buildUC(structId,lat);
  ucVecs=vecs;
  const [va,vb,vc]=vecs||[[1,0,0],[0,1,0],[0,0,1]];
  if(mode==="super"){currentAtoms=[];for(let i=0;i<nx;i++)for(let j=0;j<ny;j++)for(let k=0;k<nz;k++)atoms.forEach(a=>{currentAtoms.push({x:a.x+i,y:a.y+j,z:a.z+k,el:a.el,q:a.q}));}
  else if(mode==="slab"){currentAtoms=buildSlab(atoms,vecs,nx,ny,nz,surf,layers);}
  else{currentAtoms=atoms.map(a=>({...a,x:a.x,y:a.y,z:a.z,el:a.el,q:a.q}));}
  currentAtoms.forEach(a=>{a.cart=[a.x*va[0]+a.y*vb[0]+a.z*vc[0],a.x*va[1]+a.y*vb[1]+a.z*vc[1],a.x*va[2]+a.y*vb[2]+a.z*vc[2]];});
  assignCharges(currentAtoms,structId);
  currentBonds=computeBonds(currentAtoms);
  lastBuildResult={structId,lat,vecs};
  render();updateInfoPanel();
}
function setMode(m){mode=m;document.getElementById("btn-uc").classList.toggle("active",m==="unitcell");document.getElementById("btn-ss").classList.toggle("active",m==="super");document.getElementById("btn-slab").classList.toggle("active",m==="slab");rebuild();}
function onStructChange(){rebuild();updateInfoPanel();updateAssignDisplay();}
function updateInfoPanel(){
  const {structId,a,b,c}=getStrParams();const s=STRUCTURES[structId];
  document.getElementById("info-name").textContent=(s?structId.toUpperCase():"")+" — "+(mode==="unitcell"?"Unit cell":mode==="super"?"Supercell":"Slab");
  document.getElementById("info-latt").textContent=s?s.latt:"—";
  document.getElementById("info-a").textContent=a;
  document.getElementById("info-sg").textContent=s?s.sg:"—";
  document.getElementById("info-atoms").textContent=currentAtoms.length;
  const formula=[];const cnt={};currentAtoms.forEach(a=>{const sym=getElSym(a.el);cnt[sym]=(cnt[sym]||0)+1;});Object.keys(cnt).filter(s=>s!=="—").sort().forEach(s=>formula.push(cnt[s]>1?s+cnt[s]:s));document.getElementById("info-formula").textContent=formula.length?formula.join(" "):"—";
  document.getElementById("info-els").textContent=getElSym(elAssign.A)+"/"+getElSym(elAssign.B)+"/"+getElSym(elAssign.O);
  updateHov();
}
function updateFormulaBadge(){const inp=document.getElementById("formula-inp");const out=document.getElementById("formula-preview");if(!out)return;const parsed=parseFormula(inp?inp.value:"");if(parsed&&parsed.length){out.textContent=parsed.map(([s,n])=>n>1?s+n:s).join(" ");}else out.textContent="";const roleOut=document.getElementById("formula-role-out");if(roleOut)roleOut.textContent="A/B/X assigned from formula order.";}
function parseFormula(str){const s=str.trim().replace(/\s+/g,"");const re=/([A-Z][a-z]?)(\d*)/g;const out=[];let m;while((m=re.exec(s))!==null){const sym=m[1],n=parseInt(m[2],10)||1;if(EL_MAP[sym]!=null)out.push([EL_MAP[sym],n]);}return out.length?out:null;}
function onFormulaInput(v){updateFormulaBadge();}
function applyFormula(){const inp=document.getElementById("formula-inp");const parsed=parseFormula(inp?inp.value:"");if(parsed){const structId=document.getElementById("sel-struct").value;const roles=STRUCTURES[structId].roles;parsed.forEach(([idx],i)=>{if(roles[i]==="A")elAssign.A=idx;else if(roles[i]==="B")elAssign.B=idx;else if(roles[i]==="O")elAssign.O=idx;});updateAssignDisplay();rebuild();showToast("Formula applied");}else showToast("Could not parse formula");}
function quickFormula(f){document.getElementById("formula-inp").value=f;applyFormula();}

function parseXYZ(text){const lines=text.trim().split(/\n/);const n=parseInt(lines[0],10);if(isNaN(n))return null;const atoms=[];for(let i=2;i<2+n&&i<lines.length;i++){const p=lines[i].split(/\s+/).filter(Boolean);const sym=(p[0]||"X").replace(/^\d+$/,"X");const x=parseFloat(p[1])||0,y=parseFloat(p[2])||0,z=parseFloat(p[3])||0;atoms.push({el:EL_MAP[sym]!=null?EL_MAP[sym]:0,x,y,z,q:0,cart:[x,y,z]});}return atoms;}
function parsePOSCAR(text){const lines=text.trim().split(/\n/).filter(l=>l);if(lines.length<8)return null;const scale=parseFloat(lines[1]);const va=lines[2].split(/\s+/).filter(Boolean).map(Number).map(x=>x*scale);const vb=lines[3].split(/\s+/).filter(Boolean).map(Number).map(x=>x*scale);const vc=lines[4].split(/\s+/).filter(Boolean).map(Number).map(x=>x*scale);const vecs=[va,vb,vc];const syms=lines[5].split(/\s+/).filter(Boolean);const counts=lines[6].split(/\s+/).filter(Boolean).map(Number);let idx=7;const isDirect=lines[7].toLowerCase().includes("direct");if(!isDirect)idx=8;const atoms=[];let ai=0;syms.forEach((s,i)=>{const el=EL_MAP[s]!=null?EL_MAP[s]:0;for(let k=0;k<(counts[i]||0);k++){const l=lines[idx++];if(!l)return;const p=l.split(/\s+/).filter(Boolean);const x=parseFloat(p[0])||0,y=parseFloat(p[1])||0,z=parseFloat(p[2])||0;atoms.push({x,y,z,el,q:0,cart:isDirect?[x*va[0]+y*vb[0]+z*vc[0],x*va[1]+y*vb[1]+z*vc[1],x*va[2]+y*vb[2]+z*vc[2]]:[x,y,z]});}ai++;});return{atoms,vecs};}
function parseCIF(text){const atoms=[];let a=10,b=10,c=10,al=90,be=90,ga=90;const va=[a,0,0],vb=[b*Math.cos(ga*Math.PI/180),b*Math.sin(ga*Math.PI/180),0],cx=c*Math.cos(be*Math.PI/180),cy=c*(Math.cos(al*Math.PI/180)-Math.cos(be*Math.PI/180)*Math.cos(ga*Math.PI/180))/Math.sin(ga*Math.PI/180);const vc=[cx,cy,Math.sqrt(c*c-cx*cx-cy*cy)];text.replace(/_atom_site_fract_x\s+([\s\S]*?)(?=loop_|$)/gi,(_,block)=>{block.split(/\n/).forEach(l=>{const p=l.trim().split(/\s+/);if(p.length>=4&&!isNaN(parseFloat(p[1]))){const sym=p[0],x=parseFloat(p[1]),y=parseFloat(p[2]),z=parseFloat(p[3]);atoms.push({x,y,z,el:EL_MAP[sym]!=null?EL_MAP[sym]:0,q:0,cart:[x*va[0]+y*vb[0]+z*vc[0],x*va[1]+y*vb[1]+z*vc[1],x*va[2]+y*vb[2]+z*vc[2]]});}});});if(!atoms.length)return null;return{atoms,vecs:[va,vb,vc]};}
function parsePDB(text){const atoms=[];text.split(/\n/).forEach(l=>{if(l.startsWith("ATOM ")||l.startsWith("HETATM ")){const sym=(l.substring(12,14)||"X").trim();const x=parseFloat(l.substring(30,38)),y=parseFloat(l.substring(38,46)),z=parseFloat(l.substring(46,54));atoms.push({x,y,z,el:EL_MAP[sym]!=null?EL_MAP[sym]:0,q:0,cart:[x,y,z]});}});return atoms.length?{atoms,vecs:[[1,0,0],[0,1,0],[0,0,1]]}:null;}
function parseFromText(text){if(!text||!text.trim()){showToast("Paste structure first");return;}
  let data=null;if(text.includes("_atom_site")||text.includes("data_"))data=parseCIF(text);else if(text.includes("Direct")||text.includes("Cartesian")||/^\s*[\d.]+\s*$/.test(text.split(/\n/)[1]))data=parsePOSCAR(text);else if(/^\s*\d+\s*$/.test(text.trim().split(/\n/)[0]))data={atoms:parseXYZ(text),vecs:[[1,0,0],[0,1,0],[0,0,1]]};else data=parsePDB(text);
  if(data&&data.atoms&&data.atoms.length){loadImportedAtoms(data.atoms,data.vecs);showToast("Loaded "+data.atoms.length+" atoms");}else showToast("Could not parse structure");}
function loadImportedAtoms(atoms,vecs){ucVecs=vecs||[[1,0,0],[0,1,0],[0,0,1]];const [va,vb,vc]=ucVecs;currentAtoms=atoms.map(a=>({...a,el:a.el||0,q:a.q||0,cart:a.cart||[a.x*va[0]+a.y*vb[0]+a.z*vc[0],a.x*va[1]+a.y*vb[1]+a.z*vc[1],a.x*va[2]+a.y*vb[2]+a.z*vc[2]]}));currentBonds=computeBonds(currentAtoms);render();updateInfoPanel();}
function onFileDrop(e){e.preventDefault();e.target.classList.remove("over");const f=e.dataTransfer.files[0];if(f)readFile(f);}
function onFileInput(input){const f=input.files[0];if(f)readFile(f);input.value="";}
function readFile(file){const r=new FileReader();r.onload=()=>{const text=r.result;parseFromText(text);document.getElementById("import-status").textContent="Loaded: "+file.name;};r.readAsText(file);}

function getExportData(){const {a,b,c,al,be,ga}=getStrParams();const vecs=ucVecs||[[a,0,0],[0,b,0],[0,0,c]];return{atoms:currentAtoms,vecs,a,b,c,al,be,ga};}
const MASS={H:1.008,He:4.003,Li:6.94,Be:9.012,C:12.01,N:14.01,O:16,F:19,Ne:20.18,Na:22.99,Mg:24.31,Al:26.98,Si:28.09,P:30.97,S:32.07,Cl:35.45,Ar:39.95,K:39.1,Ca:40.08,Sc:44.96,Ti:47.87,V:50.94,Cr:52,Mn:54.94,Fe:55.85,Co:58.93,Ni:58.69,Cu:63.55,Zn:65.38,Ga:69.72,Ge:72.63,As:74.92,Se:78.97,Br:79.9,Kr:83.8,Rb:85.47,Sr:87.62,Y:88.91,Zr:91.22,Nb:92.91,Mo:95.95,Tc:98,Ru:101.1,Rh:102.9,Pd:106.4,Ag:107.9,Cd:112.4,In:114.8,Sn:118.7,Sb:121.8,Te:127.6,I:126.9,Xe:131.3,Cs:132.9,Ba:137.3,La:138.9,Ce:140.1,Pr:140.9,Nd:144.2,Pm:145,Sm:150.4,Eu:152,Gd:157.3,Tb:158.9,Dy:162.5,Ho:164.9,Er:167.3,Tm:168.9,Yb:173,Lu:175,Hf:178.5,Ta:180.9,W:183.8,Re:186.2,Os:190.2,Ir:192.2,Pt:195.1,Au:197,Hg:200.6,Tl:204.4,Pb:207.2,Bi:209,Po:209,At:210,Rn:222,Fr:223,Ra:226,Ac:227,Th:232,U:238,N:14.01};
function genCIF(d){let s="data_export\n_cell_length_a "+d.a+"\n_cell_length_b "+d.b+"\n_cell_length_c "+d.c+"\n_cell_angle_alpha "+d.al+"\n_cell_angle_beta "+d.be+"\n_cell_angle_gamma "+d.ga+"\nloop_ _atom_site_label _atom_site_fract_x _atom_site_fract_y _atom_site_fract_z\n";const [va,vb,vc]=d.vecs;const inv=()=>{const det=va[0]*(vb[1]*vc[2]-vb[2]*vc[1])-va[1]*(vb[0]*vc[2]-vb[2]*vc[0])+va[2]*(vb[0]*vc[1]-vb[1]*vc[0]);return det;};d.atoms.forEach((a,i)=>{const x=a.cart?((a.cart[0]*va[0]+a.cart[1]*va[1]+a.cart[2]*va[2])/(va[0]**2+va[1]**2+va[2]**2)):a.x,y=a.cart?0:a.y,z=a.cart?0:a.z;s+=getElSym(a.el)+" "+(a.x!=null?a.x:x)+" "+(a.y!=null?a.y:y)+" "+(a.z!=null?a.z:z)+"\n";});return s;}
function genPOSCAR(d){let s="SMAD export\n1.0\n";const [va,vb,vc]=d.vecs;s+=va.join(" ")+"\n"+vb.join(" ")+"\n"+vc.join(" ")+"\n";const syms={};d.atoms.forEach(a=>{const s_=getElSym(a.el);syms[s_]=(syms[s_]||0)+1;});s+=Object.keys(syms).join(" ")+"\n"+Object.values(syms).join(" ")+"\nDirect\n";Object.keys(syms).forEach(sym=>{d.atoms.filter(a=>getElSym(a.el)===sym).forEach(a=>{s+=(a.x!=null?a.x:0)+" "+(a.y!=null?a.y:0)+" "+(a.z!=null?a.z:0)+"\n";});});return s;}
function genXYZ(d){let s=d.atoms.length+"\nExported\n";d.atoms.forEach(a=>{s+=getElSym(a.el)+" "+(a.cart?(a.cart[0]+" "+a.cart[1]+" "+a.cart[2]):(a.x+" "+a.y+" "+a.z))+"\n";});return s;}
function genLAMMPS(d){let s="# LAMMPS data\n\n"+d.atoms.length+" atoms\n\n1 atom types\n\n0 "+d.a+" xlo xhi\n0 "+d.b+" ylo yhi\n0 "+d.c+" zlo zhi\n\nAtoms # fractional\n\n";d.atoms.forEach((a,i)=>{s+=(i+1)+" 1 "+(a.x!=null?a.x:0)+" "+(a.y!=null?a.y:0)+" "+(a.z!=null?a.z:0)+"\n";});return s;}
function genPDB(d){let s="";d.atoms.forEach((a,i)=>{const sym=getElSym(a.el);const x=a.cart?a.cart[0]:a.x,y=a.cart?a.cart[1]:a.y,z=a.cart?a.cart[2]:a.z;s+="ATOM  "+(i+1).toString().padStart(5)+"  "+sym.padEnd(2)+"   UNK     1    "+x.toFixed(3).padStart(8)+y.toFixed(3).padStart(8)+z.toFixed(3).padStart(8)+"  1.00  0.00\n";});return s;}
function genGJF(d){let s="# opt\n\nExported\n\n0 1\n";d.atoms.forEach(a=>{const sym=getElSym(a.el);const x=a.cart?a.cart[0]:a.x,y=a.cart?a.cart[1]:a.y,z=a.cart?a.cart[2]:a.z;s+=sym+" "+x+" "+y+" "+z+"\n";});s+="\n";return s;}
const FORMAT_FNS={cif:genCIF,poscar:genPOSCAR,xyz:genXYZ,lammps:genLAMMPS,pdb:genPDB,gjf:genGJF};
const FORMAT_EXT={cif:".cif",poscar:".vasp",xyz:".xyz",lammps:".lammps",pdb:".pdb",gjf:".gjf"};
function exportFile(fmt){const d=getExportData();const fn=FORMAT_FNS[fmt];if(!fn){showToast("Unknown format");return;}const blob=new Blob([fn(d)],{type:"text/plain"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="structure"+FORMAT_EXT[fmt];a.click();URL.revokeObjectURL(a.href);showToast("Exported "+fmt);}
function copyFormat(fmt){const d=getExportData();const fn=FORMAT_FNS[fmt];if(!fn){showToast("Unknown format");return;}navigator.clipboard.writeText(fn(d)).then(()=>showToast("Copied to clipboard")).catch(()=>showToast("Copy failed"));}
function showToast(msg){const el=document.getElementById("toast");if(!el)return;el.textContent=msg;el.style.display="block";clearTimeout(showToast._t);showToast._t=setTimeout(()=>{el.style.display="none";},2500);}

function rotP(p,rotX,rotY){let [x,y,z]=p;let c=Math.cos(rotY),s=Math.sin(rotY);let x2=x*c-z*s,z2=x*s+z*c;x=x2;z=z2;c=Math.cos(rotX);s=Math.sin(rotX);let y2=y*c-z*s;z2=y*s+z*c;y=y2;z=z2;return[x,y,z];}
function drawSphere(cx,cy,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();if(ctx.roundRect){ctx.strokeStyle="rgba(255,255,255,0.2)";ctx.lineWidth=0.5;ctx.stroke();}}
function drawScaleBars(){}
function render(){
  if(!canvas||!ctx)return;
  const w=canvas.width=canvas.clientWidth,h=canvas.height=canvas.clientHeight;
  ctx.fillStyle="#0a0c14";ctx.beginPath();if(ctx.roundRect){ctx.roundRect(0,0,w,h,0);ctx.fill();}else{ctx.fillRect(0,0,w,h);}
  const cx=w/2,cy=h/2;const scale=Math.min(w,h)/Math.max(8,currentAtoms.length*0.5);
  const vecs=ucVecs||[[1,0,0],[0,1,0],[0,0,1]];const [va,vb,vc]=vecs;
  const proj=at=>{const c=at.cart||[at.x*va[0]+at.y*vb[0]+at.z*vc[0],at.x*va[1]+at.y*vb[1]+at.z*vc[1],at.x*va[2]+at.y*vb[2]+at.z*vc[2]];const p=rotP(c,rotX,rotY);return[cx+p[0]*scale,cy-p[1]*scale,p[2]];};
  const qmin=Math.min(...currentAtoms.map(a=>a.q),0),qmax=Math.max(...currentAtoms.map(a=>a.q),0);
  const lens=currentBonds.map(b=>b.len);const lmin=lens.length?Math.min(...lens):0.1,lmax=lens.length?Math.max(...lens):3;
  currentBonds.forEach(b=>{if(!flags.showBonds)return;const ai=currentAtoms[b.i],aj=currentAtoms[b.j];if(!ai||!aj)return;const [x1,y1,z1]=proj(ai),[x2,y2,z2]=proj(aj);ctx.strokeStyle=bondLenColor(b.len,lmin,lmax);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();if(flags.showBondLens){ctx.fillStyle="#c0c8e0";ctx.font="9px monospace";ctx.fillText(b.len.toFixed(2), (x1+x2)/2,(y1+y2)/2);}});
  const order=currentAtoms.map((a,i)=>[i,proj(a)[2]]).sort((a,b)=>b[1]-a[1]);
  order.forEach(([i,z])=>{const a=currentAtoms[i];const [sx,sy]=proj(a);const r=Math.max(4,getElR(a.el)*scale*0.5);drawSphere(sx,sy,r,getElColor(a.el));if(flags.showLabels){ctx.fillStyle="#fff";ctx.font="10px monospace";ctx.fillText(getElSym(a.el),sx+r+2,sy+4);}if(flags.showCharges&&a.q!==0){ctx.fillStyle=chargeToColor(a.q,qmin,qmax);ctx.font="9px monospace";ctx.fillText(a.q.toFixed(1),sx-r-2,sy);}});
  if(flags.showUCBox&&ucVecs){}
  if(flags.showAxes){ctx.font="11px monospace";const o=rotP([0,0,0],rotX,rotY);ctx.fillStyle="#f00";ctx.fillText("X",cx+scale*1.2+o[0],cy-o[1]);ctx.fillStyle="#0f0";ctx.fillText("Y",cx+o[0],cy-scale*1.2-o[1]);ctx.fillStyle="#08f";ctx.fillText("Z",cx+o[0],cy+scale*0.8+o[1]);}
  const chargeScale=document.getElementById("charge-scale");if(chargeScale)chargeScale.style.display=flags.showCharges?"block":"none";const bondScale=document.getElementById("bond-scale");if(bondScale)bondScale.style.display=flags.showBondLens?"block":"none";
}
function findHov(x,y){
  const w=canvas.width,h=canvas.height,cx=w/2,cy=h/2,scale=Math.min(w,h)/8;
  const vecs=ucVecs||[[1,0,0],[0,1,0],[0,0,1]];const [va,vb,vc]=vecs;
  const proj=at=>{const c=at.cart||[at.x*va[0]+at.y*vb[0]+at.z*vc[0],at.x*va[1]+at.y*vb[1]+at.z*vc[1],at.x*va[2]+at.y*vb[2]+at.z*vc[2]];const p=rotP(c,rotX,rotY);return[cx+p[0]*scale,cy-p[1]*scale];};
  let best=null,bestD=30;
  currentAtoms.forEach((a,i)=>{const [sx,sy]=proj(a);const r=Math.max(8,getElR(a.el)*scale);const d=Math.hypot(x-sx,y-sy);if(d<=r&&d<bestD){bestD=d;best={atom:a,index:i};}});
  return best;
}
function updateHov(){const el=document.getElementById("info-hov");const hc=document.getElementById("info-hc");const hb=document.getElementById("info-hb");const hl=document.getElementById("info-hl");if(!hoveredAtom){if(el)el.textContent="—";if(hc)hc.textContent="—";if(hb)hb.textContent="—";if(hl)hl.textContent="—";return;}const a=hoveredAtom.atom;if(el)el.textContent=getElSym(a.el);if(hc)hc.textContent=a.q!=null?a.q:"—";const bonds=currentBonds.filter(b=>b.i===hoveredAtom.index||b.j===hoveredAtom.index);if(hb)hb.textContent=bonds.length;if(hl)hl.textContent=bonds.length?bonds.map(b=>b.len.toFixed(2)).join(", "):"—";}

canvas.addEventListener("mousedown",e=>{dragging=true;});
canvas.addEventListener("mouseup",()=>{dragging=false;});
canvas.addEventListener("mouseleave",()=>{dragging=false;hoveredAtom=null;updateHov();render();});
canvas.addEventListener("mousemove",e=>{
  const rect=canvas.getBoundingClientRect();const x=e.clientX-rect.left,y=e.clientY-rect.top;
  if(dragging){rotY+=(e.movementX||0)*0.01;rotX+=(e.movementY||0)*0.01;render();}else{hoveredAtom=findHov(x,y);updateHov();render();}
});
function toggleSpin(){spinning=!spinning;document.getElementById("btn-spin").classList.toggle("active",spinning);}
function spinLoop(){function tick(){if(spinning){rotY+=0.005;render();}requestAnimationFrame(tick);}requestAnimationFrame(tick);}

buildPT();rebuild();updateInfoPanel();updateAssignDisplay();spinLoop();
