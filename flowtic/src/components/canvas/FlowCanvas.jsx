import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, OrbitControls, MeshWobbleMaterial } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

function AnimatedSphere() {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.cos(t / 4) / 8;
    meshRef.current.rotation.y = Math.sin(t / 4) / 8;
    meshRef.current.rotation.z = Math.sin(t / 4) / 8;
    meshRef.current.position.y = Math.sin(t / 1.5) / 10;
  });

  return (
    <Float speed={1.4} rotationIntensity={1.5} floatIntensity={2.3}>
      <Sphere ref={meshRef} args={[1, 100, 100]} scale={2.4}>
        <MeshDistortMaterial
          color="#3b82f6"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function FloatingShapes() {
  return (
    <>
      <Float speed={2} rotationIntensity={2} floatIntensity={2}>
        <mesh position={[4, 2, -2]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <MeshWobbleMaterial color="#60a5fa" factor={0.6} speed={2} />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[-4, -2, -1]}>
          <octahedronGeometry args={[0.6]} />
          <MeshDistortMaterial color="#2563eb" distort={0.3} speed={3} />
        </mesh>
      </Float>
    </>
  );
}

export default function FlowCanvas() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} color="#3b82f6" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#60a5fa" />
          
          <AnimatedSphere />
          <FloatingShapes />
          
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
        </Suspense>
      </Canvas>
    </div>
  );
}
