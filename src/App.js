import { useState, useEffect } from "react";
import Pokemon from "./service/pokeapi";

function App() {
  const [save, setSave] = useState(null);
  const [data, setData] = useState(null);

  function search(formData) {
    const query = formData.get("query");
    setSave(query);
  }

  useEffect(() => {



    if (!save) return;

    async function fetchPokemon() {
      const result = await Pokemon(save);
      setData(result);
      console.log(result)
    }

    fetchPokemon();
  }, [save]);

  console.log(data)

  return (
    <div>
      <h1>React Search</h1>

      <form action={search}>
        <input name="query" />
        <button type="submit">Search</button>
      </form>


      <p>{data.name}</p>
      <p>{data.height}</p>
      <ul>
        {data.abilities.map((a, index) => (
          <li key={index}>{a.ability.name}</li>
        ))}
      </ul>



    </div>
  );
}

export default App;
