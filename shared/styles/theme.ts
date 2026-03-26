// theme — defineste culorile, fonturile, spacing-ul si border radius-ul aplicatiei.
// Toate stilurile din module importa valorile de aici pentru consistenta vizuala.
// Pentru dark mode, componentele folosesc useThemeColors() care returneaza paleta corecta.

export const lightColors = {
  primary: '#6AAE35',
  primaryLight: '#8BC34A',
  primaryDark: '#4E8C2A',
  secondary: '#FF8F00',
  secondaryLight: '#FFB300',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  textLight: '#FFFFFF',
  error: '#D32F2F',
  success: '#388E3C',
  warning: '#F57C00',
  border: '#E0E0E0',
  overlay: 'rgba(0, 0, 0, 0.5)',
  logoGreen: '#6AAE35',
  logoTeal: '#1A9D94',
  tabActive: '#22C55E',
  black: '#000000',
  flashTorch: '#FFD600',
  filterDotBorder: 'rgba(0,0,0,0.1)',
  errorBackground: '#FFEBEE',
  placeholderText: '#BDBDBD',
  notificationBadge: '#EF4444',
  notificationUnread: '#F0F7EB',
  drawerBackground: '#1A9D94',
  drawerSeparator: 'rgba(255,255,255,0.15)',
  drawerActiveItem: 'rgba(255,255,255,0.2)',
  drawerText: '#FFFFFF',
  drawerTextMuted: 'rgba(255,255,255,0.8)',
  cameraButton: '#1A9D94',
  cameraButtonShadow: 'rgba(26,157,148,0.3)',
  cameraButtonIcon: '#FFFFFF',
  chatAccent: '#1A9D94',
  chatAccentLight: 'rgba(26,157,148,0.12)',
  chatButtonShadow: 'rgba(26,157,148,0.25)',
} as const;

export type ThemeColors = { [K in keyof typeof lightColors]: string };

export const darkColors: ThemeColors = {
  primary: '#7CC142',
  primaryLight: '#9CD45E',
  primaryDark: '#5A9A30',
  secondary: '#FFB300',
  secondaryLight: '#FFC94D',
  background: '#121212',
  surface: '#1E1E1E',
  text: '#E8E8E8',
  textSecondary: '#A0A0A0',
  textLight: '#FFFFFF',
  error: '#EF5350',
  success: '#4CAF50',
  warning: '#FFB74D',
  border: '#333333',
  overlay: 'rgba(0, 0, 0, 0.7)',
  logoGreen: '#7CC142',
  logoTeal: '#26B5AB',
  tabActive: '#34D399',
  black: '#000000',
  flashTorch: '#FFD600',
  filterDotBorder: 'rgba(255,255,255,0.15)',
  errorBackground: '#3D1515',
  placeholderText: '#666666',
  notificationBadge: '#EF4444',
  notificationUnread: '#1A2E14',
  drawerBackground: '#0F2B28',
  drawerSeparator: 'rgba(255,255,255,0.1)',
  drawerActiveItem: 'rgba(255,255,255,0.12)',
  drawerText: '#E8E8E8',
  drawerTextMuted: 'rgba(255,255,255,0.6)',
  cameraButton: '#0F2B28',
  cameraButtonShadow: 'rgba(15,43,40,0.5)',
  cameraButtonIcon: '#E8E8E8',
  chatAccent: '#0F2B28',
  chatAccentLight: 'rgba(15,43,40,0.25)',
  chatButtonShadow: 'rgba(15,43,40,0.5)',
};

// Alias pentru compatibilitate — folosit doar in cod non-React (ex: sightingGuard).
// In componente React, foloseste INTOTDEAUNA useThemeColors().
export const colors = lightColors;

export const fonts = {
  regular: { fontWeight: '400' as const },
  medium: { fontWeight: '500' as const },
  bold: { fontWeight: '700' as const },
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
    title: 28,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;
