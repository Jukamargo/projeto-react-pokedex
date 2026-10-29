import { useState } from 'react';
import { FlatList, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigate } from 'react-router-native';
import PokemonCard from '../components/PokemonCard';
import { Button, Message } from '../components/UI';
import { useFavorites } from '../context/FavoritesContext';
import { useRequest } from '../hooks/useRequest';
import { getPokemonList } from '../services/pokeapi';
import { colors } from '../theme';

function loadList(onlyFavorites) {
  return onlyFavorites ? Promise.resolve([]) : getPokemonList();
}

export default function PokedexScreen({ onlyFavorites = false }) {
  const navigate = useNavigate();
  const { favorites, ready, toggleFavorite } = useFavorites();
  const { data, loading, error, retry } = useRequest(loadList, onlyFavorites);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const source = onlyFavorites ? favorites : (data || []);
  const term = search.trim().toLowerCase().replace(/^#/, '');
  const pokemon = source.filter((item) => item.name.includes(term) ||
    (term !== '' && Number(term) === item.id));

  function submitSearch() {
    setSearch(query);
    Keyboard.dismiss();
  }

  const header = (
    <View style={styles.header}>
      <View style={styles.eyebrowRow}>
        <Text style={styles.eyebrow}>REGIÃO DE KANTO</Text>
        <Text style={styles.pill}>{onlyFavorites ? `${favorites.length} salvos` : '151 Pokémon'}</Text>
      </View>
      <Text accessibilityRole="header" style={styles.title}>{onlyFavorites ? 'Seus favoritos' : 'Vamos explorar?'}</Text>
      <Text style={styles.subtitle}>{onlyFavorites
        ? 'Uma coleção com os seus Pokémon preferidos.'
        : 'Conheça os Pokémon e monte sua coleção favorita.'}</Text>
      <View style={styles.searchRow}>
        <TextInput accessibilityLabel="Nome ou número do Pokémon" placeholder="Nome ou número..." placeholderTextColor={colors.muted}
          style={styles.input} value={query} onChangeText={setQuery} autoCapitalize="none"
          autoCorrect={false} returnKeyType="search" onSubmitEditing={submitSearch} />
        <Button title="Buscar" onPress={submitSearch} />
      </View>
      {search ? <Pressable accessibilityRole="button" onPress={() => { setSearch(''); setQuery(''); }} style={styles.clear}>
        <Text style={styles.clearText}>Limpar busca por “{search}” ×</Text>
      </Pressable> : null}
      <View style={styles.resultsRow}>
        <Text style={styles.sectionTitle}>{onlyFavorites ? 'Minha coleção' : 'Todos os Pokémon'}</Text>
        <Text style={styles.count}>{pokemon.length} encontrados</Text>
      </View>
    </View>
  );

  let empty;
  if ((onlyFavorites && !ready) || (!onlyFavorites && loading)) {
    empty = <Message loading title={onlyFavorites ? 'Abrindo sua coleção...' : 'Buscando Pokémon...'} />;
  } else if (!onlyFavorites && error) {
    empty = <Message title="Ops, a busca falhou" description={error} action={retry} />;
  } else if (search) {
    empty = <Message title="Nenhum Pokémon encontrado" description="Tente outro nome ou um número de 1 a 151." />;
  } else {
    empty = <Message title="Sua coleção começa aqui" description="Toque na estrela de um Pokémon para salvá-lo aqui."
      actionTitle="Explorar Pokédex" action={() => navigate('/')} />;
  }

  return (
    <FlatList data={pokemon} keyExtractor={(item) => String(item.id)} numColumns={2}
      contentContainerStyle={styles.list} columnWrapperStyle={styles.columns}
      keyboardShouldPersistTaps="handled" ListHeaderComponent={header} ListEmptyComponent={empty}
      initialNumToRender={12} windowSize={7}
      renderItem={({ item, index }) => (
        <View style={[styles.cell, index === pokemon.length - 1 && pokemon.length % 2 === 1 && { maxWidth: '48%' }]}>
          <PokemonCard pokemon={item} ready={ready} favorite={favorites.some((entry) => entry.id === item.id)}
            onOpen={() => navigate(`/pokemon/${item.id}`)} onToggle={() => toggleFavorite(item)} />
        </View>
      )} />
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 20, paddingBottom: 24, flexGrow: 1 },
  header: { paddingTop: 26 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.7, color: colors.red },
  pill: { fontSize: 11, color: colors.muted, backgroundColor: '#EAF0F4', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  title: { fontSize: 31, fontWeight: '800', color: colors.ink, marginTop: 16, letterSpacing: -0.8 },
  subtitle: { fontSize: 14, color: colors.muted, lineHeight: 22, marginTop: 8, maxWidth: 330 },
  searchRow: { flexDirection: 'row', gap: 10, marginTop: 24 },
  input: { flex: 1, minWidth: 0, borderWidth: 1, borderColor: colors.line, borderRadius: 14, backgroundColor: 'white', paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: colors.ink },
  clear: { paddingVertical: 12, minHeight: 44, justifyContent: 'center' },
  clearText: { color: colors.red, fontSize: 13 },
  resultsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 26, marginBottom: 16, gap: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.ink },
  count: { fontSize: 12, color: colors.muted },
  columns: { gap: 14 },
  cell: { flex: 1 },
});

