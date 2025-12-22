import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useLocalSearchParams } from 'expo-router'
import * as Location from 'expo-location';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router'

const { width, height } = Dimensions.get('window')
const milieu = height * (1 / 3);
const radius = width * 0.15;

const FinReseau = ({ id, handleFinReseau }) => {
    const [tension, setTension] = useState(null);
    const [location, setLocation] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const handleTension = (value) => {
        setTension(value);
    }
    const handleGetLocation = async () => {
        setLoadingLocation(true);
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setLoadingLocation(false);
        console.log("location", location);
    }



    useEffect(() => {
        let value = (tension ? "V-" + tension : null) + (location ? "-lat-" + location.coords.latitude : null) + (location ? "-long-" + location.coords.longitude : null);
        handleFinReseau(id, value);
    }, [location, tension])

    return (
        <View>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Fin de réseau {id + 1}:</Text>
            <Text style={{ marginBottom: 5, color: '#706C6C', fontStyle: 'italic' }}>Tension fin réseau la plus basse</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <TextInput
                    keyboardType='numeric'
                    style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, width: '48%' }} onChangeText={handleTension} value={tension} />
                <View
                    style={{ padding: 10, width: '48%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    {loadingLocation && <ActivityIndicator style={{ marginRight: 10 }} size="small" color="#2980b9" />}
                    {!loadingLocation && !location && <FontAwesome6 name="location-pin" size={24} color="#706C6C" onPress={handleGetLocation} />}
                    {!loadingLocation && location && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                            <FontAwesome6 name="location-pin" size={24} color="#33C215" onPress={handleGetLocation} />
                            <Text style={{ color: '#33C215' }}> ---{">"} ok loc</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    )
}

export default function Tension() {

    const [finReseau, setFinReseau] = useState([""]);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const params = useLocalSearchParams();
    const navigation = useNavigation()
    console.log(params.nbrFinReseau)

    const nbrFinR = parseInt(params.nbrFinReseau);
    const handleFinReseau = (i, value) => {
        let newFinReseau = [...finReseau];
        newFinReseau[i] = value;
        console.log("newFinReseau", newFinReseau);
        setFinReseau(newFinReseau);
    }

    {/******* Composants FinReseau ********/ }
    const renderFinReseau = []
    for (let i = 0; i < nbrFinR; i++) {
        renderFinReseau.push(<FinReseau key={i} id={i} handleFinReseau={handleFinReseau} />)
    }

    const testFinReseau = finReseau.filter(item => item != null && item !== 0);
    console.log("testFinReseau", testFinReseau);

    const handleValidation = async () => {
        if (testFinReseau.length === 0) {
            Alert.alert("Remplir tous les champs ou prenez les localisations");
            return;
        }

        const mask = [];

        for (let i = 0; i < finReseau.length; i++) {
            if (!finReseau[i].includes("V-") || !finReseau[i].includes("-lat-") || !finReseau[i].includes("-long-")) {
                Alert.alert("Vérifier les infos de fin de réseau " + (i + 1));
                mask.push(false);
            }
        }

        if (mask.includes(false)) {
            return;
        } else {
            /****************************** Stockage en local **********************/
            const toSave = {
                id: params.id,
                finResData: finReseau,
            }
            const listKeyStore = await AsyncStorage.getAllKeys();

            if (listKeyStore.includes("finReseau")) {
                const dataStored = await AsyncStorage.getItem('finReseau')
                let dataTransform = JSON.parse(dataStored)
                dataTransform.push(toSave)
                await AsyncStorage.removeItem('finReseau')
                await AsyncStorage.setItem('finReseau', JSON.stringify(dataTransform))
                // console.log('Données sauvegardées = ', dataTransform)

                navigation.goBack()
            } else {
                const firstData = [toSave]
                await AsyncStorage.setItem('finReseau', JSON.stringify(firstData))
                // console.log('Premier enregistrement avec succès = ', firstData)

                navigation.goBack()
            }
        }
    }


    useEffect(() => {
        async function getCurrentLocation() {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
        }

        getCurrentLocation();
    }, []);
    return (
        <View style={{ flex: 1 }}>
            <View style={{ borderBottomWidth: 2, borderBottomColor: '#1765caff' }}>
                <MapView
                    initialRegion={{
                        latitude: 4.576939,
                        longitude: 13.684294,
                        latitudeDelta: 0.06,
                        longitudeDelta: 0.06
                    }}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    style={{ width: '100%', height: height * 0.35 }}
                >
                    <Marker
                        coordinate={{
                            latitude: parseFloat(params.latitude),
                            longitude: parseFloat(params.longitude)
                        }}
                        title={params.nom}
                        description={params.puissance + ' kVA'}
                    />
                </MapView>
            </View>
            <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Poste {params.nom} de {params.puissance} kVA</Text>
            </View>
            {
                params.nbrFinReseau == 0 && (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: 'center' }}>Aucune donnée de fin de réseau disponible</Text>
                    </View>
                )
            }
            {params.nbrFinReseau != 0 && (
                <ScrollView style={{ marginBottom: 10, marginTop: 10, paddingHorizontal: 10 }}>
                    {renderFinReseau}
                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                        <TouchableOpacity
                            disabled={finReseau.length !== nbrFinR}
                            style={{ backgroundColor: testFinReseau.length === 0 ? '#95a5a6' : '#2980b9', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20, width: '50%' }}
                            onPress={handleValidation}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Valider</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: 400
    }
});