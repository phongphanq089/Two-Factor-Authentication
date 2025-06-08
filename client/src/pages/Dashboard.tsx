/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAuth } from '@/hook/useAuth'
import { authService } from '@/service/authService'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

const Dashboard = () => {
  const { user, logout } = useAuth()

  if (!user) return null
  return (
    <div className='min-h-screen bg-gray-100'>
      <header className='bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between shadow-md'>
        <h1 className='text-white text-2xl font-bold'>Dashboard</h1>
        <Button
          onClick={logout}
          className='bg-white text-indigo-600 font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 transition'
        >
          Đăng xuất
        </Button>
      </header>

      <main className='p-6 space-y-6 max-w-5xl mx-auto'>
        <section className='bg-white p-6 rounded-2xl shadow-md'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Thông tin tài khoản
          </h2>
          <div className='space-y-2 text-gray-700'>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>YouTube:</strong> {user.youtube || 'Chưa cập nhật'}
            </p>
            <p>
              <strong>2FA Status:</strong>{' '}
              {user.require_2fa ? (
                <span className='text-green-600 font-semibold'>✅ Đã bật</span>
              ) : (
                <span className='text-red-600 font-semibold'>❌ Chưa bật</span>
              )}
            </p>
          </div>
        </section>

        <section className='bg-white p-6 rounded-2xl shadow-md'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Cài đặt bảo mật
          </h2>
          <TwoFASetup />
        </section>
      </main>
    </div>
  )
}

export default Dashboard

const TwoFASetup = () => {
  const [step, setStep] = useState<'setup' | 'verify'>('setup')
  const [qrCode, setQrCode] = useState<string>('')
  const [secret, setSecret] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState<string>('')
  const { user, updateUser } = useAuth()
  const [open, setOpen] = useState(false)
  const useSetup2FAMutation = () =>
    useMutation({
      mutationFn: authService.enable2FA,
      onSuccess: (data) => {
        setQrCode(data.qrCode)
        setSecret(data.secret)
        setStep('verify')
      },
      onError: (error: any) => {
        console.error(
          '2FA setup failed:',
          error.response?.data?.message || error.message
        )
      },
    })

  const useVerify2FAMutation = () =>
    useMutation({
      mutationFn: ({ userId, token }: { userId: string; token: string }) =>
        authService.verify2FASetup(userId, token),
      onSuccess: () => {
        updateUser({ ...user!, require_2fa: true })
        alert('2FA đã được bật thành công!')
        setStep('setup')
        setQrCode('')
        setSecret('')
        setVerificationCode('')
      },
      onError: (error: any) => {
        console.error(
          '2FA verification failed:',
          error.response?.data?.message || error.message
        )
      },
    })
  const useDisable2FAMutation = () =>
    useMutation({
      mutationFn: authService.disable2FA,
      onSuccess: () => {
        updateUser({ ...user!, require_2fa: false })
        alert('2FA đã được tắt thành công!')
      },
      onError: (error: any) => {
        console.error(
          'Disable 2FA failed:',
          error.response?.data?.message || error.message
        )
      },
    })

  const { mutate: setup2FAMutation, isPending: isPendingSetup2FAMutation } =
    useSetup2FAMutation()

  const { mutate: verify2FAMutation, isPending: isPendingVerify2FAMutation } =
    useVerify2FAMutation()

  const { mutate: disable2FAMutation, isPending: isPendingDisable2FAMutation } =
    useDisable2FAMutation()

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Thiết lập 2FA</Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Xác thực hai yếu tố (2FA)</DialogTitle>
          <DialogDescription>
            Bảo vệ tài khoản của bạn với xác thực hai bước.
          </DialogDescription>
        </DialogHeader>

        {user.require_2fa ? (
          <div className='space-y-4'>
            <p className='text-green-600'>
              ✅ 2FA đã được bật cho tài khoản của bạn
            </p>
            <Button
              variant='destructive'
              onClick={() => disable2FAMutation(user!._id)}
              disabled={isPendingDisable2FAMutation}
            >
              {isPendingDisable2FAMutation ? 'Đang tắt...' : 'Tắt 2FA'}
            </Button>
          </div>
        ) : (
          <div className='space-y-4'>
            {step === 'setup' && (
              <>
                <p>Bắt đầu bằng cách bật 2FA cho tài khoản.</p>
                <Button
                  onClick={() => setup2FAMutation(user!._id)}
                  disabled={isPendingSetup2FAMutation}
                >
                  {isPendingSetup2FAMutation ? 'Đang thiết lập...' : 'Bật 2FA'}
                </Button>
              </>
            )}

            {step === 'verify' && (
              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold'>Bước 1: Quét mã QR</h4>
                  <img
                    src={qrCode}
                    alt='QR Code'
                    className='mx-auto border rounded-lg p-2'
                  />
                </div>

                <div>
                  <h4 className='font-semibold'>Bước 2: Nhập mã xác thực</h4>
                  <input
                    type='text'
                    placeholder='000000'
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(
                        e.target.value.replace(/\D/g, '').slice(0, 6)
                      )
                    }
                    maxLength={6}
                  />
                  <Button
                    onClick={() =>
                      verify2FAMutation({
                        userId: user!._id,
                        token: verificationCode,
                      })
                    }
                    disabled={
                      isPendingVerify2FAMutation ||
                      verificationCode.length !== 6
                    }
                    className='mt-2'
                  >
                    {isPendingVerify2FAMutation
                      ? 'Đang xác thực...'
                      : 'Xác thực'}
                  </Button>
                </div>

                <div className='text-sm text-gray-600'>
                  <p>
                    <strong>Secret Key (sao lưu):</strong>
                  </p>
                  <code className='block bg-gray-100 p-2 rounded'>
                    {secret}
                  </code>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant='ghost' onClick={() => setOpen(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
