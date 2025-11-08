import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Админ панель
      </h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-blue-500/30">
            <h3 className="text-2xl font-bold text-blue-400">{stats.total_users}</h3>
            <p className="text-gray-400">Пользователей</p>
          </div>
          <div className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-purple-400">{stats.total_products}</h3>
            <p className="text-gray-400">Товаров</p>
          </div>
          <div className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-pink-500/30">
            <h3 className="text-2xl font-bold text-pink-400">{stats.total_orders}</h3>
            <p className="text-gray-400">Заказов</p>
          </div>
          <div className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-green-500/30">
            <h3 className="text-2xl font-bold text-green-400">{stats.total_tickets}</h3>
            <p className="text-gray-400">Тикетов</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/admin/products"
          className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-blue-500/30 hover:border-blue-500 transition-colors"
        >
          <h3 className="text-xl font-bold mb-2">Товары</h3>
          <p className="text-gray-400">Управление товарами</p>
        </Link>
        <Link
          to="/admin/orders"
          className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-purple-500/30 hover:border-purple-500 transition-colors"
        >
          <h3 className="text-xl font-bold mb-2">Заказы</h3>
          <p className="text-gray-400">Просмотр заказов</p>
        </Link>
        <Link
          to="/admin/tickets"
          className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-pink-500/30 hover:border-pink-500 transition-colors"
        >
          <h3 className="text-xl font-bold mb-2">Тикеты</h3>
          <p className="text-gray-400">Управление тикетами</p>
        </Link>
        <Link
          to="/admin/users"
          className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-green-500/30 hover:border-green-500 transition-colors"
        >
          <h3 className="text-xl font-bold mb-2">Пользователи</h3>
          <p className="text-gray-400">Управление пользователями</p>
        </Link>
        <Link
          to="/admin/api-docs"
          className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-yellow-500/30 hover:border-yellow-500 transition-colors"
        >
          <h3 className="text-xl font-bold mb-2">API Документация</h3>
          <p className="text-gray-400">Swagger документация API</p>
        </Link>
      </div>
    </div>
  )
}

