import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "../styles/theme";

/**
 * Linha de filtros horizontais.
 * opcoes: [{ valor, label, cor? }]
 */
export default function FilterChips({ opcoes = [], valor, onChange, style }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.row, style]}
    >
      {opcoes.map((o) => {
        const ativo = o.valor === valor;
        const cor = o.cor || colors.primary;
        return (
          <TouchableOpacity
            key={o.valor}
            onPress={() => onChange(o.valor)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={{ selected: ativo }}
            style={[
              styles.chip,
              ativo && { backgroundColor: cor, borderColor: cor },
            ]}
          >
            <Text style={[styles.texto, ativo && styles.textoAtivo]}>
              {o.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingVertical: 2, paddingRight: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.grayBorder,
    backgroundColor: colors.white,
  },
  texto: { fontSize: 13, fontWeight: "600", color: colors.textSub },
  textoAtivo: { color: colors.white },
});
