import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function LineTable({hauteur, structure, qte}) {
    return (
        <View style={styles.tableLine}>
            <View style={styles.lineTable}>
                <Text style={styles.lineText}>
                    {hauteur}
                </Text>
            </View>
            <View style={styles.lineTable}>
                <Text style={styles.lineText}>
                    {structure}
                </Text>
            </View>
            <View style={styles.lineTable}>
                <Text style={styles.lineText}>
                    {qte}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    lineTable: {
        borderBottomWidth: 1,
        borderStyle: "dotted",
        borderBottomColor: "white",
        width: "32%",
        padding: 5
    },
    tableLine: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center'
    },
    lineText: {
        color: "white"
    }
})