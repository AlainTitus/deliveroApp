import { Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from 'expo-router';

export default function _layout() {
  const navigation = useNavigation()
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name='map' options={{
        title: "Supports collectés",
        headerStyle: {
          backgroundColor: '#1f618d',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        // headerLeft: () => (
        //   <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={{ backgroundColor: '#117864', width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginRight: 20 }}>
        //     <Ionicons name="menu" size={24} color="white" />
        //   </TouchableOpacity>
        // ),
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
      <Stack.Screen name='mapSearch' options={{
        title: "support trouvé",
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