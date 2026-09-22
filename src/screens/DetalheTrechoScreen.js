import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import Card from "../components/Card";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import StatusPill from "../components/StatusPill";
import UrgencyBar from "../components/UrgencyBar";
import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import { formatarData } from "../components/TrechoCard";
import {
  colors,
  radius,
  shadow,
  statusLabels,
  ordemLabels,
  ordemColors,
} from "../styles/theme";
import { useApp } from "../context/AppContext";

const tipoIcon = { inspecao: "search-outline", manutencao: "construct-outline" };
const PRIORIDADES = [
  { valor: "alta", label: "Alta" },
  { valor: "media", label: "Média" },
  { valor: "baixa", label: "Baixa" },
];

/**
 * Fluxo 5 — Detalhe do trecho e abertura de ordem de serviço.
 * Cobre trecho sem histórico, trecho já com OS ativa e falha de escrita.
 */
export default function DetalheTrechoScreen() {
  const navigation = useNavigation();
  const {
    trechoSelecionado: t,
    equipes,
    abrirOrdem,
    ordemAtivaDoTrecho,
    selecionarOrdem,
  } = useApp();

  const [modalAberto, setModalAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [equipeId, setEquipeId] = useState(null);
  const [prioridade, setPrioridade] = useState("alta");
  const [descricao, setDescricao] = useState("");

  // Guarda de segurança: a tela nunca fica em branco
  if (!t) {
    return (
      <View style={styles.root}>
        <Header subtitle="Detalhe" title="Trecho" showBack />
        <EmptyState
          icon="map-outline"
          titulo="Nenhum trecho selecionado"
          descricao="Escolha um trecho no mapa ou no ranking para ver o histórico completo."
          acao="Ir para o mapa"
          onAcao={() => navigation.navigate("Main", { screen: "Mapa" })}
        />
      </View>
    );
  }

  const osAtiva = ordemAtivaDoTrecho(t.id);
  const equipesDisponiveis = equipes.filter((e) => e.disponivel);

  async function confirmarAbertura() {
    setEnviando(true);
    const r = await abrirOrdem({
      trechoId: t.id,
      equipeId: equipeId || equipesDisponiveis[0]?.id || null,
      prioridade,
      descricao,
    });
    setEnviando(false);
    if (r.ok) {
      setModalAberto(false);
      setDescricao("");
      setEquipeId(null);
    }
  }

  return (
    <View style={styles.root}>
      <Header
        subtitle={`KM ${t.km_inicio} – KM ${t.km_fim}`}
        title={`${t.rodovia} · ${statusLabels[t.status] || t.status}`}
        showBack
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Status atual */}
        <Card style={[styles.statusBanner, { borderLeftColor: colors[t.status] }]}>
          <View style={styles.statusLinha}>
            <StatusBadge status={t.status} size={16} />
            <View style={{ flex: 1 }}>
              <Text style={styles.statusTitulo}>
                Status atual: {statusLabels[t.status]}
              </Text>
              <Text style={styles.statusSub}>Índice de urgência: {t.urgencia}%</Text>
            </View>
          </View>
          <UrgencyBar value={t.urgencia} status={t.status} />
        </Card>

        {/* Ordem ativa */}
        {osAtiva && (
          <Card
            onPress={() => {
              selecionarOrdem(osAtiva.id);
              navigation.navigate("DetalheOrdem");
            }}
            style={styles.osCard}
          >
            <View style={styles.osTopo}>
              <Ionicons name="clipboard-outline" size={18} color={colors.manutencao} />
              <Text style={styles.osCodigo}>{osAtiva.codigo}</Text>
              <StatusPill
                status={osAtiva.status}
                label={ordemLabels[osAtiva.status]}
                color={ordemColors[osAtiva.status]}
                compact
              />
            </View>
            <Text style={styles.osTexto}>
              Ordem de serviço ativa · previsão {formatarData(osAtiva.previsao)}
            </Text>
          </Card>
        )}

        {/* Anomalia */}
        {t.anomalia ? (
          <View style={styles.anomaliaCard}>
            <Ionicons name="warning-outline" size={18} color={colors.atencao} />
            <Text style={styles.anomaliaText}>{t.anomalia}</Text>
          </View>
        ) : (
          <View style={styles.okCard}>
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.ok} />
            <Text style={styles.okText}>Nenhuma anomalia registrada neste trecho.</Text>
          </View>
        )}

        {/* Dados gerais */}
        <View style={styles.infoGrid}>
          <Info label="Última inspeção" valor={formatarData(t.ultima_inspecao)} />
          <Info label="Inspetor" valor={t.inspector || "—"} />
          <Info
            label="Altura da vegetação"
            valor={t.altura_vegetacao_cm ? `${t.altura_vegetacao_cm} cm` : "—"}
          />
          <Info
            label="Crescimento"
            valor={
              t.crescimento_cm_semana ? `${t.crescimento_cm_semana} cm/sem` : "—"
            }
          />
          <Info label="Extensão" valor={`${t.km_fim - t.km_inicio} km`} />
          <Info
            label="Coordenadas"
            valor={
              t.coordenadas
                ? `${t.coordenadas.lat}, ${t.coordenadas.lng}`
                : "—"
            }
          />
        </View>

        {/* Histórico */}
        <SectionTitle style={{ marginTop: 4 }}>
          HISTÓRICO DE INSPEÇÕES E MANUTENÇÕES
        </SectionTitle>

        {t.historico.length === 0 ? (
          <EmptyState
            icon="time-outline"
            titulo="Sem histórico ainda"
            descricao="Este trecho foi cadastrado recentemente. A primeira inspeção abre o histórico."
            acao="Registrar inspeção"
            onAcao={() => navigation.navigate("NovaInspecao", { trechoId: t.id })}
          />
        ) : (
          t.historico.map((h, i) => (
            <View key={`${h.data}-${i}`} style={styles.histItem}>
              <View style={styles.histLeft}>
                <View style={[styles.histDot, { backgroundColor: colors[h.status] || colors.gray }]} />
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
                  <Text style={styles.histData}>{formatarData(h.data)}</Text>
                </View>
                <Text style={styles.histObs}>{h.obs}</Text>
              </View>
            </View>
          ))
        )}

        {/* Ações */}
        <Button
          title={osAtiva ? "Ordem já aberta para este trecho" : "Abrir ordem de serviço"}
          icon="construct-outline"
          onPress={() => setModalAberto(true)}
          disabled={!!osAtiva}
          style={{ marginTop: 24 }}
        />
        <Button
          title="Registrar inspeção neste trecho"
          variant="outline"
          icon="camera-outline"
          onPress={() => navigation.navigate("NovaInspecao", { trechoId: t.id })}
          style={{ marginTop: 10 }}
        />

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal de abertura de OS */}
      <Modal
        visible={modalAberto}
        transparent
        animationType="slide"
        onRequestClose={() => !enviando && setModalAberto(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalRoot}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalTopo}>
              <Text style={styles.modalTitulo}>Abrir ordem de serviço</Text>
              <TouchableOpacity
                onPress={() => !enviando && setModalAberto(false)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons name="close" size={22} color={colors.gray} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              KM {t.km_inicio} – {t.km_fim} · {t.rodovia}
            </Text>

            <ScrollView style={{ maxHeight: 340 }} keyboardShouldPersistTaps="handled">
              <Text style={styles.campoLabel}>Prioridade</Text>
              <View style={styles.opcoesLinha}>
                {PRIORIDADES.map((p) => (
                  <TouchableOpacity
                    key={p.valor}
                    onPress={() => setPrioridade(p.valor)}
                    style={[styles.opcao, prioridade === p.valor && styles.opcaoAtiva]}
                  >
                    <Text
                      style={[
                        styles.opcaoTexto,
                        prioridade === p.valor && styles.opcaoTextoAtivo,
                      ]}
                    >
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.campoLabel}>Equipe</Text>
              {equipesDisponiveis.length === 0 ? (
                <View style={styles.semEquipe}>
                  <Ionicons name="people-outline" size={18} color={colors.atencao} />
                  <Text style={styles.semEquipeTexto}>
                    Nenhuma equipe disponível agora. A ordem entra na fila e é
                    atribuída assim que uma equipe liberar.
                  </Text>
                </View>
              ) : (
                equipesDisponiveis.map((e) => {
                  const ativo = (equipeId || equipesDisponiveis[0].id) === e.id;
                  return (
                    <TouchableOpacity
                      key={e.id}
                      onPress={() => setEquipeId(e.id)}
                      style={[styles.equipeItem, ativo && styles.equipeItemAtivo]}
                    >
                      <Ionicons
                        name={ativo ? "radio-button-on" : "radio-button-off"}
                        size={18}
                        color={ativo ? colors.primary : colors.gray}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.equipeNome}>{e.nome}</Text>
                        <Text style={styles.equipeSub}>
                          {e.responsavel} · base {e.base}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}

              <Text style={styles.campoLabel}>Descrição (opcional)</Text>
              <TextInput
                style={styles.textarea}
                value={descricao}
                onChangeText={setDescricao}
                placeholder="O que a equipe precisa executar neste trecho?"
                placeholderTextColor={colors.gray}
                multiline
              />
            </ScrollView>

            <Button
              title="Abrir ordem"
              onPress={confirmarAbertura}
              loading={enviando}
              style={{ marginTop: 16 }}
            />
            <Button
              title="Cancelar"
              variant="ghost"
              onPress={() => setModalAberto(false)}
              disabled={enviando}
              style={{ marginTop: 8 }}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  statusBanner: { borderLeftWidth: 5, gap: 12 },
  statusLinha: { flexDirection: "row", alignItems: "center", gap: 12 },
  statusTitulo: { fontSize: 15, fontWeight: "700", color: colors.text },
  statusSub: { fontSize: 13, color: colors.textSub, marginTop: 2 },
  osCard: { backgroundColor: colors.manutencaoSoft },
  osTopo: { flexDirection: "row", alignItems: "center", gap: 8 },
  osCodigo: { fontSize: 14, fontWeight: "800", color: colors.text, flex: 1 },
  osTexto: { fontSize: 12, color: colors.textSub, marginTop: 6 },
  anomaliaCard: {
    backgroundColor: colors.atencaoSoft,
    borderRadius: radius.md,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  anomaliaText: { fontSize: 13, color: "#E65100", flex: 1, lineHeight: 18 },
  okCard: {
    backgroundColor: colors.okSoft,
    borderRadius: radius.md,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  okText: { fontSize: 13, color: "#1B5E20", flex: 1 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 12 },
  infoItem: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 14,
    width: "47.5%",
    flexGrow: 1,
    ...shadow.card,
  },
  infoKey: { fontSize: 11, color: colors.textSub, marginBottom: 4, fontWeight: "600" },
  infoVal: { fontSize: 14, fontWeight: "700", color: colors.text },
  histItem: { flexDirection: "row", gap: 12 },
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
  histObs: { fontSize: 13, color: colors.textSub, lineHeight: 18 },

  modalRoot: { flex: 1, backgroundColor: colors.overlay, justifyContent: "flex-end" },
  modalCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 22,
    paddingBottom: 32,
  },
  modalTopo: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  modalTitulo: { fontSize: 18, fontWeight: "800", color: colors.text },
  modalSub: { fontSize: 13, color: colors.textSub, marginTop: 4, marginBottom: 8 },
  campoLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSub,
    letterSpacing: 0.6,
    marginTop: 16,
    marginBottom: 8,
  },
  opcoesLinha: { flexDirection: "row", gap: 8 },
  opcao: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.grayBorder,
    alignItems: "center",
  },
  opcaoAtiva: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  opcaoTexto: { fontSize: 13, fontWeight: "600", color: colors.textSub },
  opcaoTextoAtivo: { color: colors.primary },
  equipeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.grayBorder,
    marginBottom: 8,
  },
  equipeItemAtivo: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  equipeNome: { fontSize: 14, fontWeight: "700", color: colors.text },
  equipeSub: { fontSize: 12, color: colors.textSub },
  semEquipe: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: colors.atencaoSoft,
    padding: 12,
    borderRadius: radius.sm,
  },
  semEquipeTexto: { flex: 1, fontSize: 12, color: "#E65100", lineHeight: 17 },
  textarea: {
    borderWidth: 1.5,
    borderColor: colors.grayBorder,
    borderRadius: radius.sm,
    padding: 12,
    minHeight: 80,
    fontSize: 14,
    color: colors.text,
    textAlignVertical: "top",
  },
});
