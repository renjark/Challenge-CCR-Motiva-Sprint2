import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, statusLabels } from "../styles/theme";

/** Etiqueta de status preenchida, usada em cards e listas. */
export default function StatusPill({ status, label, color, compact = false }) {
  const bg = color || colors[status] || colors.gray;
  return (
    <View style={[styles.pill, compact && styles.compact, { backgroundColor: bg }]}>
      <Text style={styles.text}>{label || statusLabels[status] || status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  compact: { paddingHorizontal: 8, paddingVertical: 2 },
  text: { color: colors.white, fontSize: 11, fontWeight: "700" },
});
