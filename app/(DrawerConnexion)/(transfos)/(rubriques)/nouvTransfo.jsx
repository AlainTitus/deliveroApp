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
        
        if(currentLocation){
            setCheckLocation(false);
            navigation.navigate('formNouvTransfo', {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            });
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
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 1, textAlign: 'center' }}>
                    Ajouter un Transformateur
                </Text>
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

            

            <View style={{marginTop: 10, flex: 1 }}>
                {/* <Text style={{ fontSize: 22, color: '#fff' }}>
                    Positionnez vous sur le lieu d'installation du transformateur, puis appuyez sur le bouton ci-dessus pour enregistrer la position.
                </Text> */}
                <PositionMap/>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    btn_touchable: {
        backgroundColor: '#1f618d',
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