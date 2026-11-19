/**
 * ORTHOLENS 3D — WEBGL MEDICAL & DENTAL MESH VIEWER
 * ==================================================
 * Authorship: Joon Kang (Bioinformatics & CS)
 * Features:
 * - High-precision Three.js 3D viewport with studio lighting
 * - Procedural anatomical dental meshes (Molar, Dental Arch, Aligner)
 * - STL & OBJ drag-and-drop file loader
 * - Point-to-point 3D digital caliper measurement with raycasting
 * - Cross-sectional clipping slice plane
 * - Mesh topology & dimensional statistics
 */

class OrthoLensViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    // State
    this.activeTool = 'orbit'; // 'orbit' | 'caliper' | 'slice'
    this.currentShading = 'enamel'; // 'enamel' | 'normal' | 'xray' | 'wireframe'
    this.activeModelName = 'molar';
    
    // Meshes
    this.currentMesh = null;
    this.measurements = [];
    this.caliperPointA = null;
    this.caliperMarkers = [];
    this.caliperLabels = [];

    // Slice Plane
    this.clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 10);
    this.isClippingEnabled = false;

    // Raycaster
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.initScene();
    this.initLights();
    this.initControls();
    this.initHelpers();
    this.initEventListeners();
    this.loadModel('molar');
    this.animate();
  }

  /* ------------------------------------------------------------------------
     1. Scene Initialization
     ------------------------------------------------------------------------ */
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x09090b);

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 25, 45);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.localClippingEnabled = true;

    this.container.appendChild(this.renderer.domElement);
  }

  /* ------------------------------------------------------------------------
     2. Studio Lighting
     ------------------------------------------------------------------------ */
  initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Key Light (Clinical dental operatory lamp)
    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    this.keyLight.position.set(20, 35, 25);
    this.scene.add(this.keyLight);

    // Fill Light
    const fillLight = new THREE.DirectionalLight(0x94a3b8, 0.5);
    fillLight.position.set(-25, 15, -20);
    this.scene.add(fillLight);

    // Rim / Contour Light
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    rimLight.position.set(0, -25, -20);
    this.scene.add(rimLight);
  }

  /* ------------------------------------------------------------------------
     3. Orbit Controls
     ------------------------------------------------------------------------ */
  initControls() {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 150;
    this.controls.minDistance = 5;
    this.controls.target.set(0, 0, 0);
  }

  /* ------------------------------------------------------------------------
     4. Helpers & Measurement Visuals
     ------------------------------------------------------------------------ */
  initHelpers() {
    // Ground Grid
    this.gridHelper = new THREE.GridHelper(50, 50, 0x27272a, 0x18181b);
    this.gridHelper.position.y = -12;
    this.scene.add(this.gridHelper);

    // Axes
    this.axesHelper = new THREE.AxesHelper(10);
    this.axesHelper.position.set(-22, -11.9, -22);
    this.scene.add(this.axesHelper);

    // Measurement Cursor Indicator
    const cursorGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const cursorMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true });
    this.cursorMarker = new THREE.Mesh(cursorGeo, cursorMat);
    this.cursorMarker.visible = false;
    this.scene.add(this.cursorMarker);
  }

  /* ------------------------------------------------------------------------
     5. Procedural Anatomical Mesh Generators
     ------------------------------------------------------------------------ */
  generateMolarGeometry() {
    // Generate a high-detail anatomical molar crown with 4 cusps and diverging roots
    const group = new THREE.Group();
    
    // Crown base
    const crownGeo = new THREE.CylinderGeometry(5.2, 4.4, 5.5, 48, 24);
    const pos = crownGeo.attributes.position;
    
    // Sculpt the 4 anatomical cusps (MB, DB, ML, DL) and central groove
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      if (y > 1.5) {
        // Cusp modulation
        const cuspAmp = Math.sin(x * 0.7) * Math.cos(z * 0.7);
        const centralGroove = 1 - Math.exp(-(x * x + z * z) * 0.15);
        y += cuspAmp * 1.35 * centralGroove;
        pos.setY(i, y);
      }
    }
    crownGeo.computeVertexNormals();

    // Mesial Root
    const mesialRootGeo = new THREE.ConeGeometry(2.1, 9, 32, 16);
    mesialRootGeo.translate(-2.2, -7, 0);
    mesialRootGeo.rotateZ(0.12);

    // Distal Root
    const distalRootGeo = new THREE.ConeGeometry(1.9, 8.5, 32, 16);
    distalRootGeo.translate(2.2, -6.8, 0);
    distalRootGeo.rotateZ(-0.14);

    // Merge meshes into a single clinical solid
    const mergedGeo = THREE.BufferGeometryUtils ? 
      THREE.BufferGeometryUtils.mergeBufferGeometries([crownGeo, mesialRootGeo, distalRootGeo]) : crownGeo;

    mergedGeo.center();
    return mergedGeo;
  }

  generateDentalArchGeometry() {
    // Generate full parabolic dental arch
    const archCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-14, 0, 10),
      new THREE.Vector3(0, 0, -18),
      new THREE.Vector3(14, 0, 10)
    );

    const points = archCurve.getPoints(14);
    const toothGeometries = [];

    points.forEach((pt, idx) => {
      const isAnterior = idx >= 5 && idx <= 9;
      const sizeX = isAnterior ? 1.4 : 2.5;
      const sizeY = isAnterior ? 3.8 : 3.0;
      const sizeZ = isAnterior ? 1.6 : 2.8;

      const toothGeo = new THREE.BoxGeometry(sizeX, sizeY, sizeZ, 8, 8, 8);
      // Round edges
      const pos = toothGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i);
        if (y > 0) {
          pos.setY(i, y + Math.sin(pos.getX(i)) * 0.3);
        }
      }
      toothGeo.computeVertexNormals();
      toothGeo.translate(pt.x, pt.y, pt.z);
      toothGeometries.push(toothGeo);
    });

    const archGeo = THREE.BufferGeometryUtils ? 
      THREE.BufferGeometryUtils.mergeBufferGeometries(toothGeometries) : toothGeometries[0];

    archGeo.center();
    return archGeo;
  }

  generateAlignerGeometry() {
    // Generate translucent orthodontic aligner tray shell
    const baseArch = this.generateDentalArchGeometry();
    const alignerGeo = baseArch.clone();
    alignerGeo.scale(1.08, 1.08, 1.08);
    return alignerGeo;
  }

  /* ------------------------------------------------------------------------
     6. Model Loading & Material Switching
     ------------------------------------------------------------------------ */
  loadModel(modelKey) {
    if (this.currentMesh) {
      this.scene.remove(this.currentMesh);
      if (this.currentMesh.geometry) this.currentMesh.geometry.dispose();
      this.currentMesh = null;
    }

    this.clearCaliper();

    let geometry;
    if (modelKey === 'molar') {
      geometry = this.generateMolarGeometry();
    } else if (modelKey === 'arch') {
      geometry = this.generateDentalArchGeometry();
    } else if (modelKey === 'aligner') {
      geometry = this.generateAlignerGeometry();
    }

    if (!geometry) return;

    this.activeModelName = modelKey;
    const material = this.createMaterial(this.currentShading);
    this.currentMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.currentMesh);

    // Center camera and update inspection statistics
    this.fitCameraToMesh(this.currentMesh);
    this.updateMeshStats(geometry);
  }

  createMaterial(shadingType) {
    switch (shadingType) {
      case 'normal':
        return new THREE.MeshNormalMaterial({
          clippingPlanes: this.isClippingEnabled ? [this.clipPlane] : [],
          clipShadows: true
        });

      case 'xray':
        return new THREE.MeshPhysicalMaterial({
          color: 0x38bdf8,
          transmission: 0.85,
          opacity: 0.5,
          transparent: true,
          roughness: 0.1,
          ior: 1.45,
          depthWrite: false,
          clippingPlanes: this.isClippingEnabled ? [this.clipPlane] : []
        });

      case 'wireframe':
        return new THREE.MeshStandardMaterial({
          color: 0x10b981,
          wireframe: true,
          clippingPlanes: this.isClippingEnabled ? [this.clipPlane] : []
        });

      case 'enamel':
      default:
        return new THREE.MeshStandardMaterial({
          color: 0xf8fafc,
          roughness: 0.35,
          metalness: 0.05,
          clippingPlanes: this.isClippingEnabled ? [this.clipPlane] : [],
          clipShadows: true
        });
    }
  }

  setShading(shadingType) {
    this.currentShading = shadingType;
    if (this.currentMesh) {
      this.currentMesh.material = this.createMaterial(shadingType);
    }
  }

  /* ------------------------------------------------------------------------
     7. Custom File Loading (STL / OBJ)
     ------------------------------------------------------------------------ */
  loadCustomFile(file) {
    const filename = file.name.toLowerCase();
    const reader = new FileReader();

    showViewerToast(`Parsing ${file.name}...`);

    reader.onload = (e) => {
      try {
        let geometry;
        if (filename.endsWith('.stl')) {
          const loader = new THREE.STLLoader();
          geometry = loader.parse(e.target.result);
        } else if (filename.endsWith('.obj')) {
          const loader = new THREE.OBJLoader();
          const obj = loader.parse(e.target.result);
          obj.traverse((child) => {
            if (child.isMesh) geometry = child.geometry;
          });
        }

        if (geometry) {
          geometry.computeVertexNormals();
          geometry.center();

          if (this.currentMesh) {
            this.scene.remove(this.currentMesh);
          }
          this.clearCaliper();

          const mat = this.createMaterial(this.currentShading);
          this.currentMesh = new THREE.Mesh(geometry, mat);
          this.scene.add(this.currentMesh);

          this.fitCameraToMesh(this.currentMesh);
          this.updateMeshStats(geometry);

          showViewerToast(`Loaded custom mesh: ${file.name}`);
        } else {
          showViewerToast("Could not extract mesh geometry from file.");
        }
      } catch (err) {
        console.error("Error loading file:", err);
        showViewerToast("Error parsing file: " + err.message);
      }
    };

    if (filename.endsWith('.stl')) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  }

  /* ------------------------------------------------------------------------
     8. 3D Raycasting & Digital Caliper (Millimeter Accuracy)
     ------------------------------------------------------------------------ */
  setTool(tool) {
    this.activeTool = tool;

    if (tool === 'caliper') {
      this.controls.enabled = false;
      showViewerToast("Caliper Active: Click two points on the model to measure.");
    } else {
      this.controls.enabled = true;
      this.cursorMarker.visible = false;
    }
  }

  handlePointerMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    if (this.activeTool === 'caliper' && this.currentMesh) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObject(this.currentMesh, true);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        this.cursorMarker.position.copy(point);
        this.cursorMarker.visible = true;
      } else {
        this.cursorMarker.visible = false;
      }
    }
  }

  handleCanvasClick(event) {
    if (this.activeTool !== 'caliper' || !this.currentMesh) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.currentMesh, true);
    if (intersects.length === 0) return;

    const clickedPoint = intersects[0].point.clone();

    if (!this.caliperPointA) {
      // First click: Set Point A
      this.caliperPointA = clickedPoint;
      const markerA = this.createPointMarker(clickedPoint, 0x10b981); // Green
      this.caliperMarkers.push(markerA);
      showViewerToast("Point A set. Click second point (Point B).");
    } else {
      // Second click: Set Point B & Calculate Distance
      const markerB = this.createPointMarker(clickedPoint, 0x06b6d4); // Cyan
      this.caliperMarkers.push(markerB);

      const distance = this.caliperPointA.distanceTo(clickedPoint);
      const distMm = distance.toFixed(2);

      // Create connecting line
      const line = this.createMeasureLine(this.caliperPointA, clickedPoint);
      this.caliperMarkers.push(line);

      // Calculate midpoint for 3D label
      const midpoint = new THREE.Vector3().addVectors(this.caliperPointA, clickedPoint).multiplyScalar(0.5);
      this.create3DLabel(midpoint, `${distMm} mm`);

      // Add to UI Table
      this.addMeasurementToUI(distMm);
      showViewerToast(`Distance: ${distMm} mm`);

      // Reset for next measurement
      this.caliperPointA = null;
    }
  }

  createPointMarker(position, colorHex) {
    const geo = new THREE.SphereGeometry(0.35, 16, 16);
    const mat = new THREE.MeshBasicMaterial({ color: colorHex });
    const marker = new THREE.Mesh(geo, mat);
    marker.position.copy(position);
    this.scene.add(marker);
    return marker;
  }

  createMeasureLine(p1, p2) {
    const geometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    const material = new THREE.LineDashedMaterial({
      color: 0x10b981,
      dashSize: 0.5,
      gapSize: 0.25,
      linewidth: 2
    });
    const line = new THREE.Line(geometry, material);
    line.computeLineDistances();
    this.scene.add(line);
    return line;
  }

  create3DLabel(worldPosition, text) {
    const labelDiv = document.createElement('div');
    labelDiv.className = 'caliper-label-3d';
    labelDiv.textContent = text;
    this.container.appendChild(labelDiv);

    this.caliperLabels.push({
      element: labelDiv,
      position: worldPosition
    });
  }

  clearCaliper() {
    this.caliperPointA = null;
    this.caliperMarkers.forEach(m => this.scene.remove(m));
    this.caliperMarkers = [];

    this.caliperLabels.forEach(lbl => {
      if (lbl.element && lbl.element.parentNode) {
        lbl.element.parentNode.removeChild(lbl.element);
      }
    });
    this.caliperLabels = [];

    const historyContainer = document.getElementById('measurementHistory');
    if (historyContainer) historyContainer.innerHTML = '';
  }

  addMeasurementToUI(distMm) {
    const historyContainer = document.getElementById('measurementHistory');
    if (!historyContainer) return;

    const count = historyContainer.children.length + 1;
    const entry = document.createElement('div');
    entry.className = 'measurement-entry';
    entry.innerHTML = `
      <span>M${count}</span>
      <span class="distance-value">${distMm} mm</span>
    `;
    historyContainer.prepend(entry);
  }

  /* ------------------------------------------------------------------------
     9. Clipping Plane (Cross-Section)
     ------------------------------------------------------------------------ */
  setClippingEnabled(enabled) {
    this.isClippingEnabled = enabled;
    this.renderer.localClippingEnabled = enabled;
    if (this.currentMesh) {
      this.currentMesh.material.clippingPlanes = enabled ? [this.clipPlane] : [];
      this.currentMesh.material.needsUpdate = true;
    }
  }

  setClipPlaneHeight(val) {
    this.clipPlane.constant = parseFloat(val);
  }

  /* ------------------------------------------------------------------------
     10. Camera Fit & Mesh Analytics
     ------------------------------------------------------------------------ */
  fitCameraToMesh(mesh) {
    mesh.geometry.computeBoundingBox();
    const box = mesh.geometry.boundingBox;
    const center = new THREE.Vector3();
    box.getCenter(center);
    mesh.position.sub(center); // Recenter mesh at origin

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    this.camera.position.set(0, maxDim * 1.2, maxDim * 2.2);
    this.camera.lookAt(0, 0, 0);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  updateMeshStats(geometry) {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    const size = new THREE.Vector3();
    box.getSize(size);

    const vertexCount = geometry.attributes.position ? geometry.attributes.position.count : 0;
    const triangleCount = geometry.index ? (geometry.index.count / 3) : Math.floor(vertexCount / 3);

    // Update UI elements
    const vEl = document.getElementById('statVertices');
    const tEl = document.getElementById('statTriangles');
    const dimEl = document.getElementById('statDimensions');

    if (vEl) vEl.textContent = vertexCount.toLocaleString();
    if (tEl) tEl.textContent = triangleCount.toLocaleString();
    if (dimEl) dimEl.textContent = `${size.x.toFixed(1)} × ${size.y.toFixed(1)} × ${size.z.toFixed(1)} mm`;
  }

  /* ------------------------------------------------------------------------
     11. Screen Projection for 3D Labels & Animation Loop
     ------------------------------------------------------------------------ */
  updateLabels() {
    if (this.caliperLabels.length === 0) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.caliperLabels.forEach(lbl => {
      const screenPos = lbl.position.clone().project(this.camera);

      // Check if behind camera
      if (screenPos.z > 1) {
        lbl.element.style.display = 'none';
        return;
      }

      lbl.element.style.display = 'block';
      const x = (screenPos.x * 0.5 + 0.5) * width;
      const y = (-(screenPos.y * 0.5) + 0.5) * height;

      lbl.element.style.left = `${x}px`;
      lbl.element.style.top = `${y}px`;
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.updateLabels();
    this.renderer.render(this.scene, this.camera);
  }

  /* ------------------------------------------------------------------------
     12. DOM Event Listeners & Drag/Drop
     ------------------------------------------------------------------------ */
  initEventListeners() {
    window.addEventListener('resize', () => {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });

    const canvas = this.renderer.domElement;
    canvas.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    canvas.addEventListener('click', (e) => this.handleCanvasClick(e));

    // Drag & Drop STL/OBJ
    window.addEventListener('dragover', (e) => e.preventDefault());
    window.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        this.loadCustomFile(e.dataTransfer.files[0]);
      }
    });
  }

  exportSnapshot() {
    const dataUrl = this.renderer.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `ortholens-${this.activeModelName}-${Date.now()}.png`;
    a.click();
    showViewerToast("High-resolution snapshot downloaded!");
  }

  resetView() {
    if (this.currentMesh) {
      this.fitCameraToMesh(this.currentMesh);
    }
  }
}

// Global Toast helper
function showViewerToast(msg) {
  const toast = document.getElementById('viewerToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// App Initialization
let viewerInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  viewerInstance = new OrthoLensViewer('viewportContainer');

  // Model Dropdown
  const modelSelect = document.getElementById('modelSelect');
  modelSelect?.addEventListener('change', (e) => {
    viewerInstance.loadModel(e.target.value);
  });

  // File Upload
  const fileInput = document.getElementById('fileUploadInput');
  fileInput?.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      viewerInstance.loadCustomFile(e.target.files[0]);
    }
  });

  // Tools Selection (Orbit vs Caliper)
  const toolBtns = document.querySelectorAll('.tool-palette-btn');
  toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toolBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tool = btn.getAttribute('data-tool');
      viewerInstance.setTool(tool);
    });
  });

  // Shading Buttons
  const shadingBtns = document.querySelectorAll('.shading-btn');
  shadingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      shadingBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const shading = btn.getAttribute('data-shading');
      viewerInstance.setShading(shading);
    });
  });

  // Clear Measurements Button
  const clearBtn = document.getElementById('clearMeasurementsBtn');
  clearBtn?.addEventListener('click', () => {
    viewerInstance.clearCaliper();
    showViewerToast("All measurements cleared.");
  });

  // Clipping Slice Toggle & Slider
  const clipToggle = document.getElementById('clipToggle');
  const clipSlider = document.getElementById('clipSlider');
  const clipValLabel = document.getElementById('clipValLabel');

  clipToggle?.addEventListener('change', (e) => {
    viewerInstance.setClippingEnabled(e.target.checked);
  });

  clipSlider?.addEventListener('input', (e) => {
    const val = e.target.value;
    if (clipValLabel) clipValLabel.textContent = `${val} mm`;
    viewerInstance.setClipPlaneHeight(val);
  });

  // Grid & Axes Toggles
  const gridToggle = document.getElementById('gridToggle');
  const axesToggle = document.getElementById('axesToggle');

  gridToggle?.addEventListener('change', (e) => {
    viewerInstance.gridHelper.visible = e.target.checked;
  });

  axesToggle?.addEventListener('change', (e) => {
    viewerInstance.axesHelper.visible = e.target.checked;
  });

  // Snapshot & Reset View
  document.getElementById('snapshotBtn')?.addEventListener('click', () => {
    viewerInstance.exportSnapshot();
  });

  document.getElementById('resetViewBtn')?.addEventListener('click', () => {
    viewerInstance.resetView();
  });
});
