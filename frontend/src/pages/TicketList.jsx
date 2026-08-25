import {useState,useEffect} from 'react';
import TicketRow from '../components/TicketRow'
import {Link} from 'react-router-dom'
function TicketList(){
    const[tickets,setTickets] = useState([]);
    const[loading,setLoading] = useState(true);
    const[error,setError] = useState(null);

    useEffect(()=>{
        fetch('http://localhost:8000/tickets')
            .then((res)=>{
                if(!res.ok) throw new Error('failed to fetch tickets')
                return res.json()
            })
            .then((res)=>{
                setTickets(res);
                setLoading(false);
            })
            .catch((err)=>{
                setError(err.message);
                setLoading(false);
            })
    },[])

    return (
      
     <div className="min-h-screen bg-gray-50 p-8">
      <Link to="/new" className="inline-block bg-gray-900 text-white text-sm px-4 py-2 rounded-lg mb-4">
        + New Ticket
      </Link>
      <table className="w-full border-separate border-spacing-y-2">
        <tbody>
          {tickets.map((fakeTicket)=>(
            <TicketRow key={fakeTicket.id} ticket={fakeTicket} />
          ))}
        
        </tbody>
      </table>
    </div>
  )

};

export default TicketList;