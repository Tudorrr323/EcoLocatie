// theme — defineste culorile, fonturile, spacing-ul si border radius-ul aplicatiei.
// Toate stilurile din module importa valorile de aici pentru consistenta vizuala.

export const colors = {
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
} as const;

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
