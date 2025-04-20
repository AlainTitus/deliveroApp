import { Stack } from 'expo-router'

export default function LayoutRubrique() {

    return (
        <Stack
        // screenOptions={{
        //     headerShown: false
        // }}
        >
            <Stack.Screen name='index' />
            <Stack.Screen name='formulaire' />
            <Stack.Screen name='Crame' />
            <Stack.Screen name='mesures' />
            <Stack.Screen name='protections' />
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