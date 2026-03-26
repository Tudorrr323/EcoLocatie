// _layout — layout-ul radacina al aplicatiei EcoLocation (Expo Router).
// Wrapeaza app-ul cu AuthProvider si redirecteaza la /login daca utilizatorul nu e autentificat.

import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuthContext } from '../shared/context/AuthContext';
import { SettingsProvider, useSettings } from '../shared/context/SettingsContext';
import { NotificationProvider } from '../shared/context/NotificationContext';
import { FavoritesProvider } from '../shared/context/FavoritesContext';
import { POIFavoritesProvider } from '../shared/context/POIFavoritesContext';

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuthContext();
  const { resolvedTheme, colors: themeColors } = useSettings();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    // Pagini accesibile fara autentificare
    const publicPages = ['login', 'register', 'forgot-password', 'privacy-policy', 'terms', 'about'];
    // Pagini de unde utilizatorul autentificat trebuie redirectat
    const authOnlyPages = ['login', 'register'];

    const isPublic = publicPages.includes(segments[0] as string);
    const isAuthOnly = authOnlyPages.includes(segments[0] as string);

    if (!isAuthenticated && !isPublic) {
      router.replace('/login');
    } else if (isAuthenticated && isAuthOnly) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: themeColors.surface }}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="privacy-policy" />
        <Stack.Screen name="terms" />
        <Stack.Screen name="about" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="account-security" />
        <Stack.Screen name="notifications" />
        <Stack.Screen
          name="plant/[id]"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="admin-poi/[id]"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="admin-user/[id]"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <NotificationProvider>
          <FavoritesProvider>
            <POIFavoritesProvider>
              <RootLayoutNav />
            </POIFavoritesProvider>
          </FavoritesProvider>
        </NotificationProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
