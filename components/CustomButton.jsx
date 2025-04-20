import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'

export default function CustomButton({titre, onPress, color}) {
    return (
        <Pressable style={[styles.btn_press, {backgroundColor: color}]} onPress={onPress} >
            <Text style={styles.text}> {titre} </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    btn_press: {
        padding: 6,
        width: '80%',
        marginHorizontal: 'auto',
        marginVertical: 10
    },
    text: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18
    }
})