import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import DetailParEffort from '../../../../components/DetailParEffort';
import { useSupportStore } from '../../../../utils/store';

import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function DetailSupports() {

    const [depart, setDepart] = useState('');

    const supports = useSupportStore(state => state.supports)
    const { key } = useLocalSearchParams();

    let dataExcel = (datas) => {
        let data = datas.map((item) => {
            return [
                item.id,
                item.depart,
                item.hauteurBeton,
                item.force,
                item.structBeton,
                item.latitude,
                item.longitude,
                item.created_at
            ]
        })
        data.unshift(["ID", "depart", "Hauteur", "Effort", "Structure", "latitude", "Longitude", "date_collecte"]);
        return data;
    }


    let nbrSup = () => {
        const result = supports.filter(elmt => elmt.depart === key)
        return result;
    }

    let nbrPoteaux = (tab) => {
        let tabLength = tab.length;
        let resultat = 0;
        for (let i = 0; i < tabLength; i++) {
            if (tab[i].structBeton === "S") {
                resultat = resultat + 1;
            }
            if (tab[i].structBeton === "PS") {
                resultat = resultat + 2;
            }
            if (tab[i].structBeton === "3S") {
                resultat = resultat + 3;
            }
        }

        return resultat
    }

    let nbrParEffort = (val, tab) => {
        let valeur = tab.filter((item) => item.force === val);

    }

    let hauteur = (tab) => {
        let tabLength = tab.length;
        let resultat = [];
        for (let i = 0; i < tabLength; i++) {
            resultat.push(tab[i].hauteurBeton);
        }
        resultat = [...new Set(resultat)];
        return resultat
    }

    const result = nbrSup()

    let nbrPoteauTotal = nbrPoteaux(result);
    let typeHauteur = hauteur(result);
    let excel = dataExcel(result);
    let listepot = result;

    const generateExcel = async () => {
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.aoa_to_sheet([
            ...excel
        ]);

        XLSX.utils.book_append_sheet(wb, ws, "Sheet1", true);
        const base64 = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
        const filename = FileSystem.documentDirectory + "test.xlsx";
        FileSystem.writeAsStringAsync(filename, base64, { encoding: FileSystem.EncodingType.Base64 })
            .then(() => {
                Sharing.shareAsync(filename, {
                    dialogTitle: "Export Excel",
                    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
            })
            .catch((error) => {
                console.error("Error writing file:", error);
            });

    }


    return (
        <View style={styles.constainer}>
            <View style={{ backgroundColor: "#17202a", padding: 8 }}>
                <Text style={{ textAlign: "center", color: "#f7dc6f", fontSize: 16 }}>Poteaux bétons du {key}</Text>
            </View>
            <View style={styles.mainStat}>
                <Text style={{ color: "#f7dc6f", fontSize: 18 }}>Total poteaux bétons</Text>
                <View>
                    {typeHauteur.length === 0 ? (
                        <ActivityIndicator size="small" color="#f7dc6f" />
                    ) : (
                        <Text style={{ color: "white", fontSize: 20 }}> {nbrPoteauTotal} </Text>
                    )}
                </View>
            </View>
            {
                typeHauteur.length === 0 ? null : (
                    <View>
                        <TouchableOpacity onPress={generateExcel} style={{ backgroundColor: "#17202a", padding: 8, marginBottom: 10, width: "90%", marginHorizontal: "auto", borderRadius: 5 }}>
                            <Text style={{ textAlign: "center", color: "#f7dc6f", fontSize: 16 }}>Exporter vers Excel</Text>
                        </TouchableOpacity>
                    </View>
                )
            }


            <ScrollView>
                {typeHauteur.length === 0 ? null : (
                    <>
                        {typeHauteur.map((item, index) => {
                            return (
                                <View key={index}>
                                    <View style={styles.secondStat}>
                                        <Text style={{ color: "#f7dc6f", fontSize: 16 }}> Hauteur de {item}</Text>
                                        <TouchableOpacity onPress={() => console.log('efort => ' + item)}>
                                            <AntDesign name="caretright" size={20} color="#f7dc6f" />
                                        </TouchableOpacity>
                                    </View>
                                    <DetailParEffort hauteur={item} listepot={listepot} />
                                </View>

                            )
                        })}
                    </>
                )}

            </ScrollView>


        </View>
    )
}

const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        backgroundColor: "#34495e"
    },
    mainStat: {
        backgroundColor: "#17202a",
        padding: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        width: "90%",
        marginHorizontal: "auto",
        height: 80,
        elevation: 5,
        marginBottom: 10,
    },
    secondStat: {
        backgroundColor: "#17202a",
        paddingVertical: 8,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 3,
        elevation: 5,
    }
})