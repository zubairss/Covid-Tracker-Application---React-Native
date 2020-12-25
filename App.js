import React from 'react';
import {SafeAreaView, StyleSheet, ScrollView,  View, Text,StatusBar, Button, } from 'react-native';
import { Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions, } from 'react-native/Libraries/NewAppScreen';
import CountriesList from './screens/CountriesList';
import Favourites from './screens/Favourites';
import WorldStats from './screens/WorldStats';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import CountryStats from './screens/CountryStats';

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <>
      <NavigationContainer>
          <Drawer.Navigator initialRouteName="World Statistic">
            <Drawer.Screen name="World Statistic" component={WorldStats} />
            <Drawer.Screen name="Country List" component={CountriesList} initialParams={{ forUpdate: [Math.floor(Math.random()*10)]}} />
            <Drawer.Screen name="Favourites" component={Favourites} initialParams={{ forUpdate: [""] }}/>
            <Drawer.Screen name="Country Statistic" component={CountryStats} initialParams={{ name: "Pakistan" }} />
          </Drawer.Navigator>
      </NavigationContainer>

     
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  
  
});

export default App;
