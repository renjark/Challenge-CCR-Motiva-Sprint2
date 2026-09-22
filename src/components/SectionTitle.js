import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, type } from "../styles/theme";

/** Título de seção com ação opcional à direita. */
export default function SectionTitle({ children, action, onAction, style }) {
  return (
    <View style={[styles.row, style]}>
      <Text style={styles.title}>{children}</Text>
      {action && (
        <TouchableOpacity onPress={onAction} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.action}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 12,
  },
  title: { ...type.section },
  action: { fontSize: 12, fontWeight: "700", color: colors.primary },
});
