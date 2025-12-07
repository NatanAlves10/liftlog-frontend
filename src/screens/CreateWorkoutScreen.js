import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { TokenStorage } from '../services/storage';
import { translateExercise, translateMuscleGroups } from '../utils/exerciseTranslation';
import api from '../config/api';

const CreateWorkoutScreen = ({ onGoBack }) => {
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [sets, setSets] = useState('4');
  const [reps, setReps] = useState('10');
  const [workoutName, setWorkoutName] = useState('');
  const [weight, setWeight] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');

  const daysOfWeek = [
    { label: 'Dom', value: 'Sunday' },
    { label: 'Seg', value: 'Monday' },
    { label: 'Ter', value: 'Tuesday' },
    { label: 'Qua', value: 'Wednesday' },
    { label: 'Qui', value: 'Thursday' },
    { label: 'Sex', value: 'Friday' },
    { label: 'Sáb', value: 'Saturday' },
  ];

  const muscleGroups = [
    { label: '-- Selecione --', value: '' },
    { label: 'Quadríceps', value: 'quads' },
    { label: 'Posterior', value: 'hamstrings' },
    { label: 'Glúteos', value: 'glutes' },
    { label: 'Abdutores', value: 'abductors' },
    { label: 'Adutores', value: 'adductors' },
    { label: 'Panturrilha', value: 'calves' },
    { label: 'Peito', value: 'chest' },
    { label: 'Costas', value: 'back' },
    { label: 'Ombros', value: 'shoulders' },
    { label: 'Bíceps', value: 'biceps' },
    { label: 'Tríceps', value: 'triceps' },
    { label: 'Antebraço', value: 'forearms' },
    { label: 'Pescoço', value: 'neck' },
    { label: 'Trapézio', value: 'traps' },
    { label: 'Core', value: 'core' },
  ];

  const fetchExercises = async (muscle) => {
    if (!muscle) { setExercises([]); return; }
    setLoading(true);
    try {
      const token = await TokenStorage.getToken();
      const res = await fetch(`${api.exercises}?muscle=${muscle}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setExercises(data);
    } catch {
      Alert.alert('Erro', 'Falha ao carregar exercícios');
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { selectedMuscle && fetchExercises(selectedMuscle); }, [selectedMuscle]);

  const openModal = (ex) => {
    setCurrentExercise(ex);
    setSets('4');
    setReps('10');
    setWeight('')
    setModalVisible(true);
  };

  const addToWorkout = () => {
    if (!sets || !reps) return Alert.alert('Erro', 'Preencha séries e reps');
    const peso = weight ? parseFloat(weight) || 0 : 0;
    const novo = {
      ...currentExercise,
      sets: +sets,
      reps: +reps,
      weight: 0,
      unit: 'Kilograms',
    };
    setSelectedExercises(prev => [...prev, novo]);
    setModalVisible(false);
    Alert.alert('Adicionado', `${currentExercise.name} → ${sets}×${reps}`);
  };

  const saveWorkout = async () => {
    if (selectedExercises.length === 0) return Alert.alert('Erro', 'Adicione exercícios');
    if (!workoutName.trim()) return Alert.alert('Erro', 'Dê um nome ao treino');

    setLoading(true);
    try {
      const token = await TokenStorage.getToken();
      const payload = {
        name: workoutName.trim(),
        dayOfWeek: dayOfWeek,
        exercises: selectedExercises.map(ex => ({
          id: ex.id,
          sets: ex.sets,
          reps: ex.reps,
          weight: Number(ex.weight) || 0,
          unit: 'Kilograms',
        })),
      };

      const res = await fetch(api.workouts, {  // ← IP CENTRALIZADO!
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      Alert.alert('SUCESSO TOTAL!', `Treino "${workoutName}" salvo com ${selectedExercises.length} exercícios!`, [
        { text: 'Ok!', onPress: () => onGoBack() }
      ]);
      setSelectedExercises([]);
      setWorkoutName('');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Criar Treino</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* NOME DO TREINO */}
      <View style={styles.nameRow}>
        <TextInput
          style={styles.nameInput}
          placeholder="Nome do treino..."
          placeholderTextColor="#666"
          value={workoutName}
          onChangeText={setWorkoutName}
        />
      </View>

      <Text style={styles.dayLabel}>Dia da semana</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelect}>
        {daysOfWeek.map(day => (
          <TouchableOpacity
            key={day.value}
            style={[styles.dayChip, dayOfWeek === day.value && styles.dayChipActive]}
            onPress={() => setDayOfWeek(day.value)}
          >
            <Text style={[styles.dayText, dayOfWeek === day.value && styles.dayTextActive]}>
              {day.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* SELECT COMPACTO */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.select}>
        {muscleGroups.map(g => (
          <TouchableOpacity
            key={g.value}
            style={[styles.chip, selectedMuscle === g.value && styles.chipActive]}
            onPress={() => setSelectedMuscle(g.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, selectedMuscle === g.value && styles.chipTextActive]}>
              {g.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* RESUMO DO TREINO (sempre fixo no topo) */}
      {selectedExercises.length > 0 && (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {selectedExercises.length} exercício{selectedExercises.length > 1 ? 's' : ''} adicionado{selectedExercises.length > 1 ? 's' : ''}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedExercises.map((ex, i) => (
              <View key={i} style={styles.miniChip}>
                {/* AQUI: NOME COMPLETO DO EXERCÍCIO */}
                <Text style={styles.miniText} numberOfLines={1}>
                  {translateExercise(ex.name)} {ex.sets}×{ex.reps}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* LISTA DE EXERCÍCIOS */}
      <ScrollView style={styles.list}>
        {loading ? (
          <ActivityIndicator size="large" color="#00FFCC" />
        ) : exercises.length === 0 ? (
          <Text style={styles.empty}>Selecione um grupo muscular</Text>
        ) : (
          exercises.map(ex => (
            <View key={ex.id} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.exName}>{translateExercise(ex.name)}</Text>
                <Text style={styles.exMuscles}>{translateMuscleGroups(ex.muscleGroups)}</Text>
              </View>
              <TouchableOpacity style={styles.addBtn} onPress={() => openModal(ex)}>
                <Text style={styles.addText}>+</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* BOTÃO FIXO SALVAR */}
      {selectedExercises.length > 0 && (
        <TouchableOpacity style={styles.fixedSave} onPress={saveWorkout} disabled={loading}>
          <Text style={styles.fixedSaveText}>
            {loading ? 'SALVANDO...' : `SALVAR "${workoutName || 'TREINO'}"`}
          </Text>
        </TouchableOpacity>
      )}

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{translateExercise(currentExercise?.name)}</Text>
            <TextInput style={styles.modalIn} placeholder="Séries" value={sets} onChangeText={setSets} keyboardType="numeric" />
            <TextInput style={styles.modalIn} placeholder="Repetições" value={reps} onChangeText={setReps} keyboardType="numeric" />
            <TextInput style={styles.modalIn} placeholder="Peso (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" placeholderTextColor="#666"/>
            <View style={styles.modalRow}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOk} onPress={addToWorkout}>
                <Text style={styles.modalOkText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 60 },
  back: { fontSize: 36, color: '#9D4EDD', fontWeight: 'bold' },
  title: { fontSize: 22, color: '#FFF', fontWeight: 'bold' },
  nameRow: { paddingHorizontal: 16, marginVertical: 12 },
  nameInput: { backgroundColor: '#111', color: '#FFF', padding: 14, borderRadius: 12, fontSize: 16 },
  select: { 
    paddingLeft: 16, 
    paddingVertical: 8,
    maxHeight: 56,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#111',
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#333',
    // REMOVI minWidth e forcei largura automática pelo conteúdo
  },
  chipActive: { 
    backgroundColor: '#00FFCC', 
    borderColor: '#00FFCC' 
  },
  chipText: { 
    color: '#AAA', 
    fontSize: 13, 
    fontWeight: '600',
    // Força o texto a não esticar o container
    includeFontPadding: false,
    textAlign: 'center',
  },
  chipTextActive: { 
    color: '#000', 
    fontWeight: 'bold' 
  },
  sectionLabel: {
    color: '#00FFCC',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  daySelect: {
    paddingLeft: 16,
    paddingVertical: 8,
  },
  dayChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#222',
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  dayChipActive: {
    backgroundColor: '#00FFCC',
    borderColor: '#00FFCC',
  },
  dayText: {
    color: '#ddd',
    fontSize: 13,
    fontWeight: '600',
  },
  dayTextActive: {
    color: '#000',
    fontWeight: 'bold',
  },
  summary: { backgroundColor: '#111', marginHorizontal: 16, marginVertical: 8, padding: 10, borderRadius: 12, borderLeftWidth: 3, borderLeftColor: '#00FFCC' },
  summaryText: { color: '#00FFCC', fontWeight: 'bold', marginBottom: 6 },
  miniChip: { backgroundColor: '#222', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8 },
  miniText: { color: '#00FFCC', fontSize: 12, fontWeight: '600' },
  list: { flex: 1, paddingHorizontal: 16 },
  empty: { color: '#666', textAlign: 'center', marginTop: 50, fontSize: 16 },
  card: { flexDirection: 'row', backgroundColor: '#111', padding: 16, borderRadius: 12, marginBottom: 10, alignItems: 'center', borderLeftWidth: 4, borderLeftColor: '#00FFCC' },
  exName: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
  exMuscles: { color: '#00FFCC', fontSize: 12, marginTop: 4 },
  addBtn: { backgroundColor: '#00FFCC', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  addText: { color: '#000', fontSize: 24, fontWeight: 'bold' },
  fixedSave: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: '#9D4EDD', padding: 18, borderRadius: 30, alignItems: 'center' },
  fixedSaveText: { color: '#FFF', fontWeight: 'bold', fontSize: 17 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#111', padding: 24, borderRadius: 16, width: '85%', borderWidth: 2, borderColor: '#00FFCC' },
  modalTitle: { color: '#FFF', fontSize: 19, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  modalIn: { backgroundColor: '#000', color: '#FFF', padding: 14, borderRadius: 10, marginBottom: 12, textAlign: 'center' },
  modalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modalCancel: { backgroundColor: '#333', padding: 14, borderRadius: 10, flex: 1, marginRight: 10, alignItems: 'center' },
  modalCancelText: { color: '#AAA' },
  modalOk: { backgroundColor: '#00FFCC', padding: 14, borderRadius: 10, flex: 1, marginLeft: 10, alignItems: 'center' },
  modalOkText: { color: '#000', fontWeight: 'bold' },
});

export default CreateWorkoutScreen;