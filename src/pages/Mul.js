import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MultipleApiCalls = () => {
    const [pikachu, setPikachu] = useState(null);
    const [ditto, setDitto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const shuffleArray = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
    };


    const limit = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const pikachuRequest = axios.get(
                    'https://pokeapi.co/api/v2/pokemon/pikachu'
                );
                const dittoRequest = axios.get(
                    'https://pokeapi.co/api/v2/pokemon/ditto'
                );

                const [pikachuRes, dittoRes] = await Promise.all([
                    pikachuRequest,
                    dittoRequest,
                ]);

                setPikachu(pikachuRes.data);
                setDitto(dittoRes.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading data...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className='flex flex-row'>
            <div className='flex flex-col m-9'>
                {/* Pikachu */}
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
                    {shuffleArray(pikachu.moves)
                        .slice(0, limit)
                        .map((m, index) => (
                            <li key={index}>
                                <button>
                                    {m.move.name}
                                </button>

                            </li>
                        ))}
                </ul>

            </div>


            <hr />
            <div className='flex flex-col m-9'>
                {/* Ditto */}
                <h1>{ditto.name.toUpperCase()}</h1>
                <p>Height: {ditto.height}</p>
                <p>Base Experience: {ditto.base_experience}</p>

                <h3>Abilities:</h3>
                <ul>
                    {ditto.abilities.map((a, index) => (
                        <li key={index}>{a.ability.name}</li>
                    ))}
                </ul>
            </div>

        </div>
    );
};

export default MultipleApiCalls;
