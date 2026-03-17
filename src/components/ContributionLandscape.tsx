'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GitHubEvent } from '@/lib/types';

function ContributionBar({
  position,
  height,
  color,
}: {
  position: [number, number, number];
  height: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} position={[position[0], height / 2, position[2]]}>
      <boxGeometry args={[0.8, height, 0.8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        roughness={0.4}
        metalness={0.6}
      />
    </mesh>
  );
}

function ContributionScene({ events }: { events: GitHubEvent[] }) {
  const bars = useMemo(() => {
    // Group events by date (last 52 weeks × 7 days = 364 days grid)
    const dayCounts: Record<string, number> = {};
    events.forEach(e => {
      const day = new Date(e.created_at).toISOString().split('T')[0];
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });

    // Generate a 7×52 grid
    const result = [];
    const today = new Date();
    for (let week = 0; week < 26; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (week * 7 + day));
        const key = date.toISOString().split('T')[0];
        const count = dayCounts[key] || 0;

        if (count > 0) {
          const height = Math.min(count * 0.8, 6);
          const t = count / 10; // normalize
          const color = new THREE.Color().lerpColors(
            new THREE.Color('#1e3a5f'),
            new THREE.Color('#22d3ee'),
            Math.min(t, 1)
          );

          result.push({
            position: [(week - 13) * 1, 0, (day - 3) * 1] as [number, number, number],
            height: Math.max(0.2, height),
            color: `#${color.getHexString()}`,
          });
        } else {
          result.push({
            position: [(week - 13) * 1, 0, (day - 3) * 1] as [number, number, number],
            height: 0.1,
            color: '#0f1729',
          });
        }
      }
    }
    return result;
  }, [events]);

  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = -0.4 + Math.sin(clock.getElapsedTime() * 0.1) * 0.02;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#22d3ee" />

      <group ref={groupRef} rotation={[-0.4, 0.2, 0]}>
        {/* Base grid */}
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 10]} />
          <meshStandardMaterial color="#070d1a" transparent opacity={0.5} />
        </mesh>

        {bars.map((bar, i) => (
          <ContributionBar key={i} {...bar} />
        ))}
      </group>

      <OrbitControls
        enablePan={false}
        minDistance={10}
        maxDistance={35}
        minPolarAngle={0.3}
        maxPolarAngle={1.3}
      />
    </>
  );
}

export function ContributionLandscape({ events }: { events: GitHubEvent[] }) {
  return (
    <div className="glass rounded-xl overflow-hidden" style={{ height: '400px' }}>
      <div className="p-4 border-b border-[var(--glass-border)]">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">Contribution Landscape</h3>
        <p className="text-xs text-gray-500">3D terrain of recent activity. Taller bars = more events that day.</p>
      </div>
      <Canvas camera={{ position: [0, 15, 18], fov: 50 }} dpr={[1, 1.5]}>
        <ContributionScene events={events} />
      </Canvas>
    </div>
  );
}
