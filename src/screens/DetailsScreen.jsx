import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigate, useParams } from 'react-router-native';
import { Button, Message, PokemonImage } from '../components/UI';
import { useFavorites } from '../context/FavoritesContext';
import { useRequest } from '../hooks/useRequest';
import { getPokemon } from '../services/pokeapi';
import { colors, formatId, titleCase, typeColors, typeLabels } from '../theme';

const statLabels = { hp: 'HP', attack: 'Ataque', defense: 'Defesa', 'special-attack': 'Atq. especial', 'special-defense': 'Def. especial', speed: 'Velocidade' };

export default function DetailsScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: pokemon, loading, error, retry } = useRequest(getPokemon, id);
  const { favorites, ready, toggleFavorite, saveNote } = useFavorites();
  const favorite = favorites.find((entry) => entry.id === Number(id));
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { setNote(favorite?.note || ''); }, [id, favorite?.note]);
  useEffect(() => { setSaved(false); }, [id]);

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Pressable accessibilityRole="button" onPress={() => navigate(-1)} style={styles.back}>
        <Text style={styles.backText}>← Voltar</Text>
      </Pressable>
      {loading ? <Message loading title="Abrindo a ficha..." /> : error ? (
        <Message title="Não foi possível abrir" description={error} action={retry} />
      ) : pokemon ? (
        <>
          <View style={[styles.hero, { backgroundColor: typeColors[pokemon.types[0]] || '#EDF0F4' }]}>
            <Text style={styles.id}>{formatId(pokemon.id)} · KANTO</Text>
            <Text accessibilityRole="header" style={styles.name}>{titleCase(pokemon.name)}</Text>
            <View style={styles.types}>{pokemon.types.map((type) => (
              <Text key={type} style={styles.type}>{typeLabels[type] || type}</Text>
            ))}</View>
            <PokemonImage key={pokemon.id} uri={pokemon.image} size={210} />
          </View>
          <Button disabled={!ready} title={favorite ? '★ Remover dos favoritos' : '☆ Adicionar aos favoritos'}
            onPress={() => { setSaved(false); toggleFavorite(pokemon); }} secondary={Boolean(favorite)} />
          <View style={styles.measurements}>
            <View style={styles.measure}><Text style={styles.measureValue}>{pokemon.height.toLocaleString('pt-BR')} m</Text><Text style={styles.label}>Altura</Text></View>
            <View style={styles.measure}><Text style={styles.measureValue}>{pokemon.weight.toLocaleString('pt-BR')} kg</Text><Text style={styles.label}>Peso</Text></View>
          </View>
          <Text style={styles.heading}>Habilidades</Text>
          <Text style={styles.ability}>{pokemon.abilities.map(titleCase).join(' · ')}</Text>
          <Text style={styles.heading}>Estatísticas base</Text>
          <View style={styles.panel}>{pokemon.stats.map((stat) => (
            <View key={stat.name} style={styles.stat}>
              <Text style={styles.statLabel}>{statLabels[stat.name] || stat.name}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <View accessibilityLabel={`${statLabels[stat.name]}: ${stat.value} de 255`} style={styles.track}>
                <View style={[styles.bar, { width: `${Math.min(stat.value / 255 * 100, 100)}%` }]} />
              </View>
            </View>
          ))}</View>
          <Text style={styles.heading}>Minha anotação</Text>
          <Text style={styles.help}>Ao salvar uma anotação, o Pokémon entra nos seus favoritos.</Text>
          <TextInput accessibilityLabel="Anotação sobre o Pokémon" style={styles.note} multiline maxLength={240}
            placeholder="Por que você gosta deste Pokémon?" placeholderTextColor={colors.muted} value={note}
            onChangeText={(value) => { setNote(value); setSaved(false); }} textAlignVertical="top" />
          <Text style={styles.counter}>{note.length}/240</Text>
          <Button disabled={!ready} title="Salvar anotação" onPress={() => { saveNote(pokemon, note); setSaved(true); }} />
          {saved ? <Text accessibilityLiveRegion="polite" style={styles.success}>Anotação atualizada nos favoritos.</Text> : null}
          <Text style={styles.credit}>Dados: PokéAPI · Projeto de estudo</Text>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 36 },
  back: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start', paddingRight: 20, marginBottom: 10 },
  backText: { color: colors.ink, fontSize: 15, fontWeight: '600' },
  hero: { borderRadius: 26, alignItems: 'center', padding: 20, marginBottom: 18 },
  id: { color: colors.muted, fontSize: 12, letterSpacing: 2, fontWeight: '700' },
  name: { fontSize: 32, fontWeight: '800', color: colors.ink, marginVertical: 8 },
  types: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  type: { backgroundColor: '#FFFFFFB3', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 15, fontSize: 13, color: colors.ink },
  measurements: { flexDirection: 'row', gap: 12, marginTop: 22 },
  measure: { flex: 1, alignItems: 'center', padding: 18, backgroundColor: 'white', borderRadius: 18, gap: 6 },
  measureValue: { fontWeight: '700', fontSize: 22, color: colors.ink },
  label: { fontSize: 13, color: colors.muted },
  heading: { fontSize: 19, fontWeight: '700', color: colors.ink, marginTop: 26, marginBottom: 12 },
  ability: { fontSize: 15, color: colors.muted, lineHeight: 24 },
  panel: { borderRadius: 18, backgroundColor: 'white', padding: 16, gap: 16 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statLabel: { width: 88, color: colors.muted, fontSize: 12 },
  statValue: { width: 28, textAlign: 'right', fontWeight: '700', fontSize: 13, color: colors.ink },
  track: { flex: 1, height: 7, borderRadius: 6, backgroundColor: '#F0F2F5', overflow: 'hidden' },
  bar: { height: '100%', backgroundColor: colors.red, borderRadius: 6 },
  help: { fontSize: 13, color: colors.muted, lineHeight: 21, marginBottom: 12 },
  note: { minHeight: 115, backgroundColor: 'white', borderWidth: 1, borderColor: colors.line, borderRadius: 14, padding: 15, fontSize: 15, color: colors.ink },
  counter: { textAlign: 'right', color: colors.muted, fontSize: 12, marginVertical: 8 },
  success: { color: '#287247', textAlign: 'center', marginTop: 12, fontSize: 13 },
  credit: { color: colors.muted, fontSize: 11, textAlign: 'center', marginTop: 30 },
});

