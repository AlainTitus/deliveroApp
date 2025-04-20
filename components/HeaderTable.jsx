import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function HeaderTable({first, second, third}) {
    return (
        <View style={styles.tableView}>
            <View style={styles.columTable}>
                <Text style={styles.headerText}>
                    {first}
                </Text>
            </View>
            <View style={styles.columTable}>
                <Text style={styles.headerText}>
                    {second}
                </Text>
            </View>
            <View style={styles.columTable}>
                <Text style={styles.headerText}>
                    {third}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    columTable: {
        width: "32%",
        backgroundColor: "#ca13f2",
        padding: 5
    },
    tableView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    headerText: {
        color: "white"
    },
})