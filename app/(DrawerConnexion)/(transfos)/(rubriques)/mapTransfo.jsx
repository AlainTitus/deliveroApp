import { View, Text, StyleSheet, Alert, TouchableOpacity, Dimensions } from 'react-native'
import { useState, useEffect } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import postes from '../../../../datas/dre_postes.json'
import { useNavigation } from 'expo-router'
import * as Location from 'expo-location';
import AntDesign from '@expo/vector-icons/AntDesign';


const { width, height } = Dimensions.get('window')
const milieu = height * (1 / 3);
const radius = width * 0.15;

export default function Mapcollecte() {
    const [btnForm, setBtnForm] = useState(false);
    const [postSelected, setPostSelected] = useState({});

    const navigation = useNavigation();

    const handleSelect = (post) => {
        const select = {
            nom: post.nom,
            latitude: post.latitude,
            longitude: post.longitude
        }
        setPostSelected({ ...select })
        setBtnForm(true)
    }

    let textD32BELABO = "../../../../assets/images/transfo_D32Belabo.png";
    let textD31BATOURI = "../../../../assets/images/transfo_D31Batouri.png";
    let textD11BERTOUA = "../../../../assets/images/transfo_D11Bertoua.png";
    let textD12BERTOUA = "../../../../assets/images/transfo_D12Bertoua.png";
    let textA32BERTOUA = "../../../../assets/images/transfo_D32Bertoua.png";
    let textD31ABONGMBANG = "../../../../assets/images/transfo_D12Bertoua.png";
    let textAutre = "../../../../assets/images/transformateur.png";

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
                showsMyLocationButton={true}
                style={styles.map}
                onPress={() => { setBtnForm(false) }}
            >
                {
                    postes.map((post, index) => (
                        <Marker
                            key={index}
                            coordinate={{ latitude: parseFloat(post.latitude), longitude: parseFloat(post.longitude) }}
                            title={post.nom}
                            description={post.depart}
                            image={
                                post.depart == "D32 BELABO" ? require(textD32BELABO) : (
                                    post.depart == "D31 BATOURI" ? require(textD31BATOURI) : (
                                        post.depart === "D11 BERTOUA" ? require(textD11BERTOUA) : (
                                            post.depart == "D12 BERTOUA" ? require(textD12BERTOUA) : (
                                                post.depart == "A32 BERTOUA" ? require(textA32BERTOUA) : (
                                                    post.depart == "D31 ABONGMBANG" ? require(textD31ABONGMBANG) : (
                                                        require(textAutre)
                                                    )))
                                        )))

                            }
                            onPress={() => handleSelect(post)}
                        />
                    ))
                }
            </MapView>
            {
                btnForm && (
                    <TouchableOpacity
                        style={styles.form}
                        onPress={() => navigation.navigate('formCollecte', { latitude: postSelected.latitude, longitude: postSelected.longitude, nom: postSelected.nom })}>
                        <AntDesign name="form" size={24} color="white" />
                    </TouchableOpacity>
                )
            }

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
    form: {
        position: 'absolute',
        zIndex: 100,
        bottom: milieu,
        right: 20,
        width: radius,
        height: radius,
        borderRadius: radius,
        backgroundColor: '#1f618d',
        justifyContent: 'center',
        alignItems: 'center'
    }

})