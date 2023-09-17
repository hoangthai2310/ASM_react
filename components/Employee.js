import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert, Modal, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { FontAwesome5 } from '@expo/vector-icons';
import { CheckBox } from 'react-native-elements';
import { isValid, parse } from 'date-fns';

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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [imageURL , setImageURL] = useState(null); // Lưu URL ảnh từ API
  const [base64Image , setBase64Image] = useState(null); // Lưu base64 của ảnh

  useEffect(() => {
    if (selectedIndex === 0) {
      setSex('Male');
    } else if (selectedIndex === 1) {
      setSex('Female');
    }
  }, [selectedIndex]);

  useEffect(() => {
    // Khi component được tạo, gọi API để lấy dữ liệu nhân viên
    const fetchData = async () => {
      try {
        const employeeId = employees.id;
        const response = await axios.get(`http://172.20.10.3:3000/employees/${employeeId}`);
        const userData = response.data;

        // Lấy URL ảnh từ API
        setImageURL(userData.image || null);
        setUsername(userData.username);
        setFullName(userData.fullName);
        setPhoneNumber(userData.phoneNumber);
        setBirthDate(userData.birthDate);
        setAddress(userData.address);
        setSex(userData.sex);
        if (userData.sex === 'Male') {
          setSelectedIndex(0);
        } else if (userData.sex === 'Female') {
          setSelectedIndex(1);
        }
        setPassword(userData.password);
      } catch (error) {
        console.log('Lỗi:', error);
      }
    };

    fetchData();
  }, [employees.id]);

  const handleUpdate = async () => {
    // Hiển thị dữ liệu lên TextInput và checkBox
    if (sex === 'Male') {
      setSelectedIndex(0);
    } else if (sex === 'Female') {
      setSelectedIndex(1);
    }
    setIsModalVisible(true);
  };

  // Kiểm tra số điện thoại
  const isPhoneNumberValid = () => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmitUpdate = async () => {
    // Kiểm tra validate
    if (!username || !password || !fullName || !phoneNumber || !birthDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Kiểm tra định dạng ngày tháng
    const parsedDate = parse(birthDate, 'dd/MM/yyyy', new Date());
    if (!isValid(parsedDate)) {
      Alert.alert('Error', 'Invalid date format. Please enter date in the format dd/mm/yyyy');
      return;
    }

    // Kiểm tra định dạng số điện thoại
    if (!isPhoneNumberValid()) {
      Alert.alert('Error', 'Invalid phone number format. Phone number must be 10 digits long');
      return;
    }

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
        address,
      };
      await axios.put(`http://172.20.10.3:3000/employees/${employeeId}`, updatedData);
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
      await axios.delete(`http://172.20.10.3:3000/employees/${employeeId}`);
      onDelete();
      Alert.alert('Xoá thành công');
    } catch (error) {
      console.log('Lỗi:', error);
    }
  };

  return (
    <View style={styles.item}>
      <View style={styles.itemImageContainer}>
        {imageURL ? (
          <Image style={styles.itemImage} source={{ uri: imageURL }} resizeMode='cover' />
        ) : (
          <Image style={styles.itemImage} source={require('../assets/img/male.png')} resizeMode='contain' />
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
        <TouchableOpacity onPress={handleUpdate} style={{ marginRight: 10 }}>
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
            <View style={{ flexDirection: 'row', backgroundColor: 'while', alignItems: 'center' }}>
              <CheckBox
                title='Male'
                checked={selectedIndex === 0}
                onPress={() => setSelectedIndex(0)}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
              />
              <CheckBox
                title='Female'
                checked={selectedIndex === 1}
                onPress={() => setSelectedIndex(1)}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
              />
            </View>
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
    borderRadius: 100, // Sử dụng borderRadius để làm tròn thành hình tròn
    overflow: 'hidden',
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
