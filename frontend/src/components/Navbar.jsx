import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { motion } from 'framer-motion'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-black/50 backdrop-blur-md border-b border-blue-500/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            TechStore
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/products" className="hover:text-blue-400 transition-colors">
              Каталог
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="hover:text-blue-400 transition-colors">
                  Корзина
                </Link>
                <Link to="/orders" className="hover:text-blue-400 transition-colors">
                  Заказы
                </Link>
                <Link to="/tickets" className="hover:text-blue-400 transition-colors">
                  Тикеты
                </Link>
                {user?.role === 'admin' && (
                  <>
                    <Link to="/admin" className="hover:text-purple-400 transition-colors">
                      Админ панель
                    </Link>
                    <a 
                      href="/admin/api-docs" 
                      className="hover:text-yellow-400 transition-colors"
                    >
                      API Docs
                    </a>
                  </>
                )}
                <Link to="/profile" className="hover:text-blue-400 transition-colors">
                  {user?.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Выход
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-400 transition-colors">
                  Вход
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

