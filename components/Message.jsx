import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function Message() {
  return (
    <View style={styles.main}>
      <Text style={styles.text}>
        Selectionner un départ
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: 'red',
    fontSize: 20
  }
})