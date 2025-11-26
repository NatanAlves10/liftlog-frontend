// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// // Remova a importação da API, já que não será usada
// // import { authAPI } from '../services/api';

// const LoginScreen = ({ onGoToRegister, onLogin }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     // Verificação simples (opcional, pode remover se quiser)
//     if (!email || !password) {
//       Alert.alert('Erro', 'Preencha email e senha!');
//       return;
//     }

//     setLoading(true);
//     try {
//       // Removida a chamada à API
//       // const response = await authAPI.login(email, password);

//       // Simula login bem-sucedido
//       Alert.alert('Sucesso!', 'Login simulado! Prosseguindo...');
//       onLogin(); // Navega para a próxima tela ou executa a ação de login
//     } catch (error) {
//       console.log('Erro no handleLogin:', error);
//       Alert.alert(
//         'Erro',
//         error.message || 'Algo deu errado. Verifique os logs.',
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>LiftLog</Text>
//       <Text style={styles.subtitle}>Sistema de Controle de Treino</Text>
      
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//         keyboardType="email-address"
//         placeholderTextColor="#666"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Senha"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//         placeholderTextColor="#666"
//       />
      
//       <TouchableOpacity 
//         style={[styles.button, loading && styles.buttonDisabled]} 
//         onPress={handleLogin}
//         disabled={loading}
//       >
//         <Text style={styles.buttonText}>
//           {loading ? 'Entrando...' : 'Entrar'}
//         </Text>
//       </TouchableOpacity>
      
//       <TouchableOpacity style={styles.button} onPress={onGoToRegister}>
//         <Text style={styles.buttonText}>Cadastrar</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 40,
//     color: '#B266FF',
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#FFF',
//     marginBottom: 40,
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     borderWidth: 2,
//     borderColor: '#00FFCC',
//     borderRadius: 25,
//     marginBottom: 15,
//     paddingHorizontal: 20,
//     color: '#FFF',
//     backgroundColor: '#111',
//     fontSize: 16,
//   },
//   button: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#00FFCC',
//     borderRadius: 25,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//   },
//   buttonDisabled: {
//     backgroundColor: '#666',
//   },
//   buttonText: {
//     color: '#000',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default LoginScreen;

// src/screens/LoginScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { TokenStorage } from '../services/storage'; // <- nosssso MMKV

const LoginScreen = ({ onGoToRegister, onLogin }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  // const handleLogin = async () => {
  //   if (!email.trim() || !senha.trim()) {
  //     Alert.alert('Atenção', 'Preencha e-mail e senha');
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const response = await fetch('http://192.168.1.221:8080/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         email: email.trim().toLowerCase(),
  //         password: senha,
  //       }),
  //     });

  //     const text = await response.text();

  //     if (!response.ok) {
  //       const erro = text.includes('credenciais') || text.includes('inválidas')
  //         ? 'E-mail ou senha incorretos'
  //         : 'Erro no servidor';
  //       throw new Error(erro);
  //     }

  //     const data = JSON.parse(text);

  //     if (data.token) {
  //       // SALVA OS TOKENS COM MMKV (síncrono e rápido)
  //       TokenStorage.setToken(data.token);
  //       if (data.refreshToken) TokenStorage.setRefreshToken(data.refreshToken);

  //       onLogin();
  //     } else {
  //       throw new Error('Token não retornado');
  //     }

  //   } catch (error) {
  //     Alert.alert('Login falhou', error.message || 'Tente novamente');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async () => {
    // BYPASS TOTAL — clica em Entrar e vai direto pra Home, independente do que digitou
    onLogin();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Bem-vindo!</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#888"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onGoToRegister}>
          <Text style={styles.registerText}>
            Não tem conta? <Text style={{ color: '#00FFCC' }}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center', backgroundColor: '#000' },
  title: { fontSize: 34, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 50 },
  input: {
    backgroundColor: '#111',
    color: '#FFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    marginBottom: 30,
  },
  logoImage: {
    width: 280,
    height: 120,
  },
  button: {
    backgroundColor: '#00FFCC',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  registerText: { color: '#AAA', textAlign: 'center', marginTop: 30, fontSize: 16 },
});

export default LoginScreen;