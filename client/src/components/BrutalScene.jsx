import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const PALETTE = {
  dark:  { bg: "#0a0a0a", grid: "#222222", gridAccent: "#e5ff00", star: 0xffffff, starOp: 0.6,  shape: ["#e5ff00", "#ffffff", "#ff5b00"] },
  light: { bg: "#f1ecd9", grid: "#c7bfa3", gridAccent: "#0a0a0a", star: 0x1a1a1a, starOp: 0.35, shape: ["#ff2d55", "#0a0a0a", "#ff5b00"] },
};

export default function BrutalScene({ theme = "dark" }) {
  const mountRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = window.innerWidth, height = window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(width, height);

    renderer.domElement.style.opacity = "0.55";
    renderer.domElement.style.filter = "saturate(0.7)";

    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    // GRID
    const gridGroup = new THREE.Group();
    gridGroup.position.set(0, -3, 0);

    const grid1 = new THREE.GridHelper(120, 60, "#e5ff00", "#222222");
    const grid2 = new THREE.GridHelper(120, 60, "#e5ff00", "#222222");
    grid2.position.z = -120;

    gridGroup.add(grid1);
    gridGroup.add(grid2);
    root.add(gridGroup);

    // STARS
    const count = 600;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i*3]   = (Math.random()-0.5)*80;
      positions[i*3+1] = (Math.random()-0.5)*50;
      positions[i*3+2] = (Math.random()-0.5)*80;
    }
    const starsGeom = new THREE.BufferGeometry();
    starsGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starsMat = new THREE.PointsMaterial({
      size: 0.05, color: 0xffffff, transparent: true, opacity: 0.6
    });
    const stars = new THREE.Points(starsGeom, starsMat);
    root.add(stars);

    // PLANETS (wireframe spheres, Solar System style)
    // paletteIdx: 0 — acid yellow / pink-red (главный акцент)
    //             1 — white / black (нейтральный)
    //             2 — orange (тёплый)
    const planetsData = [
      // Sun — большой тусклый центральный далёкий объект
      { name: "sun",     pos: [0, 2.8, -14], radius: 2.4, segs: 24, paletteIdx: 0, speed: 0.04, orbit: 0.0 },
      // Mercury — маленькая
      { name: "mercury", pos: [-7, -1.2, -4], radius: 0.45, segs: 14, paletteIdx: 1, speed: 0.22, orbit: 0.35 },
      // Venus
      { name: "venus",   pos: [-3.6, 1.8, -3], radius: 0.75, segs: 18, paletteIdx: 2, speed: 0.15, orbit: 0.25 },
      // Earth — наш родной акцент
      { name: "earth",   pos: [5.2, 0.6, -5], radius: 0.95, segs: 20, paletteIdx: 0, speed: 0.18, orbit: 0.3 },
      // Mars
      { name: "mars",    pos: [3, -1.6, -2.5], radius: 0.6, segs: 16, paletteIdx: 2, speed: 0.2, orbit: 0.28 },
      // Jupiter — крупный газовый гигант
      { name: "jupiter", pos: [-5.5, 2.2, -9], radius: 1.8, segs: 24, paletteIdx: 1, speed: 0.09, orbit: 0.18 },
      // Saturn — с кольцом
      { name: "saturn",  pos: [6.4, -2.2, -8], radius: 1.3, segs: 22, paletteIdx: 2, speed: 0.11, orbit: 0.22, ring: true },
    ];

    const planets = planetsData.map((p) => {
      const geo = new THREE.SphereGeometry(p.radius, p.segs, Math.max(8, p.segs / 2));
      const mat = new THREE.MeshBasicMaterial({ color: "#ffffff", wireframe: true });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...p.pos);
      mesh.userData = {
        basePos: p.pos.slice(),
        speed: p.speed,
        orbit: p.orbit,
        paletteIdx: p.paletteIdx,
        phase: Math.random() * Math.PI * 2,
      };
      root.add(mesh);

      // Кольцо у Сатурна — тоже wireframe, в цвет планеты
      if (p.ring) {
        const ringGeo = new THREE.TorusGeometry(p.radius * 1.8, 0.06, 2, 64);
        const ringMat = new THREE.MeshBasicMaterial({ color: "#ffffff", wireframe: true });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.3;
        ring.rotation.z = 0.25;
        mesh.add(ring);
        mesh.userData.ring = ring;
      }

      return mesh;
    });

    // THEME
    const applyTheme = (t) => {
      const p = PALETTE[t] || PALETTE.dark;

      scene.background = new THREE.Color(p.bg);
      scene.fog = new THREE.Fog(p.bg, 8, 32);

      [grid1, grid2].forEach((g) => {
        g.material.forEach?.((m, i) =>
          m.color.set(i === 0 ? p.gridAccent : p.grid)
        );
        if (!Array.isArray(g.material)) g.material.color.set(p.grid);
      });

      starsMat.color.setHex(p.star);
      starsMat.opacity = p.starOp;

      planets.forEach((m) => {
        const color = p.shape[m.userData.paletteIdx];
        m.material.color.set(color);
        if (m.userData.ring) m.userData.ring.material.color.set(color);
      });
    };

    apiRef.current = { applyTheme };
    applyTheme(theme);

    // INTERACTION
    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    // ANIMATION
    const clock = new THREE.Clock();
    let raf;

    const animate = () => {
      const t = clock.getElapsedTime();

      gridGroup.position.z = (t * 1.6) % 4;
      stars.rotation.y = t * 0.006;

      planets.forEach((m) => {
        m.rotation.y = t * m.userData.speed;
        m.rotation.x = t * m.userData.speed * 0.3;

        // Лёгкое орбитальное плавание вокруг базовой позиции
        const o = m.userData.orbit;
        m.position.x = m.userData.basePos[0] + Math.cos(t * 0.25 + m.userData.phase) * o;
        m.position.y = m.userData.basePos[1] + Math.sin(t * 0.35 + m.userData.phase) * o * 0.7;
      });

      root.rotation.y += (mouse.x * 0.4 - root.rotation.y) * 0.04;
      root.rotation.x += (mouse.y * 0.2 - root.rotation.x) * 0.04;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }

      planets.forEach((m) => {
        if (m.userData.ring) {
          m.userData.ring.geometry.dispose();
          m.userData.ring.material.dispose();
        }
        m.geometry.dispose();
        m.material.dispose();
      });

      grid1.geometry.dispose();
      grid2.geometry.dispose();

      starsGeom.dispose();
      starsMat.dispose();

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