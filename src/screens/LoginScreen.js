import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../components/Button";
import { colors, radius } from "../styles/theme";
import { useApp } from "../context/AppContext";
import { credenciaisValidas } from "../data/mockData";

/**
 * Fluxo 1 — Acesso do supervisor.
 * Cobre: sucesso, credencial inválida e validação de campos vazios.
 */
export default function LoginScreen() {
  const { entrar, entrando, erroLogin } = useApp();
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [erroCampo, setErroCampo] = useState({});

  async function handleEntrar() {
    const erros = {};
    if (!matricula.trim()) erros.matricula = "Informe sua matrícula.";
    if (!senha) erros.senha = "Informe sua senha.";
    setErroCampo(erros);
    if (Object.keys(erros).length) return;
    await entrar(matricula, senha);
  }

  function preencherDemo() {
    setMatricula(credenciaisValidas.matricula);
    setSenha(credenciaisValidas.senha);
    setErroCampo({});
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.marca}>
          <View style={styles.logo}>
            <Ionicons name="leaf" size={34} color={colors.white} />
          </View>
          <Text style={styles.nome}>Grovia</Text>
          <Text style={styles.tagline}>
            Gestão de vegetação nas rodovias da Motiva
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Matrícula</Text>
          <View style={[styles.inputWrap, erroCampo.matricula && styles.inputErro]}>
            <Ionicons name="person-outline" size={18} color={colors.gray} />
            <TextInput
              style={styles.input}
              value={matricula}
              onChangeText={(v) => {
                setMatricula(v);
                setErroCampo((e) => ({ ...e, matricula: null }));
              }}
              placeholder="Ex.: 565776"
              placeholderTextColor={colors.gray}
              keyboardType="number-pad"
              autoCapitalize="none"
            />
          </View>
          {erroCampo.matricula ? (
            <Text style={styles.msgErro}>{erroCampo.matricula}</Text>
          ) : null}

          <Text style={[styles.label, { marginTop: 18 }]}>Senha</Text>
          <View style={[styles.inputWrap, erroCampo.senha && styles.inputErro]}>
            <Ionicons name="lock-closed-outline" size={18} color={colors.gray} />
            <TextInput
              style={styles.input}
              value={senha}
              onChangeText={(v) => {
                setSenha(v);
                setErroCampo((e) => ({ ...e, senha: null }));
              }}
              placeholder="Sua senha"
              placeholderTextColor={colors.gray}
              secureTextEntry={!verSenha}
            />
            <TouchableOpacity
              onPress={() => setVerSenha((v) => !v)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={verSenha ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={colors.gray}
              />
            </TouchableOpacity>
          </View>
          {erroCampo.senha ? <Text style={styles.msgErro}>{erroCampo.senha}</Text> : null}

          {erroLogin ? (
            <View style={styles.banner}>
              <Ionicons name="alert-circle" size={18} color={colors.critico} />
              <Text style={styles.bannerTexto}>{erroLogin}</Text>
            </View>
          ) : null}

          <Button
            title="Entrar"
            onPress={handleEntrar}
            loading={entrando}
            style={{ marginTop: 24 }}
          />

          <TouchableOpacity onPress={preencherDemo} style={styles.demo}>
            <Text style={styles.demoTexto}>
              Preencher credenciais de demonstração
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.rodape}>
          Protótipo acadêmico · Challenge CCR Motiva · Sprint 3
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary },
  scroll: { flexGrow: 1, padding: 28, justifyContent: "center" },
  marca: { alignItems: "center", marginBottom: 36 },
  logo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  nome: { fontSize: 34, fontWeight: "800", color: colors.white, letterSpacing: -0.5 },
  tagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 6,
    textAlign: "center",
  },
  form: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 24,
  },
  label: { fontSize: 13, fontWeight: "700", color: colors.text, marginBottom: 8 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: colors.grayBorder,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 52,
    backgroundColor: colors.white,
  },
  inputErro: { borderColor: colors.critico },
  input: { flex: 1, fontSize: 15, color: colors.text },
  msgErro: { fontSize: 12, color: colors.critico, marginTop: 6 },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.criticoSoft,
    borderRadius: radius.sm,
    padding: 12,
    marginTop: 18,
  },
  bannerTexto: { flex: 1, fontSize: 13, color: colors.critico, fontWeight: "600" },
  demo: { alignSelf: "center", marginTop: 16, padding: 6 },
  demoTexto: { fontSize: 13, color: colors.primary, fontWeight: "700" },
  rodape: {
    textAlign: "center",
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 28,
  },
});
