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
// src/screens/ProfileEditScreen.js
import React, { useState } from 'react';
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

const ProfileEditScreen = ({ onGoBack }) => {
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

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false); // controla se já carregou

  const formatCPF = (cpf) => {
    const nums = cpf.replace(/\D/g, '');
    if (nums.length !== 11) return cpf;
    return `${nums.slice(0,3)}.${nums.slice(3,6)}.${nums.slice(6,9)}-${nums.slice(9)}`;
  };

  const formatPhone = (phone) => {
    const nums = phone.replace(/\D/g, '');
    if (nums.length !== 11) return phone;
    return `+55 (${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7)}`;
  };

  const loadUserData = async () => {
    setLoading(true);
    try {
      const token = await TokenStorage.getToken();
      if (!token) {
        Alert.alert('Erro', 'Você precisa estar logado');
        return;
      }

      const res = await fetch(api.userSelf, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Erro ao carregar dados');
      }

      const data = await res.json();

      setForm({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        cpf: data.cpf || '',
        gender: data.gender || 'Undefined',
        height: data.height ? String(data.height) : '',
        weight: data.weight ? String(data.weight) : '',
      });

      setDataLoaded(true);
      Alert.alert('Sucesso!', 'Seus dados foram carregados');
    } catch (err) {
      Alert.alert('Erro', err.message || 'Falha ao carregar dados');
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
        phoneNumber: formatPhone(form.phoneNumber),
        cpf: formatCPF(form.cpf),
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

      Alert.alert('SUCESSO!', 'Perfil atualizado com sucesso!', [
        { text: 'Ok!', onPress: onGoBack },
      ]);
    } catch (err) {
      Alert.alert('Erro', err.message || 'Falha ao salvar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>

        {/* BOTÃO VOLTAR */}
        <View style={{ paddingTop: Platform.OS === 'android' ? 50 : 20, paddingHorizontal: 20 }}>
          <TouchableOpacity onPress={onGoBack}>
            <Text style={{ color: '#9D4EDD', fontSize: 18, fontWeight: 'bold' }}>Voltar</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ color: '#FFF', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 }}>
          Editar Perfil
        </Text>

        {/* BOTÃO CARREGAR DADOS */}
        {!dataLoaded && (
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#00FFCC',
                padding: 16,
                borderRadius: 30,
                alignItems: 'center',
              }}
              onPress={loadUserData}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 18 }}>
                  CARREGAR MEUS DADOS
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* CAMPOS (só aparecem depois de carregar) */}
        {dataLoaded && (
          <>
            {/* NOME */}
            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
              <Text style={{ color: '#AAA', fontSize: 14, marginBottom: 8 }}>Nome</Text>
              <TextInput
                style={styles.input}
                value={form.firstName}
                onChangeText={(t) => setForm({ ...form, firstName: t })}
                placeholder="Seu nome"
                placeholderTextColor="#666"
              />
            </View>

            {/* SOBRENOME */}
            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
              <Text style={{ color: '#AAA', fontSize: 14, marginBottom: 8 }}>Sobrenome</Text>
              <TextInput
                style={styles.input}
                value={form.lastName}
                onChangeText={(t) => setForm({ ...form, lastName: t })}
                placeholder="Seu sobrenome"
                placeholderTextColor="#666"
              />
            </View>

            {/* E-MAIL */}
            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
              <Text style={{ color: '#AAA', fontSize: 14, marginBottom: 8 }}>E-mail</Text>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(t) => setForm({ ...form, email: t })}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="seu@email.com"
                placeholderTextColor="#666"
              />
            </View>

            {/* CELULAR */}
            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
              <Text style={{ color: '#AAA', fontSize: 14, marginBottom: 8 }}>Celular</Text>
              <TextInput
                style={styles.input}
                value={form.phoneNumber}
                onChangeText={(t) => setForm({ ...form, phoneNumber: t })}
                keyboardType="phone-pad"
                placeholder="+55 (62) 99135-8521"
                placeholderTextColor="#666"
              />
            </View>

            {/* CPF */}
            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
              <Text style={{ color: '#AAA', fontSize: 14, marginBottom: 8 }}>CPF</Text>
              <TextInput
                style={styles.input}
                value={form.cpf}
                onChangeText={(t) => setForm({ ...form, cpf: t })}
                keyboardType="numeric"
                placeholder="029.429.031-12"
                placeholderTextColor="#666"
              />
            </View>

            {/* SEXO */}
            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
              <Text style={{ color: '#AAA', fontSize: 14, marginBottom: 8 }}>Sexo</Text>
              <View style={{ flexDirection: 'row', gap: 16 }}>
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

            {/* ALTURA */}
            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
              <Text style={{ color: '#AAA', fontSize: 14, marginBottom: 8 }}>Altura (cm)</Text>
              <TextInput
                style={styles.input}
                value={form.height}
                onChangeText={(t) => setForm({ ...form, height: t })}
                keyboardType="numeric"
                placeholder="190"
                placeholderTextColor="#666"
              />
            </View>

            {/* PESO */}
            <View style={{ paddingHorizontal: 20, marginBottom: 40 }}>
              <Text style={{ color: '#AAA', fontSize: 14, marginBottom: 8 }}>Peso (kg)</Text>
              <TextInput
                style={styles.input}
                value={form.weight}
                onChangeText={(t) => setForm({ ...form, weight: t })}
                keyboardType="numeric"
                placeholder="80"
                placeholderTextColor="#666"
              />
            </View>

            {/* BOTÃO SALVAR */}
            <View style={{ paddingHorizontal: 20 }}>
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.saveText}>SALVAR ALTERAÇÕES</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // ... seus estilos antigos ...
  input: {
    backgroundColor: '#111',
    color: '#FFF',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  radio: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#111',
    borderRadius: 30,
  },
  radioActive: {
    backgroundColor: '#00FFCC',
  },
  radioText: {
    color: '#AAA',
    fontWeight: '600',
  },
  radioTextActive: {
    color: '#000',
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#00FFCC',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  saveText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ProfileEditScreen;