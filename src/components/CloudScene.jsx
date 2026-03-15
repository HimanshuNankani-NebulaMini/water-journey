import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instance, Instances } from '@react-three/drei';

// A single stylized fluffy cloud component
function CloudCluster({ position = [0, 0, 0], scale = 1, color = "#ffffff" }) {
  const ref = useRef();
  const timeRef = useRef(0);
  
  useFrame((state, delta) => {
    timeRef.current += delta;
    if (ref.current) {
      ref.current.rotation.y = Math.sin(timeRef.current * 0.1) * 0.1;
      ref.current.position.y += Math.sin(timeRef.current * 0.5 + position[0]) * 0.001;
    }
  });

  return (
    <group position={position} scale={scale} ref={ref}>
      {/* Three overlapping spheres to make a stylized cloud */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <mesh position={[1.2, -0.2, 0.5]} scale={0.7}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <mesh position={[-1.2, -0.1, -0.5]} scale={0.8}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
    </group>
  );
}

export function CloudScene(props) {
  return (
    <group {...props}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#fffcf5" />
      
      {/* Background clouds shifted right to frame the droplet */}
      <CloudCluster position={[1, 2, -5]} scale={1.5} color="#f8fafc" />
      <CloudCluster position={[6, 3, -8]} scale={2} color="#f1f5f9" />
      <CloudCluster position={[0, -2, -10]} scale={2.5} color="#e2e8f0" />
      <CloudCluster position={[5, -1, -4]} scale={1.2} color="#ffffff" />
    </group>
  );
}
