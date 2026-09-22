import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import Card from "../components/Card";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import { formatarData } from "../components/TrechoCard";
import { colors, radius, shadow } from "../styles/theme";
import { useApp } from "../context/AppContext";

/**
 * Fluxo 2 — Painel do supervisor.
 * Estados cobertos: carregando, erro, vazio, sucesso.
 */
export default function HomeScreen() {
  const navigation = useNavigation();
  const {
    usuario,
    dashboard,
    notificacoes,
    ranking,
    carregando,
    atualizando,
    erro,
    carregarDados,
    selecionarTrecho,
    setFiltroStatus,
  } = useApp();

  if (carregando) {
    return (
      <View style={styles.root}>
        <Header subtitle="Bem-vindo de volta" title="Grovia" />
        <LoadingState mensagem="Sincronizando trechos da rodovia…" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.root}>
        <Header subtitle="Bem-vindo de volta" title="Grovia" />
        <ErrorState
          mensagem={erro}
          onTentarNovamente={() => carregarDados()}
          carregando={atualizando}
        />
      </View>
    );
  }

  const alertas = notificacoes.slice(0, 3);
  const prioritarios = ranking.filter((t) => t.status !== "ok").slice(0, 3);

  return (
    <View style={styles.root}>
      <Header
        subtitle="Bem-vindo de volta"
        title={`Olá, ${usuario?.primeiro_nome || "supervisor"}`}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() => carregarDados({ silencioso: true })}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {dashboard.total === 0 ? (
          <EmptyState
            icon="map-outline"
            titulo="Nenhum trecho monitorado"
            descricao="Assim que a base de trechos for sincronizada, o painel aparece aqui."
            acao="Sincronizar agora"
            onAcao={() => carregarDados()}
          />
        ) : (
          <>
            <SectionTitle style={{ marginTop: 4 }}>STATUS DOS TRECHOS</SectionTitle>
            <View style={styles.statusRow}>
              <StatusCard
                cor={colors.critico}
                numero={dashboard.criticos}
                label="Críticos"
                onPress={() => {
                  setFiltroStatus("critico");
                  navigation.navigate("Mapa");
                }}
              />
              <StatusCard
                cor={colors.atencao}
                numero={dashboard.atencao}
                label="Atenção"
                onPress={() => {
                  setFiltroStatus("atencao");
                  navigation.navigate("Mapa");
                }}
              />
              <StatusCard
                cor={colors.ok}
                numero={dashboard.ok}
                label="OK"
                onPress={() => {
                  setFiltroStatus("ok");
                  navigation.navigate("Mapa");
                }}
              />
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoCard}>
                <Ionicons name="construct-outline" size={20} color={colors.primary} />
                <Text style={styles.infoNum}>{dashboard.ordensPendentes}</Text>
                <Text style={styles.infoSub}>Ordens em aberto</Text>
              </View>
              <View style={styles.infoCard}>
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                <Text style={styles.infoNum}>
                  {dashboard.ultimaManutencao
                    ? formatarData(dashboard.ultimaManutencao)
                    : "—"}
                </Text>
                <Text style={styles.infoSub}>Última conclusão</Text>
              </View>
              <View style={styles.infoCard}>
                <Ionicons name="git-branch-outline" size={20} color={colors.primary} />
                <Text style={styles.infoNum}>{dashboard.kmMonitorados} km</Text>
                <Text style={styles.infoSub}>Sob monitoramento</Text>
              </View>
            </View>

            <SectionTitle
              action="Ver ranking"
              onAction={() => navigation.navigate("Ranking")}
            >
              PRECISAM DE ATENÇÃO
            </SectionTitle>

            {prioritarios.length === 0 ? (
              <Card>
                <View style={styles.tudoOk}>
                  <Ionicons name="checkmark-circle" size={22} color={colors.ok} />
                  <Text style={styles.tudoOkTexto}>
                    Todos os trechos estão dentro do padrão.
                  </Text>
                </View>
              </Card>
            ) : (
              prioritarios.map((t) => (
                <Card
                  key={t.id}
                  onPress={() => {
                    selecionarTrecho(t.id);
                    navigation.navigate("DetalheTrecho");
                  }}
                >
                  <View style={styles.linha}>
                    <StatusBadge status={t.status} size={14} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.trechoKm}>
                        KM {t.km_inicio} – {t.km_fim} · {t.rodovia}
                      </Text>
                      <Text style={styles.trechoSub} numberOfLines={1}>
                        {t.anomalia || "Aguardando nova inspeção"}
                      </Text>
                    </View>
                    <Text style={[styles.urgencia, { color: colors[t.status] }]}>
                      {t.urgencia}%
                    </Text>
                  </View>
                </Card>
              ))
            )}

            <SectionTitle
              action={notificacoes.length ? "Ver todas" : null}
              onAction={() => navigation.navigate("Notificacoes")}
            >
              ALERTAS RECENTES
            </SectionTitle>

            {alertas.length === 0 ? (
              <Card>
                <Text style={styles.semAlertas}>
                  Nenhum alerta nas últimas 24 horas.
                </Text>
              </Card>
            ) : (
              alertas.map((a) => (
                <Card key={a.id} onPress={() => navigation.navigate("Notificacoes")}>
                  <View style={styles.linha}>
                    <StatusBadge status={a.tipo} size={12} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.alertTitle}>{a.titulo}</Text>
                      <Text style={styles.alertTime}>
                        {formatarData(a.data)} · {a.hora}
                      </Text>
                    </View>
                    {!a.lida && <View style={styles.pontoNaoLido} />}
                    <Ionicons name="chevron-forward" size={16} color={colors.gray} />
                  </View>
                </Card>
              ))
            )}

            <Button
              title="Registrar nova inspeção"
              icon="camera-outline"
              onPress={() => navigation.navigate("NovaInspecao")}
              style={{ marginTop: 22 }}
            />
            <Button
              title="Ver ordens de serviço"
              variant="outline"
              icon="clipboard-outline"
              onPress={() => navigation.navigate("Ordens")}
              style={{ marginTop: 10 }}
            />
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

function StatusCard({ cor, numero, label, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.statusCard, { backgroundColor: cor }]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`${numero} trechos ${label}`}
    >
      <Text style={styles.statusNum}>{numero}</Text>
      <Text style={styles.statusLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  statusRow: { flexDirection: "row", gap: 10 },
  statusCard: {
    flex: 1,
    borderRadius: radius.md,
    padding: 16,
    alignItems: "center",
    ...shadow.card,
  },
  statusNum: { fontSize: 30, fontWeight: "800", color: colors.white },
  statusLabel: { fontSize: 13, color: "rgba(255,255,255,0.92)", fontWeight: "600" },
  infoRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  infoCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 14,
    gap: 4,
    ...shadow.card,
  },
  infoNum: { fontSize: 17, fontWeight: "800", color: colors.text },
  infoSub: { fontSize: 11, color: colors.textSub },
  linha: { flexDirection: "row", alignItems: "center", gap: 12 },
  trechoKm: { fontSize: 14, fontWeight: "700", color: colors.text },
  trechoSub: { fontSize: 12, color: colors.textSub, marginTop: 2 },
  urgencia: { fontSize: 15, fontWeight: "800" },
  alertTitle: { fontSize: 14, fontWeight: "600", color: colors.text },
  alertTime: { fontSize: 12, color: colors.textSub, marginTop: 2 },
  pontoNaoLido: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  semAlertas: { fontSize: 13, color: colors.textSub },
  tudoOk: { flexDirection: "row", alignItems: "center", gap: 10 },
  tudoOkTexto: { fontSize: 13, color: colors.text, flex: 1 },
});
