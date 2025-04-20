import { View, Text, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'

export default function CustomInput({ label, placeholder, type, number, multiline, h, labelColor, handleInput, val }) {
    const [text, setText] = useState(val)

    const handleChange = (val)=>{
        setText(val)
        handleInput(val)
    }
    return (
        <View style={styles.viewInput}>
            <Text style={[styles.text, {color: labelColor ? labelColor : 'black'}]}> {label} </Text>
            <TextInput
                style={[styles.input, {height: h}]}
                placeholder={placeholder}
                placeholderTextColor='gray'
                keyboardType={type}
                numberOfLines={number}
                multiline={multiline}
                onChangeText={val => handleChange(val)}
                value={text}
            />
        </View>
    )
}

const styles = StyleSheet.create({

    input: {
        height: 55,
        padding: 10,
        borderWidth: 1,
        marginVertical: 6,
        fontSize: 18,
        textAlignVertical: 'top',
        backgroundColor: 'white'
    },
    text: {
        fontSize: 18,
        fontWeight: '600'
    }
})