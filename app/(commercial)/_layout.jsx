import { Tabs } from "expo-router";

export default function LayoutCommercial(){

    return (
        <Tabs
            screenOptions={{
                headerShown: false
            }}
        >
            <Tabs.Screen name="(rubriques)" />
            <Tabs.Screen name="(map)" />
        </Tabs>
    )
}