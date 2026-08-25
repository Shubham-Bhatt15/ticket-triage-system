import {Link} from 'react-router-dom'


function TicketRow({ ticket }) {
  return (
    <tr className="bg-white shadow-sm rounded-lg">
      <td className="py-3 px-4 text-sm text-gray-800">
         <Link to={`/tickets/${ticket.id}`} className="hover:underline">
          {ticket.subject}
        </Link>
        </td>
      <td className="py-3 px-4 text-sm text-gray-500">{ticket.customer_name}</td>
      <td className="py-3 px-4">
        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-yellow-700">
          {ticket.status}
        </span> 
      </td>
    </tr>
  )
}

export default TicketRow