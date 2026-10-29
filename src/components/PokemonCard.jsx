import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, formatId, titleCase } from '../theme';
import { PokemonImage } from './UI';

const backgrounds = ['#EAF4EE', '#FFF0E6', '#EAF0FB', '#F4ECF7', '#FFF6DC'];

// Props: os dados e as ações vêm da tela que exibe o cartão.
export default function PokemonCard({ pokemon, favorite, ready, onOpen, onToggle }) {
  return (
    <View style={[styles.card, { backgroundColor: backgrounds[(pokemon.id - 1) % backgrounds.length] }]}>
      <View style={styles.top}>
        <Text style={styles.number}>{formatId(pokemon.id)}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`${favorite ? 'Remover' : 'Adicionar'} ${titleCase(pokemon.name)} ${favorite ? 'dos' : 'aos'} favoritos`}
          accessibilityState={{ selected: favorite, disabled: !ready }} disabled={!ready}
          onPress={onToggle} style={styles.favorite}>
          <Text style={[styles.star, favorite && { color: '#A86400' }]}>{favorite ? '★' : '☆'}</Text>
        </Pressable>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={`Ver detalhes de ${titleCase(pokemon.name)}`}
        onPress={onOpen} style={({ pressed }) => [styles.body, pressed && { opacity: 0.65 }]}>
        <PokemonImage uri={pokemon.image} size={112} />
        <Text style={styles.name}>{titleCase(pokemon.name)}</Text>
        <Text style={styles.link}>Ver detalhes →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, borderRadius: 22, padding: 12, marginBottom: 14 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  number: { fontSize: 13, fontWeight: '700', color: colors.muted, paddingLeft: 4 },
  favorite: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  star: { fontSize: 27, color: colors.muted },
  body: { alignItems: 'center', paddingBottom: 10, gap: 5 },
  name: { fontSize: 17, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  link: { color: colors.muted, fontSize: 12, marginTop: 4 },
});

