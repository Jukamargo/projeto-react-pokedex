import { useEffect } from 'react';
import { BackHandler, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-native';
import { FavoritesProvider, useFavorites } from './src/context/FavoritesContext';
import { Pokeball } from './src/components/UI';
import PokedexScreen from './src/screens/PokedexScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import { colors } from './src/theme';

function Layout() {
  const insets = useSafeAreaInsets();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { favorites, storageError } = useFavorites();

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (pathname === '/') return false;
      navigate(-1);
      return true;
    });
    return () => subscription.remove();
  }, [pathname, navigate]);

  return (
    <View style={[styles.app, { paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right }]}>
      <StatusBar style="dark" />
      <View style={styles.frame}>
        <View style={styles.brand}>
          <Pokeball size={32} />
          <Text style={styles.brandName}>minha<Text style={{ color: colors.red }}>pokédex</Text></Text>
          <Text style={styles.edition}>KANTO EDITION</Text>
        </View>
        {storageError ? <Text accessibilityLiveRegion="polite" style={styles.warning}>{storageError}</Text> : null}
        <View style={styles.screen}>
          <Routes>
            <Route path="/" element={<PokedexScreen key="all" />} />
            <Route path="/favoritos" element={<PokedexScreen key="favorites" onlyFavorites />} />
            <Route path="/pokemon/:id" element={<DetailsScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </View>
        <View style={[styles.tabs, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          {[{ path: '/', icon: '◉', title: 'Pokédex' }, { path: '/favoritos', icon: '☆', title: `Favoritos${favorites.length ? ` (${favorites.length})` : ''}` }].map((tab) => {
            const selected = pathname === tab.path;
            return (
              <Pressable key={tab.path} accessibilityRole="tab" accessibilityState={{ selected }}
                onPress={() => { if (!selected) navigate(tab.path); }} style={[styles.tab, selected && styles.selectedTab]}>
                <Text style={[styles.tabIcon, selected && styles.selectedText]}>{tab.icon}</Text>
                <Text style={[styles.tabText, selected && styles.selectedText]}>{tab.title}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <NativeRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Layout />
        </NativeRouter>
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.background },
  frame: { flex: 1, width: '100%', maxWidth: 760, alignSelf: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 17, gap: 9, borderBottomWidth: 1, borderBottomColor: colors.line },
  brandName: { fontSize: 20, fontWeight: '800', letterSpacing: -0.8, color: colors.ink, flex: 1 },
  edition: { fontSize: 8, fontWeight: '800', color: colors.muted, letterSpacing: 1 },
  screen: { flex: 1 },
  warning: { color: '#8A4E13', backgroundColor: '#FFF2D6', padding: 12, fontSize: 12 },
  tabs: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: 'white', paddingHorizontal: 20, paddingTop: 12, gap: 12 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minHeight: 48, gap: 8, borderRadius: 14 },
  selectedTab: { backgroundColor: colors.paleRed },
  tabIcon: { color: colors.muted, fontSize: 24 },
  tabText: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  selectedText: { color: colors.red },
});
