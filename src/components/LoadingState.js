import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../styles/theme";

/** Estado de carregamento de tela inteira. */
export default function LoadingState({ mensagem = "Carregando dados…" }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, padding: 32 },
  text: { fontSize: 14, color: colors.textSub },
});
