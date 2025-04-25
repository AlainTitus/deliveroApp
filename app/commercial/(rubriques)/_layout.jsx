import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function RubriqueLayout() {
  return (
    <Stack screenOptions={{
        headerShown: false
    }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='rubriques' />
      <Stack.Screen name='normalisation' />
      <Stack.Screen name='peracenorm' />
      <Stack.Screen name='opexnorm' />
      <Stack.Screen name='illegaux' />
      <Stack.Screen name='peraceIllegaux' />
      <Stack.Screen name='opexIllegaux' />
      <Stack.Screen name='branchements' />
      <Stack.Screen name='peracebranch' />
      <Stack.Screen name='opexBranch' />
    </Stack>
  )
}