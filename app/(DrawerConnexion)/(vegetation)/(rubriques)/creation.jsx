import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import PositionMap from '../../../../components/PositionMap'
import * as Location from 'expo-location'
import { useNavigation } from 'expo-router';
import { useState } from 'react';

export default function Creation() {
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
            navigation.navigate('anomalies', {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            });
        } else {
            setCheckLocation(false);
            Alert.alert('Erreur', 'Impossible de récupérer la position actuelle.');
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <View>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "#1e8449", textAlign: "center", marginVertical: 10 }}>Création</Text>
            </View>

            {!checkLocation && (
                <TouchableOpacity style={styles.btn_touchable} onPress={handleLocation}>
                    <Text style={styles.btn_text}>
                        Prendre la position
                    </Text>
                </TouchableOpacity>)}

            {checkLocation && (
                <TouchableOpacity style={styles.btn_touchable}>
                    <Text style={styles.btn_text}>
                        Recherche...
                    </Text>
                </TouchableOpacity>)}

            <View style={{ marginTop: 10, flex: 1 }}>
                <PositionMap />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    btn_touchable: {
        backgroundColor: '#1e8449',
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