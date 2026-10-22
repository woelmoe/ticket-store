'use client'

import type { PriceBreakdown } from '@/types'

interface Props {
  breakdown: PriceBreakdown | null
  submitting: boolean
  canSubmit: boolean
  onSubmit: () => void
}

function money(n: number): string {
  return `${n.toLocaleString('ru-RU')} ₽`
}

export default function OrderSummary({
  breakdown,
  submitting,
  canSubmit,
  onSubmit
}: Props) {
  return (
    <aside className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
      <h2 className='mb-3 text-lg font-semibold text-slate-900'>Итог заказа</h2>

      {!breakdown ? (
        <p className='text-sm text-slate-500'>
          Добавьте участников, чтобы увидеть стоимость.
        </p>
      ) : (
        <dl className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <dt className='text-slate-600'>Взрослые ({breakdown.adults})</dt>
            <dd className='font-medium'>{money(breakdown.adult_total)}</dd>
          </div>
          <div className='flex justify-between'>
            <dt className='text-slate-600'>Дети ({breakdown.children})</dt>
            <dd className='font-medium'>{money(breakdown.child_total)}</dd>
          </div>
          <div className='flex justify-between border-t border-slate-200 pt-2'>
            <dt className='text-base font-semibold'>Итого</dt>
            <dd className='text-base font-bold text-indigo-600'>
              {money(breakdown.total)}
            </dd>
          </div>
        </dl>
      )}

      <button
        type='button'
        onClick={onSubmit}
        disabled={submitting || !canSubmit || !breakdown}
        className='mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'
      >
        {submitting ? 'Оформляем…' : 'Оформить заказ'}
      </button>

      <p className='mt-3 text-xs text-slate-500'>
        Оплата и доставка билетов не входят в тестовое задание.
      </p>
    </aside>
  )
}
