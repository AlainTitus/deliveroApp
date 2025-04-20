import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'


export default function BtnPicker({icon, color, onPress}) {
    return (
        <TouchableOpacity style={[styles.main, {backgroundColor: color}]} onPress={onPress}>
            {icon}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    main: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 100
    },
})