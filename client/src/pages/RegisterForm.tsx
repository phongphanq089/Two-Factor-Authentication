/* eslint-disable @typescript-eslint/no-explicit-any */
import { authService } from '@/service/authService'
import type { RegisterRequest } from '@/types/auth'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router'

const RegisterForm = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    username: '',
    youtube: '',
  })

  const navigate = useNavigate()

  const useRegister = () =>
    useMutation({
      mutationFn: authService.register,
      onSuccess: () => {
        navigate('/login', {
          state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' },
        })
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        console.error(
          'Registration failed:',
          error.response?.data?.message || error.message
        )
      },
    })

  const { mutate, isPending, error } = useRegister()

  const handleSubmit = (e: React.FormEvent) => {
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
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 px-4'>
      <div className='w-full max-w-lg bg-white rounded-2xl shadow-xl p-8'>
        <h2 className='text-3xl font-bold text-center text-gray-800 mb-6'>
          Đăng ký tài khoản
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
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              required
              className='w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400'
            />
          </div>

          <div>
            <label
              htmlFor='username'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Tên người dùng
            </label>
            <input
              type='text'
              id='username'
              name='username'
              value={formData.username}
              onChange={handleChange}
              required
              className='w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400'
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
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
              className='w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400'
            />
          </div>

          <div>
            <label
              htmlFor='youtube'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              YouTube Channel (tùy chọn)
            </label>
            <input
              type='url'
              id='youtube'
              name='youtube'
              value={formData.youtube}
              onChange={handleChange}
              placeholder='https://youtube.com/your-channel'
              className='w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400'
            />
          </div>

          <button
            type='submit'
            disabled={isPending}
            className='w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50'
          >
            {isPending ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>

          {error && (
            <div className='text-red-600 text-sm mt-2 text-center'>
              {(error as any).response?.data?.message || 'Đăng ký thất bại'}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default RegisterForm
