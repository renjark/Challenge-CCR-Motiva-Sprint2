import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import { colors, radius } from "../styles/theme";
import { useApp } from "../context/AppContext";

export default function NotificacoesScreen() {
  const { notificacoes, marcarNotificacaoLida, setTrechoSelecionado, trechos } = useApp();

  // Separa hoje e ontem/antes
  const hoje = new Date().toISOString().split("T")[0];
  const deHoje = notificacoes.filter((n) => n.data === hoje || n.data === "2026-06-13");
  const anteriores = notificacoes.filter((n) => n.data !== hoje && n.data !== "2026-06-13");

  useEffect(() => {
    // Marca todas como lidas ao abrir
    notificacoes.forEach((n) => {
      if (!n.lida) marcarNotificacaoLida(n.id);
    });
  }, []);

  function NotifCard({ n }) {
    return (
      <TouchableOpacity
        style={[styles.card, !n.lida && styles.cardUnread]}
        onPress={() => marcarNotificacaoLida(n.id)}
      >
        <StatusBadge status={n.tipo} size={16} />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{n.titulo}</Text>
          <Text style={styles.cardDesc}>{n.descricao}</Text>
          <Text style={styles.cardTime}>Hoje, {n.hora}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.root}>
      <Header subtitle="Central de alertas" title="Notificações" showBack />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {deHoje.length > 0 && (
          <>
            <Text style={styles.grupo}>HOJE</Text>
            {deHoje.map((n) => <NotifCard key={n.id} n={n} />)}
          </>
        )}

        {anteriores.length > 0 && (
          <>
            <Text style={styles.grupo}>ANTERIORES</Text>
            {anteriores.map((n) => <NotifCard key={n.id} n={n} />)}
          </>
        )}

        {notificacoes.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhuma notificação</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20 },
  grupo: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSub,
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 8,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 8,
  },
  cardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: colors.text },
  cardDesc: { fontSize: 13, color: colors.textSub, marginTop: 2 },
  cardTime: { fontSize: 12, color: colors.gray, marginTop: 4 },
  empty: { alignItems: "center", marginTop: 60 },
  emptyText: { color: colors.gray, fontSize: 15 },
});
