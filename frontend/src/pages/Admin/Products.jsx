import { useState, useEffect } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'laptops',
    image_url: '',
    stock_quantity: 0
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, formData)
        toast.success('Товар обновлен')
      } else {
        await api.post('/admin/products', formData)
        toast.success('Товар создан')
      }
      setShowForm(false)
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'laptops',
        image_url: '',
        stock_quantity: 0
      })
      fetchProducts()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Ошибка')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      image_url: product.image_url || '',
      stock_quantity: product.stock_quantity
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить товар?')) return
    try {
      await api.delete(`/admin/products/${id}`)
      toast.success('Товар удален')
      fetchProducts()
    } catch (error) {
      toast.error('Ошибка удаления')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Управление товарами
        </h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingProduct(null)
            setFormData({
              name: '',
              description: '',
              price: 0,
              category: 'laptops',
              image_url: '',
              stock_quantity: 0
            })
          }}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform"
        >
          Добавить товар
        </button>
      </div>

      {showForm && (
        <div className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-blue-500/30 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingProduct ? 'Редактировать товар' : 'Новый товар'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Название</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Цена</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Количество</label>
                <input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Категория</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="laptops">Ноутбуки</option>
                <option value="smartphones">Смартфоны</option>
                <option value="tablets">Планшеты</option>
                <option value="headphones">Наушники</option>
                <option value="cameras">Камеры</option>
                <option value="accessories">Аксессуары</option>
                <option value="gaming">Игры</option>
                <option value="audio">Аудио</option>
                <option value="other">Другое</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL изображения</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                {editingProduct ? 'Обновить' : 'Создать'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingProduct(null)
                }}
                className="px-6 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-blue-500/30"
          >
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{product.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-blue-400">{product.price} ₽</span>
              <span className="text-sm text-gray-400">В наличии: {product.stock_quantity}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(product)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Редактировать
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
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

