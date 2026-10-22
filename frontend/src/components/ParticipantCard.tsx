'use client'

import type { Participant } from '@/types'

interface Props {
  index: number
  participant: Participant
  onChange: (index: number, patch: Partial<Participant>) => void
  onRemove: (index: number) => void
  canRemove: boolean
  nameError?: string
  ageError?: string
}

export default function ParticipantCard({
  index,
  participant,
  onChange,
  onRemove,
  canRemove,
  nameError,
  ageError
}: Props) {
  const inputBase =
    'w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2'

  const nameClass = nameError
    ? `${inputBase} border-red-400 focus:border-red-500 focus:ring-red-200`
    : `${inputBase} border-slate-300 focus:border-indigo-500 focus:ring-indigo-200`

  const ageClass = ageError
    ? `${inputBase} border-red-400 focus:border-red-500 focus:ring-red-200`
    : `${inputBase} border-slate-300 focus:border-indigo-500 focus:ring-indigo-200`

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-end ${
        nameError || ageError ? 'border-red-300' : 'border-slate-200'
      }`}
    >
      <div className='flex-1'>
        <label className='mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500'>
          Имя участника #{index + 1}
        </label>
        <input
          type='text'
          value={participant.name}
          onChange={(e) => onChange(index, { name: e.target.value })}
          placeholder='Иван Иванов'
          className={nameClass}
        />
        {nameError && <p className='mt-1 text-xs text-red-600'>{nameError}</p>}
      </div>

      <div className='w-full sm:w-32'>
        <label className='mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500'>
          Возраст
        </label>
        <input
          type='number'
          inputMode='numeric'
          min={0}
          max={120}
          value={Number.isFinite(participant.age) ? participant.age : ''}
          onChange={(e) => {
            const raw = e.target.value
            const next = raw === '' ? NaN : Number(raw)
            onChange(index, { age: Number.isNaN(next) ? 0 : next })
          }}
          className={ageClass}
        />
        {ageError && <p className='mt-1 text-xs text-red-600'>{ageError}</p>}
      </div>

      <button
        type='button'
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        className='rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40'
      >
        Удалить
      </button>
    </div>
  )
}
