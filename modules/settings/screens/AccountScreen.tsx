// AccountScreen — ecranul de profil al utilizatorului autentificat.
// Afiseaza avatar, username, rol, email, data inregistrarii, setari si butonul de deconectare.
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Calendar, LogOut, Settings, Shield } from 'lucide-react-native';
import { useAuth } from '../../auth/hooks/useAuth';
import { createAccountStyles } from '../styles/account.styles';
import { useThemeColors } from '../../../shared/hooks/useThemeColors';
import { Badge } from '../../../shared/components/Badge';

const AccountScreen: React.FC = () => {
  const colors = useThemeColors();
  const accountStyles = useMemo(() => createAccountStyles(colors), [colors]);
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView style={accountStyles.container}>
        <View style={accountStyles.centered}>
          <User size={64} color={colors.textSecondary} />
          <Text style={accountStyles.emptyTitle}>Nu esti autentificat</Text>
          <Text style={accountStyles.emptySubtitle}>
            Autentifica-te pentru a vedea profilul tau
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={accountStyles.container}>
      <ScrollView contentContainerStyle={accountStyles.scrollContent}>
        <View style={accountStyles.avatarContainer}>
          <View style={accountStyles.avatar}>
            <Text style={accountStyles.avatarText}>
              {user.username.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={accountStyles.username}>{user.username}</Text>
          <Badge
            text={user.role === 'admin' ? 'Admin' : 'Utilizator'}
            color={user.role === 'admin' ? colors.secondary : colors.primary}
          />
        </View>

        <View style={accountStyles.section}>
          <View style={accountStyles.infoRow}>
            <Mail size={20} color={colors.textSecondary} />
            <Text style={accountStyles.infoText}>{user.email}</Text>
          </View>
          <View style={accountStyles.infoRow}>
            <Calendar size={20} color={colors.textSecondary} />
            <Text style={accountStyles.infoText}>
              Membru din {new Date(user.created_at).toLocaleDateString('ro-RO')}
            </Text>
          </View>
        </View>

        <View style={accountStyles.section}>
          <TouchableOpacity style={accountStyles.menuItem} activeOpacity={0.7}>
            <Settings size={20} color={colors.text} />
            <Text style={accountStyles.menuItemText}>Setari</Text>
          </TouchableOpacity>
          {user.role === 'admin' && (
            <TouchableOpacity style={accountStyles.menuItem} activeOpacity={0.7}>
              <Shield size={20} color={colors.text} />
              <Text style={accountStyles.menuItemText}>Panou admin</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={accountStyles.logoutButton}
          onPress={logout}
          activeOpacity={0.7}
        >
          <LogOut size={20} color={colors.error} />
          <Text style={accountStyles.logoutText}>Deconectare</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;
