import { useState, useEffect } from 'react'
import TicketRow from '../components/TicketRow'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const STATUS_FILTERS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' },
]

function TicketList() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetch(`${API_URL}/tickets`)
      .then((res) => {
        if (!res.ok) throw new Error('failed to fetch tickets')
        return res.json()
      })
      .then((res) => {
        setTickets(res)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const visibleTickets =
    statusFilter === 'all'
      ? tickets
      : tickets.filter((t) => t.status === statusFilter)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-4">
        <Link to="/new" className="inline-block bg-gray-900 text-white text-sm px-4 py-2 rounded-lg">
          + New Ticket
        </Link>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700"
        >
          {STATUS_FILTERS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading tickets...</p>}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
          Couldn't load tickets — {error}
        </p>
      )}

      {!loading && !error && visibleTickets.length === 0 && (
        <p className="text-sm text-gray-500">
          {statusFilter === 'all' ? 'No tickets yet.' : 'No tickets with this status.'}
        </p>
      )}

      {!loading && !error && visibleTickets.length > 0 && (
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase">
              <th className="px-4 font-medium">Subject</th>
              <th className="px-4 font-medium">Customer</th>
              <th className="px-4 font-medium">Category</th>
              <th className="px-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleTickets.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default TicketList