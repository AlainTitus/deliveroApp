import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name='map'  options={{
        title: "Supports collectés",
        headerStyle: {
          backgroundColor: '#1f618d',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />
      <Stack.Screen name='detailSupport' options={{
        title: "Details",
        headerStyle: {
          backgroundColor: '#1f618d',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />
    </Stack>
  )
}