import 'react-native-get-random-values'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { departs } from '../../../datas/labels'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import { supabase } from '../../../utils/supabase'
import { BarChart, ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from "react-native";
import { nbrSupGIS, nbrSupDepart, nbrCollectDepart } from '../../../utils/getSupabase';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import { useAuth } from '../../../provider/AuthProvider';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { v4 as uuidv4 } from 'uuid'


const screenWidth = Dimensions.get("window").width;
const chartConfig = {
    backgroundGradientFrom: "#1a5276",
    backgroundGradientFromOpacity: 0.9,
    backgroundGradientTo: "#1a5276",
    backgroundGradientToOpacity: 1,
    color: (opacity = 0.2) => `#ebf5fb`,
    strokeWidth: 1, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
};

const chartConfigProgress = {
    backgroundGradientFrom: "#1a5276",
    backgroundGradientFromOpacity: 0.9,
    backgroundGradientTo: "#1a5276",
    backgroundGradientToOpacity: 1,
    color: (opacity = 0.2) => `rgba(244, 208, 63, 0.4)`,
    strokeWidth: 1, // optional, default 3
    barPercentage: 0.3,
    useShadowColorFromDataset: false // optional
};

const ItemDepart = ({ depart, nbr }) => {
    return (
        <View style={styles.itemDepart}>
            <Text style={styles.valueItem}> {depart} </Text>
            <Text style={styles.valueItem}> {nbr} </Text>
        </View>
    )
}

export default function Supports() {
    const [store, setStore] = useState([]);
    const [getData, setGetData] = useState([])
    const [collectedD11BERT, setCollectedD11BERT] = useState(0)
    const [collectedD12BERT, setCollectedD12BERT] = useState(0)
    const [collectedD31BAT, setCollectedD31BAT] = useState(0)
    const [collectedD32BEL, setCollectedD32BEL] = useState(0)
    const [refresh, setRefresh] = useState(false)

    const router = useRouter();
    const navigation = useNavigation()
    const { user } = useAuth()

    const sumCollecte = collectedD11BERT + collectedD12BERT + collectedD31BAT + collectedD32BEL;

    const onRefresh = () => {
        setRefresh(true)
        try {
            refresDisplay();
            updateDataGraph()
            setRefresh(false)
        } catch (error) {
            Alert.alert('Erreur de connexion à la BD')
        }

    }

    const data = {
        labels: ["D11 BERTOUA", "D12 BERTOUA", "D32 BELABO", "D31 BATOURI"],
        datasets: [
            {
                data: [collectedD11BERT, collectedD12BERT, collectedD32BEL, collectedD31BAT]
            }
        ]
    };

    const goToMap = () => {
        router.navigate('/mapcollecte')
    }

    const refresDisplay = async () => {

        const listKeyStore = await AsyncStorage.getAllKeys();
        if (listKeyStore.includes("capture")) {
            let dataStored = await AsyncStorage.getItem("capture")
            dataStored = JSON.parse(dataStored)
            setStore([...dataStored])
        }
    }

    const loadToDatabase = async () => {

        let nbr = store.length;
        for (var i = 0; i < nbr; i++) {
            const { data, error } = await supabase.from('supportCollected').insert([store[i]]).single()
            if (error) {
                console.log("Erreur en ajoutant une donnée")
                return;
            }
            let nbrUri = store[i].uri.length
            console.log("store => ", store)
            console.log('nbruri =>', nbrUri)
            let img = store[i].uri
            for (var j = 0; j < nbrUri; j++) {
                const base64 = await FileSystem.readAsStringAsync(img[j].uri, { encoding: 'base64' });
                const filePath = `${store[i].imglink}/${new Date().getTime()}.png`
                console.log('user id =>', user.id)
                const contentType = 'image/png';
                await supabase.storage.from('image.supports').upload(filePath, decode(base64), { contentType });
            }
        }
        console.log("Données ajoutées avec succès")
        setStore([])
        await AsyncStorage.removeItem("capture")
    }

    const handleStat = (val) => {
        navigation.navigate("statdepart", { key: val })
    }

    const newSupportFormPage = () => {
        router.push('/newSupport')
    }

    useEffect(() => {
        refresDisplay()
    }, [])

    const updateDataGraph = () => {
        nbrCollectDepart("D11 BERTOUA").then(res => {
            setCollectedD11BERT(res)
        })
        nbrCollectDepart("D12 BERTOUA").then(res => {
            setCollectedD12BERT(res)
        })
        nbrCollectDepart("D31 BATOURI").then(res => {
            setCollectedD31BAT(res)
        })
        nbrCollectDepart("D32 BELABO").then(res => {
            setCollectedD32BEL(res)
        })
    }

    useEffect(() => {
       updateDataGraph()
    }, [])

    // const downloadData = async () => {
    //     const { data, error } = await supabase.from('supportCollected').select()
    //     if (error) {
    //         console.log("Erreur de lecture de la base de données")
    //         return;
    //     }
    //     console.log("data => ", data.length)
    //     setGetData([...data])
    // }

    // useEffect(() => {
    //     downloadData()
    // }, [])

    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
                }
            >
                <View style={styles.headerBlock}>
                    {/* <Text style={styles.headerText}>Collecte des supports MT</Text> */}
                    <Text style={styles.title}>Supports par départs</Text>
                    <ScrollView
                        horizontal
                        style={styles.scrollbtn}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 3
                        }}
                    >
                        {
                            departs.map(dep => {
                                return (
                                    dep.label == "Choix d'un depart" ? null : (
                                        <TouchableOpacity
                                            key={dep.label}
                                            style={styles.btnTouch}
                                            onPress={() => handleStat(dep.label)}
                                        >
                                            <Text style={styles.textbtn}> {dep.value} </Text>
                                        </TouchableOpacity>
                                    )
                                )
                            })
                        }
                    </ScrollView>
                </View>
                <View style={styles.options}>
                    <TouchableOpacity style={styles.btnoption} onPress={goToMap}>
                        <FontAwesome name="map-marker" size={36} color="white" />
                        <Text style={styles.labelBntOption}>Carte</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnoption} onPress={newSupportFormPage}>
                        <FontAwesome6 name="file-waveform" size={36} color="white" />
                        <Text style={styles.labelBntOption}>Form</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.synchro}>
                    <View style={styles.titleIcone}>
                        <Text style={styles.labelIcone} >Captures à synchroniser</Text>
                        <TouchableOpacity onPress={refresDisplay}>
                            <Ionicons name="refresh-circle" size={40} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 5 }}>
                        {
                            store.length === 0 ? (
                                <View>
                                    <Text style={{ color: "white", textAlign: 'center', fontSize: 16, fontStyle: 'italic' }}>
                                        Aucune collecte pour le moment!!!
                                    </Text>
                                </View>
                            ) : (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{
                                        gap: 8
                                    }
                                    }
                                >
                                    {
                                        store.map((elm, index) => (
                                            <View style={{ elevation: 5 }} key={index}>
                                                <Image source={elm.uri[0]} style={{ width: 150, height: 150 }} />
                                                <Text
                                                    style={{
                                                        position: "absolute",
                                                        zIndex: 100,
                                                        bottom: 10,
                                                        left: 10,
                                                        backgroundColor: 'white',
                                                        textAlign: 'center',
                                                        borderRadius: 4,
                                                        padding: 3,
                                                        borderColor: '#1a5276',
                                                        borderWidth: 1
                                                    }}
                                                >Nbr photos: {elm.uri.length} </Text>
                                            </View>
                                        ))
                                    }
                                </ScrollView>
                            )
                        }
                        {
                            store.length === 0 ? null : (
                                <TouchableOpacity
                                    style={styles.addBtn}
                                    onPress={loadToDatabase}
                                >
                                    <AntDesign name="pluscircle" size={36} color="rgba(255, 255, 255, 0.5)" />
                                </TouchableOpacity>
                            )
                        }

                    </View>
                </View>

                <View style={styles.containerStat}>
                    <View style={styles.titreGIS}>
                        <Text style={styles.textGIS}>Statistique du GIS poteaux</Text>
                        <MaterialCommunityIcons name="google-analytics" size={26} color="white" />
                    </View>
                    <View style={styles.statCard}>
                        <View style={styles.departStat}>
                            <ItemDepart depart={"D11 BERTOUA"} nbr={nbrSupDepart("D11 BERTOUA")} />
                            <ItemDepart depart={"D12 BERTOUA"} nbr={nbrSupDepart("D12 BERTOUA")} />
                            <ItemDepart depart={"D31 BATOURI"} nbr={nbrSupDepart("D31 BATOURI")} />
                            <ItemDepart depart={"D32 BELABO"} nbr={nbrSupDepart("D32 BELABO")} />
                        </View>
                        <View style={styles.StatGlobal}>
                            <Text style={styles.valueGlobal}> {nbrSupGIS} </Text>
                            <Text style={{ color: 'white' }}>supports</Text>
                        </View>
                    </View>
                </View>


                <View style={{ marginTop: 10, paddingVertical: 5 }}>
                    <View style={styles.titreGIS}>
                        <Text style={styles.textGIS}>Statistiques sur les collectes ({sumCollecte})</Text>
                        <Fontisto name="mobile-alt" size={24} color="white" />
                    </View>
                    <BarChart
                        data={data}
                        width={screenWidth}
                        height={220}
                        yAxisLabel=""
                        chartConfig={chartConfig}
                        verticalLabelRotation={10}
                        fromZero
                        showBarTops={true}
                        showValuesOnTopOfBars={true}
                    />
                </View>


            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 0,
        backgroundColor: "rgba(214, 243, 255, 0.5)",
        flex: 1,
        paddingBottom: 10
    },
    headerBlock: {
        paddingHorizontal: 3,
        backgroundColor: "#1a5276",
        paddingTop: 5,
        paddingBottom: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        elevation: 8
    },
    headerText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: "white"
    },
    btnTouch: {
        padding: 4,
        backgroundColor: '#cacfd2',
        margin: 3,
        borderRadius: 5,
        elevation: 5
    },
    scrollbtn: {
        marginVertical: 10
    },
    textbtn: {
        fontWeight: 'semibold',
        textAlign: 'center',
        fontSize: 16
    },
    title: {
        fontSize: 18,
        fontWeight: 'semibold',
        marginTop: 15,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: "#85929e",
        color: "white"
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginVertical: 20
    },
    btnoption: {
        height: 90,
        width: "40%",
        backgroundColor: "#1a5276",
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8
    },
    labelBntOption: {
        color: 'white'
    },
    titleIcone: {
        borderBottomWidth: 1,
        borderBottomColor: "#85929e",
        paddingBottom: 4,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    labelIcone: {
        color: "white",
        fontSize: 18,
        fontWeight: 'semibold',
    },
    addBtn: {
        position: 'absolute',
        zIndex: 200,
        right: 6,
        bottom: 10
    },
    synchro: {
        backgroundColor: "#1a5276",
        paddingBottom: 8,
        paddingHorizontal: 8,
        elevation: 8
    },
    titreGIS: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 5,
        backgroundColor: "#1a5276",
    },
    containerStat: {
        marginTop: 10
    },
    textGIS: {
        color: 'white',
        fontSize: 18
    },
    statCard: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#138d75",
        paddingVertical: 5
    },
    departStat: {
        width: "60%",
        padding: 5,
        borderRightWidth: 2,
        borderRightColor: "white"
    },
    StatGlobal: {
        width: "39%",
        padding: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    itemDepart: {
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    valueItem: {
        color: "white"
    },
    valueGlobal: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 24
    }
})