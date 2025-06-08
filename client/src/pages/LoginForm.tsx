/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from '@/hook/useAuth'
import { authService } from '@/service/authService'
import type { LoginRequest } from '@/types/auth'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
    device_id: 'web-browser-' + Date.now(),
  })

  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const useLogin = () =>
    useMutation({
      mutationFn: authService.login,
      onSuccess: (data) => {
        login(data.user, data.session)

        if (data.requires2FA && !data.session.is_2fa_verified) {
          navigate('/verify-2fa')
        } else {
          const from = location.state?.from?.pathname || '/'
          navigate(from, { replace: true })
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        console.error(
          'Login failed:',
          error.response?.data?.message || error.message
        )
      },
    })

  const { mutate, isPending, error } = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 px-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-8'>
        <h2 className='text-3xl font-bold text-center text-gray-800 mb-6'>
          Đăng nhập
        </h2>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Email
            </label>
            <input
              type='email'
              name='email'
              id='email'
              value={formData.email}
              onChange={handleChange}
              required
              className='w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition'
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Mật khẩu
            </label>
            <input
              type='password'
              name='password'
              id='password'
              value={formData.password}
              onChange={handleChange}
              required
              className='w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition'
            />
          </div>

          <button
            disabled={isPending}
            className='w-full py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-red-600 transition disabled:opacity-50'
          >
            {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          {error && (
            <div className='text-red-600 text-sm mt-2 text-center'>
              {(error as any).response?.data?.message || 'Đăng nhập thất bại'}
            </div>
          )}
          <Link
            to={'/register'}
            className='underline underline-offset-4 text-center flex justify-center items-center w-full mx-auto'
          >
            Đăng ký
          </Link>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
