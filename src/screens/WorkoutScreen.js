import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

const WorkoutScreen = ({
  onGoBack,
  goToExerciseDetail,
  exercises,
  onCompleteExercise,
}) => {
  const workout = { name: 'Inferiores' };
  const completedCount = exercises.filter(e => e.completed).length;
  const progress = (completedCount / exercises.length) * 100;

  const finishWorkout = () => {
    Alert.alert(
      'Parabéns!',
      'Treino concluído com sucesso!',
      [{ text: 'OK', onPress: onGoBack }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Botão Voltar no canto superior esquerdo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Título do treino (abaixo do notch) */}
      <Text style={styles.title}>{workout.name}</Text>

      {/* Barra de progresso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {completedCount} de {exercises.length} concluídos
        </Text>
      </View>

      {/* Lista de exercícios */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {exercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.name}
            style={[
              styles.exerciseCard,
              exercise.completed && styles.exerciseCompleted,
            ]}
            onPress={() => {
              goToExerciseDetail(exercise, () => {
                onCompleteExercise(exercise.name); // Marca no App.js
              });
            }}
          >
            {/* Ícone placeholder */}
            <View style={styles.exerciseIcon} />

            {/* Informações */}
            <View style={styles.exerciseInfo}>
              <Text
                style={[
                  styles.exerciseName,
                  exercise.completed && styles.textCompleted,
                ]}
              >
                {exercise.name}
              </Text>
              <Text
                style={[
                  styles.exerciseSets,
                  exercise.completed && styles.textCompleted,
                ]}
              >
                {exercise.sets}
              </Text>
            </View>

            {/* Checkbox */}
            <View
              style={[
                styles.checkbox,
                exercise.completed && styles.checkboxChecked,
              ]}
            >
              {exercise.completed && <Text style={styles.checkmark}>✔</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Botão Finalizar Treino */}
      <TouchableOpacity
        style={[
          styles.finishButton,
          completedCount === exercises.length && styles.finishButtonActive,
        ]}
        onPress={finishWorkout}
        disabled={completedCount !== exercises.length}
      >
        <Text style={styles.finishButtonText}>
          {completedCount === exercises.length
            ? 'Finalizar Treino'
            : 'Complete todos os exercícios'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 50, // ESPAÇO SEGURO PARA NOTCH/CÂMERA
  },
  header: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#00FFCC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    color: '#B266FF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#111',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#00FFCC',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00FFCC',
  },
  progressText: {
    marginTop: 8,
    color: '#AAA',
    fontSize: 14,
  },
  list: {
    flex: 1,
    marginBottom: 20,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#00FFCC',
  },
  exerciseCompleted: {
    opacity: 0.7,
    borderColor: '#B266FF',
  },
  exerciseIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#00FFCC',
    marginRight: 15,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  exerciseSets: {
    color: '#00FFCC',
    fontSize: 14,
    marginTop: 4,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#00FFCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#00FFCC',
    borderColor: '#00FFCC',
  },
  checkmark: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  finishButton: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#555',
  },
  finishButtonActive: {
    backgroundColor: '#00FFCC',
    borderColor: '#00FFCC',
  },
  finishButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WorkoutScreen;