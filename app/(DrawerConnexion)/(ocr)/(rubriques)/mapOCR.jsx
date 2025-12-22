import { View, Text, StyleSheet, Alert, TouchableOpacity, Dimensions } from 'react-native'
import { useState, useEffect } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import ocrs from '../../../../datas/ocr_dre.json'
import { useNavigation } from 'expo-router'
import * as Location from 'expo-location';
import AntDesign from '@expo/vector-icons/AntDesign';


const { width, height } = Dimensions.get('window')
const milieu = height * (1 / 3);
const radius = width * 0.15;

export default function Mapcollecte() {
    const [btnForm, setBtnForm] = useState(false);
    const [ocrSelected, setOcrSelected] = useState({});

    const navigation = useNavigation();

    const handleSelect = (ocr) => {
        const select = {
            nom: ocr.nom,
            latitude: ocr.latitude,
            longitude: ocr.longitude,
            type_ocr: ocr.type_ocr
        }
        setOcrSelected({ ...select })
        setBtnForm(true)
    }

    const HandleForm = () => {
        if (ocrSelected.type_ocr == "CC") {
            navigation.navigate('formCC', { latitude: ocrSelected.latitude, longitude: ocrSelected.longitude, nom: ocrSelected.nom });
        }
        else if (ocrSelected.type_ocr == "IACM") {
            navigation.navigate('formIACM', { latitude: ocrSelected.latitude, longitude: ocrSelected.longitude, nom: ocrSelected.nom });
        } else {
            Alert.alert("Veuillez sélectionner un OCR valide");
            return;
        }
    }

    let textD32BELABO = "../../../../assets/images/rond_rose.png";
    let textD31BATOURI = "../../../../assets/images/rond_bleu.png";
    let textD11BERTOUA = "../../../../assets/images/rond_violet.png";
    let textD12BERTOUA = "../../../../assets/images/rond_vert.png";
    let textA32BERTOUA = "../../../../assets/images/rond_bleu.png";
    let textD31ABONGMBANG = "../../../../assets/images/rond_autre.png";
    let textAutre = "../../../../assets/images/rond_violet.png";

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
                    ocrs.map((ocr, index) => (
                        <Marker
                            key={index}
                            coordinate={{ latitude: parseFloat(ocr.latitude), longitude: parseFloat(ocr.longitude) }}
                            title={ocr.type_ocr + " " + ocr.nom}
                            description={ocr.depart}
                            image={
                                ocr.depart == "D32 BELABO" ? require(textD32BELABO) : (
                                    ocr.depart == "D31 BATOURI" ? require(textD31BATOURI) : (
                                        ocr.depart === "D11 BERTOUA" ? require(textD11BERTOUA) : (
                                            ocr.depart == "D12 BERTOUA" ? require(textD12BERTOUA) : (
                                                ocr.depart == "A32 BERTOUA" ? require(textA32BERTOUA) : (
                                                    ocr.depart == "D31 ABONGMBANG" ? require(textD31ABONGMBANG) : (
                                                        require(textAutre)
                                                    )))
                                        )))

                            }
                            onPress={() => handleSelect(ocr)}
                        />
                    ))
                }
            </MapView>
            {
                btnForm && (
                    <TouchableOpacity
                        style={styles.form}
                        onPress={HandleForm}>
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