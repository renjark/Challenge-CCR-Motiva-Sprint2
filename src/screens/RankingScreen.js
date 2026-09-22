import React from "react";
import { View, Text, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import Button from "../components/Button";
import Card from "../components/Card";
import TrechoCard from "../components/TrechoCard";
import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import { colors } from "../styles/theme";
import { useApp } from "../context/AppContext";

/**
 * Fluxo 4 — Ranking de urgência.
 * Ordena automaticamente por índice de urgência e leva à abertura de OS.
 */
export default function RankingScreen() {
  const navigation = useNavigation();
  const {
    ranking,
    carregando,
    atualizando,
    erro,
    carregarDados,
    selecionarTrecho,
    ordemAtivaDoTrecho,
  } = useApp();

  if (carregando) {
    return (
      <View style={styles.root}>
        <Header subtitle="Priorização automática" title="Ranking de urgência" />
        <LoadingState mensagem="Calculando prioridades…" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.root}>
        <Header subtitle="Priorização automática" title="Ranking de urgência" />
        <ErrorState mensagem={erro} onTentarNovamente={() => carregarDados()} carregando={atualizando} />
      </View>
    );
  }

  const top5 = ranking.slice(0, 5);
  const demais = ranking.slice(5);
  const alvo = top5[0];
  const osAtiva = alvo ? ordemAtivaDoTrecho(alvo.id) : null;

  function abrir(t) {
    selecionarTrecho(t.id);
    navigation.navigate("DetalheTrecho");
  }

  return (
    <View style={styles.root}>
      <Header subtitle="Priorização automática" title="Ranking de urgência" />

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
        {ranking.length === 0 ? (
          <EmptyState
            icon="stats-chart-outline"
            titulo="Ranking indisponível"
            descricao="Nenhum trecho foi sincronizado ainda, então não há o que priorizar."
            acao="Sincronizar agora"
            onAcao={() => carregarDados()}
          />
        ) : (
          <>
            <Text style={styles.intro}>
              Os trechos são ordenados pelo índice de urgência, calculado a partir
              da altura da vegetação, da taxa de crescimento e do tempo desde a
              última intervenção.
            </Text>

            <SectionTitle style={{ marginTop: 16 }}>TOP 5 PRIORIDADES</SectionTitle>
            {top5.map((t, i) => (
              <TrechoCard
                key={t.id}
                trecho={t}
                posicao={i + 1}
                mostrarUrgencia
                onPress={() => abrir(t)}
              />
            ))}

            {alvo && (
              <Card style={styles.acaoCard}>
                <Text style={styles.acaoTitulo}>
                  Próxima ação recomendada
                </Text>
                <Text style={styles.acaoTexto}>
                  KM {alvo.km_inicio} – {alvo.km_fim} lidera o ranking com{" "}
                  {alvo.urgencia}% de urgência.
                </Text>
                {osAtiva ? (
                  <Text style={styles.acaoAviso}>
                    Já existe a ordem {osAtiva.codigo} em andamento para este trecho.
                  </Text>
                ) : null}
                <Button
                  title={osAtiva ? "Acompanhar ordem aberta" : "Abrir ordem de serviço"}
                  icon={osAtiva ? "clipboard-outline" : "construct-outline"}
                  onPress={() => abrir(alvo)}
                  variant={osAtiva ? "outline" : "primary"}
                  style={{ marginTop: 14 }}
                />
              </Card>
            )}

            {demais.length > 0 && (
              <>
                <SectionTitle>DEMAIS TRECHOS</SectionTitle>
                {demais.map((t, i) => (
                  <TrechoCard
                    key={t.id}
                    trecho={t}
                    posicao={i + 6}
                    mostrarUrgencia
                    onPress={() => abrir(t)}
                  />
                ))}
              </>
            )}
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20 },
  intro: { fontSize: 13, color: colors.textSub, lineHeight: 19 },
  acaoCard: { backgroundColor: colors.primarySoft, marginTop: 6 },
  acaoTitulo: { fontSize: 14, fontWeight: "800", color: colors.primaryDark },
  acaoTexto: { fontSize: 13, color: colors.text, marginTop: 6, lineHeight: 19 },
  acaoAviso: { fontSize: 12, color: colors.atencao, marginTop: 8, fontWeight: "600" },
});
