// AuthForm — formular reutilizabil pentru login si register.
// Contine campuri email/parola, buton submit si link catre cealalta pagina de auth.

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { useAuth } from '../hooks/useAuth';
import { createAuthStyles } from '../styles/auth.styles';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSuccess?: () => void;
}

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const colors = useThemeColors();
  const authStyles = useMemo(() => createAuthStyles(colors), [colors]);
  const router = useRouter();
  const { login, register } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [usernameError, setUsernameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  function validate(): boolean {
    let valid = true;

    setUsernameError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);

    if (!username.trim()) {
      setUsernameError('Numele de utilizator este obligatoriu.');
      valid = false;
    }

    if (mode === 'register') {
      if (!email.trim()) {
        setEmailError('Adresa de email este obligatorie.');
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setEmailError('Adresa de email nu este validă.');
        valid = false;
      }
    }

    if (!password) {
      setPasswordError('Parola este obligatorie.');
      valid = false;
    } else if (mode === 'register' && password.length < 6) {
      setPasswordError('Parola trebuie să aibă cel puțin 6 caractere.');
      valid = false;
    }

    return valid;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(username.trim(), password);
      } else {
        await register(username.trim(), email.trim(), password);
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.replace('/(tabs)');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'A apărut o eroare. Încearcă din nou.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleSwitch() {
    if (mode === 'login') {
      router.push('/register');
    } else {
      router.push('/login');
    }
  }

  return (
    <View>
      <Text style={authStyles.cardTitle}>
        {mode === 'login' ? 'Autentificare' : 'Înregistrare'}
      </Text>
      <Text style={authStyles.cardSubtitle}>
        {mode === 'login'
          ? 'Intră în contul tău EcoLocation'
          : 'Creează un cont nou'}
      </Text>

      {error && (
        <View style={authStyles.errorBox}>
          <Text style={authStyles.errorText}>{error}</Text>
        </View>
      )}

      <Input
        label="Nume utilizator"
        placeholder="ex: maria_botanist"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
        error={usernameError}
      />

      {mode === 'register' && (
        <Input
          label="Email"
          placeholder="ex: email@exemplu.ro"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          error={emailError}
        />
      )}

      <Input
        label="Parolă"
        placeholder="Parola ta"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        error={passwordError}
      />

      <Button
        title={mode === 'login' ? 'Autentificare' : 'Înregistrare'}
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
      />

      <View style={authStyles.divider} />

      <View style={authStyles.switchRow}>
        <Text style={authStyles.switchText}>
          {mode === 'login' ? 'Nu ai cont?' : 'Ai deja cont?'}
        </Text>
        <TouchableOpacity onPress={handleSwitch} activeOpacity={0.7}>
          <Text style={authStyles.switchLink}>
            {mode === 'login' ? 'Înregistrează-te' : 'Autentifică-te'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
