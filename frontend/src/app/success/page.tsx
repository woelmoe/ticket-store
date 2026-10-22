import Link from 'next/link'

interface Props {
  searchParams: { order?: string; total?: string; email?: string }
}

export default function SuccessPage({ searchParams }: Props) {
  const orderId = searchParams.order
  const total = Number(searchParams.total ?? 0)
  const email = searchParams.email

  return (
    <div className='mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm'>
      <div className='mb-4 text-5xl'>✅</div>
      <h1 className='text-2xl font-bold text-slate-900'>Заказ оформлен!</h1>

      {orderId ? (
        <p className='mt-3 text-sm text-slate-600'>
          Номер заказа:{' '}
          <span className='selectable rounded bg-slate-100 px-2 py-0.5 font-mono text-slate-900'>
            {orderId}
          </span>
        </p>
      ) : null}

      {Number.isFinite(total) && total > 0 ? (
        <p className='mt-1 text-sm text-slate-600'>
          Сумма:{' '}
          <span className='selectable font-semibold'>
            {total.toLocaleString('ru-RU')} ₽
          </span>
        </p>
      ) : null}

      {email ? (
        <p className='mt-1 text-sm text-slate-600'>
          Билеты отправлены на:{' '}
          <span className='selectable font-medium text-slate-900'>{email}</span>
        </p>
      ) : null}

      <Link
        href='/'
        className='mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700'
      >
        Купить ещё билеты
      </Link>
    </div>
  )
}
