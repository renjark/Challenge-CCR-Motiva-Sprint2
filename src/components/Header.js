import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../styles/theme";
import { useApp } from "../context/AppContext";

export default function Header({ title, subtitle, showBack = false }) {
  const navigation = useNavigation();
  const { notifNaoLidas } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            <Text style={styles.title}>{title}</Text>
          </View>
        )}
        {showBack && (
          <View>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            <Text style={styles.title}>{title}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.bellWrap}
        onPress={() => navigation.navigate("Notificacoes")}
      >
        <Ionicons name="notifications-outline" size={22} color="#fff" />
        {notifNaoLidas > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notifNaoLidas}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  subtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    marginBottom: 2,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    flexShrink: 1,
  },
  backBtn: {
    marginRight: 6,
  },
  bellWrap: {
    position: "relative",
    padding: 6,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 22,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: colors.critico,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});
