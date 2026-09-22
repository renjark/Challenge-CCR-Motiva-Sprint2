import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { AppProvider, useApp } from "./src/context/AppContext";
import Toast from "./src/components/Toast";
import { colors } from "./src/styles/theme";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import MapaScreen from "./src/screens/MapaScreen";
import RankingScreen from "./src/screens/RankingScreen";
import OrdensScreen from "./src/screens/OrdensScreen";
import PerfilScreen from "./src/screens/PerfilScreen";
import NotificacoesScreen from "./src/screens/NotificacoesScreen";
import DetalheTrechoScreen from "./src/screens/DetalheTrechoScreen";
import DetalheOrdemScreen from "./src/screens/DetalheOrdemScreen";
import NovaInspecaoScreen from "./src/screens/NovaInspecaoScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ICONES = {
  Inicio: ["home", "home-outline"],
  Mapa: ["map", "map-outline"],
  Ranking: ["stats-chart", "stats-chart-outline"],
  Ordens: ["clipboard", "clipboard-outline"],
  Perfil: ["person-circle", "person-circle-outline"],
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.grayLight,
          backgroundColor: colors.white,
          paddingBottom: 8,
          paddingTop: 6,
          height: 64,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarIcon: ({ color, size, focused }) => {
          const [ativo, inativo] = ICONES[route.name] || ["ellipse", "ellipse-outline"];
          return <Ionicons name={focused ? ativo : inativo} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} options={{ title: "Início" }} />
      <Tab.Screen name="Mapa" component={MapaScreen} options={{ title: "Mapa" }} />
      <Tab.Screen name="Ranking" component={RankingScreen} options={{ title: "Ranking" }} />
      <Tab.Screen name="Ordens" component={OrdensScreen} options={{ title: "Ordens" }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ title: "Perfil" }} />
    </Tab.Navigator>
  );
}

function Rotas() {
  const { usuario, bootPronto } = useApp();

  if (!bootPronto) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!usuario ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="Notificacoes" component={NotificacoesScreen} />
          <Stack.Screen name="DetalheTrecho" component={DetalheTrechoScreen} />
          <Stack.Screen name="DetalheOrdem" component={DetalheOrdemScreen} />
          <Stack.Screen name="NovaInspecao" component={NovaInspecaoScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Rotas />
        <Toast />
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
