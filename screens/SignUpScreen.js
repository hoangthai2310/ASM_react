import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, Image, Button, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { CheckBox } from 'react-native-elements';
import { isValid, parse } from 'date-fns';
import * as ImagePicker from 'expo-image-picker';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [sex, setSex] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [imageSource, setImageSource] = useState(null);
  const [base64Image, setBase64Image] = useState('');

  const defaultMaleImage = require('../assets/img/male.png');
const defaultFemaleImage = require('../assets/img/female.png');
  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please allow access to your photo library to choose an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const imageUri = result.uri;
      const base64String = await convertToBase64(imageUri);
      setBase64Image(base64String); // Lưu base64String
      setImageSource({ uri: imageUri });
    }
  };

  const convertToBase64 = async (imageUri) => {
    const base64String = await fetch(imageUri)
      .then((response) => response.blob())
      .then((blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      });

    return base64String;
  };

  useEffect(() => {
    if (selectedIndex === 0) {
      setSex('Male');
    } else if (selectedIndex === 1) {
      setSex('Female');
    }
  }, [selectedIndex]);

  const isPhoneNumberValid = () => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSignUp = async () => {
    if (!username || !password || !confirmPassword || !fullName || !phoneNumber || !birthDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password and confirm password do not match');
      return;
    }

    const parsedDate = parse(birthDate, 'dd/MM/yyyy', new Date());
    if (!isValid(parsedDate)) {
      Alert.alert('Error', 'Invalid date format. Please enter date in the format dd/mm/yyyy');
      return;
    }

    if (!isPhoneNumberValid()) {
      Alert.alert('Error', 'Invalid phone number format. Phone number must be 10 digits long');
      return;
    }

    try {
      const response = await axios.get('http://172.20.10.3:3000/employees');
      const employeesList = response.data;
      const usernameExists = employeesList.some((employee) => employee.username === username);
      if (usernameExists) {
        Alert.alert('Error', 'Username already exists');
        return;
      }

      await axios.post('http://172.20.10.3:3000/employees', {
        username,
        password,
        fullName,
        sex,
        phoneNumber,
        birthDate,
        address,
        image: base64Image, // Sử dụng base64String đã lưu

      });

      Alert.alert('Success', 'Registration successful');
      setAddress('');
      setBirthDate('');
      setFullName('');
      setConfirmPassword('');
      setPassword('');
      setUsername('');
      setPhoneNumber('');
      setSelectedIndex(-1);
      setBase64Image(null); // Đặt base64Image về rỗng sau khi gửi lên API
      setImageSource(null);
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Điều này giúp thay đổi vị trí màn hình khi bàn phím hiển thị
  >
    <ScrollView contentContainerStyle={styles.container}>
  
      {imageSource && (
        <Image source={imageSource || (sex === 'Male' ? defaultMaleImage : defaultFemaleImage)} style={styles.image} resizeMode="cover" />
      )}
      <Button title="Choose Image" onPress={selectImage} />
      <CustomInput placeholder="Username" value={username} onChangeText={text => setUsername(text)} />
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
      <CustomInput placeholder="Full Name" value={fullName} onChangeText={text => setFullName(text)} />
      <View style={{ flexDirection: 'row', backgroundColor: 'white', alignItems: 'center' }}>
        <CheckBox
          title="Male"
          checked={selectedIndex === 0}
          onPress={() => setSelectedIndex(0)}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
        />
        <CheckBox
          title="Female"
          checked={selectedIndex === 1}
          onPress={() => setSelectedIndex(1)}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
        />
      </View>
      <CustomInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={text => setPhoneNumber(text)}
      />
      <CustomInput placeholder="BirthDate"
        value={birthDate}
        onChangeText={text => setBirthDate(text)}
      />
      <CustomInput placeholder="Address"
        value={address}
        onChangeText={text => setAddress(text)}
      />
      <CustomButton btnLabel={'Register'} onPress={handleSignUp} />
      </ScrollView>
      <View style={styles.bottomContent}>
        <TouchableOpacity onPress={() => {/* Xử lý khi người dùng chạm vào phần dưới màn hình */}}>
          <Text>Additional Content</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Sử dụng flex để căn giữa theo cả chiều dọc và ngang
    justifyContent: 'center', // Căn giữa theo chiều dọc
    alignItems: 'center', // Căn giữa theo chiều ngang
    paddingLeft: 10 ,
    paddingRight: 10 
    },
  text: {
    alignItems: 'center',
    fontSize: 30,
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
 
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginTop: 10
  },
});
