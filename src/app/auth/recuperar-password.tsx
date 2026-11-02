import { useForm } from '@tanstack/react-form';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

import { appAlert } from '@/components/app-alert';
import { AuthScreen } from '@/components/auth/auth-screen';
import { authStyles } from '@/components/auth/auth-styles';
import { mensajeErrorAuth } from '@/features/auth/auth.errors';
import { recuperarContrasena } from '@/features/auth/auth.service';
import { validarEmail } from '@/features/auth/password';

export default function RecuperarContrasenaScreen() {
  const router = useRouter();

  const form = useForm({
    defaultValues: { email: '' },
    onSubmit: async ({ value }) => {
      try {
        await recuperarContrasena(value.email);
        appAlert(
          'Correo enviado',
          `Enviamos un enlace para restablecer la contraseña a ${value.email.trim().toLowerCase()}. Revisa tu bandeja de entrada y spam.`,
          'success',
          [{ texto: 'Entendido' }],
        );
      } catch (error) {
        appAlert('No se pudo enviar el correo', mensajeErrorAuth(error), 'error');
      }
    },
  });

  return (
    <AuthScreen
      title="Recuperar contraseña"
      subtitle="Ingresa el correo de tu cuenta y te enviaremos un enlace para restablecer la contraseña."
      headerSubtitle="Recuperar acceso"
      footer={
        <Pressable style={authStyles.footer} onPress={() => router.replace('/' as never)}>
          <Text style={authStyles.footerText}>
            ¿Recordaste tu contraseña?{' '}
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
            <Text style={authStyles.hint}>
              El enlace lo envía Firebase Auth y llegará en español.
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
              <Text style={authStyles.buttonText}>Enviar enlace</Text>
            )}
          </Pressable>
        )}
      </form.Subscribe>
    </AuthScreen>
  );
}
