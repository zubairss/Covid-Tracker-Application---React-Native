import React, { useState, useEffect } from 'react';
import {SafeAreaView, StyleSheet, ScrollView,  View, Text,StatusBar, } from 'react-native';
import { DrawerLayoutAndroid, TouchableOpacity } from 'react-native-gesture-handler';
import { Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions, } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements';

const Favourites = ({ navigation, route }) => {
    const [favourites, setFavourites] = useState([]);

    const loadFavourites = async () => {
        try {
            let temp = await AsyncStorage.getItem('fav');
            if(temp!=null){
              let arr = temp.split(",");
              setFavourites(arr);
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        loadFavourites();
    }, [AsyncStorage.getItem('fav'), [], favourites, route.params.forUpdate])
    

    const favCountryHandler = async (name) => {
        try {
            let temp = await AsyncStorage.getItem('fav');
            if(temp!=null){
              let arr = temp.split(",");
              console.log(arr);
              if(arr.length == 1){
                if(arr[0] == name){
                  await AsyncStorage.removeItem('fav');
                  setFavourites([]);
                }
              } else{
                arr.splice(arr.indexOf(name), 1);
                let str = arr.toString();
                setFavourites(arr);
                await AsyncStorage.setItem('fav', `${str}`);
              }
          }
        } catch (error) {
            console.log(error);
        }
    
    }

    const renderCountryList = () => (
        <ScrollView>
            {
                favourites.map((item) => {
                    return(
                        <View key={item} style={styles.column}>
                            <View style={styles.icon}>
                                <Icon name='star' type='octicon' color='#fdb827' onPress={() => favCountryHandler(item)}/>
                            </View>
                            <TouchableOpacity style={styles.countryNames} onPress={() => navigation.navigate('Country Statistic', { name: item})}>
                                <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 20}}>{item}</Text>
                            </TouchableOpacity>

                        </View>
                    )
                })
            }
        </ScrollView>
    );

  return (
    <>
      <StatusBar barStyle="auto" />
      <View style={styles.header}>
            <TouchableOpacity style={styles.drawerToggler} onPress={()=>navigation.toggleDrawer()}>
                <Text style={{fontFamily: "Poppins-Regular", fontSize: 20, textAlign: 'center', color: 'white', position: 'relative', right: 5, top: 6}}>MENU</Text>
            </TouchableOpacity>
            <View style={{width: 250}}>
                <Text style={{fontFamily: "BebasNeue-Regular", fontSize: 50, textAlign: 'center', color: 'orange'}}>Favourites</Text>
            </View>
        </View>
      
      {renderCountryList()}
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerToggler: {
    backgroundColor: 'orange',
    height: 73,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 25,
    borderTopRightRadius: 20
  },
  column: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    marginVertical: 10
},
icon: {
  marginRight: 50,
  marginLeft: 50
},
countryNames: {
  marginLeft: 10
}

  
});

export default Favourites;
