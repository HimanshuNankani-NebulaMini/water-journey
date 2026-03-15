import React, { useRef, useLayoutEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Scene } from './components/Scene';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const scrollContainerRef = useRef(null);
  
  // A mutable ref holding the current scroll progress (0 to 1)
  const scrollProgressRef = useRef(0);

  useLayoutEffect(() => {
    // 1. Text fade-in animations per section
    const sections = gsap.utils.toArray('.section');
    sections.forEach((section) => {
      const texts = section.querySelectorAll('h1, h2, p');
      gsap.fromTo(texts, 
        { opacity: 0, y: 50 },
        {
          opacity: 1, 
          y: 0,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            end: 'bottom 40%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    // 2. Global scroll progress tracker
    // We attach a ScrollTrigger to the entire container to get 0 -> 1 progress
    ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        // Update the ref without triggering a React re-render.
        // The R3F useFrame loop will read this ref directly 60 times a second.
        scrollProgressRef.current = self.progress;
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      <div className="canvas-container">
        {/* dpr={[1, 1.5]} limits the maximum pixel ratio to 1.5 instead of 2 or 3 (like on modern iPhones), 
            saving massive amounts of mobile GPU compute. performance={min: 0.5} allows R3F to drop quality further if lagging. */}
        <Canvas 
            gl={{ antialias: false, powerPreference: "high-performance" }} 
            dpr={[1, 1.5]}
            performance={{ min: 0.5 }}
        >
          <color attach="background" args={['#050510']} />
          <Suspense fallback={null}>
            <Scene scrollProgress={scrollProgressRef} />
            
            {/* Using a generated HDRI environment gives the glass droplet something to reflect
                without relying on the broken external CDN links. */}
            <Environment preset="warehouse" background={false} />
          </Suspense>
        </Canvas>
      </div>

      <div className="scroll-container" ref={scrollContainerRef}>
        <section className="section" id="scene-start">
          <h1>It begins <br />with a single drop.</h1>
          <p>Condensing high in the atmosphere, gravity takes hold.</p>
        </section>

        <section className="section" id="scene-leaf">
          <h2>Nourishing the earth, <br/>one surface at a time.</h2>
          <p>Impact. The droplet shifts, conforming to the natural world before continuing its descent.</p>
        </section>

        <section className="section" id="scene-river">
          <h2>Joining the current.</h2>
          <p>Gathering momentum as it merges with thousands of others, racing toward the end of the line.</p>
        </section>

        <section className="section" id="scene-ocean">
          <h2>Returning to the source.</h2>
          <p>The dark abyss. Still, silent, and vast. The cycle prepares to begin anew.</p>
        </section>
      </div>
    </>
  );
}

export default App;
