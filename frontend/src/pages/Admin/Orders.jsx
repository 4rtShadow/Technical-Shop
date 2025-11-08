import { useState, useEffect } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders')
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { status })
      toast.success('Статус обновлен')
      fetchOrders()
    } catch (error) {
      toast.error('Ошибка обновления статуса')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400'
      case 'processing': return 'text-blue-400'
      case 'shipped': return 'text-purple-400'
      case 'delivered': return 'text-green-400'
      case 'cancelled': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Загрузка...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Управление заказами
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-blue-500/30"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">Заказ #{order.id}</h3>
                <p className="text-gray-400">Пользователь ID: {order.user_id}</p>
                <p className="text-gray-400">
                  {new Date(order.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${getStatusColor(order.status)}`}>
                  {order.status}
                </p>
                <p className="text-2xl font-bold text-blue-400">{order.total_amount} ₽</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-gray-400">Адрес: {order.shipping_address}</p>
              <p className="text-gray-400">Телефон: {order.phone_number}</p>
            </div>
            <div className="mb-4">
              <h4 className="font-bold mb-2">Товары:</h4>
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex justify-between text-gray-300">
                  <span>Товар #{item.product_id} x{item.quantity}</span>
                  <span>{item.price * item.quantity} ₽</span>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Статус</label>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="pending">Ожидание</option>
                <option value="processing">В обработке</option>
                <option value="shipped">Отправлено</option>
                <option value="delivered">Доставлено</option>
                <option value="cancelled">Отменено</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

