export const colors = {
  background: '#F7F8FA',
  surface: '#FFFFFF',
  ink: '#202C3D',
  muted: '#667487',
  line: '#E4E8EE',
  red: '#D63D44',
  paleRed: '#FDECEE',
};

export const typeLabels = {
  normal: 'Normal', fire: 'Fogo', water: 'Água', electric: 'Elétrico',
  grass: 'Planta', ice: 'Gelo', fighting: 'Lutador', poison: 'Veneno',
  ground: 'Terra', flying: 'Voador', psychic: 'Psíquico', bug: 'Inseto',
  rock: 'Pedra', ghost: 'Fantasma', dragon: 'Dragão', dark: 'Sombrio',
  steel: 'Aço', fairy: 'Fada',
};

export const typeColors = {
  grass: '#E2F2E6', fire: '#FFE8DB', water: '#E2EEFF', electric: '#FFF4CB',
  poison: '#EEE2F6', bug: '#EDF1D5', fairy: '#FCE4F0', psychic: '#FCE4F0',
  ground: '#F1E8D8', rock: '#EAE6D9', ghost: '#E8E4F6', ice: '#E1F4F5',
};

export const titleCase = (value) => value.charAt(0).toUpperCase() + value.slice(1);
export const formatId = (id) => `#${String(id).padStart(3, '0')}`;

