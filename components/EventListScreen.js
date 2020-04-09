import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { iconsForEvents } from '../assets/icons';

class EventListScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={iconsForEvents[this.props.eventId]}
          style={styles.listImg}>
        </ImageBackground>
        <View>
          <Text style={styles.textStyle}>
            {this.props.eventName}
          </Text>
          <Text style={styles.textStyleLocation}>
            {this.props.location}
          </Text>
          <Text style={styles.textStyleFee}>
            {this.props.fee}
          </Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 10
  },
  textStyle: {
    flexWrap: 'wrap',
    fontSize: 25,
    fontWeight: "bold"
  },
  textStyleLocation: {
    fontSize: 20
  },
  textStyleFee: {
    fontSize: 15
  },
  listImg: {
    width: '100%',
    height: 100,
  }
});
export default EventListScreen;