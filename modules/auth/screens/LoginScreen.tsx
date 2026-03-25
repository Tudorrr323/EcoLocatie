// LoginScreen — ecranul de autentificare cu email si parola.
// Foloseste AuthForm si navigheaza la tab-uri dupa login reusit sau la register.

import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthForm } from '../components/AuthForm';
import { authStyles } from '../styles/auth.styles';

export function LoginScreen() {
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
        <Text style={authStyles.headerTitle}>EcoLocatie</Text>
        <Text style={authStyles.headerSubtitle}>Descoperă plantele medicinale locale</Text>
      </View>

      <ScrollView
        contentContainerStyle={authStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={authStyles.card}>
          <AuthForm mode="login" onSuccess={handleSuccess} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
