// src/services/storage.js
import { MMKV } from 'react-native-mmkv';

// Instância única do MMKV (rápida e síncrona)
//const storage = new MMKV();

// Opcional: você pode adicionar criptografia assim (recomendado em produção):
// const storage = new MMKV({
//   id: 'myAppStorage',
//   encryptionKey: 'sua_chave_secreta_aqui_32_chars' // 32 caracteres para AES-256
// });

export const TokenStorage = {
  // Token principal
  setToken: (token) => storage.set('userToken', token),
  getToken: () => storage.getString('userToken'), // retorna string ou undefined
  removeToken: () => storage.delete('userToken'),

  // Refresh token
  setRefreshToken: (token) => storage.set('refreshToken', token),
  getRefreshToken: () => storage.getString('refreshToken'),
  removeRefreshToken: () => storage.delete('refreshToken'),

  // Limpar tudo (útil no logout)
  clearAll: () => {
    storage.clearAll();
  },

  // Verificar se está logado
  isLoggedIn: () => !!storage.getString('userToken'),
};