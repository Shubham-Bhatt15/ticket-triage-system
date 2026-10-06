import { Link } from 'react-router-dom'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
}

function TicketRow({ ticket }) {
  return (
    <tr className="bg-white shadow-sm rounded-lg">
      <td className="py-3 px-4 text-sm text-gray-800">
        <Link to={`/admin/tickets/${ticket.id}`} className="hover:underline">
          {ticket.subject}
        </Link>
      </td>
      <td className="py-3 px-4 text-sm text-gray-500">{ticket.customer_name}</td>
      <td className="py-3 px-4 text-sm text-gray-500">{ticket.category || '—'}</td>
      <td className="py-3 px-4">
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[ticket.status] || 'bg-gray-100 text-gray-700'}`}>
          {ticket.status}
        </span>
      </td>
    </tr>
  )
}

export default TicketRow