import { Stack, useRouter, useSegments, Slot } from "expo-router";
import { AuthProvider, useAuth } from "../provider/AuthProvider";
import { useEffect } from "react";

const InitialLayout = () => {
    const {session, initialized} = useAuth();
    const segments = useSegments();
    console.log('segment => ', segments)

    const router = useRouter();
    // console.log('router => ', router);

    useEffect(() => {
        if(!initialized) return;
        const inAuthGroup = segments[0] === 'details';

        if(session && !inAuthGroup) {
            router.replace('/details');
        } else if(!session && inAuthGroup){
            router.replace('/')
        }
    }, [session, initialized])



    return (<Slot />)
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
            </Stack> */}
            <InitialLayout />
        </AuthProvider>

    )
}