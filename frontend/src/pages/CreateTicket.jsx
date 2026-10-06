import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateTicket() {
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('http://localhost:8000/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Failed to create ticket')
      const created = await res.json()
      navigate(`/admin/tickets/${created.id}`)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">New Ticket</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="customer_name"
          placeholder="Your name"
          value={formData.customer_name}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <textarea
          name="message"
          placeholder="Describe your issue..."
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-gray-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  )
}

export default CreateTicket