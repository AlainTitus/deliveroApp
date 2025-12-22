import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { useState, useEffect } from 'react'
import * as Location from 'expo-location'
import { useNavigation } from 'expo-router';
import PositionMap from '../../../../components/PositionMap';

export default function nouvTransfo() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [checkLocation, setCheckLocation] = useState(false);

    const navigation = useNavigation();

    const handleLocation = async () => {
        setCheckLocation(true);
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);

        if (currentLocation) {
            setCheckLocation(false);

        } else {
            setCheckLocation(false);
            Alert.alert('Erreur', 'Impossible de récupérer la position actuelle.');
        }
    }


    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            <View style={{ margin: 4 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 1, textAlign: 'center', color: '#873600' }}>
                    Ajouter un OCR
                </Text>
            </View>
            {(!location && !checkLocation) && (
                <TouchableOpacity style={styles.btn_touchable} onPress={handleLocation}>
                    <Text style={styles.btn_text}>
                        Prendre la position
                    </Text>
                </TouchableOpacity>)}

            {(!location && checkLocation) && (
                <TouchableOpacity style={styles.btn_touchable}>
                    <Text style={styles.btn_text}>
                        Recherche...
                    </Text>
                </TouchableOpacity>)}


            {
                !location && (
                    <View style={{ marginTop: 10, flex: 1}}>
                        <PositionMap />
                    </View>
                )
            }

            {location && (
                <View>
                    <TouchableOpacity style={styles.btn_touchable} onPress={() => navigation.navigate('formNouvCoupeCircuit', { latitude: location.coords.latitude, longitude: location.coords.longitude })}>
                        <Text style={styles.btn_text}> Coupe circuit </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn_touchable} onPress={() => navigation.navigate('formNouvIacm', { latitude: location.coords.latitude, longitude: location.coords.longitude })}>
                        <Text style={styles.btn_text}> IACM </Text>
                    </TouchableOpacity>
                </View>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    btn_touchable: {
        backgroundColor: '#873600',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        width: '80%',
        marginHorizontal: 'auto',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
    },
    btn_text: {
        color: '#fff',
        fontWeight: 'bold',
    },
})