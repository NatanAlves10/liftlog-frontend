// src/screens/ExerciseDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

const ExerciseDetailScreen = ({ route, onGoBack }) => {
  const { exercise, onComplete } = route.params;
  const [series, setSeries] = useState([
    { reps: '', weight: '' },
    { reps: '', weight: '' },
    { reps: '', weight: '' },
  ]);
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const allFilled = series.every(s => s.reps && s.weight);

  const handleComplete = () => {
    if (!allFilled) return Alert.alert('Atenção', 'Preencha todas as séries!');
    onComplete(exercise.name); // Chama a função passada
    onGoBack();
    };

  const startTimer = () => {
    setTimer(60);
    setIsTimerRunning(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{exercise.name}</Text>

      {series.map((s, index) => (
        <View key={index} style={styles.seriesContainer}>
          <Text style={styles.seriesLabel}>{index + 1}ª série</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Reps"
              value={s.reps}
              onChangeText={(text) => {
                const newSeries = [...series];
                newSeries[index].reps = text;
                setSeries(newSeries);
              }}
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
            <TextInput
              style={styles.input}
              placeholder="Carga"
              value={s.weight}
              onChangeText={(text) => {
                const newSeries = [...series];
                newSeries[index].weight = text;
                setSeries(newSeries);
              }}
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
          </View>
        </View>
      ))}

      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Descanso</Text>
        <Text style={styles.timer}>{timer}s</Text>
        <TouchableOpacity
          style={[styles.timerButton, isTimerRunning && styles.timerButtonActive]}
          onPress={startTimer}
          disabled={isTimerRunning}
        >
          <Text style={styles.timerButtonText}>
            {isTimerRunning ? 'Em andamento...' : 'Iniciar 60s'}
          </Text>
        </TouchableOpacity>
      </View>

      {allFilled && (
        <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeButtonText}>Finalizar Exercício</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingHorizontal: 20, paddingTop: 50 },
  header: { alignSelf: 'flex-start', marginBottom: 10 },
  backButton: { padding: 8 },
  backText: { color: '#00FFCC', fontSize: 18, fontWeight: 'bold' },
  title: { fontSize: 28, color: '#B266FF', fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  seriesContainer: { marginBottom: 20 },
  seriesLabel: { color: '#00FFCC', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between' },
  input: {
    width: '48%',
    height: 50,
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#00FFCC',
    borderRadius: 25,
    paddingHorizontal: 15,
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
  timerContainer: { alignItems: 'center', marginVertical: 30 },
  timerLabel: { color: '#00FFCC', fontSize: 16, marginBottom: 5 },
  timer: { fontSize: 48, color: '#FFF', fontWeight: 'bold' },
  timerButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#00FFCC',
  },
  timerButtonActive: { backgroundColor: '#00FFCC' },
  timerButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  completeButton: {
    backgroundColor: '#00FFCC',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  completeButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
});

export default ExerciseDetailScreen;