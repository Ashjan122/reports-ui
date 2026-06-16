import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'

export default function Dashboard() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    api.get('/reports')
      .then(r => setReports(r.data))
      .catch(() => setError('Failed to load reports'))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id) {
    if (!confirm('Delete this report?')) return
    await api.delete(`/reports/${id}`)
    setReports(prev => prev.filter(r => r.id !== id))
  }

  if (loading) return <div className="p-8 text-gray-400">Loading…</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Concrete Strength Test Reports</h1>
        <Link to="/new" className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium">
          + New Report
        </Link>
      </div>

      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

      {reports.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-xl mb-6">No reports yet</p>
          <Link to="/new" className="bg-blue-700 text-white px-6 py-2.5 rounded-lg hover:bg-blue-800 font-medium">
            Create First Report
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Lab Ref.</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Client Ref.</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Client</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Project</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Date Reported</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{r.report_ref || '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.client_request_ref || '—'}</td>
                  <td className="px-4 py-3">{r.client_name || '—'}</td>
                  <td className="px-4 py-3">{r.project || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{r.date_reported || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      r.report_type === 'interim'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {r.report_type === 'interim' ? 'Interim' : 'Final'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap space-x-3">
                    <Link to={`/view/${r.id}`} className="text-blue-600 hover:underline font-medium">
                      View / PDF
                    </Link>
                    <Link to={`/edit/${r.id}`} className="text-gray-600 hover:underline">Edit</Link>
                    <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
