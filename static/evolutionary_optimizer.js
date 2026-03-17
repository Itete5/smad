/**
 * Evolutionary Structure Optimizer
 * Runs in Web Worker: population-based search with mutation, crossover, selection.
 * Fitness via Lennard-Jones, Morse, or Buckingham potential.
 */
(function (global) {
  'use strict';

  function lennardJones(r, sigma, epsilon) {
    if (r < 1e-6) return 1e10;
    const s6 = (sigma / r) ** 6;
    return 4 * epsilon * (s6 * s6 - s6);
  }

  function morse(r, D, a, r0) {
    const ex = Math.exp(-a * (r - r0));
    return D * (ex * ex - 2 * ex);
  }

  function buckingham(r, A, rho, C) {
    if (r < 1e-6) return 1e10;
    return A * Math.exp(-r / rho) - C / (r ** 6);
  }

  function pairEnergy(r, potential, params) {
    if (potential === 'morse') return morse(r, params.D || 1, params.a || 2, params.r0 || 1);
    if (potential === 'buckingham') return buckingham(r, params.A || 1000, params.rho || 0.3, params.C || 100);
    return lennardJones(r, params.sigma || 1, params.epsilon || 1);
  }

  function pbcDistance(cart1, cart2, vecs) {
    const dx = cart2[0] - cart1[0], dy = cart2[1] - cart1[1], dz = cart2[2] - cart1[2];
    let minD2 = dx * dx + dy * dy + dz * dz;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        for (let k = -1; k <= 1; k++) {
          const rx = dx + i * vecs[0][0] + j * vecs[1][0] + k * vecs[2][0];
          const ry = dy + i * vecs[0][1] + j * vecs[1][1] + k * vecs[2][1];
          const rz = dz + i * vecs[0][2] + j * vecs[1][2] + k * vecs[2][2];
          const d2 = rx * rx + ry * ry + rz * rz;
          if (d2 < minD2) minD2 = d2;
        }
      }
    }
    return Math.sqrt(minD2);
  }

  function evaluateEnergy(atoms, vecs, potential, params, cutoff) {
    const rc = cutoff || 10;
    let E = 0;
    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const r = pbcDistance([atoms[i].x, atoms[i].y, atoms[i].z], [atoms[j].x, atoms[j].y, atoms[j].z], vecs);
        if (r < rc) E += pairEnergy(r, potential, params);
      }
    }
    return E;
  }

  function mutate(sites, scale) {
    return sites.map(s => ({
      x: wrap(s.x + (Math.random() - 0.5) * scale),
      y: wrap(s.y + (Math.random() - 0.5) * scale),
      z: wrap(s.z + (Math.random() - 0.5) * scale),
      role: s.role
    }));
  }

  function wrap(x) {
    return ((x % 1) + 1) % 1;
  }

  function crossover(sitesA, sitesB) {
    return sitesA.map((s, i) => {
      const t = sitesB[i];
      if (!t) return { ...s };
      return {
        x: wrap(Math.random() < 0.5 ? s.x : t.x),
        y: wrap(Math.random() < 0.5 ? s.y : t.y),
        z: wrap(Math.random() < 0.5 ? s.z : t.z),
        role: s.role
      };
    });
  }

  function fracToCart(frac, vecs) {
    const [x, y, z] = frac;
    return [
      vecs[0][0] * x + vecs[1][0] * y + vecs[2][0] * z,
      vecs[0][1] * x + vecs[1][1] * y + vecs[2][1] * z,
      vecs[0][2] * x + vecs[1][2] * y + vecs[2][2] * z
    ];
  }

  function cartToFrac(cart, vecs) {
    const det = vecs[0][0] * (vecs[1][1] * vecs[2][2] - vecs[1][2] * vecs[2][1]) - vecs[0][1] * (vecs[1][0] * vecs[2][2] - vecs[1][2] * vecs[2][0]) + vecs[0][2] * (vecs[1][0] * vecs[2][1] - vecs[1][1] * vecs[2][0]);
    const inv = [
      [(vecs[1][1] * vecs[2][2] - vecs[1][2] * vecs[2][1]) / det, (vecs[0][2] * vecs[2][1] - vecs[0][1] * vecs[2][2]) / det, (vecs[0][1] * vecs[1][2] - vecs[0][2] * vecs[1][1]) / det],
      [(vecs[1][2] * vecs[2][0] - vecs[1][0] * vecs[2][2]) / det, (vecs[0][0] * vecs[2][2] - vecs[0][2] * vecs[2][0]) / det, (vecs[0][2] * vecs[1][0] - vecs[0][0] * vecs[1][2]) / det],
      [(vecs[1][0] * vecs[2][1] - vecs[1][1] * vecs[2][0]) / det, (vecs[0][1] * vecs[2][0] - vecs[0][0] * vecs[2][1]) / det, (vecs[0][0] * vecs[1][1] - vecs[0][1] * vecs[1][0]) / det]
    ];
    const [cx, cy, cz] = cart;
    return [inv[0][0] * cx + inv[0][1] * cy + inv[0][2] * cz, inv[1][0] * cx + inv[1][1] * cy + inv[1][2] * cz, inv[2][0] * cx + inv[2][1] * cy + inv[2][2] * cz];
  }

  function sitesToAtoms(sites, vecs) {
    return sites.map((s, i) => {
      const c = fracToCart([s.x, s.y, s.z], vecs);
      return { x: c[0], y: c[1], z: c[2], role: s.role, id: i };
    });
  }

  const workerCode = function () {
    self.onmessage = function (e) {
      const { type, payload } = e.data || {};
      if (type === 'run') {
        const { populationSize, generations, mutationRate, crossoverRate, potential, potentialParams, latticeParams, vecs, initialSites } = payload;
        const pop = [];
        const N = initialSites.length;
        for (let p = 0; p < (populationSize || 20); p++) {
          pop.push(initialSites.map(s => ({ x: s.x + (Math.random() - 0.5) * 0.2, y: s.y + (Math.random() - 0.5) * 0.2, z: s.z + (Math.random() - 0.5) * 0.2, role: s.role })).map(s => ({ ...s, x: ((s.x % 1) + 1) % 1, y: ((s.y % 1) + 1) % 1, z: ((s.z % 1) + 1) % 1 })));
        }
        const history = [];
        for (let gen = 0; gen < (generations || 50); gen++) {
          const scored = pop.map(sites => {
            const atoms = sitesToAtoms(sites, vecs);
            const e = evaluateEnergy(atoms, vecs, potential || 'lj', potentialParams || {}, 8);
            return { sites, energy: e };
          });
          scored.sort((a, b) => a.energy - b.energy);
          const best = scored[0];
          history.push({ generation: gen, bestEnergy: best.energy, population: scored.length });
          self.postMessage({ type: 'progress', generation: gen, bestEnergy: best.energy, bestSites: best.sites });

          const next = scored.slice(0, Math.ceil(pop.length / 2));
          while (next.length < pop.length) {
            const a = next[Math.floor(Math.random() * next.length)].sites;
            const b = next[Math.floor(Math.random() * next.length)].sites;
            let child = crossover(a, b);
            if (Math.random() < (mutationRate ?? 0.3)) child = mutate(child, 0.15);
            next.push({ sites: child, energy: 0 });
          }
          for (let i = Math.ceil(pop.length / 2); i < next.length; i++) pop[i] = next[i].sites;
          for (let i = 0; i < Math.ceil(pop.length / 2); i++) pop[i] = next[i].sites;
        }
        const finalScored = pop.map(sites => ({ sites, energy: evaluateEnergy(sitesToAtoms(sites, vecs), vecs, potential || 'lj', potentialParams || {}, 8) }));
        finalScored.sort((a, b) => a.energy - b.energy);
        const bestAtoms = sitesToAtoms(finalScored[0].sites, vecs);
        self.postMessage({ type: 'done', bestAtoms, bestSites: finalScored[0].sites, bestEnergy: finalScored[0].energy, history });
      }
    };
  };

  function createWorkerBlob() {
    const fnStr = workerCode.toString();
    const body = fnStr.slice(fnStr.indexOf('{') + 1, fnStr.lastIndexOf('}'));
    const deps = `function wrap(x){return ((x%1)+1)%1;}
function lennardJones(r,sigma,epsilon){if(r<1e-6)return 1e10;var s6=Math.pow(sigma/r,6);return 4*epsilon*(s6*s6-s6);}
function morse(r,D,a,r0){var ex=Math.exp(-a*(r-r0));return D*(ex*ex-2*ex);}
function buckingham(r,A,rho,C){if(r<1e-6)return 1e10;return A*Math.exp(-r/rho)-C/Math.pow(r,6);}
function pairEnergy(r,pot,params){if(pot==='morse')return morse(r,params.D||1,params.a||2,params.r0||1);if(pot==='buckingham')return buckingham(r,params.A||1000,params.rho||0.3,params.C||100);return lennardJones(r,params.sigma||1,params.epsilon||1);}
function pbcDistance(c1,c2,vecs){var dx=c2[0]-c1[0],dy=c2[1]-c1[1],dz=c2[2]-c1[2],minD2=dx*dx+dy*dy+dz*dz;for(var i=-1;i<=1;i++)for(var j=-1;j<=1;j++)for(var k=-1;k<=1;k++){var rx=dx+i*vecs[0][0]+j*vecs[1][0]+k*vecs[2][0],ry=dy+i*vecs[0][1]+j*vecs[1][1]+k*vecs[2][1],rz=dz+i*vecs[0][2]+j*vecs[1][2]+k*vecs[2][2],d2=rx*rx+ry*ry+rz*rz;if(d2<minD2)minD2=d2;}return Math.sqrt(minD2);}
function evaluateEnergy(atoms,vecs,potential,params,cutoff){var E=0,rc=cutoff||10;for(var i=0;i<atoms.length;i++)for(var j=i+1;j<atoms.length;j++){var r=pbcDistance([atoms[i].x,atoms[i].y,atoms[i].z],[atoms[j].x,atoms[j].y,atoms[j].z],vecs);if(r<rc)E+=pairEnergy(r,potential,params);}return E;}
function mutate(sites,scale){return sites.map(function(s){return{x:wrap(s.x+(Math.random()-0.5)*scale),y:wrap(s.y+(Math.random()-0.5)*scale),z:wrap(s.z+(Math.random()-0.5)*scale),role:s.role};});}
function crossover(sitesA,sitesB){return sitesA.map(function(s,i){var t=sitesB[i];if(!t)return Object.assign({},s);return{x:wrap(Math.random()<0.5?s.x:t.x),y:wrap(Math.random()<0.5?s.y:t.y),z:wrap(Math.random()<0.5?s.z:t.z),role:s.role};});}
function fracToCart(frac,vecs){var x=frac[0],y=frac[1],z=frac[2];return[vecs[0][0]*x+vecs[1][0]*y+vecs[2][0]*z,vecs[0][1]*x+vecs[1][1]*y+vecs[2][1]*z,vecs[0][2]*x+vecs[1][2]*y+vecs[2][2]*z];}
function sitesToAtoms(sites,vecs){return sites.map(function(s,i){var c=fracToCart([s.x,s.y,s.z],vecs);return{x:c[0],y:c[1],z:c[2],role:s.role,id:i};});}\n`;
    return new Blob([deps + body], { type: 'application/javascript' });
  }

  let worker = null;

  function runOptimization(options, onProgress, onDone) {
    if (worker) worker.terminate();
    worker = new Worker(URL.createObjectURL(createWorkerBlob()));
    worker.onmessage = function (e) {
      if (e.data.type === 'progress') onProgress && onProgress(e.data);
      else if (e.data.type === 'done') onDone && onDone(e.data);
    };
    worker.postMessage({
      type: 'run',
      payload: {
        populationSize: options.populationSize || 20,
        generations: options.generations || 50,
        mutationRate: options.mutationRate ?? 0.3,
        crossoverRate: options.crossoverRate ?? 0.5,
        potential: options.potential || 'lj',
        potentialParams: options.potentialParams || {},
        latticeParams: options.latticeParams || { a: 5, b: 5, c: 5 },
        vecs: options.vecs || [[5, 0, 0], [0, 5, 0], [0, 0, 5]],
        initialSites: options.initialSites || []
      }
    });
  }

  function stopOptimization() {
    if (worker) { worker.terminate(); worker = null; }
  }

  const EvolutionaryOptimizer = {
    runOptimization,
    stopOptimization,
    evaluateEnergy,
    lennardJones,
    morse,
    buckingham
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = EvolutionaryOptimizer;
  else global.EvolutionaryOptimizer = EvolutionaryOptimizer;
})(typeof self !== 'undefined' ? self : this);
