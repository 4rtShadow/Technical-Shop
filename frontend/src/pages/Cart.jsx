import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart/')
      setCartItems(response.data)
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId)
      return
    }
    try {
      await api.put(`/cart/${itemId}`, { quantity: newQuantity })
      fetchCart()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Ошибка обновления')
    }
  }

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`)
      fetchCart()
      toast.success('Товар удален из корзины')
    } catch (error) {
      toast.error('Ошибка удаления')
    }
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity
  }, 0)

  if (loading) return <div className="container mx-auto px-4 py-8">Загрузка...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Корзина
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          Корзина пуста
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-blue-500/30 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4 flex-1">
                  {item.product?.image_url && (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold">{item.product?.name}</h3>
                    <p className="text-gray-400">{item.product?.price} ₽</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xl font-bold w-32 text-right">
                    {(item.product?.price || 0) * item.quantity} ₽
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-blue-500/30">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold">Итого:</span>
              <span className="text-3xl font-bold text-blue-400">{total} ₽</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              Оформить заказ
            </button>
          </div>
        </>
      )}
    </div>
  )
}

