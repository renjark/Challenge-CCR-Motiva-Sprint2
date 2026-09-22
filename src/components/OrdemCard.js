import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "./Card";
import StatusPill from "./StatusPill";
import { formatarData } from "./TrechoCard";
import { colors, ordemLabels, ordemColors } from "../styles/theme";

const prioridadeLabel = { alta: "Alta", media: "Média", baixa: "Baixa" };

/** Card de ordem de serviço usado na lista de Ordens. */
export default function OrdemCard({ ordem, trecho, equipe, onPress }) {
  return (
    <Card onPress={onPress}>
      <View style={styles.topo}>
        <Text style={styles.codigo}>{ordem.codigo}</Text>
        <StatusPill
          status={ordem.status}
          label={ordemLabels[ordem.status]}
          color={ordemColors[ordem.status]}
          compact
        />
      </View>

      <Text style={styles.trecho}>
        {trecho ? `KM ${trecho.km_inicio} – ${trecho.km_fim} · ${trecho.rodovia}` : "Trecho não encontrado"}
      </Text>

      <Text style={styles.descricao} numberOfLines={2}>
        {ordem.descricao}
      </Text>

      <View style={styles.rodape}>
        <View style={styles.metaItem}>
          <Ionicons name="people-outline" size={14} color={colors.textSub} />
          <Text style={styles.meta}>{equipe ? equipe.nome : "Sem equipe"}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="flag-outline" size={14} color={colors.textSub} />
          <Text style={styles.meta}>{prioridadeLabel[ordem.prioridade] || ordem.prioridade}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={14} color={colors.textSub} />
          <Text style={styles.meta}>
            {ordem.status === "concluida" && ordem.conclusao
              ? formatarData(ordem.conclusao)
              : formatarData(ordem.previsao)}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  topo: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  codigo: { fontSize: 15, fontWeight: "800", color: colors.text },
  trecho: { fontSize: 13, fontWeight: "600", color: colors.primary, marginTop: 6 },
  descricao: { fontSize: 13, color: colors.textSub, marginTop: 4, lineHeight: 18 },
  rodape: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  meta: { fontSize: 12, color: colors.textSub, fontWeight: "600" },
});
