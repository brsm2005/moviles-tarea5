import { useState } from 'react';
import { Pressable, Text, TextInput, type TextInputProps, View } from 'react-native';

import { authStyles } from './auth-styles';

type Props = Omit<TextInputProps, 'style' | 'secureTextEntry'> & {
  hasError?: boolean;
};

/** Campo de contraseña con opción para mostrar u ocultar el texto. */
export function PasswordField({ hasError, ...props }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={[authStyles.inputRow, hasError && authStyles.inputError]}>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="#94A3B8"
        {...props}
        style={authStyles.inputInner}
        secureTextEntry={!visible}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        hitSlop={10}
        onPress={() => setVisible((v) => !v)}>
        <Text style={authStyles.toggle}>{visible ? 'Ocultar' : 'Ver'}</Text>
      </Pressable>
    </View>
  );
}
