'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { GitHubRepo, getLanguageColor } from '@/lib/types';

interface RepoSphere {
  position: [number, number, number];
  size: number;
  color: string;
  repo: GitHubRepo;
  glowIntensity: number;
}

function RepoNode({ position, size, color, repo, glowIntensity }: RepoSphere) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.position.y =
      position[1] + Math.sin(clock.getElapsedTime() * 0.5 + position[0]) * 0.3;
  });

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.3 : 1}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : glowIntensity}
          transparent
          opacity={0.85}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Glow ring */}
      <mesh position={position} scale={hovered ? 1.6 : 1.2}>
        <ringGeometry args={[size, size + 0.05, 32]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.4 : 0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Tooltip on hover */}
      {hovered && (
        <Html position={[position[0], position[1] + size + 1, position[2]]} center>
          <div className="glass rounded-xl px-4 py-3 text-center min-w-[180px] pointer-events-none neon-glow-cyan">
            <p className="text-sm font-semibold text-white mb-1">{repo.name}</p>
            <div className="flex items-center justify-center gap-3 text-xs text-gray-300">
              <span>⭐ {repo.stargazers_count}</span>
              <span>🔱 {repo.forks_count}</span>
            </div>
            {repo.language && (
              <p className="text-xs mt-1" style={{ color }}>
                {repo.language}
              </p>
            )}
          </div>
        </Html>
      )}
    </Float>
  );
}

function GalaxyScene({ repos }: { repos: GitHubRepo[] }) {
  const spheres: RepoSphere[] = useMemo(() => {
    const sorted = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 50);
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    return sorted.map((repo, i) => {
      const theta = Math.acos(1 - 2 * (i + 0.5) / sorted.length);
      const phi = 2 * Math.PI * i / goldenRatio;
      const r = 8 + Math.random() * 4;

      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);

      const size = Math.max(0.2, Math.log10(repo.stargazers_count + 1) * 0.5);
      const daysSinceUpdate = (Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24);
      const glowIntensity = Math.max(0.1, Math.min(0.6, 1 - daysSinceUpdate / 365));

      return {
        position: [x, y, z] as [number, number, number],
        size,
        color: getLanguageColor(repo.language),
        repo,
        glowIntensity,
      };
    });
  }, [repos]);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#22d3ee" />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#a855f7" />

      {/* Central core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={1}
          transparent
          opacity={0.6}
        />
      </mesh>

      {spheres.map((sphere, i) => (
        <RepoNode key={i} {...sphere} />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={30}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export function RepoGalaxy({ repos }: { repos: GitHubRepo[] }) {
  if (repos.length === 0) return null;

  return (
    <div className="glass rounded-xl overflow-hidden" style={{ height: '500px' }}>
      <div className="p-4 border-b border-[var(--glass-border)]">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">Repository Galaxy</h3>
        <p className="text-xs text-gray-500">Size = stars, Color = language, Glow = recent activity. Drag to rotate.</p>
      </div>
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }} dpr={[1, 1.5]}>
        <GalaxyScene repos={repos} />
      </Canvas>
    </div>
  );
}
