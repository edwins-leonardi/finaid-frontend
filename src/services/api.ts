import { Person, ListPersonsRequest } from '../types/person'

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

    return response.json()
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

  async createPerson(person: { name: string; email: string }): Promise<Person> {
    const response = await this.request<{ data: Person }>('/persons', {
      method: 'POST',
      body: JSON.stringify(person),
    })
    return response.data
  }
}

export const apiService = new ApiService() 