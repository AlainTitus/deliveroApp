import { Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function _layout() {
  const navigation = useNavigation()
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name='index' options={{
        title: "Transfos collectés",
        headerStyle: {
          backgroundColor: '#1f618d',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ backgroundColor: '#117864', width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginRight: 20 }}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
        ),
      }} />

    </Stack>
  )
}