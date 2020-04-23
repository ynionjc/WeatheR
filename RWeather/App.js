/**
 * Weather app 
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Image,
  View,
  TouchableOpacity,
} from "react-native";

import {
  createDrawerNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";
import MainView from "./pages/MainView";
import SearchView from "./pages/SearchView";

class NavigationDrawerStructure extends Component {
  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          <Image
            source={require("./assets/image/drawer.png")}
            style={{ width: 25, height: 25, marginLeft: 5 }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const MainView_StackNavigator = createStackNavigator({
  First: {
    screen: MainView,
    navigationOptions: ({ navigation }) => ({
      title: "Home",
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: { backgroundColor: "#99CCFF" },
      headerTintColor: "#000000"
    })
  }
});

const SearchView_StackNavigator = createStackNavigator({
  Second: {
    screen: SearchView,
    navigationOptions: ({ navigation }) => ({
      title: "Search City",
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: { backgroundColor: "#99CCFF" },
      headerTintColor: "#000000"
    })
  }
});

const WeatherNavigator = createDrawerNavigator({
  MainView: {
    screen: MainView_StackNavigator,
    navigationOptions: { drawerLabel: "Home" }
  },
  SearchView: {
    screen: SearchView_StackNavigator,
    navigationOptions: {
      drawerLabel: "Search"
    }
  }
});

export default createAppContainer(WeatherNavigator);
