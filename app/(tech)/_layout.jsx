import { Tabs } from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function LayoutTech(){

    return (
        <Tabs
            screenOptions={({route}) => ({
                headerShown: false,
            })}
        >
            <Tabs.Screen name="(rubriques)" options={{
                title: "collecte",
                tabBarIcon : () => {
                    return <Entypo name="grid" size={30} color="#1f618d" />
                },
                tabBarActiveBackgroundColor: "#d6eaf8",
                tabBarActiveTintColor: "#1f618d",
                tabBarShowLabel: false
            }}/>
            <Tabs.Screen name="(map)" options={{
                title: "collecte",
                tabBarIcon : () => {
                    return <FontAwesome name="map-marker" size={24} color="#1f618d" />
                },
                tabBarActiveBackgroundColor: "#d6eaf8",
                tabBarActiveTintColor: "#1f618d",
                tabBarShowLabel: false
            }}/>
        </Tabs>
    )
}