import { useState, useEffect } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    role: 'user',
    is_active: true
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        const updateData = { ...formData }
        if (!updateData.password) delete updateData.password
        await api.put(`/admin/users/${editingUser.id}`, updateData)
        toast.success('Пользователь обновлен')
      } else {
        await api.post('/admin/users', formData)
        toast.success('Пользователь создан')
      }
      setShowForm(false)
      setEditingUser(null)
      setFormData({
        username: '',
        email: '',
        full_name: '',
        password: '',
        role: 'user',
        is_active: true
      })
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Ошибка')
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      full_name: user.full_name || '',
      password: '',
      role: user.role,
      is_active: user.is_active
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить пользователя?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      toast.success('Пользователь удален')
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Ошибка удаления')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Управление пользователями
        </h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingUser(null)
            setFormData({
              username: '',
              email: '',
              full_name: '',
              password: '',
              role: 'user',
              is_active: true
            })
          }}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform"
        >
          Создать пользователя
        </button>
      </div>

      {showForm && (
        <div className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-blue-500/30 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingUser ? 'Редактировать пользователя' : 'Новый пользователь'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-medium mb-2">
                {editingUser ? 'Новый пароль (оставьте пустым, чтобы не менять)' : 'Пароль'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                required={!editingUser}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Роль</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="user">Пользователь</option>
                <option value="admin">Администратор</option>
              </select>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Активен</span>
              </label>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                {editingUser ? 'Обновить' : 'Создать'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingUser(null)
                }}
                className="px-6 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-blue-500/30 flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-bold">{user.username}</h3>
              <p className="text-gray-400">{user.email}</p>
              <p className="text-gray-400">{user.full_name}</p>
              <p className="text-gray-400">
                Роль: {user.role} | {user.is_active ? 'Активен' : 'Неактивен'}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(user)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Редактировать
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

