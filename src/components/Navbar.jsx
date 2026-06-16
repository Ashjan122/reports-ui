import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-slate-800 text-white px-6 py-3 flex items-center justify-between no-print">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-bold text-lg tracking-wide flex items-center gap-2">
          <svg width="20" height="22" viewBox="0 0 50 54" fill="none">
            <polygon points="25,2 49,52 1,52" fill="white" />
          </svg>
          Lab Reports
        </Link>
        <Link to="/" className="text-slate-300 hover:text-white text-sm">Reports</Link>
        <Link to="/settings" className="text-slate-300 hover:text-white text-sm">Settings</Link>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">{user.name}</span>
          <button
            onClick={handleLogout}
            className="bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
