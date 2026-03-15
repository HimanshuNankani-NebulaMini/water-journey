import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function DeepOceanScene(props) {
  const count = 100; // Lowered for mobile GPU
  
  // Use lazy useState to ensure random initialization only happens once
  const [particles] = useState(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 15 + 2, // Shifted right
        y: (Math.random() - 0.5) * 15,
        z: (Math.random() - 0.5) * 15,
        speed: (Math.random() * 0.01) + 0.005,
        swaySpeed: Math.random() * 0.5 + 0.2,
        swayOffset: Math.random() * Math.PI * 2
      });
    }
    return temp;
  });

  const pointsRef = useRef();
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      timeRef.current += delta;
      const positions = pointsRef.current.geometry.attributes.position.array;
      const time = timeRef.current;

      for (let i = 0; i < count; i++) {
        // Slowly float up
        positions[i * 3 + 1] += particles[i].speed;
        
        // Sway side to side (bioluminescence drifting)
        positions[i * 3] += Math.sin(time * particles[i].swaySpeed + particles[i].swayOffset) * 0.01;

        // Loop back to bottom
        if (positions[i * 3 + 1] > 7.5) {
          positions[i * 3 + 1] = -7.5;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
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
      <ambientLight intensity={0.1} color="#000033" />
      
      {/* Bioluminescent particles */}
      <points ref={pointsRef}>
        <bufferGeometry attach="geometry" {...geometry} />
        <pointsMaterial 
          size={0.08} 
          color="#aaeeff" 
          transparent 
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Some bigger blurred out particles for depth of field illusion */}
      <points>
        <bufferGeometry attach="geometry" {...geometry} />
        <pointsMaterial 
          size={0.25} 
          color="#55ccff" 
          transparent 
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
