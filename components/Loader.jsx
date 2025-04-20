import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'

export default function Loader() {
  return (
    <View style={styles.main}>
      <ActivityIndicator size='large' color='2e86c1' />
    </View>
  )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})