import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import poteaux from '../../../datas/supportsDRE.json'
import { useRouter, useNavigation } from 'expo-router'



export default function Mapcollecte() {
    const router = useRouter()
    const navigation = useNavigation()

    const handleUpdate = (pot) => {
        navigation.navigate("updatesupport", { lat: pot.latitude, long: pot.longitude, depart: pot.depart })
    }

    let textD32BELABO = "../../../assets/images/bouton-d32.png";
    let textD31BATOURI = "../../../assets/images/bouton-d31.png";
    let textD11BERTOUA = "../../../assets/images/pt_bleu2.png";
    let textD12BERTOUA = "../../../assets/images/bouton-d12.png";
    let textAutre = "../../../assets/images/bouton_64.png";
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
                showsUserLocation
                showsMyLocationButton
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