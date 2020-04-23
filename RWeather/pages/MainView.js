import React, {Component} from 'react';
import Geolocation from '@react-native-community/geolocation';
import * as Constants from '../assets/constants/constants';
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  PermissionsAndroid,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';


export default class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      longitude: 'unknown',
      latitude: 'unknown',
      tempInCelcius: '',
      city: '',
      weatherIcon: require('../assets/image/condition/dunno.png'),
      displayedTemp: '',
      useMetrics: true,
      isNight: false,
    };
  }


  componentDidMount = () => {
    console.log('componentDidMount');
    this.props.navigation.addListener('willFocus', payload => {
      if (!payload || !payload.state.params) { 
        return;
      }
      
      const data = payload.state.params;
      
      if (!data) {
        console.error(`MainView: Error - Invalid data ${JSON.stringify(data)}`)
        return;
      }

      this.parseResponse(data);
    });

    let that = this;
    //Checking for the permission just after component loaded
    if (Platform.OS === 'ios') {
      this.getLocation();
    } else {
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            that.getLocation();
          } else {
            alert('Permission Denied');
          }
        } catch (err) {
          alert(err);
          console.warn(err);
        }
      }
      requestLocationPermission();
    }
  };

  componentWillUnmount = () => {
    Geolocation.clearWatch(this.watchID);
  };

  getLocation() {
    Geolocation.getCurrentPosition(
      position => {
        this.locationUpdated(position);
      },
      error => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    this.watchID = Geolocation.watchPosition(position => {
      this.locationUpdated(position);
    });
  }

  locationUpdated(position) {
    this.setState(
      prevState => ({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }),
      () => {
        this.getWeather();
      },
    );
  }

  getWeather() {
    const appId = Constants.WEATHER_APP_ID;
    const url =
      Constants.WEATHER_URL +
      '?lat=' +
      this.state.latitude +
      '&lon=' +
      this.state.longitude +
      '&units=metric&appid=' +
      appId;

    fetch(url)
      .then(async(response) => {
         // Handle 404 error in fetch
         if (response.status !== 200) {
          console.log("MainView: Error - Not 200 response");
          alert(`The city ${this.state.city} was unfound!`);
          return null;
        }

        // Otherwise we have data
        data = await response.json();

        // If data is invalid, exit early
        if (!data) {
          console.log(`MainView: Error - Received invalid data: ${JSON.stringify(data)}`)
          return;
        }

        console.log('MainView - data' + JSON.stringify(data));
        this.parseResponse(data);
      })
      .catch((error) => console.error(error));
  }


  //this.getDisplayedTemp(this.state.useMetrics),
  parseResponse = data => {
    let isNight = false;
    if (data.weather[0].icon.endsWith('n')) {
      isNight = true;
    }
    this.setState({
      tempInCelcius: data.main.temp,
      displayedTemp: `${Math.round(this.state.tempInCelcius)}`,
      city: data.name,
      weatherIcon: {
        uri: Constants.ICON_URL + data.weather[0].icon + '@2x.png',
      },
      isNight: isNight,
    });
  };

  getDisplayedTemp = (useMetrics) => {
    return (useMetrics == true) ?
      `${Math.round(this.state.tempInCelcius)}` :
      `${Math.round(this.state.tempInCelcius * 1.8 + 32.0)}`;
  };

  toggleMetrics = () => {
    const useMetrics = !this.state.useMetrics;
    const displayedTemp = this.getDisplayedTemp(useMetrics); 
    this.setState({useMetrics, displayedTemp});
  };

  render() {
    return (
      <ImageBackground
        source={require('../assets/image/weather.jpeg')}
        style={styles.backgroundView}>
        <View
          style={[
            styles.container,
            this.state.isNight ? styles.nightContainer : styles.container,
          ]}>
          <Image
            source={this.state.weatherIcon}
            style={{width: 150, height: 150}}
          />
          <TouchableOpacity
            style={styles.row}
            onPress={this.toggleMetrics}>
            <Text style={styles.largeText}>{this.state.displayedTemp} </Text>
            <Text
              style={[
                this.state.useMetrics ? styles.textActive : styles.textInactive,
              ]}>
              °C
            </Text>
            <Text style={styles.textActive}>/</Text>
            <Text
              style={[
                this.state.useMetrics ? styles.textInactive : styles.textActive,
              ]}>
              °F
            </Text>
          </TouchableOpacity>

          <Text style={styles.normalText}>{this.state.city}</Text>
        </View>
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  backgroundView: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    padding: 16,
    backgroundColor: 'transparent',
  },
  nightContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  normalText: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    color: 'black',
    fontSize: 42,
  },
  largeText: {
    fontSize: 48,
    color: 'black',
  },
  textInactive: {
    fontSize: 42,
    color: 'gray',
  },
  textActive: {
    fontSize: 42,
    color: 'black',
  },
});
