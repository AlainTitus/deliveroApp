import 'react-native-gesture-handler'
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Foundation from '@expo/vector-icons/Foundation';

export default function _layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, }}>
      <Drawer
        initialRouteName="details"
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1f618d',
          },
          headerTitleStyle: {
            color: 'white',
          },
          drawerItemStyle: {
            marginVertical: 3
          },
          headerTintColor: "white"
        }}
      >
        <Drawer.Screen name="details" options={{
          title: 'Hi Eneo',
          headerShown: true,
          drawerIcon: ({ focused }) => {
            if (focused) {
              return <Entypo name="home" size={24} color="#e5e7e9" />
            } else {
              return <Entypo name="home" size={24} color="#34495e" />
            }
          },
          drawerLabelStyle: { fontSize: 15, fontWeight: 'bold' },
          drawerActiveBackgroundColor: '#1f618d',
          drawerActiveTintColor: '#e5e7e9',
          drawerInactiveTintColor: '#34495e',
          headerShadowVisible: true
        }} />

        <Drawer.Screen name="(tech)" options={{
          title: 'PARSEC collect',
          drawerIcon: ({ focused }) => {
            if (focused) {
              return <MaterialCommunityIcons name="sign-pole" size={24} color="#e5e7e9" />
            } else {
              return <MaterialCommunityIcons name="sign-pole" size={24} color="#34495e" />
            }
          },
          drawerLabelStyle: { fontSize: 18, fontWeight: 'bold' },
          drawerActiveBackgroundColor: '#1f618d',
          drawerActiveTintColor: '#e5e7e9',
          drawerInactiveTintColor: '#34495e',
        }} />

        <Drawer.Screen name="(transfos)" options={{
          title: 'Gestion des transfos',
          drawerIcon: ({ focused }) => {
            if (focused) {
              return <MaterialIcons name="transform" size={24} color="#e5e7e9" />
            } else {
              return <MaterialIcons name="transform" size={24} color="#34495e" />
            }
          },
          drawerLabelStyle: { fontSize: 18, fontWeight: 'bold' },
          drawerActiveBackgroundColor: '#1f618d',
          drawerActiveTintColor: '#e5e7e9',
          drawerInactiveTintColor: '#34495e',
        }} />

        <Drawer.Screen name="(ocr)" options={{
          title: 'Gestion des OCR',
          drawerIcon: ({ focused }) => {
            if (focused) {
              return <MaterialCommunityIcons name="electric-switch" size={24} color="#e5e7e9" />
            } else {
              return <MaterialCommunityIcons name="electric-switch" size={24} color="#34495e" />
            }
          },
          drawerLabelStyle: { fontSize: 18, fontWeight: 'bold' },
          drawerActiveBackgroundColor: '#1f618d',
          drawerActiveTintColor: '#e5e7e9',
          drawerInactiveTintColor: '#34495e',
          headerStyle: {
            backgroundColor: '#873600',
          },
        }} />

        <Drawer.Screen name="(vegetation)" options={{
          title: 'Entretien des emprises',
          drawerIcon: ({ focused }) => {
            if (focused) {
              return <Foundation name="trees" size={24} color="#e5e7e9" />
            } else {
              return <Foundation name="trees" size={24} color="#34495e" />
            }
          },
          drawerLabelStyle: { fontSize: 18, fontWeight: 'bold' },
          drawerActiveBackgroundColor: '#1f618d',
          drawerActiveTintColor: '#e5e7e9',
          drawerInactiveTintColor: '#34495e',
          headerStyle: {
            backgroundColor: '#1e8449',
          },
        }} />
      </Drawer>
    </GestureHandlerRootView>
  )
}