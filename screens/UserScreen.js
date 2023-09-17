import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity  } from 'react-native';
import axios from 'axios';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { CheckBox } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';

const UserScreen = ({ route }) => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [sex, setSex] = useState('');
  const [imageUpload, setImageUpload] = useState(null); 
  const [base64Image, setBase64Image] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    if (selectedIndex === 0) {
      setSex('Male');
    } else if (selectedIndex === 1) {
      setSex('Female');
    }
  }, [selectedIndex]);

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
    if (!result.cancelled) {
      const imageUri = result.uri;
      const base64String = await convertToBase64(imageUri);
      setBase64Image(base64String);
      setImageUpload({ uri: imageUri });
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
    const fetchUserData = async () => {
      try {
        const userId = route.params.userId;
        const response = await axios.get(`http://172.20.10.3:3000/employees/${userId}`);
        const userData = response.data;
        setUsername(userData.username);
        setFullName(userData.fullName);
        setPhoneNumber(userData.phoneNumber);
        setPassword(userData.password);
        setBirthDate(userData.birthDate);
        setAddress(userData.address);
        setSex(userData.sex);
        if (userData.sex === 'Male') {
          setSelectedIndex(0);
        } else if (userData.sex === 'Female') {
          setSelectedIndex(1);
        }
        setImageUpload({ uri: userData.image });
      } catch (error) {
        console.log('Error:', error);
      }
    };

    fetchUserData();
  }, [route.params.userId]);

  const handleUpdate = async () => {
    try {
      if (!username || !fullName || !sex || !phoneNumber || !birthDate || !address || !password) {
        Alert.alert('Missing Information', 'Please fill in all fields.');
        return;
      }

      const userId = route.params.userId;
      await axios.put(`http://172.20.10.3:3000/employees/${userId}`, {
        username,
        password,
        fullName,
        sex,
        phoneNumber,
        birthDate,
        address,
        image: base64Image,
      });

      console.log('Cập nhật thành công.');
      Alert.alert('Update successfully');
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Update failed', 'An error occurred while updating. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>User Screen</Text>
      <TouchableOpacity onPress={selectImage} style={{alignItems: 'center'}} >
        {imageUpload ? (
          <Image source={{ uri: imageUpload.uri }} style={styles.image} resizeMode="cover" />
        ) : (
          <Image source={require('../assets/img/male.png')} style={styles.image} resizeMode="cover" />
        )}
        <Text style={styles.chooseImageText}>Choose Image</Text>
      </TouchableOpacity>

      <CustomInput
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <CustomInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={(text) => setFullName(text)}
      />
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
        onChangeText={(text) => setPhoneNumber(text)}
      />
      <CustomInput
        placeholder="Birth Date"
        value={birthDate}
        onChangeText={(text) => setBirthDate(text)}
      />
      <CustomInput
        placeholder="Address"
        value={address}
        onChangeText={(text) => setAddress(text)}
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
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginTop: 10,
  },
  chooseImageText: {
    marginTop: 8,
    color: 'blue',
    textDecorationLine: 'underline',
    alignItems: 'center'
  },
});

export default UserScreen;
