import React, { Component } from 'react';
import { 
  StyleSheet,
  TextInput,
  ImageBackground,
  View
} from 'react-native';
import * as Constants from '../assets/constants/constants'; 

export default class SearchView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      data: null
    }
  }

  processData() {
    const appId = Constants.WEATHER_APP_ID;
    const url = `${Constants.WEATHER_URL}?q=${this.state.city}&appid=${appId}&units=metric`;

    console.log('SearchView: Preparing to post data...')
    fetch(url)
      .then(async (response) => {
        // Handle 404 error in fetch
        if (response.status !== 200) {
          console.log("SearchView: Error - Not 200 response");
          alert(`The city ${this.state.city} was unfound!`);
          return null;
        }

        // Otherwise we have data
        data = await response.json();

        // If data is invalid, exit early
        if (!data) {
          console.log(`SearchView: Error - Received invalid data: ${JSON.stringify(data)}`)
          return;
        }

        console.log('SearchView: Data from api: ' + JSON.stringify(data))
        this.setState({data})

        // Transition view
        this.props.navigation.navigate('First', data);
      })
      .catch((error) => console.error(error));
  }

  render() {
    return (
      <ImageBackground
        source={require('../assets/image/city_background.png')}
        style={styles.backgroundView}>
        <View
          style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder={'City'}
            onChangeText={(city) => this.setState({city})}
            onSubmitEditing={() => this.processData()}
            value={this.state.city}>
          </TextInput>
        </View>
      </ImageBackground>
    );
  }
}
 
const styles = StyleSheet.create({
  backgroundView: {
    width: '100%',
    height: '100%',
    display: 'flex'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    fontSize: 22,
    height: 40,
    width: '80%',
    marginBottom: 15,
    backgroundColor: '#ecf0f1',
    textAlign: 'center'
  },
  getWeatherBtn: {
    height: 30,
    width: '80%',
    backgroundColor: '#841584',
  }
});
