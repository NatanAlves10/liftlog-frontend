// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { TokenStorage } from '../services/storage';
// import api from '../config/api';

// const HomeScreen = ({ onGoToCreateWorkout, onStartWorkout }) => {
//   const [userName, setUserName] = useState('Usuário');
//   const [workouts, setWorkouts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Busca nome do usuário e treinos salvos
//   const loadData = async () => {
//     try {
//       const token = await TokenStorage.getToken();
//       if (!token) {
//         // Se não tiver token, volta pro login (opcional)
//         // onGoToLogin?.();
//         setLoading(false);
//         return;
//       }

//       // 1. TENTA PEGAR O NOME DO TOKEN (mais rápido e 100% confiável)
//       try {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         const fullName = 
//           payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"] ||
//           payload.given_name ||
//           payload.name ||
//           payload.sub ||
//           'Maromba';
//         setUserName(fullName.split(' ')[0]); // só o primeiro nome
//       } catch (e) {
//         setUserName('Maromba');
//       }

//       // 2. CARREGA OS TREINOS (essa parte continua igual)
//       const workoutRes = await fetch('http://192.168.1.221:8080/api/workouts', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (workoutRes.ok) {
//         const data = await workoutRes.json();
//         const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
//         setWorkouts(sorted);
//       } else {
//         Alert.alert('Aviso', 'Não foi possível carregar os treinos');
//       }
//     } catch (err) {
//       console.log('Erro:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const handleStartWorkout = (workout) => {
//     onStartWorkout(workout); // Passa o treino completo pra próxima tela
//   };

//   return (
//     <View style={styles.container}>
//       {/* HEADER */}
//       <TouchableOpacity
//   style={{ position: 'absolute', top: 60, left: 20 }}
//   onPress={() => setScreen('profileEdit')}
// >
//   <Text style={{ color: '#9D4EDD', fontSize: 18 }}>Editar Perfil</Text>
// </TouchableOpacity>
//       <View style={styles.header}>
//         <Text style={styles.welcome}>Bem-vindo,</Text>
//         <Text style={styles.name}>{userName}!</Text>
//       </View>

//       {/* LISTA DE TREINOS */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>
//           Seus Treinos {workouts.length > 0 && `(${workouts.length})`}
//         </Text>

//         {loading ? (
//           <ActivityIndicator size="large" color="#00FFCC" style={{ marginTop: 40 }} />
//         ) : workouts.length === 0 ? (
//           <View style={styles.empty}>
//             <Text style={styles.emptyText}>Nenhum treino criado ainda</Text>
//             <Text style={styles.emptySub}>Toque no + para começar!</Text>
//           </View>
//         ) : (
//           <ScrollView showsVerticalScrollIndicator={false}>
//             {workouts.map((workout) => (
//               <View key={workout.id} style={styles.workoutCard}>
//                 <View style={styles.workoutInfo}>
//                   <Text style={styles.workoutName}>{workout.name}</Text>
//                   <Text style={styles.workoutCount}>
//                     {workout.exercises.length} exercício{workout.exercises.length > 1 ? 's' : ''}
//                   </Text>
//                 </View>
//                 <TouchableOpacity
//                   style={styles.startBtn}
//                   onPress={() => handleStartWorkout(workout)}
//                 >
//                   <Text style={styles.startText}>INICIAR</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         )}
//       </View>

//       {/* BOTÃO CRIAR TREINO */}
//       <TouchableOpacity style={styles.fab} onPress={onGoToCreateWorkout}>
//         <Text style={styles.fabText}>+</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000', paddingTop: 60 },
//   header: { paddingHorizontal: 20 },
//   welcome: { color: '#AAA', fontSize: 18 },
//   name: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginTop: 4 },
//   section: { flex: 1, paddingHorizontal: 20, marginTop: 30 },
//   sectionTitle: { color: '#00FFCC', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
//   empty: { alignItems: 'center', marginTop: 60 },
//   emptyText: { color: '#666', fontSize: 18 },
//   emptySub: { color: '#444', marginTop: 8 },
//   workoutCard: {
//     backgroundColor: '#111',
//     padding: 18,
//     borderRadius: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//     borderLeftWidth: 4,
//     borderLeftColor: '#9D4EDD',
//   },
//   workoutInfo: { flex: 1 },
//   workoutName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
//   workoutCount: { color: '#00FFCC', fontSize: 14, marginTop: 4 },
//   startBtn: {
//     backgroundColor: '#00FFCC',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 25,
//   },
//   startText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
//   fab: {
//     position: 'absolute',
//     bottom: 30,
//     right: 20,
//     backgroundColor: '#9D4EDD',
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 8,
//   },
//   fabText: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
// });

// export default HomeScreen;


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { TokenStorage } from '../services/storage';
import api from '../config/api'; // ← IP centralizado

const HomeScreen = ({ onGoToCreateWorkout, onStartWorkout, onLogout, onGoToProfileEdit }) => {
  const [userName, setUserName] = useState('Usuário');
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const token = await TokenStorage.getToken();
      if (!token) {
        onLogout?.();
        return;
      }

      // Pega o primeiro nome do token
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const fullName =
          payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"] ||
          payload.given_name ||
          payload.name ||
          payload.sub ||
          'Usuario';
        setUserName(fullName.split(' ')[0]);
      } catch (e) {
        setUserName('Usuario');
      }

      // Carrega treinos com IP centralizado
      const workoutRes = await fetch(api.workouts, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (workoutRes.ok) {
        const data = await workoutRes.json();
        const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
        setWorkouts(sorted);
      } else {
        Alert.alert('Aviso', 'Não foi possível carregar os treinos');
      }
    } catch (err) {
      console.log('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // === LOGOUT COM CONFIRMAÇÃO ===
  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await TokenStorage.clearToken();
            onLogout(); // volta pro Login
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleStartWorkout = (workout) => {
    onStartWorkout(workout);
  };

  return (
    <View style={styles.container}>

      {/* EDITAR PERFIL - SUPERIOR DIREITO */}
      <TouchableOpacity style={styles.editProfileBtn} onPress={onGoToProfileEdit}>
        <Text style={styles.editProfileText}>Editar Perfil</Text>
      </TouchableOpacity>

      {/* SAUDAÇÃO */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Bem-vindo,</Text>
        <Text style={styles.name}>{userName}!</Text>
      </View>

      {/* LISTA DE TREINOS - mantida 100% igual */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Seus Treinos {workouts.length > 0 && `(${workouts.length})`}
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#00FFCC" style={{ marginTop: 40 }} />
        ) : workouts.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhum treino criado ainda</Text>
            <Text style={styles.emptySub}>Toque no + para começar!</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {workouts.map((workout) => (
              <View key={workout.id} style={styles.workoutCard}>
                <View style={styles.workoutInfo}>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <Text style={styles.workoutCount}>
                    {workout.exercises.length} exercício{workout.exercises.length > 1 ? 's' : ''}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.startBtn}
                  onPress={() => handleStartWorkout(workout)}
                >
                  <Text style={styles.startText}>INICIAR</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* BOTÃO + CRIAR TREINO */}
      <TouchableOpacity style={styles.fab} onPress={onGoToCreateWorkout}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* BOTÃO SAIR - INFERIOR ESQUERDO */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 60 },

  // Botão Editar Perfil - canto superior direito
  editProfileBtn: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  editProfileText: {
    color: '#9D4EDD',
    fontSize: 18,
    fontWeight: '600',
  },

  header: { paddingHorizontal: 20 },
  welcome: { color: '#AAA', fontSize: 18 },
  name: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginTop: 4 },

  section: { flex: 1, paddingHorizontal: 20, marginTop: 30 },
  sectionTitle: { color: '#00FFCC', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },

  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#666', fontSize: 18 },
  emptySub: { color: '#444', marginTop: 8 },

  workoutCard: {
    backgroundColor: '#111',
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#9D4EDD',
  },
  workoutInfo: { flex: 1 },
  workoutName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  workoutCount: { color: '#00FFCC', fontSize: 14, marginTop: 4 },

  startBtn: {
    backgroundColor: '#00FFCC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  startText: { color: '#000', fontWeight: 'bold', fontSize: 15 },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#9D4EDD',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  fabText: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },

  // Botão Sair - canto inferior esquerdo
  logoutBtn: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  logoutText: {
    color: '#FF4444',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen;