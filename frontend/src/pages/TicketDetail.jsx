import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

function TicketDetail() {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:8000/tickets/${id}`)
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

  if (loading) return <p className="p-8">Loading...</p>
  if (error) return <p className="p-8 text-red-600">Error: {error}</p>

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-800">{ticket.subject}</h1>
      <p className="text-gray-500 mt-1">{ticket.customer_name} · {ticket.email}</p>
      <p className="mt-4 text-gray-700">{ticket.message}</p>
      <div className="mt-4 flex gap-2">
        <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">{ticket.status}</span>
        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">{ticket.priority}</span>
        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">{ticket.category}</span>
      </div>
    </div>
  )
}

export default TicketDetail;