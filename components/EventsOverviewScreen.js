import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import EventListScreen from './EventListScreen';
import TrackEventsList from './TrackEventsList';
import Swipeable from './Swipeable';
import Colors from '../assets/Colors';
import Texts from '../assets/Texts';

const events = require('../assets/data.json');

class EventsOverviewScreen extends Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerTitleStyle: {
        fontWeight: 'bold'
      },
      headerTitle: Texts.headerTitle,
      headerRight: () => (
        <View style={styles.header}>
          <Button
            title={Texts.toggle}
            onPress={params.handleToggle}
          />
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      itemsPerRow: 1,
      activeTab: 0,
      data: {},
      trackEvents: {}
    };
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', async() => {
      let trackEvents = await AsyncStorage.getItem('trackEvents');
      trackEvents = JSON.parse(trackEvents);
      this.setState({trackEvents});
    });
    this.setState({
      data: events,
    });
    this.props.navigation.setParams({ handleToggle: this.toggleView });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  toggleView = () => {
    if (this.state.itemsPerRow == 1) {
      this.setState({itemsPerRow: 2});
    } else this.setState({itemsPerRow: 1});
  };

  handleChangeIndex = (index) => {
    this.setState({ activeTab: index });
  };

  renderRow = ({item}) => {
    return (
      <View style={styles.listContainer}>
        <TouchableOpacity
          key={item}
          onPress={() => {
            this.props.navigation.navigate('EventDetail', {
              eventId: item.eventId,
              eventName: item.eventName,
              location: item.location,
              fee: item.fee,
            });
          }}>
          <EventListScreen
            eventId={item.eventId}
            eventName={item.eventName}
            location={item.location}
            fee={item.fee}>
          </EventListScreen>
        </TouchableOpacity>
      </View>
    )
  }
  render() {
    return (
      <View>
        <Swipeable index={this.state.activeTab} onChangeIndex={this.handleChangeIndex}>
          <View style={[styles.container, styles.swipeable]}>
            <FlatList
              data={this.state.data.events}
              initialNumToRender={10}
              style={styles.subList}
              renderItem={this.renderRow}
              key={this.state.itemsPerRow}
              numColumns={this.state.itemsPerRow}
              keyExtractor={item => item.eventName}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
          <View style={styles.swipeable}>
            <TrackEventsList 
              data={this.state.trackEvents}
              itemsPerRow={this.state.itemsPerRow}
              renderItem={this.renderRow}/>
          </View>
        </Swipeable>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: Colors.white,
      justifyContent: 'center',
      padding: 15
  },
  listContainer: {
    flex: 1,
  },
  subList: {
    marginTop: 15,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.grey,
  },
  header: {
    paddingRight: 10
  },
  headerButton: {
    color: Colors.white,
  },
  swipeable: {
    height: '100%'
  },
});

export default EventsOverviewScreen;