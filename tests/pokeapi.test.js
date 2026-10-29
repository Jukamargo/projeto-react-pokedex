import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { artworkUrl, getPokemon, getPokemonList } from '../src/services/pokeapi.js';

const originalFetch = globalThis.fetch;
after(() => { globalThis.fetch = originalFetch; });

function response(id) {
  return {
    ok: true,
    json: async () => ({
      id, name: 'bulbasaur', height: 7, weight: 69,
      sprites: { other: { 'official-artwork': { front_default: null } } },
      types: [{ type: { name: 'grass' } }],
      abilities: [{ ability: { name: 'solar-power' } }],
      stats: [{ stat: { name: 'hp' }, base_stat: 45 }],
    }),
  };
}

test('a listagem usa os IDs da API e é reutilizada do cache', async () => {
  let calls = 0;
  globalThis.fetch = async (url) => {
    calls++;
    assert.match(url, /pokemon\?limit=151&offset=0$/);
    return { ok: true, json: async () => ({ results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }] }) };
  };
  const list = await getPokemonList();
  assert.deepEqual(list, [{ id: 1, name: 'bulbasaur', image: artworkUrl(1) }]);
  await getPokemonList();
  assert.equal(calls, 1);
});

test('detalhes convertem medidas e usam imagem alternativa', async () => {
  globalThis.fetch = async () => response(1);
  const pokemon = await getPokemon('001');
  assert.equal(pokemon.height, 0.7);
  assert.equal(pokemon.weight, 6.9);
  assert.equal(pokemon.image, artworkUrl(1));
  assert.deepEqual(pokemon.types, ['grass']);
  assert.deepEqual(pokemon.abilities, ['solar power']);
  assert.deepEqual(pokemon.stats, [{ name: 'hp', value: 45 }]);
});

test('IDs inválidos são rejeitados antes de acessar a rede', async () => {
  globalThis.fetch = async () => { throw new Error('A rede não deve ser acessada'); };
  for (const id of ['abc', '1/2', 0, 152, -1, '']) {
    await assert.rejects(getPokemon(id), /entre 1 e 151/);
  }
});

test('falhas HTTP não ficam em cache e permitem tentar novamente', async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return calls === 1 ? { ok: false, status: 503 } : response(2);
  };
  await assert.rejects(getPokemon(2), /indisponível/);
  assert.equal((await getPokemon(2)).id, 2);
  assert.equal(calls, 2);
});

test('consultas simultâneas ao mesmo Pokémon compartilham uma requisição', async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; return response(25); };
  const [first, second] = await Promise.all([getPokemon(25), getPokemon(25)]);
  assert.equal(first.id, second.id);
  assert.equal(calls, 1);
});

test('falhas de conexão produzem mensagem em português', async () => {
  globalThis.fetch = async () => { throw new TypeError('Failed to fetch'); };
  await assert.rejects(getPokemon(3), /Verifique sua internet/);
});
