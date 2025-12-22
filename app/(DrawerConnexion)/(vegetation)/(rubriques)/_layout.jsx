import { Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function LayoutRubrique() {

    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
            initialRouteName='index'
        >

            <Stack.Screen name='index' options={{
                headerStyle: {
                    backgroundColor: '#1a5276',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }} />
            <Stack.Screen name='formCollecte' options={{
                headerStyle: {
                    backgroundColor: '#1a5276',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }} />

        </Stack>
    )
}