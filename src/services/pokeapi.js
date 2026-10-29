const BASE_URL = 'https://pokeapi.co/api/v2';
const cache = new Map();
const pending = new Map();

// Reutiliza respostas e requisições em andamento, evitando chamadas repetidas.
async function request(path) {
  if (cache.has(path)) return cache.get(path);
  if (pending.has(path)) return pending.get(path);

  const promise = (async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(`${BASE_URL}${path}`, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(response.status === 404
          ? 'Pokémon não encontrado.'
          : 'A PokéAPI está indisponível. Tente novamente.');
      }
      const data = await response.json();
      cache.set(path, data);
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('A consulta demorou demais. Tente novamente.');
      }
      throw new Error(error instanceof TypeError
        ? 'Não foi possível conectar. Verifique sua internet.' : error.message);
    } finally {
      clearTimeout(timeout);
      pending.delete(path);
    }
  })();

  pending.set(path, promise);
  return promise;
}

export function artworkUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export async function getPokemonList() {
  const data = await request('/pokemon?limit=151&offset=0');
  return data.results.map((pokemon) => {
    const id = Number(pokemon.url.split('/').filter(Boolean).pop());
    return { id, name: pokemon.name, image: artworkUrl(id) };
  });
}

export async function getPokemon(id) {
  if (!/^\d+$/.test(String(id)) || Number(id) < 1 || Number(id) > 151) {
    throw new Error('Escolha um Pokémon de Kanto, entre 1 e 151.');
  }
  const data = await request(`/pokemon/${Number(id)}`);
  return {
    id: data.id,
    name: data.name,
    image: data.sprites.other?.['official-artwork']?.front_default || artworkUrl(data.id),
    types: data.types.map((item) => item.type.name),
    height: data.height / 10,
    weight: data.weight / 10,
    abilities: data.abilities.map((item) => item.ability.name.replaceAll('-', ' ')),
    stats: data.stats.map((item) => ({ name: item.stat.name, value: item.base_stat })),
  };
}

