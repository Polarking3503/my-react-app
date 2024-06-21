import React, { useState, useEffect } from "react";
import axios from "axios";
import { REACT_APP_POKEMON_API_URL } from "./config/constants";

const typeColors = {
  grass: "bg-green-400",
  fire: "bg-red-400",
  water: "bg-blue-400",
  bug: "bg-green-600",
  normal: "bg-gray-400",
  poison: "bg-purple-400",
  electric: "bg-yellow-400",
  ground: "bg-yellow-700",
  fairy: "bg-pink-400",
  fighting: "bg-red-700",
  psychic: "bg-pink-600",
  rock: "bg-gray-600",
  ghost: "bg-purple-600",
  ice: "bg-blue-200",
  dragon: "bg-purple-700",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  flying: "bg-blue-200",
};

// Componente funcional PokemonList
const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]); // almacenar la lista de pokémons
  const [isLoading, setIsLoading] = useState(true); // estado para saber si se está cargando la lista de pokémons

  useEffect(() => {
    // hook de efecto para cargar la lista de pokémons
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(
          `${REACT_APP_POKEMON_API_URL}/pokemon?limit=151`
        ); // limitar a 151 pokémons
        const results = response.data.results;

        const detailedPokemonPromises = results.map(async (pokemon) => {
          // mapear los pokémons
          const pokemonDetails = await axios.get(pokemon.url); // obtener los detalles de cada pokémon
          const types = pokemonDetails.data.types.map(
            (typeInfo) => typeInfo.type.name
          );
          const abilities = pokemonDetails.data.abilities.map(
            (abilityInfo) => abilityInfo.ability.name
          );
          const stats = pokemonDetails.data.stats.map((statInfo) => ({
            name: statInfo.stat.name,
            base_stat: statInfo.base_stat,
          }));

          return {
            name: pokemon.name, // nombre del pokémon
            imageUrl: pokemonDetails.data.sprites.front_default, // imagen del pokémon
            types: types, // tipos del pokémon
            abilities: abilities, // habilidades del pokémon
            stats: stats, // estadísticas del pokémon
          };
        });

        const detailedPokemonList = await Promise.all(detailedPokemonPromises); // esperar a que se resuelvan todas las promesas
        setPokemonList(detailedPokemonList);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
        setIsLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Api Pokémon</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemonList.map((pokemon) => (
          <div
            key={pokemon.name}
            className={`bg-white rounded-lg shadow-md p-4 hover:bg-gray-100 transition ${
              typeColors[pokemon.types[0]] || "bg-gray-200"
            }`}
          >
            <img
              src={pokemon.imageUrl}
              alt={pokemon.name}
              className="w-full h-32 object-contain mb-4"
            />
            <h2 className="text-xl font-bold text-center">
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </h2>
            <div className="text-center mt-2">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              ))}
            </div>
            <div className="text-center mt-2">
              <h3 className="text-md font-semibold">Habilidades</h3>
              <ul className="list-none p-0">
                {pokemon.abilities.map((ability) => (
                  <li key={ability} className="text-sm">
                    {ability.charAt(0).toUpperCase() + ability.slice(1)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center mt-2">
              <h3 className="text-md font-semibold">Estadísticas</h3>
              <ul className="list-none p-0">
                {pokemon.stats.map((stat) => (
                  <li key={stat.name} className="text-sm">
                    {stat.name.charAt(0).toUpperCase() + stat.name.slice(1)}:{" "}
                    {stat.base_stat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonList;
