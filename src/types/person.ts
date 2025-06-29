export interface Person {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface ListPersonsRequest {
  skip?: number
  limit?: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
} 