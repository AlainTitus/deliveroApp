import { View, Text, Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Link } from 'expo-router'
import Entypo from '@expo/vector-icons/Entypo';
import { sousRubriques } from '../datas/labels';

export default function ItemsRubriques({ label }) {
    const [chevron, setChevron] = useState('up')
    const [items, setItems] = useState(undefined)

    const handleChange = () => {
        setChevron(prev => prev == "down" ? "up" : "down")
        const newList = sousListe()
        setItems([...newList])
    }

    const sousListe = () => {
        const itemsListe = sousRubriques.find(elm => elm.name == label)
        return itemsListe.items
    }
    return (
        <View style={{ marginVertical: 6 }}>
            <Pressable style={styles.btn_press} onPress={handleChange}>
                <Text style={styles.text_btn}>
                    {label}
                </Text>
                {
                    chevron == "up" ? <Entypo name="chevron-up" size={24} color="white" /> : <Entypo name="chevron-down" size={24} color="white" />
                }

            </Pressable>

            {
                chevron == 'down' ? (
                    items.map(elm => (
                        <Link href={`/(rubriques)/${elm.url}`} key={elm.url} asChild>
                            <TouchableOpacity  style={styles.items}>
                                <Text style={styles.textItem}> {elm.label} </Text>
                            </TouchableOpacity>
                        </Link>
                    ))
                ) : null
            }

        </View>

    )
}

const styles = StyleSheet.create({
    btn_press: {
        width: '100%',
        padding: 6,
        marginVertical: 3,
        backgroundColor: '#34495e',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    text_btn: {
        color: 'white',
        fontSize: 18
    },
    items: {
        backgroundColor: '#aab7bb',
        marginVertical: 4,
        padding: 5,
        marginLeft: 20,
        marginRight: 10
    },
    textItem: {
        fontSize: 18,
        fontWeight: '700'
    }
})