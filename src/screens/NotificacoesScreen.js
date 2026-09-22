import React, { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import Card from "../components/Card";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import { formatarData } from "../components/TrechoCard";
import { colors } from "../styles/theme";
import { useApp } from "../context/AppContext";

/**
 * Fluxo 9 — Central de alertas.
 * Agrupa por data real, mantém o estado de não lida e leva ao trecho.
 */
export default function NotificacoesScreen() {
  const navigation = useNavigation();
  const {
    notificacoes,
    marcarNotificacaoLida,
    marcarTodasLidas,
    limparNotificacoes,
    notifNaoLidas,
    selecionarTrecho,
    buscarTrecho,
    dataReferencia,
  } = useApp();

  const grupos = useMemo(() => {
    const hoje = new Date().toISOString().split("T")[0];
    const ordenadas = [...notificacoes].sort((a, b) =>
      `${a.data}${a.hora}` < `${b.data}${b.hora}` ? 1 : -1
    );
    // A base mockada usa 13/06/2026 como "hoje" da demonstração.
    const ehHoje = (d) => d === hoje || d === dataReferencia;
    return {
      hoje: ordenadas.filter((n) => ehHoje(n.data)),
      anteriores: ordenadas.filter((n) => !ehHoje(n.data)),
    };
  }, [notificacoes, dataReferencia]);

  function abrirTrecho(n) {
    marcarNotificacaoLida(n.id);
    const t = buscarTrecho(n.trecho_id);
    if (!t) return;
    selecionarTrecho(t.id);
    navigation.navigate("DetalheTrecho");
  }

  function confirmarLimpeza() {
    Alert.alert(
      "Limpar notificações",
      "Todos os alertas serão removidos desta lista. Deseja continuar?",
      [
        { text: "Voltar", style: "cancel" },
        { text: "Limpar", style: "destructive", onPress: limparNotificacoes },
      ]
    );
  }

  function NotifCard({ n }) {
    const t = buscarTrecho(n.trecho_id);
    return (
      <Card onPress={() => abrirTrecho(n)} style={!n.lida ? styles.naoLida : null}>
        <View style={styles.linha}>
          <StatusBadge status={n.tipo} size={14} style={{ marginTop: 4 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.titulo}>{n.titulo}</Text>
            <Text style={styles.descricao}>{n.descricao}</Text>
            <Text style={styles.hora}>
              {formatarData(n.data)} · {n.hora}
              {t ? ` · KM ${t.km_inicio}` : ""}
            </Text>
          </View>
          {!n.lida && <View style={styles.ponto} />}
          <Ionicons name="chevron-forward" size={16} color={colors.gray} />
        </View>
      </Card>
    );
  }

  return (
    <View style={styles.root}>
      <Header
        subtitle="Central de alertas"
        title="Notificações"
        showBack
        showBell={false}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {notificacoes.length === 0 ? (
          <EmptyState
            icon="notifications-off-outline"
            titulo="Nenhum alerta por aqui"
            descricao="Os alertas automáticos de vegetação aparecem nesta tela assim que forem gerados."
            acao="Voltar ao painel"
            onAcao={() => navigation.goBack()}
          />
        ) : (
          <>
            <View style={styles.resumo}>
              <Text style={styles.resumoTexto}>
                {notifNaoLidas === 0
                  ? "Tudo lido."
                  : `${notifNaoLidas} ${notifNaoLidas === 1 ? "alerta não lido" : "alertas não lidos"}`}
              </Text>
              {notifNaoLidas > 0 && (
                <Text style={styles.marcarTodas} onPress={marcarTodasLidas}>
                  Marcar todas como lidas
                </Text>
              )}
            </View>

            {grupos.hoje.length > 0 && (
              <>
                <SectionTitle style={{ marginTop: 12 }}>HOJE</SectionTitle>
                {grupos.hoje.map((n) => (
                  <NotifCard key={n.id} n={n} />
                ))}
              </>
            )}

            {grupos.anteriores.length > 0 && (
              <>
                <SectionTitle>ANTERIORES</SectionTitle>
                {grupos.anteriores.map((n) => (
                  <NotifCard key={n.id} n={n} />
                ))}
              </>
            )}

            <Button
              title="Limpar notificações"
              variant="ghost"
              icon="trash-outline"
              onPress={confirmarLimpeza}
              style={{ marginTop: 20 }}
            />
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20 },
  resumo: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  resumoTexto: { fontSize: 13, color: colors.textSub, fontWeight: "600", flex: 1 },
  marcarTodas: { fontSize: 13, color: colors.primary, fontWeight: "700" },
  naoLida: { borderLeftWidth: 4, borderLeftColor: colors.primary },
  linha: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  titulo: { fontSize: 14, fontWeight: "700", color: colors.text },
  descricao: { fontSize: 13, color: colors.textSub, marginTop: 2 },
  hora: { fontSize: 12, color: colors.gray, marginTop: 6 },
  ponto: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 6 },
});
