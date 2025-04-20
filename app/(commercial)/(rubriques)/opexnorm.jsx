
import FormNorma from '../../../components/FormNorma'

// export default function Opexnom() {
//   const cameraRef = useRef();

//   /** Déclaration des états *******/
//   const [image, setImage] = useState(null);
//   const [hasCameraPermission, setHasCameraPermission] = useState();
//   const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
//   const [photo, setPhoto] = useState()
//   const [toogleCamera, setToogleCamera] = useState(true)
//   const [agence, setAgence] = useState('');
//   const [typeCptDepose, setTypeCptDepose] = useState('')
//   const [numCptDepose, setNumCptDepose] = useState('');
//   const [typeCptPose, setTypeCptPose] = useState('');
//   const [numCptPose, setNumCptPose] = useState('');
//   const [nbreFils, setNbreFils] = useState(0);
//   const [anomalie, setAnomalie] = useState('');

//   const [location, setLocation] = useState(null);

//   /** Gestion de la navigation ***/
//   const router = useRouter()
//   /*******************************/
//   useEffect(() => {
//     async function getCurrentPosition() {

//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert("Oups!", "Votre localisation n'est pas activée")
//       }
//     }

//     getCurrentPosition()

//   }, [])

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
//       quality: 0.5,
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

//       await MediaLibrary.createAlbumAsync('norma', asset, false)

//       console.log("uri photo", photo.uri)
//       const value = {
//         uri: photo.uri,
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude
//       }
//       console.log(value)
//       saveStore("store", value)
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
//     if (!globalKeys.includes('store')) {
//       Alert.alert('Attention', "Vous n'avez pas pris de photo pour cet enregistrement!", [
//         {
//           text: "Cancel",
//           onPress: () => console.log('Annulation pressé'),
//           style: 'cancel'
//         }
//       ])
//     } else {
//       /** Une photo a été prise, maintenant un vérifie si le store global existe ******/
//       if (globalKeys.includes('global')) {
//         /***recupération du contenu du store global ****/
//         const globalItems = await AsyncStorage.getItem('global')
//         let globalParsed = JSON.parse(globalItems)
//         console.log('globalParsed', globalParsed)
//         /***recupération du contenu du store spécifique ****/
//         getStorage('store').then((result) => {
//           const value = {
//             activite: 'norm_opex',
//             agence,
//             typeCptDepose,
//             numCptDepose,
//             typeCptPose,
//             numCptPose,
//             nbreFils,
//             anomalie,
//             photos: result
//           }
//           globalParsed.push(value)

//           /***On vide le store global ****/
//           AsyncStorage.removeItem('global')

//           return globalParsed;
//         }).then((data) => {
//           const globalStringified = JSON.stringify(data)
//           /***On recrée le store global en le mettant à jour */
//           AsyncStorage.setItem('global', globalStringified)
//           console.log('Mise à jour du store global avec succès')
//           AsyncStorage.removeItem('store')
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
//             activite: 'norm_opex',
//             agence,
//             typeCptDepose,
//             numCptDepose,
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

//           AsyncStorage.setItem('global', dataStringified)

//           console.log('Premier enregistrement dans le store global avec succès')
//           AsyncStorage.removeItem('store')
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
//             <Text style={styles.textHeader} >Normalisations Opex</Text>
//             <ScrollView style={styles.form}>
//               <CustomSelect label="Agence" datas={agences} second='second' labelColor={"#1a5276"} handleSelect={(value) => setAgence(value)} />
//               <CustomSelect label="Compteur déposé" datas={typeCompteur} second='second' labelColor={"#1a5276"} handleSelect={(value) => setTypeCptDepose(value)} />
//               <CustomInput label={"Numero compteur déposé"} labelColor={"#1a5276"} handleInput={setNumCptDepose} val={numCptDepose} />
//               <CustomSelect label="Compteur posé" datas={typeCompteur} second='second' labelColor={"#1a5276"} handleSelect={(value) => setTypeCptPose(value)} />
//               <CustomInput label={"Numero compteur posé"} labelColor={"#1a5276"} handleInput={setNumCptPose} val={numCptPose} />
//               <CustomSelect label="Nbr de fil" datas={nbrFils} second='second' handleSelect={(value) => setNbreFils(value)} labelColor={"#1a5276"} />
//               <CustomInput label={"Anomalie"} number={20} multiline={true} h={100} labelColor={"#1a5276"} handleInput={setAnomalie} val={anomalie} />
//               <ElmtPicker icon={<Icon />} label={'Photos et documents'} textColor={"#943126"} btnColor={"#145a32"} onPress={showCamera} />

//               <View style={{ width: "70%", marginHorizontal: 'auto', marginVertical: 10 }}>
//                 <Pressable
//                   onPress={validate}
//                   style={{ backgroundColor: '#117864', padding: 8, borderWidth: 1, borderColor: '#117864', elevation: 4, borderRadius: 5 }}
//                 >
//                   <Text style={[styles.retour, { color: '#fff' }]}>Valider</Text>
//                 </Pressable>
//               </View>
//               <View style={{ width: "70%", marginHorizontal: 'auto', marginVertical: 10 }}>
//                 <Pressable
//                   onPress={handleBack}
//                   style={{ backgroundColor: '#fff', padding: 8, borderWidth: 1, borderColor: '#117864', elevation: 4, borderRadius: 5 }}
//                 >
//                   <Text style={[styles.retour, { color: '#117864' }]}>Retour</Text>
//                 </Pressable>
//               </View>
//               <View style={{ width: "70%", marginHorizontal: 'auto', marginVertical: 10 }}>
//                 <Button title='clear storage' color={'#117864'} onPress={clearStorage} />
//               </View>
//             </ScrollView>
//           </View>
//         )
//       }
//       {
//         !toogleCamera && (
//           <CameraView ref={cameraRef} style={styles.camera}>
//             <View style={styles.buttonContainer}>
//               <Button title='take pick' onPress={takePic} />
//               <Button title='Cancel' onPress={stopCamera} />
//             </View>
//           </CameraView>)
//       }
//     </>



//   )
// }
export default function Opexnom() {

  return (
    <>
      <FormNorma
        titre={"Normalisation Opex"}
        action={"norm_opex"}
        album={"NormaOpex"}
        store={"normaopex"}
        headerColor='#117864'
        bgColor="#d1f2eb"
        cameraColor="#145a32"
        buttonColor="#117864"
        bordColor="#117864"
        labelColor="#117864"
        checkColor="#145a32" />
    </>



  )
}

