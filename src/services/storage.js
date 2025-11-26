// src/services/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'liftlog_token';

export const TokenStorage = {
  // Salvar token
  async setToken(token) {
    if (token) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    }
  },

  // Pegar token
  async getToken() {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },

  // Limpar token (logout)
  async clearToken() {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },
};