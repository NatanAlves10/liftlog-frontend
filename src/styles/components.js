import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from './theme';

export const inputStyle = StyleSheet.create({
  base: {
    backgroundColor: COLORS.card,
    color: COLORS.text,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: SIZES.radius,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: SIZES.inputHeight,
    marginBottom: 16,
    letterSpacing: 1.5,
  },
  error: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },
});

export const buttonStyle = StyleSheet.create({
  primary: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export const textStyle = StyleSheet.create({
  error: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: -10,
    marginBottom: 16,
    marginLeft: 4,
    fontWeight: '600',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 50,
  },
  link: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
  },
  linkHighlight: {
    color: COLORS.primary,
  },
});