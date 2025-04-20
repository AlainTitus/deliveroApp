import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function Indicateurs({ label, target, done }) {
    const result = () => {
        if (target > done) {
            return '#e74c3c'
        } else {
            return '#2ecc71'
        }
    }
    return (
        <View style={styles.kpi}>
            <View style={styles.value}>
                <Text style={[ { textAlign: 'left' }]}> {label} </Text>
            </View>
            <View style={styles.value}>
                <Text style={[ { textAlign: 'right' }]}> {target} </Text>
            </View>
            <View style={styles.value}>
                <Text style={[ { textAlign: 'right', color: result() }]}> {done} </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    kpi: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(93, 173, 226, 0.5)',
        paddingBottom: 2,
        marginVertical: 2,
        justifyContent: 'space-between'
    },
    value: {
        fontSize: 16,
        fontWeight: 'semibold',
        flexGrow: 1 / 3,
        paddingRight: 8,
    }
})