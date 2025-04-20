import { View, Text, StyleSheet, ScrollView, Button, SafeAreaView, Image, Dimensions, Alert, Pressable } from 'react-native'
import React, { useState, useEffect} from 'react'
import CustomSelect from './CustomSelect'
import CustomInput from './CustomInput'
import { agences, typeCompteur, nbrFils, activites } from '../datas/labels'
import ElmtPicker from './ElmtPicker'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Camera, CameraView } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'
import * as ImagePicker from 'expo-image-picker'
import { manipulateAsync } from 'expo-image-manipulator'
import Checkbox from 'expo-checkbox'

const Icon = () => {
  return <Ionicons name="camera" size={24} color="white" />
}

const checkForm = (field, label) => {
  if (field == "") {
    Alert.alert(`Bien vouloir remplir le champ ${label}`)
    return;
  }
}
export default function FormNorma({titre, headerColor, bgColor, cameraColor, buttonColor, bordColor, labelColor, checkColor, action, album, store}) {

  /** Déclaration des états *******/
  const [isChecked, setIsChecked] = useState(false)
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState()
  const [agence, setAgence] = useState('');
  const [typeCptDepose, setTypeCptDepose] = useState('')
  const [numCptDepose, setNumCptDepose] = useState('');
  const [typeCptPose, setTypeCptPose] = useState('');
  const [numCptPose, setNumCptPose] = useState('');
  const [nbreFils, setNbreFils] = useState(0);
  const [anomalie, setAnomalie] = useState('');
  const [activite, setActivite] = useState('')
  const [numWhatsapp, setNumWatsapp] = useState('')
  const [listURIItem, setListURIItem] = useState([])

  const [location, setLocation] = useState(null);

  /** Gestion de la navigation ***/
  const router = useRouter()
  /*******************************/
  useEffect(() => {
    async function getCurrentPosition() {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Oups!", "Votre localisation n'est pas activée")
      }
    }

    getCurrentPosition()

  }, [])
  useEffect(() => {
    (
      async () => {
        const cameraPermission = await Camera.requestCameraPermissionsAsync();
        const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
        setHasCameraPermission(cameraPermission.status === 'granted')
        setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted')
      }
    )();
  }, [])

  if (hasCameraPermission === undefined) {
    return <Text> Requesting permission... </Text>
  } else if (!hasCameraPermission) {
    return <Text> Permission for camera not granted. Please change this settings.</Text>
  }
  /*--------Fonction de prise de la photo-------------- */
  let takePic = async () => {

    /***** Etape1: Vérifier l'activation de la localisation au moment de la prise de photo ****/
    if (!location) {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Merci d'activer la localisation sur votre mobile")
        return;
      }
    }

    /******* Etape2:  Prendre la photo avec ImagePicker **********/
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })
    /******* Etape3: Prendre simultanement la localisation de l'objet filmé ***/
    const newLocation = await Location.getCurrentPositionAsync({
      accuracy: 5,
    });
    setLocation(newLocation)
    console.log("newphoto => ", result)

    /*** Etape4: Recuperation des uri des photos prises sur cette collecte dans un tableau d'état ****/
    if (!result.canceled) {
      let itemURI = result.assets[0].uri
      let newListURIItem = [...listURIItem];
      newListURIItem.push(itemURI);
      setListURIItem([...newListURIItem])
      Alert.alert('Photo sauvegardé avec succès!')
    } else {
      console.log('uri non sauvegaerdé')
      return;
    }
    
  };

  /*--------- Fonction de Sauvegarde des données du formulaire de collecte et des photos prises ------*/
  const validate = async () => {
    console.log('document validé')
    /*** Etape1: Vérifier la prise des photos avant la validation ***/
    let nbrURI = listURIItem.length
    console.log("nbr photo: ", nbrURI)
    if (nbrURI === 0) {
      Alert.alert("Bien vouloir prendre au moins une photo du compteur!");
      return;
    }
    /*** Etape 2: Vérifer que les champs du formulaire sont remplis  ***/
    checkForm(agence, 'Mettre à jour le champ Agence')
    checkForm(typeCptDepose, 'Type de compteur déposé')
    checkForm(numCptDepose, 'Compteur déposé')
    checkForm(typeCptPose, 'Type de compteur posé')
    checkForm(numCptPose, 'Compteur posé')
    checkForm(nbrFils, 'nombre de fils')
    checkForm(numWhatsapp, 'numero whatsapp')
    checkForm(activite, 'activité')
    checkForm(anomalie, 'Anomalie corrigée')
    

    /*** Etape 3: Comprimer les images (uri) avant sauvegarde ***/
    let compressedURI = [];
    for (var i = 0; i < nbrURI; i++) {
      const manipResult = await manipulateAsync(
        listURIItem[i], [], { compress: 0.1, base64: true }
      );
      compressedURI.push(manipResult)
    }
    console.log('Fin de compressions')
    /*** Etape 4: Création de l'objet à stocker ***/
    const newPhoto = {
      activite: action,
      agence,
      typeCptDepose,
      numCptDepose,
      typeCptPose,
      numCptPose,
      nbreFils,
      anomalie,
      fraude: isChecked,
      numWhatsapp,
      activite,
      uri: compressedURI,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }

    }

    /*** Etape5: Création des assets des images à stocker puis stockage dans l'album normaPerace */
    console.log('debut stockage')
    const nomPhotos = [];
    for (var i = 0; i < nbrURI; i++) {
      console.log("first")
      let asset = await MediaLibrary.createAssetAsync(compressedURI[i].uri)
      asset.filename = album + "_" + numCptDepose + '_' + i
      nomPhotos.push(asset.filename)
      console.log(asset)
      await MediaLibrary.createAlbumAsync(album, asset, false)
    }
    console.log("nom photo =>", nomPhotos);

    /**** Etape6: Ajouter les noms des photos dans l'objet à enregistrer ***/
    newPhoto.nomPhoto = nomPhotos;

    /*** Etape7: Stockage en local des données avec AsyncStorage ***/
    const keys = await AsyncStorage.getAllKeys();

    if (keys.includes(store)) {
      const getItemStorage = await AsyncStorage.getItem(store);
      const itemStorage = JSON.parse(getItemStorage);
      itemStorage.push(newPhoto);
      await AsyncStorage.removeItem(store);
      await AsyncStorage.setItem(store, JSON.stringify(itemStorage))
    } else {
      const firstItem = [newPhoto];
      await AsyncStorage.setItem(store, JSON.stringify(firstItem))
    }

    /*** Etape8: Reinitialisation du formulaire et confirmation de la sauvegarde en local ***/
    setNumCptDepose('')
    setNumCptPose('')
    setAnomalie('')
    setLocation('')
    setNumWatsapp('')
    const all = await AsyncStorage.getAllKeys()
    console.log(all)
    Alert.alert('Sauvegardé avec succès!')
  }

  const clearStorage = async () => {
    await AsyncStorage.clear()
  }

  const handleBack = () => {
    router.back()
  }



  return (
    <>
          <View style={[styles.container, {backgroundColor: bgColor}]}>
            <Text style={[styles.textHeader, {backgroundColor: headerColor} ]} > {titre} </Text>
            <ScrollView style={styles.form}>
              <CustomSelect label="Agence" datas={agences} second='second' labelColor={labelColor} handleSelect={(value) => setAgence(value)} />
              <CustomSelect label="Compteur déposé" datas={typeCompteur} second='second' labelColor={labelColor} handleSelect={(value) => setTypeCptDepose(value)} />
              <CustomInput label={"Numero compteur déposé"} labelColor={labelColor} handleInput={setNumCptDepose} val={numCptDepose} />
              <CustomSelect label="Compteur posé" datas={typeCompteur} second='second' labelColor={labelColor} handleSelect={(value) => setTypeCptPose(value)} />
              <CustomInput label={"Numero compteur posé"} labelColor={labelColor} handleInput={setNumCptPose} val={numCptPose} />
              <CustomSelect label="Nbr de fil" datas={nbrFils} second='second' handleSelect={(value) => setNbreFils(value)} labelColor={labelColor} />
              <CustomInput label={"Whatsapp"} labelColor={labelColor} handleInput={setNumWatsapp} val={numWhatsapp} type={'numeric'} />
              <CustomSelect label="Activité" datas={activites} second='second' labelColor={labelColor} handleSelect={(value) => setActivite(value)} />
              <CustomInput label={"Anomalie"} number={20} multiline={true} h={100} labelColor={labelColor} handleInput={setAnomalie} val={anomalie} />
              <View style={{ flexDirection: 'row', paddingHorizontal: 5, marginTop: 15, alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'semibold', color: "#943126", marginRight: 10 }}> Suite fraude? </Text>
                <Checkbox
                  value={isChecked}
                  onValueChange={setIsChecked}
                  color={isChecked ? checkColor : undefined}
                />
              </View>
              <ElmtPicker icon={<Icon />} label={'Photos et documents'} textColor={"#943126"} btnColor={cameraColor} onPress={takePic} />

              <View style={{ width: "70%", marginHorizontal: 'auto', marginVertical: 10 }}>
                <Pressable
                  onPress={validate}
                  style={{ backgroundColor: buttonColor, padding: 8, elevation: 4, borderRadius: 5 }}
                >
                  <Text style={[styles.retour, { color: '#fff' }]}>Valider</Text>
                </Pressable>
              </View>
              <View style={{ width: "70%", marginHorizontal: 'auto', marginVertical: 10 }}>
                <Pressable
                  onPress={handleBack}
                  style={{ backgroundColor: '#fff', padding: 8, borderWidth: 1, borderColor: buttonColor, elevation: 4, borderRadius: 5 }}
                >
                  <Text style={[styles.retour, { color: buttonColor }]}>Retour</Text>
                </Pressable>
              </View>
              <View style={{ width: "70%", marginHorizontal: 'auto', marginVertical: 10 }}>
                <Button title='clear storage' color={buttonColor} onPress={clearStorage} />
              </View>
            </ScrollView>
          </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: '#ebf5fb'
  },
  textHeader: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10,
    backgroundColor: '#2e86c1',
    color: "white"
  },
  form: {
    paddingHorizontal: 5
  },
  camera: {
    flex: 1,
    position: 'relative',
    alignItems: 'center'
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    gap: 10
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1
  },
  retour: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
  pressableBtn: {
    borderWidth: 2,
    borderColor: '#21618c',
  }
})