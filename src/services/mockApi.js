// ============================================================
// mockApi.js — Camada de acesso a dados (Sprint 3)
// ------------------------------------------------------------
// Toda a aplicação fala com esta camada, nunca com mockData
// diretamente. Quando a API real da Motiva estiver disponível
// (Sprint 4), basta trocar o corpo das funções por chamadas
// fetch/axios — a assinatura e os estados permanecem os mesmos.
//
// A camada simula:
//   • latência de rede
//   • respostas de erro (timeout / 500)
//   • listas vazias
//   • falha pontual em operações de escrita
// ============================================================

import {
  trechos as trechosSeed,
  notificacoes as notificacoesSeed,
  ordens as ordensSeed,
  equipes as equipesSeed,
  usuario as usuarioSeed,
  credenciaisValidas,
} from "../data/mockData";

const LATENCIA_MS = 650;

// Cenário ativo. Alterado pela tela Perfil → "Cenários de teste".
let cenario = {
  erroLeitura: false, // toda leitura falha
  listaVazia: false, // toda leitura devolve lista vazia
  falhaEscrita: false, // próxima escrita falha
};

export function getCenario() {
  return { ...cenario };
}

export function setCenario(parcial) {
  cenario = { ...cenario, ...parcial };
  return getCenario();
}

export class ApiError extends Error {
  constructor(mensagem, codigo = "ERRO_REDE") {
    super(mensagem);
    this.name = "ApiError";
    this.codigo = codigo;
  }
}

function esperar(ms = LATENCIA_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Clona para garantir que nenhuma tela mute o seed original
function clonar(valor) {
  return JSON.parse(JSON.stringify(valor));
}

async function leitura(dados) {
  await esperar();
  if (cenario.erroLeitura) {
    throw new ApiError(
      "Não foi possível conectar ao servidor da Motiva.",
      "ERRO_REDE"
    );
  }
  if (cenario.listaVazia && Array.isArray(dados)) {
    return [];
  }
  return clonar(dados);
}

async function escrita(executar) {
  await esperar(900);
  if (cenario.falhaEscrita) {
    throw new ApiError(
      "A solicitação não foi registrada. Verifique a conexão e tente novamente.",
      "ERRO_ESCRITA"
    );
  }
  return executar();
}

// ------------------------------------------------------------
// Autenticação
// ------------------------------------------------------------

export async function login(matricula, senha) {
  await esperar(800);
  if (!matricula || !senha) {
    throw new ApiError("Informe matrícula e senha.", "CAMPOS_OBRIGATORIOS");
  }
  if (
    matricula.trim() !== credenciaisValidas.matricula ||
    senha !== credenciaisValidas.senha
  ) {
    throw new ApiError("Matrícula ou senha incorreta.", "CREDENCIAL_INVALIDA");
  }
  return clonar(usuarioSeed);
}

// ------------------------------------------------------------
// Leituras
// ------------------------------------------------------------

export const listarTrechos = () => leitura(trechosSeed);
export const listarNotificacoes = () => leitura(notificacoesSeed);
export const listarOrdens = () => leitura(ordensSeed);
export const listarEquipes = () => leitura(equipesSeed);

// Carrega tudo de uma vez (usado no boot do app e no "puxar para atualizar")
export async function carregarTudo() {
  const [trechos, notificacoes, ordens, equipes] = await Promise.all([
    listarTrechos(),
    listarNotificacoes(),
    listarOrdens(),
    listarEquipes(),
  ]);
  return { trechos, notificacoes, ordens, equipes };
}

// ------------------------------------------------------------
// Escritas
// ------------------------------------------------------------

function proximoCodigoOS(ordensAtuais) {
  const numeros = ordensAtuais
    .map((o) => Number(String(o.codigo).split("-").pop()))
    .filter((n) => !Number.isNaN(n));
  const proximo = (numeros.length ? Math.max(...numeros) : 0) + 1;
  return `OS-2026-${String(proximo).padStart(4, "0")}`;
}

export async function abrirOrdem({ trecho, equipeId, prioridade, descricao, ordensAtuais }) {
  return escrita(() => {
    const hoje = new Date().toISOString().split("T")[0];
    const previsao = new Date(Date.now() + 3 * 864e5).toISOString().split("T")[0];
    return {
      id: `o${Date.now()}`,
      codigo: proximoCodigoOS(ordensAtuais),
      trecho_id: trecho.id,
      status: "aberta",
      prioridade,
      equipe_id: equipeId,
      abertura: hoje,
      previsao,
      conclusao: null,
      descricao:
        descricao?.trim() ||
        `Intervenção solicitada pelo app para o trecho KM ${trecho.km_inicio}–${trecho.km_fim}.`,
    };
  });
}

export async function atualizarStatusOrdem(ordem, novoStatus) {
  return escrita(() => ({
    ...ordem,
    status: novoStatus,
    conclusao:
      novoStatus === "concluida"
        ? new Date().toISOString().split("T")[0]
        : ordem.conclusao,
  }));
}

export async function registrarInspecao({ trecho, status, altura, observacao, coordenadas }) {
  return escrita(() => ({
    data: new Date().toISOString().split("T")[0],
    tipo: "inspecao",
    status,
    obs:
      observacao?.trim() ||
      `Inspeção registrada em campo. Altura medida: ${altura || "não informada"} cm.`,
    coordenadas: coordenadas || trecho.coordenadas,
    altura_vegetacao_cm: altura ? Number(altura) : trecho.altura_vegetacao_cm,
  }));
}

// Localização: tenta o GPS real e cai para a coordenada mockada do trecho.
export async function obterLocalizacao(trecho) {
  try {
    const Location = require("expo-location");
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") throw new Error("permissao negada");
    const pos = await Location.getCurrentPositionAsync({});
    return {
      lat: Number(pos.coords.latitude.toFixed(4)),
      lng: Number(pos.coords.longitude.toFixed(4)),
      origem: "gps",
    };
  } catch (e) {
    await esperar(400);
    return { ...trecho.coordenadas, origem: "mock" };
  }
}

export default {
  login,
  listarTrechos,
  listarNotificacoes,
  listarOrdens,
  listarEquipes,
  carregarTudo,
  abrirOrdem,
  atualizarStatusOrdem,
  registrarInspecao,
  obterLocalizacao,
  getCenario,
  setCenario,
  ApiError,
};
