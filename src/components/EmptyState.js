import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "./Button";
import { colors } from "../styles/theme";

/** Estado de lista vazia. A mensagem convida à próxima ação. */
export default function EmptyState({
  icon = "leaf-outline",
  titulo = "Nada por aqui",
  descricao,
  acao,
  onAcao,
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={30} color={colors.primary} />
      </View>
      <Text style={styles.titulo}>{titulo}</Text>
      {descricao ? <Text style={styles.descricao}>{descricao}</Text> : null}
      {acao && onAcao ? (
        <Button title={acao} onPress={onAcao} variant="outline" style={styles.btn} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", paddingVertical: 56, paddingHorizontal: 32 },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  titulo: { fontSize: 16, fontWeight: "700", color: colors.text, textAlign: "center" },
  descricao: {
    fontSize: 13,
    color: colors.textSub,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 19,
  },
  btn: { marginTop: 20, alignSelf: "stretch" },
});
