import React from "react";
import { View, Text, ScrollView, Switch, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import Card from "../components/Card";
import Button from "../components/Button";
import SectionTitle from "../components/SectionTitle";
import { colors, radius } from "../styles/theme";
import { useApp } from "../context/AppContext";

const CENARIOS = [
  {
    chave: "erroLeitura",
    titulo: "Simular falha de rede",
    descricao: "As telas de dados passam a exibir o estado de erro com opção de tentar novamente.",
  },
  {
    chave: "listaVazia",
    titulo: "Simular base vazia",
    descricao: "As listas voltam sem registros, exercitando os estados de lista vazia.",
  },
  {
    chave: "falhaEscrita",
    titulo: "Simular falha ao salvar",
    descricao: "Abrir ordem, concluir ordem e registrar inspeção passam a falhar.",
  },
];

/**
 * Fluxo 10 — Perfil, cenários de teste e saída.
 * Os interruptores abaixo permitem demonstrar erro, vazio e falha de
 * escrita sem alterar código — usados no documento de testes manuais.
 */
export default function PerfilScreen() {
  const {
    usuario,
    dashboard,
    cenario,
    alternarCenario,
    restaurarDados,
    carregarDados,
    sair,
  } = useApp();

  function confirmarSaida() {
    Alert.alert("Sair do Grovia", "Você precisará entrar novamente. Deseja sair?", [
      { text: "Ficar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: sair },
    ]);
  }

  return (
    <View style={styles.root}>
      <Header subtitle="Sua conta" title="Perfil" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Card>
          <View style={styles.perfilLinha}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTexto}>
                {(usuario?.nome || "?")
                  .split(" ")
                  .slice(0, 2)
                  .map((p) => p[0])
                  .join("")}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{usuario?.nome || "Visitante"}</Text>
              <Text style={styles.cargo}>{usuario?.cargo}</Text>
              <Text style={styles.detalhe}>
                Matrícula {usuario?.matricula} · {usuario?.regional}
              </Text>
            </View>
          </View>
        </Card>

        <View style={styles.numeros}>
          <Numero valor={dashboard.total} label="Trechos" />
          <Numero valor={dashboard.ordensPendentes} label="OS abertas" />
          <Numero valor={`${dashboard.kmMonitorados} km`} label="Monitorados" />
        </View>

        <SectionTitle>CENÁRIOS DE TESTE</SectionTitle>
        <Text style={styles.explicacao}>
          Use os interruptores para reproduzir os cenários de erro e de lista
          vazia durante a demonstração. Eles afetam apenas a camada de mock.
        </Text>

        {CENARIOS.map((c) => (
          <Card key={c.chave}>
            <View style={styles.switchLinha}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitulo}>{c.titulo}</Text>
                <Text style={styles.switchDesc}>{c.descricao}</Text>
              </View>
              <Switch
                value={!!cenario[c.chave]}
                onValueChange={() => {
                  alternarCenario(c.chave);
                  if (c.chave !== "falhaEscrita") {
                    setTimeout(() => carregarDados(), 0);
                  }
                }}
                trackColor={{ false: colors.grayBorder, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          </Card>
        ))}

        <SectionTitle>DADOS</SectionTitle>
        <Card>
          <View style={styles.infoLinha}>
            <Ionicons name="save-outline" size={18} color={colors.primary} />
            <Text style={styles.infoTexto}>
              As alterações feitas no app ficam salvas no aparelho e voltam na
              próxima abertura.
            </Text>
          </View>
        </Card>

        <Button
          title="Restaurar dados de demonstração"
          variant="outline"
          icon="refresh"
          onPress={restaurarDados}
          style={{ marginTop: 6 }}
        />

        <Button
          title="Sair"
          variant="ghost"
          icon="log-out-outline"
          onPress={confirmarSaida}
          style={{ marginTop: 10 }}
        />

        <Text style={styles.versao}>Grovia · versão 3.0.0 (Sprint 3)</Text>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

function Numero({ valor, label }) {
  return (
    <View style={styles.numeroCard}>
      <Text style={styles.numeroValor}>{valor}</Text>
      <Text style={styles.numeroLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20 },
  perfilLinha: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTexto: { fontSize: 19, fontWeight: "800", color: colors.primary },
  nome: { fontSize: 17, fontWeight: "800", color: colors.text },
  cargo: { fontSize: 13, color: colors.primary, fontWeight: "600", marginTop: 2 },
  detalhe: { fontSize: 12, color: colors.textSub, marginTop: 4 },
  numeros: { flexDirection: "row", gap: 10, marginTop: 4 },
  numeroCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 14,
    alignItems: "center",
  },
  numeroValor: { fontSize: 18, fontWeight: "800", color: colors.text },
  numeroLabel: { fontSize: 11, color: colors.textSub, marginTop: 2 },
  explicacao: { fontSize: 12, color: colors.textSub, lineHeight: 18, marginBottom: 12 },
  switchLinha: { flexDirection: "row", alignItems: "center", gap: 14 },
  switchTitulo: { fontSize: 14, fontWeight: "700", color: colors.text },
  switchDesc: { fontSize: 12, color: colors.textSub, marginTop: 3, lineHeight: 17 },
  infoLinha: { flexDirection: "row", alignItems: "center", gap: 12 },
  infoTexto: { flex: 1, fontSize: 13, color: colors.textSub, lineHeight: 18 },
  versao: { textAlign: "center", fontSize: 12, color: colors.gray, marginTop: 24 },
});
