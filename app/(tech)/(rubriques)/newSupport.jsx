import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomInput from '../../../components/CustomInput';
import CustomSelect from '../../../components/CustomSelect';
import { departs, typeStructure, hauteurSupport, typeArmement, accessibilite, etatSupport, efforts, armementBeton, typeStructureBeton, vegetations } from '../../../datas/labels'
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker'
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Location from "expo-location";
import { v4 as uuidv4 } from 'uuid';
import { manipulateAsync } from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router'


export default function NewSupport() {

    const [depart, setDepart] = useState('')
    const [structBois, setStructBois] = useState('')
    const [structBeton, setStructBeton] = useState('')
    const [hauteurBois, setHauteurBois] = useState('')
    const [etatSup, setEtatSup] = useState('');
    const [armemt, setArmemt] = useState('')
    const [access, setAccess] = useState('')
    const [nbrIso, setNbrIso] = useState(null)
    const [nbrChaine, setNbrChaine] = useState(null)
    const [force, setForce] = useState('')
    const [armBeton, setArmBeton] = useState('')
    const [hauteurBeton, setHauteurBeton] = useState('')
    const [observ, setObserv] = useState('')
    const [vegetation, setVegetation] = useState('');
    const [nbrArmBeton, setNbrArmBeton] = useState(0)
    const [errorMsg, setErrorMsg] = useState(null);
    const [location, setLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(false)

    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')

    const [listURIItem, setListURIItem] = useState([])
    const [hasCameraPermission, setHasCameraPermission] = useState();
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();

    const router = useRouter()

    /**** Functions de gestion des états ******/
    const handleDepart = (value) => {
        setDepart(value)
    }
    const handleNbrArmBeton = (value) => {
        setNbrArmBeton(value)
    }
    const handleSupBeton = (value) => {
        setStructBeton(value)
    }

    const handleObservations = (value) => {
        setObserv(value)
    }

    const handleHauteurBeton = (value) => {
        setHauteurBeton(value)
    }

    const handleArmBeton = (value) => {
        setArmBeton(value)
    }

    const handleEffortBeton = (value) => {
        setForce(value)
    }

    const handleSupBois = (value) => {
        setStructBois(value)
    }

    const handleHautBois = (value) => {
        setHauteurBois(value)
    }

    const handleEtatSup = (value) => {
        setEtatSup(value)
    }

    const handleArmement = (value) => {
        setArmemt(value)
    }

    const handleAccess = (value) => {
        setAccess(value)
    }

    const handleNbrIso = (value) => {
        setNbrIso(value)
    }

    const handleChaine = (value) => {
        setNbrChaine(value)
    }

    const handleVegetation = (value) => {
        setVegetation(value)
    }

    /*** Gestion de la prise de photo ****/
    let takePic = async () => {
        /******* Etape1:  Prendre la photo avec ImagePicker **********/
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })
        console.log("newphoto => ", result)

        /*** Etape2: Recuperation des uri des photos prises sur cette collecte dans un tableau d'état ****/
        if (!result.canceled) {
            let itemURI = result.assets[0].uri
            let newListURIItem = [...listURIItem];
            newListURIItem.push(itemURI);
            setListURIItem([...newListURIItem])
            console.log(newListURIItem)
            Alert.alert('Photo sauvegardée avec succès!')
        } else {
            Alert.alert('Photo non sauvegardée!')
            return;
        }
    };

    /*** Validation du formulaire ****/
    let validate = async () => {
        console.log('controle des champs')

        if (listURIItem.length === 0) {
            Alert.alert('Prendre au moins une photo du support')
            return;
        }
        if (depart == "" || depart == " Choix d'un depart") {
            Alert.alert('Renseigner le départ du support')
            return;
        }
        if (structBois == "") {
            Alert.alert('Donnez la structure du support bois à remplacer')
            return;
        }
        if (etatSup == "") {
            Alert.alert('Donnez l\' etat du support bois à remplacer')
            return;
        }
        if (hauteurBois == "") {
            Alert.alert('Donnez la hauteur du support bois à remplacer')
            return;
        }
        if (armemt == "") {
            Alert.alert('Donnez l\'armement du support bois')
            return;
        }
        if (nbrIso == null) {
            Alert.alert('Donnez le nombre d\'iso rigide à remplacer')
            return;
        }
        if (nbrChaine == null) {
            Alert.alert('Donnez le nombre d\'élements de chaine à remplacer')
            return;
        }
        if (access == "") {
            Alert.alert("Préciser si l'accès est possible pour le camion gru")
            return;
        }
        if (structBeton == "") {
            Alert.alert('Donnez la structure du support béton à poser')
            return;
        }
        if (force == "") {
            Alert.alert('Donnez l\'éffort en tête des poteaux béton')
            return;
        }
        if (armBeton == "") {
            Alert.alert('Donnez l\'armement du support béton')
            return;
        }
        if (hauteurBeton == "") {
            Alert.alert('Donnez la hauteur des poteaux béton')
            return;
        }
        if (vegetation == "") {
            Alert.alert('Renseigner la végétation')
            return;
        }
        if (nbrArmBeton == "") {
            Alert.alert('Renseigner la végétation')
            return;
        }

        /*** Compresser les images ***/
        let nbrURI = listURIItem.length
        console.log(nbrURI)
        let compressedURI = [];
        for (var i = 0; i < nbrURI; i++) {
            const manipResult = await manipulateAsync(
                listURIItem[i], [], { compress: 0.1, base64: true }
            );
            compressedURI.push(manipResult)
        }

        /***Créer l'objet à sauvegarder ****/
        const unik = uuidv4()
        const supportToSave = {
            imglink: unik,
            structBois,
            etatSup,
            hauteurBois,
            armemt,
            nbrIso,
            nbrChaine,
            access,
            structBeton,
            force,
            armBeton,
            hauteurBeton,
            observ,
            latitude,
            longitude,
            uri: compressedURI,
            depart,
            vegetation,
            nbrArmBeton,
            etat: "nouveau"
        }

        // const docRef = await addDoc(collection(db, "collecte"), supportToSave);
        // console.log("Document written with ID: ", docRef.id);

        const listKeyStore = await AsyncStorage.getAllKeys();

        if (listKeyStore.includes("capture")) {
            const dataStored = await AsyncStorage.getItem('capture')
            let dataTransform = JSON.parse(dataStored)
            dataTransform.push(supportToSave)
            await AsyncStorage.removeItem('capture')
            await AsyncStorage.setItem('capture', JSON.stringify(dataTransform))
            console.log('Données sauvegardées = ', dataTransform)
        } else {
            const firstData = [supportToSave]
            await AsyncStorage.setItem('capture', JSON.stringify(firstData))
            console.log('Premier enregistrement avec succès = ', firstData)
        }

        router.back()

    }

    const getCurrentLocation = async () => {
        setIsLoading(true)
        let { status } = await Location.requestBackgroundPermissionsAsync();

        if (status !== "granted") {
            setErrorMsg("Acceès à la localisation du téléphone refusé")
            return
        }

        let myLocation = await Location.getCurrentPositionAsync({
            accuracy: 5,
            mayShowUserSettingsDialog: true
        });
        setIsLoading(false)
        Alert.alert("Position capturée")
        setLocation(myLocation)
        setLatitude(myLocation.coords.latitude)
        setLongitude(myLocation.coords.longitude)
    }


    return (
        <View style={styles.container} >
            <View style={styles.viewHeader}>
                <Text style={styles.headerTitle} > Collect nouveau support </Text>
            </View>
            <View>
                {
                    !location ? (
                        <View>
                            {
                                isLoading ? (
                                    <TouchableOpacity style={styles.spin} >
                                        <ActivityIndicator size='large' color="#212f3c" />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={styles.localise} onPress={getCurrentLocation} >
                                        <MaterialCommunityIcons name="crosshairs-gps" size={28} color="white" />
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    ) : (
                        null
                    )
                }
            </View>




            {
                !location ? (
                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#1e8449",
                        marginTop: 20
                    }}>
                        <Text style={{
                            color: "white",
                            fontSize: 30,
                            fontWeight: "bold",
                            textAlign: "center"
                        }}>
                            Prendre la position du support
                        </Text>
                    </View>
                ) : (
                    <ScrollView
                        contentContainerStyle={{
                            paddingHorizontal: 8
                        }}>
                        <CustomSelect
                            label='Départ'
                            datas={departs}
                            second='second'
                            handleSelect={handleDepart}
                            labelColor={"#922b21"}
                        />
                        <CustomSelect
                            label='Structure support bois'
                            datas={typeStructure}
                            second='second'
                            handleSelect={handleSupBois}
                            labelColor={"#922b21"}
                        />
                        <CustomSelect
                            label='Etat support bois'
                            datas={etatSupport}
                            second='second'
                            handleSelect={handleEtatSup}
                            labelColor={"#922b21"}
                        />
                        <CustomSelect
                            label='Hauteur support bois'
                            datas={hauteurSupport}
                            second='second'
                            handleSelect={handleHautBois}
                            labelColor={"#922b21"}
                        />
                        <CustomSelect
                            label='Armement support bois'
                            datas={typeArmement}
                            second='second'
                            handleSelect={handleArmement}
                            labelColor={"#922b21"}
                        />
                        <CustomInput
                            label='Nbr Iso rigide à remplacer'
                            placeholder='-'
                            type='numeric'
                            labelColor='#922b21'
                            handleInput={handleNbrIso}
                            val
                        />
                        <CustomInput
                            label='Nbr elm chaine à remplacer'
                            placeholder='-'
                            type='numeric'
                            labelColor='#922b21'
                            handleInput={handleChaine}
                            val
                        />
                        <CustomSelect
                            label='Accessibilité camion grue'
                            datas={accessibilite}
                            second='second'
                            handleSelect={handleAccess}
                            labelColor={"#922b21"}
                        />
                        <CustomSelect
                            label='Structure support beton'
                            datas={typeStructureBeton}
                            second='second'
                            handleSelect={handleSupBeton}
                            labelColor={"#1f618d"}
                        />
                        <CustomSelect
                            label='Effort support beton'
                            datas={efforts}
                            second='second'
                            handleSelect={handleEffortBeton}
                            labelColor={"#1f618d"}
                        />
                        <CustomSelect
                            label='Armement support beton'
                            datas={armementBeton}
                            second='second'
                            handleSelect={handleArmBeton}
                            labelColor={"#1f618d"}
                        />
                        <CustomInput
                            label='Nbr armement béton'
                            placeholder='-'
                            type='numeric'
                            labelColor="#1f618d"
                            handleInput={handleNbrArmBeton}
                            val
                        />
                        <CustomSelect
                            label='Hauteur support beton'
                            datas={hauteurSupport}
                            second='second'
                            handleSelect={handleHauteurBeton}
                            labelColor={"#1f618d"}
                        />
                        <CustomSelect
                            label='Végétation'
                            datas={vegetations}
                            second='second'
                            handleSelect={handleVegetation}
                            labelColor={"#1f618d"}
                        />
                        <CustomInput
                            label='Observations'
                            placeholder='...'
                            labelColor='#1f618d'
                            handleInput={handleObservations}
                            multiline={true}
                            h={90}
                            val
                        />
                        <View style={styles.btnView}>
                            <TouchableOpacity
                                style={[styles.touchBtn, { backgroundColor: '#ec7063' }]}
                                onPress={takePic}
                            >
                                <Octicons name="device-camera" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.touchBtn, { backgroundColor: '#196f3d' }]}
                                onPress={validate}
                            >
                                <Text style={styles.textBtn}>Valider</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                )
            }

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#d1f2eb",
        flex: 1,
    },
    localise: {
        backgroundColor: "#283747",
        width: "80%",
        marginHorizontal: "auto",
        padding: 8,
        justifyContent: 'center',
        alignItems: "center",
        marginVertical: 8,
        borderRadius: 8
    },
    spin: {
        backgroundColor: "#eaeded",
        width: "80%",
        marginHorizontal: "auto",
        padding: 8,
        justifyContent: 'center',
        alignItems: "center",
        marginVertical: 8,
        borderRadius: 8,
        borderColor: "#212f3c",
        borderWidth: 1
    },
    viewHeader: {
        padding: 5,
        backgroundColor: "#148f77"
    },
    headerTitle: {
        color: "white",
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold"
    },
    btnView: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 8,
        columnGap: 10
    },
    touchBtn: {
        padding: 8,
        borderRadius: 5,
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textBtn: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    }
})