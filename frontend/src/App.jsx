import { useState,useEffect } from 'react'
import TicketList from './pages/TicketList'
import TicketDetail from './pages/TicketDetail'
import CreateTicket from './pages/CreateTicket'
import Layout from './components/Layout'
import { Routes, Route } from 'react-router-dom'

function App() {

 return(
  <>
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<CreateTicket />} />
        <Route path="new" element={<CreateTicket />} />
        <Route path="admin" element={<TicketList />} />
        <Route path="admin/tickets/:id" element={<TicketDetail />} />
      </Route>
    </Routes>
  </>
 )

  
}

export default App
