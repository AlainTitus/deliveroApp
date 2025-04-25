import { Stack } from 'expo-router'

export default function LayoutRubrique() {

    return (
        <Stack
        screenOptions={{
            headerShown: true
        }}
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
        </Stack>
    )
}