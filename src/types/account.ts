export interface Account {
  id: number
  name: string
  currency: string
  account_type: string
  initial_balance: number
  primary_owner_id: number
  second_owner_id?: number | null
  created_at: string
  updated_at: string
}

export interface ListAccountsRequest {
  skip?: number
  limit?: number
}

export interface CreateAccountRequest {
  name: string
  currency: string
  account_type: string
  initial_balance: number
  primary_owner_id: number
  second_owner_id?: number | null
} 