import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class APIClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add token to requests if available
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Handle response errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('access_token')
          localStorage.removeItem('user')
          window.location.href = '/auth/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async register(data: {
    email: string
    password: string
    first_name: string
    last_name: string
    role: 'candidate' | 'recruiter'
  }) {
    const response = await this.client.post('/auth/register', data)
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password })
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me')
    return response.data
  }

  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }

  // Candidate endpoints
  async submitApplication(data: {
    resume_url: string
    github_url?: string
    linkedin_url?: string
  }) {
    const response = await this.client.post('/candidates/apply', data)
    return response.data
  }

  async getMyApplication() {
    const response = await this.client.get('/candidates/me')
    return response.data
  }

  // HR endpoints
  async listCandidates(status?: string) {
    const params = status ? { status } : {}
    const response = await this.client.get('/candidates', { params })
    return response.data
  }

  async getCandidateDetails(candidateId: string) {
    const response = await this.client.get(`/candidates/${candidateId}`)
    return response.data
  }

  async getCandidateProofs(candidateId: string) {
    const response = await this.client.get(`/candidate-proofs/candidate/${candidateId}`)
    return response.data
  }

  // Health check
  async healthCheck() {
    const response = await this.client.get('/health')
    return response.data
  }
}

export const apiClient = new APIClient()
export default apiClient
