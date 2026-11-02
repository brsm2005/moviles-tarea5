import { StyleSheet, Text, View } from 'react-native';

import {
  PASSWORD_MIN_LENGTH,
  obtenerChecksContrasena,
} from '@/features/auth/password';

const REGLAS = [
  { clave: 'length', etiqueta: `Mínimo ${PASSWORD_MIN_LENGTH} caracteres` },
  { clave: 'uppercase', etiqueta: 'Una letra mayúscula (A-Z)' },
  { clave: 'lowercase', etiqueta: 'Una letra minúscula (a-z)' },
  { clave: 'number', etiqueta: 'Un número (0-9)' },
] as const;

/** Lista visual del cumplimiento de la política de contraseñas. */
export function PasswordRequirements({ value }: { value: string }) {
  const checks = obtenerChecksContrasena(value);

  return (
    <View style={styles.box}>
      {REGLAS.map((regla) => {
        const ok = checks[regla.clave];
        return (
          <View key={regla.clave} style={styles.row}>
            <Text style={[styles.icon, ok && styles.iconOk]}>{ok ? '✓' : '○'}</Text>
            <Text style={[styles.text, ok && styles.textOk]}>{regla.etiqueta}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { fontFamily: 'Roboto_700Bold', fontSize: 14, color: '#94A3B8', width: 16 },
  iconOk: { color: '#16A34A' },
  text: { fontFamily: 'Roboto_400Regular', fontSize: 13, color: '#64748B' },
  textOk: { color: '#166534' },
});
