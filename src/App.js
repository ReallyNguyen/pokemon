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

  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [player1Data, setPlayer1Data] = useState(null);
  const [player2Data, setPlayer2Data] = useState(null);
  const [winner, setWinner] = useState(null);

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
    } catch {
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
      setQuery("");
      setData(null);
      setMoveList([]);
      setMove(null);
    } else {
      setPlayer2Data(choice);
      setCurrentPlayer(null);

      const power1 = player1Data.move.power || 0;
      const power2 = choice.move.power || 0;

      if (power1 > power2) setWinner("🏆 Player 1 Wins!");
      else if (power2 > power1) setWinner("🏆 Player 2 Wins!");
      else setWinner("🤝 It's a Tie!");
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4">
      <div className="max-w-md mx-auto text-center bg-white p-6 rounded-2xl shadow-xl">

        <h1 className="text-3xl font-bold mb-4">⚔️ Pokémon Battle</h1>

        {/* Turn Banner */}
        <div className="mb-4 p-3 rounded-lg bg-indigo-100 shadow">
          {currentPlayer ? (
            <p className="font-bold text-indigo-700 text-lg">
              🎮 Player {currentPlayer}'s Turn
            </p>
          ) : (
            <p className="font-bold text-green-700 text-lg">
              🏁 Battle Finished!
            </p>
          )}
        </div>

        {/* Search */}
        {currentPlayer && (
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Pokémon name"
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition"
            >
              Search
            </button>
          </form>
        )}

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Pokémon Card */}
        {data && currentPlayer && (
          <>
            <div className="bg-gray-50 p-4 rounded-xl shadow mb-4">
              <img
                src={data.sprites.front_default}
                alt={data.name}
                className="mx-auto w-36"
              />
              <h2 className="capitalize font-bold text-xl">{data.name}</h2>
              <p className="text-sm text-gray-500">Height: {data.height}</p>
            </div>

            {/* Moves */}
            <h3 className="font-semibold mb-2">Choose a Move</h3>
            <div className="grid grid-cols-2 gap-2">
              {moveList.map((m, index) => (
                <button
                  key={index}
                  onClick={() => fetchMoveDetails(m.move.url)}
                  className={`py-2 rounded-lg capitalize text-sm transition
                    ${move?.name === m.move.name
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                  {m.move.name}
                </button>
              ))}
            </div>

            {/* Move Details */}
            {move && (
              <div className="mt-4 p-3 rounded-lg bg-indigo-50 shadow-inner">
                <p><strong>Move:</strong> {move.name}</p>
                <p><strong>Power:</strong> {move.power ?? "N/A"}</p>
                <p><strong>Accuracy:</strong> {move.accuracy ?? "N/A"}</p>
                <p><strong>Type:</strong> {move.type.name}</p>

                <button
                  onClick={confirmChoice}
                  className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                >
                  ✅ Confirm Choice
                </button>
              </div>
            )}
          </>
        )}

        {/* Results */}
        {!currentPlayer && player1Data && player2Data && (
          <div className="mt-6 p-4 rounded-xl bg-gray-50 shadow">
            <h2 className="text-2xl font-bold mb-4">⚔️ Battle Results</h2>

            <div className="grid grid-cols-2 gap-4">
              {[player1Data, player2Data].map((player, i) => (
                <div key={i} className="p-3 bg-white rounded-lg shadow">
                  <h3 className="font-bold mb-1">Player {i + 1}</h3>
                  <p className="capitalize">{player.pokemon.name}</p>
                  <p className="text-sm">Move: {player.move.name}</p>
                  <p className="text-sm">Power: {player.move.power ?? "N/A"}</p>
                </div>
              ))}
            </div>

            <p className="text-xl font-bold mt-4 text-indigo-600">{winner}</p>

            <button
              onClick={resetGame}
              className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg"
            >
              🔄 Play Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
