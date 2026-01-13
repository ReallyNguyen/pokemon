import logo from './logo.svg';
import './App.css';
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react'
import axios from 'axios';
import MultipleApiCalls from './pages/Mul';


function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon/ditto');
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <h3>Loading data...</h3>;
  if (!data) return <h3>No data found</h3>;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>{data.name.toUpperCase()}</h1>
        <p>Height: {data.height}</p>
        <p>Base Experience: {data.base_experience}</p>

        <h3>Abilities:</h3>
        <ul>
          {data.abilities.map((abilityObj, index) => (
            <li key={index}>{abilityObj.ability.name}</li>
          ))}
        </ul>
        <MultipleApiCalls />
      </header>
    </div>
  );
}


export default App;
