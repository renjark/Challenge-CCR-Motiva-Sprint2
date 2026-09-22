// ============================================================
// theme.js — Tokens de design do Grovia
// Fonte única de verdade para cor, tipografia, espaçamento e raio.
// Nenhuma tela deve declarar cor "solta": sempre usar colors.*
// ============================================================

export const colors = {
  // Identidade
  primary: "#6B21E8",
  primaryDark: "#4C1A9E",
  primarySoft: "#F1E9FE",

  // Semântica de status dos trechos
  critico: "#E53935",
  criticoSoft: "#FDECEA",
  atencao: "#FB8C00",
  atencaoSoft: "#FFF3E0",
  ok: "#43A047",
  okSoft: "#E8F5E9",
  manutencao: "#1E88E5",
  manutencaoSoft: "#E3F2FD",

  // Neutros
  background: "#F5F5F5",
  white: "#FFFFFF",
  black: "#111111",
  gray: "#9E9E9E",
  grayLight: "#F0F0F0",
  grayBorder: "#E0E0E0",
  text: "#1A1A1A",
  textSub: "#666666",

  // Suporte
  mapa: "#2E7D32",
  overlay: "rgba(0,0,0,0.45)",
};

export const fonts = {
  regular: "System",
  bold: "System",
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 32,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const shadow = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sheet: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
  },
};

export const type = {
  h1: { fontSize: 24, fontWeight: "700", color: colors.text },
  h2: { fontSize: 18, fontWeight: "700", color: colors.text },
  h3: { fontSize: 15, fontWeight: "700", color: colors.text },
  body: { fontSize: 14, color: colors.text },
  sub: { fontSize: 13, color: colors.textSub },
  caption: { fontSize: 12, color: colors.textSub },
  section: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSub,
    letterSpacing: 0.8,
  },
};

// Rótulos por status de trecho
export const statusLabels = {
  critico: "Crítico",
  atencao: "Atenção",
  ok: "OK",
  manutencao: "Em manutenção",
};

// Rótulos e cores por status de ordem de serviço
export const ordemLabels = {
  aberta: "Aberta",
  em_andamento: "Em andamento",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

export const ordemColors = {
  aberta: colors.atencao,
  em_andamento: colors.manutencao,
  concluida: colors.ok,
  cancelada: colors.gray,
};

export default { colors, fonts, radius, spacing, shadow, type };
