import React, { useState, useEffect } from 'react';
import axios from 'axios';


const MultipleApiCalls = () => {
    const [pikachu, setPikachu] = useState(null);
    const [charizard, setCharizard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Array of shuffled Pikachu moves (list)
    const [pikaMoves, setPikaMoves] = useState([]);

    const [charMoves, setCharMoves] = useState([]);

    // Single selected move details (object)
    const [pikaMove, setPikaMove] = useState(null);
    const [charMove, setCharMove] = useState(null);

    const limit = 4;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [pikachuRes, charRes] = await Promise.all([
                    axios.get('https://pokeapi.co/api/v2/pokemon/pikachu'),
                    axios.get('https://pokeapi.co/api/v2/pokemon/charizard'),
                ]);

                setPikachu(pikachuRes.data);
                setCharizard(charRes.data);

                // Shuffle ONCE and store in state
                const pikaShuffledMoves =
                    [...pikachuRes.data.moves]
                        .sort(() => Math.random() - 0.5)
                        .slice(0, limit)

                setPikaMoves(pikaShuffledMoves);

                const charShuffledMoves =
                    [...charRes.data.moves]
                        .sort(() => Math.random() - 0.5)
                        .slice(0, limit)

                setCharMoves(charShuffledMoves);

                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchData();

    }, []);

    // Fetch move details using move URL
    const fetchMoveDetails = async (url, setMove) => {
        try {
            const res = await axios.get(url);
            setMove(res.data);
        } catch (err) {
            console.error(err);
        }
    };



    if (loading) return <p>Loading data...</p>;
    if (error) return <p>Error: {error.message}</p>;

    console.log(charizard)
    return (
        <div className="flex flex-row">
            {/* Pikachu */}

            <div className="flex flex-col m-9">
                <img className='w-full h-full' src={pikachu.sprites.front_default} alt='pikachu' />
                <h1>{pikachu.name.toUpperCase()}</h1>
                <p>Height: {pikachu.height}</p>
                <p>Base Experience: {pikachu.base_experience}</p>

                <h3>Abilities:</h3>
                <ul>
                    {pikachu.abilities.map((a, index) => (
                        <li key={index}>{a.ability.name}</li>
                    ))}
                </ul>

                <h3>Moves:</h3>
                <ul>
                    {pikaMoves.map((m, index) => (
                        <li key={index}>
                            <button onClick={() => fetchMoveDetails(m.move.url, setPikaMove)}>
                                {m.move.name}
                            </button>

                        </li>
                    ))}
                </ul>

                {/* Selected Move Details */}
                {pikaMove && (
                    <div className="mt-4">
                        <h3>Move Details</h3>
                        <p><strong>Name:</strong> {pikaMove.name}</p>
                        <p><strong>Power:</strong> {pikaMove.power ?? 'N/A'}</p>
                        <p><strong>Accuracy:</strong> {pikaMove.accuracy ?? 'N/A'}</p>
                        <p><strong>Type:</strong> {pikaMove.type.name}</p>
                    </div>
                )}
            </div>

            <hr />

            {/* Charizard */}
            <div className="flex flex-col m-9">
                <img className='w-full h-full' src={charizard.sprites.front_default} alt='charizard' />
                <h1>{charizard.name.toUpperCase()}</h1>
                <p>Height: {charizard.height}</p>
                <p>Base Experience: {charizard.base_experience}</p>

                <h3>Abilities:</h3>
                <ul>
                    {charizard.abilities.map((a, index) => (
                        <li key={index}>{a.ability.name}</li>
                    ))}
                </ul>

                <h3>Moves:</h3>
                <ul>
                    {charMoves.map((m, index) => (
                        <li key={index}>
                            <button onClick={() => fetchMoveDetails(m.move.url, setCharMove)}>
                                {m.move.name}
                            </button>

                        </li>
                    ))}
                </ul>

                {/* Selected Move Details */}
                {charMove && (
                    <div className="mt-4">
                        <h3>Move Details</h3>
                        <p><strong>Name:</strong> {charMove.name}</p>
                        <p><strong>Power:</strong> {charMove.power ?? 'N/A'}</p>
                        <p><strong>Accuracy:</strong> {charMove.accuracy ?? 'N/A'}</p>
                        <p><strong>Type:</strong> {charMove.type.name}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultipleApiCalls;
