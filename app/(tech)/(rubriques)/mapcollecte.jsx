import { View, Text, StyleSheet, Alert } from 'react-native'
import React, {useEffect} from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import poteaux from '../../../datas/supportsDRE.json'
import { useRouter, useNavigation } from 'expo-router'
import {Stack} from 'expo-router'
import * as Location from 'expo-location';


export default function Mapcollecte() {
    const router = useRouter()
    const navigation = useNavigation()

    const handleUpdate = (pot) => {
        navigation.navigate("updatesupport", { lat: pot.latitude, long: pot.longitude, depart: pot.depart })
    }

    let textD32BELABO = "../../../assets/images/rond_violet.png";
    let textD31BATOURI = "../../../assets/images/rond_vert.png";
    let textD11BERTOUA = "../../../assets/images/rond_bleu.png";
    let textD12BERTOUA = "../../../assets/images/rond_rose.png";
    let textAutre = "../../../assets/images/rond_autre.png";

    useEffect(() => {
        async function getCurrentLocation() {
          
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
        }
    
        getCurrentLocation();
      }, []);
    return (
        <View style={StyleSheet.container}>
            <MapView
                initialRegion={{
                    latitude: 4.576939,
                    longitude: 13.684294,
                    latitudeDelta: 0.06,
                    longitudeDelta: 0.06
                }}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                showsMyLocationButton = {true}
                style={styles.map}
            >
                {
                    poteaux.map(pot => (
                        <Marker
                            key={pot.fid}
                            coordinate={{ latitude: pot.latitude, longitude: pot.longitude }}
                            image={
                                pot.depart == "D32 BELABO" ? require(textD32BELABO) : (
                                    pot.depart == "D31 BATOURI" ? require(textD31BATOURI) : (
                                        pot.depart === "D11 BERTOUA" ? require(textD11BERTOUA) : (
                                            pot.depart == "D12 BERTOUA" ? require(textD12BERTOUA) : require(textAutre)
                                        )))

                            }
                            onPress={() => handleUpdate(pot)}
                        />
                    ))
                }

            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        width: '100%',
        height: "100%"
    },
    circle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 20,
        height: 20,
        backgroundColor: 'red'
    }
})