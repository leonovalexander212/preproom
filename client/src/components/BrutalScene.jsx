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

    const camera = new THREE.PerspectiveCamera(60, width/height, 0.1, 200);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(width, height);

    // 🔥 затемнение + "дым"
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
      size: 0.05,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6
    });

    const stars = new THREE.Points(starsGeom, starsMat);
    root.add(stars);

    // SHAPES (замедленные скорости)
    const shapesData = [
      { pos: [-6, 1.5, -3],  geo: new THREE.IcosahedronGeometry(1.4, 0),         paletteIdx: 0, speed: 0.09 },
      { pos: [6, 0.5, -4],   geo: new THREE.TorusKnotGeometry(1, 0.32, 100, 16), paletteIdx: 1, speed: 0.14 },
      { pos: [0, 2.5, -8],   geo: new THREE.OctahedronGeometry(1.6, 0),          paletteIdx: 2, speed: 0.11 },
      { pos: [-3, -1, -6],   geo: new THREE.BoxGeometry(1.2, 1.2, 1.2),          paletteIdx: 0, speed: 0.16 },
      { pos: [4, -1.5, -2],  geo: new THREE.TetrahedronGeometry(1, 0),           paletteIdx: 1, speed: 0.15 },
    ];

    const shapes = shapesData.map((s) => {
      const mesh = new THREE.Mesh(
        s.geo,
        new THREE.MeshBasicMaterial({ color: "#ffffff", wireframe: true })
      );

      mesh.position.set(...s.pos);

      mesh.userData = {
        basePos: s.pos.slice(),
        speed: s.speed,
        paletteIdx: s.paletteIdx
      };

      root.add(mesh);
      return mesh;
    });

    // THEME
    const applyTheme = (t) => {
      const p = PALETTE[t] || PALETTE.dark;

      scene.background = new THREE.Color(p.bg);
      scene.fog = new THREE.Fog(p.bg, 8, 28);

      [grid1, grid2].forEach((g) => {
        g.material.forEach?.((m, i) =>
          m.color.set(i === 0 ? p.gridAccent : p.grid)
        );
        if (!Array.isArray(g.material)) {
          g.material.color.set(p.grid);
        }
      });

      starsMat.color.setHex(p.star);
      starsMat.opacity = p.starOp;

      shapes.forEach((m) =>
        m.material.color.set(p.shape[m.userData.paletteIdx])
      );
    };

    apiRef.current = { applyTheme };
    applyTheme(theme);

    // INTERACTION
    const mouse = { x: 0, y: 0 };

    const onMove = (e) => {
      mouse.x = (e.clientX/window.innerWidth)*2 - 1;
      mouse.y = -((e.clientY/window.innerHeight)*2 - 1);
    };

    window.addEventListener("mousemove", onMove);

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      camera.aspect = width/height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener("resize", onResize);

    // ANIMATION (замедленная)
    const clock = new THREE.Clock();
    let raf;

    const animate = () => {
      const t = clock.getElapsedTime();

      gridGroup.position.z = (t * 1.6) % 4;

      stars.rotation.y = t * 0.006;

      shapes.forEach((m) => {
        m.rotation.x = t * m.userData.speed * 0.6;
        m.rotation.y = t * m.userData.speed;

        m.position.y =
          m.userData.basePos[1] +
          Math.sin(t * 0.25 + m.userData.basePos[0]) * 0.25;
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

      shapes.forEach((m) => {
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
    if (apiRef.current) {
      apiRef.current.applyTheme(theme);
    }
  }, [theme]);

  return (
    <div
      ref={mountRef}
      data-testid="webgl-bg"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none"
      }}
    />
  );
}