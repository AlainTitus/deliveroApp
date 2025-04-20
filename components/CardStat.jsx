import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function CardStat({texte, stat}) {
  return (
    <View style={styles.main}>
      <Text style={styles.text}> {texte} </Text>
      <Text style={styles.data}> {stat} </Text>
    </View>
  )
}

const styles = StyleSheet.create({
    main: {
        width: '45%',
        backgroundColor: '#2471a3',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
        height: 80,
        borderRadius: 5
    },
    text: {
        color: 'white',
        fontSize: 18
    },
    data:{
        fontSize: 25,
        color: 'white',
        
    }
})