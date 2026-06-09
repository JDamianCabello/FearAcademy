/* ============================================================
   scene.js — Hero bush canvas (Three.js r128)
   LoL-style bush (broad pointed leaves). On scroll the bush
   parts like a gank, the camera pushes in, and Evelynn rises
   out of the brush.
   ============================================================ */
(function () {
  if (typeof THREE === 'undefined') { console.warn('THREE not loaded'); return; }

  const canvas = document.getElementById('hero-canvas');
  const hero = document.getElementById('top');
  if (!canvas || !hero) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GROUND = -1.7;
  const EVE_Z = -3.7;
  const EVE_SCALE_HEIGHT = 1.55;
  const EVE_START = { rotX: -60, rotY: 159, rotZ: -24, posX: 1.8,  posY: 1.2 };
  const EVE_END   = { rotX: 39,  rotY: -33, rotZ: 21,  posX: 0.25, posY: 1.55 };
  const eveDebug = Object.assign({}, EVE_START);
  let eveDebugEls = null;

  function degToRad(deg) { return deg * Math.PI / 180; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  // Live debug values (separate from EVE_END so sliders don't fight the lerp)
  let debugOverride = false;
  const debugVals = Object.assign({}, EVE_END);

  function slider(id, label, min, max, step, val) {
    return '<div style="margin-bottom:10px">' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:3px">' +
        '<span style="color:#8a8a9a">' + label + '</span>' +
        '<span id="' + id + '-val" style="color:#33e0c6;min-width:46px;text-align:right">' + val + '</span>' +
      '</div>' +
      '<input id="' + id + '" type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" ' +
        'style="width:100%;accent-color:#33e0c6;cursor:pointer" />' +
    '</div>';
  }

  function createDebugPanel() {
    const panel = document.createElement('div');
    panel.id = 'eve-debug-panel';
    panel.style.cssText = [
      'position:fixed', 'right:16px', 'bottom:16px', 'z-index:9999',
      'width:300px', 'padding:16px',
      'background:rgba(5,7,11,0.93)',
      'border:1px solid rgba(51,224,198,0.4)',
      'color:#eceae4',
      'font:12px/1.5 JetBrains Mono,Consolas,monospace',
      'box-shadow:0 16px 48px rgba(0,0,0,0.6)',
      'backdrop-filter:blur(14px)',
      'border-radius:2px'
    ].join(';');

    panel.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">' +
        '<span style="color:#33e0c6;text-transform:uppercase;letter-spacing:.16em;font-size:11px">Debug Evelynn</span>' +
        '<label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:11px;color:#8a8a9a">' +
          '<input type="checkbox" id="eve-override" style="accent-color:#33e0c6" /> Freeze pose' +
        '</label>' +
      '</div>' +

      '<div style="color:#e0ae4a;font-size:10px;letter-spacing:.14em;text-transform:uppercase;margin-bottom:8px">— Rotación modelo —</div>' +
      slider('eve-rx', 'Rot X (deg)', -180, 180, 1,   EVE_END.rotX) +
      slider('eve-ry', 'Rot Y (deg)', -180, 180, 1,   EVE_END.rotY) +
      slider('eve-rz', 'Rot Z (deg)', -180, 180, 1,   EVE_END.rotZ) +

      '<div style="color:#e0ae4a;font-size:10px;letter-spacing:.14em;text-transform:uppercase;margin:12px 0 8px">— Posición en escena —</div>' +
      slider('eve-px', 'Pos X',  -8,  8, 0.05, EVE_END.posX) +
      slider('eve-py', 'Pos Y',  -2,  4, 0.05, EVE_END.posY) +

      '<div style="display:flex;gap:8px;margin-top:14px">' +
        '<button id="eve-copy" style="flex:1;background:rgba(51,224,198,0.12);border:1px solid rgba(51,224,198,0.4);color:#33e0c6;padding:7px;cursor:pointer;font:11px JetBrains Mono,monospace;letter-spacing:.1em">COPIAR</button>' +
        '<button id="eve-reset" style="flex:1;background:rgba(216,66,91,0.1);border:1px solid rgba(216,66,91,0.35);color:#d8425b;padding:7px;cursor:pointer;font:11px JetBrains Mono,monospace;letter-spacing:.1em">RESET</button>' +
      '</div>';

    document.body.appendChild(panel);

    function wireSlider(id, key, isFloat) {
      const el = document.getElementById(id);
      const lbl = document.getElementById(id + '-val');
      el.addEventListener('input', function() {
        const v = isFloat ? parseFloat(el.value) : parseInt(el.value, 10);
        lbl.textContent = isFloat ? v.toFixed(2) : v;
        debugVals[key] = v;
        EVE_END[key] = v;
      });
    }
    wireSlider('eve-rx', 'rotX', false);
    wireSlider('eve-ry', 'rotY', false);
    wireSlider('eve-rz', 'rotZ', false);
    wireSlider('eve-px', 'posX', true);
    wireSlider('eve-py', 'posY', true);

    document.getElementById('eve-override').addEventListener('change', function() {
      debugOverride = this.checked;
    });

    document.getElementById('eve-copy').addEventListener('click', function() {
      const s = 'const EVE_END = { rotX:' + EVE_END.rotX + ', rotY:' + EVE_END.rotY +
        ', rotZ:' + EVE_END.rotZ + ', posX:' + EVE_END.posX.toFixed(2) +
        ', posY:' + EVE_END.posY.toFixed(2) + ' };';
      navigator.clipboard.writeText(s).then(function() {
        document.getElementById('eve-copy').textContent = '✓ COPIADO';
        setTimeout(function() { document.getElementById('eve-copy').textContent = 'COPIAR'; }, 1800);
      }).catch(function() { console.log(s); });
    });

    document.getElementById('eve-reset').addEventListener('click', function() {
      var orig = { rotX:-3, rotY:-3, rotZ:-19, posX:-0.5, posY:0.9 };
      ['rotX','rotY','rotZ','posX','posY'].forEach(function(k) {
        EVE_END[k] = debugVals[k] = orig[k];
      });
      document.getElementById('eve-rx').value = orig.rotX;
      document.getElementById('eve-ry').value = orig.rotY;
      document.getElementById('eve-rz').value = orig.rotZ;
      document.getElementById('eve-px').value = orig.posX;
      document.getElementById('eve-py').value = orig.posY;
      document.getElementById('eve-rx-val').textContent = orig.rotX;
      document.getElementById('eve-ry-val').textContent = orig.rotY;
      document.getElementById('eve-rz-val').textContent = orig.rotZ;
      document.getElementById('eve-px-val').textContent = orig.posX.toFixed(2);
      document.getElementById('eve-py-val').textContent = orig.posY.toFixed(2);
    });

    eveDebugEls = null;
  }

  // createDebugPanel(); // desactivado — valores fijados

  function setEveDebug(next) {
    eveDebug.rotX = next.rotX;
    eveDebug.rotY = next.rotY;
    eveDebug.rotZ = next.rotZ;
    eveDebug.posX = next.posX;
    eveDebug.posY = next.posY;

    if (eveDebugEls) {
      eveDebugEls.x.textContent = eveDebug.rotX.toFixed(0);
      eveDebugEls.y.textContent = eveDebug.rotY.toFixed(0);
      eveDebugEls.z.textContent = eveDebug.rotZ.toFixed(0);
      eveDebugEls.posX.textContent = eveDebug.posX.toFixed(2);
      eveDebugEls.posY.textContent = eveDebug.posY.toFixed(2);
    }

    window.__eveDebug = {
      rotX: eveDebug.rotX, rotY: eveDebug.rotY, rotZ: eveDebug.rotZ,
      posX: eveDebug.posX, posY: eveDebug.posY
    };
    window.__eveRotationDebug = { x: eveDebug.rotX, y: eveDebug.rotY, z: eveDebug.rotZ };
  }

  function getEvePose(t) {
    return {
      rotX: lerp(EVE_START.rotX, EVE_END.rotX, t),
      rotY: lerp(EVE_START.rotY, EVE_END.rotY, t),
      rotZ: lerp(EVE_START.rotZ, EVE_END.rotZ, t),
      posX: lerp(EVE_START.posX, EVE_END.posX, t),
      posY: lerp(EVE_START.posY, EVE_END.posY, t)
    };
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x07090e, 1);
  if ('outputEncoding' in renderer) renderer.outputEncoding = THREE.sRGBEncoding;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07090e, 0.05);

  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 120);
  const CAM_START = new THREE.Vector3(0, 1.25, 7.4);
  const CAM_END   = new THREE.Vector3(0, 0.95, 2.9);
  camera.position.copy(CAM_START);

  /* ---------- lights ---------- */
  scene.add(new THREE.HemisphereLight(0x2c5560, 0x080810, 0.85));
  const key  = new THREE.DirectionalLight(0xcdeee7, 1.15); key.position.set(3, 6, 5);      scene.add(key);
  const rim  = new THREE.DirectionalLight(0x9b3bff, 1.6);  rim.position.set(-4.5, 3.5, -6); scene.add(rim);
  const fill = new THREE.PointLight(0x33e0c6, 1.0, 26, 2); fill.position.set(0.5, 1.6, -1.5); scene.add(fill);

  /* ---------- ground ---------- */
  (function ground() {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(128, 128, 8, 128, 128, 128);
    grd.addColorStop(0,    '#1a332e');
    grd.addColorStop(0.35, '#0f1f1d');
    grd.addColorStop(0.7,  '#0a1214');
    grd.addColorStop(1,    '#07090e');
    g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    const mesh = new THREE.Mesh(
      new THREE.CircleGeometry(22, 56),
      new THREE.MeshBasicMaterial({ map: tex, fog: true })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(0, GROUND - 0.02, -4);
    scene.add(mesh);
  })();

  /* ---------- bush blades ---------- */
  const COUNT = reduce ? 900 : 2600;
  const blade = new THREE.PlaneGeometry(0.24, 1.0, 1, 6);
  blade.translate(0, 0.5, 0);
  (function taper() {
    const p = blade.attributes.position, uv = blade.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const h = uv.getY(i);
      const t = Math.pow(1 - h, 0.5);
      p.setX(i, p.getX(i) * t);
      p.setZ(i, p.getZ(i) + Math.sin(h * 1.3) * 0.1);
    }
    p.needsUpdate = true;
    blade.computeVertexNormals();
  })();

  const rand = new Float32Array(COUNT);
  blade.setAttribute('aRand', new THREE.InstancedBufferAttribute(rand, 1));

  const grassMat = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    fog: true,
    depthWrite: false,
    uniforms: {
      uTime:      { value: 0 },
      uScatter:   { value: 0 },
      fogColor:   { value: scene.fog.color },
      fogDensity: { value: scene.fog.density }
    },
    vertexShader: `
      precision highp float;
      uniform float uTime;
      uniform float uScatter;
      attribute float aRand;
      varying float vH;
      varying float vRand;
      varying float vFogDepth;
      varying float vCutout;
      void main(){
        vH = uv.y;
        vRand = aRand;
        vCutout = 0.0;
        vec4 t = vec4(position, 1.0);
        #ifdef USE_INSTANCING
          t = instanceMatrix * t;
        #endif
        float originX = t.x;
        float originZ = t.z;
        float ph = aRand * 6.2831;
        float wind = sin(uTime*1.2 + t.x*0.5 + t.z*0.4 + ph)*0.14
                   + sin(uTime*2.5 + ph)*0.05;
        t.x += wind * vH * vH;
        float side = sign(originX + (aRand-0.5)*0.001);
        float nearEve = (1.0 - smoothstep(1.2, 4.0, abs(originZ+3.7)))
                      * (1.0 - smoothstep(1.6, 3.8, abs(originX)));
        float hinge  = smoothstep(0.0, 1.4, abs(originX));
        float centre = (1.0 - hinge) * nearEve;
        float split  = uScatter * centre;
        t.x += side * split * (5.5 + vH*3.0);
        vCutout = uScatter
                * (1.0 - smoothstep(1.4, 3.2, abs(originZ+3.7)))
                * (1.0 - smoothstep(1.1, 2.4, abs(originX)));
        vec4 mv = modelViewMatrix * t;
        vFogDepth = -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      precision highp float;
      varying float vH;
      varying float vRand;
      varying float vFogDepth;
      varying float vCutout;
      uniform vec3 fogColor;
      uniform float fogDensity;
      void main(){
        if (vCutout > 0.04) discard;
        vec3 base = mix(vec3(0.025,0.105,0.092), vec3(0.13,0.40,0.31), vH);
        base = mix(base, vec3(0.18,0.55,0.45), vRand*vRand*0.5*vH);
        base += vec3(0.0,0.02,0.03)*vRand;
        float f = 1.0 - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
        vec3 col = mix(base, fogColor, clamp(f,0.0,1.0));
        gl_FragColor = vec4(col, 1.0);
      }`
  });

  const grass = new THREE.InstancedMesh(blade, grassMat, COUNT);
  grass.renderOrder = 1;
  const dummy = new THREE.Object3D();
  for (let i = 0; i < COUNT; i++) {
    let x, z, h;
    if (Math.random() < 0.6) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.6) * 1.9;
      x = Math.cos(a) * r * 1.15;
      z = EVE_Z + Math.sin(a) * r * 0.6;
      h = 1.3 + Math.random() * 1.2;
    } else {
      x = (Math.random() - 0.5) * 26;
      z = -16 + Math.random() * 18;
      h = 0.7 + Math.random() * 1.4;
    }
    dummy.position.set(x, GROUND, z);
    dummy.rotation.y = Math.random() * Math.PI;
    dummy.rotation.z = (Math.random() - 0.5) * 0.3;
    dummy.scale.set(0.7 + Math.random() * 0.8, h, 1);
    dummy.updateMatrix();
    grass.setMatrixAt(i, dummy.matrix);
    rand[i] = Math.random();
  }
  grass.instanceMatrix.needsUpdate = true;
  scene.add(grass);

  /* ---------- wisps ---------- */
  function wispTexture() {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0,    'rgba(255,255,255,1)');
    grd.addColorStop(0.25, 'rgba(150,255,232,0.9)');
    grd.addColorStop(1,    'rgba(150,255,232,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  const WN = reduce ? 50 : 150;
  const wpos = new Float32Array(WN * 3);
  const wseed = new Float32Array(WN);
  const wcol = new Float32Array(WN * 3);
  for (let i = 0; i < WN; i++) {
    wpos[i*3]   = (Math.random() - 0.5) * 22;
    wpos[i*3+1] = -0.8 + Math.random() * 4.5;
    wpos[i*3+2] = -14 + Math.random() * 16;
    wseed[i] = Math.random() * 100;
    const purple = Math.random() < 0.3;
    wcol[i*3]   = purple ? 0.72 : 0.32;
    wcol[i*3+1] = purple ? 0.34 : 0.92;
    wcol[i*3+2] = purple ? 1.0  : 0.80;
  }
  const wgeo = new THREE.BufferGeometry();
  wgeo.setAttribute('position', new THREE.BufferAttribute(wpos, 3));
  wgeo.setAttribute('color',    new THREE.BufferAttribute(wcol, 3));
  const wmat = new THREE.PointsMaterial({
    size: 0.27, map: wispTexture(), transparent: true,
    depthWrite: false, blending: THREE.AdditiveBlending,
    vertexColors: true, opacity: 0.95
  });
  const wisps = new THREE.Points(wgeo, wmat);
  scene.add(wisps);
  const wbase = wpos.slice();

  /* ---------- Evelynn (GLB) ---------- */
  let evePivot = null, mixer = null;
  const eveMats = [];
  if (typeof THREE.GLTFLoader !== 'undefined') {
    new THREE.GLTFLoader().load('assets/media/evelynn.glb', function (gltf) {
      const eve = gltf.scene;
      let box = new THREE.Box3().setFromObject(eve);
      const size = new THREE.Vector3(); box.getSize(size);
      const s = EVE_SCALE_HEIGHT / (size.y || 1);
      eve.scale.setScalar(s);
      box = new THREE.Box3().setFromObject(eve);
      eve.position.x -= (box.min.x + box.max.x) / 2;
      eve.position.z -= (box.min.z + box.max.z) / 2;
      eve.position.y -= box.min.y;

      evePivot = new THREE.Group();
      evePivot.add(eve);
      evePivot.position.set(0, GROUND, EVE_Z + 0.18);
      setEveDebug(EVE_START);
      evePivot.position.x = eveDebug.posX;
      evePivot.position.y = GROUND + eveDebug.posY;
      evePivot.rotation.x = degToRad(eveDebug.rotX);
      evePivot.rotation.y = degToRad(eveDebug.rotY);
      evePivot.rotation.z = degToRad(eveDebug.rotZ);
      evePivot.renderOrder = 5;
      scene.add(evePivot);

      const opaqueMeshes = [], alphaMeshes = [];
      eve.traverse(function (o) {
        if (!o.isMesh) return;
        o.frustumCulled = false;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        const isHair = mats.some(function(m) {
          return m && (m.alphaTest > 0 || m.transparent || (m.name && /hair|fur|strand/i.test(m.name)));
        });
        if (isHair) alphaMeshes.push(o);
        else        opaqueMeshes.push(o);
      });

      opaqueMeshes.forEach(function(o) {
        o.renderOrder = 5;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach(function(mat) {
          if (!mat) return;
          mat.transparent = true; mat.opacity = 0;
          mat.depthTest = true; mat.depthWrite = true;
          eveMats.push(mat);
        });
      });

      alphaMeshes.forEach(function(o) {
        o.renderOrder = 6;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach(function(mat) {
          if (!mat) return;
          mat.transparent = true; mat.opacity = 0;
          mat.depthTest = true; mat.depthWrite = false;
          eveMats.push(mat);
        });
      });

      if (gltf.animations && gltf.animations.length) {
        mixer = new THREE.AnimationMixer(eve);
        const act = mixer.clipAction(gltf.animations[0]);
        act.setLoop(THREE.LoopRepeat); act.clampWhenFinished = false;
        act.play();
      }
    }, undefined, function (err) { console.warn('Evelynn load failed', err); });
  }

  /* ---------- scroll + animation ---------- */
  const heroInner  = document.getElementById('hero-inner');
  const heroReveal = document.getElementById('hero-reveal');
  const heroMeta   = document.querySelector('.hero-meta');
  const stage      = canvas.parentElement;

  function readProgress() {
    const track = (hero.offsetHeight - window.innerHeight) || window.innerHeight;
    const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    return Math.min(Math.max(y / track, 0), 1);
  }

  function resize() {
    const w = stage.clientWidth  || window.innerWidth;
    const h = stage.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  const clock = new THREE.Clock();
  let curScatter = 0, curProg = 0;

  function smooth(e, a, b) { const t = Math.min(Math.max((e - a) / (b - a), 0), 1); return t * t * (3 - 2 * t); }

  function tick() {
    const dt = clock.getDelta();
    const t  = clock.elapsedTime;
    const progress = readProgress();
    window.__p = progress;
    curProg += (progress - curProg) * 0.08;
    const eased = curProg * curProg * (3 - 2 * curProg);

    grassMat.uniforms.uTime.value = t;
    const targetScatter = smooth(eased, 0.02, 0.62) * 1.35;
    curScatter += (targetScatter - curScatter) * 0.1;
    grassMat.uniforms.uScatter.value = curScatter;

    camera.position.lerpVectors(CAM_START, CAM_END, eased);
    camera.position.x += Math.sin(t * 0.12) * 0.28 * (1 - eased);
    const lookY = 0.5 + (0.28 - 0.5) * eased;
    const lookZ = -6 + (EVE_Z - (-6)) * eased;
    camera.lookAt(0, lookY, lookZ);

    if (evePivot) {
      var pose;
      if (debugOverride) {
        pose = { rotX: EVE_END.rotX, rotY: EVE_END.rotY, rotZ: EVE_END.rotZ,
                 posX: EVE_END.posX, posY: EVE_END.posY };
        for (var m = 0; m < eveMats.length; m++) eveMats[m].opacity = 1;
      } else {
        var app = smooth(eased, 0.03, 0.42);
        pose = getEvePose(app);
        for (var m = 0; m < eveMats.length; m++) eveMats[m].opacity = app;
      }
      setEveDebug(pose);
      evePivot.position.x = eveDebug.posX;
      evePivot.position.y = GROUND + eveDebug.posY;
      evePivot.rotation.x = degToRad(eveDebug.rotX);
      evePivot.rotation.y = degToRad(eveDebug.rotY) + (debugOverride ? 0 : Math.sin(t * 0.25) * 0.035);
      evePivot.rotation.z = degToRad(eveDebug.rotZ);
    }
    if (mixer) mixer.update(dt);

    if (heroInner) {
      const hide = smooth(eased, 0.03, 0.28);
      heroInner.style.opacity   = String(1 - hide);
      heroInner.style.transform = 'translateY(' + (-40 * hide) + 'px)';
    }
    if (heroMeta) heroMeta.style.opacity = String(1 - smooth(eased, 0.03, 0.24));
    if (heroReveal) {
      const show = smooth(eased, 0.45, 0.8);
      heroReveal.style.opacity   = String(show);
      heroReveal.style.transform = 'translateX(-50%) translateY(' + (24 * (1 - show)) + 'px)';
    }

    const wp = wgeo.attributes.position.array;
    for (let i = 0; i < WN; i++) {
      const s = wseed[i];
      wp[i*3]   = wbase[i*3]   + Math.sin(t * 0.4 + s) * 0.5;
      wp[i*3+1] = wbase[i*3+1] + Math.sin(t * 0.6 + s * 1.3) * 0.35 + eased * 2.4;
      wp[i*3+2] = wbase[i*3+2] + Math.cos(t * 0.3 + s) * 0.4;
    }
    wgeo.attributes.position.needsUpdate = true;
    wmat.opacity = 0.95 * (1 - eased * 0.55);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
})();
