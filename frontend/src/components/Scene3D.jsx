import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Suspense } from 'react'
import * as THREE from 'three'

function RotatingBox() {
  return (
    <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        color="#3b82f6"
        metalness={0.8}
        roughness={0.2}
        emissive="#1e40af"
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

function FloatingCubes() {
  const cubes = []
  for (let i = 0; i < 20; i++) {
    const x = (Math.random() - 0.5) * 20
    const y = (Math.random() - 0.5) * 20
    const z = (Math.random() - 0.5) * 20
    cubes.push(
      <mesh key={i} position={[x, y, z]} rotation={[Math.random(), Math.random(), Math.random()]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial
          color={new THREE.Color().setHSL(Math.random(), 0.7, 0.5)}
          emissive={new THREE.Color().setHSL(Math.random(), 0.7, 0.2)}
          emissiveIntensity={0.5}
        />
      </mesh>
    )
  }
  return <group>{cubes}</group>
}

export default function Scene3D() {
  return (
    // make scene less tall on small devices to avoid covering content and improve performance
    <div className="w-full h-96 md:h-screen absolute top-0 left-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10] }} style={{ touchAction: 'none' }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
          {/* reduce stars count on small screens via CSS not trivial here; lower default to keep perf okay */}
          <Stars radius={100} depth={50} count={1500} factor={4} fade speed={1} />
          <RotatingBox />
          <FloatingCubes />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

