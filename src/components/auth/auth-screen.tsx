import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeaderEpmaps } from '@/components/header-epmaps';

import { authStyles } from './auth-styles';

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  headerSubtitle?: string;
}

/** Estructura común de las pantallas de autenticación. */
export function AuthScreen({ title, subtitle, children, footer, headerSubtitle = 'Acceso' }: Props) {
  return (
    <SafeAreaView style={authStyles.screen} edges={[]}>
      <HeaderEpmaps subtitulo={headerSubtitle} />
      <KeyboardAvoidingView
        style={authStyles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        <ScrollView
          contentContainerStyle={authStyles.scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive">
          <View style={authStyles.card}>
            <Text style={authStyles.title}>{title}</Text>
            <Text style={authStyles.lead}>{subtitle}</Text>
            {children}
          </View>
          {footer}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
