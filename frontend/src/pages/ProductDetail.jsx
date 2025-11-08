import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuthStore } from '../store/authStore'
import { toast } from 'react-toastify'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`)
      setProduct(response.data)
    } catch (error) {
      toast.error('Товар не найден')
      navigate('/products')
    }
  }

  const addToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Войдите в систему для добавления в корзину')
      navigate('/login')
      return
    }

    try {
      await api.post('/cart/', { product_id: product.id, quantity })
      toast.success('Товар добавлен в корзину')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Ошибка добавления в корзину')
    }
  }

  if (!product) return <div className="container mx-auto px-4 py-8">Загрузка...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full rounded-lg"
            />
          ) : (
            <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Нет изображения</span>
            </div>
          )}
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-blue-400 mb-4">{product.price} ₽</p>
          <p className="text-gray-300 mb-4">{product.description}</p>
          <p className="text-gray-400 mb-4">Категория: {product.category}</p>
          <p className="text-gray-400 mb-4">
            В наличии: {product.stock_quantity > 0 ? product.stock_quantity : 'Нет в наличии'}
          </p>
          
          {product.stock_quantity > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Количество</label>
              <input
                type="number"
                min="1"
                max={product.stock_quantity}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
          
          <button
            onClick={addToCart}
            disabled={product.stock_quantity === 0}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.stock_quantity > 0 ? 'Добавить в корзину' : 'Нет в наличии'}
          </button>
        </div>
      </div>
    </div>
  )
}

