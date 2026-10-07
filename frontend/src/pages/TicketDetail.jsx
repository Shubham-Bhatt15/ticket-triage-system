import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const STATUS_OPTIONS = ['pending', 'in_progress', 'resolved']

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
}

const priorityColors = {
  Low: 'bg-gray-100 text-gray-700',
  Medium: 'bg-orange-100 text-orange-700',
  High: 'bg-red-100 text-red-700',
}

function TicketDetail() {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [updateError, setUpdateError] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/tickets/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Ticket not found')
        return res.json()
      })
      .then((data) => {
        setTicket(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  async function handleStatusChange(newStatus) {
    if (!ticket || newStatus === ticket.status || updating) return
    const previousStatus = ticket.status
    setUpdating(true)
    setUpdateError(null)
    setTicket((t) => ({ ...t, status: newStatus })) // optimistic update

    try {
      const res = await fetch(
        `${API_URL}/tickets/${id}?status=${encodeURIComponent(newStatus)}`,
        { method: 'PATCH' }
      )
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.detail || 'Failed to update status')
      }
    } catch (err) {
      setTicket((t) => ({ ...t, status: previousStatus })) // revert on failure
      setUpdateError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  function handleCopyReply() {
    if (ticket?.suggested_reply) {
      navigator.clipboard.writeText(ticket.suggested_reply)
    }
  }

  if (loading) return <p className="p-8">Loading...</p>
  if (error) return <p className="p-8 text-red-600">Error: {error}</p>

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-800">{ticket.subject}</h1>
      <p className="text-gray-500 mt-1">{ticket.customer_name} · {ticket.email}</p>
      <p className="mt-4 text-gray-700">{ticket.message}</p>

      <div className="mt-4 flex gap-2 flex-wrap">
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[ticket.status] || 'bg-gray-100 text-gray-700'}`}>
          {ticket.status}
        </span>
        {ticket.priority && (
          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[ticket.priority] || 'bg-gray-100 text-gray-700'}`}>
            {ticket.priority}
          </span>
        )}
        {ticket.category && (
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
            {ticket.category}
          </span>
        )}
        {ticket.sentiment && (
          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
            {ticket.sentiment}
          </span>
        )}
      </div>

      {ticket.suggested_reply && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">Suggested reply</p>
            <button
              onClick={handleCopyReply}
              className="text-xs text-blue-600 hover:underline"
            >
              Copy
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg p-3">
            {ticket.suggested_reply}
          </p>
        </div>
      )}

      <div className="mt-6">
        <p className="text-sm font-medium text-gray-600 mb-2">Update status</p>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              disabled={updating || status === ticket.status}
              onClick={() => handleStatusChange(status)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                status === ticket.status
                  ? 'border-gray-800 bg-gray-800 text-white'
                  : 'border-gray-300 text-gray-600 hover:border-gray-500'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
        {updateError && (
          <p className="text-xs text-red-600 mt-2">{updateError}</p>
        )}
      </div>
    </div>
  )
}

export default TicketDetail