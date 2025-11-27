// // src/screens/CreateWorkoutScreen.js — VERSÃO FINAL COM API REAL
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { TokenStorage } from '../services/storage';

// const CreateWorkoutScreen = ({ onGoBack }) => {
//   const [selectedMuscle, setSelectedMuscle] = useState('');
//   const [exercises, setExercises] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const muscleGroups = [
//     { label: '-- Selecione --', value: '' },
//     { label: 'Quadríceps', value: 'quads' },
//     { label: 'Posterior de Coxa', value: 'hamstrings' },
//     { label: 'Glúteos', value: 'glutes' },
//     { label: 'Panturrilha', value: 'calves' },
//     { label: 'Peito', value: 'chest' },
//     { label: 'Costas', value: 'back' },
//     { label: 'Ombros', value: 'shoulders' },
//     { label: 'Bíceps', value: 'biceps' },
//     { label: 'Tríceps', value: 'triceps' },
//     { label: 'Antebraços', value: 'forearms' },
//     { label: 'Trapézio', value: 'traps' },
//     { label: 'Core / Abdômen', value: 'core' },
//     { label: 'Adutores', value: 'adductors' },
//     { label: 'Abdutores', value: 'abductors' },
//     { label: 'Pescoço', value: 'neck' },
//   ];

//   // Função que busca exercícios ao clicar no grupo
//   const fetchExercises = async (muscle) => {
//     if (!muscle) {
//       setExercises([]);
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = await TokenStorage.getToken();
//       if (!token) {
//         Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(
//         `http://192.168.1.221:8080/api/exercises?muscle=${muscle}`,
//         {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'accept': 'application/json',
//           },
//         }
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Erro ${response.status}`);
//       }

//       const data = await response.json();
//       setExercises(data);

//       Alert.alert(
//         'Sucesso!',
//         `Carregado ${data.length} exercício(s) para ${muscleGroups.find(m => m.value === muscle)?.label}!`
//       );
//     } catch (error) {
//       console.log('Erro na API:', error);
//       Alert.alert('Erro de conexão', 'Não foi possível carregar os exercícios.');
//       setExercises([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Dispara a busca quando muda o músculo
//   useEffect(() => {
//     if (selectedMuscle) {
//       fetchExercises(selectedMuscle);
//     } else {
//       setExercises([]);
//     }
//   }, [selectedMuscle]);

//   return (
//     <View style={styles.container}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={onGoBack}>
//           <Text style={styles.backIcon}>←</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={{
//             position: 'absolute',
//             top: 100,
//             right: 20,
//             backgroundColor: '#FF0055',
//             padding: 14,
//             borderRadius: 10,
//             zIndex: 999,
//             borderWidth: 2,
//             borderColor: '#FF4488',
//           }}
//           onPress={async () => {
//             const token = await TokenStorage.getToken();
//             if (!token) {
//               Alert.alert('Debug Token', 'Nenhum token salvo');
//               return;
//             }

//             // Mostra só os últimos 40 caracteres
//             const ultimos40 = token.length > 40 ? '...' + token.slice(-40) : token;

//             Alert.alert(
//               'TOKEN ATUAL (últimos 40)',
//               ultimos40,
//               [
//                 {
//                   text: 'Copiar token completo',
//                   onPress: () => {
//                     Clipboard.setString(token);
//                     Alert.alert('Copiado!', 'Token completo copiado para área de transferência');
//                   },
//                 },
//                 { text: 'OK' },
//               ]
//             );
//           }}
//         >
//           <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>
//             DEBUG TOKEN
//           </Text>
//         </TouchableOpacity>
//         <Text style={styles.title}>Monte Seu Treino</Text>
//         <View style={{ width: 50 }} />
//       </View>

//       {/* SELECT HORIZONTAL */}
//       <View style={styles.selectContainer}>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           {muscleGroups.map((item) => (
//             <TouchableOpacity
//               key={item.value}
//               style={[
//                 styles.muscleButton,
//                 selectedMuscle === item.value && styles.muscleButtonActive,
//               ]}
//               onPress={() => setSelectedMuscle(item.value)}
//             >
//               <Text
//                 style={[
//                   styles.muscleText,
//                   selectedMuscle === item.value && styles.muscleTextActive,
//                 ]}
//               >
//                 {item.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* CONTEÚDO */}
//       <ScrollView style={styles.content}>
//         {loading ? (
//           <View style={styles.loading}>
//             <ActivityIndicator size="large" color="#00FFCC" />
//             <Text style={styles.loadingText}>Carregando exercícios...</Text>
//           </View>
//         ) : exercises.length === 0 ? (
//           <View style={styles.placeholder}>
//             <Text style={styles.placeholderText}>
//               {selectedMuscle
//                 ? 'Nenhum exercício encontrado para este grupo.'
//                 : 'Selecione um grupo muscular acima'}
//             </Text>
//           </View>
//         ) : (
//           exercises.map((ex) => (
//             <View key={ex.id} style={styles.exerciseCard}>
//               <Text style={styles.exerciseName}>{ex.name}</Text>
//               <Text style={styles.exerciseMuscles}>
//                 {ex.muscleGroups?.join(' • ') || 'Sem grupos'}
//               </Text>
//               <TouchableOpacity style={styles.addButton}>
//                 <Text style={styles.addButtonText}>+ Adicionar ao treino</Text>
//               </TouchableOpacity>
//             </View>
//           ))
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 60,
//     paddingBottom: 10,
//   },
//   backIcon: { fontSize: 36, color: '#9D4EDD', fontWeight: 'bold' },
//   title: { fontSize: 24, color: '#FFF', fontWeight: 'bold' },
//   selectContainer: { paddingHorizontal: 20, paddingVertical: 16 },
//   muscleButton: {
//     paddingHorizontal: 18,
//     paddingVertical: 12,
//     borderRadius: 30,
//     backgroundColor: '#111',
//     marginRight: 12,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   muscleButtonActive: { backgroundColor: '#00FFCC', borderColor: '#00FFCC' },
//   muscleText: { color: '#AAA', fontSize: 14, fontWeight: '600' },
//   muscleTextActive: { color: '#000', fontWeight: 'bold' },
//   content: { flex: 1, paddingHorizontal: 20 },
//   loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   loadingText: { color: '#AAA', marginTop: 20 },
//   placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
//   placeholderText: { color: '#666', fontSize: 18, textAlign: 'center', lineHeight: 26 },
//   exerciseCard: {
//     backgroundColor: '#111',
//     padding: 18,
//     borderRadius: 16,
//     marginBottom: 14,
//     borderLeftWidth: 4,
//     borderLeftColor: '#00FFCC',
//   },
//   exerciseName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
//   exerciseMuscles: { color: '#00FFCC', fontSize: 13, marginTop: 6 },
//   addButton: {
//     marginTop: 12,
//     backgroundColor: '#00FFCC',
//     padding: 12,
//     borderRadius: 25,
//     alignItems: 'center',
//   },
//   addButtonText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
// });

// export default CreateWorkoutScreen;

// src/screens/CreateWorkoutScreen.js — VERSÃO FINAL: LAYOUT COMPACTO E PROFISSIONAL
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

  const muscleGroups = [
    { label: '-- Selecione --', value: '' },
    { label: 'Quadríceps', value: 'quads' },
    { label: 'Posterior', value: 'hamstrings' },
    { label: 'Glúteos', value: 'glutes' },
    { label: 'Panturrilha', value: 'calves' },
    { label: 'Peito', value: 'chest' },
    { label: 'Costas', value: 'back' },
    { label: 'Ombros', value: 'shoulders' },
    { label: 'Bíceps', value: 'biceps' },
    { label: 'Tríceps', value: 'triceps' },
    { label: 'Antebraço', value: 'forearms' },
    { label: 'Trapézio', value: 'traps' },
    { label: 'Core', value: 'core' },
  ];

  const fetchExercises = async (muscle) => {
    if (!muscle) { setExercises([]); return; }
    setLoading(true);
    try {
      const token = await TokenStorage.getToken();
      const res = await fetch(`http://192.168.1.221:8080/api/exercises?muscle=${muscle}`, {
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
    setModalVisible(true);
  };

  const addToWorkout = () => {
    if (!sets || !reps) return Alert.alert('Erro', 'Preencha séries e reps');
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
        exercises: selectedExercises.map(ex => ({
          id: ex.id,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          unit: ex.unit,
        })),
      };

      const res = await fetch('http://192.168.1.221:8080/api/workouts', {
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