import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PulseView } from '@/components/animations/pulse-view';
import { getDb } from '@/db/database';

// R9: indicador de conexión y contador de lecturas pendientes.
export function NetworkStatusBar() {
  const [online, setOnline] = useState(true);
  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((s) => {
      setOnline(s.isConnected === true && s.isInternetReachable !== false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      try {
        const db = await getDb();
        const row = await db.getFirstAsync<{ n: number }>(
          'SELECT COUNT(*) AS n FROM lecturas_pendientes WHERE sincronizado = 0',
        );
        if (activo) setPendientes(row?.n ?? 0);
      } catch {
        // El contador no debe romper la pantalla.
      }
    };
    cargar();
    const t = setInterval(cargar, 5000);
    return () => {
      activo = false;
      clearInterval(t);
    };
  }, []);

  return (
    <View style={styles.bar}>
      <View style={[styles.pill, { backgroundColor: online ? '#DCFCE7' : '#FEF3C7' }]}>
        <PulseView active={!online} style={styles.dotWrapper}>
          <View style={[styles.dot, { backgroundColor: online ? '#10B981' : '#F59E0B' }]} />
        </PulseView>
        <Text style={[styles.text, { color: online ? '#166534' : '#92400E' }]}>
          {online ? 'Con red' : 'Sin red'}
        </Text>
      </View>
      <View style={[styles.pill, { backgroundColor: pendientes > 0 ? '#FEF3C7' : 'rgba(255,255,255,0.18)' }]}>
        <PulseView active={pendientes > 0} style={styles.dotWrapper}>
          <View
            style={[styles.dot, { backgroundColor: pendientes > 0 ? '#D97706' : '#FFFFFF' }]}
          />
        </PulseView>
        <Text style={[styles.text, { color: pendientes > 0 ? '#92400E' : '#FFFFFF' }]}>
          Pendientes: {pendientes}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotWrapper: { alignItems: 'center', justifyContent: 'center' },
  text: { fontFamily: 'Roboto_500Medium', fontSize: 13 },
});
