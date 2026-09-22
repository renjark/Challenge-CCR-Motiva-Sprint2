import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors, radius } from "../styles/theme";
import { useApp } from "../context/AppContext";

/**
 * Cabeçalho roxo padrão do app.
 * Usado em TODAS as telas autenticadas para garantir consistência visual.
 */
export default function Header({
  title,
  subtitle,
  showBack = false,
  showBell = true,
  right = null,
}) {
  const navigation = useNavigation();
  const { notifNaoLidas } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityLabel="Voltar"
          >
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </TouchableOpacity>
        )}
        <View style={styles.titles}>
          {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>
      </View>

      {right}

      {showBell && (
        <TouchableOpacity
          style={styles.bellWrap}
          onPress={() => navigation.navigate("Notificacoes")}
          accessibilityLabel={`Notificações, ${notifNaoLidas} não lidas`}
        >
          <Ionicons name="notifications-outline" size={22} color={colors.white} />
          {notifNaoLidas > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {notifNaoLidas > 9 ? "9+" : notifNaoLidas}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
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
    gap: 12,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  titles: { flex: 1 },
  subtitle: { color: "rgba(255,255,255,0.75)", fontSize: 13, marginBottom: 2 },
  title: { color: colors.white, fontSize: 22, fontWeight: "700" },
  backBtn: { marginRight: 2 },
  bellWrap: {
    position: "relative",
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: radius.lg,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: colors.critico,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  badgeText: { color: colors.white, fontSize: 9, fontWeight: "700" },
});
