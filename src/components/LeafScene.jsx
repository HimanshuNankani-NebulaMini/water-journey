import React, { useMemo } from 'react';
import * as THREE from 'three';

export function LeafScene(props) {
  // We'll create a deformed plane to act as a massive stylized leaf
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(10, 15, 16, 16);
    geo.rotateX(-Math.PI * 0.4); // Lay it somewhat flat
    
    // Deform the vertices to make a curved leaf shape
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      
      // curve the edges downwards (x-axis)
      const curveX = -Math.abs(x) * 0.5;
      // curve the tip down (y-axis)
      const curveY = y * 0.2;
      
      pos.setZ(i, z + curveX + curveY);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group {...props}>
      <ambientLight intensity={0.4} color="#aaddaa" />
      {/* Shadows disabled for mobile performance gain */}
      <directionalLight position={[0, 10, -5]} intensity={2} color="#ccffcc" />
      
      <mesh geometry={geometry} position={[2, 0, 0]} rotation={[0, 0, -0.2]}>
        <meshStandardMaterial 
          color="#16a34a" 
          roughness={0.6}
          side={THREE.DoubleSide} 
        />
        
        {/* The central vein of the leaf */}
        <mesh position={[0, 0, -0.1]}>
          <cylinderGeometry args={[0.1, 0.2, 15, 4]} />
          <meshStandardMaterial color="#14532d" fallback={null} />
        </mesh>
      </mesh>
    </group>
  );
}
