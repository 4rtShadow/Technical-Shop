import { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'

export default function APIDocs() {
  const { token } = useAuthStore()

  useEffect(() => {
    if (token && typeof window !== 'undefined') {
      // Открываем документацию в новой вкладке с токеном
      const docsUrl = `/api/docs?token=${encodeURIComponent(token)}`
      window.open(docsUrl, '_blank')
      // Перенаправляем обратно в админ панель через небольшую задержку
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/admin'
        }
      }, 1000)
    }
  }, [token])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-black/50 backdrop-blur-md rounded-lg p-8 border border-blue-500/30 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Открытие API Документации
        </h1>
        <p className="text-gray-300 mb-6">
          Документация API открывается в новой вкладке...
        </p>
        <p className="text-gray-400 text-sm">
          Если вкладка не открылась, пожалуйста, проверьте настройки блокировки всплывающих окон в браузере.
        </p>
      </div>
    </div>
  )
}

