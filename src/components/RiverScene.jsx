import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function RiverScene(props) {
  const count = 150; // Dropped drastically for stable mobile FPS
  
  // Use lazy useState to ensure random initialization only happens once, fixing useMemo purity warnings
  const [particles] = useState(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 10 + 2, // Shifted to right (+2)
        y: (Math.random() - 0.5) * 20, // Spread far along the "flow" axis
        z: (Math.random() - 0.5) * 4 - 2,
        speed: Math.random() * 0.2 + 0.1
      });
    }
    return temp;
  });

  const streamRef = useRef();

  useFrame(() => {
    if (streamRef.current) {
      // Move all particles 'up' local Y to simulate rushing water (camera falling)
      const positions = streamRef.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        // y is i*3+1
        positions[i * 3 + 1] += particles[i].speed;
        
        // Loop back to bottom
        if (positions[i * 3 + 1] > 10) {
          positions[i * 3 + 1] = -10;
        }
      }
      streamRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i*3] = particles[i].x;
      positions[i*3+1] = particles[i].y;
      positions[i*3+2] = particles[i].z;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count, particles]);

  return (
    <group {...props}>
      <ambientLight intensity={0.5} color="#0055ff" />
      <directionalLight position={[0, 5, 0]} intensity={1.5} color="#66bbff" />
      
      <points ref={streamRef}>
        <bufferGeometry attach="geometry" {...geometry} />
        {/* We use points with large size to simulate rushing droplets/bubbles */}
        <pointsMaterial 
          size={0.1} 
          color="#99ddff" 
          transparent 
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Rushing lines to act as "speed lines" for the current */}
      <points>
        <bufferGeometry attach="geometry" {...geometry} />
        <pointsMaterial 
          size={0.5} 
          color="#44aaff" 
          transparent 
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
