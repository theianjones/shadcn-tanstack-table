import {use, useState} from 'react'

type PokemonType = {
  name: string
  url: string
}

export type Pokemon = {
  name: string
  url: string
  image: string
  height: number
  weight: number
  types: string[]
}

type PokemonResponse = {
  count: number
  next: string | null
  previous: string | null
  results: Pokemon[]
}


const apiUrl = "https://pokeapi.co/api/v2/pokemon"

const fetchPokemon = (offset: number) => fetch(`${apiUrl}?limit=30&offset=${offset}`).then(res => res.json()).then(
	async (data) => {
		const pokemon = await Promise.all(data.results.map(async (pokemon: PokemonType) => {
			const response = await fetch(pokemon.url)
			const data = await response.json()
			return {
				...pokemon,
				image: data.sprites.front_default,
				height: data.height,
				weight: data.weight,
				types: data.types.map((type: { type: { name: string } }) => type.type.name)
			}
		}))
		
		return {
			...data,
			results: pokemon
		}
	}
) as Promise<PokemonResponse>

const pokemonPromise = fetchPokemon(0)

export const usePokemon = () => {
	const [promise, setPromise] = useState(pokemonPromise)
	const data = use(promise)

	return [data, (page: number) => setPromise(fetchPokemon(page * 30))] as const
}