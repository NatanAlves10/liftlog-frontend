// src/screens/CreateWorkoutScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CreateWorkoutScreen = ({ onGoBack }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Montar Treino</Text>
      <Text style={styles.subtitle}>Selecione os exercícios e configure seu treino</Text>

      {/* Aqui virão: busca de exercícios, lista, adicionar séries, etc */}
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Tela em desenvolvimento...</Text>
        <Text style={styles.placeholderText}>Em breve: busca de exercícios + montagem personalizada</Text>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
        <Text style={styles.backButtonText}>Voltar para Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#B266FF',
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#AAA',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: '#00FFCC',
    padding: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CreateWorkoutScreen;