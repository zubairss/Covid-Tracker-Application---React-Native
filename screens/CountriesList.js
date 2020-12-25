import React, { useState, useEffect } from 'react';
import {SafeAreaView, StyleSheet,  View, Text,StatusBar, Button, ActivityIndicator, Dimensions } from 'react-native';
import { DrawerLayoutAndroid, ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions, } from 'react-native/Libraries/NewAppScreen';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
 

const options = {
    method: 'GET',
    url: 'https://world-population.p.rapidapi.com/allcountriesname',
    headers: {
      'x-rapidapi-key': '97ccee0585msh6891a665c14ade4p13fb0ejsn9c9d37501ed5',
      'x-rapidapi-host': 'world-population.p.rapidapi.com'
    }
  };


const CountriesList = ({ navigation, route }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [countries, setCountries] = useState();
    const [favourites, setFavourites] = useState([]);
    const [filteredList, setFilteredList] = useState([]);

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
    
    useEffect(() => {
        axios.request(options).then(function (response) {
            setCountries(response.data.body.countries);
        }).catch(function (error) {
            console.error(error);
        }).finally(() => setIsLoading(false));
    }, []);

    useEffect(()=>{
        loadFavourites();
    }, [[], route.params.forUpdate])


    const favCountryHandler = async (name) => {
        try {
            let temp = await AsyncStorage.getItem('fav');
            if(temp != null){
                let arr = temp.split(",");
                if(!arr.includes(name)){
                    await AsyncStorage.setItem('fav', `${await AsyncStorage.getItem('fav')},${name}`);
                    setFavourites(arr);
                } else{
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
            } else{
                await AsyncStorage.setItem('fav', `${name}`);
                setFavourites([name]);
            }
            console.log(await AsyncStorage.getItem('fav'))
        } catch (err) {
            console.log(err);
        }  

    }

    const renderCountryList = () => (
        <ScrollView>
            {
                countries.map((item) => {
                    if(filteredList.includes(item) || filteredList.length == 0){
                        return(
                            <View key={item} style={styles.column}>
                                <View style={styles.icon}>
                                    {favourites.includes(item)?<Icon name='star' type='octicon' color='#fdb827' onPress={() => favCountryHandler(item)}/>:<Icon name='star' type='octicon' color='#fff' onPress={() => favCountryHandler(item)}/>}
                                </View>
                                <TouchableOpacity style={styles.countryNames} onPress={() => navigation.navigate('Country Statistic', { name: item})}>
                                    <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 20}}>{item}</Text>
                                </TouchableOpacity>
    
                            </View>
                        )
                    } 
                    
                })
            }
        </ScrollView>
    );

    const filterCountryHandler = (e) => {
        setFilteredList(()=> countries.filter((name) => name.match(e)));
        console.log(filteredList);
    }

  return (
    <>
      <StatusBar barStyle="auto" />
      <SafeAreaView>
      <View style={styles.header}>
            <TouchableOpacity style={styles.drawerToggler} onPress={()=>navigation.toggleDrawer()}>
                <Text style={{fontFamily: "Poppins-Regular", fontSize: 20, textAlign: 'center', color: 'white', position: 'relative', right: 5, top: 6}}>MENU</Text>
            </TouchableOpacity>
            <View style={{width: 250, display: 'flex', flexDirection: 'row', marginLeft: 30}}>
                <View>
                    <Text style={{fontFamily: "BebasNeue-Regular", fontSize: 50, textAlign: 'center', color: 'black'}}>Countries</Text>
                    <Text style={{fontFamily: "Poppins-Light", textAlign: 'center', fontSize: 10, color: 'black' ,textTransform: 'uppercase', letterSpacing: 1, marginTop: -10}}>Select One to See Results</Text>
                </View>
                <TouchableOpacity style={{marginLeft: 50}}>
                     <Icon name='star' reverse type='octicon' color='#fdb827' onPress={() => {navigation.navigate("Favourites", { forUpdate: favourites })}}/>
                </TouchableOpacity>
            </View>
        </View>
      <View style={styles.container}>
            <Text style={{fontFamily: 'Poppins-Medium', color: 'darkred', fontSize: 25}}>Select Country</Text>
            <TextInput 
                placeholder="Country Name"
                style={{borderBottomColor: 'black', borderBottomWidth: 2, width: 200}}
                onChangeText={filterCountryHandler}
            />
            
            {isLoading ? <ActivityIndicator size="large" color="#c70039" style={{marginTop: Dimensions.get('window').height/3}}/>: renderCountryList()}
    

      </View>
      </SafeAreaView>
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
    backgroundColor: 'black',
    height: 73,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 25,
    borderTopRightRadius: 20
  },
  container: {
      display: 'flex',
      alignItems: 'center'
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

export default CountriesList;
