import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { v4 as uuidv4 } from 'uuid';

export default function DetailParEffort({ hauteur, listepot }) {

    const [details, setDetails] = React.useState([]);
    const efforts = ["300 daN", "500 daN", "800 daN", "1000 daN", "1250 daN", "1500 daN"];

    let nbrEffort = () => {
        let valeur = listepot.filter((item) => item.hauteurBeton === hauteur);
        let nbrValeur = valeur.length;
        let resultat = 0;
        for (let i = 0; i < nbrValeur; i++) {
            if (valeur[i].structBeton === "S") {
                resultat = resultat + 1;
            }
            if (valeur[i].structBeton === "PS") {
                resultat = resultat + 2;
            }
            if (valeur[i].structBeton === "3S") {
                resultat = resultat + 3;
            }
        }
        return resultat
    };

    let nbrParEffort = (val) => {
        let valeur = listepot.filter((item) => item.hauteurBeton === hauteur && item.force === val);
        let nbrValeur = valeur.length;
        let resultat = 0;
        for (let i = 0; i < nbrValeur; i++) {
            if (valeur[i].structBeton === "S") {
                resultat = resultat + 1;
            }
            if (valeur[i].structBeton === "PS") {
                resultat = resultat + 2;
            }
            if (valeur[i].structBeton === "3S") {
                resultat = resultat + 3;
            }
        }
        return resultat
    }

    let stat = () => {
        const nbr = efforts.length;
        console.log("nbr d'effort :", nbr)
        let list = [];
        for (var i = 0; i < nbr; i++) {
           if (nbrParEffort(efforts[i]) > 0) {
                list.push({
                    force: efforts[i],
                    hauteur: hauteur,
                    nbre: nbrParEffort(efforts[i]),
                    id: uuidv4()
                })
            }
        }
        setDetails(list);
    }

    React.useEffect(() => {
        stat()
    }, [])

    return (
        <View>
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.header}>
                    <Text style={styles.textHead}>Effort</Text>
                </View>
                <View style={styles.header}>
                    <Text style={styles.textHead}>Quantité</Text>
                </View>
                <View style={styles.header}>
                    <Text style={styles.textHead}>Taux</Text>
                </View>
            </View>
            {
                details.length > 0 ? details.map((item) => (
                    <View key={item.id} style={{ flexDirection: 'row' }}>
                        <View style={styles.header}>
                            <Text>{item.force}</Text>
                        </View>
                        <View style={styles.header}>
                            <Text>{item.nbre}</Text>
                        </View>
                        <View style={styles.header}>
                            <Text style={{color: `${((item.nbre / nbrEffort()) * 100) > 0.5 ? "red" : "green" }`}}>{((item.nbre / nbrEffort()) * 100).toFixed(2)} %</Text>
                        </View>
                    </View>
                )) : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: '33.3%',
        backgroundColor: '#f2f2f2',
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ccc'
    },
    textHead: {
        color: '#21618c',
        fontSize: 16,
        fontWeight: 'bold',
    }
})