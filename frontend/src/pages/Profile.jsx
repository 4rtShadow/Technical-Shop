import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function Profile() {
  const { user, setUser } = useAuthStore()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: ''
  })
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        full_name: user.full_name || ''
      })
    }
  }, [user])

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const updateData = { ...formData }
      if (password) updateData.password = password
      const response = await api.put('/users/me', updateData)
      setUser(response.data)
      toast.success('Профиль обновлен')
      setPassword('')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Ошибка обновления профиля')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Профиль
      </h1>

      <div className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-blue-500/30 max-w-2xl">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Имя пользователя</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Полное имя</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Новый пароль (оставьте пустым, чтобы не менять)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            Обновить профиль
          </button>
        </form>
      </div>
    </div>
  )
}

