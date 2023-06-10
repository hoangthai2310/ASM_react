import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert, Modal, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { FontAwesome5 } from '@expo/vector-icons';

const Employee = ({ employees, onDelete, onUpdate }) => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [sex, setSex] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');

  const handleUpdate = async () => {
    const employeeId = employees.id;
    const response = await axios.get(`http://192.168.0.5:3000/employees/${employeeId}`);
    const userData = response.data;
    setUsername(userData.username);
    setFullName(userData.fullName);
    setPhoneNumber(userData.phoneNumber);
    setBirthDate(userData.birthDate);
    setAddress(userData.address);
    setSex(userData.sex);
    setPassword(userData.password);
    // Hiển thị dialog cập nhật thông tin
    setIsModalVisible(true);
  };

  const handleSubmitUpdate = async () => {
    // Gọi API cập nhật thông tin
    try {
      const employeeId = employees.id;
      const updatedData = {
        username,
        password,
        fullName,
        sex,
        birthDate,
        phoneNumber,
        address
      };
      await axios.put(`http://192.168.0.5:3000/employees/${employeeId}`, updatedData);
      onUpdate();
      setIsModalVisible(false);
      Alert.alert('Cập nhật thành công');
    } catch (error) {
      console.log('Lỗi:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const employeeId = employees.id;
      await axios.delete(`http://192.168.0.5:3000/employees/${employeeId}`);
      onDelete();
      Alert.alert('Xoá thành công');
    } catch (error) {
      console.log('Lỗi:', error);
    }
  };

  return (
    <View style={styles.item}>
      <View style={styles.itemImageContainer}>
        {employees.sex === 'Nam' ? (
          <Image style={styles.itemImage} source={require('../assets/img/male.png')} resizeMode='contain' />
        ) : (
          <Image style={styles.itemImage} source={require('../assets/img/female.png')} resizeMode='contain' />
        )}
      </View>
      <View style={styles.right}>
        <Text>{employees.username}</Text>
        <Text>{employees.fullName}</Text>
        <Text>{employees.sex}</Text>
        <Text>{employees.birthDate}</Text>
        <Text>{employees.phoneNumber}</Text>
        <Text>{employees.address}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleUpdate} style={{marginRight: 10}}>
          <FontAwesome5 name='user-edit' size={25} color='black' />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <FontAwesome5 name='trash-alt' size={25} color='black' />
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} animationType='slide' transparent={true} >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cập nhật thông tin</Text>
            <TextInput
              style={styles.textInput}
              placeholder='User Name'
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.textInput}
              placeholder='Full name'
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput style={styles.textInput} placeholder='Giới tính' value={sex} onChangeText={setSex} />
            <TextInput
              style={styles.textInput}
              placeholder='Phone number'
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <TextInput
              style={styles.textInput}
              placeholder='Birth date'
              value={birthDate}
              onChangeText={setBirthDate}
            />
            <TextInput
              style={styles.textInput}
              placeholder='Adress'
              value={address}
              onChangeText={setAddress} />

            <View style={styles.buttonContainer}>
              <Button title='Cập nhật' onPress={handleSubmitUpdate} />
              <Button title='Hủy' onPress={() => setIsModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  itemImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  itemImage: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  item: {
    paddingVertical: 15,
    borderBottomColor: '#E2E2E2',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
  },
  right: {
    paddingLeft: 15,
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageButton: {
    width: 35,
    height: 35,
    marginHorizontal: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 350,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default Employee;
