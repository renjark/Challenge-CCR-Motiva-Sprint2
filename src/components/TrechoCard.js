import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "./Card";
import StatusBadge from "./StatusBadge";
import StatusPill from "./StatusPill";
import UrgencyBar from "./UrgencyBar";
import { colors } from "../styles/theme";

/** Card de trecho reutilizado em Mapa, Ranking e busca. */
export default function TrechoCard({
  trecho,
  onPress,
  selecionado = false,
  posicao,
  mostrarUrgencia = false,
}) {
  return (
    <Card onPress={onPress} selected={selecionado}>
      <View style={styles.linha}>
        {posicao ? (
          <Text style={[styles.posicao, { color: colors[trecho.status] }]}>
            {String(posicao).padStart(2, "0")}
          </Text>
        ) : (
          <StatusBadge status={trecho.status} size={12} style={{ marginTop: 5 }} />
        )}

        <View style={styles.info}>
          <View style={styles.tituloLinha}>
            <Text style={styles.km}>
              KM {trecho.km_inicio} – {trecho.km_fim}
            </Text>
            <StatusPill status={trecho.status} compact />
          </View>

          <Text style={styles.sub}>
            {trecho.rodovia}
            {trecho.ultima_inspecao
              ? ` · inspeção em ${formatarData(trecho.ultima_inspecao)}`
              : " · sem inspeção registrada"}
          </Text>

          {mostrarUrgencia && (
            <View style={styles.barraLinha}>
              <UrgencyBar value={trecho.urgencia} status={trecho.status} />
              <Text style={styles.urgenciaTexto}>{trecho.urgencia}%</Text>
            </View>
          )}

          {trecho.anomalia ? (
            <Text style={styles.anomalia} numberOfLines={2}>
              {trecho.anomalia}
            </Text>
          ) : null}
        </View>

        <Ionicons name="chevron-forward" size={16} color={colors.gray} />
      </View>
    </Card>
  );
}

export function formatarData(iso) {
  if (!iso) return "—";
  const [a, m, d] = String(iso).split("-");
  if (!a || !m || !d) return iso;
  return `${d}/${m}/${a}`;
}

const styles = StyleSheet.create({
  linha: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  posicao: { fontSize: 20, fontWeight: "800", width: 30 },
  info: { flex: 1, gap: 4 },
  tituloLinha: { flexDirection: "row", alignItems: "center", gap: 8 },
  km: { fontSize: 15, fontWeight: "700", color: colors.text, flexShrink: 1 },
  sub: { fontSize: 12, color: colors.textSub },
  barraLinha: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 2 },
  urgenciaTexto: { fontSize: 12, fontWeight: "700", color: colors.textSub, width: 36, textAlign: "right" },
  anomalia: { fontSize: 12, color: colors.textSub, fontStyle: "italic", marginTop: 2 },
});
