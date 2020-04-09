import { createAppContainer } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import LoginScreen from '../components/LoginScreen';
import EventsOverviewScreen from '../components/EventsOverviewScreen';
import EventDetailScreen from '../components/EventDetailScreen';
import TrackEventsList from '../components/TrackEventsList';
const AppNavigator = createStackNavigator(
  {
    Login: { screen: LoginScreen },
    EventsOverview: { screen: EventsOverviewScreen },
    EventDetail: { screen: EventDetailScreen},
    TrackEvents: { screen: TrackEventsList}
  },
  {
    initialRouteName: "Login",
    navigationOptions: {
        gesturesEnabled: false,
    },
  },
);

export default createAppContainer(AppNavigator);