import { useState, useEffect } from "react";
import Pokemon from "./service/pokeapi";

function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [moveList, setMoveList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const limit = 4;

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    fetchPokemon(query.toLowerCase());
  }

  async function fetchPokemon(name) {
    try {
      setLoading(true);
      setError(null);

      const result = await Pokemon(name);
      setData(result);

      const moves = [...result.moves]
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);

      setMoveList(moves);
    } catch (err) {
      setError("Pokémon not found");
      setData(null);
      setMoveList([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>React Pokémon Search</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter Pokémon name"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {data && (
        <div>
          <h2>{data.name}</h2>
          <p>Height: {data.height}</p>

          <img
            src={data.sprites.front_default}
            alt={data.name}
          />

          <h3>Abilities</h3>
          <ul>
            {data.abilities.map((a, index) => (
              <li key={index}>{a.ability.name}</li>
            ))}
          </ul>

          <h3>Random Moves</h3>
          <ul>
            {moveList.map((m, index) => (
              <li key={index}>{m.move.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
