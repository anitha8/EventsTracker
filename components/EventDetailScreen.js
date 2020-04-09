import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import Colors from '../assets/Colors';
import AsyncStorage from '@react-native-community/async-storage';
import { iconsForEvents } from '../assets/icons';

export default class EventDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackStatus: false,
      trackEvent: {}
    };
    this.event = {
      eventId: this.props.navigation.getParam('eventId'),
      eventName: this.props.navigation.getParam('eventName'),
      location: this.props.navigation.getParam('location'),
      fee: this.props.navigation.getParam('fee')
    };
  }

  async componentDidMount() {
    try {
      let trackEvents = await AsyncStorage.getItem('trackEvents');
      trackEvents = JSON.parse(trackEvents);
      let status = trackEvents.filter(item => item.eventName === this.event.eventName)
      if (status && status.length > 0) {
        this.setState({trackStatus: true});
      } else {
        this.setState({trackStatus: false});
      }
    } catch (cause) {
      console.log(cause);
    }
  }

  trackEvent = async() => {
    try {
      this.setState({trackStatus: !this.state.trackStatus});
      let trackEvents = await AsyncStorage.getItem('trackEvents');
      trackEvents = JSON.parse(trackEvents);
      if (trackEvents == null) {
        trackEvents = [];
      }
      if (this.state.trackStatus) {
        trackEvents.push(this.event);
      } else {
          trackEvents = trackEvents.filter(item => item.eventName !== this.event.eventName)
      }
      await AsyncStorage.setItem('trackEvents', JSON.stringify(trackEvents));
    } catch (cause) {
      console.log(cause);
    }
  }

  render() {
    const buttonName = !this.state.trackStatus ? 'Track Event' : 'Untrack Event';
    return (
      <View style={styles.container}>
          <Image
            source={iconsForEvents[this.event.eventId]}
            style={styles.img}>
          </Image>
          <Text style={styles.textStyle}>
            {this.event.eventName}
          </Text>
          <View style={styles.textContainer}>
            <Text style={styles.textLocStyle}>
              Location : {this.event.location}
            </Text>
            <Text style={styles.textFeeStyle}>
              Entry : {this.event.fee}
            </Text>
            <Button
              onPress={this.trackEvent}
              title={buttonName}></Button>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: Colors.white,
      flexDirection: 'column'
  },
  textContainer: {
    flex: 1,
    marginLeft: 30,
    marginRight: 30
  },
  textStyle: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 80,
    textAlign: 'center'
  },
  textLocStyle: {
    fontSize: 20,
    marginTop: 40,
    textAlign: 'left'
  },
  textFeeStyle: {
    fontSize: 20,
    marginTop: 40,
    marginBottom: 80,
    textAlign: 'left'
  },
  img: {
    width: '100%',
    height: 100,
  }
});