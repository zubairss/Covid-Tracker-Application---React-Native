import React, { useState, useEffect } from 'react';
import {SafeAreaView, StyleSheet, ScrollView,  View, Text,StatusBar, Button, Dimensions, ActivityIndicator, } from 'react-native';
import { DrawerLayoutAndroid, TouchableOpacity } from 'react-native-gesture-handler';
import { Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions, } from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';


const CountryStats = ({ navigation, route }) => {
    const [covidData, setCovidData] = useState([]);
    const [population, setPopulaton] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [countryNamePopulationAPI, setCountryNamePopulationAPI] = useState("");
    const [countryNameCovidAPI, setCountryNameCovidAPI] = useState("");
    const options = {
      method: 'GET',
      url: '',
      headers: {
        'x-rapidapi-key': '97ccee0585msh6891a665c14ade4p13fb0ejsn9c9d37501ed5',
        'x-rapidapi-host': ''
      }
    };

    try {
      useEffect(()=>{
          if(route.params.name == "United States"){
            setCountryNameCovidAPI("USA");
            setCountryNamePopulationAPI(route.params.name); 
          }else{
            setCountryNameCovidAPI(route.params.name)
            setCountryNamePopulationAPI(route.params.name);
          }
      }, [route.params.name]);
    } catch (error) {
      console.log(error);
    }

    useEffect(() => {
      if(countryNamePopulationAPI!=""){
        axios.request({...options, url: 'https://world-population.p.rapidapi.com/population', params: {country_name: countryNamePopulationAPI} ,headers: {...options.headers, 'x-rapidapi-host': "world-population.p.rapidapi.com"}}).then((response) => {
                setPopulaton(response.data.body.population);
                console.log(response.data);
            }).then(
                axios.request({...options, url: 'https://covid-19-data.p.rapidapi.com/country', params:{name: countryNameCovidAPI} ,headers: {...options.headers, 'x-rapidapi-host': "covid-19-data.p.rapidapi.com"}}).then((response) => {
                  setCovidData(...response.data);
                  console.log(response.data);
                }).catch((error) => {
                    console.error(error);
                })
            ).catch((error) => console.log(error)).finally(() => setIsLoading(false));
      }
    }, [countryNamePopulationAPI])
    
  
    const dataRenderer = (
      <>
           <View style={styles.dataContainer}>
              <View style={styles.dataWrapper}>
                  <View style={styles.dataColumn}>
                      <Text style={styles.dataTableHeader}>Total Confirmed Cases: </Text>
                      <Text style={styles.dataTableHeader}>Total Population:</Text>
                  </View>
                  <View style={styles.dataColumn}>
                      <Text style={styles.dataTableData}>{covidData.confirmed}</Text>
                      <Text style={styles.dataTableData}>{population}</Text>
                  </View>
              </View>

              <Text style={{
                  fontFamily: 'Poppins-Bold', 
                  fontSize: 40, 
                  backgroundColor: 'black', 
                  color: 'white', 
                  width: styles.dataWrapper.width-15, 
                  textAlign: 'center', 
                  includeFontPadding: false
                  }}>
                  {((covidData.confirmed / population) * 100).toFixed(1)}%</Text>
              <Text style={{fontFamily: 'Poppins-Medium', fontSize: 14.5, color: 'darkred'}}>of the total population is infected</Text>
                  
              <View style={styles.dataWrapper}>
                  <View style={styles.dataColumn}>
                      <Text style={{...styles.dataTableHeader, backgroundColor: '#e6e6e6'}}>Confirmed Cases:</Text>
                      <Text style={styles.dataTableHeader}>Recovered:</Text>
                      <Text style={{...styles.dataTableHeader, backgroundColor: '#e6e6e6'}}>Critical Cases:</Text>
                      <Text style={styles.dataTableHeader}>Deaths:</Text>
                      <Text style={{...styles.dataTableHeader, backgroundColor: '#e6e6e6'}}>Last Updated:</Text>
                  </View>
                 
                  <View style={styles.dataColumn}>
                      <Text style={{...styles.dataTableData, backgroundColor: '#e6e6e6'}}>{covidData.confirmed}</Text>
                      <Text style={styles.dataTableData}>{covidData.recovered}</Text>
                      <Text style={{...styles.dataTableData, backgroundColor: '#e6e6e6'}}>{covidData.critical}</Text>
                      <Text style={styles.dataTableData}>{covidData.deaths}</Text>
                      <Text style={{...styles.dataTableData, backgroundColor: '#e6e6e6'}}>{covidData.lastUpdate}</Text>
                  </View>
              </View>
          </View>
      </>
  )
  return (
    <>
      <StatusBar barStyle="auto" />
      <View style={styles.header}>
            <TouchableOpacity style={styles.drawerToggler} onPress={()=>navigation.toggleDrawer()}>
                <Text style={{fontFamily: "Poppins-Regular", fontSize: 20, textAlign: 'center', color: 'white', position: 'relative', right: 5, top: 6}}>MENU</Text>
            </TouchableOpacity>
            <View style={{width: 250}}>
                <Text style={{fontFamily: "BebasNeue-Regular", fontSize: 50, textAlign: 'center', color: 'black'}}>{countryNamePopulationAPI}</Text>
                <Text style={{fontFamily: "Poppins-Light", textAlign: 'center', fontSize: 15, color: 'black' ,textTransform: 'uppercase', letterSpacing: 6, marginTop: -10}}>Statistics</Text>
            </View>
        </View>
        {isLoading ? <ActivityIndicator size="large" color="#c70039" style={{marginTop: Dimensions.get('window').height/3}}/>: dataRenderer}
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
  dataContainer :{
    display: 'flex',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 40,
    height: Dimensions.get('window').height
},
dataWrapper: {
  width: Dimensions.get('window').width - 100,
  display: 'flex',
  flexDirection: 'row'
},
dataTableHeader: {
  height: 50,
  width: 180,
  paddingLeft: 10,
  fontFamily: 'Poppins-ExtraBold',
  textAlignVertical: 'center',
  textTransform: 'uppercase',
  color: '#ff4646'
},
dataTableData: {
  height: 50,
  textAlign: 'right',
  paddingRight: 20,
  textAlignVertical: 'center',
  fontFamily: 'Poppins-Medium',
  fontSize: 16
},
dataColumn: {
  width: Dimensions.get('window').width - 260
}
  
  
});

export default CountryStats;
