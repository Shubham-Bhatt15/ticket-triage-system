import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-900 rounded-md" />
          <span className="font-semibold text-gray-900 text-sm">Ticket Desk</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <Link to="/new" className="hover:text-gray-900">Submit a ticket</Link>
          <Link to="/admin" className="hover:text-gray-900">Admin</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar