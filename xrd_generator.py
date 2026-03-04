"""
XRD Pattern Generator
=====================
Computes powder X-ray diffraction patterns from crystal structures.

Features:
- Accepts unit cell or supercell definitions
- Computes allowed (hkl) reflections via systematic absence rules
- Applies Bragg's Law to convert d-spacings to 2θ angles
- Computes structure factors F(hkl) with atomic form factors (Cromer-Mann)
- Applies Lorentz-polarization correction
- Generates normalized powder XRD pattern (2θ vs intensity)
- Optional Scherrer crystallite-size broadening

Usage:
    python xrd_generator.py

Or import and use programmatically:
    from xrd_generator import Crystal, XRDPattern, UnitCell, Atom
"""

import numpy as np
import itertools
from dataclasses import dataclass, field
from typing import List, Tuple, Optional, Dict

# Optional matplotlib only for standalone plotting
try:
    import matplotlib.pyplot as plt
    HAS_MPL = True
except ImportError:
    HAS_MPL = False


# ─────────────────────────────────────────────
# Atomic form factor coefficients (Cromer-Mann)
# a1, b1, a2, b2, a3, b3, a4, b4, c
# ─────────────────────────────────────────────
FORM_FACTORS: Dict[str, List[float]] = {
    "H":  [0.489918, 20.6593, 0.262003, 7.74039, 0.196767, 49.5519, 0.049879, 2.20159, 0.001305],
    "C":  [2.31000, 20.8439, 1.02000, 10.2075, 1.58860, 0.56870, 0.865000, 51.6512, 0.21560],
    "N":  [12.2126, 0.00570, 3.13220, 9.89330, 2.01250, 28.9975, 1.16630, 0.58260, -11.529],
    "O":  [3.04850, 13.2771, 2.28680, 5.70110, 1.54630, 0.32390, 0.867000, 32.9089, 0.25080],
    "Na": [4.76260, 3.28500, 3.17360, 8.84220, 1.26740, 0.31360, 1.11280, 129.424, 0.67600],
    "Mg": [5.42040, 2.82750, 2.17350, 79.2611, 1.22690, 0.38080, 2.30730, 7.19370, 0.85820],
    "Al": [6.42020, 3.03870, 1.90020, 0.74260, 1.59360, 31.5472, 1.96460, 85.0886, 1.11510],
    "Si": [6.29150, 2.43860, 3.03530, 32.3337, 1.98910, 0.67850, 1.54100, 81.6937, 1.14070],
    "P":  [6.43450, 1.90670, 4.17910, 27.1570, 1.78000, 0.52600, 1.49080, 68.1645, 1.11490],
    "S":  [6.90530, 1.46790, 5.20340, 22.2151, 1.43790, 0.25360, 1.58630, 56.1720, 0.86690],
    "Cl": [11.4604, 0.01040, 7.19640, 1.16620, 6.25560, 18.5194, 1.64550, 47.7784, -9.5574],
    "K":  [8.21860, 12.7949, 7.43980, 0.77480, 1.05190, 213.187, 0.86590, 41.6841, 1.42280],
    "Ca": [8.62660, 10.4421, 7.38730, 0.65990, 1.58990, 85.7484, 1.02110, 178.437, 1.37510],
    "Fe": [11.7695, 4.76110, 7.35730, 0.30720, 3.52220, 15.3535, 2.30450, 76.8805, 1.03690],
    "Cu": [13.3380, 3.58280, 7.16760, 0.24700, 5.61580, 11.3966, 1.67350, 64.8126, 1.19100],
    "Zn": [14.0743, 3.26550, 7.03180, 0.23330, 5.16520, 10.3163, 2.41000, 58.7097, 1.30410],
    "Ge": [15.2354, 3.06690, 6.70060, 0.24120, 4.35910, 10.7805, 2.96230, 61.4135, 1.71890],
    "Sr": [17.5663, 1.55640, 9.81840, 14.0988, 5.42200, 0.16640, 2.66940, 132.376, 2.50640],
    "Ba": [20.3361, 3.21600, 19.2970, 0.27560, 10.8880, 20.2073, 2.69590, 167.202, 2.77310],
    "Pb": [31.0617, 0.69020, 13.0637, 2.35760, 18.4420, 8.61800, 5.96960, 47.2579, 13.4118],
    "Ti": [9.75950, 7.85080, 7.35580, 0.50000, 1.69910, 35.6338, 1.90210, 116.105, 1.28070],
    "Zr": [17.8765, 1.27618, 10.9480, 11.9160, 5.41732, 0.117622, 3.65721, 87.6627, 2.06929],
    "La": [20.5780, 2.94817, 19.5990, 0.244475, 11.3727, 18.7726, 3.28719, 133.124, 2.14678],
    "Y":  [17.7760, 1.40290, 10.2946, 12.8006, 5.72629, 0.125599, 3.26588, 68.7775, 1.91213],
    "default": [6.0, 10.0, 4.0, 30.0, 2.0, 1.0, 1.0, 60.0, 0.5],
}


def atomic_form_factor(element: str, s: float) -> float:
    """
    Compute atomic form factor f(s) using Cromer-Mann coefficients.
    s = sin(θ)/λ  [Å⁻¹]
    f(s) = Σ aᵢ·exp(-bᵢ·s²) + c
    """
    coeff = FORM_FACTORS.get(element, FORM_FACTORS["default"])
    a = coeff[0:8:2]
    b = coeff[1:8:2]
    c = coeff[8]
    s2 = s ** 2
    return sum(ai * np.exp(-bi * s2) for ai, bi in zip(a, b)) + c


# ─────────────────────────────────────────────
# Data structures
# ─────────────────────────────────────────────

@dataclass
class Atom:
    """Represents an atom in the unit cell."""
    element: str
    x: float
    y: float
    z: float
    occupancy: float = 1.0
    B_iso: float = 0.5  # Isotropic displacement parameter (Å²)


@dataclass
class UnitCell:
    """Defines the crystallographic unit cell."""
    a: float
    b: float
    c: float
    alpha: float
    beta: float
    gamma: float
    atoms: List[Atom] = field(default_factory=list)
    spacegroup: str = "P1"

    def metric_tensor(self) -> np.ndarray:
        """Compute the metric tensor G."""
        a, b, c = self.a, self.b, self.c
        al = np.radians(self.alpha)
        be = np.radians(self.beta)
        ga = np.radians(self.gamma)
        G = np.array([
            [a*a,            a*b*np.cos(ga), a*c*np.cos(be)],
            [a*b*np.cos(ga), b*b,            b*c*np.cos(al)],
            [a*c*np.cos(be), b*c*np.cos(al), c*c           ]
        ])
        return G

    def volume(self) -> float:
        """Unit cell volume (Å³)."""
        return np.sqrt(np.linalg.det(self.metric_tensor()))

    def d_spacing(self, h: int, k: int, l: int) -> float:
        """Compute d-spacing for (hkl) plane."""
        G = self.metric_tensor()
        G_inv = np.linalg.inv(G)
        hkl = np.array([h, k, l], dtype=float)
        q2 = hkl @ G_inv @ hkl
        if q2 <= 0:
            return np.inf
        return 1.0 / np.sqrt(q2)


@dataclass
class Crystal:
    """A crystal structure ready for XRD simulation."""
    unit_cell: UnitCell

    def _is_allowed(self, h: int, k: int, l: int) -> bool:
        """Systematic absence rules: P, I, F, C/A/B, R, diamond."""
        sg = self.unit_cell.spacegroup.upper()
        if sg.startswith("F"):
            parity = {h % 2, k % 2, l % 2}
            return len(parity) == 1
        if sg.startswith("I"):
            return (h + k + l) % 2 == 0
        if sg.startswith("C"):
            return (h + k) % 2 == 0
        if sg.startswith("A"):
            return (k + l) % 2 == 0
        if sg.startswith("B"):
            return (h + l) % 2 == 0
        if sg.startswith("R"):
            return (-h + k + l) % 3 == 0
        if "D" in sg or sg in ("FD3M", "FD-3M", "DIAMOND"):
            if {h % 2, k % 2, l % 2} != {0} and len({h % 2, k % 2, l % 2}) != 1:
                return False
            if (h + k + l) % 4 != 0 and all(x % 2 == 0 for x in (h, k, l)):
                return False
            return True
        return (h, k, l) != (0, 0, 0)


class XRDPattern:
    """
    Computes powder XRD patterns with structure factors, LP correction,
    and optional Scherrer broadening.
    """

    def __init__(
        self,
        crystal: Crystal,
        wavelength: float = 1.5406,
        two_theta_range: Tuple[float, float] = (5.0, 90.0),
        hkl_max: int = 10,
        peak_width: float = 0.15,
        scherrer_size_nm: Optional[float] = None,
        shape_factor_k: float = 0.9,
    ):
        self.crystal = crystal
        self.wavelength = wavelength
        self.two_theta_min, self.two_theta_max = two_theta_range
        self.hkl_max = hkl_max
        self.peak_width = peak_width
        self.scherrer_size_nm = scherrer_size_nm
        self.shape_factor_k = shape_factor_k
        self._reflections: List[dict] = []

    def _structure_factor(self, h: int, k: int, l: int, s: float) -> complex:
        """F(hkl) = Σ fⱼ·Tⱼ·exp(2πi(hxⱼ+kyⱼ+lzⱼ)), Tⱼ = exp(-Bⱼ·s²)."""
        F = 0.0 + 0.0j
        for atom in self.crystal.unit_cell.atoms:
            f = atomic_form_factor(atom.element, s)
            T = np.exp(-atom.B_iso * s**2)
            phase = 2 * np.pi * (h * atom.x + k * atom.y + l * atom.z)
            F += atom.occupancy * f * T * np.exp(1j * phase)
        return F

    @staticmethod
    def _LP_factor(two_theta_deg: float) -> float:
        """LP = (1 + cos²(2θ)) / (sin²(θ)·cos(θ))."""
        tt = np.radians(two_theta_deg)
        theta = tt / 2.0
        sin_t = np.sin(theta)
        cos_t = np.cos(theta)
        cos_2t = np.cos(tt)
        denom = sin_t**2 * cos_t
        if abs(denom) < 1e-10:
            return 0.0
        return (1 + cos_2t**2) / denom

    @staticmethod
    def _multiplicity(h: int, k: int, l: int) -> int:
        """Powder multiplicity (equivalent hkl under sign and permutation)."""
        indices = set()
        for signs in itertools.product([-1, 1], repeat=3):
            for perm in itertools.permutations([h, k, l]):
                indices.add(tuple(s * p for s, p in zip(signs, perm)))
        return len(indices)

    def compute_reflections(self) -> List[dict]:
        """Enumerate (hkl), apply absences, Bragg, F(hkl), LP; merge by d."""
        uc = self.crystal.unit_cell
        lam = self.wavelength
        seen_d = {}
        hrange = range(-self.hkl_max, self.hkl_max + 1)
        for h, k, l in itertools.product(hrange, hrange, hrange):
            if (h, k, l) == (0, 0, 0) or not self.crystal._is_allowed(h, k, l):
                continue
            d = uc.d_spacing(h, k, l)
            if d == np.inf or d <= 0:
                continue
            sin_theta = lam / (2.0 * d)
            if sin_theta > 1.0 or sin_theta < 0:
                continue
            theta = np.arcsin(sin_theta)
            two_theta = np.degrees(2 * theta)
            if not (self.two_theta_min <= two_theta <= self.two_theta_max):
                continue
            s = np.sin(theta) / lam
            F = self._structure_factor(h, k, l, s)
            F_sq = abs(F) ** 2
            if F_sq < 1e-4:
                continue
            LP = self._LP_factor(two_theta)
            mult = self._multiplicity(h, k, l)
            intensity = mult * F_sq * LP
            d_key = round(d, 4)
            if d_key in seen_d:
                seen_d[d_key]["intensity"] += intensity
                seen_d[d_key]["hkl_list"].append((h, k, l))
            else:
                seen_d[d_key] = {
                    "hkl": (h, k, l),
                    "hkl_list": [(h, k, l)],
                    "d": d,
                    "two_theta": two_theta,
                    "F_sq": F_sq,
                    "multiplicity": mult,
                    "LP": LP,
                    "intensity": intensity,
                }
        self._reflections = sorted(seen_d.values(), key=lambda r: r["two_theta"])
        return self._reflections

    def _peak_fwhm_deg(self, two_theta_deg: float) -> float:
        """FWHM from Scherrer: K·λ/(L·cos(θ)); L in nm, return FWHM in degrees."""
        if self.scherrer_size_nm is None or self.scherrer_size_nm <= 0:
            return self.peak_width
        theta_rad = np.radians(two_theta_deg / 2.0)
        cos_t = max(np.cos(theta_rad), 1e-6)
        L_A = self.scherrer_size_nm * 10.0
        fwhm_rad = 2 * np.arcsin(self.shape_factor_k * self.wavelength / (L_A * cos_t))
        return np.degrees(fwhm_rad)

    def generate_pattern(
        self,
        n_points: int = 5000,
    ) -> Tuple[np.ndarray, np.ndarray]:
        """Convolve stick pattern with Gaussian (FWHM from peak_width or Scherrer)."""
        if not self._reflections:
            self.compute_reflections()
        tt = np.linspace(self.two_theta_min, self.two_theta_max, n_points)
        pattern = np.zeros_like(tt)
        for ref in self._reflections:
            peak_pos = ref["two_theta"]
            peak_int = ref["intensity"]
            fwhm = self._peak_fwhm_deg(peak_pos)
            sigma = fwhm / (2 * np.sqrt(2 * np.log(2)))
            pattern += peak_int * np.exp(-0.5 * ((tt - peak_pos) / sigma) ** 2)
        if pattern.max() > 0:
            pattern = pattern / pattern.max() * 100.0
        return tt, pattern

    def get_peak_list(self) -> List[dict]:
        """Return list of peaks with two_theta, intensity, hkl for API."""
        if not self._reflections:
            self.compute_reflections()
        max_i = max(r["intensity"] for r in self._reflections) if self._reflections else 1
        return [
            {
                "two_theta": r["two_theta"],
                "intensity": float(r["intensity"]),
                "hkl": [list(hkl) for hkl in r["hkl_list"]],
            }
            for r in self._reflections
        ]

    def plot(self, save_path: Optional[str] = None, ax=None):
        """Plot pattern (requires matplotlib)."""
        if not HAS_MPL:
            raise ImportError("matplotlib required for plotting")
        tt, pattern = self.generate_pattern()
        if ax is None:
            fig, ax = plt.subplots(figsize=(12, 5))
            created_fig = True
        else:
            fig = ax.get_figure()
            created_fig = False
        ax.fill_between(tt, pattern, alpha=0.15, color="#2563eb")
        ax.plot(tt, pattern, color="#2563eb", linewidth=1.0)
        max_I = max(r["intensity"] for r in self._reflections) if self._reflections else 1
        for r in self._reflections:
            rel = r["intensity"] / max_I * 100
            ax.vlines(r["two_theta"], 0, -3 - rel * 0.05, color="#94a3b8", linewidth=0.6)
        uc = self.crystal.unit_cell
        ax.set_title(
            f"Simulated Powder XRD · {uc.spacegroup} · a={uc.a:.3f}, b={uc.b:.3f}, c={uc.c:.3f} Å · λ={self.wavelength:.4f} Å",
            fontsize=10, pad=8,
        )
        ax.set_xlabel("2θ (degrees)")
        ax.set_ylabel("Relative Intensity (%)")
        ax.set_xlim(self.two_theta_min, self.two_theta_max)
        ax.set_ylim(-6, 115)
        ax.grid(axis="x", linestyle="--", alpha=0.3)
        if created_fig:
            plt.tight_layout()
            if save_path:
                plt.savefig(save_path, dpi=150, bbox_inches="tight")
            plt.show()


# ─── Pre-built structures ───────────────────────────────────────────────────

def make_NaCl() -> Crystal:
    uc = UnitCell(a=5.6402, b=5.6402, c=5.6402, alpha=90, beta=90, gamma=90, spacegroup="Fm-3m")
    uc.atoms = [
        Atom("Na", 0.0, 0.0, 0.0), Atom("Na", 0.5, 0.5, 0.0),
        Atom("Na", 0.5, 0.0, 0.5), Atom("Na", 0.0, 0.5, 0.5),
        Atom("Cl", 0.5, 0.0, 0.0), Atom("Cl", 0.0, 0.5, 0.0),
        Atom("Cl", 0.0, 0.0, 0.5), Atom("Cl", 0.5, 0.5, 0.5),
    ]
    return Crystal(unit_cell=uc)


def make_BCC_Fe() -> Crystal:
    uc = UnitCell(a=2.8664, b=2.8664, c=2.8664, alpha=90, beta=90, gamma=90, spacegroup="Im-3m")
    uc.atoms = [Atom("Fe", 0.0, 0.0, 0.0), Atom("Fe", 0.5, 0.5, 0.5)]
    return Crystal(unit_cell=uc)


def make_FCC_Cu() -> Crystal:
    uc = UnitCell(a=3.6150, b=3.6150, c=3.6150, alpha=90, beta=90, gamma=90, spacegroup="Fm-3m")
    uc.atoms = [
        Atom("Cu", 0.0, 0.0, 0.0), Atom("Cu", 0.5, 0.5, 0.0),
        Atom("Cu", 0.5, 0.0, 0.5), Atom("Cu", 0.0, 0.5, 0.5),
    ]
    return Crystal(unit_cell=uc)


def make_diamond_Si() -> Crystal:
    a = 5.4309
    uc = UnitCell(a=a, b=a, c=a, alpha=90, beta=90, gamma=90, spacegroup="Fd-3m")
    uc.atoms = [
        Atom("Si", 0.0, 0.0, 0.0), Atom("Si", 0.5, 0.5, 0.0),
        Atom("Si", 0.5, 0.0, 0.5), Atom("Si", 0.0, 0.5, 0.5),
        Atom("Si", 0.25, 0.25, 0.25), Atom("Si", 0.75, 0.75, 0.25),
        Atom("Si", 0.75, 0.25, 0.75), Atom("Si", 0.25, 0.75, 0.75),
    ]
    return Crystal(unit_cell=uc)


def make_perovskite_BaTiO3() -> Crystal:
    a = 4.0000
    uc = UnitCell(a=a, b=a, c=a, alpha=90, beta=90, gamma=90, spacegroup="P1")
    uc.atoms = [
        Atom("Ba", 0.0, 0.0, 0.0), Atom("Ti", 0.5, 0.5, 0.5),
        Atom("O", 0.5, 0.5, 0.0), Atom("O", 0.5, 0.0, 0.5), Atom("O", 0.0, 0.5, 0.5),
    ]
    return Crystal(unit_cell=uc)


def make_custom(
    a: float, b: float, c: float,
    alpha: float = 90, beta: float = 90, gamma: float = 90,
    spacegroup: str = "P1",
    atoms: Optional[List[Atom]] = None,
) -> Crystal:
    uc = UnitCell(a=a, b=b, c=c, alpha=alpha, beta=beta, gamma=gamma, spacegroup=spacegroup)
    uc.atoms = atoms or []
    return Crystal(unit_cell=uc)


if __name__ == "__main__":
    crystal = make_NaCl()
    xrd = XRDPattern(crystal, wavelength=1.5406, two_theta_range=(10, 90), hkl_max=8, peak_width=0.18)
    xrd.compute_reflections()
    print("Reflections:", len(xrd._reflections))
    tt, pattern = xrd.generate_pattern()
    print("Pattern points:", len(tt), "2θ range:", tt[0], "-", tt[-1])
    if HAS_MPL:
        xrd.plot(save_path="xrd_patterns.png")
