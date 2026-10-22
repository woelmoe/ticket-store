export interface Participant {
  name: string
  age: number
}

export interface OrderCreate {
  email: string
  participants: Participant[]
}

export interface PriceBreakdown {
  adults: number
  children: number
  adult_price: number
  child_price: number
  adult_total: number
  child_total: number
  total: number
}

export interface CalculateResponse {
  breakdown: PriceBreakdown
  total: number
}

export interface OrderResponse {
  order_id: string
  email: string
  participants: Participant[]
  breakdown: PriceBreakdown
  total: number
  seats_left: number
}

export interface ApiError {
  code: string
  message: string
  status: number
}
