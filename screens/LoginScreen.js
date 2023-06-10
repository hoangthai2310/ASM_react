import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userResponse = await axios.get('http://192.168.0.5:3000/users');
      const userList = userResponse.data;

      const employeesResponse = await axios.get('http://192.168.0.5:3000/employees');
      const employeesList = employeesResponse.data;

      const userFound = userList.find(user => user.username === username && user.password === password);
      const employeeFound = employeesList.find(employee => employee.username === username && employee.password === password);

      if (userFound) {
        navigation.navigate('Admin');
        Alert.alert('successfully logged in with admin rights');
      } else if (employeeFound) {
        const employeeId = employeeFound.id;
        navigation.navigate('User', { userId: employeeId });
        Alert.alert('successfully logged in with employee rights');
      } else {
        Alert.alert('Invalid username or password');
      }
    setPassword('');
    setUsername('');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const register = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View>
      <Text style={styles.text}>Login Screen</Text>
      <View style={styles.input}>
        <TextInput
          style={styles.textinput}
          placeholder="Username"
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <TextInput
          style={styles.textinput}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
      </View>
      <View style={styles.container}>
        <Button onPress={handleLogin} title="Login" />
        <Button onPress={register} title="Sign In" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 1,
    borderColor: 'blue',
    marginVertical: 5,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center'
  },
  text: {
    alignItems: 'center',
    fontSize: 30,
    color: 'red',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center'
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5
  },
  textinput: {
    width: '80%',
    height: 50
  }
});

export default LoginScreen;
