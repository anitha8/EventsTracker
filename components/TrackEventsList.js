import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Colors from '../assets/Colors';

class TrackEventsList extends Component {
  render() {
    return(
      <View style={styles.container}>
        <FlatList
          data={this.props.data}
          initialNumToRender={10}
          style={styles.subList}
          renderItem={this.props.renderItem}
          key={this.props.itemsPerRow}
          numColumns={this.props.itemsPerRow}
          keyExtractor={item => item.eventName}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
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
  subList: {
    marginTop: 15,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.grey,
  }
});

export default TrackEventsList;