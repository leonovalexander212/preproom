import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const PALETTE = {
  dark:  {
    bg: "#0a0a0a", grid: "#222222", gridAccent: "#e5ff00",
    star: 0xffffff, starOp: 0.6,
    // 0: жёлтый, 1: белый, 2: оранж, 3: зелёный
    wire: ["#e5ff00", "#ffffff", "#ff5b00", "#00ff88"],
  },
  light: {
    bg: "#f1ecd9", grid: "#c7bfa3", gridAccent: "#0a0a0a",
    star: 0x1a1a1a, starOp: 0.35,
    wire: ["#ff2d55", "#0a0a0a", "#ff5b00", "#2d8a4c"],
  },
};

function makeTex(draw, w = 256, h = 128) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

const TEXTURES = {
  sun: () => makeTex((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#ffe27a"); g.addColorStop(0.5, "#ffb020"); g.addColorStop(1, "#ff6a00");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const rnd = seededRand(11);
    for (let i = 0; i < 28; i++) {
      ctx.fillStyle = `rgba(180,60,0,${0.25 + rnd() * 0.45})`;
      ctx.beginPath(); ctx.arc(rnd()*w, rnd()*h, 3 + rnd()*12, 0, Math.PI*2); ctx.fill();
    }
    ctx.fillStyle = "rgba(255,255,210,0.5)";
    for (let i = 0; i < 40; i++) {
      ctx.beginPath(); ctx.arc(rnd()*w, rnd()*h, 1 + rnd()*2, 0, Math.PI*2); ctx.fill();
    }
  }),
  venus: () => makeTex((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#f0c987"); g.addColorStop(0.5, "#d89853"); g.addColorStop(1, "#9c632b");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,225,170,0.35)"; ctx.lineWidth = 2;
    for (let y = 8; y < h; y += 12) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const yy = y + Math.sin(x*0.05 + y*0.3) * 3;
        x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
  }),
  earth: () => makeTex((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#1e4a7c"); g.addColorStop(0.5, "#1f6fb8"); g.addColorStop(1, "#123a66");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const rnd = seededRand(7);
    ctx.fillStyle = "#2f8f3f";
    for (let i = 0; i < 14; i++) {
      const cx = rnd()*w, cy = 15 + rnd()*(h-30);
      ctx.beginPath();
      for (let a = 0; a < Math.PI*2; a += 0.3) {
        const r = 6 + rnd()*18;
        const px = cx + Math.cos(a)*r, py = cy + Math.sin(a)*r*0.65;
        a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = "rgba(200,170,90,0.55)";
    for (let i = 0; i < 10; i++) {
      ctx.beginPath(); ctx.arc(rnd()*w, 15 + rnd()*(h-30), 3 + rnd()*8, 0, Math.PI*2); ctx.fill();
    }
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    for (let i = 0; i < 26; i++) {
      ctx.beginPath(); ctx.arc(rnd()*w, rnd()*h, 2 + rnd()*7, 0, Math.PI*2); ctx.fill();
    }
  }),
  mars: () => makeTex((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#e8e8e8"); g.addColorStop(0.1, "#c76a3b");
    g.addColorStop(0.5, "#a34a1e"); g.addColorStop(0.9, "#c76a3b");
    g.addColorStop(1, "#e8e8e8");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const rnd = seededRand(41);
    for (let i = 0; i < 55; i++) {
      ctx.fillStyle = `rgba(70,25,10,${0.25 + rnd()*0.4})`;
      ctx.beginPath(); ctx.arc(rnd()*w, 15 + rnd()*(h-30), 1.5 + rnd()*4, 0, Math.PI*2); ctx.fill();
    }
    ctx.strokeStyle = "rgba(255,200,150,0.25)"; ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      const y = 25 + rnd()*(h-50);
      ctx.moveTo(0, y);
      for (let x = 0; x <= w; x += 6) ctx.lineTo(x, y + Math.sin(x*0.08 + i)*4);
      ctx.stroke();
    }
  }),
  jupiter: () => makeTex((ctx, w, h) => {
    const bands = ["#d6a871","#8b5c34","#e5c08e","#6b3e22","#d6a871","#b7814a","#e5c08e","#8b5c34","#d6a871","#6b3e22"];
    const bh = h / bands.length;
    bands.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(0, i*bh, w, bh+1); });
    ctx.strokeStyle = "rgba(0,0,0,0.18)"; ctx.lineWidth = 1;
    for (let y = bh; y < h; y += bh) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const yy = y + Math.sin(x*0.08 + y*0.1)*2.5;
        x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
    ctx.fillStyle = "#a93a1c";
    ctx.beginPath(); ctx.ellipse(w*0.32, h*0.62, 15, 7, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = "rgba(255,200,150,0.4)";
    ctx.beginPath(); ctx.ellipse(w*0.32, h*0.62, 15, 7, 0, 0, Math.PI*2); ctx.stroke();
  }),
  saturn: () => makeTex((ctx, w, h) => {
    const bands = ["#e0cb96","#c4a878","#eadba8","#a58550","#d9c69a","#c4a878","#eadba8"];
    const bh = h / bands.length;
    bands.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(0, i*bh, w, bh+1); });
    ctx.strokeStyle = "rgba(60,40,20,0.25)"; ctx.lineWidth = 1;
    for (let y = bh; y < h; y += bh) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
  }),
};

export default function BrutalScene({ theme = "dark" }) {
  const mountRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = window.innerWidth, height = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width/height, 0.1, 200);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(width, height);
    renderer.domElement.style.opacity = "0.55";
    renderer.domElement.style.filter = "saturate(0.7)";
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const gridGroup = new THREE.Group();
    gridGroup.position.set(0, -3, 0);
    const grid1 = new THREE.GridHelper(120, 60, "#e5ff00", "#222222");
    const grid2 = new THREE.GridHelper(120, 60, "#e5ff00", "#222222");
    grid2.position.z = -120;
    gridGroup.add(grid1); gridGroup.add(grid2);
    root.add(gridGroup);

    const count = 600;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i*3]   = (Math.random()-0.5)*80;
      positions[i*3+1] = (Math.random()-0.5)*50;
      positions[i*3+2] = (Math.random()-0.5)*80;
    }
    const starsGeom = new THREE.BufferGeometry();
    starsGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starsMat = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, transparent: true, opacity: 0.6 });
    const stars = new THREE.Points(starsGeom, starsMat);
    root.add(stars);

    // ===== ПЛАНЕТЫ =====
    // Меркурий убран: при низком pixelRatio он рендерился пиксельным
    // серым квадратом и казался "летающим кубом, следующим за курсором".
    const planetsData = [
      { name:"sun",     tex:"sun",     pos:[0, 2.8, -14],   radius:2.4,  segs:24, paletteIdx:0, speed:0.04, orbit:0.0,  tintOpacity:0.15 },
      { name:"venus",   tex:"venus",   pos:[-3.6, 1.8,-3],  radius:0.75, segs:18, paletteIdx:2, speed:0.15, orbit:0.25, tintOpacity:0.25 },
      { name:"earth",   tex:"earth",   pos:[5.2, 0.6,-5],   radius:0.95, segs:20, paletteIdx:3, speed:0.18, orbit:0.3,  tintOpacity:0.80 },
      { name:"mars",    tex:"mars",    pos:[3,-1.6,-2.5],   radius:0.6,  segs:16, paletteIdx:2, speed:0.2,  orbit:0.28, tintOpacity:0.25 },
      { name:"jupiter", tex:"jupiter", pos:[-5.5, 2.2,-9],  radius:1.8,  segs:24, paletteIdx:1, speed:0.09, orbit:0.18, tintOpacity:0.18 },
      { name:"saturn",  tex:"saturn",  pos:[6.4,-2.2,-8],   radius:1.3,  segs:22, paletteIdx:0, speed:0.11, orbit:0.22, tintOpacity:0.20, ring:true },
    ];

    const textureCache = {};
    const getTexture = (n) => (textureCache[n] ||= TEXTURES[n]());

    const planets = planetsData.map((p) => {
      const group = new THREE.Group();
      group.position.set(...p.pos);

      const bodyGeo = new THREE.SphereGeometry(p.radius, p.segs, Math.max(8, p.segs/2));
      const bodyMat = new THREE.MeshBasicMaterial({ map: getTexture(p.tex) });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      group.add(body);

      const tintGeo = new THREE.SphereGeometry(p.radius * 1.004, p.segs, Math.max(8, p.segs/2));
      const tintMat = new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: p.tintOpacity ?? 0.22,
        depthWrite: false,
      });
      const tint = new THREE.Mesh(tintGeo, tintMat);
      group.add(tint);

      const wireGeo = new THREE.SphereGeometry(p.radius * 1.012, p.segs, Math.max(8, p.segs/2));
      const wireMat = new THREE.MeshBasicMaterial({
        color: "#ffffff", wireframe: true, transparent: true, opacity: 0.55,
      });
      const wire = new THREE.Mesh(wireGeo, wireMat);
      group.add(wire);

      let halo = null;
      if (p.name !== "sun") {
        const haloGeo = new THREE.SphereGeometry(p.radius * 1.08, 16, 10);
        const haloMat = new THREE.MeshBasicMaterial({
          color: "#ffffff", transparent: true, opacity: 0.1, side: THREE.BackSide,
        });
        halo = new THREE.Mesh(haloGeo, haloMat);
        group.add(halo);
      }

      group.userData = {
        basePos: p.pos.slice(),
        speed: p.speed, orbit: p.orbit, paletteIdx: p.paletteIdx,
        phase: Math.random() * Math.PI * 2,
        body, tint, wire, halo,
      };

      if (p.ring) {
        const ringGeo = new THREE.TorusGeometry(p.radius*1.75, 0.09, 2, 64);
        const ringMat = new THREE.MeshBasicMaterial({ color:"#d9c69a", side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI/2.3; ring.rotation.z = 0.25;
        group.add(ring);

        const rwGeo = new THREE.TorusGeometry(p.radius*1.76, 0.1, 2, 64);
        const rwMat = new THREE.MeshBasicMaterial({ color:"#ffffff", wireframe:true, transparent:true, opacity:0.5 });
        const ringWire = new THREE.Mesh(rwGeo, rwMat);
        ringWire.rotation.x = Math.PI/2.3; ringWire.rotation.z = 0.25;
        group.add(ringWire);
        group.userData.ringWire = ringWire;
      }

      root.add(group);
      return group;
    });

    const applyTheme = (t) => {
      const p = PALETTE[t] || PALETTE.dark;
      scene.background = new THREE.Color(p.bg);
      scene.fog = new THREE.Fog(p.bg, 8, 32);
      [grid1, grid2].forEach((g) => {
        g.material.forEach?.((m, i) => m.color.set(i === 0 ? p.gridAccent : p.grid));
        if (!Array.isArray(g.material)) g.material.color.set(p.grid);
      });
      starsMat.color.setHex(p.star);
      starsMat.opacity = p.starOp;
      planets.forEach((g) => {
        const color = p.wire[g.userData.paletteIdx];
        if (g.userData.tint) g.userData.tint.material.color.set(color);
        if (g.userData.wire) g.userData.wire.material.color.set(color);
        if (g.userData.halo) g.userData.halo.material.color.set(color);
        if (g.userData.ringWire) g.userData.ringWire.material.color.set(color);
      });
    };

    apiRef.current = { applyTheme };
    applyTheme(theme);

    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth)*2 - 1;
      mouse.y = -((e.clientY / window.innerHeight)*2 - 1);
    };
    window.addEventListener("mousemove", onMove);

    const onResize = () => {
      width = window.innerWidth; height = window.innerHeight;
      camera.aspect = width/height; camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf;
    const animate = () => {
      const t = clock.getElapsedTime();
      gridGroup.position.z = (t * 1.6) % 4;
      stars.rotation.y = t * 0.006;
      planets.forEach((g) => {
        const u = g.userData;
        g.rotation.y = t * u.speed;
        g.rotation.x = t * u.speed * 0.3;
        const o = u.orbit;
        g.position.x = u.basePos[0] + Math.cos(t*0.25 + u.phase) * o;
        g.position.y = u.basePos[1] + Math.sin(t*0.35 + u.phase) * o * 0.7;
      });
      // Существенно смягчили реакцию сцены на курсор —
      // больше нет ощущения, что геометрия "следует" за мышкой.
      root.rotation.y += (mouse.x*0.12 - root.rotation.y) * 0.02;
      root.rotation.x += (mouse.y*0.06 - root.rotation.x) * 0.02;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      planets.forEach((g) => {
        g.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
            else obj.material.dispose();
          }
        });
      });
      Object.values(textureCache).forEach((t) => t.dispose());
      grid1.geometry.dispose(); grid2.geometry.dispose();
      starsGeom.dispose(); starsMat.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (apiRef.current) apiRef.current.applyTheme(theme);
  }, [theme]);

  return (
    <div
      ref={mountRef}
      data-testid="webgl-bg"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}