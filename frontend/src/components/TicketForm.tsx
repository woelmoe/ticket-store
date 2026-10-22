'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { ApiError, Participant, PriceBreakdown } from '@/types'
import { calculatePrice, createOrder, isApiError } from '@/services/api'
import { validateEmail, validateParticipants } from '@/utils/validation'
import ParticipantCard from './ParticipantCard'
import OrderSummary from './OrderSummary'
import ErrorBanner from './ErrorBanner'

const emptyParticipant = (): Participant => ({ name: '', age: 18 })

export default function TicketForm() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [participants, setParticipants] = useState<Participant[]>([
    emptyParticipant()
  ])
  const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null)
  const [serverError, setServerError] = useState<ApiError | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [calculating, setCalculating] = useState(false)

  const emailError = emailTouched ? validateEmail(email) : null

  const localValidation = useMemo(
    () => validateParticipants(participants),
    [participants]
  )

  // Пофайловые ошибки участников (для подсветки полей)
  const participantFieldErrors = useMemo(() => {
    return participants.map((p) => {
      const nameError = !p.name.trim() ? 'Введите имя' : undefined
      const ageError =
        !Number.isFinite(p.age) || p.age < 0 || p.age > 120
          ? '0–120'
          : undefined
      return { nameError, ageError }
    })
  }, [participants])

  const updateParticipant = useCallback(
    (index: number, patch: Partial<Participant>) => {
      setParticipants((prev) =>
        prev.map((p, i) => (i === index ? { ...p, ...patch } : p))
      )
    },
    []
  )

  const addParticipant = useCallback(() => {
    setParticipants((prev) => [...prev, emptyParticipant()])
  }, [])

  const removeParticipant = useCallback((index: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index))
  }, [])

  // Пересчёт цены (только если валиден email и участники)
  useEffect(() => {
    const emailOk = validateEmail(email) === null

    if (!emailOk || !localValidation.valid) {
      setBreakdown(null)
      return
    }

    let cancelled = false
    setCalculating(true)
    const t = setTimeout(async () => {
      try {
        const res = await calculatePrice({ email, participants })
        if (!cancelled) {
          setBreakdown(res.breakdown)
          setServerError(null)
        }
      } catch (err) {
        if (!cancelled && isApiError(err)) {
          setServerError(err)
          setBreakdown(null)
        }
      } finally {
        if (!cancelled) setCalculating(false)
      }
    }, 400)

    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [email, participants, localValidation.valid])

  const handleSubmit = async () => {
    setEmailTouched(true)
    setServerError(null)

    const emailProblem = validateEmail(email)
    if (emailProblem) return

    if (!localValidation.valid) return

    setSubmitting(true)
    try {
      const order = await createOrder({ email, participants })
      router.push(
        `/success?order=${encodeURIComponent(order.order_id)}&total=${order.total}&email=${encodeURIComponent(order.email)}`
      )
    } catch (err) {
      if (isApiError(err)) setServerError(err)
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit =
    localValidation.valid && validateEmail(email) === null && !calculating

  return (
    <div className='grid gap-6 md:grid-cols-[1fr_320px]'>
      <section className='space-y-4'>
        {/* Email */}
        <div className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
          <label className='mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500'>
            Email для получения билетов
          </label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            placeholder='user@example.com'
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
              emailError
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
            }`}
          />
          {emailError && (
            <p className='mt-1 text-xs text-red-600'>{emailError}</p>
          )}
        </div>

        {/* Участники */}
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-slate-900'>Участники</h2>
          <button
            type='button'
            onClick={addParticipant}
            className='rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50'
          >
            + Добавить участника
          </button>
        </div>

        {participants.map((p, i) => (
          <ParticipantCard
            key={i}
            index={i}
            participant={p}
            onChange={updateParticipant}
            onRemove={removeParticipant}
            canRemove={participants.length > 1}
            nameError={participantFieldErrors[i]?.nameError}
            ageError={participantFieldErrors[i]?.ageError}
          />
        ))}

        {/* Бизнес-ошибки (ребёнок без взрослого, >3 детей и т.п.) */}
        {!localValidation.valid && (
          <ul className='space-y-1 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700'>
            {localValidation.errors.map((e, i) => (
              <li key={i}>• {e}</li>
            ))}
          </ul>
        )}

        {/* Серверные ошибки */}
        {serverError && (
          <ErrorBanner
            code={serverError.code}
            message={serverError.message}
            onClose={() => setServerError(null)}
          />
        )}
      </section>

      <OrderSummary
        breakdown={breakdown}
        submitting={submitting || calculating}
        canSubmit={canSubmit}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
