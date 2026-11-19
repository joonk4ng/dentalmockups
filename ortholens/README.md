# OrthoLens 3D — Medical & Dental Mesh Inspector

A high-performance in-browser 3D mesh viewer engineered for medical, dental, and anatomical surface scans. Built with **Three.js** and **WebGL**, OrthoLens eliminates the friction of requiring heavy desktop CAD software for routine clinical reviews and consultations.

![Three.js](https://img.shields.io/badge/WebGL-Three.js_r128-09090b?style=for-the-badge&logo=three.js)
![Precision](https://img.shields.io/badge/Precision-Millimeter_Calipers-10b981?style=for-the-badge)
![Deployment](https://img.shields.io/badge/Deployment-Zero_Build_Static-blue?style=for-the-badge)

---

## 🎯 Clinical & Engineering Motivation

Modern intraoral scanners and medical imaging systems produce dense 3D surface meshes (stereolithography `.stl` and `.obj` formats). In clinical environments, reviewing treatment plans, measuring inter-canine arch widths, and evaluating restorative clearance often requires proprietary desktop licenses (e.g., Exocad, 3Shape, or heavy CAD viewers).

**OrthoLens** runs directly in any modern web browser with zero installation:
- **Instant Visualization**: Sub-second loading of multi-thousand polygon medical meshes.
- **Interactive Measurement**: Raycasting-powered 3D digital caliper calculating real-world Euclidean distances in millimeters.
- **Cross-Sectional Slice Plane**: Interactive local clipping to inspect internal tooth structure, enamel thickness, and pulp cavities.
- **Diagnostic Surface Shading**: Enamel, Normal map vectors (surface curvature), X-Ray translucency, and wireframe topology modes.

---

## 🔬 Mathematical & Technical Architecture

### 1. Raycasting & Point-to-Point Euclidean Caliper
When the user clicks the 3D surface, a normalized device coordinate ray is cast from camera space through the viewport:
$$P = \mathbf{O} + t\mathbf{D}$$
The raycaster intersects the nearest triangular polygon, computing the exact world coordinates $(x, y, z)$ of the vertex or face.

Between points $A(x_1, y_1, z_1)$ and $B(x_2, y_2, z_2)$, the 3D Euclidean distance is calculated:
$$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}$$
A dynamic 3D dashed line and billboarding screen-space HTML annotation display the measurement in real-time.

### 2. Local Clipping Plane (Cross-Section)
Clipping is computed on the GPU via hardware clip planes:
$$\mathbf{n} \cdot \mathbf{x} + d \ge 0$$
Where $\mathbf{n} = (0, -1, 0)$ defines the plane normal and $d$ represents the slider height constant, providing 60 FPS internal slice inspection.

### 3. Procedural Anatomical Generators
To guarantee zero-latency execution without external asset downloads, OrthoLens contains built-in procedural generators:
- **Mandibular Molar**: Sculpted with 4 anatomical cusps (Mesiobuccal, Distobuccal, Mesiolingual, Distolingual), central groove depression, and diverging dual root canals.
- **Parabolic Dental Arch**: 14 aligned crown blocks distributed along a quadratic Bezier curve.
- **Custom STL/OBJ Loader**: Drag-and-drop parsing supporting binary and ASCII files via `FileReader`.

---

## 🚀 Running Locally

Open `ortholens/index.html` directly in your browser, or run a local HTTP server:

```bash
python3 -m http.server 8000
```
Navigate to: `http://localhost:8000/ortholens/`
