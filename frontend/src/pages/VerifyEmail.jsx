import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      verifyEmail(token)
    } else {
      setStatus('error')
      setMessage('Токен подтверждения не найден')
    }
  }, [searchParams])

  const verifyEmail = async (token) => {
    try {
      const response = await api.post('/users/verify-email', null, {
        params: { token }
      })
      setStatus('success')
      setMessage(response.data.message)
      setTimeout(() => navigate('/login'), 3000)
    } catch (error) {
      setStatus('error')
      setMessage(error.response?.data?.detail || 'Ошибка подтверждения email')
    }
  }

  const handleResendVerification = async (e) => {
    e.preventDefault()
    try {
      await api.post('/users/resend-verification', null, {
        params: { email: resendEmail }
      })
      toast.success('Письмо с подтверждением отправлено повторно')
      setResendEmail('')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Ошибка отправки письма')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/50 backdrop-blur-md rounded-lg p-8 border border-blue-500/30 w-full max-w-md text-center"
      >
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Подтверждение Email
        </h2>

        {status === 'verifying' && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400">Подтверждение email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <p className="text-green-400 font-semibold">{message}</p>
            <p className="text-gray-400">Перенаправление на страницу входа...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <p className="text-red-400 font-semibold">{message}</p>
            
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold mb-4">Отправить письмо повторно</h3>
              <form onSubmit={handleResendVerification} className="space-y-4">
                <input
                  type="email"
                  placeholder="Введите ваш email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform"
                >
                  Отправить повторно
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-700">
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Вернуться к входу
          </Link>
        </div>
      </motion.div>
    </div>
  )
}