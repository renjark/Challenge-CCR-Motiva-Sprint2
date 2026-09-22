// ============================================================
// AppContext.js — Estado global do Grovia (Sprint 3)
// ------------------------------------------------------------
// Centraliza dados, estados de carregamento/erro, persistência
// local e todas as ações de escrita. As telas só consomem o
// hook useApp() — nenhuma tela conhece mockApi ou AsyncStorage.
// ============================================================

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import api from "../services/mockApi";
import storage, { CHAVES } from "../services/storage";
import { dataReferencia } from "../data/mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // --- sessão -------------------------------------------------
  const [usuario, setUsuario] = useState(null);
  const [bootPronto, setBootPronto] = useState(false);
  const [entrando, setEntrando] = useState(false);
  const [erroLogin, setErroLogin] = useState(null);

  // --- dados --------------------------------------------------
  const [trechos, setTrechos] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const [ordens, setOrdens] = useState([]);
  const [equipes, setEquipes] = useState([]);

  // --- estados de tela ---------------------------------------
  const [carregando, setCarregando] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(null);
  const [toast, setToast] = useState(null);

  // --- seleção e filtros --------------------------------------
  const [trechoSelecionadoId, setTrechoSelecionadoId] = useState(null);
  const [ordemSelecionadaId, setOrdemSelecionadaId] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroOrdem, setFiltroOrdem] = useState("todos");

  // --- cenários de teste --------------------------------------
  const [cenario, setCenarioState] = useState(api.getCenario());

  const hidratado = useRef(false);
  const toastTimer = useRef(null);

  // ----------------------------------------------------------
  // Toast
  // ----------------------------------------------------------
  const mostrarToast = useCallback((mensagem, tipo = "ok") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ mensagem, tipo, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const fecharToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(null);
  }, []);

  useEffect(() => () => toastTimer.current && clearTimeout(toastTimer.current), []);

  // ----------------------------------------------------------
  // Carregamento de dados
  // ----------------------------------------------------------
  const carregarDados = useCallback(
    async ({ silencioso = false } = {}) => {
      if (silencioso) setAtualizando(true);
      else setCarregando(true);
      setErro(null);
      try {
        const dados = await api.carregarTudo();
        setTrechos(dados.trechos);
        setNotificacoes(dados.notificacoes);
        setOrdens(dados.ordens);
        setEquipes(dados.equipes);
        await storage.salvar(CHAVES.ESTADO, dados);
      } catch (e) {
        setErro(e?.message || "Falha ao carregar os dados.");
      } finally {
        setCarregando(false);
        setAtualizando(false);
      }
    },
    []
  );

  // Hidrata a sessão salva ao abrir o app
  useEffect(() => {
    (async () => {
      const sessao = await storage.ler(CHAVES.SESSAO);
      if (sessao) {
        setUsuario(sessao);
        carregarDados();
      }
      hidratado.current = true;
      setBootPronto(true);
    })();
  }, [carregarDados]);

  // Persiste o estado sempre que os dados mudam
  useEffect(() => {
    if (!hidratado.current || !usuario) return;
    storage.salvar(CHAVES.ESTADO, { trechos, notificacoes, ordens, equipes });
  }, [trechos, notificacoes, ordens, equipes, usuario]);

  // ----------------------------------------------------------
  // Autenticação
  // ----------------------------------------------------------
  const entrar = useCallback(
    async (matricula, senha) => {
      setEntrando(true);
      setErroLogin(null);
      try {
        const u = await api.login(matricula, senha);
        setUsuario(u);
        await storage.salvar(CHAVES.SESSAO, u);
        await carregarDados();
        return true;
      } catch (e) {
        setErroLogin(e?.message || "Não foi possível entrar.");
        return false;
      } finally {
        setEntrando(false);
      }
    },
    [carregarDados]
  );

  const sair = useCallback(async () => {
    setUsuario(null);
    setTrechos([]);
    setNotificacoes([]);
    setOrdens([]);
    setEquipes([]);
    setTrechoSelecionadoId(null);
    setOrdemSelecionadaId(null);
    await storage.limparTudo();
  }, []);

  // ----------------------------------------------------------
  // Ações de escrita
  // ----------------------------------------------------------
  const abrirOrdem = useCallback(
    async ({ trechoId, equipeId, prioridade = "alta", descricao = "" }) => {
      const trecho = trechos.find((t) => t.id === trechoId);
      if (!trecho) {
        mostrarToast("Trecho não encontrado.", "erro");
        return { ok: false };
      }
      const jaAberta = ordens.find(
        (o) =>
          o.trecho_id === trechoId &&
          (o.status === "aberta" || o.status === "em_andamento")
      );
      if (jaAberta) {
        // Fluxo alternativo: já existe OS ativa para o trecho
        mostrarToast(`Já existe a ordem ${jaAberta.codigo} em aberto.`, "atencao");
        return { ok: false, duplicada: jaAberta };
      }
      try {
        const nova = await api.abrirOrdem({
          trecho,
          equipeId,
          prioridade,
          descricao,
          ordensAtuais: ordens,
        });
        setOrdens((prev) => [nova, ...prev]);
        setTrechos((prev) =>
          prev.map((t) =>
            t.id !== trechoId
              ? t
              : {
                  ...t,
                  status: "manutencao",
                  historico: [
                    {
                      data: nova.abertura,
                      tipo: "manutencao",
                      status: "manutencao",
                      obs: `Ordem ${nova.codigo} aberta pelo app — aguardando equipe.`,
                    },
                    ...t.historico,
                  ],
                }
          )
        );
        setNotificacoes((prev) => [
          {
            id: `n${Date.now()}`,
            data: new Date().toISOString().split("T")[0],
            hora: new Date().toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            tipo: "manutencao",
            titulo: `${nova.codigo} aberta`,
            descricao: `Equipe acionada para o KM ${trecho.km_inicio}–${trecho.km_fim}`,
            trecho_id: trechoId,
            lida: false,
          },
          ...prev,
        ]);
        mostrarToast(`Ordem ${nova.codigo} aberta.`, "ok");
        return { ok: true, ordem: nova };
      } catch (e) {
        mostrarToast(e?.message || "Não foi possível abrir a ordem.", "erro");
        return { ok: false, erro: e?.message };
      }
    },
    [trechos, ordens, mostrarToast]
  );

  const mudarStatusOrdem = useCallback(
    async (ordemId, novoStatus) => {
      const ordem = ordens.find((o) => o.id === ordemId);
      if (!ordem) return { ok: false };
      try {
        const atualizada = await api.atualizarStatusOrdem(ordem, novoStatus);
        setOrdens((prev) => prev.map((o) => (o.id === ordemId ? atualizada : o)));

        if (novoStatus === "concluida" || novoStatus === "cancelada") {
          setTrechos((prev) =>
            prev.map((t) =>
              t.id !== ordem.trecho_id
                ? t
                : {
                    ...t,
                    status: novoStatus === "concluida" ? "ok" : "atencao",
                    urgencia: novoStatus === "concluida" ? 6 : t.urgencia,
                    anomalia: novoStatus === "concluida" ? null : t.anomalia,
                    ultima_inspecao:
                      novoStatus === "concluida"
                        ? new Date().toISOString().split("T")[0]
                        : t.ultima_inspecao,
                    historico: [
                      {
                        data: new Date().toISOString().split("T")[0],
                        tipo: "manutencao",
                        status: novoStatus === "concluida" ? "ok" : "atencao",
                        obs:
                          novoStatus === "concluida"
                            ? `Ordem ${ordem.codigo} concluída — vegetação regularizada.`
                            : `Ordem ${ordem.codigo} cancelada — trecho devolvido ao monitoramento.`,
                      },
                      ...t.historico,
                    ],
                  }
            )
          );
        }
        mostrarToast(
          novoStatus === "concluida"
            ? `Ordem ${ordem.codigo} concluída.`
            : novoStatus === "cancelada"
            ? `Ordem ${ordem.codigo} cancelada.`
            : `Ordem ${ordem.codigo} em andamento.`,
          novoStatus === "cancelada" ? "atencao" : "ok"
        );
        return { ok: true };
      } catch (e) {
        mostrarToast(e?.message || "Não foi possível atualizar a ordem.", "erro");
        return { ok: false, erro: e?.message };
      }
    },
    [ordens, mostrarToast]
  );

  const registrarInspecao = useCallback(
    async ({ trechoId, status, altura, observacao, coordenadas }) => {
      const trecho = trechos.find((t) => t.id === trechoId);
      if (!trecho) return { ok: false };
      try {
        const entrada = await api.registrarInspecao({
          trecho,
          status,
          altura,
          observacao,
          coordenadas,
        });
        const urgenciaPorStatus = { critico: 92, atencao: 55, ok: 10 };
        setTrechos((prev) =>
          prev.map((t) =>
            t.id !== trechoId
              ? t
              : {
                  ...t,
                  status,
                  urgencia: urgenciaPorStatus[status] ?? t.urgencia,
                  ultima_inspecao: entrada.data,
                  inspector: usuario?.nome?.split(" ")[0] || "App",
                  altura_vegetacao_cm: entrada.altura_vegetacao_cm,
                  anomalia: status === "ok" ? null : observacao?.trim() || t.anomalia,
                  historico: [entrada, ...t.historico],
                }
          )
        );
        setNotificacoes((prev) => [
          {
            id: `n${Date.now()}`,
            data: entrada.data,
            hora: new Date().toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            tipo: status,
            titulo: `KM ${trecho.km_inicio} — inspeção registrada`,
            descricao: `Trecho classificado como ${
              { critico: "crítico", atencao: "atenção", ok: "OK" }[status]
            }`,
            trecho_id: trechoId,
            lida: false,
          },
          ...prev,
        ]);
        mostrarToast("Inspeção registrada.", "ok");
        return { ok: true };
      } catch (e) {
        mostrarToast(e?.message || "Não foi possível registrar a inspeção.", "erro");
        return { ok: false, erro: e?.message };
      }
    },
    [trechos, usuario, mostrarToast]
  );

  const marcarNotificacaoLida = useCallback((id) => {
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
  }, []);

  const marcarTodasLidas = useCallback(() => {
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
  }, []);

  const limparNotificacoes = useCallback(() => {
    setNotificacoes([]);
    mostrarToast("Notificações limpas.", "ok");
  }, [mostrarToast]);

  // ----------------------------------------------------------
  // Cenários de teste
  // ----------------------------------------------------------
  const alternarCenario = useCallback(
    (chave) => {
      const atual = api.getCenario();
      const novo = api.setCenario({ [chave]: !atual[chave] });
      setCenarioState(novo);
      return novo;
    },
    []
  );

  const restaurarDados = useCallback(async () => {
    api.setCenario({ erroLeitura: false, listaVazia: false, falhaEscrita: false });
    setCenarioState(api.getCenario());
    await storage.remover(CHAVES.ESTADO);
    await carregarDados();
    mostrarToast("Dados de demonstração restaurados.", "ok");
  }, [carregarDados, mostrarToast]);

  // ----------------------------------------------------------
  // Derivados
  // ----------------------------------------------------------
  const dashboard = useMemo(() => {
    const conta = (s) => trechos.filter((t) => t.status === s).length;
    const pendentes = ordens.filter(
      (o) => o.status === "aberta" || o.status === "em_andamento"
    ).length;
    const concluidas = ordens
      .filter((o) => o.status === "concluida" && o.conclusao)
      .sort((a, b) => (a.conclusao < b.conclusao ? 1 : -1));
    return {
      total: trechos.length,
      criticos: conta("critico"),
      atencao: conta("atencao"),
      ok: conta("ok"),
      emManutencao: conta("manutencao"),
      ordensPendentes: pendentes,
      ultimaManutencao: concluidas[0]?.conclusao || null,
      kmMonitorados: trechos.reduce((s, t) => s + (t.km_fim - t.km_inicio), 0),
    };
  }, [trechos, ordens]);

  const notifNaoLidas = useMemo(
    () => notificacoes.filter((n) => !n.lida).length,
    [notificacoes]
  );

  const trechoSelecionado = useMemo(
    () => trechos.find((t) => t.id === trechoSelecionadoId) || null,
    [trechos, trechoSelecionadoId]
  );

  const ordemSelecionada = useMemo(
    () => ordens.find((o) => o.id === ordemSelecionadaId) || null,
    [ordens, ordemSelecionadaId]
  );

  const trechosFiltrados = useMemo(() => {
    const base = [...trechos].sort((a, b) => a.km_inicio - b.km_inicio);
    return filtroStatus === "todos"
      ? base
      : base.filter((t) => t.status === filtroStatus);
  }, [trechos, filtroStatus]);

  const ranking = useMemo(
    () => [...trechos].sort((a, b) => b.urgencia - a.urgencia),
    [trechos]
  );

  const ordensFiltradas = useMemo(() => {
    const base = [...ordens].sort((a, b) => (a.abertura < b.abertura ? 1 : -1));
    return filtroOrdem === "todos"
      ? base
      : base.filter((o) => o.status === filtroOrdem);
  }, [ordens, filtroOrdem]);

  const buscarTrecho = useCallback(
    (id) => trechos.find((t) => t.id === id) || null,
    [trechos]
  );

  const buscarEquipe = useCallback(
    (id) => equipes.find((e) => e.id === id) || null,
    [equipes]
  );

  const ordemAtivaDoTrecho = useCallback(
    (trechoId) =>
      ordens.find(
        (o) =>
          o.trecho_id === trechoId &&
          (o.status === "aberta" || o.status === "em_andamento")
      ) || null,
    [ordens]
  );

  const valor = {
    // sessão
    usuario,
    bootPronto,
    entrando,
    erroLogin,
    entrar,
    sair,
    // dados
    trechos,
    notificacoes,
    ordens,
    equipes,
    dashboard,
    dataReferencia,
    // estados
    carregando,
    atualizando,
    erro,
    toast,
    mostrarToast,
    fecharToast,
    carregarDados,
    // seleção e filtros
    trechoSelecionado,
    ordemSelecionada,
    selecionarTrecho: setTrechoSelecionadoId,
    selecionarOrdem: setOrdemSelecionadaId,
    filtroStatus,
    setFiltroStatus,
    filtroOrdem,
    setFiltroOrdem,
    trechosFiltrados,
    ordensFiltradas,
    ranking,
    // ações
    abrirOrdem,
    mudarStatusOrdem,
    registrarInspecao,
    marcarNotificacaoLida,
    marcarTodasLidas,
    limparNotificacoes,
    notifNaoLidas,
    // utilitários
    buscarTrecho,
    buscarEquipe,
    ordemAtivaDoTrecho,
    // cenários
    cenario,
    alternarCenario,
    restaurarDados,
  };

  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp precisa estar dentro de <AppProvider>");
  return ctx;
}

export default AppContext;
