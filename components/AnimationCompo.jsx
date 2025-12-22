import { View, Text } from 'react-native'
import React from 'react'
import * as Animatable from 'react-native-animatable'

export default function AnimationCompo() {
  return (
    <View style={{backgroundColor: '#ffffff', paddingBottom: 20 }}>
      <Animatable.Image
        animation="slideInUp"
        iterationCount={1}
        source={require('../assets/images/loading_blue.gif')}
        style={{ width: "100%", height: 100 }}
        />

        <Animatable.Text
        animation="fadeInUpBig"
        iterationCount={1}
        style={{ textAlign: 'center', color: '#3498db', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>
            Chargement des captures ...
        </Animatable.Text>
    </View>
  )
}