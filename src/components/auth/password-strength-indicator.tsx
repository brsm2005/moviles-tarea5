import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import type { FortalezaContrasena } from '@/features/auth/password';

interface Props {
  fortaleza: FortalezaContrasena;
}

const ETIQUETAS: Record<Exclude<FortalezaContrasena, 'vacia'>, string> = {
  debil: 'Contraseña débil ⚠️',
  media: 'Contraseña media 🟡',
  fuerte: 'Contraseña fuerte 💪',
};

/** Barra animada que indica la seguridad de la contraseña mientras se escribe. */
export function IndicadorSeguridadContrasena({ fortaleza }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    let target = 0;
    if (fortaleza === 'debil') target = 0.33;
    if (fortaleza === 'media') target = 0.66;
    if (fortaleza === 'fuerte') target = 1;

    progress.value = withSpring(target, {
      damping: 15,
      stiffness: 120,
    });
  }, [fortaleza, progress]);

  const animatedBarStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 0.33, 0.66, 1],
      ['#E2E8F0', '#DC2626', '#D97706', '#16A34A'],
    );

    return {
      width: `${progress.value * 100}%`,
      backgroundColor,
    };
  });

  if (fortaleza === 'vacia') return null;

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, animatedBarStyle]} />
      </View>
      <Text
        accessibilityLiveRegion="polite"
        style={[styles.texto, styles[fortaleza]]}>
        {ETIQUETAS[fortaleza]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
    gap: 4,
  },
  track: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  texto: {
    fontSize: 12,
    fontFamily: 'Roboto_500Medium',
  },
  debil: { color: '#DC2626' },
  media: { color: '#D97706' },
  fuerte: { color: '#16A34A' },
});
