import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../components/Header";
import Card from "../components/Card";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import { colors, radius, statusLabels } from "../styles/theme";
import { useApp } from "../context/AppContext";
import api from "../services/mockApi";

const CLASSIFICACOES = ["ok", "atencao", "critico"];

/**
 * Fluxo 6 — Registro de inspeção em campo.
 * Reúne trecho, classificação, medição, localização e foto.
 * Foto e GPS usam mock quando o dispositivo não libera o recurso.
 */
export default function NovaInspecaoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { trechos, registrarInspecao } = useApp();

  const [trechoId, setTrechoId] = useState(route.params?.trechoId || null);
  const [status, setStatus] = useState("atencao");
  const [altura, setAltura] = useState("");
  const [observacao, setObservacao] = useState("");
  const [coordenadas, setCoordenadas] = useState(null);
  const [buscandoGps, setBuscandoGps] = useState(false);
  const [foto, setFoto] = useState(null);
  const [capturando, setCapturando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroCampo, setErroCampo] = useState({});

  const trecho = useMemo(
    () => trechos.find((t) => t.id === trechoId) || null,
    [trechos, trechoId]
  );

  const listaTrechos = useMemo(
    () => [...trechos].sort((a, b) => a.km_inicio - b.km_inicio),
    [trechos]
  );

  async function capturarLocalizacao() {
    if (!trecho) return;
    setBuscandoGps(true);
    const c = await api.obterLocalizacao(trecho);
    setCoordenadas(c);
    setBuscandoGps(false);
  }

  async function capturarFoto() {
    setCapturando(true);
    // Sprint 3: captura simulada. A integração com expo-camera
    // entra na Sprint 4, junto com o upload para o backend.
    setTimeout(() => {
      setFoto({
        id: `f${Date.now()}`,
        rotulo: `Registro ${new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
      });
      setCapturando(false);
    }, 900);
  }

  async function salvar() {
    const erros = {};
    if (!trechoId) erros.trecho = "Escolha o trecho inspecionado.";
    if (altura && (Number.isNaN(Number(altura)) || Number(altura) < 0)) {
      erros.altura = "Informe a altura em centímetros, apenas números.";
    }
    if (status !== "ok" && !observacao.trim()) {
      erros.observacao = "Descreva a ocorrência para trechos fora do padrão.";
    }
    setErroCampo(erros);
    if (Object.keys(erros).length) return;

    setEnviando(true);
    const r = await registrarInspecao({
      trechoId,
      status,
      altura,
      observacao,
      coordenadas,
    });
    setEnviando(false);
    if (r.ok) navigation.goBack();
  }

  if (listaTrechos.length === 0) {
    return (
      <View style={styles.root}>
        <Header subtitle="Trabalho em campo" title="Nova inspeção" showBack showBell={false} />
        <EmptyState
          icon="map-outline"
          titulo="Nenhum trecho disponível"
          descricao="A base de trechos precisa estar sincronizada para registrar uma inspeção."
          acao="Voltar"
          onAcao={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Header subtitle="Trabalho em campo" title="Nova inspeção" showBack showBell={false} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Trecho */}
          <Text style={styles.label}>Trecho inspecionado</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            <View style={styles.chipsRow}>
              {listaTrechos.map((t) => {
                const ativo = t.id === trechoId;
                return (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => {
                      setTrechoId(t.id);
                      setCoordenadas(null);
                      setErroCampo((e) => ({ ...e, trecho: null }));
                    }}
                    style={[styles.chip, ativo && styles.chipAtivo]}
                  >
                    <StatusBadge status={t.status} size={8} />
                    <Text style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}>
                      KM {t.km_inicio}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          {erroCampo.trecho ? <Text style={styles.erro}>{erroCampo.trecho}</Text> : null}

          {trecho && (
            <Card style={styles.resumo}>
              <Text style={styles.resumoKm}>
                KM {trecho.km_inicio} – {trecho.km_fim} · {trecho.rodovia}
              </Text>
              <Text style={styles.resumoSub}>
                Classificação atual: {statusLabels[trecho.status]}
              </Text>
            </Card>
          )}

          {/* Classificação */}
          <Text style={styles.label}>Nova classificação</Text>
          <View style={styles.classifRow}>
            {CLASSIFICACOES.map((s) => {
              const ativo = status === s;
              return (
                <TouchableOpacity
                  key={s}
                  onPress={() => setStatus(s)}
                  style={[
                    styles.classif,
                    ativo && { borderColor: colors[s], backgroundColor: `${colors[s]}14` },
                  ]}
                >
                  <StatusBadge status={s} size={12} />
                  <Text style={[styles.classifTexto, ativo && { color: colors[s] }]}>
                    {statusLabels[s]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Medição */}
          <Text style={styles.label}>Altura da vegetação (cm)</Text>
          <TextInput
            style={[styles.input, erroCampo.altura && styles.inputErro]}
            value={altura}
            onChangeText={(v) => {
              setAltura(v);
              setErroCampo((e) => ({ ...e, altura: null }));
            }}
            placeholder="Ex.: 85"
            placeholderTextColor={colors.gray}
            keyboardType="number-pad"
          />
          {erroCampo.altura ? <Text style={styles.erro}>{erroCampo.altura}</Text> : null}

          {/* Observação */}
          <Text style={styles.label}>Observação</Text>
          <TextInput
            style={[styles.textarea, erroCampo.observacao && styles.inputErro]}
            value={observacao}
            onChangeText={(v) => {
              setObservacao(v);
              setErroCampo((e) => ({ ...e, observacao: null }));
            }}
            placeholder="O que você encontrou no trecho?"
            placeholderTextColor={colors.gray}
            multiline
          />
          {erroCampo.observacao ? <Text style={styles.erro}>{erroCampo.observacao}</Text> : null}

          {/* Localização */}
          <Text style={styles.label}>Localização</Text>
          <Card>
            {coordenadas ? (
              <View style={styles.gpsLinha}>
                <Ionicons name="location" size={20} color={colors.ok} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.gpsTexto}>
                    {coordenadas.lat}, {coordenadas.lng}
                  </Text>
                  <Text style={styles.gpsFonte}>
                    {coordenadas.origem === "gps"
                      ? "Obtida pelo GPS do aparelho"
                      : "Coordenada do trecho (GPS indisponível)"}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setCoordenadas(null)}>
                  <Ionicons name="close-circle" size={20} color={colors.gray} />
                </TouchableOpacity>
              </View>
            ) : (
              <Button
                title={buscandoGps ? "Obtendo localização" : "Usar minha localização"}
                variant="outline"
                icon="location-outline"
                loading={buscandoGps}
                disabled={!trecho}
                onPress={capturarLocalizacao}
              />
            )}
          </Card>

          {/* Foto */}
          <Text style={styles.label}>Registro fotográfico</Text>
          <Card>
            {foto ? (
              <View style={styles.fotoLinha}>
                <View style={styles.fotoThumb}>
                  <Ionicons name="image" size={26} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fotoNome}>{foto.rotulo}</Text>
                  <Text style={styles.fotoSub}>Anexada à inspeção</Text>
                </View>
                <TouchableOpacity onPress={() => setFoto(null)}>
                  <Ionicons name="trash-outline" size={20} color={colors.critico} />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Button
                  title={capturando ? "Capturando" : "Adicionar foto"}
                  variant="outline"
                  icon="camera-outline"
                  loading={capturando}
                  onPress={capturarFoto}
                />
                <Text style={styles.fotoAviso}>
                  Captura simulada nesta Sprint. A câmera real e o envio da imagem
                  entram na Sprint 4.
                </Text>
              </>
            )}
          </Card>

          <Button
            title="Salvar inspeção"
            icon="checkmark"
            onPress={salvar}
            loading={enviando}
            style={{ marginTop: 24 }}
          />
          <Button
            title="Descartar"
            variant="ghost"
            onPress={() => navigation.goBack()}
            disabled={enviando}
            style={{ marginTop: 10 }}
          />

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSub,
    letterSpacing: 0.6,
    marginTop: 20,
    marginBottom: 10,
  },
  chipsScroll: { marginHorizontal: -4 },
  chipsRow: { flexDirection: "row", gap: 8, paddingHorizontal: 4 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.grayBorder,
    backgroundColor: colors.white,
  },
  chipAtivo: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  chipTexto: { fontSize: 13, fontWeight: "600", color: colors.textSub },
  chipTextoAtivo: { color: colors.primary },
  resumo: { marginTop: 12 },
  resumoKm: { fontSize: 15, fontWeight: "700", color: colors.text },
  resumoSub: { fontSize: 12, color: colors.textSub, marginTop: 4 },
  classifRow: { flexDirection: "row", gap: 8 },
  classif: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.grayBorder,
    backgroundColor: colors.white,
  },
  classifTexto: { fontSize: 12, fontWeight: "700", color: colors.textSub },
  input: {
    borderWidth: 1.5,
    borderColor: colors.grayBorder,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 50,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.white,
  },
  textarea: {
    borderWidth: 1.5,
    borderColor: colors.grayBorder,
    borderRadius: radius.md,
    padding: 14,
    minHeight: 92,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.white,
    textAlignVertical: "top",
  },
  inputErro: { borderColor: colors.critico },
  erro: { fontSize: 12, color: colors.critico, marginTop: 6 },
  gpsLinha: { flexDirection: "row", alignItems: "center", gap: 12 },
  gpsTexto: { fontSize: 14, fontWeight: "700", color: colors.text },
  gpsFonte: { fontSize: 12, color: colors.textSub, marginTop: 2 },
  fotoLinha: { flexDirection: "row", alignItems: "center", gap: 12 },
  fotoThumb: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  fotoNome: { fontSize: 14, fontWeight: "700", color: colors.text },
  fotoSub: { fontSize: 12, color: colors.textSub, marginTop: 2 },
  fotoAviso: { fontSize: 11, color: colors.gray, marginTop: 10, lineHeight: 16 },
});
