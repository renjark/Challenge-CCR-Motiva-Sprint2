import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import Card from "../components/Card";
import Button from "../components/Button";
import StatusPill from "../components/StatusPill";
import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import { formatarData } from "../components/TrechoCard";
import { colors, radius, ordemLabels, ordemColors, statusLabels } from "../styles/theme";
import { useApp } from "../context/AppContext";

const prioridadeLabel = { alta: "Alta", media: "Média", baixa: "Baixa" };

/**
 * Fluxo 8 — Ciclo de vida da ordem de serviço.
 * aberta → em andamento → concluída, com caminho alternativo de cancelamento.
 */
export default function DetalheOrdemScreen() {
  const navigation = useNavigation();
  const {
    ordemSelecionada: o,
    buscarTrecho,
    buscarEquipe,
    mudarStatusOrdem,
    selecionarTrecho,
  } = useApp();

  const [acao, setAcao] = useState(null);

  if (!o) {
    return (
      <View style={styles.root}>
        <Header subtitle="Ordem de serviço" title="Detalhe" showBack showBell={false} />
        <EmptyState
          icon="clipboard-outline"
          titulo="Nenhuma ordem selecionada"
          descricao="Escolha uma ordem na lista para ver os detalhes da execução."
          acao="Ver ordens"
          onAcao={() => navigation.navigate("Main", { screen: "Ordens" })}
        />
      </View>
    );
  }

  const trecho = buscarTrecho(o.trecho_id);
  const equipe = buscarEquipe(o.equipe_id);
  const encerrada = o.status === "concluida" || o.status === "cancelada";

  async function executar(novoStatus) {
    setAcao(novoStatus);
    await mudarStatusOrdem(o.id, novoStatus);
    setAcao(null);
  }

  function confirmarCancelamento() {
    Alert.alert(
      "Cancelar ordem",
      `A ordem ${o.codigo} será cancelada e o trecho volta para monitoramento. Deseja continuar?`,
      [
        { text: "Voltar", style: "cancel" },
        {
          text: "Cancelar ordem",
          style: "destructive",
          onPress: () => executar("cancelada"),
        },
      ]
    );
  }

  const etapas = [
    { chave: "aberta", label: "Ordem aberta", data: o.abertura },
    {
      chave: "em_andamento",
      label: "Equipe em campo",
      data: o.status === "em_andamento" || o.status === "concluida" ? o.abertura : null,
    },
    {
      chave: "concluida",
      label: "Serviço concluído",
      data: o.conclusao,
    },
  ];
  const indiceAtual = { aberta: 0, em_andamento: 1, concluida: 2, cancelada: 0 }[o.status];

  return (
    <View style={styles.root}>
      <Header subtitle={o.codigo} title="Ordem de serviço" showBack showBell={false} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Card style={{ borderLeftWidth: 5, borderLeftColor: ordemColors[o.status] }}>
          <View style={styles.topo}>
            <Text style={styles.codigo}>{o.codigo}</Text>
            <StatusPill
              status={o.status}
              label={ordemLabels[o.status]}
              color={ordemColors[o.status]}
            />
          </View>
          <Text style={styles.descricao}>{o.descricao}</Text>
        </Card>

        {trecho && (
          <Card
            onPress={() => {
              selecionarTrecho(trecho.id);
              navigation.navigate("DetalheTrecho");
            }}
          >
            <View style={styles.linkLinha}>
              <Ionicons name="git-branch-outline" size={18} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.linkTitulo}>
                  KM {trecho.km_inicio} – {trecho.km_fim} · {trecho.rodovia}
                </Text>
                <Text style={styles.linkSub}>
                  Situação do trecho: {statusLabels[trecho.status]}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.gray} />
            </View>
          </Card>
        )}

        <View style={styles.grid}>
          <Info label="Equipe" valor={equipe ? equipe.nome : "Na fila"} />
          <Info label="Responsável" valor={equipe ? equipe.responsavel : "—"} />
          <Info label="Prioridade" valor={prioridadeLabel[o.prioridade] || o.prioridade} />
          <Info label="Abertura" valor={formatarData(o.abertura)} />
          <Info label="Previsão" valor={formatarData(o.previsao)} />
          <Info
            label="Conclusão"
            valor={o.conclusao ? formatarData(o.conclusao) : "—"}
          />
        </View>

        <SectionTitle style={{ marginTop: 4 }}>ANDAMENTO</SectionTitle>

        {o.status === "cancelada" ? (
          <View style={styles.canceladaBox}>
            <Ionicons name="close-circle-outline" size={20} color={colors.gray} />
            <Text style={styles.canceladaTexto}>
              Ordem cancelada. O trecho voltou para a fila de monitoramento.
            </Text>
          </View>
        ) : (
          etapas.map((e, i) => {
            const concluida = i < indiceAtual;
            const atual = i === indiceAtual;
            return (
              <View key={e.chave} style={styles.etapaLinha}>
                <View style={styles.etapaEsq}>
                  <View
                    style={[
                      styles.etapaDot,
                      concluida && { backgroundColor: colors.ok },
                      atual && { backgroundColor: ordemColors[o.status] },
                    ]}
                  >
                    {concluida && <Ionicons name="checkmark" size={11} color={colors.white} />}
                  </View>
                  {i < etapas.length - 1 && <View style={styles.etapaLinhaVertical} />}
                </View>
                <View style={styles.etapaConteudo}>
                  <Text style={[styles.etapaLabel, (concluida || atual) && styles.etapaLabelAtiva]}>
                    {e.label}
                  </Text>
                  <Text style={styles.etapaData}>
                    {e.data ? formatarData(e.data) : "pendente"}
                  </Text>
                </View>
              </View>
            );
          })
        )}

        {/* Ações */}
        {!encerrada && (
          <>
            {o.status === "aberta" && (
              <Button
                title="Marcar equipe em campo"
                icon="play"
                onPress={() => executar("em_andamento")}
                loading={acao === "em_andamento"}
                style={{ marginTop: 24 }}
              />
            )}
            {o.status === "em_andamento" && (
              <Button
                title="Concluir ordem"
                icon="checkmark-done"
                onPress={() => executar("concluida")}
                loading={acao === "concluida"}
                style={{ marginTop: 24 }}
              />
            )}
            <Button
              title="Cancelar ordem"
              variant="ghost"
              icon="close"
              onPress={confirmarCancelamento}
              loading={acao === "cancelada"}
              style={{ marginTop: 10 }}
            />
          </>
        )}

        {encerrada && (
          <Button
            title="Voltar para a lista"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 24 }}
          />
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function Info({ label, valor }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoKey}>{label}</Text>
      <Text style={styles.infoVal}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20 },
  topo: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  codigo: { fontSize: 18, fontWeight: "800", color: colors.text },
  descricao: { fontSize: 13, color: colors.textSub, marginTop: 10, lineHeight: 19 },
  linkLinha: { flexDirection: "row", alignItems: "center", gap: 12 },
  linkTitulo: { fontSize: 14, fontWeight: "700", color: colors.text },
  linkSub: { fontSize: 12, color: colors.textSub, marginTop: 2 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 2, marginBottom: 8 },
  infoItem: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 14,
    width: "47.5%",
    flexGrow: 1,
  },
  infoKey: { fontSize: 11, color: colors.textSub, marginBottom: 4, fontWeight: "600" },
  infoVal: { fontSize: 14, fontWeight: "700", color: colors.text },
  etapaLinha: { flexDirection: "row", gap: 12 },
  etapaEsq: { alignItems: "center", width: 18 },
  etapaDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.grayBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  etapaLinhaVertical: { width: 2, flex: 1, backgroundColor: colors.grayBorder, marginVertical: 2 },
  etapaConteudo: { flex: 1, paddingBottom: 18 },
  etapaLabel: { fontSize: 14, color: colors.gray, fontWeight: "600" },
  etapaLabelAtiva: { color: colors.text, fontWeight: "700" },
  etapaData: { fontSize: 12, color: colors.textSub, marginTop: 2 },
  canceladaBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: colors.grayLight,
    borderRadius: radius.md,
    padding: 14,
  },
  canceladaTexto: { flex: 1, fontSize: 13, color: colors.textSub, lineHeight: 18 },
});
