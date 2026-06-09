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
  const EVE_SCALE_HEIGHT = 2.55;
  const EVE_START = { rotX: -60, rotY: 159, rotZ: -24, posX: 1.8, posY: 1.2 };
  const EVE_END = { rotX: 6, rotY: -3, rotZ: -19, posX: -0.5, posY: 0.9 };
  const eveDebug = Object.assign({}, EVE_START);
  let eveDebugEls = null;

  function degToRad(deg) { return deg * Math.PI / 180; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function createDebugPanel() {
    const panel = document.createElement('div');
    panel.style.cssText = [
      'position:fixed',
      'right:16px',
      'bottom:16px',
      'z-index:1000',
      'width:260px',
      'padding:14px',
      'background:rgba(5,7,11,0.88)',
      'border:1px solid rgba(51,224,198,0.35)',
      'color:#eceae4',
      'font:12px/1.4 JetBrains Mono, Consolas, monospace',
      'box-shadow:0 12px 40px rgba(0,0,0,0.45)',
      'backdrop-filter:blur(10px)'
    ].join(';');

    panel.innerHTML =
      '<div style="color:#33e0c6;text-transform:uppercase;letter-spacing:.16em;margin-bottom:10px">Debug Evelynn</div>' +
      '<div>Rot X: <span id="eve-debug-x">-60</span>deg</div>' +
      '<div>Rot Y: <span id="eve-debug-y">159</span>deg</div>' +
      '<div>Rot Z: <span id="eve-debug-z">-24</span>deg</div>' +
      '<div style="margin-top:8px">Pos X: <span id="eve-debug-pos-x">1.80</span></div>' +
      '<div>Pos Y: <span id="eve-debug-pos-y">1.20</span></div>';

    document.body.appendChild(panel);

    eveDebugEls = {
      x: panel.querySelector('#eve-debug-x'),
      y: panel.querySelector('#eve-debug-y'),
      z: panel.querySelector('#eve-debug-z'),
      posX: panel.querySelector('#eve-debug-pos-x'),
      posY: panel.querySelector('#eve-debug-pos-y')
    };
  }

  createDebugPanel();

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
      rotX: eveDebug.rotX,
      rotY: eveDebug.rotY,
      rotZ: eveDebug.rotZ,
      posX: eveDebug.posX,
      posY: eveDebug.posY
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
  const CAM_END = new THREE.Vector3(0, 0.95, 2.9);
  camera.position.copy(CAM_START);

  /* ---------- lights (for Evelynn) ---------- */
  scene.add(new THREE.HemisphereLight(0x2c5560, 0x080810, 0.85));
  const key = new THREE.DirectionalLight(0xcdeee7, 1.15); key.position.set(3, 6, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0x9b3bff, 1.6); rim.position.set(-4.5, 3.5, -6); scene.add(rim);
  const fill = new THREE.PointLight(0x33e0c6, 1.0, 26, 2); fill.position.set(0.5, 1.6, -1.5); scene.add(fill);

  /* ---------- ground patch (so Evelynn isn't floating in void) ---------- */
  (function ground() {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(128, 128, 8, 128, 128, 128);
    grd.addColorStop(0, '#1a332e');
    grd.addColorStop(0.35, '#0f1f1d');
    grd.addColorStop(0.7, '#0a1214');
    grd.addColorStop(1, '#07090e');
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

  /* ---------- bush leaves ---------- */
  const COUNT = reduce ? 900 : 2600;
  const blade = new THREE.PlaneGeometry(0.24, 1.0, 1, 6);
  blade.translate(0, 0.5, 0);
  (function taper() {
    const p = blade.attributes.position, uv = blade.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const h = uv.getY(i);
      const t = Math.pow(1 - h, 0.5);            // taper to a sharp point
      p.setX(i, p.getX(i) * t);
      p.setZ(i, p.getZ(i) + Math.sin(h * 1.3) * 0.1); // gentle forward curve
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
      uTime: { value: 0 },
      uScatter: { value: 0 },
      fogColor: { value: scene.fog.color },
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
        // gank: the bush splits down the middle into two halves
        float side = sign(originX + (aRand-0.5)*0.001);
        float nearEve = (1.0 - smoothstep(1.0, 3.0, abs(originZ+3.7)))
                      * (1.0 - smoothstep(1.15, 2.75, abs(originX)));
        float hinge = smoothstep(0.0, 1.15, abs(originX));
        float centre = (1.0 - hinge) * nearEve;
        float split = uScatter * centre;
        t.x += side * split * (3.2 + vH*1.35);
        vCutout = uScatter
                * (1.0 - smoothstep(0.95, 2.25, abs(originZ+3.7)))
                * (1.0 - smoothstep(0.86, 1.72, abs(originX)));
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
        if (vCutout > 0.08) discard;
        // LoL-bush blue-green: dark base, cooler bright tip
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
      // dense central bush around Evelynn — a tight tuft that splits cleanly
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

  /* ---------- wisps / fireflies ---------- */
  function wispTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.25, 'rgba(150,255,232,0.9)');
    grd.addColorStop(1, 'rgba(150,255,232,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  const WN = reduce ? 50 : 150;
  const wpos = new Float32Array(WN * 3);
  const wseed = new Float32Array(WN);
  const wcol = new Float32Array(WN * 3);
  for (let i = 0; i < WN; i++) {
    wpos[i * 3] = (Math.random() - 0.5) * 22;
    wpos[i * 3 + 1] = -0.8 + Math.random() * 4.5;
    wpos[i * 3 + 2] = -14 + Math.random() * 16;
    wseed[i] = Math.random() * 100;
    const purple = Math.random() < 0.3;
    wcol[i * 3] = purple ? 0.72 : 0.32;
    wcol[i * 3 + 1] = purple ? 0.34 : 0.92;
    wcol[i * 3 + 2] = purple ? 1.0 : 0.80;
  }
  const wgeo = new THREE.BufferGeometry();
  wgeo.setAttribute('position', new THREE.BufferAttribute(wpos, 3));
  wgeo.setAttribute('color', new THREE.BufferAttribute(wcol, 3));
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
    new THREE.GLTFLoader().load('uploads/evelynn.glb', function (gltf) {
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

      eve.traverse(function (o) {
        if (o.isMesh) {
          o.frustumCulled = false;
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach(function (mat) {
            if (!mat) return;
            mat.transparent = true;
            mat.opacity = 0;
            mat.depthTest = false;
            mat.depthWrite = false;
            eveMats.push(mat);
          });
          o.renderOrder = 5;
        }
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
  const heroInner = document.getElementById('hero-inner');
  const heroReveal = document.getElementById('hero-reveal');
  const heroMeta = document.querySelector('.hero-meta');
  const stage = canvas.parentElement;

  function readProgress() {
    const track = (hero.offsetHeight - window.innerHeight) || window.innerHeight;
    const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    return Math.min(Math.max(y / track, 0), 1);
  }

  function resize() {
    const w = stage.clientWidth || window.innerWidth;
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
    const t = clock.elapsedTime;
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

    // Evelynn rises out of the bush + fades in (early)
    if (evePivot) {
      const app = smooth(eased, 0.03, 0.42);
      const pose = getEvePose(app);
      setEveDebug(pose);
      evePivot.position.x = eveDebug.posX;
      evePivot.position.y = GROUND + eveDebug.posY;
      for (let i = 0; i < eveMats.length; i++) eveMats[i].opacity = app;
      evePivot.rotation.x = degToRad(eveDebug.rotX);
      evePivot.rotation.y = degToRad(eveDebug.rotY) + Math.sin(t * 0.25) * 0.035;
      evePivot.rotation.z = degToRad(eveDebug.rotZ);
    }
    if (mixer) mixer.update(dt);

    // headline recedes; Evelynn caption emerges; stats fade
    if (heroInner) {
      const hide = smooth(eased, 0.03, 0.28);
      heroInner.style.opacity = String(1 - hide);
      heroInner.style.transform = 'translateY(' + (-40 * hide) + 'px)';
    }
    if (heroMeta) heroMeta.style.opacity = String(1 - smooth(eased, 0.03, 0.24));
    if (heroReveal) {
      const show = smooth(eased, 0.45, 0.8);
      heroReveal.style.opacity = String(show);
      heroReveal.style.transform = 'translateX(-50%) translateY(' + (24 * (1 - show)) + 'px)';
    }

    const wp = wgeo.attributes.position.array;
    for (let i = 0; i < WN; i++) {
      const s = wseed[i];
      wp[i * 3] = wbase[i * 3] + Math.sin(t * 0.4 + s) * 0.5;
      wp[i * 3 + 1] = wbase[i * 3 + 1] + Math.sin(t * 0.6 + s * 1.3) * 0.35 + eased * 2.4;
      wp[i * 3 + 2] = wbase[i * 3 + 2] + Math.cos(t * 0.3 + s) * 0.4;
    }
    wgeo.attributes.position.needsUpdate = true;
    wmat.opacity = 0.95 * (1 - eased * 0.55);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
})();
