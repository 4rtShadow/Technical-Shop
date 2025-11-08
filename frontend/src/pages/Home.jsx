import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Scene3D from '../components/Scene3D'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Scene3D />
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-20"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            TechStore
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Интернет магазин техники нового поколения
          </p>
          <Link
            to="/products"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-xl font-semibold hover:scale-105 transition-transform shadow-2xl"
          >
            Перейти в каталог
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-blue-500/30">
            <h3 className="text-2xl font-bold mb-4 text-blue-400">Ноутбуки</h3>
            <p className="text-gray-300">Современные ноутбуки для работы и игр</p>
          </div>
          <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-purple-500/30">
            <h3 className="text-2xl font-bold mb-4 text-purple-400">Смартфоны</h3>
            <p className="text-gray-300">Последние модели смартфонов</p>
          </div>
          <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-pink-500/30">
            <h3 className="text-2xl font-bold mb-4 text-pink-400">Аксессуары</h3>
            <p className="text-gray-300">Все необходимое для ваших устройств</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

