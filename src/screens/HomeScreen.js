// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { TokenStorage } from '../services/storage'; // <- NOVO
import { authAPI } from '../services/api';        // se precisar buscar dados do usuário

const HomeScreen = ({ onGoToLogin, onGoToWorkout, onGoToCreateWorkout }) => {
  const [userName, setUserName] = useState('Usuário');
  const [loading, setLoading] = useState(true);

  // Carrega o nome do usuário ao entrar na tela
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = TokenStorage.getToken();
      if (!token) {
        onGoToLogin();
        return;
      }

      // Opção 1: Se sua API tem um endpoint /me ou /profile
      // const response = await fetch('http://192.168.1.221:8080/me', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const data = await response.json();
      // setUserName(data.firstName || 'Usuário');

      // Opção 2 (mais simples por enquanto): pegar do token JWT (se não estiver criptografado)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const firstName = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
                          payload.firstName ||
                          payload.given_name ||
                          'Usuário';
        setUserName(firstName);
      } catch (e) {
        setUserName('Usuário');
      }

    } catch (error) {
      console.log('Erro ao carregar dados do usuário', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: () => {
            TokenStorage.clearAll();     // LIMPA O TOKEN do MMKV
            onGoToLogin();               // Volta pra tela de login
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00FFCC" />
        <Text style={{ color: '#FFF', marginTop: 20 }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.profileCircle} />
          <View>
            <Text style={styles.greeting}>Olá, {userName}!</Text>
            <Text style={styles.subtitle}>Seu treino de hoje</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={onGoToCreateWorkout}>
          <Text style={styles.createButtonText}>Montar Treino</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ... resto do seu conteúdo (treinos) permanece igual ... */}

        <View style={styles.todayCard}>
          <Text style={styles.sectionTitle}>Hoje</Text>
          <Text style={styles.workoutTitle}>Inferiores</Text>
          <View style={styles.exerciseList}>
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
        {/* ... outros cards ... */}

        {/* BOTÃO SAIR AGORA FAZ LOGOUT DE VERDADE */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 50, // Espaço pro header fixo
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#B266FF',
    marginRight: 15,
  },
  greeting: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#00FFCC',
  },
  createButton: {
    backgroundColor: '#00FFCC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
  },
  createButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  todayCard: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#00FFCC',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#00FFCC',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  workoutTitle: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  exerciseList: {
    marginBottom: 20,
  },
  exercise: {
    color: '#AAA',
    fontSize: 16,
    marginBottom: 8,
    paddingLeft: 10,
  },
  startButton: {
    backgroundColor: '#00FFCC',
    padding: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextWorkout: {
    marginBottom: 15,
  },
  day: {
    color: '#888',
    fontSize: 14,
    marginBottom: 5,
  },
  workoutBadge: {
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#00FFCC',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  workoutBadgeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 40,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FF5555',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;