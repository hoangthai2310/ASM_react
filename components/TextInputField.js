import React from 'react';
import { TextInput } from 'react-native';

const TextInputField = ({ placeholder, value, onChangeText }) => {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  );
};

export default TextInputField;
