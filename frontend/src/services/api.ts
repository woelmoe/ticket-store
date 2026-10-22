import axios, { AxiosError } from 'axios'
import type {
  ApiError,
  CalculateResponse,
  OrderCreate,
  OrderResponse
} from '@/types'

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export const http = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

function normalizeError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<{
      code?: string
      message?: string
      detail?: { code?: string; message?: string } | string
    }>
    const status = ax.response?.status ?? 0
    const data = ax.response?.data

    // Наш бэкенд возвращает {code, message} на верхнем уровне (DomainError handler)
    if (
      data &&
      typeof data === 'object' &&
      'code' in data &&
      'message' in data
    ) {
      return {
        code: data.code as string,
        message: data.message as string,
        status
      }
    }

    // FastAPI validation errors (422 от pydantic) — формат {detail: [...]}
    if (data && typeof data === 'object' && 'detail' in data) {
      const detail = data.detail
      if (typeof detail === 'string') {
        return { code: 'VALIDATION_ERROR', message: detail, status }
      }
      return {
        code: 'VALIDATION_ERROR',
        message: 'Некорректные данные формы',
        status
      }
    }

    return {
      code: 'NETWORK_ERROR',
      message: ax.message || 'Ошибка сети',
      status
    }
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: err instanceof Error ? err.message : 'Неизвестная ошибка',
    status: 0
  }
}

export async function calculatePrice(
  payload: OrderCreate
): Promise<CalculateResponse> {
  try {
    const { data } = await http.post<CalculateResponse>(
      '/api/v1/calculate',
      payload
    )
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

export async function createOrder(
  payload: OrderCreate
): Promise<OrderResponse> {
  try {
    const { data } = await http.post<OrderResponse>('/api/v1/order', payload)
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value &&
    'status' in value
  )
}
