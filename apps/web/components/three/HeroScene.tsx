'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colorArr = new Float32Array(count * 3);
    const emerald = new THREE.Color('#2ECC8F');
    const burgundy = new THREE.Color('#C0392B');
    const champagne = new THREE.Color('#E8D5A3');

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * 40;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const rnd = Math.random();
      let c: THREE.Color;
      if (rnd < 0.6) {
        c = emerald.clone().multiplyScalar(0.4);
      } else if (rnd < 0.9) {
        c = burgundy.clone().multiplyScalar(0.3);
      } else {
        c = champagne;
      }
      colorArr[i * 3] = c.r;
      colorArr[i * 3 + 1] = c.g;
      colorArr[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colorArr, 3));
    return geo;
  }, []);

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          uniform float time;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec3 pos = position;
            pos.x += sin(time * 0.3 + position.y * 0.1) * 0.5;
            pos.y += cos(time * 0.2 + position.z * 0.1) * 0.5;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 2.5 * (60.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        vertexColors: true,
      }),
    []
  );

  useFrame(() => {
    if (materialRef.current?.uniforms?.time) {
      materialRef.current.uniforms.time.value += 0.005;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0006;
    }
  });

  return <points ref={meshRef} geometry={geometry} material={shaderMaterial} />;
}

function MorphingBlobs() {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const origPositions = useRef<THREE.BufferAttribute[]>([]);

  const blobData = useMemo(
    () => [
      { position: [-7, 2, -12] as [number, number, number], color: '#1A5C46' },
      { position: [6, -1, -14] as [number, number, number], color: '#6B1A2A' },
      { position: [-2, -3, -11] as [number, number, number], color: '#2D3B2E' },
    ],
    []
  );

  const geometries = useMemo(() => {
    const geos = blobData.map(() => new THREE.IcosahedronGeometry(3, 4));
    origPositions.current = geos.map(
      (g) => (g.attributes.position as THREE.BufferAttribute)?.clone()
    );
    return geos;
  }, [blobData]);

  const materials = useMemo(
    () =>
      blobData.map(
        (d) =>
          new THREE.MeshStandardMaterial({
            color: d.color,
            roughness: 0.1,
            metalness: 0.3,
            transparent: true,
            opacity: 0.85,
          })
      ),
    [blobData]
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    geometries.forEach((geo, i) => {
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const orig = origPositions.current[i];
      if (!orig) return;
      for (let j = 0; j < posAttr.count; j++) {
        const ox = orig.getX(j);
        const oy = orig.getY(j);
        const oz = orig.getZ(j);
        posAttr.setX(j, ox + Math.sin(t + ox) * Math.cos(t + oy) * 0.2);
        posAttr.setY(j, oy + Math.cos(t + oz) * Math.sin(t + ox) * 0.2);
        posAttr.setZ(j, oz + Math.sin(t + oy) * Math.cos(t + oz) * 0.2);
      }
      posAttr.needsUpdate = true;
    });
  });

  return (
    <group>
      {blobData.map((d, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          geometry={geometries[i]}
          material={materials[i]}
          position={d.position}
          scale={0.7}
        />
      ))}
      <pointLight color="#2ECC8F" intensity={1.5} position={[10, 5, 10]} />
      <pointLight color="#C0392B" intensity={1} position={[-10, -3, 10]} />
      <pointLight color="#E8D5A3" intensity={0.8} position={[0, 8, -5]} />
    </group>
  );
}

function Wireframe() {
  const ref = useRef<THREE.LineSegments>(null);

  const { geometry, material } = useMemo(() => {
    const torusKnot = new THREE.TorusKnotGeometry(2.2, 0.55, 100, 12);
    const edges = new THREE.EdgesGeometry(torusKnot);
    const mat = new THREE.LineBasicMaterial({
      color: '#F5F0E8',
      opacity: 0.09,
      transparent: true,
    });
    return { geometry: edges, material: mat };
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0015;
      ref.current.rotation.x += 0.0007;
    }
  });

  return (
    <lineSegments ref={ref} geometry={geometry} material={material} scale={0.6} />
  );
}

function Satellites() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const data = useMemo(
    () => [
      { geo: new THREE.OctahedronGeometry(0.3), speed: 0.15, radius: 8, phase: 0 },
      { geo: new THREE.TetrahedronGeometry(0.35), speed: 0.12, radius: 12, phase: 1.5 },
      { geo: new THREE.DodecahedronGeometry(0.28), speed: 0.18, radius: 10, phase: 3 },
      { geo: new THREE.OctahedronGeometry(0.25), speed: 0.1, radius: 16, phase: 4.5 },
      { geo: new THREE.TetrahedronGeometry(0.3), speed: 0.14, radius: 14, phase: 2 },
      { geo: new THREE.DodecahedronGeometry(0.22), speed: 0.16, radius: 9, phase: 5 },
    ],
    []
  );

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#E8D5A3',
        transparent: true,
        opacity: 0.15,
        roughness: 0.1,
        metalness: 0.3,
      }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    data.forEach((d, i) => {
      const mesh = refs.current[i];
      if (mesh) {
        mesh.position.x = Math.cos(t * d.speed + d.phase) * d.radius;
        mesh.position.z = Math.sin(t * d.speed + d.phase) * d.radius;
        mesh.position.y = Math.sin(t * d.speed * 0.5 + d.phase) * 2;
        mesh.rotation.x += 0.007;
      }
    });
  });

  return (
    <group>
      {data.map((d, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          geometry={d.geo}
          material={material}
        />
      ))}
    </group>
  );
}

function MouseParallax() {
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY.current = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useFrame(({ camera }) => {
    camera.position.x += (mouseX.current * 1.5 - camera.position.x) * 0.025;
    camera.position.y += (-mouseY.current * 1 - camera.position.y) * 0.025;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function HeroScene() {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 28], fov: 60 }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color('#0A0A0B'), 0);
      }}
    >
      <ParticleField />
      <MorphingBlobs />
      <Wireframe />
      <Satellites />
      <MouseParallax />
    </Canvas>
  );
}
