import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Employee from '../components/Employee';
import log from '../Log';
const AdminScreen = () => {
  const [employeeList, setEmployeeList] = useState([]);

  async function getListEmployee() {
    try {
      const API_URL = 'http://192.168.0.5:3000/employees';
      const response = await fetch(API_URL);
      const data = await response.json();
      setEmployeeList(data);
      log.info('====> employees:', JSON.stringify(data));
      return data;
    } catch (error) {
      log.error('Fetch data failed ' + error);
      return null;
    }
  }
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://192.168.0.5:3000/employees');
      const employeesData = response.data;
      setEmployees(employeesData);
    } catch (error) {
      console.log('Lỗi:', error);
    }
  };

  const onDeleteEmployee = async () => {
    await getListEmployee();
  };
  const onUpdateEmployee = async () => {
    await getListEmployee();
  };

  useEffect(() => {
    console.log('useEffect has been called!');
    getListEmployee();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollView}>
        <View>
          <Text style={styles.txtHeader}>List Employer</Text>
        </View>
        <View style={styles.employeeContainer}>
          {employeeList.map((item, index) => {
            return (<Employee employees={item} key={index} onDelete={onDeleteEmployee} onUpdate={onUpdateEmployee}/>) ;
            
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flexGrow: 1,
    padding: 20
  },
  txtHeader: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  employeeContainer: {
    flex: 1
  },
});

export default AdminScreen;
