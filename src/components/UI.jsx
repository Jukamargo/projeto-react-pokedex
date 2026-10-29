import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export function Pokeball({ size = 38 }) {
  return (
    <View accessible={false} style={[styles.ball, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={styles.ballTop} />
      <View style={styles.ballLine} />
      <View style={styles.ballButton} />
    </View>
  );
}

export function Button({ title, onPress, secondary = false, disabled = false }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled}
      onPress={onPress} style={({ pressed }) => [styles.button, secondary && styles.secondary,
        (pressed || disabled) && { opacity: 0.6 }]}>
      <Text style={[styles.buttonText, secondary && { color: colors.ink }]}>{title}</Text>
    </Pressable>
  );
}

export function Message({ title, description, loading, action, actionTitle = 'Tentar novamente' }) {
  return (
    <View style={styles.message}>
      {loading ? <ActivityIndicator size="large" color={colors.red} /> : <Pokeball size={54} />}
      <Text accessibilityRole="header" style={styles.messageTitle}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {action ? <Button title={actionTitle} onPress={action} /> : null}
    </View>
  );
}

export function PokemonImage({ uri, size = 120 }) {
  const [failed, setFailed] = useState(false);
  return failed || !uri ? (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Pokeball size={size / 3} />
      <Text style={styles.fallback}>Sem imagem</Text>
    </View>
  ) : (
    <Image accessible={false} source={{ uri }} resizeMode="contain"
      style={{ width: size, height: size }} onError={() => setFailed(true)} />
  );
}

const styles = StyleSheet.create({
  ball: { borderWidth: 2, borderColor: colors.ink, overflow: 'hidden', backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
  ballTop: { position: 'absolute', top: 0, width: '100%', height: '50%', backgroundColor: colors.red },
  ballLine: { position: 'absolute', width: '100%', height: 3, backgroundColor: colors.ink },
  ballButton: { width: '30%', height: '30%', borderRadius: 30, borderWidth: 2, borderColor: colors.ink, backgroundColor: 'white' },
  button: { minHeight: 48, borderRadius: 14, paddingHorizontal: 20, paddingVertical: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.red },
  secondary: { backgroundColor: '#ECF0F4' },
  buttonText: { color: 'white', fontSize: 15, fontWeight: '700' },
  message: { padding: 28, gap: 16, alignItems: 'center', justifyContent: 'center', flexGrow: 1, minHeight: 260 },
  messageTitle: { fontSize: 21, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  description: { color: colors.muted, textAlign: 'center', lineHeight: 23, maxWidth: 350 },
  fallback: { color: colors.muted, fontSize: 11, marginTop: 8 },
});

