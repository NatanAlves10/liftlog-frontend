// src/screens/CreateWorkoutScreen.js — VERSÃO FINAL COM API REAL
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { TokenStorage } from '../services/storage';

const CreateWorkoutScreen = ({ onGoBack }) => {
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  const muscleGroups = [
    { label: '-- Selecione um grupo muscular --', value: '' },
    { label: 'Quadríceps', value: 'quads' },
    { label: 'Posterior de Coxa', value: 'hamstrings' },
    { label: 'Glúteos', value: 'glutes' },
    { label: 'Panturrilha', value: 'calves' },
    { label: 'Peito', value: 'chest' },
    { label: 'Costas', value: 'back' },
    { label: 'Ombros', value: 'shoulders' },
    { label: 'Bíceps', value: 'biceps' },
    { label: 'Tríceps', value: 'triceps' },
    { label: 'Antebraços', value: 'forearms' },
    { label: 'Trapézio', value: 'traps' },
    { label: 'Core / Abdômen', value: 'core' },
    { label: 'Adutores', value: 'adductors' },
    { label: 'Abdutores', value: 'abductors' },
    { label: 'Pescoço', value: 'neck' },
  ];

  // Função que busca exercícios ao clicar no grupo
  const fetchExercises = async (muscle) => {
    if (!muscle) {
      setExercises([]);
      return;
    }

    setLoading(true);
    try {
      const token = await TokenStorage.getToken();
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://192.168.1.221:8080/api/exercises?muscle=${muscle}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}`);
      }

      const data = await response.json();
      setExercises(data);

      Alert.alert(
        'Sucesso!',
        `Carregado ${data.length} exercício(s) para ${muscleGroups.find(m => m.value === muscle)?.label}!`
      );
    } catch (error) {
      console.log('Erro na API:', error);
      Alert.alert('Erro de conexão', 'Não foi possível carregar os exercícios.');
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  // Dispara a busca quando muda o músculo
  useEffect(() => {
    if (selectedMuscle) {
      fetchExercises(selectedMuscle);
    } else {
      setExercises([]);
    }
  }, [selectedMuscle]);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ position: 'absolute', top: 100, right: 20, backgroundColor: '#FF5555', padding: 10, borderRadius: 8, zIndex: 99 }}
          onPress={async () => {
            const token = await TokenStorage.getToken();
            Alert.alert(
              'TOKEN ATUAL',
              token ? token.substring(0, 50) + '...' : 'NENHUM TOKEN SALVO'
            );
          }}
        >
          <Text style={{ color: '#FFF', fontWeight: 'bold' }}>DEBUG TOKEN</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Monte Seu Treino</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* SELECT HORIZONTAL */}
      <View style={styles.selectContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {muscleGroups.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.muscleButton,
                selectedMuscle === item.value && styles.muscleButtonActive,
              ]}
              onPress={() => setSelectedMuscle(item.value)}
            >
              <Text
                style={[
                  styles.muscleText,
                  selectedMuscle === item.value && styles.muscleTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* CONTEÚDO */}
      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#00FFCC" />
            <Text style={styles.loadingText}>Carregando exercícios...</Text>
          </View>
        ) : exercises.length === 0 ? (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              {selectedMuscle
                ? 'Nenhum exercício encontrado para este grupo.'
                : 'Selecione um grupo muscular acima'}
            </Text>
          </View>
        ) : (
          exercises.map((ex) => (
            <View key={ex.id} style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{ex.name}</Text>
              <Text style={styles.exerciseMuscles}>
                {ex.muscleGroups?.join(' • ') || 'Sem grupos'}
              </Text>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Adicionar ao treino</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  backIcon: { fontSize: 36, color: '#9D4EDD', fontWeight: 'bold' },
  title: { fontSize: 24, color: '#FFF', fontWeight: 'bold' },
  selectContainer: { paddingHorizontal: 20, paddingVertical: 16 },
  muscleButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: '#111',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  muscleButtonActive: { backgroundColor: '#00FFCC', borderColor: '#00FFCC' },
  muscleText: { color: '#AAA', fontSize: 14, fontWeight: '600' },
  muscleTextActive: { color: '#000', fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 20 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#AAA', marginTop: 20 },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  placeholderText: { color: '#666', fontSize: 18, textAlign: 'center', lineHeight: 26 },
  exerciseCard: {
    backgroundColor: '#111',
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#00FFCC',
  },
  exerciseName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  exerciseMuscles: { color: '#00FFCC', fontSize: 13, marginTop: 6 },
  addButton: {
    marginTop: 12,
    backgroundColor: '#00FFCC',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  addButtonText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
});

export default CreateWorkoutScreen;