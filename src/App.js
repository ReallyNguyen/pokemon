import { useState } from "react";
import Pokemon from "./service/pokeapi";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [moveList, setMoveList] = useState([]);
  const [move, setMove] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const limit = 5; // grab 5 moves now

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
      setMove(null); // clear move details when new Pokémon is fetched
    } catch (err) {
      setError("Pokémon not found");
      setData(null);
      setMoveList([]);
      setMove(null);
    } finally {
      setLoading(false);
    }
  }

  const fetchMoveDetails = async (url) => {
    try {
      const res = await axios.get(url);
      setMove(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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

          <img src={data.sprites.front_default} alt={data.name} />

          <h3>Abilities</h3>
          <ul>
            {data.abilities.map((a, index) => (
              <li key={index}>{a.ability.name}</li>
            ))}
          </ul>

          <h3>Moves:</h3>
          <ul>
            {moveList.map((m, index) => (
              <li key={index}>
                <button onClick={() => fetchMoveDetails(m.move.url)}>
                  {m.move.name}
                </button>
              </li>
            ))}
          </ul>

          {/* Selected Move Details */}
          {move && (
            <div className="mt-4">
              <h3>Move Details</h3>
              <p>
                <strong>Name:</strong> {move.name}
              </p>
              <p>
                <strong>Power:</strong> {move.power ?? "N/A"}
              </p>
              <p>
                <strong>Accuracy:</strong> {move.accuracy ?? "N/A"}
              </p>
              <p>
                <strong>Type:</strong> {move.type.name}
              </p>
              <button onClick={() => setMove(null)}>Close</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
