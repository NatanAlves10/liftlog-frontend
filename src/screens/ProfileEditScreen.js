// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { TokenStorage } from '../services/storage';
// import api from '../config/api'; // IP CENTRALIZADO
// import { COLORS, SIZES } from '../styles/theme';
// import { inputStyle, buttonStyle, textStyle } from '../styles/components';

// const ProfileEditScreen = ({ onGoBack }) => {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [form, setForm] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phoneNumber: '',
//     cpf: '',
//     gender: 'Male',
//     height: '',
//     weight: '',
//     heightUnit: 'Centimeters',
//     weightUnit: 'Kilograms',
//   });

//   useEffect(() => {
//     loadUserData();
//   }, []);

//   // CARREGA OS DADOS DO USUÁRIO
//   const loadUserData = async () => {
//     try {
//       const token = await TokenStorage.getToken();
//       if (!token) throw new Error('Token não encontrado');

//       const res = await fetch(api.userProfile, { // ← usa o endpoint correto: /api/users (GET)
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) {
//         const err = await res.text();
//         throw new Error(err || 'Erro ao carregar perfil');
//       }

//       const data = await res.json();

//       setForm({
//         firstName: data.firstName || '',
//         lastName: data.lastName || '',
//         email: data.email || '',
//         phoneNumber: data.phoneNumber || '',
//         cpf: data.cpf || '',
//         gender: data.gender || 'Male',
//         height: data.height ? data.height.toString() : '',
//         weight: data.weight ? data.weight.toString() : '',
//         heightUnit: data.heightUnit || 'Centimeters',
//         weightUnit: data.weightUnit || 'Kilograms',
//       });
//     } catch (err) {
//       Alert.alert('Erro', 'Não foi possível carregar seus dados');
//       console.log('Erro loadUserData:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // SALVA AS ALTERAÇÕES
//   const handleSave = async () => {
//     if (!form.firstName.trim() || !form.email.trim()) {
//       return Alert.alert('Atenção', 'Nome e e-mail são obrigatórios');
//     }

//     setSaving(true);
//     try {
//       const token = await TokenStorage.getToken();

//       const payload = {
//         type: 'Student', // CAMPO OBRIGATÓRIO DO SEU BACKEND
//         firstName: form.firstName.trim(),
//         lastName: form.lastName.trim(),
//         email: form.email.trim().toLowerCase(),
//         phoneNumber: form.phoneNumber.replace(/\D/g, ''),
//         cpf: form.cpf.replace(/\D/g, ''),
//         gender: form.gender,
//         height: form.height ? parseFloat(form.height) : 0,
//         weight: form.weight ? parseFloat(form.weight) : 0,
//         heightUnit: form.heightUnit,
//         weightUnit: form.weightUnit,
//         teacherId: null, // ou pode deixar fora se o backend aceitar
//       };

//       const res = await fetch(api.updateUser, { // PATCH no mesmo endpoint: /api/users
//         method: 'PATCH',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(errorText || 'Erro ao salvar');
//       }

//       Alert.alert('Sucesso!', 'Perfil atualizado com sucesso!', [
//         { text: 'FODA!', onPress: onGoBack },
//       ]);
//     } catch (err) {
//       console.log('Erro ao salvar:', err);
//       Alert.alert('Erro', err.message || 'Falha ao salvar alterações');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={{ flex: 1, backgroundColor: COLORS.background }}
//     >
//       <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        
//         <TouchableOpacity style={{ padding: SIZES.padding }} onPress={onGoBack}>
//           <Text style={textStyle.linkHighlight}>← Voltar</Text>
//         </TouchableOpacity>

//         <Text style={textStyle.title}>Editar Perfil</Text>

//         <View style={{ paddingHorizontal: SIZES.padding }}>

//           <Text style={textStyle.label}>Nome</Text>
//           <TextInput style={inputStyle.base} value={form.firstName} onChangeText={(t) => setForm({ ...form, firstName: t })} placeholder="Seu nome" placeholderTextColor={COLORS.textMuted} />

//           <Text style={textStyle.label}>Sobrenome</Text>
//           <TextInput style={inputStyle.base} value={form.lastName} onChangeText={(t) => setForm({ ...form, lastName: t })} placeholder="Seu sobrenome" placeholderTextColor={COLORS.textMuted} />

//           <Text style={textStyle.label}>E-mail</Text>
//           <TextInput style={inputStyle.base} value={form.email} onChangeText={(t) => setForm({ ...form, email: t })} keyboardType="email-address" autoCapitalize="none" placeholder="seu@email.com" placeholderTextColor={COLORS.textMuted} />

//           <Text style={textStyle.label}>Celular</Text>
//           <TextInput style={inputStyle.base} value={form.phoneNumber} onChangeText={(t) => setForm({ ...form, phoneNumber: t })} keyboardType="phone-pad" placeholder="+55 (11) 98765-4321" placeholderTextColor={COLORS.textMuted} />

//           <Text style={textStyle.label}>CPF</Text>
//           <TextInput style={inputStyle.base} value={form.cpf} onChangeText={(t) => setForm({ ...form, cpf: t })} keyboardType="numeric" placeholder="123.456.789-00" placeholderTextColor={COLORS.textMuted} />

//           <Text style={textStyle.label}>Sexo</Text>
//           <View style={{ flexDirection: 'row', gap: 16, marginBottom: 20 }}>
//             <TouchableOpacity style={[buttonStyle.outline, form.gender === 'Male' && buttonStyle.primary]} onPress={() => setForm({ ...form, gender: 'Male' })}>
//               <Text style={form.gender === 'Male' ? buttonStyle.text : { color: COLORS.textMuted }}>Masculino</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={[buttonStyle.outline, form.gender === 'Female' && buttonStyle.primary]} onPress={() => setForm({ ...form, gender: 'Female' })}>
//               <Text style={form.gender === 'Female' ? buttonStyle.text : { color: COLORS.textMuted }}>Feminino</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={{ flexDirection: 'row', gap: 12 }}>
//             <View style={{ flex: 1 }}>
//               <Text style={textStyle.label}>Altura</Text>
//               <TextInput style={inputStyle.base} value={form.height} onChangeText={(t) => setForm({ ...form, height: t })} keyboardType="numeric" placeholder="180" placeholderTextColor={COLORS.textMuted} />
//             </View>
//             <View style={{ width: 80 }}>
//               <Text style={textStyle.label}>Unidade</Text>
//               <TouchableOpacity style={buttonStyle.outline} onPress={() => setForm({ ...form, heightUnit: form.heightUnit === 'Centimeters' ? 'Inches' : 'Centimeters' })}>
//                 <Text style={buttonStyle.text}>{form.heightUnit === 'Centimeters' ? 'cm' : 'in'}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
//             <View style={{ flex: 1 }}>
//               <Text style={textStyle.label}>Peso</Text>
//               <TextInput style={inputStyle.base} value={form.weight} onChangeText={(t) => setForm({ ...form, weight: t })} keyboardType="numeric" placeholder="85" placeholderTextColor={COLORS.textMuted} />
//             </View>
//             <View style={{ width: 80 }}>
//               <Text style={textStyle.label}>Unidade</Text>
//               <TouchableOpacity style={buttonStyle.outline} onPress={() => setForm({ ...form, weightUnit: form.weightUnit === 'Kilograms' ? 'Pounds' : 'Kilograms' })}>
//                 <Text style={buttonStyle.text}>{form.weightUnit === 'Kilograms' ? 'kg' : 'lbs'}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//         </View>

//         {/* BOTÃO SALVAR - SEMPRE VISÍVEL */}
//         <View style={{ padding: SIZES.padding, paddingTop: 40 }}>
//           <TouchableOpacity
//             style={[buttonStyle.primary, saving && { opacity: 0.7 }]}
//             onPress={handleSave}
//             disabled={saving}
//           >
//             {saving ? <ActivityIndicator color="#000" /> : <Text style={buttonStyle.text}>SALVAR ALTERAÇÕES</Text>}
//           </TouchableOpacity>
//         </View>

//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default ProfileEditScreen;
// src/screens/ProfileEditScreen.js
// src/screens/ProfileEditScreen.js — VERSÃO FINAL E PERFEITA
// src/screens/ProfileEditScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { TokenStorage } from '../services/storage';
import api from '../config/api';
import { COLORS, SIZES } from '../styles/theme';
import { inputStyle, textStyle } from '../styles/components';

const ProfileEditScreen = ({ onGoBack }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    cpf: '',
    gender: 'Undefined',
    height: '',
    weight: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = await TokenStorage.getToken();
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado');
        setLoading(false);
        return;
      }

      // ALERT 1: Mostra o token que está sendo enviado
      Alert.alert('TOKEN ENVIADO', token.substring(0, 70) + '...', [{ text: 'OK' }]);

      const res = await fetch(api.userSelf, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // ALERT 2: Mostra o status e a resposta exata do backend
      const text = await res.text();
      Alert.alert(
        'RESPOSTA DO BACKEND',
        `Status: ${res.status}\n\nResposta:\n${text.substring(0, 600)}`,
        [{ text: 'OK' }]
      );

      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${text}`);
      }

      const data = JSON.parse(text);

      setForm({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        cpf: data.cpf || '',
        gender: data.gender || 'Undefined',
        height: data.height ? data.height.toString() : '',
        weight: data.weight ? data.weight.toString() : '',
      });

    } catch (err) {
      Alert.alert('ERRO FINAL', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.email.trim()) {
      return Alert.alert('Atenção', 'Nome e e-mail são obrigatórios');
    }

    setSaving(true);
    try {
      const token = await TokenStorage.getToken();

      const payload = {
        type: 'Student',
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phoneNumber: form.phoneNumber.replace(/\D/g, ''),
        cpf: form.cpf.replace(/\D/g, ''),
        gender: form.gender === 'Undefined' ? null : form.gender,
        height: form.height ? parseFloat(form.height) || 0 : 0,
        weight: form.weight ? parseFloat(form.weight) || 0 : 0,
        heightUnit: 'Centimeters',
        weightUnit: 'Kilograms',
      };

      const res = await fetch(api.updateUser, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Erro ao salvar');
      }

      Alert.alert('Sucesso!', 'Perfil atualizado com sucesso!', [
        { text: 'FODA!', onPress: onGoBack },
      ]);
    } catch (err) {
      Alert.alert('Erro', err.message || 'Falha ao salvar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#00FFCC" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        <TouchableOpacity style={styles.backBtn} onPress={onGoBack}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Editar Perfil</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} value={form.firstName} onChangeText={(t) => setForm({ ...form, firstName: t })} placeholder="Natan" placeholderTextColor="#666" />
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Sobrenome</Text>
          <TextInput style={styles.input} value={form.lastName} onChangeText={(t) => setForm({ ...form, lastName: t })} placeholder="Alves" placeholderTextColor="#666" />
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={form.email} onChangeText={(t) => setForm({ ...form, email: t })} keyboardType="email-address" autoCapitalize="none" placeholder="natanalves.0210@gmail.com" placeholderTextColor="#666" />
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Celular</Text>
          <TextInput style={styles.input} value={form.phoneNumber} onChangeText={(t) => setForm({ ...form, phoneNumber: t })} keyboardType="phone-pad" placeholder="+55 (62) 99135-8521" placeholderTextColor="#666" />
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>CPF</Text>
          <TextInput style={styles.input} value={form.cpf} onChangeText={(t) => setForm({ ...form, cpf: t })} keyboardType="numeric" placeholder="029.429.031-12" placeholderTextColor="#666" />
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Sexo</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[styles.radio, form.gender === 'Male' && styles.radioActive]}
              onPress={() => setForm({ ...form, gender: 'Male' })}
            >
              <Text style={form.gender === 'Male' ? styles.radioTextActive : styles.radioText}>
                Masculino
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radio, form.gender === 'Female' && styles.radioActive]}
              onPress={() => setForm({ ...form, gender: 'Female' })}
            >
              <Text style={form.gender === 'Female' ? styles.radioTextActive : styles.radioText}>
                Feminino
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ALTURA — SÓ CENTÍMETROS */}
        <View style={styles.form}>
          <Text style={styles.label}>Altura (cm)</Text>
          <TextInput
            style={styles.input}
            value={form.height}
            onChangeText={(t) => setForm({ ...form, height: t })}
            keyboardType="numeric"
            placeholder="190"
            placeholderTextColor="#666"
          />
        </View>

        {/* PESO — SÓ QUILOGRAMAS */}
        <View style={styles.form}>
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            value={form.weight}
            onChangeText={(t) => setForm({ ...form, weight: t })}
            keyboardType="numeric"
            placeholder="80"
            placeholderTextColor="#666"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.saveText}>SALVAR ALTERAÇÕES</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 50 },
  backBtn: { padding: 16 },
  backText: { color: '#9D4EDD', fontSize: 18, fontWeight: 'bold' },
  title: { color: '#FFF', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  form: { marginBottom: 20, paddingHorizontal: 20 },
  label: { color: '#AAA', fontSize: 14, marginBottom: 8 },
  input: {
    backgroundColor: '#111',
    color: '#FFF',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  radioGroup: { flexDirection: 'row', gap: 16 },
  radio: { paddingVertical: 12, paddingHorizontal: 20, backgroundColor: '#111', borderRadius: 30 },
  radioActive: { backgroundColor: '#00FFCC' },
  radioText: { color: '#AAA' },
  radioTextActive: { color: '#000', fontWeight: 'bold' },
  saveBtn: {
    backgroundColor: '#00FFCC',
    margin: 20,
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveText: { color: '#000', fontWeight: 'bold', fontSize: 18 },
});

export default ProfileEditScreen;