import React, { createContext, useContext, useState, useCallback } from "react";
import { trechos as trechosInit, notificacoes as notifInit, dashboard as dashInit } from "../data/mockData";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [trechos, setTrechos] = useState(trechosInit);
  const [notificacoes, setNotificacoes] = useState(notifInit);
  const [dashboard, setDashboard] = useState(dashInit);
  const [trechoSelecionado, setTrechoSelecionado] = useState(null);

  // Simula acionamento de equipe de manutenção
  const acionarManutencao = useCallback((trechoId) => {
    setTrechos((prev) =>
      prev.map((t) => {
        if (t.id !== trechoId) return t;
        const novaEntrada = {
          data: new Date().toISOString().split("T")[0],
          tipo: "manutencao",
          status: t.status,
          obs: "Equipe acionada via app — aguardando intervenção",
        };
        return { ...t, historico: [novaEntrada, ...t.historico] };
      })
    );
    // Cria notificação de confirmação
    const trecho = trechos.find((t) => t.id === trechoId);
    if (trecho) {
      const nova = {
        id: `n${Date.now()}`,
        data: new Date().toLocaleDateString("pt-BR"),
        hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        tipo: "atencao",
        titulo: `KM ${trecho.km_inicio} - equipe acionada`,
        descricao: "Solicitação enviada com sucesso",
        trecho_id: trechoId,
        lida: false,
      };
      setNotificacoes((prev) => [nova, ...prev]);
    }
  }, [trechos]);

  const marcarNotificacaoLida = useCallback((id) => {
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
  }, []);

  const notifNaoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <AppContext.Provider
      value={{
        trechos,
        notificacoes,
        dashboard,
        trechoSelecionado,
        setTrechoSelecionado,
        acionarManutencao,
        marcarNotificacaoLida,
        notifNaoLidas,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
