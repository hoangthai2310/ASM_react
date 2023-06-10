import React, { useState } from 'react';
import { View, Text, Alert , StyleSheet} from 'react-native';
import axios from 'axios';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [sex, setSex] = useState('');
  const handleSignUp = async () => {
    // Kiểm tra validate
    if (!username || !password || !confirmPassword || !fullName || !phoneNumber) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password and confirm password do not match');
      return;
    }

    try {
      // Gọi API để kiểm tra xem username đã tồn tại hay chưa
      const response = await axios.get('http://192.168.0.5:3000/employees');
      const employeesList = response.data;

      const usernameExists = employeesList.some(employee => employee.username === username);
      if (usernameExists) {
        Alert.alert('Error', 'Username already exists');
        return;
      }

      // Tiến hành đăng ký
      // Gọi API để lưu dữ liệu mới vào database
      await axios.post('http://192.168.0.5:3000/employees', {
        username,
        password,
        fullName,
        sex,
        phoneNumber,
        birthDate,
        address,
      });

      Alert.alert('Success', 'Registration successful');
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  // const navigateBack = () => {
  //   // Trở về màn hình login
  //   navigation.navigate('Login');
  // };

  return (
    <View>
      <Text style={styles.text}>Sign In Screen</Text>
      <CustomInput
        placeholder="Username"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <CustomInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <CustomInput
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={text => setConfirmPassword(text)}
      />
      <CustomInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={text => setFullName(text)}
      />
       <CustomInput
        placeholder="Sex"
        value={sex}
        onChangeText={text => setSex(text)}
      />
      <CustomInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={text => setPhoneNumber(text)}
      />
       <CustomInput
        placeholder="BirthDate"
        value={birthDate}
        onChangeText={text => setBirthDate(text)}
      />
       <CustomInput
        placeholder="Adress"
        value={address}
        onChangeText={text => setAddress(text)}
      />
      
      <CustomButton btnLabel={'Register'} onPress={handleSignUp}></CustomButton>
    </View>
  );
};

export default SignUpScreen;
 const styles = StyleSheet.create({
  text: {
    alignItems: 'center',
    fontSize: 30,
    color: 'green',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center'
  }
 });