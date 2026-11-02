import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface Props {
  /** 1: Estado, 2: Lectura, 3: Confirmación. */
  pasoActual: 1 | 2 | 3;
}

const TOTAL_PASOS = 3;

/** Barra de progreso animada del flujo de registro. */
export function ProgressBarRegistro({ pasoActual }: Props) {
  const porcentaje = (pasoActual / TOTAL_PASOS) * 100;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(porcentaje, {
      damping: 15,
      stiffness: 90,
    });
  }, [porcentaje, progress]);

  const animatedBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.pasoTexto}>Paso {pasoActual} de {TOTAL_PASOS}</Text>
        <Text style={styles.porcentajeTexto}>{Math.round(porcentaje)}%</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, animatedBarStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  pasoTexto: {
    fontSize: 13,
    fontFamily: 'Roboto_500Medium',
    color: '#004B87',
  },
  porcentajeTexto: {
    fontSize: 13,
    fontFamily: 'Roboto_700Bold',
    color: '#0076C6',
  },
  track: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#004B87',
    borderRadius: 4,
  },
});
