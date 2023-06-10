import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';

const UserScreen = ({ route }) => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [sex, setSex] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = route.params.userId;
        const response = await axios.get(`http://192.168.0.5:3000/employees/${userId}`);
        const userData = response.data;
        setUsername(userData.username);
        setFullName(userData.fullName);
        setPhoneNumber(userData.phoneNumber);
        setPassword(userData.password); 
        setBirthDate(userData.birthDate);
        setAddress(userData.address);
        setSex(userData.sex);
      } catch (error) {
        console.log('Error:', error);
      }
    };

    fetchUserData();
  }, [route.params.userId]);

  const handleUpdate = async () => {
    try {
      if (!username || !fullName || !sex || !phoneNumber || !birthDate || !address || !password) {
        console.log('Vui lòng điền đầy đủ thông tin.');
        return;
      }

      const userId = route.params.userId;
      await axios.put(`http://192.168.0.5:3000/employees/${userId}`, {
        username,
        password, 
        fullName,
        sex,
        phoneNumber,
        birthDate,
        address,
      });

      console.log('Cập nhật thành công.');
      Alert.alert('Update successfully');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>User Screen</Text>
      <CustomInput
        placeholder="Username"
        value={username}
        onChangeText={text => setUsername(text)}
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
        placeholder="Birth Date"
        value={birthDate}
        onChangeText={text => setBirthDate(text)}
      />
      <CustomInput
        placeholder="Address"
        value={address}
        onChangeText={text => setAddress(text)}
      />
      <CustomButton btnLabel="Update" onPress={handleUpdate}></CustomButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default UserScreen;
