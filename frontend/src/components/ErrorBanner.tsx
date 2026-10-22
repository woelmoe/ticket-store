'use client'

interface Props {
  code?: string
  message: string
  onClose?: () => void
}

export default function ErrorBanner({ code, message, onClose }: Props) {
  return (
    <div className='flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-900'>
      <div className='mt-0.5 text-lg leading-none'>⚠️</div>
      <div className='flex-1'>
        <p className='text-sm font-semibold'>
          {code ? (
            <span className='mr-1 rounded bg-red-200 px-1.5 py-0.5 font-mono text-xs'>
              {code}
            </span>
          ) : null}
          {message}
        </p>
      </div>
      {onClose ? (
        <button
          type='button'
          onClick={onClose}
          className='text-red-700 hover:text-red-900'
          aria-label='Закрыть'
        >
          ✕
        </button>
      ) : null}
    </div>
  )
}
