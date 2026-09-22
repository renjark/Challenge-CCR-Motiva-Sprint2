import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, shadow } from "../styles/theme";
import { useApp } from "../context/AppContext";

const estilos = {
  ok: { bg: colors.ok, icon: "checkmark-circle" },
  erro: { bg: colors.critico, icon: "alert-circle" },
  atencao: { bg: colors.atencao, icon: "information-circle" },
};

/** Feedback não bloqueante, montado uma única vez no App. */
export default function Toast() {
  const { toast, fecharToast } = useApp();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: toast ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [toast, anim]);

  if (!toast) return null;
  const v = estilos[toast.tipo] || estilos.ok;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        {
          opacity: anim,
          transform: [
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={fecharToast}
        style={[styles.toast, { backgroundColor: v.bg }]}
      >
        <Ionicons name={v.icon} size={18} color={colors.white} />
        <Text style={styles.texto}>{toast.mensagem}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 16, right: 16, bottom: 92, zIndex: 999 },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    ...shadow.sheet,
  },
  texto: { color: colors.white, fontSize: 14, fontWeight: "600", flex: 1 },
});
