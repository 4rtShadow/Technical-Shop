import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(username, password)
    if (result.success) {
      toast.success('Успешный вход!')
      navigate('/')
    } else {
      toast.error(result.error || 'Ошибка входа')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/50 backdrop-blur-md rounded-lg p-8 border border-blue-500/30 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Вход
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Логин</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            Войти
          </button>
        </form>
        <div className="mt-4 text-center space-y-2">
          <p className="text-gray-400">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300">
              Зарегистрироваться
            </Link>
          </p>
          <p className="text-sm text-gray-500">
            Не можете войти?{' '}
            <Link to="/verify-email" className="text-blue-400 hover:text-blue-300">
              Подтвердить email
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

