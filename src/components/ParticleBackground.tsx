'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 500 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.002 + Math.random() * 0.005;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -30 + Math.random() * 60;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    particles.forEach((particle, i) => {
      const { factor, speed, xFactor, yFactor, zFactor } = particle;
      particle.t += speed;
      const a = Math.cos(particle.t) + Math.sin(particle.t * 0.5);
      const b = Math.sin(particle.t) + Math.cos(particle.t * 0.3);
      const s = Math.max(0.3, Math.cos(particle.t) * 0.5 + 0.5);

      dummy.position.set(
        xFactor + Math.cos((particle.t / 10) * factor) + a * 2,
        yFactor + Math.sin((particle.t / 10) * factor) + b * 2,
        zFactor + Math.cos((particle.t / 10) * factor) + b
      );
      dummy.scale.setScalar(s * 0.6);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.15, 8, 8]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.4} />
    </instancedMesh>
  );
}

function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
  });

  const shapes = useMemo(() => {
    const items = [];
    for (let i = 0; i < 15; i++) {
      const pos: [number, number, number] = [
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 40 - 10,
      ];
      const scale = 0.5 + Math.random() * 2;
      const type = Math.floor(Math.random() * 3);
      const color = ['#22d3ee', '#a855f7', '#4ade80'][Math.floor(Math.random() * 3)];
      items.push({ pos, scale, type, color, speed: 0.3 + Math.random() * 0.5, id: i });
    }
    return items;
  }, []);

  return (
    <group ref={groupRef}>
      {shapes.map((shape) => (
        <FloatingShape key={shape.id} {...shape} />
      ))}
    </group>
  );
}

function FloatingShape({
  pos,
  scale,
  type,
  color,
  speed,
}: {
  pos: [number, number, number];
  scale: number;
  type: number;
  color: string;
  speed: number;
  id: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = clock.getElapsedTime() * speed * 0.3;
    meshRef.current.rotation.z = clock.getElapsedTime() * speed * 0.2;
    meshRef.current.position.y = pos[1] + Math.sin(clock.getElapsedTime() * speed) * 2;
  });

  return (
    <mesh ref={meshRef} position={pos} scale={scale}>
      {type === 0 && <octahedronGeometry args={[1, 0]} />}
      {type === 1 && <icosahedronGeometry args={[1, 0]} />}
      {type === 2 && <torusGeometry args={[1, 0.3, 8, 16]} />}
      <meshBasicMaterial color={color} transparent opacity={0.15} wireframe />
    </mesh>
  );
}

export function ParticleBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Particles count={400} />
        <FloatingShapes />
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
}
