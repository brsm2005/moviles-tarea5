import { useForm } from '@tanstack/react-form';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

import { appAlert } from '@/components/app-alert';
import { AuthScreen } from '@/components/auth/auth-screen';
import { authStyles } from '@/components/auth/auth-styles';
import { PasswordField } from '@/components/auth/password-field';
import { PasswordRequirements } from '@/components/auth/password-requirements';
import { IndicadorSeguridadContrasena } from '@/components/auth/password-strength-indicator';
import { mensajeErrorAuth } from '@/features/auth/auth.errors';
import { getSession, registro } from '@/features/auth/auth.service';
import {
  calcularFortalezaContrasena,
  validarContrasena,
  validarEmail,
} from '@/features/auth/password';

export default function RegistroScreen() {
  const router = useRouter();

  useEffect(() => {
    let activo = true;
    getSession().then((s) => {
      if (activo && s) router.replace('/busqueda' as never);
    });
    return () => {
      activo = false;
    };
  }, [router]);

  const form = useForm({
    defaultValues: { email: '', password: '', confirmar: '' },
    onSubmit: async ({ value }) => {
      try {
        await registro(value.email, value.password);
        router.replace('/busqueda' as never);
        appAlert('Cuenta creada', 'Tu cuenta fue registrada correctamente.', 'success');
      } catch (error) {
        appAlert('No se pudo crear la cuenta', mensajeErrorAuth(error), 'error');
      }
    },
  });

  return (
    <AuthScreen
      title="Crear cuenta"
      subtitle="Registra tu correo electrónico y una contraseña segura para acceder a EPMAPS Campo."
      headerSubtitle="Registro"
      footer={
        <Pressable
          style={authStyles.footer}
          onPress={() => router.replace('/' as never)}>
          <Text style={authStyles.footerText}>
            ¿Ya tienes una cuenta?{' '}
            <Text style={authStyles.footerLink}>Inicia sesión</Text>
          </Text>
        </Pressable>
      }>
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => validarEmail(value),
          onSubmit: ({ value }) => validarEmail(value),
        }}>
        {(field) => (
          <View style={authStyles.group}>
            <Text style={authStyles.label}>Correo electrónico</Text>
            <TextInput
              style={[
                authStyles.input,
                field.state.meta.errors.length > 0 && authStyles.inputError,
              ]}
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              placeholder="tecnico@epmaps.gob.ec"
              placeholderTextColor="#94A3B8"
            />
            {(field.state.meta.isTouched || form.state.submissionAttempts > 0) &&
              field.state.meta.errors.length > 0 && (
              <Text style={authStyles.error}>{String(field.state.meta.errors[0])}</Text>
            )}
          </View>
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => validarContrasena(value),
          onSubmit: ({ value }) => validarContrasena(value),
        }}>
        {(field) => (
          <View style={authStyles.group}>
            <Text style={authStyles.label}>Contraseña</Text>
            <PasswordField
              hasError={field.state.meta.errors.length > 0}
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              autoComplete="new-password"
              textContentType="newPassword"
              placeholder="Crea una contraseña segura"
            />
            <IndicadorSeguridadContrasena
              fortaleza={calcularFortalezaContrasena(field.state.value)}
            />
            {(field.state.meta.isTouched || form.state.submissionAttempts > 0) &&
              field.state.meta.errors.length > 0 && (
              <Text style={authStyles.error}>{String(field.state.meta.errors[0])}</Text>
            )}
            <PasswordRequirements value={field.state.value} />
          </View>
        )}
      </form.Field>

      <form.Field
        name="confirmar"
        validators={{
          onChange: ({ value, fieldApi }) => {
            if (!value) return 'Confirma tu contraseña';
            if (value !== fieldApi.form.getFieldValue('password')) {
              return 'Las contraseñas no coinciden';
            }
            return undefined;
          },
          onSubmit: ({ value, fieldApi }) => {
            if (!value) return 'Confirma tu contraseña';
            if (value !== fieldApi.form.getFieldValue('password')) {
              return 'Las contraseñas no coinciden';
            }
            return undefined;
          },
        }}>
        {(field) => (
          <View style={authStyles.group}>
            <Text style={authStyles.label}>Confirmar contraseña</Text>
            <PasswordField
              hasError={field.state.meta.errors.length > 0}
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              autoComplete="new-password"
              textContentType="newPassword"
              placeholder="Repite la contraseña"
            />
            {(field.state.meta.isTouched || form.state.submissionAttempts > 0) &&
              field.state.meta.errors.length > 0 && (
              <Text style={authStyles.error}>{String(field.state.meta.errors[0])}</Text>
            )}
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
              <Text style={authStyles.buttonText}>Registrarme</Text>
            )}
          </Pressable>
        )}
      </form.Subscribe>
    </AuthScreen>
  );
}
