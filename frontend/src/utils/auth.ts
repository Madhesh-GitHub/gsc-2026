// Global API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Token management
export const getToken = () => localStorage.getItem('access_token')
export const getUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}
export const saveToken = (token: string) => localStorage.setItem('access_token', token)
export const saveUser = (user: any) => localStorage.setItem('user', JSON.stringify(user))
export const clearAuth = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
}

// API response types
export interface AuthResponse {
  access_token: string
  token_type: string
  user: UserType
}

export interface UserType {
  id: string
  email: string
  first_name: string
  last_name: string
  role: 'candidate' | 'recruiter' | 'admin'
  created_at: string
}

export interface CandidateType {
  id: string
  user_id: string
  status: 'Reviewing' | 'Rejected' | 'Blacklisted' | 'Accepted' | 'Human_Escalation'
  resume_url: string
  github_url?: string
  linkedin_url?: string
  capability_score?: number
  verification_score?: number
  decision_matrix?: any
  created_at: string
  updated_at: string
}
