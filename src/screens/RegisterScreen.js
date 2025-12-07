// // src/screens/RegisterScreen.js
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
// } from 'react-native';
// import { TokenStorage } from '../services/storage';

// const RegisterScreen = ({ onGoToLogin, onRegister }) => {
//   const [form, setForm] = useState({
//     primeiroNome: '',
//     segundoNome: '',
//     cpf: '',
//     telefone: '',
//     email: '',
//     senha: '',
//   });

//   const [loading, setLoading] = useState(false);

//   const handleRegister = async () => {
//     // Só verifica se tem algum campo vazio
//     if (Object.values(form).some(value => !value.trim())) {
//       Alert.alert('Atenção', 'Preencha todos os campos!');
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload = {
//         type: 'Student',
//         firstName: form.primeiroNome.trim(),
//         lastName: form.segundoNome.trim(),
//         cpf: form.cpf.trim(),           // envia exatamente o que você digitou
//         phoneNumber: form.telefone.trim(), // sem remover nada
//         email: form.email.trim().toLowerCase(),
//         password: form.senha,
//       };

//       console.log('Enviando para API:', payload);

//       const response = await fetch('http://192.168.1.221:8080/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       const text = await response.text();
//       console.log('Status:', response.status);
//       console.log('Resposta:', text);

//       if (!response.ok) {
//         let erro = text || `Erro ${response.status}`;
//         try {
//           const json = JSON.parse(text);
//           erro = json.message || json.errors?.CPF?.[0] || json.title || erro;
//         } catch {}
//         throw new Error(erro);
//       }

//       const data = JSON.parse(text);
//       if (data.token) {
//         await TokenStorage.setToken(data.token);  // SALVA O TOKEN
//       }

//       onRegister();

//       Alert.alert(
//         'SUCESSO!',
//         'Cadastro realizado com sucesso!',
//         [{ text: 'Ir para Login', onPress: onGoToLogin }]
//       );

//     } catch (error) {
//       Alert.alert('Erro no cadastro', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#000' }}>
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.title}>Criar conta</Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Primeiro nome"
//           placeholderTextColor="#888"
//           value={form.primeiroNome}
//           onChangeText={(t) => setForm({ ...form, primeiroNome: t })}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Sobrenome"
//           placeholderTextColor="#888"
//           value={form.segundoNome}
//           onChangeText={(t) => setForm({ ...form, segundoNome: t })}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="CPF"
//           placeholderTextColor="#888"
//           value={form.cpf}
//           onChangeText={(t) => setForm({ ...form, cpf: t })}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Telefone"
//           placeholderTextColor="#888"
//           value={form.telefone}
//           onChangeText={(t) => setForm({ ...form, telefone: t })}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="E-mail"
//           placeholderTextColor="#888"
//           value={form.email}
//           onChangeText={(t) => setForm({ ...form, email: t })}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Senha"
//           placeholderTextColor="#888"
//           value={form.senha}
//           onChangeText={(t) => setForm({ ...form, senha: t })}
//           secureTextEntry
//         />

//         <TouchableOpacity
//           style={[styles.button, loading && { opacity: 0.6 }]}
//           onPress={handleRegister}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#000" />
//           ) : (
//             <Text style={styles.buttonText}>Cadastrar</Text>
//           )}
//         </TouchableOpacity>

//         <TouchableOpacity onPress={onGoToLogin}>
//           <Text style={styles.loginText}>
//             Já tem conta? <Text style={{ color: '#00FFCC' }}>Fazer login</Text>
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, padding: 24, justifyContent: 'center', backgroundColor: '#000' },
//   title: { fontSize: 34, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 40 },
//   input: {
//     backgroundColor: '#111',
//     color: '#FFF',
//     padding: 18,
//     borderRadius: 12,
//     marginBottom: 16,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   button: {
//     backgroundColor: '#00FFCC',
//     padding: 18,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
//   loginText: { color: '#AAA', textAlign: 'center', marginTop: 30, fontSize: 16 },
// });

// export default RegisterScreen;

// src/screens/RegisterScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { TokenStorage } from '../services/storage';
import { COLORS, SIZES } from '../styles/theme';
import { inputStyle, buttonStyle, textStyle } from '../styles/components';
import api from '../config/api';

const RegisterScreen = ({ onGoToLogin, onRegister }) => {
  const [form, setForm] = useState({
    primeiroNome: '',
    sobrenome: '',
    cpf: '',
    telefone: '',
    email: '',
    senha: '',
  });

  const [loading, setLoading] = useState(false);

  // === VALIDAÇÕES EM TEMPO REAL ===
  const isSingleName = (name) => name.trim().split(' ').length === 1;
  const hasMultipleNames = (name) => name.trim().includes(' ');

  const formatCPF = (text) => {
    const nums = text.replace(/\D/g, '');
    if (nums.length <= 3) return nums;
    if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
    if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
    return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9, 11)}`;
  };

  const formatPhone = (input) => {
    const nums = input.replace(/\D/g, '').slice(0, 13); // máximo 13 dígitos (55 + DDD + 9xxxxxxx)

    if (nums.length === 0) return '';

    // Força o código do Brasil
    const code = nums.startsWith('55') ? nums : '55' + nums.replace(/^55/, '');

    const ddd = code.slice(2, 4);
    const part1 = code.slice(4, 9);
    const part2 = code.slice(9, 13);

    if (code.length <= 4) return `+55 (${ddd}`;
    if (code.length <= 9) return `+55 (${ddd}) ${part1}`;
    if (code.length <= 13) return `+55 (${ddd}) ${part1}-${part2}`;

    return `+55 (${ddd}) ${part1}-${part2}`;
  };

  const isValidPhone = (formatted) => {
    const nums = formatted.replace(/\D/g, '');
    return nums.length === 13 && nums.startsWith('55');
  };

  const phoneError = form.telefone.length > 10 && !isValidPhone(form.telefone);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const isStrongPassword = (pass) => {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pass);
  };

  // Erros em tempo real
  const errorFirstName = form.primeiroNome.length > 0 && hasMultipleNames(form.primeiroNome);
  const errorLastName = form.sobrenome.length > 0 && hasMultipleNames(form.sobrenome);
  const errorEmail = form.email.length > 0 && !isValidEmail(form.email);
  const errorPassword = form.senha.length > 0 && !isStrongPassword(form.senha);

  const handleRegister = async () => {
    const emptyFields = Object.entries(form).filter(([_, v]) => !v.trim());
    if (emptyFields.length > 0) return Alert.alert('Atenção', 'Preencha todos os campos');

    if (!isSingleName(form.primeiroNome)) return Alert.alert('Erro', 'Primeiro nome deve ter apenas 1 palavra');
    if (!isSingleName(form.sobrenome)) return Alert.alert('Erro', 'Sobrenome deve ter apenas 1 palavra');
    if (!isValidPhone(form.telefone)) {return Alert.alert('Erro', 'Telefone inválido ou incompleto');}
    if (!isValidEmail(form.email)) return Alert.alert('Erro', 'E-mail inválido');
    if (!isStrongPassword(form.senha)) return Alert.alert('Erro', 'Senha fraca');

    setLoading(true);
    try {
      const payload = {
        type: 'Student',
        firstName: form.primeiroNome.trim(),
        lastName: form.sobrenome.trim(),
        cpf: formatCPF(form.cpf.replace(/\D/g, '')), // envia só números
        phoneNumber: form.telefone, // envia só números
        email: form.email.trim().toLowerCase(),
        password: form.senha,
      };

      console.log('Enviando para o backend:', payload);

      const res = await fetch(api.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      console.log('Resposta bruta do servidor:', text);
      if (!res.ok) {
        const err = JSON.parse(text || '{}');
        throw new Error(err.message || err.errors?.CPF?.[0] || 'Erro no cadastro');
      }

      const data = JSON.parse(text);
      if (data.token) await TokenStorage.setToken(data.token);

      Alert.alert('Sucesso!', 'Cadastro realizado com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            setTimeout(() => {
              onRegister();        // só navega depois de 500ms
            }, 500);
          }
        }
      ]);
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: SIZES.padding }}>
        <Text style={textStyle.title}>Criar conta</Text>

        {/* PRIMEIRO NOME */}
        <View>
          <TextInput
            style={[inputStyle.base, errorFirstName && inputStyle.error]}
            placeholder="Primeiro nome"
            placeholderTextColor={COLORS.textMuted}
            value={form.primeiroNome}
            onChangeText={(t) => setForm({ ...form, primeiroNome: t })}
            autoCapitalize="words"
          />
          {errorFirstName && <Text style={textStyle.error}>Apenas 1 nome</Text>}
        </View>

        {/* SOBRENOME */}
        <View>
          <TextInput
            style={[inputStyle.base, errorLastName && inputStyle.error]}
            placeholder="Sobrenome"
            placeholderTextColor={COLORS.textMuted}
            value={form.sobrenome}
            onChangeText={(t) => setForm({ ...form, sobrenome: t })}
            autoCapitalize="words"
          />
          {errorLastName && <Text style={textStyle.error}>Apenas 1 sobrenome</Text>}
        </View>

        {/* CPF COM MÁSCARA */}
        <TextInput
          style={inputStyle.base}
          placeholder="CPF"
          placeholderTextColor={COLORS.textMuted}
          value={form.cpf}
          onChangeText={(t) => setForm({ ...form, cpf: formatCPF(t) })}
          keyboardType="numeric"
          maxLength={14}
        />

        {/* TELEFONE COM MÁSCARA */}
        <TextInput
          style={[inputStyle.base, phoneError && inputStyle.error]}
          placeholder="Telefone"
          placeholderTextColor={COLORS.textMuted}
          value={form.telefone}
          onChangeText={(t) => setForm({ ...form, telefone: formatPhone(t) })}
          keyboardType="phone-pad"
          maxLength={19}
        />
        {phoneError && (
          <Text style={textStyle.error}>
            Telefone incompleto. Use o formato completo (11 dígitos)
          </Text>
        )}

        {/* EMAIL */}
        <View>
          <TextInput
            style={[inputStyle.base, errorEmail && inputStyle.error]}
            placeholder="E-mail"
            placeholderTextColor={COLORS.textMuted}
            value={form.email}
            onChangeText={(t) => setForm({ ...form, email: t })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errorEmail && <Text style={textStyle.error}>E-mail inválido</Text>}
        </View>

        {/* SENHA FORTE */}
        <View>
          <TextInput
            style={[inputStyle.base, errorPassword && inputStyle.error]}
            placeholder="Senha (mín. 8 caracteres)"
            placeholderTextColor={COLORS.textMuted}
            value={form.senha}
            onChangeText={(t) => setForm({ ...form, senha: t })}
            secureTextEntry
          />
          {errorPassword && (
            <Text style={textStyle.error}>
              Senha deve ter: maiúscula, número, caractere especial e 8+ dígitos
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[buttonStyle.primary, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#000" /> : <Text style={buttonStyle.text}>Cadastrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={onGoToLogin}>
          <Text style={textStyle.link}>
            Já tem conta? <Text style={textStyle.linkHighlight}>Fazer login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;