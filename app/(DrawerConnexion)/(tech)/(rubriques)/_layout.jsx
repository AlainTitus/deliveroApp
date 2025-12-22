import { Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

export default function LayoutRubrique() {

    const navigation = useNavigation()

    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
            initialRouteName='supports'
        >

            <Stack.Screen name='supports' options={{
                title: "Collecte des supports MT",
                headerStyle: {
                    backgroundColor: '#1a5276',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                // headerLeft: () => (
                //     <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={{ backgroundColor: '#117864', width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginRight: 20 }}>
                //         <Ionicons name="menu" size={24} color="white" />
                //     </TouchableOpacity>
                // ),
            }} />
            <Stack.Screen name='mapcollecte' options={{
                title: "GIS support MT",
                headerStyle: {
                    backgroundColor: '#1a5276',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }} />
            <Stack.Screen name='updatesupport' options={{
                title: "Solution support béton",
                headerStyle: {
                    backgroundColor: '#1a5276',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }} />
            <Stack.Screen name='statdepart' options={{
                title: "Dashboard",
                headerStyle: {
                    backgroundColor: '#1a5276',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }} />
            <Stack.Screen name='detailSupports' options={{
                title: "Details supports",
                headerStyle: {
                    backgroundColor: '#1a5276',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }} />
            <Stack.Screen name='newSupport' options={{
                title: "Ajouter un support",
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