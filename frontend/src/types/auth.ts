import { UserType } from '../utils/auth'

// Auth Context Types
export interface AuthContextType {
  user: UserType | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    email: string
    password: string
    first_name: string
    last_name: string
    role: 'candidate' | 'recruiter'
  }) => Promise<void>
  logout: () => void
}
