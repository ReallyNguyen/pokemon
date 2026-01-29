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

  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 = Player 1, 2 = Player 2
  const [player1Data, setPlayer1Data] = useState(null);
  const [player2Data, setPlayer2Data] = useState(null);
  const [winner, setWinner] = useState(null); // new state to store winner

  const limit = 5;

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
      setMove(null);
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

  const confirmChoice = () => {
    if (!data || !move) return;

    const choice = { pokemon: data, move };
    if (currentPlayer === 1) {
      setPlayer1Data(choice);
      setCurrentPlayer(2);
      // Clear input for Player 2
      setQuery("");
      setData(null);
      setMoveList([]);
      setMove(null);
    } else if (currentPlayer === 2) {
      setPlayer2Data(choice);
      setCurrentPlayer(null); // both players done

      // Calculate winner based on move power
      const power1 = player1Data.move.power || 0;
      const power2 = choice.move.power || 0;

      if (power1 > power2) setWinner("Player 1 Wins!");
      else if (power2 > power1) setWinner("Player 2 Wins!");
      else setWinner("It's a Tie!");
    }
  };

  const resetGame = () => {
    setCurrentPlayer(1);
    setPlayer1Data(null);
    setPlayer2Data(null);
    setWinner(null);
    setQuery("");
    setData(null);
    setMoveList([]);
    setMove(null);
    setError(null);
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Two-Player Pokémon Battle</h1>

      {currentPlayer && <p className="mb-2 font-semibold">Player {currentPlayer}'s Turn</p>}
      {!currentPlayer && <p className="mb-2 font-semibold">Battle Finished!</p>}

      {currentPlayer && (
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Pokémon name"
            className="border px-2 py-1 rounded mr-2"
          />
          <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Search</button>
        </form>
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {data && currentPlayer && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <img src={data.sprites.front_default} alt={data.name} className="mx-auto w-40" />
          <h2 className="capitalize font-bold">{data.name}</h2>
          <p>Height: {data.height}</p>

          <h3 className="font-semibold mt-2">Moves</h3>
          <ul className="space-y-1">
            {moveList.map((m, index) => (
              <li key={index}>
                <button
                  onClick={() => fetchMoveDetails(m.move.url)}
                  className="w-full bg-gray-200 py-1 rounded hover:bg-gray-300"
                >
                  {m.move.name}
                </button>
              </li>
            ))}
          </ul>

          {move && (
            <div className="mt-2 bg-gray-50 p-2 rounded">
              <p><strong>Name:</strong> {move.name}</p>
              <p><strong>Power:</strong> {move.power ?? "N/A"}</p>
              <p><strong>Accuracy:</strong> {move.accuracy ?? "N/A"}</p>
              <p><strong>Type:</strong> {move.type.name}</p>
              <button
                onClick={confirmChoice}
                className="mt-2 bg-green-500 text-white px-2 py-1 rounded"
              >
                Confirm Choice
              </button>
            </div>
          )}
        </div>
      )}

      {!currentPlayer && player1Data && player2Data && (
        <div className="mt-4">
          <h2 className="font-bold mb-2">Results</h2>
          <div className="flex justify-around mb-2">
            <div>
              <h3>Player 1</h3>
              <p className="capitalize">{player1Data.pokemon.name}</p>
              <p>Move: {player1Data.move.name}</p>
              <p>Power: {player1Data.move.power ?? "N/A"}</p>
            </div>
            <div>
              <h3>Player 2</h3>
              <p className="capitalize">{player2Data.pokemon.name}</p>
              <p>Move: {player2Data.move.name}</p>
              <p>Power: {player2Data.move.power ?? "N/A"}</p>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">{winner}</h3>
          <button
            onClick={resetGame}
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
