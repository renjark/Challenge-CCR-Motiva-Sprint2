import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import { colors, radius } from "../styles/theme";
import { useApp } from "../context/AppContext";

const { width } = Dimensions.get("window");

// Legenda de status
const LEGENDA = [
  { status: "critico", label: "Crítico" },
  { status: "atencao", label: "Atenção" },
  { status: "ok", label: "OK" },
];

export default function MapaScreen() {
  const navigation = useNavigation();
  const { trechos, setTrechoSelecionado } = useApp();
  const [selecionado, setSelecionado] = useState(null);

  function handleTrecho(t) {
    setSelecionado(t);
    setTrechoSelecionado(t);
  }

  // Ordena por km_inicio para exibir na "rodovia"
  const trechosOrdenados = [...trechos].sort((a, b) => a.km_inicio - b.km_inicio);

  return (
    <View style={styles.root}>
      <Header subtitle="Visualização geral" title="Mapa da Rodovia" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Mapa visual simulado */}
        <View style={styles.mapaContainer}>
          <Text style={styles.rodoviaLabel}>SP-280 — Rodovia Castelo Branco</Text>

          {/* Linha da rodovia com trechos coloridos */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roadScroll}>
            <View style={styles.roadWrapper}>
              {/* Eixo com km */}
              <View style={styles.kmRow}>
                {trechosOrdenados.map((t) => (
                  <Text key={t.id} style={styles.kmLabel}>KM {t.km_inicio}</Text>
                ))}
              </View>

              {/* Estrada */}
              <View style={styles.road}>
                {trechosOrdenados.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => handleTrecho(t)}
                    style={[
                      styles.segment,
                      { backgroundColor: colors[t.status] },
                      selecionado?.id === t.id && styles.segmentSelected,
                    ]}
                  />
                ))}
              </View>

              {/* Pontos de destaque */}
              <View style={styles.dotRow}>
                {trechosOrdenados.map((t) => (
                  <View key={t.id} style={styles.dotWrap}>
                    {selecionado?.id === t.id && (
                      <View style={[styles.dot, { backgroundColor: colors[t.status] }]} />
                    )}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Legenda */}
          <View style={styles.legendaRow}>
            {LEGENDA.map((l) => (
              <View key={l.status} style={styles.legendaItem}>
                <View style={[styles.legendaDot, { backgroundColor: colors[l.status] }]} />
                <Text style={styles.legendaText}>{l.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Lista de trechos */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>TRECHOS DA RODOVIA</Text>
          {trechosOrdenados.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[
                styles.trechoCard,
                selecionado?.id === t.id && styles.trechoCardSelected,
              ]}
              onPress={() => handleTrecho(t)}
            >
              <View style={[styles.statusDot, { backgroundColor: colors[t.status] }]} />
              <View style={styles.trechoInfo}>
                <Text style={styles.trechoKm}>KM {t.km_inicio} — KM {t.km_fim}</Text>
                <Text style={styles.trechoSub}>
                  Última inspeção: {t.ultima_inspecao} · {t.inspector}
                </Text>
                {t.anomalia && (
                  <Text style={styles.trechoAnomalia} numberOfLines={1}>{t.anomalia}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.gray} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Card de trecho selecionado */}
      {selecionado && (
        <View style={styles.selectedCard}>
          <Text style={styles.selectedLabel}>TRECHO SELECIONADO</Text>
          <Text style={styles.selectedKm}>KM {selecionado.km_inicio} — KM {selecionado.km_fim}</Text>
          <Text style={styles.selectedInsp}>Última inspeção: {selecionado.ultima_inspecao}</Text>
          <TouchableOpacity
            style={styles.detalhesBtn}
            onPress={() => {
              setTrechoSelecionado(selecionado);
              navigation.navigate("DetalheTrecho");
            }}
          >
            <Text style={styles.detalhesBtnText}>Ver detalhes do trecho</Text>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  mapaContainer: {
    backgroundColor: "#2E7D32",
    padding: 20,
    paddingBottom: 16,
  },
  rodoviaLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 16,
  },
  roadScroll: { marginBottom: 8 },
  roadWrapper: { paddingHorizontal: 4 },
  kmRow: { flexDirection: "row", marginBottom: 4 },
  kmLabel: {
    width: 70,
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
  road: {
    flexDirection: "row",
    height: 24,
    borderRadius: 12,
    overflow: "hidden",
    gap: 2,
  },
  segment: {
    width: 68,
    height: "100%",
    borderRadius: 4,
  },
  segmentSelected: {
    borderWidth: 3,
    borderColor: "#fff",
  },
  dotRow: { flexDirection: "row", height: 16, marginTop: 4 },
  dotWrap: { width: 70, alignItems: "center", justifyContent: "center" },
  dot: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: "#fff" },
  legendaRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
  },
  legendaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendaDot: { width: 10, height: 10, borderRadius: 5 },
  legendaText: { color: "#fff", fontSize: 12 },
  listSection: { padding: 20 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSub,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  trechoCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  trechoCardSelected: {
    borderColor: colors.primary,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  trechoInfo: { flex: 1 },
  trechoKm: { fontSize: 14, fontWeight: "700", color: colors.text },
  trechoSub: { fontSize: 12, color: colors.textSub, marginTop: 2 },
  trechoAnomalia: { fontSize: 12, color: colors.critico, marginTop: 2, fontStyle: "italic" },
  selectedCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 20,
    paddingBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
  },
  selectedLabel: {
    fontSize: 11,
    color: colors.textSub,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  selectedKm: { fontSize: 22, fontWeight: "800", color: colors.text },
  selectedInsp: { fontSize: 13, color: colors.textSub, marginBottom: 16 },
  detalhesBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  detalhesBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
