import axios from "axios";

const url = 'https://pokeapi.co/api/v2';

export const Pokemon = async (name) => {
    try {
        if (name) {
            const getPokemon = await axios.get(`${url}/pokemon/${name}`)
            return getPokemon.data
        }


    } catch (error) {
        console.error(`Error fetching Pokémon "${name}":`, error.message);
        throw new Error('Failed to fetch Pokémon. Please try again.');
    }
}

export default Pokemon;