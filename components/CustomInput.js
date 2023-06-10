import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';

const CustomInput = ({ placeholder, value, onChangeText, secureTextEntry }) => {
    return (
        <View style={styles.container}>
            <TextInput
                 autoCapitalize='none' 
                 style={styles.input}
                 placeholder={placeholder}
                 value={value}
                 onChangeText={onChangeText}
                 secureTextEntry={secureTextEntry}
            />
        </View>
    );
};

export default CustomInput;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 5
    },
    input: {
        width: '80%',
        height: 50
    }
});