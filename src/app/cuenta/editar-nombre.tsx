import { useForm } from '@tanstack/react-form';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

import { appAlert } from '@/components/app-alert';
import { AnimatedSpinner } from '@/components/animations/animated-spinner';
import { AuthScreen } from '@/components/auth/auth-screen';
import { AUTH_COLORS, authStyles } from '@/components/auth/auth-styles';
import { mensajeErrorAuth } from '@/features/auth/auth.errors';
import { actualizarNombre, getSession, type Session } from '@/features/auth/auth.service';
import { DISPLAY_NAME_MAX_LENGTH, validarNombre } from '@/features/auth/profile';

export default function EditarNombreScreen() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    let activo = true;
    getSession().then((s) => {
      if (activo) setSession(s);
    });
    return () => {
      activo = false;
    };
  }, []);

  if (session === undefined) {
    return (
      <View style={[authStyles.screen, { alignItems: 'center', justifyContent: 'center' }]}>
        <AnimatedSpinner size={48} color={AUTH_COLORS.primary} />
      </View>
    );
  }

  if (session === null) return <Redirect href={'/' as never} />;

  return <EditarNombreForm session={session} />;
}

function EditarNombreForm({ session }: { session: Session }) {
  const router = useRouter();
  const [nombreActual, setNombreActual] = useState(session.displayName ?? '');

  const form = useForm({
    defaultValues: { nombre: session.displayName ?? '' },
    onSubmit: async ({ value }) => {
      try {
        const actualizada = await actualizarNombre(value.nombre);
        const nombre = actualizada.displayName ?? '';
        setNombreActual(nombre);
        form.setFieldValue('nombre', nombre);
        appAlert(
          'Nombre actualizado',
          `Tu nombre ahora es "${nombre}".`,
          'success',
          [
            {
              texto: 'Volver a la búsqueda',
              onPress: () => router.replace('/busqueda' as never),
            },
          ],
        );
      } catch (error) {
        appAlert('No se pudo actualizar el nombre', mensajeErrorAuth(error), 'error');
      }
    },
  });

  return (
    <AuthScreen
      title="Editar nombre"
      subtitle="Actualiza el nombre que se muestra en tu cuenta de EPMAPS Campo."
      headerSubtitle="Mi cuenta"
      footer={
        <Pressable style={authStyles.footer} onPress={() => router.replace('/busqueda' as never)}>
          <Text style={authStyles.footerText}>
            <Text style={authStyles.footerLink}>Volver a la búsqueda</Text>
          </Text>
        </Pressable>
      }>
      <View style={authStyles.sessionBox}>
        <Text style={authStyles.sessionLabel}>Cuenta</Text>
        <Text style={authStyles.sessionValue}>{session.email}</Text>
        {!!nombreActual && (
          <>
            <Text style={[authStyles.sessionLabel, { marginTop: 10 }]}>Nombre actual</Text>
            <Text style={authStyles.sessionValue}>{nombreActual}</Text>
          </>
        )}
      </View>

      <form.Field
        name="nombre"
        validators={{
          onChange: ({ value }) => validarNombre(value),
          onSubmit: ({ value }) => validarNombre(value),
        }}>
        {(field) => (
          <View style={authStyles.group}>
            <Text style={authStyles.label}>Nombre del usuario</Text>
            <TextInput
              style={[
                authStyles.input,
                field.state.meta.errors.length > 0 && authStyles.inputError,
              ]}
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              maxLength={DISPLAY_NAME_MAX_LENGTH}
              autoCapitalize="words"
              autoCorrect={false}
              textContentType="name"
              autoComplete="name"
              placeholder="Ej. Bryan Salvador"
              placeholderTextColor="#94A3B8"
            />
            {(field.state.meta.isTouched || form.state.submissionAttempts > 0) &&
              field.state.meta.errors.length > 0 && (
              <Text style={authStyles.error}>{String(field.state.meta.errors[0])}</Text>
            )}
            <Text style={authStyles.hint}>
              El nombre se guarda con updateProfile de Firebase en tu cuenta autenticada.
            </Text>
          </View>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
        {([canSubmit, isSubmitting]) => (
          <Pressable
            style={({ pressed }) => [
              authStyles.button,
              (!canSubmit || isSubmitting) && authStyles.buttonDisabled,
              pressed && { opacity: 0.85 },
            ]}
            disabled={!canSubmit || isSubmitting}
            onPress={() => form.handleSubmit()}>
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={authStyles.buttonText}>Guardar nombre</Text>
            )}
          </Pressable>
        )}
      </form.Subscribe>
    </AuthScreen>
  );
}
