import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Билеты — тестовое задание',
  description:
    'Покупка билетов с расчётом стоимости и возрастными ограничениями'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='ru'>
      <body>
        <div className='min-h-screen'>
          <header className='border-b border-slate-200 bg-white'></header>
          <main className='mx-auto max-w-5xl px-4 py-8'>{children}</main>
        </div>
      </body>
    </html>
  )
}
