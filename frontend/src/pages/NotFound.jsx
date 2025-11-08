import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import * as THREE from 'three'

function Floating404() {
  const cubes = []
  for (let i = 0; i < 30; i++) {
    const x = (Math.random() - 0.5) * 30
    const y = (Math.random() - 0.5) * 30
    const z = (Math.random() - 0.5) * 30
    cubes.push(
      <mesh key={i} position={[x, y, z]} rotation={[Math.random(), Math.random(), Math.random()]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial
          color={new THREE.Color().setHSL(Math.random(), 0.8, 0.5)}
          emissive={new THREE.Color().setHSL(Math.random(), 0.8, 0.3)}
          emissiveIntensity={0.6}
        />
      </mesh>
    )
  }
  return <group>{cubes}</group>
}

function Scene3D() {
  return (
    <div className="w-full h-screen absolute top-0 left-0 z-0">
      <Canvas camera={{ position: [0, 0, 15] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.6} color="#ff006e" />
          <pointLight position={[0, 10, -10]} intensity={0.6} color="#3a86ff" />
          <Stars radius={150} depth={60} count={8000} factor={5} fade speed={2} />
          <Floating404 />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      <Scene3D />
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <h1 className="text-9xl md:text-[12rem] font-bold mb-4 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            404
          </h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
          >
            Страница не найдена
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-xl font-semibold hover:scale-110 transition-transform shadow-2xl"
            >
              На главную
            </Link>
            <Link
              to="/products"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-xl font-semibold hover:scale-110 transition-transform shadow-2xl"
            >
              В каталог
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

