import { Outlet } from 'react-router-dom'
import TopNavigation from '../components/TopNavigation'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white">
      <TopNavigation />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
