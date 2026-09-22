import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "../styles/theme";

/**
 * Botão único do app — variantes: primary | outline | ghost | danger.
 * Centralizar aqui garante que todos os CTAs tenham o mesmo comportamento
 * de estado (normal, carregando, desabilitado).
 */
export default function Button({
  title,
  onPress,
  variant = "primary",
  icon,
  iconRight,
  loading = false,
  disabled = false,
  style,
}) {
  const inativo = disabled || loading;
  const v = variantes[variant] || variantes.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={inativo}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityState={{ disabled: inativo, busy: loading }}
      style={[
        styles.base,
        { backgroundColor: v.bg, borderColor: v.border, borderWidth: v.border ? 1.5 : 0 },
        inativo && styles.inativo,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.fg} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={18} color={v.fg} />}
          <Text style={[styles.text, { color: v.fg }]}>{title}</Text>
          {iconRight && <Ionicons name={iconRight} size={18} color={v.fg} />}
        </>
      )}
    </TouchableOpacity>
  );
}

const variantes = {
  primary: { bg: colors.primary, fg: colors.white, border: null },
  danger: { bg: colors.critico, fg: colors.white, border: null },
  outline: { bg: colors.white, fg: colors.primary, border: colors.primary },
  ghost: { bg: "transparent", fg: colors.textSub, border: colors.grayBorder },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    paddingVertical: 15,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 52,
  },
  text: { fontSize: 15, fontWeight: "700" },
  inativo: { opacity: 0.5 },
});
