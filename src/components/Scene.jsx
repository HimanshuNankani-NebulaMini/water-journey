import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Droplet } from './Droplet';
import { CloudScene } from './CloudScene';
import { LeafScene } from './LeafScene';
import { RiverScene } from './RiverScene';
import { DeepOceanScene } from './DeepOceanScene';

export function Scene({ scrollProgress }) {
  const dropletGroupRef = useRef();
  
  // Get viewport to adjust for mobile screens
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;

  // Scene references for fading/moving
  const cloudRef = useRef();
  const leafRef = useRef();
  const riverRef = useRef();
  const oceanRef = useRef();

  useFrame((state) => {
    // scrollProgress goes from 0 to 1 over the whole page
    // There are 4 sections.
    // 0.00 - 0.25 : Clouds
    // 0.25 - 0.50 : Leaf
    // 0.50 - 0.75 : River
    // 0.75 - 1.00 : Ocean
    
    const progress = scrollProgress.current || 0;

    // --- Camera Movement ---
    // Smoothly drop the camera down over time
    const targetCamY = THREE.MathUtils.lerp(0, -30, progress);
    
    // Move the global camera directly
    if (!isNaN(targetCamY)) {
      state.camera.position.y = THREE.MathUtils.lerp(
        state.camera.position.y,
        targetCamY,
        0.1 // damping
      );
    }

    // --- Droplet Morphing / Effects ---
    if (dropletGroupRef.current) {
      // The droplet falls faster than the camera to appear transitioning scenes
      // In the river phase, it elongates. In the ocean phase, it flattens or shrinks.

      // Scale transition
      let targetScaleX = 1;
      let targetScaleY = 1;
      let targetScaleZ = 1;

      if (progress > 0.3 && progress < 0.6) {
        // Flatten on the leaf
        targetScaleY = 0.5;
        targetScaleX = 1.3;
        targetScaleZ = 1.3;
      } else if (progress >= 0.6 && progress < 0.8) {
        // Elongate in the river
        targetScaleY = 1.8;
        targetScaleX = 0.6;
        targetScaleZ = 0.6;
      } else if (progress >= 0.8) {
        // Shrink slightly in ocean
        targetScaleY = 0.8;
        targetScaleX = 0.8;
        targetScaleZ = 0.8;
      }

      dropletGroupRef.current.scale.x = THREE.MathUtils.lerp(dropletGroupRef.current.scale.x, targetScaleX, 0.1);
      dropletGroupRef.current.scale.y = THREE.MathUtils.lerp(dropletGroupRef.current.scale.y, targetScaleY, 0.1);
      dropletGroupRef.current.scale.z = THREE.MathUtils.lerp(dropletGroupRef.current.scale.z, targetScaleZ, 0.1);
      
      // Also sync droplet Y to targetCamY so it falls with the camera
      dropletGroupRef.current.position.y = THREE.MathUtils.lerp(
        dropletGroupRef.current.position.y,
        targetCamY,
        0.1
      );
    }
    
    // --- Environment Opacity/Visibility ---
    // Cloud: 0 to -10 y. Fades out at progress 0.3
    if (cloudRef.current) {
       cloudRef.current.visible = progress < 0.4;
    }
    // Leaf: -10 y
    if (leafRef.current) {
       leafRef.current.visible = progress > 0.15 && progress < 0.6;
    }
    // River: -20 y
    if (riverRef.current) {
       riverRef.current.visible = progress > 0.4 && progress < 0.85;
    }
    // Ocean: -30 y
    if (oceanRef.current) {
       oceanRef.current.visible = progress > 0.6;
    }
  });

  return (
    <>
      {/* The main subject tracking with the camera loosely */}
      {/* Move the Droplet to the right (+2) on desktop, but bring it closer on mobile (+1) so it fits */}
      <group ref={dropletGroupRef} position={[isMobile ? 1 : 2, 0, 0]}>
         <Droplet />
      </group>

      {/* 
        Stack the environments vertically. 
        The camera falls, but the droplet appears to fall faster/stay relatively center. 
        Actually, we put the droplet inside cameraGroup so it stays center screen, 
        or we move the environments up. Let's move the environments down and 
        move the camera/droplet down.
      */}
      <group>
        <group ref={cloudRef} position={[0, 0, -2]}>
          <CloudScene />
        </group>

        <group ref={leafRef} position={[0, -10, 0]}>
          {/* Leaf positioned below */}
          <LeafScene />
        </group>

        <group ref={riverRef} position={[0, -20, -5]}>
          <RiverScene />
        </group>

        <group ref={oceanRef} position={[0, -30, -5]}>
          <DeepOceanScene />
        </group>
      </group>
    </>
  );
}
