import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { TokenStorage } from '../services/storage';
import { COLORS, SIZES } from '../styles/theme';
import { inputStyle, buttonStyle, textStyle } from '../styles/components';
import api from '../config/api';

const LoginScreen = ({ onGoToRegister, onLogin }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
  };
  const hasText = email.length > 0;
  const hasAt = email.includes('@');
  const showNoAtError = hasText && !hasAt;
  const showInvalidFormatError = hasText && hasAt && !isValidEmail(email);

  const handleLogin = async () => {
    if (!email || !senha) return Alert.alert('Atenção', 'Preencha e-mail e senha');
    if (!isValidEmail(email)) return Alert.alert('E-mail inválido', 'Verifique o formato');

    setLoading(true);
    try {
      const response = await fetch(api.login, {  // ← URL CENTRALIZADA
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'E-mail ou senha incorretos');
      }

      const token = data.token || data.accessToken || data.jwt;
      if (!token) throw new Error('Token não retornado');

      await TokenStorage.setToken(token);
      onLogin(); // ← vai direto pra Home

    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível conectar');
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={{flexGrow: 1, padding: SIZES.padding, justifyContent: 'center'}}>
        
        <View style={{ alignItems: 'center', marginTop: 80, marginBottom: 30 }}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={{ width: 280, height: 120 }}
            resizeMode="contain"
          />
        </View>
        <Text style={textStyle.title}>Bem-vindo!</Text>

        <View>
          <TextInput
            style={[
              inputStyle.base,
              (showNoAtError || showInvalidFormatError) && inputStyle.error,
            ]}
            placeholder="E-mail"
            placeholderTextColor={COLORS.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect= {false}
          />

          {showNoAtError && (
            <Text style = {textStyle.error}>Email precisa ter um @</Text>
          )}
          {showInvalidFormatError && (
            <Text style = {textStyle.error}>Email imcompleto ou invalido</Text>
          )}
        </View>
        
        <TextInput
          style={inputStyle.base}
          placeholder="Senha"
          placeholderTextColor={COLORS.textMuted}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity
          style={[buttonStyle.primary, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={buttonStyle.text}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onGoToRegister}>
          <Text style={textStyle.link}>
            Não tem conta? <Text style={textStyle.linkHighlight}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
export default LoginScreen;