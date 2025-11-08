import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function Checkout() {
  const [cartItems, setCartItems] = useState([])
  const [formData, setFormData] = useState({
    shipping_address: '',
    phone_number: '',
    notes: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart/')
      setCartItems(response.data)
      if (response.data.length === 0) {
        navigate('/cart')
      }
    } catch (error) {
      navigate('/cart')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const orderData = {
        shipping_address: formData.shipping_address,
        phone_number: formData.phone_number,
        notes: formData.notes,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product.price
        }))
      }
      await api.post('/orders/', orderData)
      toast.success('Заказ оформлен!')
      navigate('/orders')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Ошибка оформления заказа')
    }
  }

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity
  }, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Оформление заказа
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Адрес доставки</label>
            <input
              type="text"
              value={formData.shipping_address}
              onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Номер телефона</label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Примечания</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            Оформить заказ
          </button>
        </form>

        <div>
          <h2 className="text-2xl font-bold mb-4">Ваш заказ</h2>
          <div className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-blue-500/30 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.product?.name} x{item.quantity}</span>
                <span>{(item.product?.price || 0) * item.quantity} ₽</span>
              </div>
            ))}
            <div className="border-t border-gray-700 pt-4 flex justify-between text-xl font-bold">
              <span>Итого:</span>
              <span className="text-blue-400">{total} ₽</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

