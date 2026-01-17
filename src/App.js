import logo from './logo.svg';
import './App.css';
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react'
import axios from 'axios';
import MultipleApiCalls from './pages/Mul';
import Pokemon from './service/pokeapi';

function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null)

  useEffect(() => {
    const data = async () => {
      try {
        const result = await Pokemon('ditto');
        setData(result)
        console.log(result)
      }
      catch (err) {
        setError(err)
      } finally {
        setIsLoading(false)
      }

    }
    data();
  }, [])

  if (isLoading) return <h3>Loading data...</h3>;
  if (!data) return <h3>No data found</h3>;


  return (
    <div className="App">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}


export default App;
