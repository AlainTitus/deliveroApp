import { View, Text, StyleSheet, ScrollView, Button, SafeAreaView, Image, Dimensions, Alert, Pressable } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import CustomSelect from '../../../components/CustomSelect'
import CustomInput from '../../../components/CustomInput'
import { agences, typeCompteur, nbrFils } from '../../../datas/labels'
import ElmtPicker from '../../../components/ElmtPicker'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Camera, CameraView } from 'expo-camera'
import { shareAsync } from 'expo-sharing'
import * as MediaLibrary from 'expo-media-library';
import { saveStore, getStorage } from '../../../utils/asyncStorage'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'
import FormBranch from '../../../components/FormBranch'

const Icon = () => {
  return <Ionicons name="camera" size={24} color="white" />
}

// export default function PeraceBranch() {
//   const cameraRef = useRef();

//   /** Déclaration des états *******/
//   const [image, setImage] = useState(null);
//   const [hasCameraPermission, setHasCameraPermission] = useState();
//   const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
//   const [photo, setPhoto] = useState()
//   const [toogleCamera, setToogleCamera] = useState(true)
//   const [agence, setAgence] = useState('');

//   const [typeCptPose, setTypeCptPose] = useState('');
//   const [numCptPose, setNumCptPose] = useState('');
//   const [nbreFils, setNbreFils] = useState(0);
//   const [anomalie, setAnomalie] = useState('');

//   const [location, setLocation] = useState(null);

//   /** Gestion de la navigation ***/
//   const router = useRouter()
//   /*******************************/
//  useEffect(()=>{
//   async function getCurrentPosition() {
    
//     let {status} = await Location.requestForegroundPermissionsAsync();
//     if(status !== 'granted'){
//       Alert.alert("Oups!", "Votre localisation n'est pas activée")
//     }
//   }

//   getCurrentPosition()

//  }, [])
//   useEffect(() => {
//     (
//       async () => {
//         const cameraPermission = await Camera.requestCameraPermissionsAsync();
//         const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
//         setHasCameraPermission(cameraPermission.status === 'granted')
//         setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted')
//       }
//     )();
//   }, [])

//   if (hasCameraPermission === undefined) {
//     return <Text> Requesting permission... </Text>
//   } else if (!hasCameraPermission) {
//     return <Text> Permission for camera not granted. Please change this settings.</Text>
//   }

//   let takePic = async () => {
//     let options = {
//       quality: 0.3,
//       base64: true,
//       exif: false
//     };

//     let newPhoto = await cameraRef.current.takePictureAsync(options)
//     let localisation = await Location.getCurrentPositionAsync();
//     setLocation(localisation)
//     setPhoto(newPhoto)


//   };

//   /** Lorsque la photo est disponible **/
//   if (photo) {
//     let sharePic = () => {
//       shareAsync(photo.uri).then(() => {
//         setPhoto(undefined)
//       })
//     };
//     let savePhoto = async () => {
//       MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
//         setPhoto(undefined)
//       })
//       const asset = await MediaLibrary.createAssetAsync(photo.uri)

//       await MediaLibrary.createAlbumAsync('branchement', asset, false)

//       console.log("uri photo", photo.uri)
//       const value = {
//         uri: photo.uri,
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude
//       }
//       console.log(value)
//       saveStore("storebranch", value)
//     }

//     return (
//       <SafeAreaView style={{ flex: 1 }}>
//         <Image style={styles.preview} source={{ uri: photo.uri }} />
//         <Button title='Share' onPress={sharePic} />
//         {hasMediaLibraryPermission ? <Button title='save' onPress={savePhoto} /> : undefined}
//         <Button title='Discard' onPress={() => setPhoto(undefined)} />
//       </SafeAreaView>
//     )
//   }
//   /****Fin de sauvegarde de la photo */


//   const showCamera = () => {
//     setToogleCamera(false)
//   }
//   const stopCamera = () => {
//     setToogleCamera(true)
//   }

//   const validate = async () => {
//     const globalKeys = await AsyncStorage.getAllKeys();
//     /**Controle de la prise d'une photo lors de la collecte ****/
//     if (!globalKeys.includes('storebranch')) {
//       Alert.alert('Attention', "Vous n'avez pas pris de photo pour cet enregistrement!", [
//         {
//           text: "Cancel",
//           onPress: () => console.log('Annulation pressé'),
//           style: 'cancel'
//         }
//       ])
//     } else {
//       /** Une photo a été prise, maintenant un vérifie si le store global existe ******/
//       if (globalKeys.includes('globalBranch')) {
//         /***recupération du contenu du store global ****/
//         const globalItems = await AsyncStorage.getItem('globalBranch')
//         let globalParsed = JSON.parse(globalItems)
//         console.log('globalParsed', globalParsed)
//         /***recupération du contenu du store spécifique ****/
//         getStorage('storebranch').then((result) => {
//           const value = {
//             activite: 'branch_perace',
//             agence,
//             typeCptPose,
//             numCptPose,
//             nbreFils,
//             anomalie,
//             photos: result
//           }
//           globalParsed.push(value)

//           /***On vide le store global ****/
//           AsyncStorage.removeItem('globalBranch')

//           return globalParsed;
//         }).then((data) => {
//           const globalStringified = JSON.stringify(data)
//           /***On recrée le store global en le mettant à jour */
//           AsyncStorage.setItem('globalBranch', globalStringified)
//           console.log('Mise à jour du store global avec succès')
//           AsyncStorage.removeItem('storebranch')
//           console.log('Effacement du store spécifique avec succès')
//           // router.back('/normalisation')
//           Alert.alert('Enregistré', 'Enregistrement de la collecte avec succès', [
//             {
//               text: 'OK',
//               onPress: () => router.back(),
//             },
//             {
//               text: 'Cancel',
//               onPress: () => null,
//               style: 'cancel'
//             }
//           ])
//         })

//       } else {
//         getStorage('store').then((result) => {
//           const value = {
//             activite: 'branch_perace',
//             agence,
//             typeCptPose,
//             numCptPose,
//             nbreFils,
//             anomalie,
//             photos: result
//           }
//           console.log('value', value)
//           return value;
//         }).then(data => {
//           console.log('then')
//           const dataToSave = [data]
//           const dataStringified = JSON.stringify(dataToSave);

//           AsyncStorage.setItem('globalBranch', dataStringified)

//           console.log('Premier enregistrement dans le store global avec succès')
//           AsyncStorage.removeItem('storebranch')
//           console.log('Effacement du store specifique avec succès')
//           // router.back('/normalisation')
//           Alert.alert('Enregistré', 'Enregistrement de la collecte avec succès', [
//             {
//               text: 'OK',
//               onPress: () => router.back(),
//             },
//             {
//               text: 'Cancel',
//               onPress: () => null,
//               style: 'cancel'
//             }
//           ])

//         })
//       }
//     }

//   }

//   const clearStorage = async () => {
//     await AsyncStorage.clear()
//   }

//   const handleBack = () => {
//     router.back()
//   }



//   return (
//     <>
//       {
//         toogleCamera && (
//           <View style={styles.container}>
//             <Text style={styles.textHeader} >Branchements Perace</Text>
//             <ScrollView style={styles.form}>
//               <CustomSelect label="Agence" datas={agences} second='second' labelColor={"#1a5276"} handleSelect={(value) => setAgence(value)} />
//               <CustomSelect label="Compteur posé" datas={typeCompteur} second='second' labelColor={"#1a5276"} handleSelect={(value) => setTypeCptPose(value)} />
//               <CustomInput label={"Numero compteur posé"} labelColor={"#1a5276"} handleInput={setNumCptPose} val={numCptPose} />
//               <CustomSelect label="Nbr de fil" datas={nbrFils} second='second' handleSelect={(value) => setNbreFils(value)} labelColor={"#1a5276"} />
//               <CustomInput label={"Activite"} number={10} multiline={true} h={70} labelColor={"#1a5276"} handleInput={setAnomalie} val={anomalie} />
//               <ElmtPicker icon={<Icon />} label={'Photos et documents'} textColor={"#943126"} btnColor={"#1b4f72"} onPress={showCamera} />

//               <View style={{ width: "70%", marginHorizontal: 'auto', marginVertical: 10 }}>
//                 <Pressable
//                   onPress={validate}
//                   style={{ backgroundColor: '#2e86c1', padding: 8, borderWidth: 1, borderColor: '#1b4f72', elevation: 4, borderRadius: 5 }}
//                 >
//                   <Text style={[styles.retour, { color: '#fff' }]}>Valider</Text>
//                 </Pressable>
//               </View>
//               <View style={{ width: "70%", marginHorizontal: 'auto', marginVertical: 10 }}>
//                 <Pressable
//                   onPress={handleBack}
//                   style={{ backgroundColor: '#fff', padding: 8, borderWidth: 1, borderColor: '#1b4f72', elevation: 4, borderRadius: 5 }}
//                 >
//                   <Text style={[styles.retour, { color: '#2874a6' }]}>Retour</Text>
//                 </Pressable>
//               </View>
//               <View style={{ width: "70%", marginHorizontal: 'auto', marginVertical: 10 }}>
//                 <Button title='clear storage' color={'#2e86c1'} onPress={clearStorage} />
//               </View>
//             </ScrollView>
//           </View>
//         )
//       }
//       {
//         !toogleCamera && (
//           <CameraView ref={cameraRef} style={styles.camera}>
//             <View style={styles.buttonContainer}>
//               <Button title='photo' onPress={takePic} />
//               <Button title='Annuler' onPress={stopCamera} />
//             </View>
//           </CameraView>)
//       }
//     </>
//   )
// }
export default function PeraceBranch() {


  return (
    <>
      <FormBranch 
      titre={"Branchements Perace"} 
      action={"branch_perace"} 
      album={"BranchPerace"} 
      store={"branchperace"} 
      headerColor= '#2e86c1' 
      bgColor="#ebf5fb" 
      cameraColor="#1b4f72" 
      buttonColor="#2e86c1" 
      bordColor="#2e86c1" 
      labelColor="#1a5276" 
      />
    </>
  )
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 5,
//     backgroundColor: '#ebf5fb'
//   },
//   textHeader: {
//     textAlign: 'center',
//     fontSize: 20,
//     fontWeight: 'bold',
//     paddingVertical: 10,
//     backgroundColor: '#2e86c1',
//     color: "white"
//   },
//   form: {
//     paddingHorizontal: 5
//   },
//   camera: {
//     flex: 1,
//     position: 'relative',
//     alignItems: 'center'
//   },
//   buttonContainer: {
//     position: 'absolute',
//     bottom: 50,
//     flexDirection: 'row',
//     gap: 10
//   },
//   preview: {
//     alignSelf: 'stretch',
//     flex: 1
//   },
//   retour: {
//     textAlign: 'center',
//     fontSize: 18,
//     fontWeight: 'bold'
//   },
//   pressableBtn: {
//     borderWidth: 2,
//     borderColor: '#21618c',
//   }
// })