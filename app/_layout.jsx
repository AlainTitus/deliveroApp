import 'react-native-gesture-handler'
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack, useRouter, useSegments, Slot } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { AuthProvider, useAuth } from "../provider/AuthProvider";
import { useEffect } from "react";

const InitialLayout = () => {
    const { session, initialized } = useAuth();
    const segments = useSegments();

    const router = useRouter();

    useEffect(() => {
        if (!initialized) return;
        const inAuthGroup = segments[0] === 'details';

        if (session && !inAuthGroup) {
            router.replace('/(DrawerConnexion)/details');
        } else if (!session && inAuthGroup) {
            router.replace('/')
        }
    }, [session, initialized])



    return (
        // <GestureHandlerRootView style={{ flex: 1 }}>
        //     <Drawer
        //         screenOptions={{
        //             headerShown: true,
        //             drawerType: 'front',
        //             drawerStyle: {
        //                 width: '100%',
        //                 backgroundColor: '#fff',
        //                 borderTopRightRadius: 20,
        //                 borderBottomRightRadius: 20,
        //                 shadowColor: '#000',
        //                 shadowOffset: {
        //                     width: 0,
        //                     height: 2,
        //                 },
        //                 shadowOpacity: 0.25,
        //                 shadowRadius: 3.5,
        //                 elevation: 5,
        //             },
        //         }}
        //     >
        //         <Drawer.Screen name="index" options={{ title: 'Home' }} />
        //         <Drawer.Screen name="details" options={{ title: 'Details' }} />
        //         <Drawer.Screen name="(tech)" options={{ title: 'Tech' }} />
        //         <Drawer.Screen name="(commercial)" options={{ title: 'Commercial' }} />
        //     </Drawer>
        // </GestureHandlerRootView>
        <Stack
        screenOptions={{
            headerShown: false
        }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="(DrawerConnexion)/details"/>
            <Stack.Screen name="+not-found" />
        </Stack>
    )
}

export default function RootLayout() {

    return (

        <AuthProvider>
            {/* <Stack>
                <Stack.Screen name="index" />
                <Stack.Screen name="details" options={{
                    headerShown: false
                }} />
                <Stack.Screen name="(tech)" options={{
                    headerShown: false
                }} />
                <Stack.Screen name="(commercial)" options={{
                    headerShown: false
                }} />
            </Stack>  */}
            <InitialLayout />
        </AuthProvider>



    )
}