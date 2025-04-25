import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import RadioForm from 'react-native-simple-radio-button'
import { Link } from 'expo-router'
import { getStorage } from '../../../utils/asyncStorage'
import AntDesign from '@expo/vector-icons/AntDesign';


export default function Normalisation() {
    const [value, setValue] = useState(0)
    const [lien, setLien] = useState('/peracenorm')
    const [peraceStore, setPeraceStore] = useState([])
    const [opexStore, setOpexStore] = useState([])

    const items = [
        { label: "Projet Perace", value: 0 },
        { label: "Opex de la région", value: 1 },
    ]

    useEffect(() => {
        if (value == 0) {
            setLien('/peracenorm')
        } else if (value == 1) {
            setLien('/opexnorm')
        }
    }, [value])


    useEffect(() => {
        getStorage('normaperace').then(result => {
            console.log(result)
            setPeraceStore([...result])
        })
    }, [])
    useEffect(() => {
        getStorage('normaopex').then(result => {
            console.log(result)
            setOpexStore([...result])
        })
    }, [])


    return (
        <View style={styles.main}>
            <Text style={styles.texte}> Normalisations</Text>
            <View style={styles.radio}>
                <RadioForm radio_props={items} initial={value} onPress={(value) => setValue(value)}
                    selectedButtonColo="green"
                    selectedLabelColor="green"
                    labelStyle={{ fontSize: 25, padding: 10, marginTop: 5 }}
                    buttonSize={30}
                />
            </View>
            <Link href={lien} asChild>
                <TouchableOpacity style={styles.touch}>
                    <Text style={styles.title}> Valider le choix </Text>
                </TouchableOpacity>
            </Link>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{padding: 5, marginTop: 5}}
            >
                {/****Affichage des captures normalisation Perace */}
                {
                    peraceStore.length == 0 ? (
                        <View />

                    ) : (
                        <View style={styles.scrollContainer}>
                            <View style={styles.headCapture}>
                                <Text style={styles.labelCapture}>
                                    Perace à synchroniser
                                </Text>
                                <Text style={styles.nbrCapture}>
                                    {peraceStore.length}
                                </Text>
                            </View>
                            <ScrollView horizontal contentContainerStyle={styles.galerie} showsHorizontalScrollIndicator={false}>
                                {peraceStore.map((capture) => {
                                    return (
                                        <View style={styles.photos} key={capture.uri[0].uri}>
                                            <Image source={capture.uri[0]} style={{ width: 150, height: 150 }} />
                                            <TouchableOpacity style={styles.btnImage}>
                                                <Text style={styles.btnLabel}>Nbre photo: {capture.uri.length} </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })}
                            </ScrollView>
                            <View>
                                <TouchableOpacity
                                    style={styles.upload}
                                >
                                    <AntDesign name="cloudupload" size={30} color="#2e86c1" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }

                {/****Affichage des captures normalisation Opex */}
                {
                    opexStore.length == 0 ? (
                        <View />

                    ) : (
                        <View style={styles.scrollContainer}>
                            <View style={styles.headCapture}>
                                <Text style={styles.labelCapture}>
                                    Opex à synchroniser
                                </Text>
                                <Text style={styles.nbrCapture}>
                                    {opexStore.length}
                                </Text>
                            </View>
                            <ScrollView horizontal contentContainerStyle={styles.galerie} showsHorizontalScrollIndicator={false}>
                                {opexStore.map((capture) => {
                                    return (
                                        <View style={styles.photos} key={capture.uri[0].uri}>
                                            <Image source={capture.uri[0]} style={{ width: 150, height: 150 }} />
                                            <TouchableOpacity style={styles.btnImage}>
                                                <Text style={styles.btnLabel}>Nbre photo: {capture.uri.length} </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })}
                            </ScrollView>
                            <View>
                                <TouchableOpacity
                                    style={styles.upload}
                                >
                                    <AntDesign name="cloudupload" size={30} color="#2e86c1" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }
            </ScrollView>




        </View >
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        padding: 0
    },
    texte: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15
    },
    radio: {
        marginTop: 50,
        paddingLeft: 40,
        backgroundColor: 'rgba(202, 207, 210, 0.5)',
        paddingVertical: 10
    },
    touch: {
        width: '50%',
        marginHorizontal: 'auto',
        backgroundColor: '#2e86c1',
        padding: 10,
        marginTop: 20,
        borderRadius: 5,
        elevation: 5
    },
    title: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },
    photos: {
        position: 'relative',
        width: 150,
        height: 150,
        alignItems: 'center'
    },
    galerie: {
        gap: 5
    },
    btnImage: {
        position: 'absolute',
        bottom: 5,
        backgroundColor: '#d6eaf8',
        borderRadius: 5,
        padding: 3,

    },
    scrollContainer: {
        paddingVertical: 5,
        backgroundColor: '#1b4f72',
        marginTop: 20
    },
    btnLabel: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    headCapture: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
        marginBottom: 10
    },
    labelCapture: {
        color: 'white',
        fontSize: 18
    },
    nbrCapture: {
        color: 'white',
        fontSize: 20
    },
    upload: {
        backgroundColor: "#fff",
        padding: 3,
        alignItems: 'center',
        width: "40%",
        marginHorizontal: 'auto',
        marginVertical: 10,
        borderRadius: 5
    }

})