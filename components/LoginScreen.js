import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import Colors from '../assets/Colors';
import Texts from '../assets/Texts';
import AsyncStorage from '@react-native-community/async-storage';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: ''
    };
  }

  async componentDidMount() {
    try {
      let userName = await AsyncStorage.getItem('userName');
      if (userName != null) {
        this.props.navigation.replace('EventsOverview');
      }
    } catch(cause) {
      console.log(cause);
    }
  }

  showEvents = async() => {
    try {
      let userName = await AsyncStorage.getItem('userName');
      if (userName != null) {
        this.props.navigation.replace('EventsOverview');
      }
    } catch(cause) {
      console.log(cause);
    }
  };

  setUserName = async(userName) => {
    try {
      this.setState({userName})
      await AsyncStorage.setItem('userName', this.state.userName.trim());
    } catch(cause) {
      console.log(cause);
    }
  };

  render() {
    return (
      <View 
        style = {styles.container} >
        <Text style = {styles.textStyle}>{Texts.userNameText}</Text>
        <TextInput
          placeholder="Name"
          placeholderTextColor={Colors.mediumGrey}
          onChangeText={this.setUserName}
          style={styles.textStyle}
          returnKeyType={"done"}
          autoCapitalize={"none"}
          autoCorrect={false}
          autoFocus={true}
        />
        <Button 
          title={Texts.login}
          onPress={this.showEvents}
          style={styles.buttonStyle} />
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: Colors.white,
      justifyContent: 'center',
      alignItems: 'center'
  },
  textStyle: {
    fontSize: 30,
    fontWeight: "bold"
  },
  textInputStyle: {
    fontSize: 20,
    marginTop: 40,
    marginBottom: 40
  },
  buttonStyle: {
    fontSize: 20
  }
});

export default LoginScreen;