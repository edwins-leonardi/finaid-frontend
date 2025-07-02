import { Person, ListPersonsRequest } from '../types/person'
import { Account, ListAccountsRequest, CreateAccountRequest } from '../types/account'
import { 
  Expense, 
  ExpenseCategory, 
  ExpenseSubCategory, 
  ListExpensesParams, 
  CreateExpenseRequest 
} from '../types/expense'

const API_BASE_URL = 'http://localhost:8080/api/v1'

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || `HTTP error! status: ${response.status}`
      throw new Error(errorMessage)
    }

    // Handle empty responses (like 204 No Content)
    const contentLength = response.headers.get('content-length')
    if (response.status === 204 || contentLength === '0') {
      return undefined as any
    }

    // Check if response has content
    const text = await response.text()
    if (!text) {
      return undefined as any
    }

    return JSON.parse(text)
  }

  async listPersons(params: ListPersonsRequest = {}): Promise<Person[]> {
    const searchParams = new URLSearchParams()
    
    if (params.skip !== undefined) {
      searchParams.append('skip', params.skip.toString())
    }
    if (params.limit !== undefined) {
      searchParams.append('limit', params.limit.toString())
    }

    const queryString = searchParams.toString()
    const endpoint = `/persons${queryString ? `?${queryString}` : ''}`
    
    const response = await this.request<{ data: Person[] }>(endpoint)
    return response.data
  }

  async getPersonById(id: number): Promise<Person> {
    const response = await this.request<{ data: Person }>(`/persons/${id}`)
    return response.data
  }

  async createPerson(person: { name: string; email: string }): Promise<Person> {
    const response = await this.request<{ data: Person }>('/persons', {
      method: 'POST',
      body: JSON.stringify(person),
    })
    return response.data
  }

  async updatePerson(id: number, person: { name: string; email: string }): Promise<Person> {
    const response = await this.request<{ data: Person }>(`/persons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(person),
    })
    return response.data
  }

  async deletePerson(id: number): Promise<void> {
    await this.request(`/persons/${id}`, {
      method: 'DELETE',
    })
  }

  // Account methods
  async listAccounts(params: ListAccountsRequest = {}): Promise<Account[]> {
    const searchParams = new URLSearchParams()
    
    if (params.skip !== undefined) {
      searchParams.append('skip', params.skip.toString())
    }
    if (params.limit !== undefined) {
      searchParams.append('limit', params.limit.toString())
    }

    const queryString = searchParams.toString()
    const endpoint = `/accounts${queryString ? `?${queryString}` : ''}`
    
    const response = await this.request<{ data: Account[] }>(endpoint)
    return response.data
  }

  async getAccountById(id: number): Promise<Account> {
    const response = await this.request<{ data: Account }>(`/accounts/${id}`)
    return response.data
  }

  async createAccount(account: CreateAccountRequest): Promise<Account> {
    const response = await this.request<{ data: Account }>('/accounts', {
      method: 'POST',
      body: JSON.stringify(account),
    })
    return response.data
  }

  async updateAccount(id: number, account: CreateAccountRequest): Promise<Account> {
    const response = await this.request<{ data: Account }>(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(account),
    })
    return response.data
  }

  async deleteAccount(id: number): Promise<void> {
    await this.request(`/accounts/${id}`, {
      method: 'DELETE',
    })
  }

  // Expense methods
  async listExpenses(params: ListExpensesParams = {}): Promise<Expense[]> {
    const searchParams = new URLSearchParams()
    
    if (params.skip !== undefined) {
      searchParams.append('skip', params.skip.toString())
    }
    if (params.limit !== undefined) {
      searchParams.append('limit', params.limit.toString())
    }
    if (params.category_id !== undefined) {
      searchParams.append('category_id', params.category_id.toString())
    }
    if (params.subcategory_id !== undefined) {
      searchParams.append('subcategory_id', params.subcategory_id.toString())
    }
    if (params.payee_id !== undefined) {
      searchParams.append('payee_id', params.payee_id.toString())
    }
    if (params.account_id !== undefined) {
      searchParams.append('account_id', params.account_id.toString())
    }
    if (params.start_date) {
      searchParams.append('start_date', params.start_date)
    }
    if (params.end_date) {
      searchParams.append('end_date', params.end_date)
    }

    const queryString = searchParams.toString()
    const endpoint = `/expenses${queryString ? `?${queryString}` : ''}`
    
    const response = await this.request<{ data: Expense[] }>(endpoint)
    return response.data
  }

  async getExpenseById(id: number): Promise<Expense> {
    const response = await this.request<{ data: Expense }>(`/expenses/${id}`)
    return response.data
  }

  async createExpense(expense: CreateExpenseRequest): Promise<Expense> {
    const response = await this.request<{ data: Expense }>('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    })
    return response.data
  }

  async updateExpense(id: number, expense: CreateExpenseRequest): Promise<Expense> {
    const response = await this.request<{ data: Expense }>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    })
    return response.data
  }

  async deleteExpense(id: number): Promise<void> {
    await this.request(`/expenses/${id}`, {
      method: 'DELETE',
    })
  }

  // Expense Category methods
  async listExpenseCategories(): Promise<ExpenseCategory[]> {
    const response = await this.request<{ data: ExpenseCategory[] }>('/expenses/categories')
    return response.data
  }

  async getExpenseCategoryById(id: number): Promise<ExpenseCategory> {
    const response = await this.request<{ data: ExpenseCategory }>(`/expenses/categories/${id}`)
    return response.data
  }

  // Expense SubCategory methods
  async listExpenseSubCategories(categoryId?: number): Promise<ExpenseSubCategory[]> {
    const searchParams = new URLSearchParams()
    if (categoryId) {
      searchParams.append('expense_category_id', categoryId.toString())
    }
    
    const queryString = searchParams.toString()
    const endpoint = `/expenses/categories/subcategories${queryString ? `?${queryString}` : ''}`
    
    const response = await this.request<{ data: ExpenseSubCategory[] }>(endpoint)
    return response.data
  }

  async getExpenseSubCategoryById(id: number): Promise<ExpenseSubCategory> {
    const response = await this.request<{ data: ExpenseSubCategory }>(`/expenses/categories/subcategories/${id}`)
    return response.data
  }
}

export const apiService = new ApiService() 