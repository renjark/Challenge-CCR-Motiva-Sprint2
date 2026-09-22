import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { colors, radius, shadow } from "../styles/theme";

/** Contêiner branco padrão. Vira tocável quando recebe onPress. */
export default function Card({ children, onPress, style, selected = false }) {
  const conteudo = (
    <View style={[styles.card, selected && styles.selected, style]}>{children}</View>
  );
  if (!onPress) return conteudo;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      {conteudo}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
    ...shadow.card,
  },
  selected: { borderColor: colors.primary },
});
