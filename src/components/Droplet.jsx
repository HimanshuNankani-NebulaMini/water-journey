import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';

export function Droplet(props) {
  const meshRef = useRef();
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;
    // Add subtle ambient floating/breathing animation
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(timeRef.current * 2) * 0.002;
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group {...props}>
      <mesh ref={meshRef}>
        {/* Halved polygon count for huge mobile performance gain */}
        <sphereGeometry args={[1, 32, 32]} />
        <MeshTransmissionMaterial 
          samples={2} // Reduced from 4
          thickness={0.5}
          roughness={0}
          clearcoat={0.5} // Lowered slightly
          clearcoatRoughness={0}
          transmission={1}
          ior={1.33}
          chromaticAberration={0.05}
          anisotropy={0.1}
          distortion={0.3}
          distortionScale={0.2}
          temporalDistortion={0.1}
          color="#cceeff"
        />
      </mesh>
    </group>
  );
}
