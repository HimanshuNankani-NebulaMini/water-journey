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
        <sphereGeometry args={[1, 64, 64]} />
        {/* We use MeshTransmissionMaterial from Drei for advanced glass/water refraction */}
        <MeshTransmissionMaterial 
          backside
          samples={4}
          thickness={0.5}
          roughness={0}
          clearcoat={1}
          clearcoatRoughness={0}
          transmission={1}
          ior={1.33} // Index of Refraction for water
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
