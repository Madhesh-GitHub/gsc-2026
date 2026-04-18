import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function TopNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const navLinks = [
    { path: '/apply', label: 'Apply', roles: ['candidate'] },
    { path: '/tracker', label: 'Tracker', roles: ['candidate'] },
    { path: '/hr', label: 'HR Dashboard', roles: ['recruiter'] },
  ]

  const visibleLinks = navLinks.filter(
    (link) => !link.roles.length || (user && link.roles.includes(user.role))
  )

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-2xl"
            style={{ color: '#1a73e8' }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#1a73e8' }}
            >
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="hidden sm:inline">Equitable ATS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {visibleLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'border-b-2 pb-1'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={
                  isActive(link.path)
                    ? { borderColor: '#1a73e8', color: '#1a73e8' }
                    : {}
                }
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side - User menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50">
                  <UserIcon size={18} className="text-gray-600" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{user.first_name}</p>
                    <p className="text-xs text-gray-600 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all hover:shadow-md"
                  style={{ backgroundColor: '#1a73e8' }}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-3">
            {visibleLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={isActive(link.path) ? { backgroundColor: '#1a73e8' } : {}}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile user menu */}
            <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
              {user ? (
                <>
                  <div className="px-4 py-2 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                    <p className="text-xs text-gray-600 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full px-4 py-2 text-left rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/register"
                    className="block px-4 py-2 rounded-lg text-white font-medium transition-colors text-sm"
                    style={{ backgroundColor: '#1a73e8' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
