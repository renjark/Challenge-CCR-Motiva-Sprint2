import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import { colors, radius } from "../styles/theme";
import { useApp } from "../context/AppContext";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { dashboard, notificacoes } = useApp();

  const alertasRecentes = notificacoes.slice(0, 2);

  return (
    <View style={styles.root}>
      <Header subtitle="Bem-vindo de volta" title="Olá, Marcos! 👋" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Status dos trechos */}
        <Text style={styles.sectionTitle}>STATUS DOS TRECHOS</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusCard, { backgroundColor: colors.critico }]}>
            <Text style={styles.statusNum}>{dashboard.criticos}</Text>
            <Text style={styles.statusLabel}>Críticos</Text>
          </View>
          <View style={[styles.statusCard, { backgroundColor: colors.atencao }]}>
            <Text style={styles.statusNum}>{dashboard.atencao}</Text>
            <Text style={styles.statusLabel}>Atenção</Text>
          </View>
          <View style={[styles.statusCard, { backgroundColor: colors.ok }]}>
            <Text style={styles.statusNum}>{dashboard.ok}</Text>
            <Text style={styles.statusLabel}>OK</Text>
          </View>
        </View>

        {/* Info cards */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoNum}>{dashboard.manutencoes_pendentes}</Text>
            <Text style={styles.infoSub}>Manutenções{"\n"}pendentes</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="calendar-outline" size={22} color={colors.primary} style={{ marginBottom: 4 }} />
            <Text style={styles.infoNum}>{dashboard.ultima_manutencao}</Text>
            <Text style={styles.infoSub}>Última{"\n"}manutenção</Text>
          </View>
        </View>

        {/* Alertas recentes */}
        <Text style={styles.sectionTitle}>ALERTAS RECENTES</Text>
        {alertasRecentes.map((alerta) => (
          <TouchableOpacity
            key={alerta.id}
            style={styles.alertCard}
            onPress={() => navigation.navigate("Notificacoes")}
          >
            <StatusBadge status={alerta.tipo} size={14} />
            <View style={styles.alertText}>
              <Text style={styles.alertTitle}>{alerta.titulo}</Text>
              <Text style={styles.alertTime}>
                {alerta.data === new Date().toISOString().split("T")[0]
                  ? `Hoje, ${alerta.hora}`
                  : `Ontem, ${alerta.hora}`}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.gray} />
          </TouchableOpacity>
        ))}

        {/* Ação rápida */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate("Ranking")}
        >
          <Text style={styles.ctaText}>Ver Ranking de Urgência</Text>
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSub,
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    gap: 10,
  },
  statusCard: {
    flex: 1,
    borderRadius: radius.md,
    padding: 16,
    alignItems: "center",
  },
  statusNum: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
  },
  statusLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 16,
    alignItems: "flex-start",
  },
  infoNum: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
  },
  infoSub: {
    fontSize: 12,
    color: colors.textSub,
    marginTop: 2,
  },
  alertCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  alertText: { flex: 1 },
  alertTitle: { fontSize: 14, fontWeight: "600", color: colors.text },
  alertTime: { fontSize: 12, color: colors.textSub, marginTop: 2 },
  ctaBtn: {
    marginTop: 20,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
