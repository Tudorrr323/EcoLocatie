// RegisterScreen — ecranul de inregistrare cont nou.
// Foloseste AuthForm cu campuri suplimentare (username, confirmare parola).

import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthForm } from '../components/AuthForm';
import { authStyles } from '../styles/auth.styles';

export function RegisterScreen() {
  const router = useRouter();

  function handleSuccess() {
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={authStyles.container}>
      <View style={authStyles.header}>
        <View style={authStyles.headerIconWrapper}>
          <Text style={authStyles.headerIconText}>🌿</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={authStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={authStyles.card}>
          <AuthForm mode="register" onSuccess={handleSuccess} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
