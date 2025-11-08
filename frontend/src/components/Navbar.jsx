import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
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
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((s) => !s)}
              className="p-2 rounded-md hover:bg-white/10"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sliding menu */}
      {mobileOpen && (
        <div className="md:hidden bg-black/60 backdrop-blur-md border-t border-blue-500/20">
          <div className="px-4 py-4 space-y-2">
            <Link to="/products" className="block hover:text-blue-400 transition-colors">Каталог</Link>
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="block hover:text-blue-400 transition-colors">Корзина</Link>
                <Link to="/orders" className="block hover:text-blue-400 transition-colors">Заказы</Link>
                <Link to="/tickets" className="block hover:text-blue-400 transition-colors">Тикеты</Link>
                {user?.role === 'admin' && (
                  <>
                    <Link to="/admin" className="block hover:text-purple-400 transition-colors">Админ панель</Link>
                    <a href="/admin/api-docs" className="block hover:text-yellow-400 transition-colors">API Docs</a>
                  </>
                )}
                <Link to="/profile" className="block hover:text-blue-400 transition-colors">{user?.username}</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">Выход</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block hover:text-blue-400 transition-colors">Вход</Link>
                <Link to="/register" className="block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">Регистрация</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

