import { View, Text, StyleSheet, Alert, TouchableOpacity, Dimensions, ActivityIndicator, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'

import {useNavigation, useLocalSearchParams } from 'expo-router'

import * as Location from 'expo-location';


const { width, height } = Dimensions.get('window')
const radius = width * 0.15

export default function Mapcollecte() {

    const params = useLocalSearchParams()
    const navigation = useNavigation()
    console.log("params mapSearch", params);
    
    const handleShowDetails = () => {

        navigation.navigate("detailSupport", {
            supbois: params.supbois,
            hautBois: params.hautBois,
            imglink: params.imglink,
            depart: params.depart,
            structBeton: params.structBeton,
            hautBeton: params.hautBeton,
            effort: params.effort,
            armBeton: params.armBeton,
            nbrIso: params.nbrIso,
            nbrChaine: params.nbrChaine,
            access: params.access,
            observation: params.observation
        })
    }

    let textD32BELABO = "../../../../assets/images/rond_violet.png";
    let textD31BATOURI = "../../../../assets/images/rond_vert.png";
    let textD11BERTOUA = "../../../../assets/images/rond_bleu.png";
    let textD12BERTOUA = "../../../../assets/images/rond_rose.png";
    let textAutre = "../../../../assets/images/rond_autre.png";

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
                    latitude: parseFloat(params.latitude),
                    longitude: parseFloat(params.longitude),
                    latitudeDelta: 0.06,
                    longitudeDelta: 0.06
                }}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                showsMyLocationButton={true}
                style={styles.map}
            >
                <Marker
                    key={params.id}
                    coordinate={{ latitude: parseFloat(params.latitude), longitude: parseFloat(params.longitude) }}
                    image={
                        params.depart == "D32 BELABO" ? require(textD32BELABO) : (
                            params.depart == "D31 BATOURI" ? require(textD31BATOURI) : (
                                params.depart === "D11 BERTOUA" ? require(textD11BERTOUA) : (
                                    params.depart == "D12 BERTOUA" ? require(textD12BERTOUA) : require(textAutre)
                                )))

                    }

                    onPress={handleShowDetails}
                    showsMyLocationButton={true}
                    showsUserLocation={true}
                    showsTraffic={true}
                    loadingEnabled={true}
                />

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
    },
    refresh: {
        width: radius,
        height: radius,
        borderRadius: radius / 2,
        backgroundColor: '#2980b9',
        position: 'absolute',
        zIndex: 100,
        bottom: 20 + (radius) + 20,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    },
    activeSearch: {
        width: radius,
        height: radius,
        borderRadius: radius / 2,
        backgroundColor: '#2e4053',
        position: 'absolute',
        zIndex: 100,
        bottom: 20,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    },
    details: {
        width: radius,
        height: radius,
        borderRadius: radius / 2,
        backgroundColor: '#0e6655',
        position: 'absolute',
        zIndex: 100,
        bottom: 20 + radius + 20 + radius + 20,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    },
    boxSearch: {
        zIndex: 100,
        position: "absolute",
        top: 70,
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    search: {
        width: "80%",
        marginHorizontal: "auto",
        flexDirection: "row",
        alignItems: "center",

    },
    input: {
        width: "80%",
        height: 60,
        backgroundColor: "rgba(52, 73, 94, 0.9)",
        padding: 5,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#d7dbdd",
        fontSize: 16,
        color: "white",
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    },
    iconSearch: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(52, 73, 94, 0.9)",
        height: 60,
        width: "20%",
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        borderWidth: 1,
        borderColor: "#d7dbdd"
    }
})