// ============================================================
// mockData.js — Base de dados mockada do Grovia (Sprint 3)
// ------------------------------------------------------------
// A Sprint 3 amplia o mock da Sprint 2 para cobrir todos os
// cenários da solução:
//   • sucesso        → dados completos (abaixo)
//   • lista vazia    → services/mockApi.js, cenário "vazio"
//   • erro de rede   → services/mockApi.js, cenário "erro"
//   • fluxo alternativo → trechos em manutenção, ordens
//     canceladas, equipes indisponíveis, trecho sem histórico
// ============================================================

export const usuario = {
  id: "u001",
  nome: "Marcos Andrade",
  primeiro_nome: "Marcos",
  cargo: "Supervisor de Manutenção",
  matricula: "565776",
  regional: "Regional Oeste — SP",
  email: "marcos.andrade@motiva.com.br",
};

// Credenciais aceitas pelo login mockado (exibidas na própria tela)
export const credenciaisValidas = {
  matricula: "565776",
  senha: "grovia123",
};

export const trechos = [
  {
    id: "t001",
    km_inicio: 78,
    km_fim: 79,
    status: "critico",
    urgencia: 98,
    rodovia: "SP-280",
    ultima_inspecao: "2026-06-10",
    inspector: "Carlos M.",
    anomalia: "Placa obstruída — vegetação cobrindo sinalização",
    altura_vegetacao_cm: 142,
    crescimento_cm_semana: 11.4,
    coordenadas: { lat: -23.4928, lng: -47.4412 },
    foto_url: null,
    historico: [
      { data: "2026-06-10", tipo: "inspecao", status: "critico", obs: "Placa km 78 totalmente obstruída" },
      { data: "2026-05-20", tipo: "manutencao", status: "atencao", obs: "Poda realizada, vegetação voltou a crescer" },
      { data: "2026-04-15", tipo: "inspecao", status: "ok", obs: "Trecho sem ocorrências" },
    ],
  },
  {
    id: "t002",
    km_inicio: 45,
    km_fim: 46,
    status: "critico",
    urgencia: 91,
    rodovia: "SP-280",
    ultima_inspecao: "2026-06-12",
    inspector: "Ana R.",
    anomalia: "Taxa de crescimento 3x acima da média histórica",
    altura_vegetacao_cm: 128,
    crescimento_cm_semana: 15.2,
    coordenadas: { lat: -23.5131, lng: -47.2087 },
    foto_url: null,
    historico: [
      { data: "2026-06-12", tipo: "inspecao", status: "critico", obs: "Crescimento acelerado detectado — 3x acima da média" },
      { data: "2026-05-28", tipo: "inspecao", status: "atencao", obs: "Vegetação em crescimento" },
    ],
  },
  {
    id: "t003",
    km_inicio: 112,
    km_fim: 113,
    status: "manutencao",
    urgencia: 84,
    rodovia: "SP-280",
    ultima_inspecao: "2026-06-08",
    inspector: "Roberto S.",
    anomalia: "Vegetação invadindo acostamento — equipe em campo",
    altura_vegetacao_cm: 118,
    crescimento_cm_semana: 8.1,
    coordenadas: { lat: -23.4402, lng: -47.8815 },
    foto_url: null,
    historico: [
      { data: "2026-06-14", tipo: "manutencao", status: "manutencao", obs: "Equipe Alfa iniciou roçada mecanizada" },
      { data: "2026-06-08", tipo: "inspecao", status: "critico", obs: "Vegetação avançando sobre o acostamento" },
      { data: "2026-05-10", tipo: "manutencao", status: "ok", obs: "Poda preventiva realizada" },
    ],
  },
  {
    id: "t004",
    km_inicio: 23,
    km_fim: 24,
    status: "atencao",
    urgencia: 57,
    rodovia: "SP-280",
    ultima_inspecao: "2026-06-11",
    inspector: "Carlos M.",
    anomalia: "Vegetação lateral densa na pista sentido interior",
    altura_vegetacao_cm: 74,
    crescimento_cm_semana: 5.6,
    coordenadas: { lat: -23.5502, lng: -46.9331 },
    foto_url: null,
    historico: [
      { data: "2026-06-11", tipo: "inspecao", status: "atencao", obs: "Lateral esquerda com crescimento denso" },
      { data: "2026-06-01", tipo: "inspecao", status: "ok", obs: "Sem ocorrências" },
    ],
  },
  {
    id: "t005",
    km_inicio: 90,
    km_fim: 91,
    status: "atencao",
    urgencia: 48,
    rodovia: "SP-280",
    ultima_inspecao: "2026-06-09",
    inspector: "Ana R.",
    anomalia: "Crescimento moderado próximo à defensa metálica",
    altura_vegetacao_cm: 63,
    crescimento_cm_semana: 4.2,
    coordenadas: { lat: -23.4711, lng: -47.6002 },
    foto_url: null,
    historico: [
      { data: "2026-06-09", tipo: "inspecao", status: "atencao", obs: "Vegetação em nível médio" },
    ],
  },
  {
    id: "t006",
    km_inicio: 137,
    km_fim: 138,
    status: "atencao",
    urgencia: 41,
    rodovia: "SP-300",
    ultima_inspecao: "2026-06-07",
    inspector: "Juliana P.",
    anomalia: "Mureta parcialmente encoberta",
    altura_vegetacao_cm: 58,
    crescimento_cm_semana: 3.9,
    coordenadas: { lat: -23.1042, lng: -48.0021 },
    foto_url: null,
    historico: [
      { data: "2026-06-07", tipo: "inspecao", status: "atencao", obs: "Mureta encoberta em cerca de 40% da extensão" },
    ],
  },
  {
    id: "t007",
    km_inicio: 10,
    km_fim: 11,
    status: "ok",
    urgencia: 12,
    rodovia: "SP-280",
    ultima_inspecao: "2026-06-12",
    inspector: "Roberto S.",
    anomalia: null,
    altura_vegetacao_cm: 22,
    crescimento_cm_semana: 1.8,
    coordenadas: { lat: -23.5789, lng: -46.7401 },
    foto_url: null,
    historico: [
      { data: "2026-06-12", tipo: "inspecao", status: "ok", obs: "Trecho sem ocorrências" },
      { data: "2026-05-15", tipo: "manutencao", status: "ok", obs: "Poda de rotina realizada" },
    ],
  },
  {
    id: "t008",
    km_inicio: 33,
    km_fim: 34,
    status: "ok",
    urgencia: 8,
    rodovia: "SP-280",
    ultima_inspecao: "2026-06-10",
    inspector: "Ana R.",
    anomalia: null,
    altura_vegetacao_cm: 17,
    crescimento_cm_semana: 1.2,
    coordenadas: { lat: -23.5388, lng: -46.8544 },
    foto_url: null,
    historico: [
      { data: "2026-06-10", tipo: "inspecao", status: "ok", obs: "Sem ocorrências" },
    ],
  },
  {
    id: "t009",
    km_inicio: 55,
    km_fim: 56,
    status: "ok",
    urgencia: 5,
    rodovia: "SP-280",
    ultima_inspecao: "2026-06-11",
    inspector: "Carlos M.",
    anomalia: null,
    altura_vegetacao_cm: 14,
    crescimento_cm_semana: 0.9,
    coordenadas: { lat: -23.5010, lng: -47.1188 },
    foto_url: null,
    historico: [
      { data: "2026-06-11", tipo: "inspecao", status: "ok", obs: "Vegetação baixa, sem ocorrências" },
    ],
  },
  {
    // Fluxo alternativo: trecho recém-cadastrado, ainda sem histórico.
    // Exercita o estado vazio dentro da tela de detalhe.
    id: "t010",
    km_inicio: 164,
    km_fim: 165,
    status: "ok",
    urgencia: 3,
    rodovia: "SP-300",
    ultima_inspecao: null,
    inspector: null,
    anomalia: null,
    altura_vegetacao_cm: null,
    crescimento_cm_semana: null,
    coordenadas: { lat: -22.9876, lng: -48.2210 },
    foto_url: null,
    historico: [],
  },
];

export const equipes = [
  { id: "e001", nome: "Equipe Alfa", responsavel: "Carlos Menezes", disponivel: false, base: "Sorocaba" },
  { id: "e002", nome: "Equipe Bravo", responsavel: "Ana Ribeiro", disponivel: true, base: "Itu" },
  { id: "e003", nome: "Equipe Charlie", responsavel: "Roberto Souza", disponivel: true, base: "São Roque" },
  { id: "e004", nome: "Equipe Delta", responsavel: "Juliana Pires", disponivel: false, base: "Botucatu" },
];

export const ordens = [
  {
    id: "o001",
    codigo: "OS-2026-0148",
    trecho_id: "t003",
    status: "em_andamento",
    prioridade: "alta",
    equipe_id: "e001",
    abertura: "2026-06-13",
    previsao: "2026-06-16",
    conclusao: null,
    descricao: "Roçada mecanizada em ambas as laterais e limpeza do acostamento.",
  },
  {
    id: "o002",
    codigo: "OS-2026-0147",
    trecho_id: "t001",
    status: "aberta",
    prioridade: "alta",
    equipe_id: "e002",
    abertura: "2026-06-13",
    previsao: "2026-06-17",
    conclusao: null,
    descricao: "Liberação urgente da placa de sinalização no km 78.",
  },
  {
    id: "o003",
    codigo: "OS-2026-0139",
    trecho_id: "t007",
    status: "concluida",
    prioridade: "baixa",
    equipe_id: "e003",
    abertura: "2026-05-14",
    previsao: "2026-05-16",
    conclusao: "2026-05-15",
    descricao: "Poda de rotina programada.",
  },
  {
    // Fluxo alternativo: ordem cancelada
    id: "o004",
    codigo: "OS-2026-0132",
    trecho_id: "t005",
    status: "cancelada",
    prioridade: "media",
    equipe_id: "e004",
    abertura: "2026-05-02",
    previsao: "2026-05-06",
    conclusao: null,
    descricao: "Cancelada — trecho reavaliado e reclassificado como atenção.",
  },
];

export const notificacoes = [
  {
    id: "n001",
    data: "2026-06-13",
    hora: "09:32",
    tipo: "critico",
    titulo: "KM 78 — placa obstruída",
    descricao: "Vegetação cobrindo sinalização vertical",
    trecho_id: "t001",
    lida: false,
  },
  {
    id: "n002",
    data: "2026-06-13",
    hora: "07:15",
    tipo: "critico",
    titulo: "KM 45 — crescimento acelerado",
    descricao: "Taxa de crescimento 3x acima do esperado",
    trecho_id: "t002",
    lida: false,
  },
  {
    id: "n003",
    data: "2026-06-13",
    hora: "06:40",
    tipo: "manutencao",
    titulo: "OS-2026-0148 em andamento",
    descricao: "Equipe Alfa chegou ao km 112",
    trecho_id: "t003",
    lida: false,
  },
  {
    id: "n004",
    data: "2026-06-12",
    hora: "11:20",
    tipo: "ok",
    titulo: "KM 23 — inspeção concluída",
    descricao: "Trecho reclassificado para atenção",
    trecho_id: "t004",
    lida: true,
  },
  {
    id: "n005",
    data: "2026-06-11",
    hora: "14:00",
    tipo: "atencao",
    titulo: "KM 137 — mureta encoberta",
    descricao: "Monitorar nas próximas 48h",
    trecho_id: "t006",
    lida: true,
  },
  {
    id: "n006",
    data: "2026-06-10",
    hora: "08:05",
    tipo: "ok",
    titulo: "OS-2026-0139 concluída",
    descricao: "Poda de rotina finalizada no km 10",
    trecho_id: "t007",
    lida: true,
  },
];

// Data de referência do mock: permite que a tela de notificações
// agrupe "Hoje / Ontem / Anteriores" de forma estável na demonstração.
export const dataReferencia = "2026-06-13";

export const statusColors = {
  critico: "#E53935",
  atencao: "#FB8C00",
  ok: "#43A047",
  manutencao: "#1E88E5",
};

export const statusLabels = {
  critico: "Crítico",
  atencao: "Atenção",
  ok: "OK",
  manutencao: "Em manutenção",
};

export const prioridadeLabels = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};
