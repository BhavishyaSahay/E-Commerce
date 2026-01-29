import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/')
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setMessage('Error connecting to backend');
      });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          E-Commerce App
        </h1>
        <p className="text-gray-600">
          Backend says: <span className="font-semibold text-green-600">{message || 'Loading...'}</span>
        </p>
      </div>
    </div>
  )
}

export default App
