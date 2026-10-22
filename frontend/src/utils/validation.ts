import type { Participant } from '@/types'

export const ADULT_MIN_AGE = 18
export const MAX_CHILDREN_PER_ADULT = 3
export const MAX_PARTICIPANTS = 20

// Простая проверка email — источник истины всё равно бэкенд (EmailStr)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function isAdult(age: number): boolean {
  return age >= ADULT_MIN_AGE
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim()
  if (!trimmed) return 'Введите email'
  if (!EMAIL_RE.test(trimmed)) return 'Некорректный email'
  return null
}

/**
 * Клиентская валидация — синхронна с бэкендом (pricing.validate_participants).
 */
export function validateParticipants(
  participants: Participant[]
): ValidationResult {
  const errors: string[] = []

  if (participants.length === 0) {
    errors.push('Добавьте хотя бы одного участника')
    return { valid: false, errors }
  }

  if (participants.length > MAX_PARTICIPANTS) {
    errors.push(`Максимум ${MAX_PARTICIPANTS} участников в одном заказе`)
  }

  for (const [i, p] of participants.entries()) {
    if (!p.name.trim()) {
      errors.push(`Участник #${i + 1}: имя не может быть пустым`)
    }
    if (!Number.isFinite(p.age) || p.age < 0 || p.age > 120) {
      errors.push(`Участник #${i + 1}: возраст должен быть от 0 до 120`)
    }
  }

  const adults = participants.filter((p) => isAdult(p.age)).length
  const children = participants.length - adults

  if (children > 0 && adults === 0) {
    errors.push('Ребёнок не может быть без сопровождающего взрослого')
  }

  if (adults > 0 && children > adults * MAX_CHILDREN_PER_ADULT) {
    errors.push(
      `На одного взрослого допускается не более ${MAX_CHILDREN_PER_ADULT} детей`
    )
  }

  return { valid: errors.length === 0, errors }
}
