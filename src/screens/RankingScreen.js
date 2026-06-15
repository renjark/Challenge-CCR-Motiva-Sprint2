import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import UrgencyBar from "../components/UrgencyBar";
import { colors, radius } from "../styles/theme";
import { useApp } from "../context/AppContext";

export default function RankingScreen() {
  const navigation = useNavigation();
  const { trechos, acionarManutencao, setTrechoSelecionado } = useApp();
  const [loading, setLoading] = useState(false);
  const [acionado, setAcionado] = useState(null);

  // Ordena por urgência decrescente
  const ranking = [...trechos].sort((a, b) => b.urgencia - a.urgencia);
  const top5 = ranking.slice(0, 5);

  function handleAcionar(trecho) {
    Alert.alert(
      "Acionar equipe de manutenção",
      `Confirmar acionamento para o trecho KM ${trecho.km_inicio} – ${trecho.km_fim}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          style: "destructive",
          onPress: () => {
            setLoading(true);
            setTimeout(() => {
              acionarManutencao(trecho.id);
              setAcionado(trecho.id);
              setLoading(false);
              Alert.alert(
                "✅ Equipe acionada!",
                `Solicitação enviada para o trecho KM ${trecho.km_inicio}–${trecho.km_fim}.`
              );
            }, 1200);
          },
        },
      ]
    );
  }

  function statusLabel(s) {
    return { critico: "Crítico", atencao: "Atenção", ok: "OK" }[s] || s;
  }

  return (
    <View style={styles.root}>
      <Header subtitle="Priorização automática" title="Ranking de Urgência" />

      {loading && (
        <Modal transparent>
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Enviando solicitação…</Text>
          </View>
        </Modal>
      )}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Trechos ordenados automaticamente por nível de urgência de intervenção.
        </Text>

        {top5.map((t, idx) => (
          <TouchableOpacity
            key={t.id}
            style={styles.card}
            onPress={() => {
              setTrechoSelecionado(t);
              navigation.navigate("DetalheTrecho");
            }}
          >
            <Text style={[styles.rank, { color: colors[t.status] }]}>
              {String(idx + 1).padStart(2, "0")}
            </Text>
            <View style={styles.info}>
              <Text style={styles.km}>KM {t.km_inicio} – {t.km_fim}</Text>
              <View style={styles.barRow}>
                <UrgencyBar value={t.urgencia} status={t.status} />
                <View style={[styles.statusPill, { backgroundColor: colors[t.status] }]}>
                  <Text style={styles.pillText}>{statusLabel(t.status)}</Text>
                </View>
              </View>
              {t.anomalia && (
                <Text style={styles.anomalia} numberOfLines={1}>{t.anomalia}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Botão de acionamento em massa */}
        <TouchableOpacity
          style={styles.acionarBtn}
          onPress={() => handleAcionar(top5[0])}
        >
          <Text style={styles.acionarText}>Acionar equipe de manutenção</Text>
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>

        {/* Todos os trechos */}
        <Text style={[styles.subtitle, { marginTop: 28, marginBottom: 8 }]}>
          TODOS OS TRECHOS
        </Text>
        {ranking.slice(5).map((t, idx) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.card, { opacity: 0.7 }]}
            onPress={() => {
              setTrechoSelecionado(t);
              navigation.navigate("DetalheTrecho");
            }}
          >
            <Text style={[styles.rank, { color: colors[t.status] }]}>
              {String(idx + 6).padStart(2, "0")}
            </Text>
            <View style={styles.info}>
              <Text style={styles.km}>KM {t.km_inicio} – {t.km_fim}</Text>
              <View style={styles.barRow}>
                <UrgencyBar value={t.urgencia} status={t.status} />
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20 },
  subtitle: {
    fontSize: 13,
    color: colors.textSub,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 10,
  },
  rank: {
    fontSize: 22,
    fontWeight: "800",
    width: 36,
  },
  info: { flex: 1, gap: 6 },
  km: { fontSize: 15, fontWeight: "700", color: colors.text },
  barRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  pillText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  anomalia: { fontSize: 12, color: colors.textSub, fontStyle: "italic" },
  acionarBtn: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
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
