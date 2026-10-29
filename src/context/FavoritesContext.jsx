import { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext(null);
const STORAGE_KEY = '@minha-pokedex/favorites-v1';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const writes = useRef(Promise.resolve());
  const changed = useRef(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      const parsed = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(parsed) || !parsed.every((item) =>
        Number.isInteger(item.id) && item.id >= 1 && item.id <= 151 &&
        typeof item.name === 'string' && typeof item.note === 'string')) {
        throw new Error('Dados inválidos');
      }
      if (active) setFavorites(parsed);
    }).catch(() => {
      if (active) setStorageError('Não foi possível recuperar os favoritos salvos.');
    }).finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);

  // Serializa gravações para que uma alteração antiga não sobrescreva a mais recente.
  useEffect(() => {
    if (!ready || !changed.current) return;
    let active = true;
    writes.current = writes.current.catch(() => {}).then(() =>
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)),
    );
    writes.current.then(() => {
      if (active) setStorageError('');
    }).catch(() => {
      if (active) setStorageError('Não foi possível salvar. As alterações ficarão apenas nesta sessão.');
    });
    return () => { active = false; };
  }, [favorites, ready]);

  function toggleFavorite(pokemon) {
    if (!ready) return;
    changed.current = true;
    setFavorites((current) => current.some((item) => item.id === pokemon.id)
      ? current.filter((item) => item.id !== pokemon.id)
      : [...current, { id: pokemon.id, name: pokemon.name, image: pokemon.image, note: '' }]);
  }

  function saveNote(pokemon, note) {
    if (!ready) return;
    changed.current = true;
    setFavorites((current) => {
      const entry = { id: pokemon.id, name: pokemon.name, image: pokemon.image, note: note.trim() };
      return current.some((item) => item.id === pokemon.id)
        ? current.map((item) => item.id === pokemon.id ? entry : item)
        : [...current, entry];
    });
  }

  return (
    <FavoritesContext.Provider value={{ favorites, ready, storageError, toggleFavorite, saveNote }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}

