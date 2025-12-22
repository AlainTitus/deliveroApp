import 'react-native-gesture-handler'
import { Tabs } from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function LayoutTech(){

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName='(rubriques)'
        >
            <Tabs.Screen name="(rubriques)" options={{
                tabBarIcon : ({size, color}) => {
                    return <Entypo name="grid" size={size} color={color} />
                },
                tabBarActiveBackgroundColor: "#d6eaf8",
                // tabBarActiveTintColor: "#1f618d",
                tabBarShowLabel: false
            }} />
            <Tabs.Screen name="(map)" options={{
                tabBarIcon : ({size, color}) => {
                    return <FontAwesome name="map-marker" size={size} color={color} />
                },
                tabBarActiveBackgroundColor: "#d6eaf8",
                // tabBarActiveTintColor: "#1f618d",
                tabBarShowLabel: false
            }}/>
        </Tabs>
    )
}