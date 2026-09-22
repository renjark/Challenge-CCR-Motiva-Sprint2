import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "./Button";
import { colors } from "../styles/theme";

/** Estado de erro. Diz o que houve e oferece o caminho de saída. */
export default function ErrorState({
  titulo = "Não foi possível carregar",
  mensagem = "Verifique sua conexão e tente novamente.",
  onTentarNovamente,
  carregando = false,
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Ionicons name="cloud-offline-outline" size={30} color={colors.critico} />
      </View>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.mensagem}>{mensagem}</Text>
      {onTentarNovamente && (
        <Button
          title="Tentar novamente"
          icon="refresh"
          onPress={onTentarNovamente}
          loading={carregando}
          style={styles.btn}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.criticoSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  titulo: { fontSize: 17, fontWeight: "700", color: colors.text, textAlign: "center" },
  mensagem: {
    fontSize: 13,
    color: colors.textSub,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 19,
  },
  btn: { marginTop: 24, alignSelf: "stretch" },
});
