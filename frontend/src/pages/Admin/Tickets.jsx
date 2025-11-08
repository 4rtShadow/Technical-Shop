import { useState, useEffect } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function AdminTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await api.get('/admin/tickets')
      setTickets(response.data)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (ticketId, status) => {
    try {
      await api.put(`/admin/tickets/${ticketId}`, { status })
      toast.success('Статус обновлен')
      fetchTickets()
    } catch (error) {
      toast.error('Ошибка обновления статуса')
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
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Управление тикетами
      </h1>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-blue-500/30"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{ticket.subject}</h3>
                <p className="text-gray-400">Пользователь ID: {ticket.user_id}</p>
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
            <p className="text-gray-300 mb-4">{ticket.description}</p>
            <div>
              <label className="block text-sm font-medium mb-2">Статус</label>
              <select
                value={ticket.status}
                onChange={(e) => updateStatus(ticket.id, e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="open">Открыт</option>
                <option value="in_progress">В работе</option>
                <option value="resolved">Решен</option>
                <option value="closed">Закрыт</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

