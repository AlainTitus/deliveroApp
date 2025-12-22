import { View, Text, StyleSheet } from 'react-native'
import * as Progress from 'react-native-progress'
import React from 'react'

export default function LoadComponent() {
  return (
    <View style={styles.container}>
      <Text style={{ textAlign: 'center', color: 'white' }}>Chargement des captures ...</Text>
      <View style={{ justifyContent: 'center',alignItems: 'center', marginTop: 20 }}>
        <Progress.Bar
          indeterminate={true}
          indeterminateAnimationDuration={2000}
          width={200}
          height={10}
          borderWidth={0}
          color="#3498db"
          unfilledColor="#ecf0f1"
          // style={{ marginTop: 10 }}
          borderRadius={5}
          animationType="spring"
        />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: '#1a5276',
    padding: 10,
  },
})