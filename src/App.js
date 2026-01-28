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
        <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-xl p-6 text-center">
          <img
            src={data.sprites.front_default}
            alt={data.name}
            className="w-36 mx-auto"
          />

          <h2 className="text-2xl font-bold capitalize">{data.name}</h2>
          <p className="text-gray-500 mb-4">Height: {data.height}</p>

          <h3 className="font-semibold">Abilities</h3>
          <ul className="mb-4">
            {data.abilities.map((a, index) => (
              <li key={index} className="capitalize">
                {a.ability.name}
              </li>
            ))}
          </ul>

          <h3 className="font-semibold">Moves</h3>
          <ul className="space-y-2">
            {moveList.map((m, index) => (
              <li key={index}>
                <button
                  onClick={() => fetchMoveDetails(m.move.url)}
                  className="w-full bg-gray-100 rounded-lg py-1 hover:bg-gray-200"
                >
                  {m.move.name}
                </button>
              </li>
            ))}
          </ul>

          {move && (
            <div className="mt-4 bg-gray-50 p-4 rounded-xl">
              <h3 className="font-bold mb-2">Move Details</h3>
              <p><strong>Name:</strong> {move.name}</p>
              <p><strong>Power:</strong> {move.power ?? "N/A"}</p>
              <p><strong>Accuracy:</strong> {move.accuracy ?? "N/A"}</p>
              <p><strong>Type:</strong> {move.type.name}</p>
              <button
                onClick={() => setMove(null)}
                className="mt-2 text-sm text-red-500"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default App;
