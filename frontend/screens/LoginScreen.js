import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ImageBackground } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  const handleLoginSuccess = async (token) => {
    try {
      // Store the authentication token in AsyncStorage
      await AsyncStorage.setItem('authToken', token);
      // Navigate to the BottomTabNavigator screen
      navigation.replace('Bottom'); 
    } catch (error) {
      Alert.alert('Error', 'Failed to store authentication token.');
    }
  };

  const handleSubmit = () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please enter both email and password.');
      return;
    }
    const userData = {
      email: email,
      password: password,
    };
    axios.post('http://10.0.2.2:5000/login', userData)
      .then(res => {
        console.log(res.data);
        if (res.data.status === 'ok') {
          // Alert.alert('Logged In Successfully');
          handleLoginSuccess(res.data.data); // Pass the token to handleLoginSuccess
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          Alert.alert('Login Failed', error.response.data.error); // Displaying error message from backend
        } else {
          Alert.alert('An error occurred. Please try again.');
        }
      });
  };
  
  return (
    <ImageBackground
      source={require('../assets/bg2.png')}
      style={styles.background}
      imageStyle={{opacity: 0.1}}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          label="Email"
          style={styles.input}
          mode="outlined"
          placeholder="Enter your email"
          value={email}
          onChangeText={text => setEmail(text)} // Changed from onChange to onChangeText
          required
        />
        <TextInput
          label="Password"
          style={styles.input}
          mode="outlined"
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)} // Changed from onChange to onChangeText
          required
        />
        <Button mode="contained" onPress={handleSubmit} style={styles.button}> {/* Changed to call handleSubmit */}
          Login
        </Button>
        <Text style={styles.signupText}>New User? <Text style={styles.signupLink} onPress={handleSignUpPress}>Sign Up</Text></Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000', // White color for text
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF', // White background for input
  },
  button: {
    marginTop: 20,
    backgroundColor: '#000000', // Black background for button
  },
  signupText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#000000', // White color for text
  },
  signupLink: {
    color: 'red', // Yellow color for link
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
