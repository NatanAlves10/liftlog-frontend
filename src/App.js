// import React, { useState } from 'react';
// import { View, StyleSheet } from 'react-native';

// import LoginScreen from './screens/LoginScreen';
// import RegisterScreen from './screens/RegisterScreen';
// import HomeScreen from './screens/HomeScreen';
// import WorkoutScreen from './screens/WorkoutScreen';
// import ExerciseDetailScreen from './screens/ExerciseDetailScreen';
// import CreateWorkoutScreen from './screens/CreateWorkoutScreen';

// const App = () => {
//   const [currentScreen, setCurrentScreen] = useState('login');
//   const [exerciseDetailData, setExerciseDetailData] = useState(null);

//   // ESTADO DO TREINO (agora no App.js!)
//   const [workoutExercises, setWorkoutExercises] = useState([
//     { name: 'Cadeira Extensora', sets: '3 x 10 a 12', completed: false },
//     { name: 'Cadeira Flexora', sets: '3 x 10 a 12', completed: false },
//     { name: 'Leg Press 45°', sets: '3 x 10 a 12', completed: false },
//     { name: 'Panturrilha Smith', sets: '3 x 10 a 12', completed: false },
//   ]);

//   const goToLogin = () => setCurrentScreen('login');
//   const goToRegister = () => setCurrentScreen('register');
//   const goToHome = () => setCurrentScreen('home');
//   const goToWorkout = () => setCurrentScreen('workout');
//   const goToCreateWorkout = () => setCurrentScreen('createWorkout');

//   const goToExerciseDetail = (exercise, onCompleteCallback) => {
//     setExerciseDetailData({ exercise, onComplete: onCompleteCallback });
//     setCurrentScreen('exerciseDetail');
//   };

//   const goBackFromExercise = () => {
//     setCurrentScreen('workout');
//     setExerciseDetailData(null);
//   };

//   // Função para marcar exercício como concluído
//   const completeExercise = (exerciseName) => {
//     setWorkoutExercises(prev =>
//       prev.map(ex =>
//         ex.name === exerciseName ? { ...ex, completed: true } : ex
//       )
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {currentScreen === 'login' ? (
//         <LoginScreen onGoToRegister={goToRegister} onLogin={goToHome} />
//       ) : currentScreen === 'register' ? (
//         <RegisterScreen onGoToLogin={goToLogin} onRegister={goToHome} />
//       ) : currentScreen === 'home' ? (
//         <HomeScreen onGoToLogin={goToLogin} onGoToWorkout={goToWorkout} onGoToCreateWorkout={goToCreateWorkout}/>
//       ) : currentScreen === 'workout' ? (
//         <WorkoutScreen
//           onGoBack={goToHome}
//           goToExerciseDetail={goToExerciseDetail}
//           exercises={workoutExercises} // PASSA O ESTADO
//           onCompleteExercise={completeExercise} // PASSA A FUNÇÃO
//         />
//       ) : currentScreen === 'exerciseDetail' && exerciseDetailData ? (
//         <ExerciseDetailScreen
//           route={{ params: exerciseDetailData }}
//           onGoBack={goBackFromExercise}
//         />
//       ) : currentScreen === 'createWorkout' ?(
//         <CreateWorkoutScreen onGoBack={goToHome} />
//       ) : null}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
// });

// export default App;

// App.js

// src/App.js — COM ANIMAÇÕES PROFISSIONAIS
// src/App.js


// src/App.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';

const App = () => {
  const [screen, setScreen] = useState('login'); // começa direto no login

  const goToLogin = () => setScreen('login');
  const goToRegister = () => setScreen('register');
  const goToHome = () => setScreen('home');

  return (
    <View style={styles.container}>
      {screen === 'login' && (
        <LoginScreen
          onGoToRegister={goToRegister}
          onLogin={goToHome}
        />
      )}

      {screen === 'register' && (
        <RegisterScreen
          onGoToLogin={goToLogin}
          onRegister={goToHome}
        />
      )}

      {screen === 'home' && (
        <HomeScreen onGoToLogin={goToLogin} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default App;