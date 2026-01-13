import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MultipleApiCalls = () => {
    const [pikachu, setPikachu] = useState(null);
    const [ditto, setDitto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        <div>
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

            <hr />

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
    );
};

export default MultipleApiCalls;
