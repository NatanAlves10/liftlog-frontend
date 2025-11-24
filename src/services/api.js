// // src/services/api.js

// import { TokenStorage } from './storage'; // <-- nova importação

// export const authAPI = {
//   // ================================
//   // REGISTER - ATUALIZADO COM MMKV
//   // ================================
//   register: async (data) => {
//     try {
//       console.log('Dados recebidos do formulário:', data);

//       if (!data.primeiroNome?.trim() || !data.segundoNome?.trim() ||
//           !data.telefone?.trim() || !data.email?.trim() ||
//           !data.senha?.trim() || !data.cpf?.trim()) {
//         throw new Error('Preencha todos os campos.');
//       }

//       const payload = {
//         type: "Student",
//         firstName: data.primeiroNome.trim(),
//         lastName: data.segundoNome.trim(),
//         cpf: data.cpf.trim(),
//         phoneNumber: data.telefone.trim(),
//         email: data.email.trim().toLowerCase(),
//         password: data.senha
//       };

//       const response = await fetch('http://192.168.1.221:8080/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload)
//       });

//       const responseText = await response.text();
//       console.log('Status:', response.status);
//       console.log('Resposta bruta:', responseText);

//       if (!response.ok) {
//         let erro = 'Erro desconhecido';
//         try {
//           const erroJson = JSON.parse(responseText);
//           if (erroJson.errors) {
//             const primeiroErro = Object.values(erroJson.errors)[0][0];
//             erro = primeiroErro;
//           } else if (erroJson.message) {
//             erro = erroJson.message;
//           } else {
//             erro = responseText;
//           }
//         } catch {
//           erro = responseText || `HTTP ${response.status}`;
//         }
//         throw new Error(erro);
//       }

//       const result = JSON.parse(responseText);

//       if (result.token) {
//         // MMKV é síncrono! Não precisa await
//         TokenStorage.setToken(result.token);
//         if (result.refreshToken) {
//           TokenStorage.setRefreshToken(result.refreshToken);
//         }
//         return { successful: true, token: result.token, refreshToken: result.refreshToken };
//       }

//       throw new Error('Token não veio');

//     } catch (error) {
//       console.error('Erro no registro:', error.message);
//       throw { message: error.message };
//     }
//   },

//   // ================================
//   // LOGIN - ATUALIZADO COM MMKV
//   // ================================
//   login: async (email, password) => {
//     try {
//       console.log('Tentando login com:', { email });

//       const response = await fetch('http://192.168.1.221:8080/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Origin': 'http://192.168.1.221',
//         },
//         body: JSON.stringify({
//           email: email.toString(),
//           password: password.toString(),
//         }),
//       });

//       const responseText = await response.text();
//       console.log('Resposta do login:', responseText);

//       let responseData = {};
//       if (responseText) {
//         try {
//           responseData = JSON.parse(responseText);
//         } catch (e) {
//           throw new Error('Resposta inválida do servidor');
//         }
//       } else {
//         throw new Error('Resposta vazia do servidor');
//       }

//       if (!response.ok) {
//         throw new Error(
//           responseData.message ||
//           responseData.erros?.[0]?.message ||
//           `Erro HTTP ${response.status}`
//         );
//       }

//       // Salvar tokens com MMKV (síncrono e rápido)
//       if (responseData.token) {
//         TokenStorage.setToken(responseData.token);
//         if (responseData.refreshToken) {
//           TokenStorage.setRefreshToken(responseData.refreshToken);
//         }
//       }

//       return responseData;

//     } catch (error) {
//       console.error('Erro no login:', error);
//       throw { message: error.message || 'Falha na autenticação' };
//     }
//   },

//   // Bônus: função de logout
//   logout: () => {
//     TokenStorage.clearAll();
//   },

//   // Bônus: pegar token atual (útil em interceptors)
//   getCurrentToken: () => {
//     return TokenStorage.getToken();
//   }
// };

// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    primeiroNome: '',
    segundoNome: '',
    cpf: '',
    telefone: '',
    email: '',
    senha: '',
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validação básica
    const camposVazios = Object.values(form).some(value => !value.trim());
    if (camposVazios) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        type: "Student",
        firstName: form.primeiroNome.trim(),
        lastName: form.segundoNome.trim(),
        cpf: form.cpf.replace(/\D/g, ''), // remove pontos, traços
        phoneNumber: form.telefone.replace(/\D/g, ''),
        email: form.email.trim().toLowerCase(),
        password: form.senha,
      };

      console.log('Enviando cadastro:', payload);

      const response = await fetch('http://192.168.1.221:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      console.log('Resposta bruta:', text);

      if (!response.ok) {
        let mensagemErro = 'Erro no servidor';
        try {
          const erro = JSON.parse(text);
          if (erro.errors) {
            // Erros do .NET (ex: CPF já existe)
            const primeiroErro = Object.values(erro.errors)[0];
            mensagemErro = Array.isArray(primeiroErro) ? primeiroErro[0] : primeiroErro;
          } else if (erro.message) {
            mensagemErro = erro.message;
          }
        } catch {
          mensagemErro = text || `Erro HTTP ${response.status}`;
        }
        throw new Error(mensagemErro);
      }

      // Sucesso!
      Alert.alert(
        'Sucesso!',
        'Cadastro realizado com sucesso! Faça login para continuar.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );

    } catch (error) {
      console.error('Erro no cadastro:', error.message);
      Alert.alert('Falha no cadastro', error.message || 'Tente novamente mais tarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#000' }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Criar conta</Text>

        <TextInput
          style={styles.input}
          placeholder="Primeiro nome"
          placeholderTextColor="#666"
          value={form.primeiroNome}
          onChangeText={(text) => setForm({ ...form, primeiroNome: text })}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Sobrenome"
          placeholderTextColor="#666"
          value={form.segundoNome}
          onChangeText={(text) => setForm({ ...form, segundoNome: text })}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="CPF (apenas números)"
          placeholderTextColor="#666"
          value={form.cpf}
          onChangeText={(text) => setForm({ ...form, cpf: text })}
          keyboardType="numeric"
          maxLength={11}
        />

        <TextInput
          style={styles.input}
          placeholder="Telefone (com DDD)"
          placeholderTextColor="#666"
          value={form.telefone}
          onChangeText={(text) => setForm({ ...form, telefone: text })}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#666"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#666"
          value={form.senha}
          onChangeText={(text) => setForm({ ...form, senha: text })}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>
            Já tem conta? <Text style={{ color: '#00FFCC' }}>Faça login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#111',
    color: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#00FFCC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#006655',
    opacity: 0.7,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 30,
    alignItems: 'center',
  },
  loginText: {
    color: '#AAA',
    fontSize: 16,
  },
});

export default RegisterScreen;