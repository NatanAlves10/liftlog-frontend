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
  ActivityIndicator,
} from 'react-native';

const RegisterScreen = ({ onGoToLogin, onRegister }) => {
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
    // Só verifica se tem algum campo vazio
    if (Object.values(form).some(value => !value.trim())) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        type: 'Student',
        firstName: form.primeiroNome.trim(),
        lastName: form.segundoNome.trim(),
        cpf: form.cpf.trim(),           // envia exatamente o que você digitou
        phoneNumber: form.telefone.trim(), // sem remover nada
        email: form.email.trim().toLowerCase(),
        password: form.senha,
      };

      console.log('Enviando para API:', payload);

      const response = await fetch('http://192.168.1.221:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      console.log('Status:', response.status);
      console.log('Resposta:', text);

      if (!response.ok) {
        let erro = text || `Erro ${response.status}`;
        try {
          const json = JSON.parse(text);
          erro = json.message || json.errors?.CPF?.[0] || json.title || erro;
        } catch {}
        throw new Error(erro);
      }

      onRegister();

      Alert.alert(
        'SUCESSO!',
        'Cadastro realizado com sucesso!',
        [{ text: 'Ir para Login', onPress: onGoToLogin }]
      );

    } catch (error) {
      Alert.alert('Erro no cadastro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Criar conta</Text>

        <TextInput
          style={styles.input}
          placeholder="Primeiro nome"
          placeholderTextColor="#888"
          value={form.primeiroNome}
          onChangeText={(t) => setForm({ ...form, primeiroNome: t })}
        />

        <TextInput
          style={styles.input}
          placeholder="Sobrenome"
          placeholderTextColor="#888"
          value={form.segundoNome}
          onChangeText={(t) => setForm({ ...form, segundoNome: t })}
        />

        <TextInput
          style={styles.input}
          placeholder="CPF"
          placeholderTextColor="#888"
          value={form.cpf}
          onChangeText={(t) => setForm({ ...form, cpf: t })}
        />

        <TextInput
          style={styles.input}
          placeholder="Telefone"
          placeholderTextColor="#888"
          value={form.telefone}
          onChangeText={(t) => setForm({ ...form, telefone: t })}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#888"
          value={form.email}
          onChangeText={(t) => setForm({ ...form, email: t })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#888"
          value={form.senha}
          onChangeText={(t) => setForm({ ...form, senha: t })}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onGoToLogin}>
          <Text style={styles.loginText}>
            Já tem conta? <Text style={{ color: '#00FFCC' }}>Fazer login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center', backgroundColor: '#000' },
  title: { fontSize: 34, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 40 },
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
  button: {
    backgroundColor: '#00FFCC',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  loginText: { color: '#AAA', textAlign: 'center', marginTop: 30, fontSize: 16 },
});

export default RegisterScreen;