import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function Formulaire() {
  return (
    <View style={styles.container}>
      <Text>Formulaire des rubriques</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})