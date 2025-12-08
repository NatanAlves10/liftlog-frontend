// src/screens/ActiveWorkoutScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { TokenStorage } from '../services/storage';
import api from '../config/api';

const ActiveWorkoutScreen = ({ workout, onGoBack }) => {
  const [exercises, setExercises] = useState(
    workout.exercises.map(ex => ({
      ...ex,
      completedSets: 0,
      // Cada série começa com o peso sugerido + campo pra peso real
      logs: Array(ex.sets).fill(null).map(() => ({
        suggestedWeight: ex.weight || 0,  // peso que veio do treino
        actualWeight: '',                 // peso que o usuário vai digitar
        done: false,
      })),
    }))
  );

  const [timerModal, setTimerModal] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(180); // 3 min padrão
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startTimer = (minutes) => {
    setTimerSeconds(minutes * 60);
    setIsTimerRunning(true);
    setTimerModal(true);
  };

  const toggleSet = (exIndex, setIndex) => {
    setExercises(prev => {
      const newEx = [...prev];
      newEx[exIndex].logs[setIndex].done = !newEx[exIndex].logs[setIndex].done;
      newEx[exIndex].completedSets = newEx[exIndex].logs.filter(l => l.done).length;
      return newEx;
    });
  };

  const updateWeight = (exIndex, setIndex, value) => {
    setExercises(prev => {
      const newEx = [...prev];
      newEx[exIndex].logs[setIndex].actualWeight = value.replace(/[^0-9]/g, '');
      return newEx;
    });
  };

  const finishWorkout = async () => {
    const completed = exercises.some(ex => ex.completedSets > 0);
    if (!completed) {
      return Alert.alert('Ops', 'Você não completou nenhuma série ainda!');
    }

    Alert.alert(
      'Finalizar Treino?',
      `Você completou ${exercises.reduce((a, ex) => a + ex.completedSets, 0)} séries`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'SIM, SALVAR!', onPress: saveWorkout },
      ]
    );
  };

  const saveWorkout = async () => {
    try {
      const token = await TokenStorage.getToken();

      const payload = {
        workoutId: workout.id,
        completedAt: new Date().toISOString(),
        exercises: exercises.map(ex => {
          // Pega o último peso real digitado (ou o sugerido)
          const lastActual = ex.logs
            .filter(l => l.actualWeight)
            .pop()?.actualWeight;

          const finalWeight = lastActual ? Number(lastActual) : (ex.weight || 0);

          return {
            id: ex.id,
            sets: ex.sets,
            reps: ex.reps,
            weight: finalWeight,
            unit: "Kilograms"
          };
        }),
      };

      console.log("ENVIANDO PARA O BACKEND:", JSON.stringify(payload, null, 2));

      const res = await fetch(api.workoutSessions, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();

      // AQUI VAI MOSTRAR O ERRO EXATO DO BACKEND NO CELULAR!
      Alert.alert(
        res.ok ? 'SUCESSO!' : 'ERRO DO BACKEND',
        res.ok 
          ? 'Treino salvo com sucesso!' 
          : `Status: ${res.status}\n\nMensagem do servidor:\n${responseText}`,
        [{ text: 'OK', onPress: res.ok ? onGoBack : undefined }]
      );

      if (!res.ok) throw new Error(responseText);

    } catch (err) {
      Alert.alert('Erro', err.message || 'Falha ao salvar');
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack}>
          <Text style={styles.back}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{workout.name}</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.list}>
        {exercises.map((ex, exIndex) => (
          <View key={ex.id} style={styles.exerciseCard}>
            <Text style={styles.exName}>{ex.name}</Text>
            <Text style={styles.exInfo}>
              {ex.sets} séries × {ex.reps} reps
            </Text>

            <View style={styles.setsRow}>
              {ex.logs.map((log, setIndex) => (
                <View key={setIndex} style={styles.setContainer}>
                  <Text style={styles.setNumber}>{setIndex + 1}</Text>

                    {/* PESO SUGERIDO */}
                    <Text style={styles.suggestedWeight}>
                      Sugerido: {log.suggestedWeight > 0 ? `${log.suggestedWeight}kg` : '—'}
                    </Text>

                    {/* INPUT DO PESO REAL */}
                    <TextInput
                      style={[
                        styles.weightInput,
                        log.done && styles.weightDone
                      ]}
                      placeholder="kg"
                      keyboardType="numeric"
                      value={log.actualWeight}
                      onChangeText={(v) => updateWeight(exIndex, setIndex, v)}
                    />

                    {/* BOTÃO DE CHECK */}
                    <TouchableOpacity
                      style={[styles.checkBtn, log.done && styles.checkDone]}
                      onPress={() => toggleSet(exIndex, setIndex)}
                    >
                      <Text style={styles.checkText}>
                        {log.done ? 'Feito' : 'Não'}
                      </Text>
                    </TouchableOpacity>
                </View>
              ))}
            </View>

            <Text style={styles.completed}>
              {ex.completedSets}/{ex.sets} séries concluídas
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* BOTÕES DE DESCANSO */}
      <View style={styles.restButtons}>
        <TouchableOpacity style={styles.restBtn} onPress={() => startTimer(1)}>
          <Text style={styles.restText}>1 min</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.restBtn} onPress={() => startTimer(2)}>
          <Text style={styles.restText}>2 min</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.restBtn} onPress={() => startTimer(3)}>
          <Text style={styles.restText}>3 min</Text>
        </TouchableOpacity>
      </View>

      {/* BOTÃO FINALIZAR */}
      <TouchableOpacity style={styles.finishBtn} onPress={finishWorkout}>
        <Text style={styles.finishText}>FINALIZAR TREINO</Text>
      </TouchableOpacity>

      {/* MODAL DO TIMER */}
      <Modal visible={timerModal} transparent animationType="fade">
        <View style={styles.timerOverlay}>
          <View style={styles.timerBox}>
            <Text style={styles.timerText}>{formatTime(timerSeconds)}</Text>
            <TouchableOpacity
              style={styles.closeTimer}
              onPress={() => {
                setTimerModal(false);
                setIsTimerRunning(false);
              }}
            >
              <Text style={styles.closeText}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 },
  back: { color: '#9D4EDD', fontSize: 24, fontWeight: 'bold' },
  title: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  list: { flex: 1, paddingHorizontal: 16, marginTop: 20 },
  exerciseCard: { backgroundColor: '#111', padding: 16, borderRadius: 16, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#00FFCC' },
  exName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  exInfo: { color: '#00FFCC', marginTop: 4 },
  setsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 12 },
  setContainer: { alignItems: 'center' },
  setNumber: { color: '#AAA', fontSize: 14 },
  weightInput: {
    backgroundColor: '#222',
    color: '#FFF',
    width: 60,
    textAlign: 'center',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  weightContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  suggestedWeight: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  weightInput: {
    backgroundColor: '#222',
    color: '#FFF',
    width: 70,
    textAlign: 'center',
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
  },
  weightDone: {
    backgroundColor: '#00FFCC',
    color: '#000',
    fontWeight: 'bold',
  },
  weightDone: { backgroundColor: '#00FFCC', color: '#000' },
  checkBtn: { marginTop: 6, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#333', borderRadius: 20 },
  checkDone: { backgroundColor: '#00FFCC' },
  checkText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  completed: { color: '#00FFCC', marginTop: 12, fontWeight: 'bold' },
  restButtons: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 16, gap: 16 },
  restBtn: { backgroundColor: '#222', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30 },
  restText: { color: '#00FFCC', fontWeight: 'bold' },
  finishBtn: { backgroundColor: '#9D4EDD', padding: 18, margin: 20, borderRadius: 30, alignItems: 'center' },
  finishText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  timerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  timerBox: { backgroundColor: '#111', padding: 40, borderRadius: 30, borderWidth: 4, borderColor: '#00FFCC', alignItems: 'center' },
  timerText: { color: '#00FFCC', fontSize: 72, fontWeight: 'bold' },
  closeTimer: { marginTop: 30, backgroundColor: '#9D4EDD', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 30 },
  closeText: { color: '#FFF', fontWeight: 'bold' },
});

export default ActiveWorkoutScreen;