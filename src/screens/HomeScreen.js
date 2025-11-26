// src/screens/HomeScreen.js — VERSÃO FINAL LIMPA (sem vector-icons)
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { TokenStorage } from '../services/storage';

const HomeScreen = ({ onGoToLogin, onGoToCreateWorkout, onGoToWorkout }) => {
  const [userName, setUserName] = useState('Usuário');

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const token = await TokenStorage.getToken();
      if (!token) {
        onGoToLogin();
        return;
      }
      const payload = JSON.parse(atob(token.split('.')[1]));
      const name =
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"] ||
        payload.given_name ||
        payload.firstName ||
        'Usuário';
      setUserName(name.split(' ')[0]);
    } catch (e) {
      setUserName('Usuário');
    }
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await TokenStorage.clearToken();
          onGoToLogin();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* MENU ESQUERDO - texto simples */}
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        {/* BOTÃO + DIREITA */}
        <TouchableOpacity style={styles.addButton} onPress={onGoToCreateWorkout}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <Text style={styles.greeting}>Olá, {userName}!</Text>
        <Text style={styles.subtitle}>Pronto para hoje?</Text>

        {/* CARD DO TREINO DE HOJE */}
        <View style={styles.todayCard}>
          <Text style={styles.dayLabel}>Hoje</Text>
          <Text style={styles.workoutName}>Inferiores</Text>
          <View style={styles.exercises}>
            <Text style={styles.exercise}>• Agachamento Livre</Text>
            <Text style={styles.exercise}>• Leg Press 45°</Text>
            <Text style={styles.exercise}>• Stiff</Text>
            <Text style={styles.exercise}>• Panturrilha em Pé</Text>
          </View>
          <TouchableOpacity style={styles.startButton} onPress={onGoToWorkout}>
            <Text style={styles.startButtonText}>Iniciar Treino</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Próximos</Text>
        <View style={styles.nextCard}>
          <Text style={styles.nextDay}>Amanhã</Text>
          <Text style={styles.nextWorkout}>Superiores</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  menuButton: {
    padding: 10,
  },
  menuIcon: {
    fontSize: 34,
    color: '#9D4EDD',
  },
  addButton: {
    width: 56,
    height: 56,
    backgroundColor: '#00FFCC',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#00FFCC',
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  addIcon: {
    fontSize: 36,
    color: '#000',
    fontWeight: 'bold',
    marginTop: -3,
  },
  content: { flex: 1, paddingHorizontal: 24 },
  greeting: { fontSize: 32, color: '#FFF', fontWeight: 'bold', marginTop: 10 },
  subtitle: { fontSize: 18, color: '#00FFCC', marginBottom: 30 },
  todayCard: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#00FFCC',
    marginBottom: 30,
  },
  dayLabel: { color: '#00FFCC', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  workoutName: { fontSize: 28, color: '#FFF', fontWeight: 'bold', marginBottom: 20 },
  exercises: { marginBottom: 24 },
  exercise: { color: '#AAA', fontSize: 17, marginBottom: 10, paddingLeft: 6 },
  startButton: {
    backgroundColor: '#00FFCC',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  startButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  sectionTitle: { fontSize: 20, color: '#9D4EDD', fontWeight: 'bold', marginBottom: 16 },
  nextCard: { backgroundColor: '#111', padding: 20, borderRadius: 16, marginBottom: 20 },
  nextDay: { color: '#9D4EDD', fontSize: 15, fontWeight: '600' },
  nextWorkout: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  logoutButton: { marginTop: 40, alignItems: 'center', padding: 16 },
  logoutText: { color: '#FF5555', fontSize: 16, fontWeight: '600' },
});

export default HomeScreen;