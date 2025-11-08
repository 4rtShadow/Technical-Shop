import { useState, useEffect } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function Tickets() {
  const [tickets, setTickets] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await api.get('/tickets/')
      setTickets(response.data)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/tickets/', formData)
      toast.success('Тикет создан')
      setShowCreate(false)
      setFormData({ subject: '', description: '', priority: 'medium' })
      fetchTickets()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Ошибка создания тикета')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-yellow-400'
      case 'in_progress': return 'text-blue-400'
      case 'resolved': return 'text-green-400'
      case 'closed': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Загрузка...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Тикеты поддержки
        </h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform"
        >
          Создать тикет
        </button>
      </div>

      {showCreate && (
        <div className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-blue-500/30 mb-8">
          <h2 className="text-2xl font-bold mb-4">Создать тикет</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Тема</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Приоритет</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
                <option value="urgent">Срочный</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              Создать
            </button>
          </form>
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          У вас нет тикетов
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-blue-500/30"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{ticket.subject}</h3>
                  <p className="text-gray-400">
                    {new Date(ticket.created_at).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </p>
                  <p className="text-gray-400">{ticket.priority}</p>
                </div>
              </div>
              <p className="text-gray-300">{ticket.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

