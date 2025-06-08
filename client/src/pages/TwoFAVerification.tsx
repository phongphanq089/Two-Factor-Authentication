/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from '@/hook/useAuth'
import { authService } from '@/service/authService'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router'

const TwoFAVerification = () => {
  const [verificationCode, setVerificationCode] = useState<string>('')
  const { user, session, updateSession } = useAuth()
  const navigate = useNavigate()

  const useVerify2FALoginMutation = () =>
    useMutation({
      mutationFn: ({
        userId,
        token,
        sessionId,
      }: {
        userId: string
        token: string
        sessionId: string
      }) => authService.verify2FALogin(userId, token, sessionId),
      onSuccess: () => {
        updateSession({ ...session!, is_2fa_verified: true })
        navigate('/')
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        console.error(
          '2FA verification failed:',
          error.response?.data?.message || error.message
        )
      },
    })

  const {
    mutate: verify2FALoginMutation,
    isPending: isPendingVerify2FAMutation,
    error,
  } = useVerify2FALoginMutation()

  const handleSubmit = (e: React.FormEvent) => {
    console.log(user!._id, verificationCode, session!._id)
    e.preventDefault()
    if (verificationCode.length === 6) {
      verify2FALoginMutation({
        userId: user!._id,
        token: verificationCode,
        sessionId: session!._id,
      })
    }
  }

  return (
    <div className='max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-xl bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900'>
      <h2 className='text-2xl font-bold text-center text-gray-800 dark:text-white mb-4'>
        Xác thực hai yếu tố
      </h2>
      <p className='text-sm text-gray-600 dark:text-gray-300 mb-6 text-center'>
        Vui lòng nhập mã 6 chữ số từ ứng dụng Authenticator của bạn
      </p>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='flex justify-center'>
          <input
            type='text'
            value={verificationCode}
            onChange={(e) =>
              setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            placeholder='000000'
            maxLength={6}
            autoFocus
            className='w-32 text-center text-lg font-semibold tracking-widest px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
          />
        </div>

        <button
          type='submit'
          disabled={isPendingVerify2FAMutation || verificationCode.length !== 6}
          className='w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:bg-gray-400'
        >
          {isPendingVerify2FAMutation ? 'Đang xác thực...' : 'Xác thực'}
        </button>

        {error && (
          <div className='mt-2 text-center text-red-600 text-sm font-medium'>
            {(error as any)?.response?.data?.message ||
              'Mã xác thực không đúng'}
          </div>
        )}
      </form>
    </div>
  )
}

export default TwoFAVerification
