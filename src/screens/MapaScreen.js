import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import Button from "../components/Button";
import FilterChips from "../components/FilterChips";
import TrechoCard, { formatarData } from "../components/TrechoCard";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import SectionTitle from "../components/SectionTitle";
import { colors, radius, shadow, statusLabels } from "../styles/theme";
import { useApp } from "../context/AppContext";

const FILTROS = [
  { valor: "todos", label: "Todos" },
  { valor: "critico", label: "Críticos", cor: colors.critico },
  { valor: "atencao", label: "Atenção", cor: colors.atencao },
  { valor: "manutencao", label: "Em manutenção", cor: colors.manutencao },
  { valor: "ok", label: "OK", cor: colors.ok },
];

const LEGENDA = ["critico", "atencao", "manutencao", "ok"];

/**
 * Fluxo 3 — Mapa da rodovia.
 * Permite filtrar por status, buscar por km e abrir o detalhe do trecho.
 */
export default function MapaScreen() {
  const navigation = useNavigation();
  const {
    trechos,
    trechosFiltrados,
    filtroStatus,
    setFiltroStatus,
    selecionarTrecho,
    carregando,
    atualizando,
    erro,
    carregarDados,
  } = useApp();

  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState(null);

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return trechosFiltrados;
    return trechosFiltrados.filter(
      (t) =>
        String(t.km_inicio).includes(termo) ||
        String(t.km_fim).includes(termo) ||
        t.rodovia.toLowerCase().includes(termo)
    );
  }, [trechosFiltrados, busca]);

  if (carregando) {
    return (
      <View style={styles.root}>
        <Header subtitle="Visualização geral" title="Mapa da rodovia" />
        <LoadingState mensagem="Carregando trechos…" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.root}>
        <Header subtitle="Visualização geral" title="Mapa da rodovia" />
        <ErrorState mensagem={erro} onTentarNovamente={() => carregarDados()} carregando={atualizando} />
      </View>
    );
  }

  function abrirDetalhe(t) {
    selecionarTrecho(t.id);
    navigation.navigate("DetalheTrecho");
  }

  return (
    <View style={styles.root}>
      <Header subtitle="Visualização geral" title="Mapa da rodovia" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() => carregarDados({ silencioso: true })}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Faixa da rodovia */}
        <View style={styles.mapaContainer}>
          <Text style={styles.rodoviaLabel}>
            {trechos.length} trechos monitorados · toque para selecionar
          </Text>

          {trechos.length === 0 ? (
            <Text style={styles.mapaVazio}>
              Sem trechos para exibir no momento.
            </Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                <View style={styles.kmRow}>
                  {[...trechos]
                    .sort((a, b) => a.km_inicio - b.km_inicio)
                    .map((t) => (
                      <Text key={t.id} style={styles.kmLabel}>
                        KM {t.km_inicio}
                      </Text>
                    ))}
                </View>
                <View style={styles.road}>
                  {[...trechos]
                    .sort((a, b) => a.km_inicio - b.km_inicio)
                    .map((t) => (
                      <TouchableOpacity
                        key={t.id}
                        onPress={() => setSelecionado(t)}
                        accessibilityLabel={`Trecho KM ${t.km_inicio}, ${statusLabels[t.status]}`}
                        style={[
                          styles.segment,
                          { backgroundColor: colors[t.status] },
                          selecionado?.id === t.id && styles.segmentSelected,
                        ]}
                      />
                    ))}
                </View>
              </View>
            </ScrollView>
          )}

          <View style={styles.legendaRow}>
            {LEGENDA.map((s) => (
              <View key={s} style={styles.legendaItem}>
                <View style={[styles.legendaDot, { backgroundColor: colors[s] }]} />
                <Text style={styles.legendaText}>{statusLabels[s]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Busca + filtros */}
        <View style={styles.controles}>
          <View style={styles.buscaWrap}>
            <Ionicons name="search" size={18} color={colors.gray} />
            <TextInput
              style={styles.buscaInput}
              value={busca}
              onChangeText={setBusca}
              placeholder="Buscar por km ou rodovia"
              placeholderTextColor={colors.gray}
              returnKeyType="search"
            />
            {busca.length > 0 && (
              <TouchableOpacity onPress={() => setBusca("")} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close-circle" size={18} color={colors.gray} />
              </TouchableOpacity>
            )}
          </View>

          <FilterChips
            opcoes={FILTROS}
            valor={filtroStatus}
            onChange={setFiltroStatus}
            style={{ marginTop: 12 }}
          />
        </View>

        {/* Lista */}
        <View style={styles.listSection}>
          <SectionTitle style={{ marginTop: 0 }}>
            {`${lista.length} ${lista.length === 1 ? "TRECHO" : "TRECHOS"}`}
          </SectionTitle>

          {lista.length === 0 ? (
            <EmptyState
              icon="search-outline"
              titulo="Nenhum trecho encontrado"
              descricao={
                busca
                  ? `Nada corresponde a "${busca}". Ajuste a busca ou troque o filtro.`
                  : "Nenhum trecho com esse status agora. Troque o filtro para ver os demais."
              }
              acao="Limpar filtros"
              onAcao={() => {
                setBusca("");
                setFiltroStatus("todos");
              }}
            />
          ) : (
            lista.map((t) => (
              <TrechoCard
                key={t.id}
                trecho={t}
                selecionado={selecionado?.id === t.id}
                onPress={() => abrirDetalhe(t)}
              />
            ))
          )}
        </View>

        <View style={{ height: selecionado ? 190 : 24 }} />
      </ScrollView>

      {/* Painel do trecho selecionado no mapa */}
      {selecionado && (
        <View style={styles.selectedCard}>
          <View style={styles.selectedTopo}>
            <View style={{ flex: 1 }}>
              <Text style={styles.selectedLabel}>TRECHO SELECIONADO</Text>
              <Text style={styles.selectedKm}>
                KM {selecionado.km_inicio} – {selecionado.km_fim}
              </Text>
              <Text style={styles.selectedInsp}>
                {selecionado.ultima_inspecao
                  ? `Última inspeção em ${formatarData(selecionado.ultima_inspecao)}`
                  : "Sem inspeção registrada"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setSelecionado(null)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityLabel="Fechar painel"
            >
              <Ionicons name="close" size={22} color={colors.gray} />
            </TouchableOpacity>
          </View>

          <Button
            title="Ver detalhes do trecho"
            iconRight="chevron-forward"
            onPress={() => abrirDetalhe(selecionado)}
            style={{ marginTop: 14 }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  mapaContainer: { backgroundColor: colors.mapa, padding: 20, paddingBottom: 16 },
  rodoviaLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 16,
  },
  mapaVazio: { color: "rgba(255,255,255,0.8)", fontSize: 13, paddingVertical: 12 },
  kmRow: { flexDirection: "row", marginBottom: 4 },
  kmLabel: {
    width: 70,
    fontSize: 10,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
  },
  road: { flexDirection: "row", height: 24, gap: 2 },
  segment: { width: 68, height: "100%", borderRadius: 4 },
  segmentSelected: { borderWidth: 3, borderColor: colors.white },
  legendaRow: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 14 },
  legendaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendaDot: { width: 10, height: 10, borderRadius: 5 },
  legendaText: { color: colors.white, fontSize: 12 },
  controles: { paddingHorizontal: 20, paddingTop: 16 },
  buscaWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: colors.grayBorder,
  },
  buscaInput: { flex: 1, fontSize: 14, color: colors.text },
  listSection: { padding: 20, paddingTop: 16 },
  selectedCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 20,
    paddingBottom: 28,
    ...shadow.sheet,
  },
  selectedTopo: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  selectedLabel: {
    fontSize: 11,
    color: colors.textSub,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  selectedKm: { fontSize: 21, fontWeight: "800", color: colors.text },
  selectedInsp: { fontSize: 13, color: colors.textSub, marginTop: 2 },
});
