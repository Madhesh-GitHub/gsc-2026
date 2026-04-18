import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'
import PrivateRoute from './components/PrivateRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ApplyPage from './pages/ApplyPage'
import TrackerPage from './pages/TrackerPage'
import HRPage from './pages/HRPage'
import DemoPage from './pages/DemoPage'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route
              path="/apply"
              element={
                <PrivateRoute requiredRole="candidate">
                  <ApplyPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/tracker"
              element={
                <PrivateRoute requiredRole="candidate">
                  <TrackerPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/hr"
              element={
                <PrivateRoute requiredRole="recruiter">
                  <HRPage />
                </PrivateRoute>
              }
            />
            <Route path="/demo" element={<DemoPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
