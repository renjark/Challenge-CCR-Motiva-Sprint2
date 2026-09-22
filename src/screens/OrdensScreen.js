import React from "react";
import { View, Text, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import OrdemCard from "../components/OrdemCard";
import FilterChips from "../components/FilterChips";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import { colors, ordemColors } from "../styles/theme";
import { useApp } from "../context/AppContext";

const FILTROS = [
  { valor: "todos", label: "Todas" },
  { valor: "aberta", label: "Abertas", cor: ordemColors.aberta },
  { valor: "em_andamento", label: "Em andamento", cor: ordemColors.em_andamento },
  { valor: "concluida", label: "Concluídas", cor: ordemColors.concluida },
  { valor: "cancelada", label: "Canceladas", cor: colors.gray },
];

/**
 * Fluxo 7 — Acompanhamento das ordens de serviço.
 */
export default function OrdensScreen() {
  const navigation = useNavigation();
  const {
    ordens,
    ordensFiltradas,
    filtroOrdem,
    setFiltroOrdem,
    buscarTrecho,
    buscarEquipe,
    selecionarOrdem,
    carregando,
    atualizando,
    erro,
    carregarDados,
  } = useApp();

  if (carregando) {
    return (
      <View style={styles.root}>
        <Header subtitle="Execução em campo" title="Ordens de serviço" />
        <LoadingState mensagem="Carregando ordens…" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.root}>
        <Header subtitle="Execução em campo" title="Ordens de serviço" />
        <ErrorState mensagem={erro} onTentarNovamente={() => carregarDados()} carregando={atualizando} />
      </View>
    );
  }

  const abertas = ordens.filter(
    (o) => o.status === "aberta" || o.status === "em_andamento"
  ).length;

  return (
    <View style={styles.root}>
      <Header subtitle="Execução em campo" title="Ordens de serviço" />

      <View style={styles.topo}>
        <Text style={styles.resumo}>
          {ordens.length === 0
            ? "Nenhuma ordem registrada"
            : `${abertas} em andamento de ${ordens.length} no total`}
        </Text>
        <FilterChips
          opcoes={FILTROS}
          valor={filtroOrdem}
          onChange={setFiltroOrdem}
          style={{ marginTop: 12 }}
        />
      </View>

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
        {ordensFiltradas.length === 0 ? (
          <EmptyState
            icon="clipboard-outline"
            titulo={
              ordens.length === 0
                ? "Nenhuma ordem de serviço"
                : "Nada com esse filtro"
            }
            descricao={
              ordens.length === 0
                ? "Abra uma ordem a partir do ranking ou do detalhe de um trecho."
                : "Troque o filtro para ver as demais ordens."
            }
            acao={ordens.length === 0 ? "Ir para o ranking" : "Ver todas"}
            onAcao={() =>
              ordens.length === 0
                ? navigation.navigate("Ranking")
                : setFiltroOrdem("todos")
            }
          />
        ) : (
          ordensFiltradas.map((o) => (
            <OrdemCard
              key={o.id}
              ordem={o}
              trecho={buscarTrecho(o.trecho_id)}
              equipe={buscarEquipe(o.equipe_id)}
              onPress={() => {
                selecionarOrdem(o.id);
                navigation.navigate("DetalheOrdem");
              }}
            />
          ))
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  topo: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  resumo: { fontSize: 13, color: colors.textSub, fontWeight: "600" },
  scroll: { padding: 20, paddingTop: 12 },
});
