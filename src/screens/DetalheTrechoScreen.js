import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import { colors, radius } from "../styles/theme";
import { useApp } from "../context/AppContext";

const statusLabel = { critico: "Crítico", atencao: "Atenção", ok: "OK" };
const tipoIcon = { inspecao: "search-outline", manutencao: "construct-outline" };

export default function DetalheTrechoScreen() {
  const { trechoSelecionado, acionarManutencao } = useApp();
  const [loading, setLoading] = useState(false);

  const t = trechoSelecionado;
  if (!t) return null;

  function handleAcionar() {
    Alert.alert(
      "Acionar equipe",
      `Confirmar acionamento para KM ${t.km_inicio}–${t.km_fim}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => {
            setLoading(true);
            setTimeout(() => {
              acionarManutencao(t.id);
              setLoading(false);
              Alert.alert("✅ Equipe acionada!", "Solicitação registrada com sucesso.");
            }, 1200);
          },
        },
      ]
    );
  }

  return (
    <View style={styles.root}>
      <Header
        subtitle={`KM ${t.km_inicio} – KM ${t.km_fim}`}
        title={`${t.rodovia} · ${statusLabel[t.status] || t.status}`}
        showBack
      />

      {loading && (
        <Modal transparent>
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Enviando…</Text>
          </View>
        </Modal>
      )}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Status atual */}
        <View style={[styles.statusBanner, { borderLeftColor: colors[t.status] }]}>
          <StatusBadge status={t.status} size={16} />
          <View>
            <Text style={styles.statusBannerTitle}>
              Status atual: {statusLabel[t.status]}
            </Text>
            <Text style={styles.statusBannerSub}>
              Urgência: {t.urgencia}%
            </Text>
          </View>
        </View>

        {/* Anomalia */}
        {t.anomalia && (
          <View style={styles.anomaliaCard}>
            <Ionicons name="warning-outline" size={18} color={colors.atencao} />
            <Text style={styles.anomaliaText}>{t.anomalia}</Text>
          </View>
        )}

        {/* Dados gerais */}
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoKey}>Última inspeção</Text>
            <Text style={styles.infoVal}>{t.ultima_inspecao}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoKey}>Inspetor</Text>
            <Text style={styles.infoVal}>{t.inspector}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoKey}>Rodovia</Text>
            <Text style={styles.infoVal}>{t.rodovia}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoKey}>Extensão</Text>
            <Text style={styles.infoVal}>{t.km_fim - t.km_inicio} km</Text>
          </View>
        </View>

        {/* Histórico */}
        <Text style={styles.sectionTitle}>HISTÓRICO DE INSPEÇÕES E MANUTENÇÕES</Text>
        {t.historico.map((h, i) => (
          <View key={i} style={styles.histItem}>
            <View style={styles.histLeft}>
              <View style={[styles.histDot, { backgroundColor: colors[h.status] }]} />
              {i < t.historico.length - 1 && <View style={styles.histLine} />}
            </View>
            <View style={styles.histContent}>
              <View style={styles.histHeader}>
                <Ionicons
                  name={tipoIcon[h.tipo] || "ellipse-outline"}
                  size={14}
                  color={colors.textSub}
                />
                <Text style={styles.histTipo}>
                  {h.tipo === "inspecao" ? "Inspeção" : "Manutenção"}
                </Text>
                <Text style={styles.histData}>{h.data}</Text>
              </View>
              <Text style={styles.histObs}>{h.obs}</Text>
            </View>
          </View>
        ))}

        {/* Botão de acionamento */}
        <TouchableOpacity style={styles.acionarBtn} onPress={handleAcionar}>
          <Ionicons name="construct-outline" size={20} color="#fff" />
          <Text style={styles.acionarText}>Acionar equipe de manutenção</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20 },
  statusBanner: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderLeftWidth: 5,
    marginBottom: 12,
  },
  statusBannerTitle: { fontSize: 15, fontWeight: "700", color: colors.text },
  statusBannerSub: { fontSize: 13, color: colors.textSub },
  anomaliaCard: {
    backgroundColor: "#FFF3E0",
    borderRadius: radius.md,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  anomaliaText: { fontSize: 13, color: "#E65100", flex: 1 },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  infoItem: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 14,
    width: "47%",
  },
  infoKey: { fontSize: 11, color: colors.textSub, marginBottom: 4, fontWeight: "600" },
  infoVal: { fontSize: 14, fontWeight: "700", color: colors.text },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSub,
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  histItem: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 0,
  },
  histLeft: { alignItems: "center", width: 16 },
  histDot: { width: 14, height: 14, borderRadius: 7, marginTop: 2 },
  histLine: { width: 2, flex: 1, backgroundColor: colors.grayBorder, marginTop: 4 },
  histContent: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 10,
  },
  histHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  histTipo: { fontSize: 13, fontWeight: "700", color: colors.text, flex: 1 },
  histData: { fontSize: 12, color: colors.textSub },
  histObs: { fontSize: 13, color: colors.textSub },
  acionarBtn: {
    marginTop: 24,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  acionarText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
