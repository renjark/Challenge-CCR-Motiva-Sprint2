import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { AppProvider } from "./src/context/AppContext";
import { colors } from "./src/styles/theme";

import HomeScreen from "./src/screens/HomeScreen";
import MapaScreen from "./src/screens/MapaScreen";
import RankingScreen from "./src/screens/RankingScreen";
import NotificacoesScreen from "./src/screens/NotificacoesScreen";
import DetalheTrechoScreen from "./src/screens/DetalheTrechoScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#9E9E9E",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
          backgroundColor: "#fff",
          paddingBottom: 8,
          paddingTop: 6,
          height: 64,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarIcon: ({ color, size, focused }) => {
          const icons = {
            Inicio: focused ? "home" : "home-outline",
            Mapa: focused ? "map" : "map-outline",
            Ranking: focused ? "stats-chart" : "stats-chart-outline",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} options={{ title: "Início" }} />
      <Tab.Screen name="Mapa" component={MapaScreen} options={{ title: "Mapa" }} />
      <Tab.Screen name="Ranking" component={RankingScreen} options={{ title: "Ranking" }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="Notificacoes" component={NotificacoesScreen} />
          <Stack.Screen name="DetalheTrecho" component={DetalheTrechoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
